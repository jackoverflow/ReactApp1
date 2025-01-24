import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const StudentSubjects = () => {
    const { id } = useParams();
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchStudentSubjects = async () => {
            try {
                const response = await axios.get(`http://localhost:5077/api/student/${id}/subjects`);
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching student subjects:', error);
                toast.error('Failed to fetch student subjects.');
            }
        };

        fetchStudentSubjects();
    }, [id]);

    return (
        <div className="container mt-4">
            <h2>Subjects for Student ID: {id}</h2>
            <Link to="/students" className="btn btn-secondary mb-3">Back to Student List</Link>
            <ul className="list-group">
                {subjects.length > 0 ? (
                    subjects.map(subject => (
                        <li key={subject.id} className="list-group-item">
                            {subject.shortName} - {subject.description}
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No subjects found for this student.</li>
                )}
            </ul>
        </div>
    );
};

export default StudentSubjects;
