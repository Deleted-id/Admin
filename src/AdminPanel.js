import React, { useState, useEffect } from 'react';
import logo from './images/logo.png'
import JsBarcode from 'jsbarcode';
import './AdminPanel.css';

const AdminPanel = () => {
    const [employee, setEmployee] = useState({
        id: '',
        name: '',
        work: '',
        position: '',
        mobile: '',
        image: ''
    });
    const [employees, setEmployees] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

    useEffect(() => {
        const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
        setEmployees(storedEmployees);
    }, []);

    useEffect(() => {
        localStorage.setItem('employees', JSON.stringify(employees));
    }, [employees]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const reader = new FileReader();
            reader.onload = (e) => {
                setEmployee({
                    ...employee,
                    image: e.target.result
                });
            };
            reader.readAsDataURL(files[0]);
        } else {
            setEmployee({
                ...employee,
                [name]: value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setEmployees(employees.map(emp => emp.id === currentEmployeeId ? employee : emp));
            setIsEditing(false);
            setCurrentEmployeeId(null);
        } else {
            const newEmployee = { ...employee, id: Date.now().toString() };
            setEmployees([...employees, newEmployee]);
        }
        setEmployee({
            id: '',
            name: '',
            work: '',
            position: '',
            mobile: '',
            image: ''
        });
    };

    const handleEdit = (id) => {
        const emp = employees.find(emp => emp.id === id);
        setEmployee(emp);
        setIsEditing(true);
        setCurrentEmployeeId(id);
    };

    const handleDelete = (id) => {
        setEmployees(employees.filter(emp => emp.id !== id));
    };

    const generateBarcode = (employee) => {
        const canvas = document.createElement('canvas');
        const dataToEncode = `${employee.id} ${employee.name} ${employee.work} ${employee.position} ${employee.mobile}`;
        JsBarcode(canvas, dataToEncode, { format: 'CODE128' });
        return canvas.toDataURL('image/png');
    };

    const handlePrint = (emp) => {
        const barcodeDataUrl = generateBarcode(emp);
        const printContents = `
            <div style="width: 400px; padding: 20px; border: 2px solid #000; text-align: left; font-family: Arial, sans-serif;">
            <img src="${logo}" alt="Logo" style="position: absolute; left: 0;; opacity: 0.2; width: 100px; height: auto; z-index: -1;" />
                <h2 style="margin: 0; padding: 10px 0; background-color: #0044cc; color: #fff; text-align: center;">Employee ID Card</h2>
                <div style="display: flex; align-items: center; margin: 20px 0;">
                    <div style="flex: 1;">
                        <p><strong>ID:</strong> ${emp.id}</p>
                        <p><strong>Name:</strong> ${emp.name}</p>
                        <p><strong>Work:</strong> ${emp.work}</p>
                        <p><strong>Position:</strong> ${emp.position}</p>
                        <p><strong>Mobile:</strong> ${emp.mobile}</p>
                    </div>
                    <div style="flex: 0;">
                        ${emp.image ? `<img src="${emp.image}" alt="Employee Image" style="width: 100px; height: 100px; border: 2px solid #000;"/>` : ''}
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <img src="${barcodeDataUrl}" alt="Barcode" style="width: 200px; height: 50px;" />
                </div>
            </div>
        `;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Employee</title>');
        printWindow.document.write(`<style>body { margin: 0; background-repeat: no-repeat; background-size: cover; }</style>`);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };
    
    

    return (
        <div className="container">
            <h1>Admin Panel</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={employee.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Work:</label>
                    <input
                        type="text"
                        name="work"
                        value={employee.work}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Position:</label>
                    <input
                        type="text"
                        name="position"
                        value={employee.position}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Mobile:</label>
                    <input
                        type="text"
                        name="mobile"
                        value={employee.mobile}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Image:</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">{isEditing ? 'Update' : 'Submit'}</button>
            </form>
            <h2>Employee List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Work</th>
                        <th>Position</th>
                        <th>Mobile</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.name}</td>
                            <td>{emp.work}</td>
                            <td>{emp.position}</td>
                            <td>{emp.mobile}</td>
                            <td>
                                {emp.image && <img src={emp.image} alt={emp.name} style={{ width: '50px', height: '50px' }} />}
                            </td>
                            <td>
                                <button onClick={() => handleEdit(emp.id)}>Edit</button>
                                <button onClick={() => handleDelete(emp.id)}>Delete</button>
                                <button onClick={() => handlePrint(emp)}>Print</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
