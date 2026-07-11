import React from 'react';
import { Activity } from '../../types'; // Assuming you have an Activity type defined in your types/index.ts

interface ActivityHistoryProps {
    activities: Activity[];
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ activities }) => {
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
                            <td>{activity.date}</td>
                            <td>{activity.description}</td>
                            <td>{activity.nextStep}</td>
                            <td>{activity.dueDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityHistory;