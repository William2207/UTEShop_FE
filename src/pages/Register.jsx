import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  requestRegisterOtp,
  verifyRegister,
  clearFeedback,
} from "../features/auth/authSlice";
import OtpInput from "../components/utils/OtpInput";

export default function Register() {
  const dispatch = useDispatch();
  const { loading, error, message, user } = useSelector((s) => s.auth);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");

  // Clear thông báo khi unmount
  useEffect(() => {
    return () => {
      dispatch(clearFeedback());
    };
  }, [dispatch]);

  // Gửi OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Vui lòng nhập email");
      return;
    }
    try {
      await dispatch(requestRegisterOtp({ email })).unwrap();
      setStep(2);
    } catch (err) {
      console.error("Send OTP failed:", err);
    }
  };

  // Xác minh OTP + tạo tài khoản
  const handleVerify = async (e) => {
    e.preventDefault();

    // Kiểm tra trước khi gửi
    if (!email || !username || !password || code.length !== 6) {
      alert("Vui lòng điền đầy đủ thông tin và OTP 6 chữ số");
      return;
    }
    if (username.length < 2) {
      alert("Họ tên phải ≥ 2 ký tự");
      return;
    }
    if (password.length < 6) {
      alert("Mật khẩu phải ≥ 6 ký tự");
      return;
    }

    try {
      // Gửi đúng field name cho backend Zod validate
      await dispatch(
        verifyRegister({ email, code, username, password })
      ).unwrap();
    } catch (err) {
      console.error("Verify failed:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Đăng ký (OTP)</h1>

      {message && (
        <div className="p-3 mb-3 bg-green-50 border border-green-200 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 mb-3 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
          />
          <button
            disabled={loading}
            className="w-full rounded bg-black text-white py-2"
          >
            {loading ? "Đang gửi..." : "Gửi OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify} className="space-y-4">
          <OtpInput value={code} onChange={setCode} />
          <input
            required
            value={username}
            onChange={(e) => setName(e.target.value)}
            placeholder="Họ tên"
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu (>=6 ký tự)"
            className="w-full border rounded px-3 py-2"
          />
          <button
            disabled={loading || code.length !== 6}
            className="w-full rounded bg-black text-white py-2"
          >
            {loading ? "Đang xác minh..." : "Hoàn tất đăng ký"}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full border rounded py-2"
          >
            Gửi lại email khác
          </button>
        </form>
      )}

      {user && (
        <div className="mt-4 text-sm">
          Đăng ký xong cho: <b>{user.email}</b>
        </div>
      )}
    </div>
  );
}
