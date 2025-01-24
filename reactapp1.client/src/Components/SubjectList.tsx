import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface Subject {
    id: number;
    shortName: string;
    description: string;
}

const SubjectList = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:5077/api/student/subjects');
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                toast.error('Failed to fetch subjects.');
            }
        };

        fetchSubjects();
    }, []);

    const handleEdit = (id: number) => {
        navigate(`/editsubject/${id}`);
    };

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
                                <button 
                                    onClick={() => handleEdit(subject.id)} 
                                    className="btn btn-warning"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/students" className="btn btn-secondary mt-3">Back to List</Link>
        </div>
    );
};

export default SubjectList; 