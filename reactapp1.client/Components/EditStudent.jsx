import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EditStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({ firstname: '', lastname: '', birthDate: '' });

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:5077/api/Student/${id}`);
                setStudent(response.data);
                console.log('Fetched student:', response.data);
            } catch (error) {
                toast.error('Failed to fetch student data.');
            }
        };

        fetchStudent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5077/api/Student/${id}`, student);
            toast.success('Student updated successfully!');
            navigate('/students');
        } catch (error) {
            toast.error('Failed to update student.');
        }
    };

    return (
        <div>
            <h2>Edit Student</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Firstname:</label>
                    <input
                        type="text"
                        value={student.firstname}
                        onChange={(e) => setStudent({ ...student, firstname: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Lastname:</label>
                    <input
                        type="text"
                        value={student.lastname}
                        onChange={(e) => setStudent({ ...student, lastname: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Birth Date:</label>
                    <input
                        type="date"
                        value={student.birthDate}
                        onChange={(e) => setStudent({ ...student, birthDate: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Update Student</button>
            </form>
        </div>
    );
};

export default EditStudent;
