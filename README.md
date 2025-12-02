
    # BKU EduClass — Hệ thống quản lý lớp học

    Đây là repo cho một demo hệ thống quản lý lớp học (LMS) gồm 2 phần:
    - Backend: Spring Boot (Java 21, Maven)
    - Frontend: React + Vite (TypeScript)

    Mục tiêu của README này: hướng dẫn nhanh cách cài đặt và chạy môi trường phát triển (PowerShell trên Windows).

    ---

    ## Tổng quan nhanh

    - Frontend development server (Vite) mặc định chạy tại: http://localhost:3000
    - Backend Spring Boot mặc định chạy tại: http://localhost:8080 (API base: /api)

    Lưu ý: frontend có file `src/lib/axios.ts` hiện cấu hình `baseURL: "http://localhost:8080/api"` — nếu backend chạy ở chỗ khác, hãy cập nhật `src/lib/axios.ts` hoặc cấu hình biến môi trường theo ý bạn.

    ---

    ## Yêu cầu (Prerequisites)

    - Node.js (v18+ khuyến nghị) và npm
    - Java 21
    - Maven
    - MySQL (hoặc dùng Docker để chạy MySQL nhanh)

    ---

    ## Thiết lập & chạy môi trường (PowerShell)

    ### 1 Backend (Spring Boot)

    - Thư mục backend: `lms-backend`

   Chạy backend (từ thư mục `lms-backend`):

      ```powershell
      cd lms-backend
      mvn spring-boot:run
      ```

    ---

    ### 2 Frontend (React + Vite)

    - File `package.json` nằm ở thư mục gốc của project (root).

    1. Cài dependency và chạy dev server (ở root project):

      ```powershell
      # ở thư mục gốc project
      npm install
      npm run dev
      ```

      Server Vite mặc định sẽ chạy trên `http://localhost:3000`.

    ## Chạy cả frontend + backend cùng lúc

    - Mở 2 terminal (PowerShell):
     - Terminal A: chạy backend (`cd lms-backend` → `mvn spring-boot:run`)
     - Terminal B: chạy frontend (cd src `npm install` → `npm run dev`)



  