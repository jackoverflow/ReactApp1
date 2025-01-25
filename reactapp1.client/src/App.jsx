import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentList from './Components/StudentList';
import AddStudent from './Components/AddStudent';
import EditStudent from './Components/EditStudent';
import AddSubject from './Components/AddSubject';
import SubjectList from './Components/SubjectList';
import EnrolStudent from './Components/EnrolStudent';
import StudentSubjects from './Components/StudentSubjects';
import EditSubject from './Components/EditSubject';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/students" element={<StudentList />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/edit-student/:id" element={<EditStudent />} />
                <Route path="/addsubject" element={<AddSubject />} />
                <Route path="/subjects" element={<SubjectList />} />
                <Route path="/enrol" element={<EnrolStudent />} />
                <Route path="/studentsubjects/:id" element={<StudentSubjects />} />
                <Route path="/editsubject/:id" element={<EditSubject />} />
                <Route path="/" element={<Navigate to="/students" />} />
            </Routes>
        </Router>
    );
};

export default App;