import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import SubjectList from './Components/SubjectList';
// Import other components as needed

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SubjectList />} /> {/* Main page */}
                <Route path="/login" element={<Login />} /> {/* Login page */}
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
};

export default App; 