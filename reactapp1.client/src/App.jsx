import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import StudentList from '.././Components/StudentList.jsx';
import AddStudent from '.././Components/AddStudent.jsx';

function App() {
    const [forecasts, setForecasts] = useState();

    useEffect(() => {
        populateWeatherData();
    }, []);

    async function populateWeatherData() {
        const response = await fetch('weatherforecast');
        if (response.ok) {
            const data = await response.json();
            setForecasts(data);
        }
    }

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/students">Student List</Link>
                        </li>
                        <li>
                            <Link to="/addstudent">Add Student</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/students" element={<StudentList />} />
                    <Route path="/addstudent" element={<AddStudent />} />
                    <Route path="/" element={
                        forecasts === undefined
                            ? <p><em>Loading... Please refresh once the ASP.NET backend has started.</em></p>
                            : <table className="table table-striped" aria-labelledby="tableLabel">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Temp. (C)</th>
                                        <th>Temp. (F)</th>
                                        <th>Summary</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {forecasts.map(forecast =>
                                        <tr key={forecast.date}>
                                            <td>{forecast.date}</td>
                                            <td>{forecast.temperatureC}</td>
                                            <td>{forecast.temperatureF}</td>
                                            <td>{forecast.summary}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;