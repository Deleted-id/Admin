import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLog from './AdminLog';
import AdminPanel from './AdminPanel';

function App() {
   
    return (
        <Router>
            <Routes>
                <Route path="/AdminPanel" element={<AdminPanel />} />
                <Route path="/" element={<AdminLog />} />
            </Routes>
        </Router>
    );
}

export default App;
