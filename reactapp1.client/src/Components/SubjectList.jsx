import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '.././Components/StudentList.css';

const SubjectList = () => {
    const [subjects, setSubjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalSubjects, setTotalSubjects] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 4;

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`http://localhost:5077/api/student/subjects`, {
                    params: {
                        searchTerm: searchTerm,
                        pageNumber: currentPage,
                        pageSize: pageSize
                    }
                });
                setSubjects(response.data);
                // Fetch total number of subjects for pagination
                const totalResponse = await axios.get(`http://localhost:5077/api/student/subjects/count`);
                setTotalSubjects(totalResponse.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                toast.error('Failed to fetch subjects.');
            }
        };

        fetchSubjects();
    }, [currentPage, searchTerm]);

    const totalPages = Math.ceil(totalSubjects / pageSize);

    const handleDelete = async (id) => {
        const subjectToDelete = subjects.find(subject => subject.id === id);
        const subjectName = subjectToDelete ? subjectToDelete.shortName : 'this subject';

        const result = await Swal.fire({
            title: 'Are you sure?',
            html: `You won't be able to revert this!<br />Deleting ${subjectName}.`,
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to the first page on new search
    };

    return (
        <div className="student-container">
            <h1>Subject List</h1>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Link to="/addsubject" className="add-button" style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                    Add New Subject
                </Link>
                <Link to="/students" className="add-button" style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                    View Students
                </Link>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <label htmlFor="search-input">Search:</label>
                <input 
                    id="search-input"
                    type="text" 
                    className="search-input"
                    placeholder="Search by Subject Name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <table className="student-table">
                <thead>
                    <tr>
                        <th>Short Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.length > 0 ? (
                        subjects.map(subject => (
                            <tr key={subject.id}>
                                <td>{subject.shortName}</td>
                                <td>{subject.description}</td>
                                <td>
                                    <Link 
                                        to={`/editsubject/${subject.id}`} 
                                        className="btn btn-warning"
                                        state={{ subject: subject }}
                                    >
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(subject.id)} 
                                        className="btn btn-danger delete-button"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="no-data">No subjects found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <a 
                        key={index + 1} 
                        onClick={() => setCurrentPage(index + 1)} 
                        className={`page-link ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default SubjectList;
