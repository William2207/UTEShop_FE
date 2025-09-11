// src/pages/UserProfile.jsx

import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "@/api/axiosConfig"; // dùng một import thống nhất
import { logout } from "../../features/auth/authSlice";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { User, MapPin, Edit, Trash2, Plus, Lock } from "lucide-react";

// =============== Component ===============
const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Tabs
  const [activeTab, setActiveTab] = useState("personal");

  // Profile
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Personal form
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
  });

  // Avatar
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  // Password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Addresses (giữ đúng ý đồ `addresses.map(...)` trong code gốc)
  const [addresses, setAddresses] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null); // id hoặc 'new'
  const [addressDraft, setAddressDraft] = useState({
    type: "Home",
    street: "",
    city: "",
    isDefault: false,
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // 1) Chưa login thì điều hướng sang /login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // 2) Fetch profile + addresses
  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [userRes, addrRes] = await Promise.all([
          api.get("/user/profile"),
          api.get("/user/addresses").catch(() => ({ data: [] })), // nếu API chưa có thì không lỗi
        ]);

        if (!isMounted) return;
        setUserInfo(userRes.data);
        setAddresses(Array.isArray(addrRes.data) ? addrRes.data : []);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        console.error("Fetch profile/addresses error:", err);
        setError(err?.message || "Không thể tải hồ sơ");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // 3) Đồng bộ form với userInfo
  useEffect(() => {
    if (!userInfo) return;

    let birth = "";
    if (userInfo.birthDate) {
      const d = new Date(userInfo.birthDate);
      if (!Number.isNaN(d.getTime())) birth = d.toISOString().split("T")[0];
    }

    setFormData({
      name: userInfo.name || "",
      email: userInfo.email || "",
      phone: userInfo.phone || "",
      birthDate: birth,
    });
  }, [userInfo]);

  // =============== Handlers ===============

  // Personal info
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const res = await api.put("/user/profile", { ...formData });
      setUserInfo(res.data);
      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error("Update profile error:", err);
      alert(err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Avatar
  const handleAvatarClick = () => {
    if (!isUploadingAvatar) fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const fd = new FormData();
    fd.append("avatar", file);

    try {
      const res = await api.post("/user/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUserInfo(res.data);
      alert("Cập nhật avatar thành công!");
    } catch (err) {
      console.error("Upload avatar error:", err);
      alert(err?.response?.data?.message || "Upload avatar thất bại.");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Password
  const handlePasswordInputChange = (e) => {
    const { id, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới không khớp.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await api.put("/user/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      alert(res.data?.message || "Đổi mật khẩu thành công.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert(err?.response?.data?.message || "Đã có lỗi xảy ra.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Addresses
  const startAddAddress = () => {
    setEditingAddressId("new");
    setAddressDraft({ type: "Home", street: "", city: "", isDefault: false });
  };

  const startEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressDraft({
      type: addr.type || "Home",
      street: addr.street || addr.address || "", // phòng khi backend trả key khác
      city: addr.city || "",
      isDefault: !!addr.isDefault,
    });
  };

  const cancelEditAddress = () => {
    setEditingAddressId(null);
    setAddressDraft({ type: "Home", street: "", city: "", isDefault: false });
  };

  const saveAddress = async () => {
    setIsSavingAddress(true);
    try {
      if (editingAddressId === "new") {
        const res = await api.post("/user/addresses", addressDraft);
        setAddresses((prev) => [res.data, ...prev]);
      } else {
        const res = await api.put(`/user/addresses/${editingAddressId}`, addressDraft);
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingAddressId ? res.data : a))
        );
      }
      cancelEditAddress();
    } catch (err) {
      console.error("Save address error:", err);
      alert(err?.response?.data?.message || "Lưu địa chỉ thất bại.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!confirm("Xóa địa chỉ này?")) return;
    try {
      await api.delete(`/user/addresses/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Delete address error:", err);
      alert(err?.response?.data?.message || "Xóa địa chỉ thất bại.");
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      const res = await api.put(`/user/addresses/${id}/default`);
      // Giả sử API trả về danh sách mới hoặc object vừa set default:
      // Ở đây cập nhật local: đặt isDefault cho id và tắt ở các item khác
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      );
      alert(res.data?.message || "Đã đặt địa chỉ mặc định.");
    } catch (err) {
      console.error("Set default error:", err);
      alert(err?.response?.data?.message || "Không thể đặt mặc định.");
    }
  };

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // =============== Render ===============
  if (!user) return null;
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-4xl font-bold text-foreground mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Trang cá nhân
        </h1>
        <p className="text-muted-foreground text-lg">S'habiller est un mode de vie.</p>
      </div>

      {/* Profile Overview */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar
                className={`h-20 w-20 ${
                  isUploadingAvatar ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={handleAvatarClick}
              >
                <AvatarImage
                  src={userInfo?.avatarUrl || "/placeholder.svg"}
                  alt={userInfo?.name || "avatar"}
                />
                <AvatarFallback className="text-lg">
                  {(userInfo?.name || "U").toString().slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 rounded-full">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">{userInfo?.name}</h2>
              <p className="text-muted-foreground">{userInfo?.email}</p>
              <Badge variant="secondary" className="mt-2">
                Premium Member
              </Badge>
            </div>

            <div className="ml-auto">
              <Button variant="outline" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Thông Tin Cá Nhân
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Mật Khẩu
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Địa Chỉ
          </TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Cá Nhân</CardTitle>
              <CardDescription>Thay đổi thông tin cá nhân của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ Tên</Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số Điện Thoại</Label>
                  <Input id="phone" value={formData.phone} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Ngày sinh</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                  {isUpdating ? "Đang lưu..." : "Lưu Thay Đổi"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // khôi phục theo userInfo
                    let birth = "";
                    if (userInfo?.birthDate) {
                      const d = new Date(userInfo.birthDate);
                      if (!Number.isNaN(d.getTime())) {
                        birth = d.toISOString().split("T")[0];
                      }
                    }
                    setFormData({
                      name: userInfo?.name || "",
                      email: userInfo?.email || "",
                      phone: userInfo?.phone || "",
                      birthDate: birth,
                    });
                  }}
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Đổi Mật Khẩu</CardTitle>
              <CardDescription>Đảm bảo tài khoản của bạn được bảo mật</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật Khẩu Hiện Tại</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật Khẩu Mới</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Nhập Lại Mật Khẩu Mới</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordInputChange}
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Yêu Cầu:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Nhiều hơn 8 ký tự</li>
                  <li>• Ít nhất 1 ký tự in hoa</li>
                  <li>• Ít nhất 1 chữ số</li>
                  <li>• Ít nhất 1 ký tự đặc biệt</li>
                </ul>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button onClick={handleChangePassword} disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? "Đang lưu..." : "Lưu"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
                  }
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Địa Chỉ</CardTitle>
                <CardDescription>Thay đổi địa chỉ nhận hàng của bạn</CardDescription>
              </div>
              {editingAddressId === null && (
                <Button onClick={startAddAddress}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Địa Chỉ
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Form thêm/sửa */}
                {editingAddressId !== null && (
                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="addr-type">Loại</Label>
                        <Input
                          id="addr-type"
                          value={addressDraft.type}
                          onChange={(e) =>
                            setAddressDraft((prev) => ({ ...prev, type: e.target.value }))
                          }
                          placeholder="Home / Office ..."
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="addr-street">Địa chỉ</Label>
                        <Input
                          id="addr-street"
                          value={addressDraft.street}
                          onChange={(e) =>
                            setAddressDraft((prev) => ({ ...prev, street: e.target.value }))
                          }
                          placeholder="Số nhà, đường..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addr-city">Thành phố</Label>
                        <Input
                          id="addr-city"
                          value={addressDraft.city}
                          onChange={(e) =>
                            setAddressDraft((prev) => ({ ...prev, city: e.target.value }))
                          }
                          placeholder="TP. HCM, Hà Nội..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Mặc định</Label>
                        <Button
                          type="button"
                          variant={addressDraft.isDefault ? "default" : "outline"}
                          onClick={() =>
                            setAddressDraft((prev) => ({ ...prev, isDefault: !prev.isDefault }))
                          }
                        >
                          {addressDraft.isDefault ? "Đang là mặc định" : "Đặt làm mặc định"}
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveAddress} disabled={isSavingAddress}>
                        {isSavingAddress ? "Đang lưu..." : "Lưu"}
                      </Button>
                      <Button variant="outline" onClick={cancelEditAddress}>
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}

                {/* Danh sách địa chỉ */}
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{address.type || "Home"}</p>
                            {address.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {address.street || address.address}
                          </p>
                          <p className="text-sm text-muted-foreground">{address.city}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDefaultAddress(address.id)}
                            title="Đặt làm mặc định"
                          >
                            Mặc định
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditAddress(address)}
                          title="Sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAddress(address.id)}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  editingAddressId === null && (
                    <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                      <p className="text-muted-foreground mb-4">
                        Bạn chưa có địa chỉ nào được lưu.
                      </p>
                      <Button onClick={startAddAddress}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm địa chỉ mới
                      </Button>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
