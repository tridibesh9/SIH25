import React, { useState, useEffect } from 'react';
import { Camera, Calendar, MapPin, Upload, ImageIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DroneImageUpload = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [uploadImages, setUploadImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            // Mock data for drone appointments
            const mockAppointments = [
                {
                    _id: '1',
                    project: { 
                        _id: 'proj1',
                        projectName: 'Forest Restoration Project',
                        location: 'Mumbai, Maharashtra'
                    },
                    appointable_type: 'Drone',
                    appointable: {
                        _id: 'drone1',
                        model_name: 'DJI Mavic Pro',
                        serving_location: 'Mumbai'
                    },
                    date_of_visit: '2025-10-05',
                    status: 'scheduled'
                },
                {
                    _id: '2',
                    project: { 
                        _id: 'proj2',
                        projectName: 'Solar Farm Installation',
                        location: 'Rajasthan'
                    },
                    appointable_type: 'Drone',
                    appointable: {
                        _id: 'drone2',
                        model_name: 'DJI Phantom 4',
                        serving_location: 'Rajasthan'
                    },
                    date_of_visit: '2025-10-08',
                    status: 'scheduled'
                },
                {
                    _id: '3',
                    project: { 
                        _id: 'proj3',
                        projectName: 'Wind Energy Project',
                        location: 'Gujarat'
                    },
                    appointable_type: 'Drone',
                    appointable: {
                        _id: 'drone3',
                        model_name: 'DJI Inspire 2',
                        serving_location: 'Gujarat'
                    },
                    date_of_visit: '2025-10-10',
                    status: 'in_progress'
                }
            ];

            const droneAppointments = mockAppointments.filter(apt => apt.appointable_type === 'Drone');
            setAppointments(droneAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 10) {
            alert('You can upload a maximum of 10 images at once.');
            return;
        }
        setUploadImages(files);
    };

    const handleUpload = async () => {
        if (!selectedAppointment || uploadImages.length === 0) {
            alert('Please select an appointment and upload at least one image.');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            uploadImages.forEach((image) => {
                formData.append('images', image);
            });
            formData.append('appointmentId', selectedAppointment._id);
            formData.append('projectId', selectedAppointment.project._id);
            formData.append('description', description);
            formData.append('droneId', selectedAppointment.appointable._id);

            console.log('Uploading images for appointment:', selectedAppointment._id);
            console.log('Number of images:', uploadImages.length);
            console.log('Description:', description);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            alert('Images uploaded successfully!');
            setUploadImages([]);
            setDescription('');
            setSelectedAppointment(null);
        } catch (error) {
            alert('Error uploading images: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setUploadImages(prev => prev.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-16 bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-600">Loading appointments...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center mb-8">
                    <button 
                        onClick={() => navigate('/admin/dashboard')}
                        className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                            <Camera className="w-8 h-8 mr-3 text-blue-600" />
                            Drone Image Upload
                        </h1>
                        <p className="text-gray-600 mt-1">Upload survey images for drone appointments</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Scheduled Appointments</h2>
                            <div className="space-y-3">
                                {appointments.length > 0 ? appointments.map(appointment => (
                                    <div 
                                        key={appointment._id}
                                        onClick={() => setSelectedAppointment(appointment)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            selectedAppointment?._id === appointment._id 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium text-gray-800 text-sm">
                                                {appointment.project?.projectName || 'Unknown Project'}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                appointment.status === 'scheduled' 
                                                ? 'bg-yellow-100 text-yellow-800' 
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {new Date(appointment.date_of_visit).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {appointment.project?.location || 'Unknown location'}
                                            </div>
                                            <div className="flex items-center">
                                                <Camera className="w-3 h-3 mr-1" />
                                                {appointment.appointable?.model_name || 'Unknown drone'}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Camera className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>No drone appointments found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Upload Survey Images</h2>
                            
                            {selectedAppointment ? (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-blue-800 mb-2">Selected Appointment</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-blue-600 font-medium">Project:</span>
                                                <p className="text-blue-800">{selectedAppointment.project?.projectName}</p>
                                            </div>
                                            <div>
                                                <span className="text-blue-600 font-medium">Date:</span>
                                                <p className="text-blue-800">{new Date(selectedAppointment.date_of_visit).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <span className="text-blue-600 font-medium">Location:</span>
                                                <p className="text-blue-800">{selectedAppointment.project?.location}</p>
                                            </div>
                                            <div>
                                                <span className="text-blue-600 font-medium">Drone:</span>
                                                <p className="text-blue-800">{selectedAppointment.appointable?.model_name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Upload Survey Images
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                                            <input 
                                                type="file" 
                                                multiple 
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden" 
                                                id="image-upload"
                                            />
                                            <label htmlFor="image-upload" className="cursor-pointer">
                                                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                                <p className="text-lg text-gray-600 mb-2">Click to upload images or drag and drop</p>
                                                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each (Max 10 images)</p>
                                            </label>
                                        </div>
                                        
                                        {uploadImages.length > 0 && (
                                            <div className="mt-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="text-sm font-medium text-gray-700">
                                                        Selected Images ({uploadImages.length})
                                                    </h4>
                                                    <button 
                                                        onClick={() => setUploadImages([])}
                                                        className="text-sm text-red-600 hover:text-red-800"
                                                    >
                                                        Clear All
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {uploadImages.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="bg-gray-100 p-3 rounded-lg border">
                                                                <div className="flex items-center">
                                                                    <ImageIcon className="w-4 h-4 mr-2 text-gray-500" />
                                                                    <span className="text-xs text-gray-700 truncate flex-1">
                                                                        {image.name}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {(image.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                            <button 
                                                                onClick={() => removeImage(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Survey Description (Optional)
                                        </label>
                                        <textarea 
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Add description about the survey, findings, or any important notes..."
                                            className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                            rows={4}
                                        />
                                    </div>

                                    <div className="flex space-x-4">
                                        <button 
                                            onClick={handleUpload}
                                            disabled={uploading || uploadImages.length === 0}
                                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                        >
                                            {uploading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-5 h-5 mr-2" />
                                                    Upload Images ({uploadImages.length})
                                                </>
                                            )}
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setSelectedAppointment(null);
                                                setUploadImages([]);
                                                setDescription('');
                                            }}
                                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg mb-2">Select an appointment from the left panel</p>
                                    <p className="text-sm">Choose a scheduled drone appointment to upload survey images</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DroneImageUpload;