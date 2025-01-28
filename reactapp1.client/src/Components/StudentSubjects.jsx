import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Use the configured axios instance
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const StudentSubjects = () => {
    const { id } = useParams(); // Get the student ID from the URL
    const [studentInfo, setStudentInfo] = useState({ firstName: '', lastName: '', subjects: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentSubjects = async () => {
            try {
                const response = await axios.get(`/api/student/${id}/subjects`);
                if (response.data) {
                    setStudentInfo({
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        subjects: response.data.subjects || [] // Ensure this is an array
                    });
                } else {
                    toast.error('Unexpected response format for student data.');
                }
            } catch (error) {
                console.error('Error fetching student subjects:', error);
                toast.error('Failed to fetch student subjects.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentSubjects();
    }, [id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h2>Student Details</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <h4 className="card-title">
                        {studentInfo.firstName} {studentInfo.lastName}
                    </h4>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Enrolled Subjects</h5>
                    {studentInfo.subjects.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {studentInfo.subjects.map((subject) => (
                                <li key={subject.id} className="list-group-item">
                                    <strong>{subject.shortName}</strong> - {subject.description}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">No subjects enrolled.</p>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <Link to="/students" className="btn btn-secondary">
                    Back to Student List
                </Link>
            </div>
        </div>
    );
};

export default StudentSubjects;
