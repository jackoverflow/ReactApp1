import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './StudentList.css';

const StudentList = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5077/api/Student');
                const formattedStudents = response.data.map(student => ({
                    ...student,
                    birthDate: student.birthDate ? student.birthDate.split('T')[0] : ''
                }));

                // Sort students by Lastname in ascending order
                formattedStudents.sort((a, b) => {
                    const lastnameA = a.lastname || a.Lastname;
                    const lastnameB = b.lastname || b.Lastname;
                    return lastnameA.localeCompare(lastnameB);
                });

                setStudents(formattedStudents);
            } catch (error) {
                console.error('Error fetching students:', error);
                toast.error('Failed to fetch students.');
            }
        };

        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
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
        return new Date(dateString).toLocaleDateString();
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

    return (
        <div className="student-container">
            <h1>Student List</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
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
        </div>
    );
};

export default StudentList;
