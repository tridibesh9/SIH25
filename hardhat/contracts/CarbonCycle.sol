// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Import OpenZeppelin's ReentrancyGuard for security
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/security/ReentrancyGuard.sol";

contract CarbonMarketplace is ReentrancyGuard {
    enum ProjectStatus { ForSale, Owned, Retired }

    struct Project {
        uint256 projectId;
        string externalId;
        string projectName;
        string documentCID;
        string certificateCID;
        uint256 valuePerCarbon;
        uint256 quantity;
        string ownerName;
        address ownerAddress;
        uint256 createdAt;
        bool isResold;
        ProjectStatus status;
        uint256 marketplaceIndex;
    }

    uint256 public nextProjectId = 1;
    mapping(uint256 => Project) public projects;

    mapping(address => uint256[]) public ownedProjects;
    mapping(address => uint256[]) public listedProjects;
    mapping(address => uint256[]) public retiredProjects;
    uint256[] public marketplace;

    // --- Events ---
    event ProjectRegistered(uint256 indexed projectId, string externalId, string name, string documentCID, uint256 value, uint256 quantity, string ownerName, address indexed owner);
    event ProjectBought(uint256 indexed originalProjectId, uint256 indexed newOwnedProjectId, string externalId, address indexed buyer, uint256 quantity, uint256 totalPrice);
    event ProjectResold(uint256 indexed originalOwnedProjectId, uint256 indexed newForSaleProjectId, string externalId, address indexed seller, uint256 valuePerCarbon, uint256 quantity);
    event ProjectRetired(uint256 indexed originalOwnedProjectId, uint256 indexed newRetiredProjectId, address indexed owner, uint256 quantity);
    event CertificateAdded(uint256 indexed retiredProjectId, string certificateCID);

    // --- Modifiers ---
    modifier projectIsForSale(uint256 _projectId) { require(projects[_projectId].status == ProjectStatus.ForSale, "Project not for sale"); _; }
    modifier quantityInLimit(uint256 _projectId, uint256 _quantity) { require(_quantity > 0 && _quantity <= projects[_projectId].quantity, "Invalid quantity"); _; }
    modifier costMatches(uint256 _projectId, uint256 _quantity) { uint256 totalPrice = projects[_projectId].valuePerCarbon * _quantity; require(msg.value == totalPrice, "Incorrect payment"); _; }
    modifier notOwner(uint256 _projectId) { require(msg.sender != projects[_projectId].ownerAddress, "Owner cannot buy own project"); _; }

    // --- Public & External Functions ---

    function registerProject(
        string memory _externalId,
        string memory _projectName,
        string memory _documentCID,
        uint256 _valuePerCarbon,
        uint256 _quantity,
        string memory _ownerName
    ) external {
        require(_valuePerCarbon > 0, "Value must be greater than 0");
        require(_quantity > 0, "Quantity must be greater than 0");

        uint256 projectId = _createForSaleProject(_externalId, _projectName, _documentCID, _valuePerCarbon, _quantity, _ownerName, msg.sender, block.timestamp, false);
        
        projects[projectId].marketplaceIndex = marketplace.length;
        marketplace.push(projectId);
        listedProjects[msg.sender].push(projectId);

        emit ProjectRegistered(projectId, _externalId, _projectName, _documentCID, _valuePerCarbon, _quantity, _ownerName, msg.sender);
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
        
        uint256 newOwnedProjectId = _createOwnedProject(forSaleProject, msg.sender, _quantity);

        (bool success, ) = forSaleProject.ownerAddress.call{value: msg.value}("");
        require(success, "Failed to send Ether");

        emit ProjectBought(_projectId, newOwnedProjectId, forSaleProject.externalId, msg.sender, _quantity, msg.value);
    }
    
    function resellProject(
        uint256 _ownedProjectId,
        uint256 _quantity,
        uint256 _newValuePerCarbon,
        string memory _newExternalId,
        string memory _ownerName
    ) external {
        require(_ownsProject(_ownedProjectId, msg.sender) && projects[_ownedProjectId].status == ProjectStatus.Owned, "Not owner of this owned project");
        require(_quantity > 0 && _quantity <= projects[_ownedProjectId].quantity, "Invalid quantity");
        require(_newValuePerCarbon > 0, "Invalid price");

        Project storage ownedProject = projects[_ownedProjectId];
        ownedProject.quantity -= _quantity;

        uint256 newForSaleProjectId = _createForSaleProject(_newExternalId, ownedProject.projectName, ownedProject.documentCID, _newValuePerCarbon, _quantity, _ownerName, msg.sender, ownedProject.createdAt, true);
        
        projects[newForSaleProjectId].marketplaceIndex = marketplace.length;
        marketplace.push(newForSaleProjectId);
        listedProjects[msg.sender].push(newForSaleProjectId);
        
        if (ownedProject.quantity == 0) {
            _removeFromOwnedProjects(msg.sender, _ownedProjectId);
            delete projects[_ownedProjectId];
        }
        
        emit ProjectResold(_ownedProjectId, newForSaleProjectId, _newExternalId, msg.sender, _newValuePerCarbon, _quantity);
    }
    
    function retireProject(uint256 _ownedProjectId, uint256 _quantity) external {
        require(_ownsProject(_ownedProjectId, msg.sender) && projects[_ownedProjectId].status == ProjectStatus.Owned, "Not owner of this owned project");
        require(_quantity > 0 && _quantity <= projects[_ownedProjectId].quantity, "Insufficient or invalid quantity");

        Project storage ownedProject = projects[_ownedProjectId];
        ownedProject.quantity -= _quantity;

        uint256 newRetiredProjectId = _createRetiredProject(ownedProject, msg.sender, _quantity);
        retiredProjects[msg.sender].push(newRetiredProjectId);
        
        if (ownedProject.quantity == 0) {
            _removeFromOwnedProjects(msg.sender, _ownedProjectId);
            delete projects[_ownedProjectId];
        }

        emit ProjectRetired(_ownedProjectId, newRetiredProjectId, msg.sender, _quantity);
    }

    function addRetirementCertificate(uint256 _retiredProjectId, string memory _certificateCID) external {
        Project storage retiredProject = projects[_retiredProjectId];
        require(retiredProject.status == ProjectStatus.Retired, "Project is not retired");
        require(retiredProject.ownerAddress == msg.sender, "You are not the owner");
        require(bytes(retiredProject.certificateCID).length == 0, "Certificate already added");
        retiredProject.certificateCID = _certificateCID;
        emit CertificateAdded(_retiredProjectId, _certificateCID);
    }

    // --- View Functions ---
    function getMarketplace() external view returns (Project[] memory) { return _getProjectsArray(marketplace); }
    function getListedProjects(address _seller) external view returns (Project[] memory) { return _getProjectsArray(listedProjects[_seller]); }
    function getOwnedProjects(address _owner) external view returns (Project[] memory) { return _getProjectsArray(ownedProjects[_owner]); }
    function getRetiredProjects(address _owner) external view returns (Project[] memory) { return _getProjectsArray(retiredProjects[_owner]); }
    
    // --- Internal Helper Functions ---
    
    function _createProject(Project memory _newProjectData) internal returns (uint256 newProjectId) {
        newProjectId = nextProjectId++;
        _newProjectData.projectId = newProjectId;
        projects[newProjectId] = _newProjectData;
    }

    function _createOwnedProject(Project storage _originalProject, address _buyer, uint256 _quantity) internal returns (uint256 newProjectId) {
        Project memory data = Project({ projectId: 0, externalId: _originalProject.externalId, projectName: _originalProject.projectName, documentCID: _originalProject.documentCID, certificateCID: "", valuePerCarbon: 0, quantity: _quantity, ownerName: "", ownerAddress: _buyer, createdAt: _originalProject.createdAt, isResold: _originalProject.isResold, status: ProjectStatus.Owned, marketplaceIndex: 0 });
        newProjectId = _createProject(data);
        ownedProjects[_buyer].push(newProjectId);
    }

    function _createRetiredProject(Project storage _originalProject, address _owner, uint256 _quantity) internal returns (uint256 newProjectId) {
        Project memory data = Project({ projectId: 0, externalId: _originalProject.externalId, projectName: _originalProject.projectName, documentCID: _originalProject.documentCID, certificateCID: "", valuePerCarbon: 0, quantity: _quantity, ownerName: _originalProject.ownerName, ownerAddress: _owner, createdAt: _originalProject.createdAt, isResold: _originalProject.isResold, status: ProjectStatus.Retired, marketplaceIndex: 0 });
        newProjectId = _createProject(data);
    }

    function _createForSaleProject(
        string memory _externalId, string memory _projectName, string memory _documentCID, uint256 _valuePerCarbon, uint256 _quantity,
        string memory _ownerName, address _owner, uint256 _createdAt, bool _isResold
    ) internal returns (uint256 newProjectId) {
        Project memory data = Project({ projectId: 0, externalId: _externalId, projectName: _projectName, documentCID: _documentCID, certificateCID: "", valuePerCarbon: _valuePerCarbon, quantity: _quantity, ownerName: _ownerName, ownerAddress: _owner, createdAt: _createdAt, isResold: _isResold, status: ProjectStatus.ForSale, marketplaceIndex: 0 });
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
            // BUG FIX: Was 'projects[i]', should be 'projects[_ids[i]]'
            items[i] = projects[_ids[i]];
        }
        return items;
    }

    function _ownsProject(uint256 _projectId, address _user) internal view returns (bool) { return projects[_projectId].ownerAddress == _user; }
}