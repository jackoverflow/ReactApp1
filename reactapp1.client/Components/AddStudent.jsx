import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddStudent = () => {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const studentData = {
            Firstname: firstname,
            Lastname: lastname,
            BirthDate: birthDate
        };

        console.log('Sending student data:', studentData);

        try {
            const response = await fetch('http://localhost:5077/api/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const addedStudent = await response.json();
                console.log('Student added successfully:', addedStudent);
                
                setFirstname('');
                setLastname('');
                setBirthDate('');
                
                // Show success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Student added successfully!',
                    confirmButtonText: 'OK'
                });

                // Optionally navigate to another page
                navigate('/students');
            } else {
                const errorText = await response.text();
                console.error('Failed to add student:', errorText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to add student.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error adding student:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error adding student.',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div>
            <h2>Add New Student</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Firstname:</label>
                    <input 
                        type="text" 
                        value={firstname} 
                        onChange={(e) => setFirstname(e.target.value)}
                        required 
                    />
                </div>
                <div>
                    <label>Lastname:</label>
                    <input 
                        type="text" 
                        value={lastname} 
                        onChange={(e) => setLastname(e.target.value)}
                        required 
                    />
                </div>
                <div>
                    <label>Birth Date:</label>
                    <input 
                        type="date" 
                        value={birthDate} 
                        onChange={(e) => setBirthDate(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit">Add Student</button>
            </form>
        </div>
    );
};

export default AddStudent;
