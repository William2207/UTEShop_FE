import { useEffect, useState } from "react";
import api from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [me, setMe] = useState(user);

  useEffect(() => {
    async function fetchMe() {
      try {
        const { data } = await api.get("/api/auth/me");
        setMe(data.user);
      } catch (e) {
        console.error(e);
      }
    }
    fetchMe();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-semibold">Xin chào 👋</h1>
        <p className="text-gray-700">Email: {me?.email}</p>
        <button onClick={() => dispatch(logout())} className="mt-6 rounded-xl border px-4 py-2">
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
