import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SubjectList = () => {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:5077/api/subject');
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                toast.error('Failed to fetch subjects.');
            }
        };

        fetchSubjects();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Subject List</h2>
            <Link to="/addsubject" className="btn btn-primary mb-3">Add New Subject</Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>Short Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map(subject => (
                        <tr key={subject.id}>
                            <td>{subject.shortName}</td>
                            <td>{subject.description}</td>
                            <td>
                                <Link to={`/editsubject/${subject.id}`} className="btn btn-warning">Edit</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubjectList; 