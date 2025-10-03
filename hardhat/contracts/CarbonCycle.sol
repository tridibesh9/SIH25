// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CarbonMarketplace {
    // --- Reentrancy Guard ---
    uint256 private unlocked = 1;
    modifier nonReentrant() {
        require(unlocked == 1, "Reentrant call");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    struct Project {
        uint32 projectId;
        string externalId;
        string projectName;
        string documentCID;
        string certificateCID;
        uint256 valuePerCarbon;
        uint256 quantity;
        address ownerAddress;
        uint256 createdAt;
        bool isResold;
        uint32 status; // 0: ForSale, 1: Owned, 2: Retired
        uint256 marketplaceIndex;
    }

    uint32 public nextProjectId = 1;
    mapping(uint256 => Project) public projects;

    mapping(address => uint256[]) public ownedProjects;
    mapping(address => uint256[]) public listedProjects;
    mapping(address => uint256[]) public retiredProjects;
    uint256[] public marketplace;

    // --- Modifiers ---
    modifier projectIsForSale(uint256 _projectId) {
        require(projects[_projectId].status == 0, "Project not for sale");
        _;
    }
    modifier quantityInLimit(uint256 _projectId, uint256 _quantity) {
        require(_quantity > 0 && _quantity <= projects[_projectId].quantity, "Invalid quantity");
        _;
    }
    modifier costMatches(uint256 _projectId, uint256 _quantity) {
        uint256 totalPrice = projects[_projectId].valuePerCarbon * _quantity;
        require(msg.value == totalPrice, "Incorrect payment");
        _;
    }
    modifier notOwner(uint256 _projectId) {
        require(msg.sender != projects[_projectId].ownerAddress, "Owner cannot buy own project");
        _;
    }

    // --- Public & External Functions ---
    function registerProject(
        string memory _externalId,
        string memory _projectName,
        string memory _documentCID,
        uint256 _valuePerCarbon,
        uint256 _quantity
    ) external {
        require(_valuePerCarbon > 0, "Value must be greater than 0");
        require(_quantity > 0, "Quantity must be greater than 0");

        uint256 projectId = _createForSaleProject(
            _externalId,
            _projectName,
            _documentCID,
            _valuePerCarbon,
            _quantity,
            msg.sender,
            block.timestamp,
            false
        );

        projects[projectId].marketplaceIndex = marketplace.length;
        marketplace.push(projectId);
        listedProjects[msg.sender].push(projectId);
    }

    function buyProject(uint256 _projectId, uint256 _quantity)
        external
        payable
        nonReentrant
        projectIsForSale(_projectId)
        quantityInLimit(_projectId, _quantity)
        costMatches(_projectId, _quantity)
        notOwner(_projectId)
    {
        Project storage forSaleProject = projects[_projectId];
        forSaleProject.quantity -= _quantity;

        if (forSaleProject.quantity == 0) {
            _removeFromMarketplace(_projectId);
            _removeFromListedProjects(forSaleProject.ownerAddress, _projectId);
        }
        
        // **FIXED**: This line is now active, creating the project for the buyer.
        _createOwnedProject(forSaleProject, msg.sender, _quantity);

        (bool success, ) = forSaleProject.ownerAddress.call{value: msg.value}("");
        require(success, "Failed to send Ether");
    }

    function resellProject(
        uint256 _ownedProjectId,
        uint256 _quantity,
        uint256 _newValuePerCarbon,
        string memory _newExternalId
    ) external {
        require(
            _ownsProject(_ownedProjectId, msg.sender) && projects[_ownedProjectId].status == 1,
            "Not owner of this owned project"
        );
        require(_quantity > 0 && _quantity <= projects[_ownedProjectId].quantity, "Invalid quantity");
        require(_newValuePerCarbon > 0, "Invalid price");

        Project storage ownedProject = projects[_ownedProjectId];
        ownedProject.quantity -= _quantity;

        uint256 newForSaleProjectId = _createForSaleProject(
            _newExternalId,
            ownedProject.projectName,
            ownedProject.documentCID,
            _newValuePerCarbon,
            _quantity,
            msg.sender,
            ownedProject.createdAt,
            true
        );

        projects[newForSaleProjectId].marketplaceIndex = marketplace.length;
        marketplace.push(newForSaleProjectId);
        listedProjects[msg.sender].push(newForSaleProjectId);

        if (ownedProject.quantity == 0) {
            _removeFromOwnedProjects(msg.sender, _ownedProjectId);
            delete projects[_ownedProjectId];
        }
    }

    function retireProject(uint256 _ownedProjectId, uint256 _quantity) external {
        require(
            _ownsProject(_ownedProjectId, msg.sender) && projects[_ownedProjectId].status == 1,
            "Not owner of this owned project"
        );
        require(_quantity > 0 && _quantity <= projects[_ownedProjectId].quantity, "Insufficient or invalid quantity");

        Project storage ownedProject = projects[_ownedProjectId];
        ownedProject.quantity -= _quantity;

        uint256 newRetiredProjectId = _createRetiredProject(ownedProject, msg.sender, _quantity);
        retiredProjects[msg.sender].push(newRetiredProjectId);

        if (ownedProject.quantity == 0) {
            _removeFromOwnedProjects(msg.sender, _ownedProjectId);
            delete projects[_ownedProjectId];
        }
    }

    function addRetirementCertificate(uint256 _retiredProjectId, string memory _certificateCID) external {
        Project storage retiredProject = projects[_retiredProjectId];
        require(retiredProject.status == 2, "Project is not retired");
        require(retiredProject.ownerAddress == msg.sender, "You are not the owner");
        require(bytes(retiredProject.certificateCID).length == 0, "Certificate already added");
        retiredProject.certificateCID = _certificateCID;
    }

    // --- View Functions ---
    function getMarketplace() external view returns (Project[] memory) { return _getProjectsArray(marketplace); }
    function getListedProjects(address _seller) external view returns (Project[] memory) { return _getProjectsArray(listedProjects[_seller]); }
    function getOwnedProjects(address _owner) external view returns (Project[] memory) { return _getProjectsArray(ownedProjects[_owner]); }
    function getRetiredProjects(address _owner) external view returns (Project[] memory) { return _getProjectsArray(retiredProjects[_owner]); }

    // --- Internal Helper Functions ---
    function _createProject(Project memory _newProjectData) internal returns (uint32 newProjectId) {
        newProjectId = nextProjectId++;
        _newProjectData.projectId = newProjectId;
        projects[newProjectId] = _newProjectData;
    }

    function _createOwnedProject(Project storage _originalProject, address _buyer, uint256 _quantity) internal returns (uint256 newProjectId) {
        Project memory data = Project({
            projectId: 0,
            externalId: _originalProject.externalId,
            projectName: _originalProject.projectName,
            documentCID: _originalProject.documentCID,
            certificateCID: "",
            valuePerCarbon: 0,
            quantity: _quantity,
            ownerAddress: _buyer,
            createdAt: _originalProject.createdAt,
            isResold: _originalProject.isResold,
            status: 1, // Owned
            marketplaceIndex: 0
        });
        newProjectId = _createProject(data);
        ownedProjects[_buyer].push(newProjectId);
    }

    function _createRetiredProject(Project storage _originalProject, address _owner, uint256 _quantity) internal returns (uint256 newProjectId) {
        Project memory data = Project({
            projectId: 0,
            externalId: _originalProject.externalId,
            projectName: _originalProject.projectName,
            documentCID: _originalProject.documentCID,
            certificateCID: "",
            valuePerCarbon: 0,
            quantity: _quantity,
            ownerAddress: _owner,
            createdAt: _originalProject.createdAt,
            isResold: _originalProject.isResold,
            status: 2, // Retired
            marketplaceIndex: 0
        });
        newProjectId = _createProject(data);
    }

    function _createForSaleProject(
        string memory _externalId,
        string memory _projectName,
        string memory _documentCID,
        uint256 _valuePerCarbon,
        uint256 _quantity,
        address _owner,
        uint256 _createdAt,
        bool _isResold
    ) internal returns (uint256 newProjectId) {
        Project memory data = Project({
            projectId: 0,
            externalId: _externalId,
            projectName: _projectName,
            documentCID: _documentCID,
            certificateCID: "",
            valuePerCarbon: _valuePerCarbon,
            quantity: _quantity,
            ownerAddress: _owner,
            createdAt: _createdAt,
            isResold: _isResold,
            status: 0, // ForSale
            marketplaceIndex: 0
        });
        newProjectId = _createProject(data);
    }

    function _removeFromMarketplace(uint256 _projectId) internal {
        uint256 index = projects[_projectId].marketplaceIndex;
        uint256 lastIndex = marketplace.length - 1;
        if (index != lastIndex) {
            uint256 lastProjectId = marketplace[lastIndex];
            marketplace[index] = lastProjectId;
            projects[lastProjectId].marketplaceIndex = index;
        }
        marketplace.pop();
    }

    function _removeFromOwnedProjects(address _owner, uint256 _projectId) internal { _removeFromArray(ownedProjects[_owner], _projectId); }
    function _removeFromListedProjects(address _seller, uint256 _projectId) internal { _removeFromArray(listedProjects[_seller], _projectId); }

    function _removeFromArray(uint256[] storage _array, uint256 _projectId) internal {
        for (uint i = 0; i < _array.length; i++) {
            if (_array[i] == _projectId) {
                _array[i] = _array[_array.length - 1];
                _array.pop();
                break;
            }
        }
    }

    function _getProjectsArray(uint256[] memory _ids) internal view returns (Project[] memory) {
        Project[] memory items = new Project[](_ids.length);
        for (uint256 i = 0; i < _ids.length; i++) {
            items[i] = projects[_ids[i]];
        }
        return items;
    }

    function _ownsProject(uint256 _projectId, address _user) internal view returns (bool) {
        return projects[_projectId].ownerAddress == _user;
    }
}