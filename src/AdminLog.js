import { useState } from 'react';
import './AdminLog.css';
import { useNavigate } from 'react-router-dom';

function AdminLog() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'Admin' && password === 'admin') {
            navigate('/AdminPanel');
        } else {
            console.error("Username and password must be correct");
        }
    };

    return (
        <div className='admin'>
            <form className='admin_form' onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='admin_log_btn' type="submit">Login</button>
            </form>
        </div>
    );
}

export default AdminLog;
