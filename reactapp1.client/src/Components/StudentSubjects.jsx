import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Use the configured axios instance
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const StudentSubjects = () => {
    const { studentId } = useParams(); // Get the student ID from the URL
    const [student, setStudent] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const studentResponse = await axios.get(`/api/student/${studentId}`);
                setStudent(studentResponse.data);

                const subjectsResponse = await axios.get(`/api/student/${studentId}/subjects`);
                setSubjects(subjectsResponse.data.subjects); // Assuming the response has a 'subjects' field
            } catch (error) {
                console.error('Error fetching student data:', error);
                toast.error('Failed to fetch student data.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [studentId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h2>Student Details</h2>
            {student ? (
                <div>
                    <h4>
                        {student.firstName} {student.lastName}
                    </h4>
                    <h5>Enrolled Subjects:</h5>
                    <ul className="list-group">
                        {subjects.length > 0 ? (
                            subjects.map(subject => (
                                <li key={subject.id} className="list-group-item">
                                    {subject.shortName}
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">No subjects enrolled.</li>
                        )}
                    </ul>
                </div>
            ) : (
                <p>No student found.</p>
            )}
            <div style={{ marginTop: '20px' }}>
                <Link to="/students" className="btn btn-secondary">Back to Student List</Link>
            </div>
        </div>
    );
};

export default StudentSubjects;
