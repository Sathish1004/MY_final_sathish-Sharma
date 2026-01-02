import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Shield, CreditCard, Wallet, Building, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Payment() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
        toast({
            title: "Payment Successful! 🎉",
            description: "Welcome to Pro Workspace. Redirecting you to dashboard...",
        });

        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8 text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Order Summary */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Subscription</h1>
                            <p className="text-slate-600">Upgrade your account to unlock full potential.</p>
                        </div>

                        <Card className="border-0 shadow-lg bg-white overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-slate-900">Pro Workspace</CardTitle>
                                        <CardDescription>Monthly subscription</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-slate-900">₹26</div>
                                        <div className="text-sm text-slate-500">/month</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <div className="border-t border-slate-100 pt-4 space-y-3">
                                    {[
                                        "Unlimited Courses & IDE",
                                        "Mentorship & Job Referrals",
                                        "Events & Workshops",
                                        "Certificates & Badge"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 mt-4">
                                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-blue-900">Secure Payment</h4>
                                        <p className="text-xs text-blue-700 mt-1">
                                            Your payment information is encrypted and secure.
                                            30-day money-back guarantee.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Payment Details</h2>

                        <div className="grid grid-cols-3 gap-3 mb-8">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                    }`}
                            >
                                <CreditCard className="h-6 w-6" />
                                <span className="text-xs font-medium">Card</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('upi')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'upi'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                    }`}
                            >
                                <Wallet className="h-6 w-6" />
                                <span className="text-xs font-medium">UPI</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('netbanking')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'netbanking'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                    }`}
                            >
                                <Building className="h-6 w-6" />
                                <span className="text-xs font-medium">Net Banking</span>
                            </button>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input id="card-number" placeholder="0000 0000 0000 0000" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input id="expiry" placeholder="MM/YY" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input id="cvv" placeholder="123" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Cardholder Name</Label>
                                    <Input id="name" placeholder="John Doe" />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Pay ₹26.00'
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
