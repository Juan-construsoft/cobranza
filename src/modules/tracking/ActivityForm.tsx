import React, { useState } from 'react';
import { Activity } from '../../types';

type ActivityType = Activity['type'] | '';

export interface ActivityFormData {
    activityType: ActivityType;
    activityDate: string;
    description: string;
    nextStep: string;
    deadline: string;
    document: File | null;
}

interface ActivityFormProps {
    onSubmit: (activityData: ActivityFormData) => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit }) => {
    const [activityType, setActivityType] = useState<ActivityType>('');
    const [activityDate, setActivityDate] = useState('');
    const [description, setDescription] = useState('');
    const [nextStep, setNextStep] = useState('');
    const [deadline, setDeadline] = useState('');
    const [document, setDocument] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({
            activityType,
            activityDate,
            description,
            nextStep,
            deadline,
            document,
        });
        resetForm();
    };

    const resetForm = () => {
        setActivityType('');
        setActivityDate('');
        setDescription('');
        setNextStep('');
        setDeadline('');
        setDocument(null);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Tipo de Actividad:</label>
                <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as ActivityType)}
                    required
                >
                    <option value="">Seleccione...</option>
                    <option value="Demanda Radicada">Demanda Radicada</option>
                    <option value="Auto Admisorio">Auto Admisorio</option>
                    <option value="Auto Inadmisorio">Auto Inadmisorio</option>
                    <option value="Notificación Realizada">Notificación Realizada</option>
                    <option value="Respuesta Demanda">Respuesta Demanda</option>
                    <option value="Audiencia Agendada">Audiencia Agendada</option>
                    <option value="Audiencia Realizada">Audiencia Realizada</option>
                    <option value="Sentencia Emitida">Sentencia Emitida</option>
                    <option value="Recurso Presentado">Recurso Presentado</option>
                    <option value="Medida Cautelar Decretada">Medida Cautelar Decretada</option>
                    <option value="Embargo Realizado">Embargo Realizado</option>
                    <option value="Remate Realizado">Remate Realizado</option>
                    <option value="Pago Recibido">Pago Recibido</option>
                    <option value="Caso Archivado">Caso Archivado</option>
                </select>
            </div>
            <div>
                <label>Fecha de la Actividad:</label>
                <input type="date" value={activityDate} onChange={(e) => setActivityDate(e.target.value)} required />
            </div>
            <div>
                <label>Descripción Breve:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
                <label>Próximo Paso / Tarea:</label>
                <input type="text" value={nextStep} onChange={(e) => setNextStep(e.target.value)} />
            </div>
            <div>
                <label>Fecha Límite Próximo Paso:</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <div>
                <label>Adjuntar Documento Relacionado:</label>
                <input type="file" onChange={(e) => setDocument(e.target.files?.[0] ?? null)} />
            </div>
            <button type="submit">Registrar Actividad</button>
        </form>
    );
};

export default ActivityForm;
