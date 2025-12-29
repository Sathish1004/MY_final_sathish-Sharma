import React from 'react';
import { Bell, Info, CheckCircle2, AlertCircle, X, CheckCheck, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/contexts/NotificationContext';

export function NotificationCenter() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification
    } = useNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case 'alert': return <AlertCircle className="h-4 w-4 text-amber-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 transition-colors">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-in fade-in zoom-in duration-300">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 p-0 mr-4" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex flex-col">
                        <h4 className="font-bold text-base">Notifications</h4>
                        <p className="text-xs text-muted-foreground">{unreadCount} unread messages</p>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs h-8 text-primary hover:text-primary hover:bg-primary/5"
                        >
                            <CheckCheck className="mr-1 h-3 w-3" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] p-8 text-center bg-muted/5">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Bell className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm font-medium text-foreground">All caught up!</p>
                            <p className="text-xs text-muted-foreground mt-1">No new notifications for you right now.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "flex gap-4 p-4 transition-colors relative group",
                                        !notification.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"
                                    )}
                                >
                                    <div className={cn(
                                        "mt-1 shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                                        notification.type === 'success' ? "bg-emerald-50" :
                                            notification.type === 'alert' ? "bg-amber-50" : "bg-blue-50"
                                    )}>
                                        {getIcon(notification.type)}
                                    </div>

                                    <div className="flex-1 space-y-1 pr-6">
                                        <div className="flex items-center justify-between">
                                            <p className={cn(
                                                "text-sm font-semibold leading-none",
                                                !notification.read ? "text-foreground" : "text-muted-foreground"
                                            )}>
                                                {notification.title}
                                            </p>
                                            {!notification.read && (
                                                <span className="h-2 w-2 rounded-full bg-primary" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {notification.description}
                                        </p>
                                        <div className="flex items-center gap-1.5 pt-1 text-[10px] text-muted-foreground/60 font-medium">
                                            <Clock className="h-3 w-3" />
                                            {notification.timestamp}
                                        </div>
                                    </div>

                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => deleteNotification(notification.id)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    {!notification.read && (
                                        <div
                                            className="absolute inset-0 cursor-pointer"
                                            onClick={() => markAsRead(notification.id)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-4 bg-muted/30 border-t text-center">
                    <Button variant="link" className="text-xs h-auto p-0 text-muted-foreground hover:text-primary">
                        View activity log
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
