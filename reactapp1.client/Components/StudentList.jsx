import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
            }
        };

        fetchStudents();
    }, []);

    return (
        <div>
            <h1>Student List</h1>
            <ul>
                {students.length > 0 ? (
                    students.map(student => (
                        <li key={student.id}>{student.firstname} {student.lastname}</li>
                    ))
                ) : (
                    <li>No students found</li>
                )}
            </ul>
        </div>
    );
};

export default StudentList;
