import React from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
    const getNotificationStyle = () => {
        switch (type) {
            case 'success':
                return { backgroundColor: '#d4edda', color: '#155724' };
            case 'error':
                return { backgroundColor: '#f8d7da', color: '#721c24' };
            case 'info':
                return { backgroundColor: '#cce5ff', color: '#004085' };
            default:
                return {};
        }
    };

    return (
        <div style={{ padding: '10px', borderRadius: '5px', ...getNotificationStyle() }}>
            {message}
        </div>
    );
};

export default Notification;