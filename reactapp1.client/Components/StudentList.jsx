import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './StudentList.css';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 4;

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`http://localhost:5077/api/student/search`, {
                    params: {
                        searchTerm: searchTerm,
                        pageNumber: currentPage,
                        pageSize: pageSize
                    }
                });
                setStudents(response.data);
                // Fetch total number of students for pagination
                const totalResponse = await axios.get(`http://localhost:5077/api/student/count`);
                setTotalStudents(totalResponse.data);
            } catch (error) {
                console.error('Error fetching students:', error);
                toast.error('Failed to fetch students.');
            }
        };

        fetchStudents();
    }, [currentPage, searchTerm]);

    const totalPages = Math.ceil(totalStudents / pageSize); // Calculate total pages

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleDelete = async (id) => {
        const studentToDelete = students.find(student => student.id === id);
        const studentName = studentToDelete ? `${studentToDelete.firstname || studentToDelete.Firstname} ${studentToDelete.lastname || studentToDelete.Lastname}` : 'this student';

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
                await axios.delete(`http://localhost:5077/api/Student/${id}`);
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

    return (
        <div className="student-container">
            <h1>Student List</h1>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Link to="/addstudent" className="add-button" style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                    Add New Student
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
                <label htmlFor="search-input" style={{ fontWeight: 'bold' }}>Search:</label>
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
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Birth Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map(student => (
                            <tr key={student.id}>
                                <td>{student.firstname || student.Firstname}</td>
                                <td>{student.lastname || student.Lastname}</td>
                                <td>{formatDate(student.birthDate || student.BirthDate)}</td>
                                <td>
                                    <Link 
                                        to={`/editstudent/${student.id}`} 
                                        className="btn btn-warning"
                                        state={{ student: student }}
                                    >
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(student.id)} 
                                        className="btn btn-danger delete-button"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="no-data">No students found</td>
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
