import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const StudentSubjects = () => {
    const { id } = useParams();
    const [studentInfo, setStudentInfo] = useState({ firstName: '', lastName: '', subjects: [] });

    useEffect(() => {
        const fetchStudentSubjects = async () => {
            try {
                const response = await axios.get(`http://localhost:5077/api/student/${id}/subjects`);
                setStudentInfo(response.data);
            } catch (error) {
                console.error('Error fetching student subjects:', error);
                toast.error('Failed to fetch student subjects.');
            }
        };

        fetchStudentSubjects();
    }, [id]);

    return (
        <div className="container mt-4">
            <h2>Subjects for {studentInfo.firstName} {studentInfo.lastName}</h2>
            <Link to="/students" className="btn btn-secondary mb-3">Back to Student List</Link>
            <ul className="list-group">
                {studentInfo.subjects.length > 0 ? (
                    studentInfo.subjects.map(subject => (
                        <li key={subject.id} className="list-group-item">
                            {subject.shortName} - {subject.description}
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No subjects found for this student.</li>
                )}
            </ul>
            <Link to="/students" className="btn btn-info mt-3">Back to List</Link>
        </div>
    );
};

export default StudentSubjects;
