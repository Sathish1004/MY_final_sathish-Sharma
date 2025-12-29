import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from "sonner";

const generateId = () => Math.random().toString(36).substr(2, 9);

export interface Notification {
    id: string;
    title: string;
    description: string;
    type: 'info' | 'success' | 'alert';
    timestamp: string;
    read: boolean;
    link?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'Welcome to Prolync!',
        description: 'Explore your dashboard to see your personalized learning journey.',
        type: 'info',
        timestamp: 'Just now',
        read: false,
    },
    {
        id: '2',
        title: 'Module Tip: Coding Platform',
        description: 'Solve daily problems to build your streak and climb the leaderboard.',
        type: 'success',
        timestamp: '2 mins ago',
        read: false,
    }
];

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = useCallback((newNotif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const notification: Notification = {
            ...newNotif,
            id: generateId(),
            timestamp: 'Just now',
            read: false,
        };
        setNotifications(prev => [notification, ...prev]);

        // Trigger Global Toast
        if (notification.type === 'success') {
            toast.success(notification.title, {
                description: notification.description,
                style: { background: '#10b981', color: 'white', border: 'none' }
            });
        } else if (notification.type === 'alert') {
            toast.error(notification.title, {
                description: notification.description
            });
        } else {
            toast.info(notification.title, {
                description: notification.description
            });
        }
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const deleteNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            deleteNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
