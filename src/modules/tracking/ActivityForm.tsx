import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { ActivityType, ACTIVITY_TYPES } from '../../types';

export interface ActivityFormData {
    type: ActivityType;
    date: string;
    description: string;
    nextStep: string;
    nextStepDeadline: string | null;
    document: File | null;
}

interface ActivityFormProps {
    onSubmit: (activityData: ActivityFormData) => void | Promise<void>;
    submitting?: boolean;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit, submitting = false }) => {
    const [type, setType] = useState<ActivityType | ''>('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [nextStep, setNextStep] = useState('');
    const [deadline, setDeadline] = useState('');
    const [document, setDocument] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!type) return;
        await onSubmit({
            type,
            date,
            description,
            nextStep,
            nextStepDeadline: deadline || null,
            document,
        });
        setType('');
        setDate('');
        setDescription('');
        setNextStep('');
        setDeadline('');
        setDocument(null);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Tipo de Actuación"
                        select
                        value={type}
                        onChange={e => setType(e.target.value as ActivityType)}
                        fullWidth
                        required
                    >
                        {ACTIVITY_TYPES.map(activityType => (
                            <MenuItem key={activityType} value={activityType}>
                                {activityType}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Fecha de la Actuación"
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Descripción Breve"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Próximo Paso / Tarea"
                        value={nextStep}
                        onChange={e => setNextStep(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Fecha Límite Próximo Paso"
                        type="date"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" component="label">
                        {document ? document.name : 'Adjuntar Documento Relacionado'}
                        <input
                            type="file"
                            hidden
                            onChange={e => setDocument(e.target.files?.[0] ?? null)}
                        />
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Registrando…' : 'Registrar Actuación'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ActivityForm;
