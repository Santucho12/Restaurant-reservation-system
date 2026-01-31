import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/admin/Login';
import Dashboard from '../components/admin/Dashboard';
import { useAuth } from '../context/AuthContext';

const Admin: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <div className="overlay"></div>

            <Link to="/" className="home-link">← Volver al Inicio</Link>

            <div className="admin-container">
                <header className="header">
                    <h1>La Maison</h1>
                    <div className="tagline">Panel de Administrador</div>
                    <div className="header-line"></div>
                </header>

                {isAuthenticated ? <Dashboard /> : <Login />}
            </div>
        </>
    );
};

export default Admin;
