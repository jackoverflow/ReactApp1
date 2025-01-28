import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './StudentList.css';
import Swal from 'sweetalert2';
import axios from '../axiosConfig'; // Import the configured axios instance

const AddStudent = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const firstNameInputRef = useRef(null);

    useEffect(() => {
        firstNameInputRef.current?.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const studentData = {
            firstName,
            lastName,
            dateOfBirth
        };

        try {
            const response = await axios.post('/api/student', studentData);
            
            if (response.status === 201) {
                await Swal.fire({
                    title: 'Success!',
                    text: 'A student has been added.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                navigate('/students');
            }
        } catch (error) {
            console.error('Error adding student:', error);
            if (error.response?.status === 401) {
                toast.error('Please login again.');
                navigate('/login');
            } else {
                toast.error(error.response?.data || 'Failed to add student. Please try again.');
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h2 className="mb-0">Add New Student</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="firstName" className="form-label">First Name:</label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        className="form-control"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        ref={firstNameInputRef}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="lastName" className="form-label">Last Name:</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        className="form-control"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth:</label>
                                    <input
                                        id="dateOfBirth"
                                        type="date"
                                        className="form-control"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Add Student
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/students')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStudent;
