# 系統分析規劃

## 專案結構 (Project Structure)

### 文件：本功能 (Documentation: this feature)

```text
specs/001-photo-album-organizer/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### 原始碼：儲存庫根目錄 (Source Code: repository root)

```text
backend/
├── package.json
├── src/
│   ├── api/
│   │   ├── albums.js
│   │   ├── photos.js
│   │   └── upload.js
│   ├── db/
│   │   ├── connection.js
│   │   └── migrations/
│   ├── services/
│   │   ├── album-service.js
│   │   ├── photo-service.js
│   │   └── sort-service.js
│   ├── storage/
│   │   └── local-photo-store.js
│   └── server.js
├── tests/
│   ├── contract/
│   ├── integration/
│   └── unit/
└── uploads/
    ├── originals/
    └── previews/

frontend/
├── package.json
├── index.html
├── src/
│   ├── api.js
│   ├── drag-sort.js
│   ├── main.js
│   ├── render.js
│   └── styles.css
└── tests/
    └── unit/
```

**Structure Decision**: 採用兩個清楚分離的 web app 目錄：`frontend/` 負責 Vite 與原生瀏覽器互動，`backend/` 負責 Node.js HTTP API、MySQL 存取與照片檔案保存。此結構符合前後端分工，也避免在初版引入 monorepo 工具或共用 package 的額外複雜度。

## 分析流程規劃

### 系統介面盤點

依據使用者需求原文，先盤點本次系統分析需要涵蓋的技術端點，並把每個端點視為一個獨立 system 的介面。此處只建立後續分析順序，不在本段落執行實際系統分析。

1. **前端使用者互動介面**
   - 端點類型：前端端點
   - 需求依據：需求原文提到使用者需要「上傳照片」、「建立相簿」、「拖曳排序」與「查看整理後相簿」。
   - 介面定位：瀏覽器端負責接收使用者操作，並透過 API 與後端交換相簿、照片與排序資料。

2. **後端 HTTP API 介面**
   - 端點類型：後端端點
   - 需求依據：需求原文涉及照片上傳、相簿建立、照片清單讀取與排序結果保存，這些操作需要由後端提供穩定的請求入口。
   - 介面定位：後端 API 負責承接前端操作，協調資料庫與照片檔案儲存。

3. **資料庫持久化介面**
   - 端點類型：資料庫端點
   - 需求依據：需求原文提到相簿、照片與排序結果需要被保存，代表系統需要可查詢、可更新的持久化資料。
   - 介面定位：資料庫負責保存相簿 metadata、照片 metadata 與照片排序狀態。

4. **照片檔案儲存介面**
   - 端點類型：檔案儲存端點
   - 需求依據：需求原文提到照片上傳與整理後的相簿瀏覽，代表原始照片與預覽圖需要被保存並可被讀取。
   - 介面定位：檔案儲存負責保存照片 binary 檔案，並提供後端可引用的儲存路徑或識別資訊。

本需求原文未提及手機端、硬體端、雲端代管服務或第三方服務整合，因此初版系統分析規劃不將它們列為獨立介面。

### 分析流程安排

後續系統分析會依照需求依賴程度分成多個 Wave。每個 Wave 裡只放技術端點，不放實際分析結果；同一個 Wave 內的端點代表可以平行開 Sub-agent，並委派給對應的小 Skill 執行後續介面分析。
每個端點會列出具名 Planner Skill，供後續 Wave 執行時委派。

#### Wave 1：前端端點與低耦合儲存端點

- Sub-agent 1：委派小 Skill 分析 **前端使用者互動介面**。
  - 端點類型：前端端點
  - Planner Skill：ui-ux-plan
  - 需求依賴判斷：本需求的上傳照片、建立相簿、拖曳排序與查看相簿都會先出現在使用者操作流程中；先分析前端端點，可以讓後端與資料庫後續更容易對齊使用者實際需要的資料交換。
- Sub-agent 2：委派小 Skill 分析 **照片檔案儲存介面**。
  - 端點類型：檔案儲存端點
  - Planner Skill：data-plan
  - 需求依賴判斷：照片檔案儲存主要關注原始照片與預覽圖如何保存、讀取與引用，和 UI 流程的直接依賴較低，也不需要等資料庫 schema 完成後才能先盤點儲存邊界。
- Wave 排程理由：前端端點會影響後端 API 與資料庫的需求形狀，因此排在第一個 Wave；照片檔案儲存端點和前端端點的分析耦合度低，可以在同一個 Wave 平行處理。

#### Wave 2：後端端點與資料庫端點

- Sub-agent 1：委派小 Skill 分析 **後端 HTTP API 介面**。
  - 端點類型：後端端點
  - Planner Skill：api-plan
  - 需求依賴判斷：後端 API 需要承接前端操作流程，也需要協調資料庫與照片檔案儲存；等 Wave 1 先釐清前端需求與檔案儲存邊界後，再分析後端端點會更精準。
- Sub-agent 2：委派小 Skill 分析 **資料庫持久化介面**。
  - 端點類型：資料庫端點
  - Planner Skill：data-plan
  - 需求依賴判斷：資料庫需要保存相簿、照片 metadata 與排序狀態，這些資料形狀會受到前端操作流程與後端 API 邊界影響，因此放在 Wave 2。
- Wave 排程理由：後端端點與資料庫端點都依賴 Wave 1 的前端需求輪廓；兩者雖然彼此相關，但可以平行分析，再於後續整合時對齊 API request/response 與持久化資料模型。
