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
                console.log('Fetched students:', response.data);
                setStudents(response.data);
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
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const handleGeneratePDF = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/Student/generate-pdf', {
                responseType: 'blob', // Important for handling binary data
            });

            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Students.xlsx'); // Specify the file name
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Failed to generate PDF:', response.statusText);
                toast.error('Failed to generate PDF.');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF.');
        }
    };

    return (
        <div className="student-container">
            <h1>Student List</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/addstudent" className="add-button" style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                    Add New Student
                </Link>
                <button onClick={handleGeneratePDF} className="btn btn-success" style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                    Generate PDF
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
                                <td>{student.firstname}</td>
                                <td>{student.lastname}</td>
                                <td>{formatDate(student.birthDate)}</td>
                                <td>
                                    <Link to={`/editstudent/${student.id}`} className="btn btn-warning">Edit</Link>
                                    <button onClick={() => handleDelete(student.id)} className="btn btn-danger delete-button">Delete</button>
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
