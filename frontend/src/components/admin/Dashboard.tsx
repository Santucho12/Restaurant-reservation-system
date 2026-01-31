import React, { useState } from 'react';
import ReservationsTab from './ReservationsTab';
import TablesTab from './TablesTab';
import { useAuth } from '../../context/AuthContext';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'reservas' | 'mesas'>('reservas');
    const { logout } = useAuth();

    return (
        <div id="dashboard-section">
            <div className="admin-nav">
                <button
                    className={`admin-tab ${activeTab === 'reservas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reservas')}
                >
                    Reservas
                </button>
                <button
                    className={`admin-tab ${activeTab === 'mesas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mesas')}
                >
                    Mesas
                </button>
                <button
                    className="admin-tab"
                    id="btn-logout"
                    style={{ borderColor: 'var(--rojo-suave)', color: 'var(--rojo-suave)' }}
                    onClick={logout}
                >
                    Salir
                </button>
            </div>

            {activeTab === 'reservas' ? <ReservationsTab /> : <TablesTab />}
        </div>
    );
};

export default Dashboard;
