# 技術研究 (Technical Research)：照片相簿整理

## 技術決策 (Decision)：前端使用 Vite 與原生 HTML/CSS/JavaScript

**Rationale**: 使用者明確要求簡單、少量套件、不使用 React 或第三方系統。Vite 提供快速開發伺服器與靜態建置，前端互動可用瀏覽器原生 ES modules、Fetch API、File input、Drag and Drop API 與 CSS grid 完成。

**Alternatives considered**:
- React：元件化能力較完整，但對此初版需求過重，且違反「先不要用 React」。
- 第三方 UI library：可快速建立相簿卡片與拖放元件，但增加依賴與客製成本，且不符合最少套件方向。
- 純靜態無 Vite：依賴更少，但缺少開發伺服器、模組打包與環境設定便利性。

## 技術決策 (Decision)：後端使用 Node.js 內建 HTTP server

**Rationale**: 功能初版只需要少量 REST-like endpoints，上傳、查詢、排序與靜態預覽服務可用 Node.js 內建 `http` 實作，減少框架依賴。路由數量可控時，明確的 request handler 比引入 Express 更符合最少套件目標。

**Alternatives considered**:
- Express：成熟且常見，但此階段不是必要依賴。
- Fastify：效能與 schema 工具完整，但引入框架概念超過初版需求。
- 無後端：無法滿足照片上傳、MySQL 保存與前端查詢後端的要求。

## 技術決策 (Decision)：使用 `busboy` 處理照片上傳

**Rationale**: Multipart upload 不適合自行以字串解析，會增加檔案邊界、串流、記憶體與錯誤處理風險。`busboy` 是小型串流 parser，可避免把大型照片完整載入記憶體，符合品質與效能要求。

**Alternatives considered**:
- 自行解析 multipart：依賴最少，但錯誤風險高且容易違反測試與檔案 I/O 品質門檻。
- Multer：使用方便，但通常與 Express 搭配，會把後端帶向框架式設計。
- Base64 JSON upload：實作簡單但檔案體積膨脹，效能與記憶體表現較差。

## 技術決策 (Decision)：MySQL 保存 metadata，檔案系統保存照片內容

**Rationale**: MySQL 適合保存照片 metadata、日期相簿、排序位置、狀態與查詢索引；照片 binary 由後端檔案系統保存可避免資料庫膨脹，也讓預覽檔案能以簡單 HTTP stream 回傳。上傳後的 original file 視為不可變檔案，只建立參照與狀態資料。

**Alternatives considered**:
- 將照片 BLOB 存入 MySQL：備份集中，但資料庫體積與讀取壓力較高。
- 只用檔案系統與 JSON：初期簡單，但排序、狀態查詢與一致性較難維護。
- 雲端物件儲存：擴充性好，但屬於第三方系統，超出使用者限制。

## 技術決策 (Decision)：日期分組採本地日期正規化，缺少日期進入未分類日期

**Rationale**: Spec 要求依照片日期建立單層相簿，且缺少可辨識日期時要放入「未分類日期」。後端應在整理時產生 `album_date`，優先使用可解析的拍攝日期，再使用檔案時間作備援，最後使用 `NULL` 表示未分類日期。

**Alternatives considered**:
- 前端自行分組：可減少後端邏輯，但無法保證所有查詢與排序的一致性。
- 以完整 timestamp 建立相簿：會把同一天照片拆散，不符合日期相簿需求。
- 允許使用者手動建立多層相簿：違反相簿不得巢狀的需求。

## 技術決策 (Decision)：主頁排序以全域 `home_sort_order` 保存

**Rationale**: Spec 說明主頁拖放排序是全域照片顯示順序，不改變日期相簿歸屬。將排序位置存在照片記錄或獨立排序表中，可在重新載入後穩定還原，也能避免拖放取消時遺失原始順序。

**Alternatives considered**:
- 每個相簿各自排序：無法表達主頁全域排序。
- 只存在前端 localStorage：跨瀏覽器與後端查詢不一致，也無法成為可靠資料來源。
- 拖放時直接改變相簿日期：會違反日期分組語意。

## 技術決策 (Decision)：預覽先回傳原始上傳檔或同檔案 URL，縮圖產生列為後續可擴充

**Rationale**: 初版需能平鋪預覽照片，但使用者要求簡單與少量套件。若先不引入影像處理套件，後端可對上傳檔做安全 content-type 與副檔名檢查後提供預覽 URL，由瀏覽器縮放顯示；資料模型保留 `preview_path`，未來可加入縮圖產生而不改變 API。

**Alternatives considered**:
- 後端立即產生縮圖：效能較好但需要影像處理依賴與更多錯誤處理。
- 前端只使用上傳前本機 object URL：無法重新開啟後保留預覽。
- 外部影像處理服務：違反不要第三方系統的限制。
