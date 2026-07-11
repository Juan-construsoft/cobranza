import { useEffect } from 'react';

const AlertService = {
    checkAlerts: (cases) => {
        const alerts = cases.map(caseItem => {
            const alert = { id: caseItem.id, message: '', isActive: false };
            const today = new Date();
            const dueDate = new Date(caseItem.nextStepDueDate);

            if (dueDate < today) {
                alert.message = `Alert: The case ${caseItem.id} - ${caseItem.debtorName} has a due date that has passed.`;
                alert.isActive = true;
            } else if ((dueDate - today) / (1000 * 60 * 60 * 24) <= 3) {
                alert.message = `Alert: The case ${caseItem.id} - ${caseItem.debtorName} is due in 3 days.`;
                alert.isActive = true;
            }

            return alert;
        });

        return alerts.filter(alert => alert.isActive);
    },

    sendEmailNotification: (alert) => {
        // Logic to send email notification to the responsible lawyer
        console.log(`Sending email: ${alert.message}`);
    },

    handleAlerts: (cases) => {
        const alerts = AlertService.checkAlerts(cases);
        alerts.forEach(alert => AlertService.sendEmailNotification(alert));
    }
};

export default AlertService;