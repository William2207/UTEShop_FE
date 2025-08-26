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
  const { loading, error, message } = useSelector((s) => s.auth);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // Lỗi cục bộ (client-side), khác với error từ Redux (server-side)
  const [localError, setLocalError] = useState(null);

  // Clear feedback khi unmount
  useEffect(() => {
    return () => dispatch(clearFeedback());
  }, [dispatch]);

  // Clear feedback + lỗi cục bộ khi đổi step
  useEffect(() => {
    setLocalError(null);
    dispatch(clearFeedback());
  }, [step, dispatch]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLocalError(null);

    // Validate cơ bản phía client
    if (!email) {
      return setLocalError("Vui lòng nhập email.");
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return setLocalError("Email không hợp lệ.");
    }

    try {
      // ✅ Quan trọng: truyền object { email } thay vì string
      await dispatch(requestRegisterOtp({ email })).unwrap();
      setStep(2);
    } catch (err) {
      // err có thể là { message, errors }
      const msg =
        err?.errors?.[0]?.msg ||
        err?.message ||
        "Không thể gửi OTP. Vui lòng thử lại.";
      setLocalError(msg);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLocalError(null);

    // Validate cơ bản phía client
    if (code.length !== 6) {
      return setLocalError("Mã OTP phải gồm 6 ký tự.");
    }
    if (!name.trim()) {
      return setLocalError("Vui lòng nhập họ tên.");
    }
    if (password.length < 6) {
      return setLocalError("Mật khẩu tối thiểu 6 ký tự.");
    }

    try {
      await dispatch(verifyRegister({ email, code, name, password })).unwrap();
      // Tuỳ luồng của bạn: có thể chuyển hướng sang /login hoặc hiển thị message
      // Ví dụ: reset form
      // setStep(1); setEmail(""); setCode(""); setName(""); setPassword("");
    } catch (err) {
      const msg =
        err?.errors?.[0]?.msg ||
        err?.message ||
        "Xác minh OTP thất bại. Vui lòng thử lại.";
      setLocalError(msg);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Đăng ký (OTP)</h1>

      {/* Thông báo thành công từ server */}
      {message && (
        <div className="p-3 mb-3 bg-green-50 border border-green-200 rounded text-green-800">
          {message}
        </div>
      )}

      {/* Lỗi server từ Redux */}
      {error && (
        <div className="p-3 mb-3 bg-red-50 border border-red-200 rounded text-red-800">
          {typeof error === "string" ? error : error?.message || "Có lỗi xảy ra"}
        </div>
      )}

      {/* Lỗi cục bộ (client-side) */}
      {localError && (
        <div className="p-3 mb-3 bg-red-50 border border-red-200 rounded text-red-800">
          {localError}
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
            autoComplete="email"
          />
          <button
            disabled={loading || !email}
            className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Họ tên"
            className="w-full border rounded px-3 py-2"
            autoComplete="name"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu (>= 6 ký tự)"
            className="w-full border rounded px-3 py-2"
            autoComplete="new-password"
          />
          <button
            disabled={loading || code.length !== 6 || !name || password.length < 6}
            className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
          >
            {loading ? "Đang xác minh..." : "Hoàn tất đăng ký"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setCode("");
              dispatch(clearFeedback());
            }}
            className="w-full border rounded py-2"
          >
            Dùng email khác
          </button>
        </form>
      )}
    </div>
  );
}
