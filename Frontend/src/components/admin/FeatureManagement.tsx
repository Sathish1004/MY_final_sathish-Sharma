import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FeatureFlag {
    id: number;
    feature_key: string;
    feature_name: string;
    is_enabled: boolean;
    description?: string;
}

export default function FeatureManagement() {
    const [features, setFeatures] = useState<FeatureFlag[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        featureKey: string;
        currentStatus: boolean;
        featureName: string;
    }>({
        isOpen: false,
        featureKey: '',
        currentStatus: false,
        featureName: ''
    });
    const [confirmationText, setConfirmationText] = useState("");

    const fetchFeatures = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/features/admin/all`);
            if (response.ok) {
                const data = await response.json();
                setFeatures(data);
            } else {
                console.error("Failed to fetch features");
            }
        } catch (error) {
            console.error("Error fetching features:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    const initiateToggle = (feature: FeatureFlag) => {
        setConfirmDialog({
            isOpen: true,
            featureKey: feature.feature_key,
            currentStatus: feature.is_enabled,
            featureName: feature.feature_name
        });
        setConfirmationText("");
    };

    const handleConfirmToggle = async () => {
        const { featureKey, currentStatus } = confirmDialog;
        const newStatus = !currentStatus;
        const requiredText = newStatus ? "PERMANENTLY ENABLE" : "PERMANENTLY HIDE";

        if (confirmationText !== requiredText) return;

        // Optimistic update
        setFeatures(prev => prev.map(f =>
            f.feature_key === featureKey ? { ...f, is_enabled: newStatus } : f
        ));

        // Close dialog immediately
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/features/admin/${featureKey}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enabled: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update feature status');
            }

            toast({
                title: "Feature Updated",
                description: `${featureKey} is now ${newStatus ? 'enabled' : 'disabled'}.`,
            });

        } catch (error) {
            console.error("Error updating feature:", error);
            // Revert on error
            setFeatures(prev => prev.map(f =>
                f.feature_key === featureKey ? { ...f, is_enabled: currentStatus } : f
            ));
            toast({
                title: "Update Failed",
                description: "Could not update feature status.",
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const requiredText = !confirmDialog.currentStatus ? "PERMANENTLY ENABLE" : "PERMANENTLY HIDE";
    const isConfirmEnabled = confirmationText === requiredText;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Feature Management</CardTitle>
                <CardDescription>
                    Control the availability of modules for students. Toggling a feature will immediately reflect on the student dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Feature Name</TableHead>
                            <TableHead>Key</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {features.map((feature) => (
                            <TableRow key={feature.id}>
                                <TableCell className="font-medium">{feature.feature_name}</TableCell>
                                <TableCell className="text-muted-foreground font-mono text-sm">{feature.feature_key}</TableCell>
                                <TableCell>
                                    <Badge variant={feature.is_enabled ? "default" : "secondary"} className={feature.is_enabled ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                                        {feature.is_enabled ? "Active" : "Coming Soon"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center">
                                        <Switch
                                            checked={feature.is_enabled}
                                            onCheckedChange={() => initiateToggle(feature)}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {features.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No features found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => !open && setConfirmDialog(prev => ({ ...prev, isOpen: false }))}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                                {confirmDialog.currentStatus ? "Hide Feature" : "Enable Feature"}
                            </DialogTitle>
                            <DialogDescription>
                                {confirmDialog.currentStatus
                                    ? "This feature will be permanently hidden from the student dashboard."
                                    : "This feature will be permanently enabled for students."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-700">
                                    Type <span className="font-mono font-bold text-red-600 select-none">{requiredText}</span> to confirm:
                                </p>
                                <Input
                                    value={confirmationText}
                                    onChange={(e) => setConfirmationText(e.target.value)}
                                    placeholder={`Type ${requiredText} to confirm`}
                                    className="font-mono"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={confirmDialog.currentStatus ? "destructive" : "default"}
                                onClick={handleConfirmToggle}
                                disabled={!isConfirmEnabled}
                                className={!confirmDialog.currentStatus ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                            >
                                {confirmDialog.currentStatus ? "Hide Feature" : "Enable Feature"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
