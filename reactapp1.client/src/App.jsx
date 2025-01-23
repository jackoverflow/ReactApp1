import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentList from './Components/StudentList';
import AddStudent from './Components/AddStudent';
import EditStudent from './Components/EditStudent';
import AddSubject from './Components/AddSubject';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/students" element={<StudentList />} />
                <Route path="/addstudent" element={<AddStudent />} />
                <Route path="/editstudent/:id" element={<EditStudent />} />
                <Route path="/addsubject" element={<AddSubject />} />
                <Route path="/" element={<Navigate to="/students" />} />
            </Routes>
        </Router>
    );
};

export default App;