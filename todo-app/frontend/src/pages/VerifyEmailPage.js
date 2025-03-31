import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import VerificationCodeInput from '../components/VerificationCodeInput';

export default function VerifyEmailPage() {
  const { state } = useLocation();
  const { verifyCode, signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const email = state?.email || 'your email';

  const handleVerify = async (code) => {
    try {
      setLoading(true);
      setError('');
      const { error } = await verifyCode(email, code);
      if (error) throw error;
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <FaEnvelope className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              We've sent a verification code to <span className="font-medium">{email}</span>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <VerificationCodeInput onComplete={handleVerify} />
          
          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}

          {loading && (
            <p className="mt-4 text-sm text-gray-600 text-center">Verifying...</p>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive a code? <button 
              className="text-blue-600 hover:text-blue-500"
              onClick={async () => {
                try {
                  setLoading(true);
                  const { error } = await signUp(email, '');
                  if (error) throw error;
                } catch (err) {
                  setError('Failed to resend code: ' + err.message);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}