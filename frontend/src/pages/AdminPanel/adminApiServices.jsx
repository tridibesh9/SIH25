// src/pages/AdminPanel/adminApiServices.js
import { backend_url } from '../../api endpoints/backend_url';

const API_BASE_URL = backend_url;

const apiService = {
    getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    },

    async fetchProjectsByStatus(status) {
        const response = await fetch(`${API_BASE_URL}/admin/projects/${status}`, { headers: apiService.getHeaders() });
        if (!response.ok) throw new Error(`Failed to fetch ${status} projects. Status: ${response.status}`);
        const data = await response.json();
        // console.log(response);
        return data.success ? data.data : [];
    },
    
    async fetchOverview() {
        const response = await fetch(`${API_BASE_URL}/admin/overview`, { headers: apiService.getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch overview');
        const data = await response.json();
        console.log(data);
        return data.success ? data.data : {};
    },
    
    async movePendingToLandApproval(projectId, message) {
        const response = await fetch(`${API_BASE_URL}/admin/pending-to-land-approval`, {
            method: 'POST',
            headers: apiService.getHeaders(),
            body: JSON.stringify({ projectId, message })
        });
        console.log('Response Status:', response.status);
        return await response.json();
    },
    
    async assignNgo(projectId, ngoUserId, message) {
        const response = await fetch(`${API_BASE_URL}/admin/move/assign-ngo`, {
            method: 'POST',
            headers: apiService.getHeaders(),
            body: JSON.stringify({ projectId, ngoUserId, message })
        });
        return await response.json();
    },
    
    async moveNgoToDroneAssigning(projectId, message) {
        const response = await fetch(`${API_BASE_URL}/admin/ngo-to-drone-assigning`, {
            method: 'POST',
            headers: apiService.getHeaders(),
            body: JSON.stringify({ projectId, message })
        });
        return await response.json();
    },
    
    async assignDrone(projectId, droneUserId, message) {
        const response = await fetch(`${API_BASE_URL}/admin/assign-drone`, {
            method: 'POST',
            headers: apiService.getHeaders(),
            body: JSON.stringify({ projectId, droneUserId, message })
        });
        return await response.json();
    },
    
    async moveDroneToAdminApproval(projectId, message) {
        const response = await fetch(`${API_BASE_URL}/admin/drone-to-admin-approval`, {
            method: 'POST',
            headers: apiService.getHeaders(),
            body: JSON.stringify({ projectId, message })
        });
        return await response.json();
    },
    
    async changeStatus(projectId, newStatus, message) {
        const response = await fetch(`${API_BASE_URL}/admin/change-status`, {
            method: 'POST',
            headers: apiService.getHeaders(),
            body: JSON.stringify({ projectId, newStatus, message })
        });
        return await response.json();
    },
    
    async rejectProject(projectId, message) {
        const response = await fetch(`${API_BASE_URL}/admin/reject`, {
            method: 'POST',
            headers: apiService.getHeaders(),
            body: JSON.stringify({ projectId, message })
        });
        return await response.json();
    },
    
    async approveProject(projectId, message, carbonCredits) {
        const response = await fetch(`${API_BASE_URL}/admin/approve`, {
            method: 'POST',
            headers: apiService.getHeaders(),
            body: JSON.stringify({ projectId, message, carbonCredits })
        });
        return await response.json();
    }
};

export default apiService;
