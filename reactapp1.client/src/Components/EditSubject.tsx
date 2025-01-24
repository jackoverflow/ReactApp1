import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const EditSubject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState({ shortName: '', description: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const response = await axios.get(`http://localhost:5077/api/student/subject/${id}`);
                setSubject(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching subject:', error);
                toast.error('Failed to fetch subject details.');
            }
        };

        fetchSubject();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSubject(prevSubject => ({ ...prevSubject, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5077/api/student/subject/${id}`, subject);
            toast.success('Subject updated successfully!');
            navigate('/subjects');
        } catch (error) {
            console.error('Error updating subject:', error);
            toast.error('Failed to update subject.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h2>Edit Subject</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="shortName">Short Name</label>
                    <input
                        type="text"
                        id="shortName"
                        name="shortName"
                        className="form-control"
                        value={subject.shortName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        className="form-control"
                        value={subject.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Subject</button>
            </form>
        </div>
    );
};

export default EditSubject;
