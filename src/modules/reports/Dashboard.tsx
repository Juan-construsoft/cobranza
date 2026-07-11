import React, { useEffect, useState } from 'react';
import { getActiveCases, getCasesByStatus } from '../cases/CaseService';
import { getAlertCounts } from '../tracking/AlertService';

const Dashboard: React.FC = () => {
    const [activeCasesCount, setActiveCasesCount] = useState(0);
    const [casesByStatus, setCasesByStatus] = useState<{ [key: string]: number }>({});
    const [alertCounts, setAlertCounts] = useState({ yellow: 0, red: 0 });

    useEffect(() => {
        const fetchData = async () => {
            const activeCount = await getActiveCases();
            setActiveCasesCount(activeCount);

            const statusCounts = await getCasesByStatus();
            setCasesByStatus(statusCounts);

            const alerts = await getAlertCounts();
            setAlertCounts(alerts);
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <h2>Total de Casos Activos: {activeCasesCount}</h2>
                <h3>Casos por Estado:</h3>
                <ul>
                    {Object.entries(casesByStatus).map(([status, count]) => (
                        <li key={status}>{status}: {count}</li>
                    ))}
                </ul>
                <h3>Alertas:</h3>
                <p>Faltan 3 días o menos: {alertCounts.yellow}</p>
                <p>Fechas límite vencidas: {alertCounts.red}</p>
            </div>
        </div>
    );
};

export default Dashboard;