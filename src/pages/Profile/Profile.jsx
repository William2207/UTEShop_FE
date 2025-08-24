import { useState } from "react";
import api from "@/api/axiosConfig";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MapPin, Edit, Trash2, Plus, Lock } from "lucide-react";

export function UserProfile() {
  const [activeTab, setActiveTab] = useState("personal");

  // Ex data
  // const userInfo = {
  //   name: "Sarah Johnson",
  //   email: "sarah.johnson@email.com",
  //   phone: "+1 (555) 123-4567",
  //   avatar: "/professional-woman-avatar.png",
  // };
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userResponse, addressesResponse] = await Promise.all([
          api.get("/user/profile"), // Dùng instance 'api'
        ]);

        setUserInfo(userResponse.data);
      } catch (err) {
        // Interceptor cũng có thể xử lý lỗi, ví dụ nếu token hết hạn
        console.error("Lỗi khi fetch profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

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
        <p className="text-muted-foreground text-lg">
          S'habiller est un mode de vie.
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={userInfo?.avatar || "/placeholder.svg"}
                alt={userInfo?.name}
              />
              <AvatarFallback className="text-lg">SJ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {userInfo?.name}
              </h2>
              <p className="text-muted-foreground">{userInfo?.email}</p>
              <Badge variant="secondary" className="mt-2">
                Premium Member
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
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

        {/* Personal Info Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Cá Nhân</CardTitle>
              <CardDescription>
                Thay đổi thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ Tên</Label>
                  <Input id="name" defaultValue={userInfo?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={userInfo?.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số Điện Thoại</Label>
                  <Input id="phone" defaultValue={userInfo?.phone} />
                </div>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button className="bg-primary hover:bg-primary/90">
                  Lưu Thay Đổi
                </Button>
                <Button variant="outline">Hủy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Đổi Mật Khẩu</CardTitle>
              <CardDescription>
                Đảm bảo tài khoản của bạn được bảo mật
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mật Khẩu Hiện Tại</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter your current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Mật Khẩu Mới</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter your new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Nhập Lại Mật Khẩu Mới</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Yêu Cầu:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Nhiều hơn 8 ký tự</li>
                  <li>• Bao gồm ít nhất 1 ký tự in hoa</li>
                  <li>• Bao gồm ít nhất 1 chữ số</li>
                  <li>• Bao gồm ít nhất 1 ký tự đặc biệt</li>
                </ul>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button className="bg-primary hover:bg-primary/90">
                  Lưu
                </Button>
                <Button variant="outline">Hủy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Địa Chỉ</CardTitle>
                <CardDescription>
                  Thay đổi địa chỉ nhận hàng của bạn
                </CardDescription>
              </div>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Thêm Địa Chỉ
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{address.type}</p>
                          {address.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {userInfo.address}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
