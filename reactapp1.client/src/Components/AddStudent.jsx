import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './StudentList.css';
import Swal from 'sweetalert2';
import axios from '../axiosConfig'; // Import the configured axios instance

const AddStudent = () => {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const firstnameInputRef = useRef(null);

    useEffect(() => {
        firstnameInputRef.current?.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!birthDate) {
            toast.error('Please select a valid birth date.');
            return;
        }

        const studentData = {
            FirstName: firstname,
            LastName: lastname,
            DateOfBirth: birthDate
        };

        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debug token

            const response = await axios.post('/api/student', studentData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                toast.success('Student added successfully!');
                navigate('/students');
            }
        } catch (error) {
            console.error('Full error:', error); // Debug error
            if (error.response?.status === 401) {
                toast.error('Authentication failed. Please login again.');
                navigate('/login');
            } else {
                toast.error(error.response?.data || 'Failed to add student');
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
                                    <label htmlFor="firstname" className="form-label">Firstname:</label>
                                    <input 
                                        id="firstname"
                                        type="text" 
                                        className="form-control" 
                                        value={firstname} 
                                        onChange={(e) => setFirstname(e.target.value)}
                                        ref={firstnameInputRef}
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="lastname" className="form-label">Lastname:</label>
                                    <input 
                                        id="lastname"
                                        type="text" 
                                        className="form-control" 
                                        value={lastname} 
                                        onChange={(e) => setLastname(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="birthDate" className="form-label">Birth Date:</label>
                                    <input 
                                        id="birthDate"
                                        type="date" 
                                        className="form-control" 
                                        value={birthDate} 
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Add Student
                                    </button>
                                    <Link to="/students" className="btn btn-secondary" style={{ marginLeft: '10px' }}>
                                        Cancel
                                    </Link>
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
