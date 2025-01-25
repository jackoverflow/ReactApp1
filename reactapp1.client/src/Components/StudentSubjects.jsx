import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const StudentSubjects = () => {
    const { id } = useParams();
    const [studentInfo, setStudentInfo] = useState({ firstName: '', lastName: '', subjects: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentSubjects = async () => {
            try {
                const response = await axios.get(`http://localhost:5077/api/student/${id}/subjects`);
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
            <h2>Subjects for <strong>{studentInfo.firstName}</strong> <strong>{studentInfo.lastName}</strong></h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <Link to="/students" className="btn btn-secondary">Back to Student List</Link>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {studentInfo.subjects.length > 0 ? (
                        studentInfo.subjects.map(subject => (
                            <tr key={subject.id}>
                                <td>{subject.shortName}</td>
                                <td>{subject.description}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="no-data">No subjects found for this student.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentSubjects;
