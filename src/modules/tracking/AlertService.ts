import { Activity, Case } from '../../types';

export interface CaseAlert {
    id: string;
    message: string;
    level: 'yellow' | 'red';
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const daysUntil = (deadline: Date | string): number => {
    const due = new Date(deadline);
    return (due.getTime() - Date.now()) / MS_PER_DAY;
};

export const checkAlerts = (cases: Case[], activitiesByCase: Record<string, Activity[]> = {}): CaseAlert[] => {
    const alerts: CaseAlert[] = [];

    cases.forEach(caseItem => {
        const activities = activitiesByCase[caseItem.id] ?? [];
        activities.forEach(activity => {
            if (!activity.nextStepDeadline) {
                return;
            }
            const days = daysUntil(activity.nextStepDeadline);
            if (days < 0) {
                alerts.push({
                    id: caseItem.id,
                    message: `Alerta: el caso ${caseItem.id} - ${caseItem.debtorName} tiene una fecha límite vencida.`,
                    level: 'red',
                });
            } else if (days <= 3) {
                alerts.push({
                    id: caseItem.id,
                    message: `Alerta: el caso ${caseItem.id} - ${caseItem.debtorName} vence en 3 días o menos.`,
                    level: 'yellow',
                });
            }
        });
    });

    return alerts;
};

export const getAlertCounts = (cases: Case[] = [], activitiesByCase: Record<string, Activity[]> = {}): { yellow: number; red: number } => {
    const alerts = checkAlerts(cases, activitiesByCase);
    return {
        yellow: alerts.filter(alert => alert.level === 'yellow').length,
        red: alerts.filter(alert => alert.level === 'red').length,
    };
};

export const sendEmailNotification = (alert: CaseAlert): void => {
    // Stub: aquí iría la integración real de correo al abogado responsable.
    console.log(`Sending email: ${alert.message}`);
};

export const handleAlerts = (cases: Case[], activitiesByCase: Record<string, Activity[]> = {}): void => {
    checkAlerts(cases, activitiesByCase).forEach(sendEmailNotification);
};
