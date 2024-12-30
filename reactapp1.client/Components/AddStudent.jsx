import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AddStudent = () => {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');

        const studentData = {
            Firstname: firstname,
            Lastname: lastname,
            BirthDate: birthDate
        };

        try {
            console.log('Sending request...');
            const response = await fetch('http://localhost:5077/api/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (response.ok) {
                const addedStudent = await response.json();
                console.log('Response successful, about to show toast');
                
                toast.success('Student added successfully!', {
                    duration: 4000,
                    position: 'top-center',
                });

                setFirstname('');
                setLastname('');
                setBirthDate('');
                
                navigate('/students');
            } else {
                const errorText = await response.text();
                console.log('Error response:', errorText);
                toast.error(`Failed to add student: ${errorText}`);
            }
        } catch (error) {
            console.error('Catch error:', error);
            toast.error('Error adding student.');
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
