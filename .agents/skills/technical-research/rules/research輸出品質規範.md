# Rule 1 - Research 必須接在 Feature Specification 之後

- Technical Research 必須以 `/specify` 產出的 Feature Specification 作為主要輸入。
- Feature Specification 必須已足以進入 planning；若狀態仍為 `Needs Clarification`，必須停止並要求先完成澄清。
- Research 文件必須寫入同一個 feature 目錄下的 `research.md`。
- Tech Stack 文件必須寫入同一個 feature 目錄下的 `techstack.md`。
- 若使用者沒有提供 Feature Specification 路徑，必須先要求使用者提供或明確指出要使用的 feature 目錄。

## Good Example

- Research 來源與輸出位置都能追溯到同一個 feature 目錄。

```text
Input: specs/001-photo-album-organizer/spec.md
Research Output: specs/001-photo-album-organizer/research.md
Tech Stack Output: specs/001-photo-album-organizer/techstack.md
Status: Ready for Planning
```

## Bad Example

- 缺少明確 Feature Specification，無法判斷 research 是否接在 `/specify` 之後。

```text
Input: 使用者口頭說想做照片相簿
Research Output: research.md
Tech Stack Output: techstack.md
Status: Unknown
```

# Rule 2 - 決策必須由規格內容推導

- 每個 Decision 必須回應 Feature Specification 中的需求、限制、成功標準、資料實體或邊界情境。
- 不得加入 Feature Specification 沒有支持的技術偏好、平台限制或第三方服務。
- 當使用者在本次輸入補充技術偏好時，可以採用，但必須在 Rationale 中明確連回該偏好與規格需求。
- 缺少足以支持技術選型的資訊時，必須把該缺口交回使用者，不得自行捏造。
- 此缺口不得寫入 Research 或 Tech Stack。
- 存在此缺口時，不得把 Research 或 Tech Stack 的狀態標為 Ready for Planning。

## Good Example

- 決策明確連回規格中的少量套件、照片上傳與預覽要求。

```markdown
## 技術決策 (Decision)：使用 `busboy` 處理照片上傳

**Rationale**: Multipart upload 不適合自行以字串解析，會增加檔案邊界、串流、記憶體與錯誤處理風險。
```

## Bad Example

- 決策引入未由規格支持的外部服務偏好。

```markdown
## 技術決策 (Decision)：使用雲端影像辨識服務自動分類照片

**Rationale**: 雲端服務比較先進。
```

# Rule 3 - Decision 粒度必須是技術取捨

- 每個 Decision 必須描述一個可影響後續 planning 或實作方向的技術取捨。
- Decision 應該涵蓋架構、資料保存、核心流程、關鍵依賴、效能策略或風險處理。
- Decision 不得只是待辦事項、檔案清單、UI 文案或程式碼實作步驟。
- 同一個 Decision 不得混合多個彼此可獨立決策的主題。

## Good Example

- 決策描述資料保存取捨，會影響後續資料模型與 API planning。

```markdown
## 技術決策 (Decision)：MySQL 保存 metadata，檔案系統保存照片內容
```

## Bad Example

- 決策只是實作待辦，沒有呈現技術取捨。

```markdown
## 技術決策 (Decision)：建立 upload.js 並寫三個函式
```

# Rule 4 - 替代方案必須說明拒絕原因

- 每個 Decision 必須包含 `Alternatives considered` 區段。
- 每個替代方案必須包含具體拒絕原因。
- 拒絕原因必須連回 Feature Specification、使用者偏好、品質要求、複雜度或風險。
- 不得只列替代方案名稱而不說明取捨。

## Good Example

- 替代方案與拒絕原因成對出現。

```markdown
**Alternatives considered**:
- Express：成熟且常見，但此階段不是必要依賴。
- Fastify：效能與 schema 工具完整，但引入框架概念超過初版需求。
```

## Bad Example

- 只列名稱，沒有可判斷的拒絕原因。

```markdown
**Alternatives considered**:
- Express
- Fastify
```

# Rule 5 - Research 與 Tech Stack 不得取代 planning

- Research 必須停止在技術決策、理由與替代方案層級。
- Tech Stack 必須停止在技術堆疊摘要、採用技術、延後或不採用技術與 planning implications 層級。
- Tech Stack 不得包含後續技術問題或未關閉提問。
- Research 不得輸出任務分解、開發排程、完整 API 規格、資料庫 migration 或程式碼。
- Tech Stack 不得輸出任務分解、開發排程、完整 API 規格、資料庫 migration 或程式碼。
- 可以在 Rationale 中提到會影響 planning 的資料欄位或流程概念，但不得展開成實作清單。
- 若使用者要求 planning 內容，必須把該需求交給後續 planning 流程處理。

## Good Example

- Rationale 提到資料欄位概念，但沒有展開成 migration。

```markdown
**Rationale**: 將排序位置存在照片記錄或獨立排序表中，可在重新載入後穩定還原。
```

## Bad Example

- Research 直接產出 migration 與實作任務，越過本 Skill 邊界。

```markdown
### Tasks
1. Create photos table migration.
2. Add POST /photos endpoint.
3. Implement drag handlers.
```

# Rule 6 - Tech Stack 必須可追溯到 Research Decisions

- Tech Stack 必須以同一 feature 目錄中的 `research.md` 為主要來源。
- `採用技術 (Adopted Technologies)` 中每一列必須對應到一個 Source Decision。
- `延後或不採用技術 (Deferred or Rejected Technologies)` 中每一列必須來自 Research 的 Alternatives considered 或明確延後策略。
- `規劃影響 (Planning Implications)` 必須描述 planning 需要遵守的技術約束，不得轉成任務清單。
- 會影響 planning 技術邊界、且能從 Feature Specification 或已完成 Decision 推導的事項，必須寫入 Decision、延後或不採用技術或規劃影響。
- 已寫入 Decision、延後或不採用技術或規劃影響的事項，不得再以提問出現。
- 不改變已決定技術邊界的參數、量測方式與介面形狀，必須寫成規劃影響中的約束。

## Good Example

- 採用技術與來源 Decision 明確對應。

```markdown
| Area | Technology | Purpose | Source Decision |
| --- | --- | --- | --- |
| Upload Handling | `busboy` | 以串流方式處理 multipart photo upload | 使用 `busboy` 處理照片上傳 |
```

## Bad Example

- 採用技術沒有來源 Decision，無法追溯是否由 Research 推導。

```markdown
| Area | Technology | Purpose | Source Decision |
| --- | --- | --- | --- |
| Search | Elasticsearch | 提供全文搜尋 | 未說明 |
```
