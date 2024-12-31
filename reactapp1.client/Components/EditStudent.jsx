import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
        // Add one day to compensate for timezone differences
        date.setDate(date.getDate() + 1);
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
        <div className="container mt-4">
            <h2>Edit Student</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Firstname:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={student.firstname}
                        onChange={(e) => setStudent({ ...student, firstname: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Lastname:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={student.lastname}
                        onChange={(e) => setStudent({ ...student, lastname: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Birth Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={student.birthDate}
                        onChange={(e) => setStudent({ ...student, birthDate: e.target.value })}
                        required
                    />
                </div>
                <div className="d-flex justify-content-start mt-3">
                    <button type="submit" className="btn btn-primary">Update Student</button>
                    <Link to="/students" className="btn btn-secondary ms-2">Back to List</Link>
                </div>
            </form>
        </div>
    );
};

export default EditStudent;
