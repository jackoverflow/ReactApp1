import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

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

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5077/api/Student/${id}`);
            setStudents(students.filter(student => student.id !== id));
            toast.success('Student deleted successfully!');
        } catch (error) {
            console.error('Error deleting student:', error);
            toast.error('Failed to delete student.');
        }
    };

    return (
        <div>
            <h1>Student List</h1>
            <table>
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
                                    <Link to={`/editstudent/${student.id}`}>Edit</Link>
                                    <button onClick={() => handleDelete(student.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No students found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentList;
