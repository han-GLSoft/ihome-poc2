# iHome POC2

AI 家具導購 + 3D 房間預覽 POC。使用者輸入房間尺寸與風格偏好，系統自動推薦家具並即時呈現 3D 配置。

## 技術架構

| 層級 | 技術 |
|------|------|
| 前端 | React 19 + Vite + TypeScript + Tailwind CSS |
| 3D 渲染 | Three.js / React Three Fiber / Drei |
| 後端 | FastAPI + Uvicorn |
| 資料 | JSON 家具資料庫（`backend/data/furniture_db.json`） |

---

## 快速啟動

### 前置需求

- **Node.js** 18+
- **Python** 3.10+

---

### 1. 後端（FastAPI）

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

後端啟動後可訪問：
- API：`http://localhost:8000`
- Swagger 文件：`http://localhost:8000/docs`

---

### 2. 前端（React + Vite）

```bash
cd frontend
npm install
npm run dev
```

前端啟動後可訪問：`http://localhost:5173`

---

## 專案結構

```
ihome-poc2/
├── backend/
│   ├── data/
│   │   └── furniture_db.json    # 家具資料庫
│   ├── routers/
│   │   └── furniture.py         # API 路由
│   ├── services/                # 推薦 & 排版邏輯
│   ├── models.py                # Pydantic 資料模型
│   ├── main.py                  # FastAPI 入口
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/          # React 元件（含 3D 場景）
    │   ├── utils/
    │   │   └── materialMapper.ts  # AI 材質自動對應
    │   ├── types/               # TypeScript 型別定義
    │   └── api/                 # API client
    ├── package.json
    └── vite.config.ts
```

---

## 主要功能

- **AI 家具推薦**：依房間尺寸、風格標籤（Nordic / Modern / Minimal）、預算篩選
- **自動 3D 佈局**：推薦結果自動排入房間平面圖
- **AI 材質對應**：依 `category` × `style_tags` 自動套用對應材質（木紋／布料／金屬等）
- **互動式 3D 預覽**：點選家具可查看詳情與 Amazon 購買連結
