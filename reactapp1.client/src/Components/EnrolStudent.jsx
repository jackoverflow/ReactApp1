import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Use the configured axios instance
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import './StudentList.css';
import Swal from 'sweetalert2'; // Import SweetAlert2

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
                const response = await axios.get('/api/student/search');
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
                toast.error('Failed to fetch students.');
            }
        };

        const fetchSubjects = async () => {
            try {
                const response = await axios.get('/api/student/subjects');
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
            const response = await axios.get(`/api/student/${student.id}/subjects`);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudent) {
            toast.error('Please select a student.');
            return;
        }

        try {
            // Check for existing enrollments
            const existingEnrollments = await axios.get(`/api/student/${selectedStudent.id}/subjects`);
            const existingSubjectIds = existingEnrollments.data.subjects 
                ? existingEnrollments.data.subjects.map(subject => subject.id.toString())
                : [];

            // Get subjects to remove (subjects that were enrolled but are no longer selected)
            const subjectsToRemove = existingSubjectIds.filter(id => !selectedSubjects.includes(id));

            // Remove subjects that are no longer selected
            for (const subjectId of subjectsToRemove) {
                await axios.delete(`/api/student/${selectedStudent.id}/subjects/${subjectId}`);
            }

            // Get new subjects to add (subjects that are selected but weren't enrolled)
            const newSubjectIds = selectedSubjects.filter(id => !existingSubjectIds.includes(id.toString()));

            // Add new subjects
            if (newSubjectIds.length > 0) {
                const response = await axios.post('/api/student/enrol', {
                    StudentId: selectedStudent.id,
                    SubjectIds: newSubjectIds.map(id => Number(id))
                });

                if (response.status === 201) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Student enrollment updated successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    navigate('/students');
                }
            } else {
                Swal.fire({
                    title: 'Success!',
                    text: 'Student enrollment updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                navigate('/students');
            }
        } catch (error) {
            console.error('Error updating enrollment:', error);
            if (error.response) {
                toast.error(`Failed to update enrollment: ${error.response.data.message || 'Unknown error'}`);
            } else {
                toast.error('Failed to update enrollment. Please try again.');
            }
        }
    };

    const handleUnenrollSubject = async (subjectId) => {
        if (!selectedStudent) {
            toast.error('Please select a student first.');
            return;
        }

        try {
            // Call the UnEnroll API endpoint for a specific subject
            const response = await axios.delete(`/api/student/${selectedStudent.id}/subjects/${subjectId}`);
            if (response.status === 204) { // No Content
                setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId)); // Remove the subject from the selected list
                Swal.fire({
                    title: 'Success!',
                    text: 'Subject unenrolled successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                toast.error('Failed to unenroll subject.');
            }
        } catch (error) {
            console.error('Error unenrolling subject:', error);
            toast.error('Failed to unenroll subject.');
        }
    };

    const handleUpdateSubjects = async () => {
        if (!selectedStudent) {
            toast.error('Please select a student first.');
            return;
        }

        try {
            // Unenroll existing subjects if needed
            for (const subjectId of selectedSubjects) {
                await axios.delete(`/api/student/${selectedStudent.id}/subjects/${subjectId}`);
            }

            // Enroll the new subjects
            const response = await axios.post('/api/student/enrol', {
                StudentId: selectedStudent.id,
                SubjectIds: selectedSubjects.map(id => Number(id)) // Ensure IDs are numbers
            });

            if (response.status === 201) {
                toast.success('Student subjects updated successfully!');
                navigate('/students');
            }
        } catch (error) {
            console.error('Error updating subjects:', error);
            if (error.response) {
                toast.error(`Failed to update subjects: ${error.response.data.message || 'Unknown error'}`);
            } else {
                toast.error('Failed to update subjects. Please try again.');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Enroll Student</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label><strong>Search Student:</strong></label>
                    <input
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
                        onChange={(e) => setSelectedSubjects([...e.target.selectedOptions].map(option => option.value))}
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
    );
};

export default EnrolStudent;
