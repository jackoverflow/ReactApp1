import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import { toast } from 'react-hot-toast';
import './StudentList.css';

const EditStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({
        id: '',
        firstname: '',
        lastname: '',
        birthDate: ''
    });

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`/api/student/${id}`);
                const studentData = response.data;

                // Format the date when setting the student data
                const formattedDate = studentData.dateOfBirth ? 
                    new Date(studentData.dateOfBirth).toISOString().split('T')[0] : '';
                
                setStudent({
                    id: studentData.id,
                    firstname: studentData.firstName,
                    lastname: studentData.lastName,
                    birthDate: formattedDate
                });
            } catch (error) {
                console.error('Error fetching student:', error);
                toast.error('Failed to fetch student data.');
            }
        };

        if (id) {
            fetchStudent();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const studentData = {
                id: student.id,
                firstName: student.firstname,
                lastName: student.lastname,
                dateOfBirth: student.birthDate
            };
            
            await axios.put(`/api/student/${id}`, studentData);
            toast.success('Student updated successfully!');
            navigate('/students');
        } catch (error) {
            console.error('Error updating student:', error);
            toast.error('Failed to update student.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h2 className="mb-0">Edit Student</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label">Firstname:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={student.firstname}
                                        onChange={(e) => setStudent({ ...student, firstname: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Lastname:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={student.lastname}
                                        onChange={(e) => setStudent({ ...student, lastname: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Birth Date:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={student.birthDate}
                                        onChange={(e) => setStudent({ ...student, birthDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">Update Student</button>
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

export default EditStudent;
