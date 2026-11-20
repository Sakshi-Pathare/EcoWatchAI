import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Leaf,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Building2,
  Check,
  AlertCircle,
  HelpCircle,
  Globe,
  Layers,
  Award,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { user, login, register, quickDemoLogin, requestPasswordReset, demoProfiles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'citizen', // 'citizen' | 'municipal_admin'
    municipalityName: 'Pune Municipal Corporation',
    agreedToPledge: true,
  });

  // Forgot password modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotBusy, setForgotBusy] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-charcoal-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score === 1) return { score: 25, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-emerald-500', text: 'text-emerald-700' };
    return { score: 100, label: 'Strong', color: 'bg-[#74D7CB]', text: 'text-[#092421]' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'register') {
      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
      if (!formData.agreedToPledge) {
        setError('Please agree to the Environmental Stewardship Code.');
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === 'login') {
        const authenticated = await login(formData.email, formData.password, rememberMe);
        redirectUser(authenticated);
      } else {
        const newUser = await register(
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: formData.role,
            municipalityName: formData.municipalityName,
          },
          rememberMe
        );
        redirectUser(newUser);
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please check your inputs.');
    } finally {
      setBusy(false);
    }
  };

  const handleQuickDemo = async (roleKey) => {
    setError('');
    setBusy(true);
    try {
      const demo = await quickDemoLogin(roleKey);
      redirectUser(demo);
    } catch (err) {
      setError(err.message || 'Failed to initialize demo session.');
    } finally {
      setBusy(false);
    }
  };

  const redirectUser = (currentUser) => {
    const fromPath = location.state?.from?.pathname;
    if (fromPath) {
      navigate(fromPath, { replace: true });
      return;
    }

    if (currentUser?.role === 'municipal_admin' || currentUser?.role === 'super_admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    if (!forgotEmail) {
      setForgotError('Please enter your email address.');
      return;
    }
    setForgotBusy(true);
    try {
      const res = await requestPasswordReset(forgotEmail);
      setForgotSuccess(res.message);
    } catch (err) {
      setForgotError(err.message || 'Unable to process reset request.');
    } finally {
      setForgotBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-transparent py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#74D7CB]/15 via-transparent to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-[#092421] p-1 border border-[#27403C] shadow-soft flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/images/vasundhara-ai-logo.png"
                alt="Vasundhara AI"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-2xl text-[#10241B]">Vasundhara</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#1B4A45] text-[#74D7CB] border border-[#74D7CB]/40">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-[#2D6A4F] font-bold tracking-widest uppercase">
                Civic Environmental Intelligence
              </p>
            </div>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#10241B] tracking-tight">
            {mode === 'login' ? 'Welcome Back, Steward' : 'Join the Civic Stewardship Network'}
          </h1>
          <p className="text-xs sm:text-sm text-[#556E55] max-w-md mx-auto">
            {mode === 'login'
              ? 'Access real-time GIS pollution intelligence, municipal dispatches, and your environmental impact portfolio.'
              : 'Empower your neighborhood with AI-verified litter mapping and municipal cleanup tracking.'}
          </p>
        </div>

        {/* 1-Click Instant Demo Login Bar */}
        <div className="bg-gradient-to-r from-[#092421] via-[#102D27] to-[#092421] p-4 rounded-2xl border border-[#23584E] text-white shadow-soft space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#74D7CB]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Reviewer / Evaluator Logins:</span>
            </div>
            <span className="text-[10px] text-[#A3D9CE] font-mono bg-[#1B4A45] px-2 py-0.5 rounded-full">
              1-Click Autofill
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('citizen')}
              disabled={busy}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-[#74D7CB]/60 text-left transition-all flex flex-col justify-between group active:scale-95"
            >
              <div className="flex items-center gap-1.5 text-[#74D7CB] font-black text-[11px]">
                <Leaf className="w-3 h-3" /> Citizen Steward
              </div>
              <span className="text-white font-bold text-xs truncate">Alex Morgan</span>
              <span className="text-[10px] text-[#C4EAE2]">Reporting & Karma</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('municipal_admin')}
              disabled={busy}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-[#74D7CB]/60 text-left transition-all flex flex-col justify-between group active:scale-95"
            >
              <div className="flex items-center gap-1.5 text-[#74D7CB] font-black text-[11px]">
                <Building2 className="w-3 h-3" /> Municipal Officer
              </div>
              <span className="text-white font-bold text-xs truncate">Rajesh Sharma</span>
              <span className="text-[10px] text-[#C4EAE2]">PMC Dispatches</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('super_admin')}
              disabled={busy}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-[#74D7CB]/60 text-left transition-all flex flex-col justify-between group active:scale-95"
            >
              <div className="flex items-center gap-1.5 text-[#74D7CB] font-black text-[11px]">
                <ShieldCheck className="w-3 h-3" /> Super Admin
              </div>
              <span className="text-white font-bold text-xs truncate">Dr. Ananya Roy</span>
              <span className="text-[10px] text-[#C4EAE2]">Governance & Audit</span>
            </button>
          </div>
        </div>

        {/* Main Authentication Card */}
        <Card className="border-[#1B4332]/15 shadow-soft-md bg-white">
          <CardBody className="p-6 sm:p-8 space-y-6">
            {/* Segmented Switcher (Sign In / Register) */}
            <div className="bg-[#FAF8F3] p-1 rounded-2xl border border-[#1B4332]/15 flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  mode === 'login'
                    ? 'bg-[#092421] text-[#74D7CB] shadow-sm font-black border border-[#27403C]'
                    : 'text-[#242D2B] hover:text-[#092421]'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                Sign In to Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  mode === 'register'
                    ? 'bg-[#092421] text-[#74D7CB] shadow-sm font-black border border-[#27403C]'
                    : 'text-[#242D2B] hover:text-[#092421]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Create New Account
              </button>
            </div>

            {/* Error & Feedback Alert */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#10241B]">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g. Priya Deshmukh"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-[#10241B] bg-[#FAF8F3] text-charcoal-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#10241B]">
                      Primary Stewardship Role
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleInputChange('role', 'citizen')}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                          formData.role === 'citizen'
                            ? 'bg-[#DEF5F1] border-[#74D7CB] text-[#092421] font-bold shadow-xs ring-1 ring-[#74D7CB]'
                            : 'bg-[#FAF8F3] border-sage-200 text-charcoal-700 hover:bg-white'
                        }`}
                      >
                        <Leaf className="w-4 h-4 text-[#1B4A45] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-extrabold text-xs">Citizen Steward</div>
                          <div className="text-[10px] text-charcoal-500 font-normal">
                            Report litter & cleanups
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInputChange('role', 'municipal_admin')}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                          formData.role === 'municipal_admin'
                            ? 'bg-[#DEF5F1] border-[#74D7CB] text-[#092421] font-bold shadow-xs ring-1 ring-[#74D7CB]'
                            : 'bg-[#FAF8F3] border-sage-200 text-charcoal-700 hover:bg-white'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-[#1B4A45] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-extrabold text-xs">Municipal Official</div>
                          <div className="text-[10px] text-charcoal-500 font-normal">
                            Ward & crew dispatch
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Municipality selection */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#10241B]">
                      Affiliated Municipality
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                      <select
                        value={formData.municipalityName}
                        onChange={(e) => handleInputChange('municipalityName', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-[#10241B] bg-[#FAF8F3] text-charcoal-900 font-semibold"
                      >
                        <option value="Pune Municipal Corporation">Pune Municipal Corporation (PMC)</option>
                        <option value="Brihanmumbai Municipal Corporation">Brihanmumbai Municipal Corporation (BMC)</option>
                        <option value="Pimpri Chinchwad Municipal Corporation">Pimpri Chinchwad Municipal Corporation (PCMC)</option>
                        <option value="Thane Municipal Corporation">Thane Municipal Corporation (TMC)</option>
                      </select>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#10241B]">
                      Mobile Phone <span className="text-charcoal-400 font-normal">(for dispatch alerts)</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-[#10241B] bg-[#FAF8F3] text-charcoal-900 font-medium"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#10241B]">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="steward@domain.eco"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-[#10241B] bg-[#FAF8F3] text-charcoal-900 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#10241B]">
                    Password <span className="text-rose-600">*</span>
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotModalOpen(true);
                        setForgotEmail(formData.email);
                      }}
                      className="text-[11px] font-bold text-[#2D6A4F] hover:text-[#10241B] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={mode === 'login' ? '••••••••••••' : 'At least 8 characters'}
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-[#10241B] bg-[#FAF8F3] text-charcoal-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-charcoal-400 hover:text-charcoal-700"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter (In register mode) */}
                {mode === 'register' && formData.password && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-charcoal-500">Security Strength:</span>
                      <span className={strength.text}>{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-beige-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password (In register mode) */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#10241B]">
                    Confirm Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-[#10241B] bg-[#FAF8F3] text-charcoal-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-2.5 text-charcoal-400 hover:text-charcoal-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-[10px] text-rose-600 font-semibold">Passwords do not match.</p>
                  )}
                </div>
              )}

              {/* Remember Me / Stewardship Pledge */}
              {mode === 'login' ? (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[#242D2B] font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-sage-300 text-[#092421] focus:ring-[#74D7CB] w-3.5 h-3.5"
                    />
                    <span>Remember my session on this device</span>
                  </label>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#DEF5F1]/60 border border-[#98E0D5] text-[11px] space-y-1.5">
                  <label className="flex items-start gap-2 cursor-pointer select-none text-[#092421] font-semibold leading-relaxed">
                    <input
                      type="checkbox"
                      checked={formData.agreedToPledge}
                      onChange={(e) => handleInputChange('agreedToPledge', e.target.checked)}
                      className="rounded border-sage-300 text-[#092421] focus:ring-[#74D7CB] w-3.5 h-3.5 mt-0.5 shrink-0"
                    />
                    <span>
                      I pledge to submit truthful, verified geospatial evidence to safeguard our community environment.
                    </span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                loading={busy}
                className="w-full py-3 rounded-xl font-black text-sm bg-gradient-to-r from-[#092421] via-[#102D27] to-[#092421] text-white hover:shadow-[0_4px_20px_rgba(9,36,33,0.3)] border border-[#74D7CB]/30"
              >
                {mode === 'login' ? 'Sign In to Vasundhara AI' : 'Create My Steward Account'}
              </Button>
            </form>

            {/* Bottom Switch Link */}
            <div className="pt-2 border-t border-beige-200 text-center text-xs text-[#556E55]">
              {mode === 'login' ? (
                <span>
                  New to Vasundhara AI?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError('');
                    }}
                    className="font-extrabold text-[#10241B] hover:text-[#2D6A4F] hover:underline"
                  >
                    Create a free citizen account
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                    className="font-extrabold text-[#10241B] hover:text-[#2D6A4F] hover:underline"
                  >
                    Sign in here
                  </button>
                </span>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Security & Data Safeguards notice */}
        <div className="text-center text-[11px] text-[#556E55] space-y-1">
          <div className="flex items-center justify-center gap-3 font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" /> Municipal-Grade Encryption
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-[#2D6A4F]" /> Zero PII Sold
            </span>
            <span>•</span>
            <Link to="/map" className="hover:underline font-bold text-[#10241B]">
              Public GIS Map
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => {
          setForgotModalOpen(false);
          setForgotSuccess('');
          setForgotError('');
        }}
        title="Reset Your Account Password"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#556E55] leading-relaxed">
            Enter your registered email address below. We'll send you a secure verification link to set a new password.
          </p>

          {forgotSuccess && (
            <div className="p-3 rounded-xl bg-[#DEF5F1] border border-[#74D7CB] text-[#092421] text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1B4A45]" />
              <span>{forgotSuccess}</span>
            </div>
          )}

          {forgotError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-medium">
              {forgotError}
            </div>
          )}

          {!forgotSuccess && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#10241B]">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="steward@domain.eco"
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-[#10241B] bg-[#FAF8F3] text-charcoal-900 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForgotModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={forgotBusy}
                  icon={KeyRound}
                >
                  Dispatch Reset Link
                </Button>
              </div>
            </form>
          )}

          {forgotSuccess && (
            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setForgotModalOpen(false)}
              >
                Close Window
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
