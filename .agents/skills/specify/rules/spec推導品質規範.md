# Rule 1 - 需求來源必須分層

- Spec 推導時必須區分使用者明確說出的需求、可由上下文保守推導的假設、以及會影響核心規格的未回答缺口。
- Clarifications 區段必須只記錄使用者已回答的 Q/A。
- 未經使用者回答的內容不得寫成 Clarification 答案。
- 不阻塞 planning 且不改變核心驗收的推導內容可以寫入 Assumptions。

## Good Example

- Clarifications 只記錄已回答內容，未確認但可保守採用的內容寫入 Assumptions。

```markdown
## 澄清紀錄 ( Clarifications )

### 澄清場次 ( Session ) 2026-10-06

- Q: 是否支援多人共同整理相簿? → A: 不支援，僅單一使用者整理個人照片

## 假設 ( Assumptions )

- 日期分組預設使用照片本身可取得的拍攝日期。
```

## Bad Example

- 使用者沒有回答原始檔案處理方式，卻把推測寫成 Clarification 答案。

```markdown
## 澄清紀錄 ( Clarifications )

### 澄清場次 ( Session ) 2026-10-06

- Q: 系統是否保留原始照片? → A: 保留原始照片不變
```

# Rule 2 - 核心缺口必須標為待澄清

- 當未回答缺口會改變功能範圍、資料歸屬、使用者旅程、驗收結果、安全隱私要求或後續 planning 邊界時，Spec 狀態必須設為 `Needs Clarification`。
- 當 Spec 狀態為 `Needs Clarification` 時，`specify` 必須產生只含明確資訊的初稿。
- `specify` 不得自行產生澄清問題的最終答案。
- 不影響核心規格的 UI 細節、實作技術與 planning 階段決策不得阻塞 `specify`。

## Good Example

- 原始照片是否被搬移會改變資料歸屬，因此狀態設為 `Needs Clarification`，初稿不寫入該問題的答案。

```markdown
**狀態 ( Status )**：Needs Clarification

## 澄清紀錄 ( Clarifications )

### 澄清場次 ( Session ) {{CLARIFICATION_SESSION_DATE}}

## 假設 ( Assumptions )

- 目標使用者是整理個人照片的一般使用者。
```

## Bad Example

- 按鈕顏色不影響核心規格，卻讓 Spec 進入澄清狀態。

```markdown
**狀態 ( Status )**：Needs Clarification

## 澄清紀錄 ( Clarifications )

### 澄清場次 ( Session ) 2026-10-06

- Q: 主要按鈕要用藍色嗎? → A: [NEEDS CLARIFICATION]
```

# Rule 3 - User Story 必須可獨立驗收

- 每個 User Story 必須描述一個使用者目標，而不是內部系統模組或實作步驟。
- 每個 User Story 必須包含可獨立執行的 Independent Test。
- User Story Priority 必須反映使用者價值與功能依賴順序。
- 不同 User Story 不得只因為同一畫面或同一技術元件而被合併。

## Good Example

- Story 描述使用者目標，且可用獨立測試驗收。

```markdown
### 使用者故事 1 ( User Story 1 ) - 依日期整理照片相簿（優先級 ( Priority )：P1）

使用者希望匯入或選取照片後，應用程式能協助將照片整理到不同相簿中。

**獨立測試 ( Independent Test )**：可透過加入多張具不同拍攝日期的照片，確認系統建立對應日期分組相簿。
```

## Bad Example

- Story 描述內部模組，且無法代表使用者可驗收的目標。

```markdown
### 使用者故事 1 ( User Story 1 ) - 建立照片分類服務（優先級 ( Priority )：P1）

系統需要一個分類服務負責處理照片。

**獨立測試 ( Independent Test )**：確認分類服務類別存在。
```

# Rule 4 - Acceptance Scenarios 必須對應可觀察行為

- Acceptance Scenarios 必須使用 Given、When、Then 表達可觀察的使用者或系統行為。
- Acceptance Scenarios 必須覆蓋該 User Story 的主要成功路徑與重要失敗或替代路徑。
- Acceptance Scenarios 不得要求特定程式語言、框架、資料庫、API 或內部模組。
- Acceptance Scenarios 不得與同一 User Story 的 FR 或 NFR 互相矛盾。

## Good Example

- 情境描述可由使用者驗收的行為結果。

```markdown
1. **前提** 使用者有多張包含拍攝日期的照片，**當** 使用者完成加入照片，**則** 系統會自動依照片日期建立或更新相簿分組。
```

## Bad Example

- 情境把內部實作細節當成驗收標準。

```markdown
1. **前提** 後端收到照片，**當** Node.js worker 執行 SQL 查詢，**則** PostgreSQL table 會新增一筆資料。
```

# Rule 5 - FR 與 NFR 必須優先歸屬 User Story

- Functional Requirements 與 Non-Functional Requirements 必須優先列在其最直接支援的 User Story 底下。
- 只有跨越一個以上 User Story 或無法自然歸屬於單一 User Story 的需求，才可以列入 Global Requirements。
- User Story 底下的 FR 必須描述可驗證的功能行為。
- User Story 底下的 NFR 必須描述該 Story 的品質、效能、可用性、一致性或可靠性要求。
- Global Requirements 不得成為所有需求的預設收納區。

## Good Example

- 排序需求直接支援拖放排序 Story，因此列在該 User Story 底下。

```markdown
**功能需求 ( Functional Requirements )**：

- **FR-US2-001**: 使用者必須能在主頁面透過拖放重新排列照片順序。

**非功能需求 ( Non-Functional Requirements )**：

- **NFR-US2-001**: 拖放排序結果應在操作完成後 1 秒內以可見方式更新。
```

## Bad Example

- 單一 Story 的需求被集中放到 Global Requirements，削弱需求與 Story 的階層關係。

```markdown
### 全域功能需求 ( Global Functional Requirements )

- **FR-G-001**: 使用者必須能在主頁面透過拖放重新排列照片順序。
- **FR-G-002**: 使用者必須能開啟任一相簿並預覽照片。
```

# Rule 6 - 全域需求必須跨 Story 或無法歸屬

- Global Functional Requirements 必須描述跨多個 User Story 的功能約束，或描述無法自然歸屬於單一 User Story 的功能需求。
- Global Non-Functional Requirements 必須描述跨多個 User Story 的品質要求。
- Global Requirements 中的每一項需求必須能說明其跨 Story 或無法歸屬的原因。
- 只服務於單一 User Story 的需求不得列入 Global Requirements。

## Good Example

- 原始檔案不可被改寫會影響整理、排序與預覽，因此可以列為全域需求。

```markdown
### 全域功能需求 ( Global Functional Requirements )

- **FR-G-001**: 系統必須保留原始照片檔案不變，僅儲存照片參照、日期分組與排序資料，不得移動、刪除或改寫原始照片。
```

## Bad Example

- 空相簿狀態只服務於相簿預覽 Story，因此不應列入全域需求。

```markdown
### 全域功能需求 ( Global Functional Requirements )

- **FR-G-001**: 系統必須在空相簿時提供清楚且可理解的空狀態。
```

# Rule 7 - 成功標準必須可量測且對應使用者價值

- Success Criteria 必須使用可量測的結果描述功能完成後的使用者或產品成效。
- Success Criteria 應該包含時間、比例、數量、成功率或可觀察完成條件。
- Success Criteria 不得描述內部實作完成狀態。
- Success Criteria 必須能回扣至少一個 User Story、Global Requirement 或核心使用者價值。

## Good Example

- 成功標準包含可量測條件，且對應使用者整理照片的價值。

```markdown
### 可量測成果 ( Measurable Outcomes )

- **SC-001**: 使用者加入 100 張照片後，90% 的使用者能在 2 分鐘內完成依日期分組的整理流程。
```

## Bad Example

- 成功標準只描述開發完成，無法量測使用者價值。

```markdown
### 可量測成果 ( Measurable Outcomes )

- **SC-001**: 開發團隊完成照片整理功能的程式碼。
```

# Rule 8 - 最終檢查必須消除矛盾與過時內容

- Spec 完成前必須檢查 Clarifications、User Stories、Acceptance Scenarios、FR、NFR、Global Requirements、Edge Cases、Key Entities、Success Criteria 與 Assumptions 是否互相一致。
- 使用者回答取代 Assumption 時，必須刪除或改寫過時 Assumption。
- 若仍有核心缺口未回答，Status 必須維持 `Needs Clarification`。
- 若所有核心缺口已回答或剩餘缺口已可列為 Assumptions，Status 必須設為 `Ready for Planning`。

## Good Example

- 使用者回答已同步到狀態與正文，且沒有保留相反假設。

```markdown
**狀態 ( Status )**：Ready for Planning

## 澄清紀錄 ( Clarifications )

### 澄清場次 ( Session ) 2026-10-06

- Q: 是否支援多人共同整理相簿? → A: 不支援，僅單一使用者整理個人照片

## 假設 ( Assumptions )

- 目標使用者是希望整理個人照片的一般使用者。
```

## Bad Example

- Status 顯示可進入 planning，但 Assumptions 仍保留未決核心缺口。

```markdown
**狀態 ( Status )**：Ready for Planning

## 假設 ( Assumptions )

- 是否支援多人共同整理相簿尚未決定。
```
