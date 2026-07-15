import React from 'react';
import { Activity } from '../../types';

interface ActivityHistoryProps {
    activities?: Activity[];
}

const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-CO');
};

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ activities = [] }) => {
    return (
        <div>
            <h2>Historial de Actuaciones</h2>
            <table>
                <thead>
                    <tr>
                        <th>Tipo de Actividad</th>
                        <th>Fecha de Actividad</th>
                        <th>Descripción Breve</th>
                        <th>Próximo Paso</th>
                        <th>Fecha Límite</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map((activity, index) => (
                        <tr key={index}>
                            <td>{activity.type}</td>
                            <td>{formatDate(activity.date)}</td>
                            <td>{activity.description}</td>
                            <td>{activity.nextStep}</td>
                            <td>{formatDate(activity.nextStepDeadline)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityHistory;
