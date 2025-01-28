import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';  // Make sure to use the configured axios
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '.././Components/StudentList.css';

const StudentList = () => {
    const [students, setStudents] = useState([]);  // Initialize as empty array
    const [currentPage, setCurrentPage] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);  // Add loading state
    const pageSize = 4;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/student/search', {
                    params: {
                        searchTerm,
                        pageNumber: currentPage,
                        pageSize
                    }
                });

                // Fetch subject counts for each student
                const studentsWithSubjects = await Promise.all(
                    response.data.map(async (student) => {
                        const subjectsResponse = await axios.get(`/api/student/${student.id}/subjects`);
                        return {
                            ...student,
                            subjectCount: subjectsResponse.data.subjects ? subjectsResponse.data.subjects.length : 0
                        };
                    })
                );

                setStudents(studentsWithSubjects);
                const totalResponse = await axios.get('/api/student/count');
                setTotalStudents(totalResponse.data);
            } catch (error) {
                console.error('Error fetching students:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                } else {
                    toast.error('Failed to fetch students.');
                }
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [currentPage, searchTerm, navigate]);

    const totalPages = Math.ceil(totalStudents / pageSize); // Calculate total pages

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleDelete = async (id) => {
        const studentToDelete = students.find(student => student.id === id);
        const studentName = studentToDelete ? `${studentToDelete.firstName} ${studentToDelete.lastName}` : 'this student';

        const result = await Swal.fire({
            title: 'Are you sure?',
            html: `You won't be able to revert this!<br />Deleting ${studentName}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5077/api/student/${id}`);
                setStudents(students.filter(student => student.id !== id));
                toast.success('Student deleted successfully!');
            } catch (error) {
                console.error('Error deleting student:', error);
                toast.error('Failed to delete student.');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options).replace(',', '');
    };

    const handleGenerateExcel = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/Student/generate-excel', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Students.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Excel file generated successfully!');
        } catch (error) {
            console.error('Error generating Excel:', error);
            toast.error('Failed to generate Excel.');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to the first page on new search
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        navigate('/login'); // Redirect to the login page
        toast.success('Logged out successfully!'); // Show logout success message
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="student-container">
            <h1>Student List</h1>
            <button onClick={handleLogout} className="btn btn-danger mb-3">Logout</button>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Link to="/add-student" className="add-button" style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                    Add New Student
                </Link>
                <Link to="/addsubject" className="add-button" style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                    Add New Subject
                </Link>
                <Link to="/subjects" className="add-button" style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                    View Subjects
                </Link>                
                <Link to="/enrol" className="btn btn-info" style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                    Enroll Student
                </Link>
                <button 
                    className="btn btn-success" 
                    style={{ height: '40px' }} 
                    onClick={handleGenerateExcel}
                >
                    Generate Excel
                </button>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <label htmlFor="search-input">Search:</label>
                <input 
                    id="search-input"
                    type="text" 
                    className="search-input"
                    placeholder="Search by Firstname or Lastname"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <table className="student-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Birth Date</th>
                        <th>Subject Count</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student, index) => (
                            <tr key={student.id}>
                                <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                <td>{student.firstName}</td>
                                <td>{student.lastName}</td>
                                <td>{formatDate(student.dateOfBirth)}</td>
                                <td>{student.subjectCount}</td>
                                <td>
                                    <Link 
                                        to={`/edit-student/${student.id}`}
                                        className="btn btn-warning"
                                    >
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(student.id)} 
                                        className="btn btn-danger delete-button"
                                    >
                                        Delete
                                    </button>
                                    <Link 
                                        to={`/studentsubjects/${student.id}`} 
                                        className={`btn ${student.subjects ? 'btn-info' : 'btn-secondary'}`}
                                        style={{ marginLeft: '5px' }}
                                        onClick={(e) => {
                                            if (!student.subjects) {
                                                e.preventDefault(); // Prevent navigation if no subjects
                                            }
                                        }}
                                    >
                                        {student.subjects ? 'View Subjects' : 'No Subjects'}
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No students found</td>
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

export default StudentList;
