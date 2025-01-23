import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './StudentList.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddSubject = () => {
    const navigate = useNavigate();
    const [shortName, setShortName] = useState('');
    const [description, setDescription] = useState('');
    const shortNameInputRef = useRef(null);

    useEffect(() => {
        shortNameInputRef.current?.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');

        const subjectData = {
            shortName: shortName,
            description: description
        };

        try {
            console.log('Sending request...');
            const response = await axios.post('http://localhost:5077/api/student/subject', subjectData);

            if (response.status === 201) {
                console.log('Response successful, about to show toast');
                
                await Swal.fire({
                    title: 'Success!',
                    text: 'A subject has been added.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                navigate('/subjects'); // Assuming you have a subjects list page
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error adding subject.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h2 className="mb-0">Add New Subject</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="shortName" className="form-label">Short Name:</label>
                                    <input 
                                        id="shortName"
                                        type="text" 
                                        className="form-control" 
                                        value={shortName} 
                                        onChange={(e) => setShortName(e.target.value)}
                                        ref={shortNameInputRef}
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="description" className="form-label">Description:</label>
                                    <textarea 
                                        id="description"
                                        className="form-control" 
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="3"
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Add Subject
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/subjects')}
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

export default AddSubject;
