Cài đặt Visual Studio Code 
Cài đặt Android Studio : Tạo máy ảo 
Cài đặt Python : Cài các biến môi trường
Cài đặt Pycharm Community Edition 2023.3.4
Cài đặt MySQL WorkBench 8.0 CE

Phần 1: Cài đặt Backend
1. Chuẩn bị môi trường:
Cài đặt Python 3.7 trở lên.
Cài đặt virtual environment:
python3 -m venv venv ( Bình thường thì nó tự cài khi tải Python )
Kích hoạt virtual environment:
Trên Windows: venv\Scripts\activate
Trên macOS/Linux: source venv/bin/activate

2. Cài đặt các dependency:
Cài đặt các package cần thiết từ file requirements.txt:
"pip install -r requirements.txt"

3. Cấu hình database:
Tạo database MySQL và cập nhật thông tin kết nối trong file settings.py.

4. Chạy migrations:
Áp dụng migrations để tạo bảng trong database: "python manage.py migrate"

5. Tạo superuser:
Tạo tài khoản quản trị viên để truy cập trang admin: "python manage.py createsuperuser"

Một số tài khoản được cung cấp để đăng nhập với 3 roles :
****

Tài khoản role admin : tk: admin pw: admin
Tài khoản role employer (nhà tuyền dụng ) : tk: jessica01 pw: password123
Tài khoản role applicant (ứng viên)  : tk: anna25 pw: password123

***

6. Chạy server:
Khởi động server Django: "python manage.py runserver"

Phần 2: Cài đặt Frontend
1. Cài đặt Node.js và npm:
Tải và cài đặt Node.js (bao gồm npm) từ https://nodejs.org/.

2. Cài đặt Expo CLI:
Cài đặt Expo CLI globally: "npm install -g expo-cli"

3. Điều hướng đến thư mục frontend:
Mở terminal và di chuyển đến thư mục chứa code frontend.

4. Cài đặt các dependency:
Cài đặt các package cần thiết từ file package.json: "npm install" 

5. Cấu hình:
Cập nhật URL backend trong file api.js để frontend có thể kết nối đến backend.
****

Link HOST trên Pythonanywhere : https://bebebe14172.pythonanywhere.com/

***

6. Chạy ứng dụng:
Khởi động ứng dụng React Native: "npx expo start --tunnel"


Lựa chọn cách thức chạy ứng dụng (trên thiết bị thật, emulator, hoặc web).
Lưu ý:
Nếu sử dụng trên thiết bị thật thì tải Expo Go về , Quét mã QR hiện ra khi chạy lệnh npx expo start --tunnel
Nếu xài emulator thì tạo một thiết bị thật , chạy thiết bị, vào terminal của Visual Studio Code chạy lệnh npx expo start --tunnel 
sau đó bấm "A" để tiến hành kết nối đến thiết bị và tự động tải Expo Go trên thiết bị đó !

