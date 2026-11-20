import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, KeyRound, Leaf, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Card, CardBody, CardHeader } from '../components/common/Card.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function defaultDestination(user) {
  if (user.role === 'citizen') return '/dashboard';
  return user.role === 'super_admin' ? '/superadmin' : '/admin';
}

export function LoginPage() {
  const { user, loading, loadError, login, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!loading && user) return <Navigate to={defaultDestination(user)} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const authenticatedUser = mode === 'register'
        ? await register(form)
        : await login(form.email, form.password);
      const requestedPath = location.state?.from?.pathname;
      const allowedRequestedPath = requestedPath && (
        authenticatedUser.role === 'citizen'
          ? ['/dashboard', '/report', '/my-reports'].includes(requestedPath)
          : authenticatedUser.role === 'super_admin'
            ? ['/admin', '/cleanups', '/hotspots', '/superadmin', '/admin/map'].includes(requestedPath)
            : ['/admin', '/cleanups', '/hotspots', '/admin/map'].includes(requestedPath)
      );
      navigate(allowedRequestedPath ? requestedPath : defaultDestination(authenticatedUser), { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
      <Card className="border-sage-200 shadow-soft-md">
        <CardHeader
          title={mode === 'login' ? 'Sign in to Vasundhara AI' : 'Create a citizen account'}
          subtitle="Municipal access is assigned by a platform super administrator."
          icon={mode === 'login' ? ShieldCheck : Leaf}
        />
        <CardBody>
          {(error || loadError) && <div role="alert" className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm">{error || loadError}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <label className="block text-sm font-semibold text-charcoal-800">
                  Full name
                  <input
                    autoComplete="name"
                    required
                    maxLength={120}
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-3 py-2.5 font-normal"
                  />
                </label>
                <label className="block text-sm font-semibold text-charcoal-800">
                  Phone (optional)
                  <input
                    autoComplete="tel"
                    maxLength={40}
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-3 py-2.5 font-normal"
                  />
                </label>
              </>
            )}
            <label className="block text-sm font-semibold text-charcoal-800">
              Email
              <input
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-3 py-2.5 font-normal"
              />
            </label>
            <label className="block text-sm font-semibold text-charcoal-800">
              Password
              <input
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                minLength={mode === 'register' ? 12 : 1}
                maxLength={128}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-3 py-2.5 font-normal"
              />
              {mode === 'register' && <span className="mt-1 block text-xs text-charcoal-500">Use at least 12 characters.</span>}
            </label>
            <Button type="submit" variant="primary" icon={mode === 'login' ? KeyRound : ArrowRight} loading={busy} className="w-full">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 border-t border-sage-100 pt-4 text-center text-sm text-charcoal-600">
            {mode === 'login' ? 'New citizen reporter?' : 'Already registered?'}{' '}
            <button
              type="button"
              onClick={() => { setError(''); setMode(mode === 'login' ? 'register' : 'login'); }}
              className="font-bold text-forest-800 hover:underline"
            >
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-charcoal-500">
            <Link to="/" className="font-semibold text-forest-800 hover:underline">Return to public map and reports</Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
