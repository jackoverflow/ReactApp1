import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import './StudentList.css';

const EnrolStudent = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5077/api/student/search');
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
                toast.error('Failed to fetch students.');
            }
        };

        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:5077/api/student/subjects');
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                toast.error('Failed to fetch subjects.');
            }
        };

        fetchStudents();
        fetchSubjects();
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value) {
            const filtered = students.filter(student =>
                student.firstName.toLowerCase().includes(value.toLowerCase()) ||
                student.lastName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredStudents(filtered);
        } else {
            setFilteredStudents([]);
        }
    };

    const handleStudentSelect = async (student) => {
        setSelectedStudent(student);
        setSearchTerm(''); // Clear the search term
        setFilteredStudents([]); // Clear the filtered list

        try {
            // Fetch subjects already associated with the student
            const response = await axios.get(`http://localhost:5077/api/student/${student.id}/subjects`);
            if (response.data && response.data.subjects) {
                // Extract subject IDs from the response
                const enrolledSubjectIds = response.data.subjects.map(subject => subject.id);
                setSelectedSubjects(enrolledSubjectIds); // Set already enrolled subjects
            } else {
                setSelectedSubjects([]); // Reset if no subjects are found
                console.log('No subjects found for this student');
            }
        } catch (error) {
            console.error('Error fetching enrolled subjects:', error);
            toast.error('Failed to fetch enrolled subjects.');
            setSelectedSubjects([]); // Reset on error
        }
    };

    const handleSubjectChange = (e) => {
        // Convert HTMLCollection to Array and get selected values
        const selectedIds = Array.from(e.target.selectedOptions).map(option => Number(option.value));
        setSelectedSubjects(selectedIds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if a student is selected
        if (!selectedStudent) {
            toast.error('Please select a student.');
            return;
        }

        // Check if any subjects are selected
        if (selectedSubjects.length === 0) {
            const confirm = await Swal.fire({
                title: 'No Subjects Selected',
                text: 'You have not selected any subjects. Do you want to proceed anyway?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            });

            if (!confirm.isConfirmed) {
                return; // User chose not to proceed
            }
        }

        try {
            // Always send an array, even if empty
            const payload = selectedSubjects || [];
            
            await axios.put(
                `http://localhost:5077/api/student/${selectedStudent.id}/subjects`, 
                payload
            );
            
            await Swal.fire({
                title: 'Success!',
                text: 'Student subjects updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            navigate('/students');
        } catch (error) {
            console.error('Error updating student subjects:', error);
            toast.error('Failed to update student subjects.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h2 className="mb-0">Enroll Student</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="student-search"><strong>Search Student:</strong></label>
                                    <input
                                        id="student-search"
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by Firstname or Lastname"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                    {filteredStudents.length > 0 && (
                                        <ul className="list-group">
                                            {filteredStudents.map(student => (
                                                <li
                                                    key={student.id}
                                                    className="list-group-item"
                                                    onClick={() => handleStudentSelect(student)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {student.firstName} {student.lastName}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="form-group mb-3">
                                    <label><strong>Selected Student:</strong></label>
                                    {selectedStudent ? (
                                        <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '5px' }}>
                                            <li><strong>Firstname:</strong> {selectedStudent.firstName}</li>
                                            <li><strong>Lastname:</strong> {selectedStudent.lastName}</li>
                                        </ul>
                                    ) : (
                                        <p>No student selected</p>
                                    )}
                                </div>
                                <div className="form-group mb-3">
                                    <label><strong>Select Subjects:</strong></label>
                                    <select 
                                        multiple 
                                        className="form-control" 
                                        value={selectedSubjects}
                                        onChange={handleSubjectChange}
                                        style={{ height: '200px' }} // Make it taller for better visibility
                                    >
                                        {subjects.map(subject => (
                                            <option key={subject.id} value={subject.id}>
                                                {subject.shortName}
                                            </option>
                                        ))}
                                    </select>
                                    <small className="text-muted">Hold Ctrl (Windows) or Command (Mac) to select multiple subjects</small>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button type="submit" className="btn btn-primary">Update Enrollment</button>
                                    <Link to="/students" className="btn btn-secondary">Back to List</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrolStudent;
