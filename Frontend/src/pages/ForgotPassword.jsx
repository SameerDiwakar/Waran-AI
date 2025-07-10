import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('checking'); // checking, valid, invalid, submitting, success
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setError('Reset link is invalid or expired. Please request a new one.');
      return;
    }
    axios.get(`/reset-password/validate?token=${token}`)
      .then(res => {
        if (res.data.valid) {
          setStatus('valid');
        } else {
          setStatus('invalid');
          setError(res.data.message || 'Reset link is invalid or expired.');
        }
      })
      .catch(() => {
        setStatus('invalid');
        setError('Reset link is invalid or expired.');
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await axios.post('/reset-password', { token, newPassword });
      setStatus('success');
      toast.success('Password reset successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus('valid');
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'checking' && <div>Checking link…</div>}
          {status === 'invalid' && <div className="text-red-500">{error}</div>}
          {status === 'valid' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
                This reset link can be used once. Please choose a strong password and note it down.
              </div>
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                minLength={8}
                required
                autoFocus
              />
              <Button type="submit" className="w-full" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Resetting…' : 'Reset Password'}
              </Button>
            </form>
          )}
          {status === 'success' && <div>Password reset successful! Redirecting to login…</div>}
        </CardContent>
        <CardFooter>
          <Button variant="link" onClick={() => navigate('/login')}>Back to Login</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword; 