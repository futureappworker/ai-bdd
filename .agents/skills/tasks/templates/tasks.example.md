---

description: "玩家聊天功能的實作任務清單"
---

# Tasks: 玩家聊天功能

**Input**: Design documents from `/specs/002-player-chat/`

**Prerequisites**: 本清單已對齊 `spec.md`、`plan.md`、`techstack.md`、`features/acceptance/` 與 `features/backend/` 下的 `.feature`、`dsl.md`。執行時由上往下，不要在開工時讀完整個 `features/acceptance/`、整個 `features/backend/` 或整份 `contracts/`。每個任務下方的 **References** 才是載入時機，而且只讀該位址。路徑相對於 `/specs/002-player-chat/`。

**Tests**: 使用者故事、全域 NFR 與總驗收的每個 `.feature` 情境依所屬來源順序拆成委派給 `/bdd` 的 `red`、`green`、`refactor`。

**Organization**: Phase 3 起每個使用者故事對應 `spec.md` 的一則使用者故事。全部使用者故事之後，每條有介面情境的全域 NFR 各一個 Phase。有驗收旅程時，最後加一個總驗收 Phase。有情境的介面才用 `###` 開端點小節。User Story 1 與全域 NFR 都含後端聊天 API。總驗收有 ACC-1 的 `red`、`green`、`refactor` 三個任務。Setup 與 Foundational 沒有情境，不標 **BDD 子命令**。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可平行（不同檔案、不依賴同階段尚未完成的任務）。同一情境的委派 `/bdd red`、委派 `/bdd green`、委派 `/bdd refactor` 串行，不標 [P]
- **[Story]**: 該任務所屬使用者故事（US1）。全域 NFR 與總驗收任務不標 [Story]
- 描述含精確檔案路徑
- **BDD 子命令** 寫在每個 `.feature` 情境任務下方，值為 `red`、`green` 或 `refactor` 之一
- **References** 寫在任務正下方，一行一個位址。介面 BDD 任務至少兩行：介面 `.feature` 場景，以及 `dsl.md` 的對應句型；必要時再加契約位址。驗收旅程 BDD 任務至少一行：acceptance feature 場景；必要時再加契約位址

## Path Conventions

- **Web app**: `backend/src/`、`backend/features/`、`frontend/src/`
- 路徑依 `plan.md` 的 `frontend/` 與 `backend/` 分離結構
- 端點與落地位置：後端聊天 API → `backend/src/` 與 `backend/features/steps/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 建立聊天功能共用的目錄與測試結果輸出位置

- [ ] T001 在 `backend/features/steps/聊天/` 建立聊天步驟目錄，並預留結果檔輸出位置
  - **References**: `plan.md#原始碼：儲存庫根目錄`
- [ ] T002 在 `backend/package.json` 補上聊天情境會用到的測試腳本
  - **References**: `techstack.md#採用技術/Backend Runtime`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 建立聊天共用的 API 測試輔助

**⚠️ CRITICAL**: 本階段完成前不得開始任何使用者故事

- [ ] T003 在 `backend/features/steps/runtime/world.ts` 建立聊天情境共用 World 欄位
  - **References**: `plan.md#原始碼：儲存庫根目錄`

**Checkpoint**: 後端聊天情境可共用 World 與結果檔

---

## Phase 3: User Story 1 - 送出聊天訊息（Priority: P1）🎯 MVP

**Goal**: 房內玩家可以送出聊天訊息，並立即在房間對話中看到內容

**Independent Test**: BE-1.1 送出成功後，房內對話包含該訊息

### 後端端點：後端聊天 API

**Codebase**: `backend/src/`、`backend/features/steps/`

- [ ] T004 [US1] 委派 `/bdd red`：在 `backend/features/steps/對局/聊天送出.ts` 為 BE-1.1 撰寫紅燈步驟，並執行到有效失敗
  - **BDD 子命令**: red
  - **References**: `features/backend/送出聊天訊息.feature#場景:BE-1.1 玩家A、玩家B、房間 2468、送出成功`
  - **References**: `features/backend/dsl.md#When:"{玩家}" 對房間送出訊息 "{訊息內容}"`
  - **References**: `contracts/openapi.yaml#/paths/~1v1~1rooms~1{roomId}~1chat~1messages/post`
- [ ] T005 [US1] 委派 `/bdd green`：在 `backend/src/rooms/chat-service.ts` 只做 BE-1.1 通過所需的最小實作
  - **BDD 子命令**: green
  - **References**: `features/backend/送出聊天訊息.feature#場景:BE-1.1 玩家A、玩家B、房間 2468、送出成功`
  - **References**: `features/backend/dsl.md#Then:房間 "{房間代碼}" 的聊天對話應該符合`
  - **References**: `contracts/openapi.yaml#/paths/~1v1~1rooms~1{roomId}~1chat~1messages/post`
- [ ] T006 [US1] 委派 `/bdd refactor`：只整理 BE-1.1 綠燈觸及的 step definitions、World 或 helper，並確認情境仍通過
  - **BDD 子命令**: refactor
  - **References**: `features/backend/送出聊天訊息.feature#場景:BE-1.1 玩家A、玩家B、房間 2468、送出成功`
  - **References**: `features/backend/dsl.md#When:"{玩家}" 對房間送出訊息 "{訊息內容}"`

**Checkpoint**: User Story 1 可獨立驗證房內玩家送出聊天訊息成功

---

## Phase 4: 全域 NFR - NFR-G-001 拒絕送出時不留下訊息

**Purpose**: 不符合規則的送出必須拒絕，且房間對話維持原樣

### 後端端點：後端聊天 API

**Codebase**: `backend/src/`、`backend/features/steps/`

- [ ] T007 委派 `/bdd red`：在 `backend/features/steps/對局/聊天送出.ts` 為 BE-5.1 撰寫紅燈步驟，並執行到有效失敗
  - **BDD 子命令**: red
  - **References**: `features/backend/拒絕聊天送出.feature#場景:BE-5 玩家A、房間 2468、訊息有人嗎`
  - **References**: `features/backend/dsl.md#Then:"{玩家}" 的送出應該被拒絕，原因是 "{原因}"`
- [ ] T008 委派 `/bdd green`：在 `backend/src/rooms/chat-service.ts` 只做 BE-5.1 通過所需的最小實作
  - **BDD 子命令**: green
  - **References**: `features/backend/拒絕聊天送出.feature#場景:BE-5 玩家A、房間 2468、訊息有人嗎`
  - **References**: `features/backend/dsl.md#Then:房間 "{房間代碼}" 的聊天對話應該沒有訊息`
- [ ] T009 委派 `/bdd refactor`：只整理 BE-5.1 綠燈觸及的 step definitions、World 或 helper，並確認情境仍通過
  - **BDD 子命令**: refactor
  - **References**: `features/backend/拒絕聊天送出.feature#場景:BE-5 玩家A、房間 2468、訊息有人嗎`
  - **References**: `features/backend/dsl.md#Then:"{玩家}" 的送出應該被拒絕，原因是 "{原因}"`

**Checkpoint**: 拒絕送出時不新增聊天訊息

---

## Phase 5: 總驗收

**Purpose**: 兩位玩家從進房聊到終局，聊天室與對局狀態都維持正確

### 驗收旅程：前後端整體流程

**Codebase**: `backend/src/`、`frontend/src/`

- [ ] T010 委派 `/bdd red`：在 `frontend/tests/e2e/chat-journey.test.ts` 為 ACC-1 撰寫紅燈步驟，並執行到有效失敗
  - **BDD 子命令**: red
  - **References**: `features/acceptance/從房間聊到終局.feature#場景:SBE-1 玩家A、玩家B、房間 2468，開局前聊到加入者猜中`
  - **References**: `contracts/interface.pen#in-match`
- [ ] T011 委派 `/bdd green`：在 `backend/src/rooms/chat-service.ts` 與 `frontend/src/views/render.ts` 只做 ACC-1 通過所需的最小實作
  - **BDD 子命令**: green
  - **References**: `features/acceptance/從房間聊到終局.feature#場景:SBE-1 玩家A、玩家B、房間 2468，開局前聊到加入者猜中`
  - **References**: `contracts/interface.pen#in-match`
- [ ] T012 委派 `/bdd refactor`：只整理 ACC-1 綠燈觸及的測試程式，並確認情境仍通過
  - **BDD 子命令**: refactor
  - **References**: `features/acceptance/從房間聊到終局.feature#場景:SBE-1 玩家A、玩家B、房間 2468，開局前聊到加入者猜中`
  - **References**: `contracts/interface.pen#in-match`

**Checkpoint**: 玩家從進房聊到終局時，聊天室與對局結果都正確

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 無前置，可立即開始
- **Foundational (Phase 2)**: 依賴 Setup；完成前阻擋全部使用者故事
- **User Stories (Phase 3+)**: 都依賴 Foundational
- **全域 NFR NFR-G-001 (Phase 4)**: 接在 User Story 1 之後
- **總驗收 (Phase 5)**: 接在全域 NFR 之後

### Within Each Scenario

- 每個 `.feature` 情境的順序是委派 `/bdd red`、委派 `/bdd green`、委派 `/bdd refactor`
- `/bdd green` 只滿足該情境的預期輸出，不提前實作下一個情境
- `/bdd refactor` 只整理該情境綠燈觸及的測試程式
- 執行某個任務時只讀該任務列出的位址
- 總驗收旅程的每個場景也依序是委派 `/bdd red`、委派 `/bdd green`、委派 `/bdd refactor`

### Parallel Opportunities

- Setup 的腳本與目錄建立可平行；同一情境的 BDD 任務串行

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational
3. 完成 Phase 3: User Story 1
4. **STOP and VALIDATE**: 驗證玩家送出訊息後，房內對話包含該訊息
5. 通過後再做拒絕送出與總驗收

### Incremental Delivery

1. Setup + Foundational → 基礎可用
2. User Story 1 → 獨立驗證房內聊天送出成功 → MVP
3. 全域 NFR NFR-G-001 → 驗證拒絕送出時不留下訊息
4. 總驗收 → 驗證從進房聊到終局的整體旅程

---

## Notes

- [US1] 對應 `spec.md` 的第一則使用者故事
- 所有 `.feature` 情境任務的 **BDD 子命令** 都是 `red`、`green`、`refactor` 三者之一
- 委派 `/bdd red` 的任務以該 `.feature` 情境作為權威來源，從撰寫並驗證有效失敗開始
- 委派 `/bdd refactor` 的任務完成包含不調整結構，並確認該情境仍通過
