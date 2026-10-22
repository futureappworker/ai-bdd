# 技術堆疊 (Tech Stack)：照片相簿整理

**Source Spec**: `specs/001-photo-album-organizer/spec.md`

**Source Research**: `specs/001-photo-album-organizer/research.md`

**Status**: Ready for Planning

## 堆疊摘要 (Stack Summary)

本次開發採用少量依賴的 Node.js + Vite 架構：前端以原生 HTML/CSS/JavaScript 完成相簿瀏覽、平鋪預覽與拖放排序，後端以 Node.js 內建 HTTP server 提供上傳、查詢、排序與預覽服務。照片 metadata、日期分組與排序狀態由 MySQL 保存，照片檔案內容留在檔案系統；預覽先使用原始檔案 URL 或同檔案串流，縮圖產生延後到需要效能優化時再決策。

## 採用技術 (Adopted Technologies)

| Area | Technology | Purpose | Source Decision |
| --- | --- | --- | --- |
| Frontend | Vite + native HTML/CSS/JavaScript | 提供開發伺服器、靜態建置、相簿平鋪介面與拖放互動 | 前端使用 Vite 與原生 HTML/CSS/JavaScript |
| Backend | Node.js built-in HTTP server | 提供少量 REST-like endpoints、靜態預覽與檔案串流 | 後端使用 Node.js 內建 HTTP server |
| Upload Handling | `busboy` | 以串流方式處理 multipart photo upload，避免自行解析檔案邊界 | 使用 `busboy` 處理照片上傳 |
| Metadata Storage | MySQL | 保存照片 metadata、日期相簿、排序位置、狀態與查詢索引 | MySQL 保存 metadata，檔案系統保存照片內容 |
| File Storage | Local filesystem | 保存上傳照片內容，避免把 binary 直接放入資料庫 | MySQL 保存 metadata，檔案系統保存照片內容 |
| Date Grouping | Local date normalization with nullable `album_date` | 將照片依本地日期分組，缺少可辨識日期時進入未分類日期 | 日期分組採本地日期正規化，缺少日期進入未分類日期 |
| Ordering State | Global `home_sort_order` | 保存主頁全域照片顯示順序，不改變日期相簿歸屬 | 主頁排序以全域 `home_sort_order` 保存 |
| Preview Delivery | Original file URL or same-file HTTP stream | 先滿足平鋪預覽需求，避免初版引入影像處理依賴 | 預覽先回傳原始上傳檔或同檔案 URL，縮圖產生列為後續可擴充 |

## 延後或不採用技術 (Deferred or Rejected Technologies)

| Technology | Decision | Reason |
| --- | --- | --- |
| React | Rejected for initial version | 元件化能力完整，但對初版需求過重，且使用者明確要求先不要用 React |
| Express or Fastify | Rejected for initial version | 路由數量可控，內建 HTTP server 足以支援初版，框架會增加概念與依賴 |
| Image thumbnail generation | Deferred | 效能上有價值，但需要影像處理依賴與更多錯誤處理；初版先由瀏覽器縮放預覽 |
| Cloud object storage or external image service | Rejected | 屬於第三方系統，超出使用者限制與少量依賴方向 |
| MySQL BLOB photo storage | Rejected | 會增加資料庫體積與讀取壓力；metadata 與檔案內容分離更符合需求 |

## 規劃影響 (Planning Implications)

- Planning 應把前端任務限制在 Vite + native browser APIs，不建立 React component tree 或 UI library 整合任務。
- Backend planning 應圍繞 Node.js `http` request handler、靜態檔案服務與少量 REST-like endpoints 展開。
- Data planning 應分開設計 MySQL metadata schema 與檔案系統路徑保存策略。
- Upload planning 必須包含 `busboy` 串流處理、content-type 檢查、副檔名檢查與大型檔案錯誤處理。
- Preview planning 應先支援原始檔案 URL 或同檔案串流，並把縮圖產生保留為後續擴充點。
