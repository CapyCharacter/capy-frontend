'use client';

import { useState, useEffect } from 'react';

interface NotificationProviderProps {
    children: React.ReactNode;
}

interface Notification {
    id: number;
    message: string;
}

// Notification provider to be copied to the layout file
export const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
                setNotifications(prev => [...prev, { id: Date.now(), message: event.data.message }]);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    return (
        <>
            {children}
            {notifications.map(notification => (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </>
    );
};

// Function to create a notification
export function createNotification(message: string) {
    window.postMessage({ type: 'SHOW_NOTIFICATION', message: message }, '*');
}

// Notification component to be copied to the layout file
const Notification = ({ message, onClose }: { message: string; onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-4 text-center z-50">
            {message}
            <button onClick={onClose} className="ml-4 text-white font-bold">Dismiss</button>
        </div>
    );
};
