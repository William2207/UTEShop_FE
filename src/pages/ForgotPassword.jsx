import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestResetOtp, verifyReset, clearFeedback } from '../features/auth/authSlice';
import OtpInput from '../components/OtpInput';

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector(s => s.auth);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => () => { dispatch(clearFeedback()); }, [dispatch]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    await dispatch(requestResetOtp(email)).unwrap();
    setStep(2);
  };
  const handleVerify = async (e) => {
    e.preventDefault();
    await dispatch(verifyReset({ email, code, newPassword })).unwrap();
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Quên mật khẩu (OTP)</h1>
      {message && <div className="p-3 mb-3 bg-green-50 border border-green-200 rounded">{message}</div>}
      {error && <div className="p-3 mb-3 bg-red-50 border border-red-200 rounded">{error}</div>}

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                 placeholder="Email" className="w-full border rounded px-3 py-2" />
          <button disabled={loading} className="w-full rounded bg-black text-white py-2">
            {loading ? 'Đang gửi...' : 'Gửi OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify} className="space-y-4">
          <OtpInput value={code} onChange={setCode} />
          <input type="password" required value={newPassword} onChange={e=>setNewPassword(e.target.value)}
                 placeholder="Mật khẩu mới (>=6)" className="w-full border rounded px-3 py-2" />
          <button disabled={loading || code.length !== 6} className="w-full rounded bg-black text-white py-2">
            {loading ? 'Đang xác minh...' : 'Đổi mật khẩu'}
          </button>
          <button type="button" onClick={()=>setStep(1)} className="w-full border rounded py-2">Gửi lại email khác</button>
        </form>
      )}
    </div>
  );
}
