import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const navigate = useNavigate();
    const { signIn, signUp, sendOtp, verifyAdminLogin, setShowOnboarding } = useAuth();
    const { toast } = useToast();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [signupStep, setSignupStep] = useState(1); // 1: Details, 2: OTP
    const [loginStep, setLoginStep] = useState(1); // 1: Credentials, 2: OTP
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);
    const [forgotMode, setForgotMode] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP & New Password

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsLogin(true);
            setForgotMode(false);
            setSignupStep(1);
            setLoginStep(1);
            setForgotStep(1);
            setShowPassword(false);
            setEmail('');
            setPassword('');
            setName('');
            setOtp('');
            setError('');
            setResendTimer(30);
            setCanResend(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // ... existing Timer Effect ... (Needs update for forgotStep)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if ((signupStep === 2 || (isLogin && loginStep === 2) || (forgotMode && forgotStep === 2)) && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [signupStep, loginStep, isLogin, forgotMode, forgotStep, resendTimer]);

    // ... existing Reset Timer Effect ...
    useEffect(() => {
        if (signupStep === 2 || (isLogin && loginStep === 2) || (forgotMode && forgotStep === 2)) {
            setResendTimer(30);
            setCanResend(false);
        }
    }, [signupStep, loginStep, isLogin, forgotMode, forgotStep]);


    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const handleSendOtp = async () => {
        if (!email) {
            setError("Email is required");
            return;
        }
        setLoading(true);
        const { error } = await sendOtp(email);
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setSignupStep(2);
            toast({ title: "OTP Sent", description: "Please check your email" });
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Email is required");
            return;
        }
        setLoading(true);
        try {
            // Call API
            const res = await fetch(`http://localhost:5000/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

            setForgotStep(2);
            toast({ title: "OTP Sent", description: "Check your email for password reset PIN." });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!otp || !password) {
            setError("OTP and new password are required");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), otp, newPassword: password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to reset password');

            toast({ title: "Success", description: "Password reset successfully. Please login." });
            setForgotMode(false);
            setIsLogin(true);
            setLoginStep(1);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        if (isLogin) {
            setLoading(true);
            await signIn(email, password);
            setLoading(false);
            toast({ title: "OTP Resent", description: "Admin OTP has been resent." });
        } else {
            await handleSendOtp();
        }
        setResendTimer(30);
        setCanResend(false);
    };
    const handleForgotResend = async () => {
        if (!canResend) return;
        await handleForgotPassword();
        setForgotStep(2); // Stay on step 2
        setResendTimer(30);
        setCanResend(false);
    };

    const handleSignup = async () => {
        if (!otp || !name || !email || !password) {
            setError('All fields are required');
            return;
        }
        setLoading(true);
        const { error } = await signUp(email, password, name, otp);
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            onClose();
        }
    };

    // ... existing handleSubmit ...
    const handleSubmit = async () => {
        setError('');
        if (forgotMode) {
            if (forgotStep === 1) await handleForgotPassword();
            else await handleResetPassword();
            return;
        }
        // ... existing login/signup logic
        try {
            const trimmedEmail = email.trim();
            if (isLogin) {
                if (loginStep === 1) {
                    setLoading(true);
                    const { error, user, status } = await signIn(trimmedEmail, password);
                    setLoading(false);
                    if (error) throw new Error(error.message);

                    if (status === 'OTP_SENT') {
                        setLoginStep(2);
                        return;
                    }

                    if (user?.role === 'ADMIN') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/dashboard');
                    }
                    onClose();
                } else {
                    // Admin OTP Verify
                    if (!otp) {
                        setError('Please enter the OTP');
                        return;
                    }
                    setLoading(true);
                    const { error, user } = await verifyAdminLogin(trimmedEmail, otp);
                    setLoading(false);
                    if (error) throw new Error(error.message);

                    if (user?.role === 'ADMIN') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/dashboard');
                    }
                    onClose();
                }
            } else {
                // Signup Flow
                if (signupStep === 1) {
                    await handleSendOtp();
                } else {
                    await handleSignup();
                }
            }
        } catch (err: any) {
            setLoading(false);
            setError(err.message || 'An error occurred');
        }
    };


    // UI Helpers
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setForgotMode(false);
        setSignupStep(1);
        setLoginStep(1);
        setForgotStep(1);
        setError('');
        setOtp('');
    }

    if (!isOpen) return null;

    const isOtpStep = (!isLogin && signupStep === 2) || (isLogin && loginStep === 2) || (forgotMode && forgotStep === 2);
    const isButtonDisabled = loading || (isOtpStep && !otp);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[4px]"
            onClick={handleBackdropClick}
        >
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-10">
            </div>

            <div
                ref={modalRef}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-10 relative animate-scale-in"
                style={{
                    animation: 'scale-up-center 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="text-left mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        {forgotMode ? (forgotStep === 1 ? 'Reset Password' : 'New Password') :
                            isLogin ? (loginStep === 1 ? 'Login' : 'Admin Verification') : (signupStep === 1 ? 'Sign Up' : 'Verify Email')}
                    </h2>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* INPUT FIELDS */}
                        {((!isLogin && signupStep === 2) || (isLogin && loginStep === 2) || (forgotMode && forgotStep === 2)) ? (
                            <div className="space-y-4 animate-fade-in-up">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Enter OTP</label>
                                    <Input
                                        type="text"
                                        placeholder="000 - 000"
                                        className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 rounded-xl px-4 text-center tracking-widest text-lg"
                                        value={otp}
                                        maxLength={6}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>

                                {forgotMode && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">New Password</label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 rounded-xl px-4 pr-10"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <p className="text-sm text-slate-500 text-center">
                                    We sent a code to <span className="font-medium text-slate-900">{email}</span>
                                </p>
                                <div className="text-center mt-2">
                                    {canResend ? (
                                        <button
                                            onClick={forgotMode ? handleForgotResend : handleResendOtp}
                                            disabled={loading}
                                            className="text-sm text-emerald-600 font-semibold hover:underline"
                                        >
                                            Resend OTP
                                        </button>
                                    ) : (
                                        <span className="text-sm text-slate-400">
                                            Resend OTP in {resendTimer}s
                                        </span>
                                    )}
                                </div>
                                <button onClick={() => {
                                    if (forgotMode) {
                                        setForgotStep(1);
                                    } else if (isLogin) {
                                        setLoginStep(1);
                                    } else {
                                        setSignupStep(1);
                                    }
                                }} className="text-sm text-emerald-600 hover:underline w-full text-center mt-4">
                                    {forgotMode ? 'Change Email' : 'Change details'}
                                </button>
                            </div>
                        ) : (
                            // Standard Form
                            <>
                                {!isLogin && !forgotMode && (
                                    <div className="space-y-2 animate-fade-in-up">
                                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 rounded-xl px-4"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <Input
                                        type="email"
                                        placeholder="yourname@gmail.com"
                                        className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 rounded-xl px-4"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {!forgotMode && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Password</label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 rounded-xl px-4 pr-10"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {isLogin && !forgotMode && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="keep-logged-in" className="border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 rounded-md" />
                                <label
                                    htmlFor="keep-logged-in"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                                >
                                    Keep me logged in
                                </label>
                            </div>
                            <button
                                onClick={() => { setIsLogin(false); setForgotMode(true); }}
                                className="text-sm font-medium text-slate-500 hover:text-slate-800 underline-offset-4 hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}

                    {!forgotMode && (
                        <div className="text-center mb-4">
                            <p className="text-slate-500">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={toggleMode}
                                    className="text-emerald-500 hover:underline font-medium ml-1"
                                    type="button"
                                >
                                    {isLogin ? 'Signup' : 'Login'}
                                </button>
                            </p>
                        </div>
                    )}

                    {forgotMode && (
                        <div className="text-center mb-4">
                            <button
                                onClick={() => { setForgotMode(false); setIsLogin(true); setError(''); }}
                                className="text-slate-500 hover:text-slate-800 text-sm font-medium"
                                type="button"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={isButtonDisabled}
                        className={`w-full h-12 text-lg font-semibold rounded-xl transition-all duration-300 ${isButtonDisabled
                                ? 'bg-emerald-200 text-emerald-700 shadow-none cursor-not-allowed'
                                : 'bg-[#10b981] hover:bg-[#059669] text-white shadow-lg hover:shadow-emerald-500/20'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                {forgotMode ? 'Processing...' :
                                    isLogin ? (loginStep === 1 ? 'Signing In..' : 'Verifying...') : (signupStep === 1 ? 'Sending OTP...' : 'Verifying...')}
                            </>
                        ) : (
                            forgotMode ? (forgotStep === 1 ? 'Send Reset Link' : 'Reset Password') :
                                isLogin ? (loginStep === 1 ? 'Login' : 'Verify OTP') : (signupStep === 1 ? 'Verify Email' : 'Create Account')
                        )}
                    </Button>
                </div>
            </div>
            <style>{`
                @keyframes scale-up-center {
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
