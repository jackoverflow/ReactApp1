import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
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
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/student/subjects');
                const subjectsWithNumberIds = response.data.map((subject: any) => ({
                    ...subject,
                    id: Number(subject.id)
                }));
                setSubjects(subjectsWithNumberIds);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                } else {
                    toast.error('Failed to fetch subjects.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [navigate]);

    // Filter subjects based on search term (case-insensitive)
    const filteredSubjects = subjects.filter(subject =>
        subject.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (id: number) => {
        navigate(`/editsubject/${id}`);
    };

    const handleDelete = async (id: number) => {
        const subjectToDelete = subjects.find(subject => subject.id === id);
        
        const result = await Swal.fire({
            title: 'Are you sure?',
            html: `You won't be able to revert this!<br />Deleting subject: ${subjectToDelete?.shortName}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/student/subject/${id}`);
                setSubjects(subjects.filter(subject => subject.id !== id));
                toast.success('Subject deleted successfully!');
            } catch (error) {
                console.error('Error deleting subject:', error);
                toast.error('Failed to delete subject.');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h2>Subject List</h2>
            <div className="row mb-3">
                <div className="col">
                    <input
                        type="text"
                        placeholder="Search subjects by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="col-auto">
                    <Link to="/addsubject" className="btn btn-primary">
                        Add New Subject
                    </Link>
                </div>
            </div>
            
            <div className="card mb-3">
                <div className="card-body">
                    <p className="mb-0">Total Subjects: {subjects.length}</p>
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Short Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject, index) => (
                            <tr key={subject.id}>
                                <td>{index + 1}</td>
                                <td>{subject.shortName}</td>
                                <td>{subject.description}</td>
                                <td>
                                    <button 
                                        onClick={() => handleEdit(subject.id)} 
                                        className="btn btn-warning btn-sm me-2"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(subject.id)} 
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center">
                                {searchTerm ? 'No subjects found matching your search' : 'No subjects available'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Link to="/students" className="btn btn-secondary">
                Back to Student List
            </Link>
        </div>
    );
};

export default SubjectList; 