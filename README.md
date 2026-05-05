# MyWorkItem 管理系統 - 前端專案

這是一個使用 React 19 與 Vite 建置的現代化待辦事項/工作項目 (Work Item) 管理系統。本專案透過角色基礎的存取控制 (RBAC)，為一般使用者與管理員提供差異化的功能體驗，並整合了強大的狀態管理與 API 自動快取機制。

---

## 🔗 在線 Demo

- **連結：** [https://myworkitemfrontend.onrender.com](https://myworkitemfrontend.onrender.com)
- **測試帳號：**
  | 角色 | 帳號 | 密碼 |
  | :--- | :--- | :--- |
  | **管理者 (Admin)** | `admin` | `Test1234` |
  | **使用者 1 (User)** | `user1` | `Test1234` |
  | **使用者 2 (User)** | `user2` | `Test1234` |

---

## 🚀 快速啟動

### 1. 複製專案

```bash
git clone https://github.com/Hsiang1006/MyWorkItemFrontend.git
cd MyWorkItemFrontend
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 設定環境變數

在專案根目錄建立 `.env` 檔案，並參考以下設定：
```env
VITE_API_BASE_URL=https://myworkitem.onrender.com/api
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

---

## 🛠 技術架構

本專案採用關注點分離 (Separation of Concerns) 的架構設計，確保代碼的高可維護性：

- **核心框架:** React 19 + Vite (高速開發與建置工具)
- **狀態管理 & API 串接:**
- **Redux Toolkit (RTK):** 管理全局狀態。
- **RTK Query:** 處理伺服器狀態，實作自動快取、失效重整 (Tag Invalidation) 與樂觀更新。
- **路由管理:** React Router DOM v7 (包含嵌套路由與權限防護 `ProtectedRoute`)。
- **表單與驗證:** React Hook Form + Zod (型別安全且高效的表單處理)。
- **UI 樣式:** Bootstrap 5 + SCSS (遵循 7-1 樣式架構設計)。
- **部署:** Render 平台。

---

## ✨ 核心功能

### 👤 一般使用者 (User)

- **工作列表:** 查看待確認與已確認項目，支援「最新/最舊」排序與分頁瀏覽。
- **詳情檢視:** 查看單一項目的完整描述與建立時間。
- **批次確認:** 支援選取多個項目進行批次確認，一鍵變更狀態。
- **狀態撤銷:** 誤點確認後，可將「已確認」項目撤銷回「待確認」。

### 🔑 管理員 (Admin)

- **管理儀表板:** 專屬列表頁，可管理系統內所有工作項目。
- **CRUD 管理:** 完整的新增、編輯與永久刪除功能。
- **權限隔離:** 嚴格的後端 API 路徑隔離 (`/admin/*`) 與前端路由守護。

---

## 📁 專案結構

```text
src/
├── app/                # Redux Store 配置
├── assets/             # 靜態資源 (圖片、圖示)
├── components/         # 全局共用元件
├── features/           # 業務邏輯模組 (按功能劃分)
│   ├── auth/           # 認證邏輯 (Slice, API)
│   └── workItem/       # 工作項目邏輯 (API)
├── layouts/            # 頁面佈局 (如 AccountLayout)
├── pages/              # 頁面元件 (依 Auth, Admin, User 分類)
├── routes/             # 路由定義與權限檢查 (ProtectedRoute)
├── schemas/            # Zod 表單驗證規則
├── services/           # 基底 API 設定 (baseApi.js)
└── styles/             # SCSS 樣式系統
    ├── abstracts/      # 變數與 Mixins
    ├── base/           # 基礎樣式
    └── components/     # 元件級別樣式
```

---

## ⚙️ 環境變數說明

| 變數名稱            | 說明                | 範例                                  |
| :------------------ | :------------------ | :------------------------------------ |
| `VITE_API_BASE_URL` | 後端 API 的基礎路徑 | `https://myworkitem.onrender.com/api` |
