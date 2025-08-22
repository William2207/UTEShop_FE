import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";   // 👈 thêm
import { loginUser } from "../features/auth/authSlice";
import TextField from "../components/TextField";
import Button from "../components/Button";
import AuthCard from "../components/AuthCard";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();  // 👈 thêm
  const { loading, error, user } = useSelector((s) => s.auth); // 👈 lấy user từ redux
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  // 👇 theo dõi user, nếu login thành công thì chuyển trang
  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // hoặc "/" tuỳ bạn muốn
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthCard title="Đăng nhập">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <TextField
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </AuthCard>
    </div>
  );
}
