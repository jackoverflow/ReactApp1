import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './StudentList.css';

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
        console.log('Form submitted');

        const studentData = {
            Firstname: firstname,
            Lastname: lastname,
            BirthDate: birthDate
        };

        try {
            console.log('Sending request...');
            const response = await fetch('http://localhost:5077/api/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (response.ok) {
                const addedStudent = await response.json();
                console.log('Response successful, about to show toast');
                
                toast.success('Student added successfully!');
                navigate('/students');
            } else {
                const errorText = await response.text();
                console.log('Error response:', errorText);
                toast.error(`Failed to add student: ${errorText}`);
            }
        } catch (error) {
            console.error('Catch error:', error);
            toast.error('Error adding student.');
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
