import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import {
    Case,
    CaseStatus,
    CASE_STATUSES,
    CASE_STATUS_LABELS,
    CREDITOR_OPTIONS,
    DebtorIdType,
    GuaranteeType,
    GUARANTEE_TYPES,
    NewCase,
} from '../../types';

export const LAWYER_OPTIONS: string[] = ['Abogado 1', 'Abogado 2'];

const ID_TYPES: DebtorIdType[] = ['C.C.', 'NIT', 'Pasaporte'];

// Valores del formulario: iguales a NewCase salvo initialAmount, que se
// mantiene como texto crudo del input hasta convertir al guardar.
export interface CaseFormValues extends Omit<NewCase, 'initialAmount'> {
    initialAmount: string;
}

export const emptyCaseValues: CaseFormValues = {
    debtorName: '',
    debtorIdType: 'C.C.',
    debtorIdNumber: '',
    debtorAddress: '',
    debtorPhones: '',
    debtorEmails: '',
    creditorName: CREDITOR_OPTIONS[0],
    obligationNumber: '',
    initialAmount: '',
    guaranteeType: [],
    responsibleLawyer: LAWYER_OPTIONS[0],
    originalDueDate: '',
    startDateOfDelinquency: '',
    initialComments: '',
    status: 'Active',
};

export const valuesFromCase = (caseData: Case): CaseFormValues => ({
    debtorName: caseData.debtorName,
    debtorIdType: caseData.debtorIdType,
    debtorIdNumber: caseData.debtorIdNumber,
    debtorAddress: caseData.debtorAddress,
    debtorPhones: caseData.debtorPhones,
    debtorEmails: caseData.debtorEmails,
    creditorName: caseData.creditorName,
    obligationNumber: caseData.obligationNumber,
    initialAmount: String(caseData.initialAmount),
    guaranteeType: caseData.guaranteeType,
    responsibleLawyer: caseData.responsibleLawyer,
    originalDueDate: caseData.originalDueDate,
    startDateOfDelinquency: caseData.startDateOfDelinquency,
    initialComments: caseData.initialComments,
    status: caseData.status,
});

export const valuesToNewCase = (values: CaseFormValues): NewCase => ({
    ...values,
    initialAmount: Number(values.initialAmount) || 0,
});

interface CaseFieldsProps {
    values: CaseFormValues;
    onChange: (patch: Partial<CaseFormValues>) => void;
    showStatus?: boolean;
}

const CaseFields: React.FC<CaseFieldsProps> = ({ values, onChange, showStatus = false }) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Nombre del Deudor"
                    value={values.debtorName}
                    onChange={e => onChange({ debtorName: e.target.value })}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={6} sm={3}>
                <TextField
                    label="Tipo de Identificación"
                    select
                    value={values.debtorIdType}
                    onChange={e => onChange({ debtorIdType: e.target.value as DebtorIdType })}
                    fullWidth
                >
                    {ID_TYPES.map(type => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={6} sm={3}>
                <TextField
                    label="Número de Identificación"
                    value={values.debtorIdNumber}
                    onChange={e => onChange({ debtorIdNumber: e.target.value })}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Dirección"
                    value={values.debtorAddress}
                    onChange={e => onChange({ debtorAddress: e.target.value })}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    label="Teléfonos"
                    value={values.debtorPhones}
                    onChange={e => onChange({ debtorPhones: e.target.value })}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    label="Correos"
                    value={values.debtorEmails}
                    onChange={e => onChange({ debtorEmails: e.target.value })}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Acreedor"
                    select
                    value={values.creditorName}
                    onChange={e => onChange({ creditorName: e.target.value })}
                    fullWidth
                    required
                >
                    {CREDITOR_OPTIONS.map(creditor => (
                        <MenuItem key={creditor} value={creditor}>
                            {creditor}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    label="Número de Obligación"
                    value={values.obligationNumber}
                    onChange={e => onChange({ obligationNumber: e.target.value })}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    label="Valor Adeudado Inicial"
                    type="number"
                    value={values.initialAmount}
                    onChange={e => onChange({ initialAmount: e.target.value })}
                    fullWidth
                    required
                    inputProps={{ min: 0, step: '0.01' }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Tipos de Garantía"
                    select
                    SelectProps={{ multiple: true }}
                    value={values.guaranteeType}
                    onChange={e =>
                        onChange({ guaranteeType: e.target.value as unknown as GuaranteeType[] })
                    }
                    fullWidth
                >
                    {GUARANTEE_TYPES.map(type => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Abogado Responsable"
                    select
                    value={values.responsibleLawyer}
                    onChange={e => onChange({ responsibleLawyer: e.target.value })}
                    fullWidth
                    required
                >
                    {LAWYER_OPTIONS.map(lawyer => (
                        <MenuItem key={lawyer} value={lawyer}>
                            {lawyer}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} sm={showStatus ? 4 : 6}>
                <TextField
                    label="Fecha de Vencimiento Original"
                    type="date"
                    value={values.originalDueDate}
                    onChange={e => onChange({ originalDueDate: e.target.value })}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12} sm={showStatus ? 4 : 6}>
                <TextField
                    label="Fecha de Inicio de Mora"
                    type="date"
                    value={values.startDateOfDelinquency}
                    onChange={e => onChange({ startDateOfDelinquency: e.target.value })}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            {showStatus && (
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Estado"
                        select
                        value={values.status}
                        onChange={e => onChange({ status: e.target.value as CaseStatus })}
                        fullWidth
                    >
                        {CASE_STATUSES.map(status => (
                            <MenuItem key={status} value={status}>
                                {CASE_STATUS_LABELS[status]}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            )}
            <Grid item xs={12}>
                <TextField
                    label="Comentarios Iniciales"
                    value={values.initialComments}
                    onChange={e => onChange({ initialComments: e.target.value })}
                    fullWidth
                    multiline
                    minRows={3}
                />
            </Grid>
        </Grid>
    );
};

export default CaseFields;
