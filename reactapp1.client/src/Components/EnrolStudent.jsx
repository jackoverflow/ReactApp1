import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EnrolStudent = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setFirstName(student.firstName);
        setLastName(student.lastName);
        setSearchTerm(''); // Clear the search term
        setFilteredStudents([]); // Clear the filtered list
    };

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

    const handleSubjectChange = (subjectId) => {
        setSelectedSubjects(prevSelected => {
            if (prevSelected.includes(subjectId)) {
                return prevSelected.filter(id => id !== subjectId);
            } else {
                return [...prevSelected, subjectId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudent) {
            toast.error('Please select a student.');
            return;
        }

        const enrollmentData = {
            studentId: selectedStudent.id,
            subjectIds: selectedSubjects
        };

        try {
            const response = await axios.post('http://localhost:5077/api/student/enrol', enrollmentData);
            if (response.status === 201) {
                await Swal.fire({
                    title: 'Success!',
                    text: 'Student enrolled successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                navigate('/students'); // Redirect to student list
            }
        } catch (error) {
            console.error('Error enrolling student:', error);
            toast.error('Failed to enroll student.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Enroll Student</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="student-search">Search Student:</label>
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
                    <label>Selected Student:</label>
                    {selectedStudent ? (
                        <div>
                            <p>Firstname: {firstName}</p>
                            <p>Lastname: {lastName}</p>
                        </div>
                    ) : (
                        <p>No student selected</p>
                    )}
                </div>
                <div className="form-group mb-3">
                    <label>Select Subjects:</label>
                    <div>
                        {subjects.map(subject => (
                            <div key={subject.id}>
                                <input
                                    type="checkbox"
                                    id={`subject-${subject.id}`}
                                    checked={selectedSubjects.includes(subject.id)}
                                    onChange={() => handleSubjectChange(subject.id)}
                                />
                                <label htmlFor={`subject-${subject.id}`}>{subject.shortName}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Enroll Student</button>
            </form>
        </div>
    );
};

export default EnrolStudent;
