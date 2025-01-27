import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

interface Subject {
    id: number;
    shortName: string;
    description: string;
}

const SubjectList = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
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

    // Filter subjects based on the search term
    const filteredSubjects = subjects.filter(subject =>
        subject.shortName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (id: number) => {
        navigate(`/editsubject/${id}`);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5077/api/student/subject/${id}`);
                setSubjects(subjects.filter(subject => subject.id !== id));
                toast.success('Subject deleted successfully!');
            } catch (error) {
                console.error('Error deleting subject:', error);
                toast.error('Failed to delete subject.');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Subject List</h2>
            <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control mb-3"
            />
            <Link to="/addsubject" className="btn btn-primary mb-3">Add New Subject</Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Short Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSubjects.map((subject, index) => (
                        <tr key={subject.id}>
                            <td>{index + 1}</td>
                            <td>{subject.shortName}</td>
                            <td>{subject.description}</td>
                            <td>
                                <button 
                                    onClick={() => handleEdit(subject.id)} 
                                    className="btn btn-warning"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(subject.id)} 
                                    className="btn btn-danger" 
                                    style={{ marginLeft: '5px' }}
                                >
                                    Delete
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