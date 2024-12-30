import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EditStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({ firstname: '', lastname: '', birthDate: '' });

    // Format date for display in the input field
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:5077/api/Student/${id}`);
                const studentData = response.data;
                // Ensure proper case for properties and format date
                setStudent({
                    id: studentData.id || studentData.ID,
                    firstname: studentData.firstname || studentData.Firstname,
                    lastname: studentData.lastname || studentData.Lastname,
                    birthDate: formatDateForInput(studentData.birthDate || studentData.BirthDate)
                });
                console.log('Fetched student data:', studentData); // Debug log
            } catch (error) {
                console.error('Error fetching student:', error);
                toast.error('Failed to fetch student data.');
            }
        };

        fetchStudent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure proper case for API request
            const studentData = {
                ID: student.id,
                Firstname: student.firstname,
                Lastname: student.lastname,
                BirthDate: student.birthDate
            };
            
            console.log('Submitting student data:', studentData); // Debug log
            await axios.put(`http://localhost:5077/api/Student/${id}`, studentData);
            toast.success('Student updated successfully!');
            navigate('/students');
        } catch (error) {
            console.error('Error updating student:', error);
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
