import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Use the configured axios instance
import { toast } from 'react-hot-toast';

const SubjectList = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('/api/subjects'); // Adjust the endpoint as necessary
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                toast.error('Failed to fetch subjects.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h2>Subjects</h2>
            <p>Total Subjects: {subjects.length}</p> {/* Display the count of subjects */}
            <ul className="list-group">
                {subjects.map(subject => (
                    <li key={subject.id} className="list-group-item">
                        {subject.shortName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubjectList; 