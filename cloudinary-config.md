# Hướng dẫn cấu hình Cloudinary Upload

## Bước 1: Đăng ký tài khoản Cloudinary
1. Truy cập https://cloudinary.com/
2. Đăng ký tài khoản miễn phí
3. Xác nhận email và đăng nhập

## Bước 2: Lấy thông tin cấu hình
1. Vào Dashboard của Cloudinary
2. Copy **Cloud Name** từ phần "Product Environment Credentials"
3. Vào **Settings** > **Upload** 
4. Tạo một **Upload Preset** mới:
   - Click "Add upload preset"
   - Đặt tên (ví dụ: `fashion_products`)
   - Chọn **Signing Mode**: "Unsigned" (để không cần API key)
   - Save

## Bước 3: Cấu hình trong ứng dụng
File `.env` đã được tạo sẵn trong thư mục `UTEShop_FE` với nội dung (sử dụng VITE prefix):

```
VITE_CLOUDINARY_CLOUD_NAME=dx8ffnhq3
VITE_CLOUDINARY_UPLOAD_PRESET=fashion
```

**Lưu ý:** 
- Vì dự án sử dụng Vite, environment variables phải có prefix `VITE_`
- Nếu bạn muốn thay đổi, cập nhật các giá trị trong file `.env`

## Bước 4: Restart ứng dụng
Sau khi cấu hình xong, restart lại React app để load biến môi trường mới.

## Lưu ý bảo mật
- Không commit file `.env` lên git
- Đảm bảo upload preset được cấu hình đúng quyền
- Có thể giới hạn file size và format trong Cloudinary settings
