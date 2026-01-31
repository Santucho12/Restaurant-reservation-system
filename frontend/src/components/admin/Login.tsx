import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);



    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error de autenticación');
            login(data.token, email);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error de autenticación');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="login-section" className="formulario">
            <h2 style={{ textAlign: 'center', color: 'var(--dorado)', marginBottom: '20px' }}>
                Acceso Restringido
            </h2>
            <form onSubmit={handleLogin}>
                <div className="campo">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@lamaison.com"
                        required
                    />
                </div>
                <div className="campo" style={{ marginTop: '15px' }}>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn-reservar" style={{ marginTop: '20px' }} disabled={isLoading}>
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
            {error && (
                <div className="mensaje error" style={{ marginTop: '15px', display: 'block' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default Login;
