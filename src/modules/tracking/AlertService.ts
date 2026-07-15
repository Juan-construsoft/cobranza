import { Activity, Case } from '../../types';

export interface CaseAlert {
    id: string;
    debtorName: string;
    message: string;
    level: 'yellow' | 'red';
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// El plazo cuenta como vencido al terminar el día límite (hora local).
const daysUntil = (deadline: string): number => {
    const due = new Date(`${deadline}T23:59:59`);
    return (due.getTime() - Date.now()) / MS_PER_DAY;
};

// Una alerta por caso, con el nivel más severo entre sus actuaciones
// (rojo = fecha límite vencida, amarillo = vence en 3 días o menos).
export const checkAlerts = (
    cases: Case[],
    activitiesByCase: Record<string, Activity[]> = {}
): CaseAlert[] => {
    const alerts: CaseAlert[] = [];

    cases.forEach(caseItem => {
        const activities = activitiesByCase[caseItem.id] ?? [];
        let level: CaseAlert['level'] | null = null;

        activities.forEach(activity => {
            if (!activity.nextStepDeadline) return;
            const days = daysUntil(activity.nextStepDeadline);
            if (days < 0) {
                level = 'red';
            } else if (days <= 3 && level !== 'red') {
                level = 'yellow';
            }
        });

        if (level === 'red') {
            alerts.push({
                id: caseItem.id,
                debtorName: caseItem.debtorName,
                message: `${caseItem.debtorName}: tiene una fecha límite vencida.`,
                level,
            });
        } else if (level === 'yellow') {
            alerts.push({
                id: caseItem.id,
                debtorName: caseItem.debtorName,
                message: `${caseItem.debtorName}: un próximo paso vence en 3 días o menos.`,
                level,
            });
        }
    });

    return alerts.sort(a => (a.level === 'red' ? -1 : 1));
};

export const getAlertCounts = (
    cases: Case[] = [],
    activitiesByCase: Record<string, Activity[]> = {}
): { yellow: number; red: number } => {
    const alerts = checkAlerts(cases, activitiesByCase);
    return {
        yellow: alerts.filter(alert => alert.level === 'yellow').length,
        red: alerts.filter(alert => alert.level === 'red').length,
    };
};
