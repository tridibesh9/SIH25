import { backend_url } from '../../api endpoints/backend_url';
import { authenticatedFetch, getAuthHeaders } from '../../utils/authUtils';

const API_BASE_URL = backend_url;

const apiService = {
    getHeaders() {
        return getAuthHeaders();
    },

    async fetchProjectsByStatus(status) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/admin/projects/${status}`);
            if (!response.ok) throw new Error(`Failed to fetch ${status} projects. Status: ${response.status}`);
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (err) {
            console.error(`Error fetching ${status} projects:`, err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    },
    
    async fetchOverview() {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/admin/overview`);
            if (!response.ok) throw new Error('Failed to fetch overview');
            const data = await response.json();
            return data.success ? data.data : {};
        } catch (err) {
            console.error('Error fetching overview:', err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    },
    
    async fetchNgos() {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/ngos`);
            if (!response.ok) throw new Error('Failed to fetch NGOs');
            const data = await response.json();
            return data.ngos ? data.ngos.map(ngo => ({ ...ngo, _id: String(ngo._id) })) : [];
        } catch (err) {
            console.error('Error fetching NGOs:', err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    },

    async fetchDrones() {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/drones`);
            if (!response.ok) throw new Error('Failed to fetch drones');
            const data = await response.json();
            return data.drones ? data.drones.map(drone => ({ ...drone, _id: String(drone._id) })) : [];
        } catch (err) {
            console.error('Error fetching drones:', err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    },

    async fetchAllProjects() {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/admin/projects/all`);
            if (!response.ok) throw new Error('Failed to fetch all projects');
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (err) {
            console.error('Error fetching all projects:', err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    },
    
    async movePendingToLandApproval(projectId, message) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/admin/pending-to-land-approval`, {
                method: 'POST',
                body: JSON.stringify({ projectId, message })
            });
            return await response.json();
        } catch (err) {
            console.error('Error moving pending to land approval:', err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    },
    
    async assignNgo(projectId, ngoUserId, message) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/admin/move/assign-ngo`, {
                method: 'POST',
                body: JSON.stringify({ projectId, ngoUserId, message })
            });
            return await response.json();
        } catch (err) {
            console.error('Error assigning NGO:', err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    },
    
    async moveNgoToDroneAssigning(projectId, message) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/admin/ngo-to-drone-assigning`, {
                method: 'POST',
                body: JSON.stringify({ projectId, message })
            });
            return await response.json();
        } catch (err) {
            console.error('Error moving NGO to drone assigning:', err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    },
    
    async assignDrone(projectId, droneUserId, message) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/admin/assign-drone`, {
                method: 'POST',
                body: JSON.stringify({ projectId, droneUserId, message })
            });
            return await response.json();
        } catch (err) {
            console.error('Error assigning drone:', err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    },
    
    async moveDroneToAdminApproval(projectId, message) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/admin/drone-to-admin-approval`, {
                method: 'POST',
                body: JSON.stringify({ projectId, message })
            });
            return await response.json();
        } catch (err) {
            console.error('Error moving drone to admin approval:', err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    },
    
    async changeStatus(projectId, newStatus, message) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/admin/change-status`, {
                method: 'POST',
                body: JSON.stringify({ projectId, newStatus, message })
            });
            return await response.json();
        } catch (err) {
            console.error('Error changing status:', err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    },
    
    async rejectProject(projectId, message) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/admin/reject`, {
                method: 'POST',
                body: JSON.stringify({ projectId, message })
            });
            return await response.json();
        } catch (err) {
            console.error('Error rejecting project:', err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    },
    
    async approveProject(projectId, message, carbonCredits) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/admin/approve`, {
                method: 'POST',
                body: JSON.stringify({ projectId, message, carbonCredits })
            });
            return await response.json();
        } catch (err) {
            console.error('Error approving project:', err);
            if (err.message === 'Authentication required') {
                window.location.href = '/auth';
            }
            throw err;
        }
    }
};

export default apiService;