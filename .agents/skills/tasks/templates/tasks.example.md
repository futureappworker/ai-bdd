---

description: "線上 PVP 1A2B 猜數字的實作任務清單"
---

# Tasks: 線上 PVP 1A2B 猜數字

**Input**: Design documents from `/specs/001-online-pvp-1a2b/`

**Prerequisites**: 本清單已對齊 testplan.md（必要）、plan.md（必要）與 spec.md（必要）。開發任務的案例與順序來自 testplan.md 各章的 TDD 順序。執行時由上往下，不要在開工時讀完 research.md、techstack.md、contracts/ 或整份 testplan.md。每個任務下方的 **References** 才是載入時機，而且只讀該位址。路徑相對於 `/specs/001-online-pvp-1a2b/`。

**Tests**: 使用者故事與全域 NFR 的每個原子案例依所屬章的 TDD 順序拆成紅燈、綠燈、重構。紅燈先寫該案例並執行到預期失敗。綠燈只做該案例通過所需的最小實作。重構在該案例綠燈之後；沒有可做的結構調整時保持行為不變，並確認測試仍通過。總驗收章的每個案例只產生一個任務，寫入該案例並執行到通過。

**Organization**: Phase 3 起每個使用者故事對應 testplan.md 的一則使用者故事。全部使用者故事之後，每條有案例的全域 NFR 各一個 Phase。有總驗收章時，最後加一個總驗收 Phase。有案例的介面才用 `###` 開端點小節。User Story 1 與 User Story 2 都含後端房間 API 與前端對局畫面。NFR-G-001 與 NFR-G-003 各一個 Phase。總驗收有 ACC-1 一個任務。Setup 與 Foundational 沒有案例，不標 TDD 步驟。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可平行（不同檔案、不依賴同階段尚未完成的任務）。同一章的紅燈、綠燈、重構依該章順序串行，不標 [P]
- **[Story]**: 該任務所屬使用者故事（US1、US2）。全域 NFR 與總驗收任務不標 [Story]
- 描述含精確檔案路徑
- 使用者故事、全域 NFR 與總驗收 Phase 的端點小節使用 `###`。端點小節只標 **Codebase**
- **TDD 步驟** 寫在使用者故事與全域 NFR 的案例任務下方，值為 `紅燈`、`綠燈` 或 `重構` 之一。總驗收任務不寫 **TDD 步驟**
- **References** 寫在任務正下方，一行一個位址。TDD 任務與總驗收任務兩行：`testplan.md#{案例 ID}`，以及該案例受測操作的一個契約位址。後端任務不寫 DBML 或畫面。前端畫面任務不寫 OpenAPI 或 DBML
- 位址寫法：案例用 `testplan.md#BE-1.1` 這種案例 ID；HTTP 操作用 `contracts/openapi.yaml#/paths/~1{path}/{method}`（`/` 寫成 `~1`）；畫面用 `contracts/interface.pen#{frameId}`；DBML 用 `contracts/schema.dbml#Table/{name}`；技術選型用 `techstack.md#採用技術/{Area}`；目錄用 `plan.md#原始碼：儲存庫根目錄`

## Path Conventions

- **Web app**: `backend/src/`、`backend/tests/`、`frontend/src/`、`frontend/tests/`
- 路徑依 plan.md 的 `frontend/` 與 `backend/`（Node.js、REST、資料庫）分離結構
- 端點與落地位置：後端房間 API → `backend/src/rooms/` 與 `backend/tests/integration/`；前端對局畫面 → `frontend/src/screens/` 與 `frontend/tests/e2e/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 建立 plan.md 的後端目錄與專案骨架

- [ ] T001 依 plan.md 建立目錄 `backend/src/rooms/`、`backend/src/db/`、`backend/src/http/`、`backend/tests/integration/`、`frontend/src/screens/`、`frontend/tests/e2e/`
  - **References**: `plan.md#原始碼：儲存庫根目錄`
- [ ] T002 在 `backend/package.json` 與 `backend/tsconfig.json` 初始化 Node.js + TypeScript 專案，並提供測試腳本
  - **References**: `techstack.md#採用技術/Backend Runtime`
- [ ] T003 [P] 在 `frontend/package.json`、`frontend/tsconfig.json`、`frontend/index.html` 初始化前端專案，並提供瀏覽器測試腳本
  - **References**: `techstack.md#採用技術/Frontend`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 使用者故事共用的資料庫連線與 HTTP 伺服器骨架

**⚠️ CRITICAL**: 本階段完成前不得開始任何使用者故事

- [ ] T004 在 `backend/src/db/connection.ts` 連線 `DATABASE_URL` 指向的資料庫，並匯出查詢用的連線
  - **References**: `techstack.md#採用技術/Persistence`
- [ ] T005 在 `backend/src/http/server.ts` 掛載房間路由骨架，尚不實作進入、開始與讀取
  - **References**: `techstack.md#採用技術/HTTP API`

**Checkpoint**: 資料庫連線與 HTTP 伺服器骨架可用；使用者故事可開始

---

## Phase 3: User Story 1 - 以暱稱與房號進入房間（Priority: P1）🎯 MVP

**Goal**: 玩家用暱稱與房號進入。房號尚不存在時，進入者成為房主，房間等待對手。兩次同時進入同一個不存在的房號只產生一個房間。進房後，畫面上看得到等待對手

**Independent Test**: 使用 Fixture 空資料庫。BE-1.1 的進入回應是 HTTP 201 的房主、等待對手。BE-3.1 的兩次同時進入得到同一個 `roomId`，一人是房主、一人是加入者。FE-1.1 按下「進入房間」後，畫面顯示「等待對手」與「房主 玩家A」

### 後端端點：後端房間 API

**Codebase**: `backend/src/rooms/`、`backend/tests/`

- [ ] T006 [US1] 紅燈：在 `backend/tests/integration/enter-room.test.ts` 寫入 BE-1.1，並執行到預期失敗
  - **TDD 步驟**: 紅燈
  - **References**: `testplan.md#BE-1.1`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1enter/post`
- [ ] T007 [US1] 綠燈：在 `backend/src/rooms/enter.ts` 做 BE-1.1 通過所需的最小實作
  - **TDD 步驟**: 綠燈
  - **References**: `testplan.md#BE-1.1`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1enter/post`
- [ ] T008 [US1] 重構：只整理 BE-1.1 綠燈觸及的實作；沒有可做的結構調整時保持行為不變，並確認測試仍通過
  - **TDD 步驟**: 重構
  - **References**: `testplan.md#BE-1.1`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1enter/post`
- [ ] T009 [US1] 紅燈：在 `backend/tests/integration/enter-room.test.ts` 寫入 BE-3.1，並執行到預期失敗
  - **TDD 步驟**: 紅燈
  - **References**: `testplan.md#BE-3.1`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1enter/post`
- [ ] T010 [US1] 綠燈：在 `backend/src/rooms/enter.ts` 做 BE-3.1 通過所需的最小實作
  - **TDD 步驟**: 綠燈
  - **References**: `testplan.md#BE-3.1`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1enter/post`
- [ ] T011 [US1] 重構：只整理 BE-3.1 綠燈觸及的實作；沒有可做的結構調整時保持行為不變，並確認測試仍通過
  - **TDD 步驟**: 重構
  - **References**: `testplan.md#BE-3.1`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1enter/post`

### 前端端點：前端對局畫面

**Codebase**: `frontend/src/`、`frontend/tests/`

- [ ] T012 [US1] 紅燈：在 `frontend/tests/e2e/enter-room.test.ts` 寫入 FE-1.1，並執行到預期失敗
  - **TDD 步驟**: 紅燈
  - **References**: `testplan.md#FE-1.1`
  - **References**: `contracts/interface.pen#waiting-room`
- [ ] T013 [US1] 綠燈：在 `frontend/src/screens/match.ts` 做 FE-1.1 通過所需的最小實作
  - **TDD 步驟**: 綠燈
  - **References**: `testplan.md#FE-1.1`
  - **References**: `contracts/interface.pen#waiting-room`
- [ ] T014 [US1] 重構：只整理 FE-1.1 綠燈觸及的實作；沒有可做的結構調整時保持行為不變，並確認測試仍通過
  - **TDD 步驟**: 重構
  - **References**: `testplan.md#FE-1.1`
  - **References**: `contracts/interface.pen#waiting-room`

**Checkpoint**: User Story 1 可藉 Fixture 空資料庫獨立驗證進房、同時進房，以及進房後畫面顯示等待對手

---

## Phase 4: User Story 2 - 房主開始對局（Priority: P2）

**Goal**: 雙方都已準備時，房主開始對局，雙方都看到輪到房主。畫面上雙方都看到對局中且輪到房主

**Independent Test**: 案例前置已種入雙方準備好的房間。BE-6.3 開始後，雙方讀到的 `status` 都是對局中，`turn` 都是房主。FE-2.1 房主按下「開始對局」後，雙方畫面都是「對局中」，輪到都是「房主」。不需再測進房規則

### 後端端點：後端房間 API

**Codebase**: `backend/src/rooms/`、`backend/tests/`

- [ ] T015 [US2] 紅燈：在 `backend/tests/integration/start-match.test.ts` 寫入 BE-6.3，並執行到預期失敗
  - **TDD 步驟**: 紅燈
  - **References**: `testplan.md#BE-6.3`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1{roomId}~1start/post`
- [ ] T016 [US2] 綠燈：在 `backend/src/rooms/start.ts` 做 BE-6.3 通過所需的最小實作
  - **TDD 步驟**: 綠燈
  - **References**: `testplan.md#BE-6.3`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1{roomId}~1start/post`
- [ ] T017 [US2] 重構：只整理 BE-6.3 綠燈觸及的實作；沒有可做的結構調整時保持行為不變，並確認測試仍通過
  - **TDD 步驟**: 重構
  - **References**: `testplan.md#BE-6.3`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1{roomId}~1start/post`

### 前端端點：前端對局畫面

**Codebase**: `frontend/src/`、`frontend/tests/`

- [ ] T018 [US2] 紅燈：在 `frontend/tests/e2e/start-match.test.ts` 寫入 FE-2.1，並執行到預期失敗
  - **TDD 步驟**: 紅燈
  - **References**: `testplan.md#FE-2.1`
  - **References**: `contracts/interface.pen#in-match`
- [ ] T019 [US2] 綠燈：在 `frontend/src/screens/match.ts` 做 FE-2.1 通過所需的最小實作
  - **TDD 步驟**: 綠燈
  - **References**: `testplan.md#FE-2.1`
  - **References**: `contracts/interface.pen#in-match`
- [ ] T020 [US2] 重構：只整理 FE-2.1 綠燈觸及的實作；沒有可做的結構調整時保持行為不變，並確認測試仍通過
  - **TDD 步驟**: 重構
  - **References**: `testplan.md#FE-2.1`
  - **References**: `contracts/interface.pen#in-match`

**Checkpoint**: User Story 2 可藉種入雙方已準備的房間獨立驗證開始對局，以及雙方畫面顯示輪到房主

---

## Phase 5: 全域 NFR - NFR-G-001 失敗後已進入的房間仍保留

**Purpose**: 玩家已進入房間後，若下一次請求失敗，該房間仍可被讀回

### 後端端點：後端房間 API

**Codebase**: `backend/src/rooms/`、`backend/tests/`

- [ ] T021 紅燈：在 `backend/tests/integration/retain-room-on-failure.test.ts` 寫入 NFR-G-001，並執行到預期失敗
  - **TDD 步驟**: 紅燈
  - **References**: `testplan.md#NFR-G-001`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1{roomId}/get`
- [ ] T022 綠燈：在 `backend/src/rooms/read.ts` 做 NFR-G-001 通過所需的最小實作
  - **TDD 步驟**: 綠燈
  - **References**: `testplan.md#NFR-G-001`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1{roomId}/get`
- [ ] T023 重構：只整理 NFR-G-001 綠燈觸及的實作；沒有可做的結構調整時保持行為不變，並確認測試仍通過
  - **TDD 步驟**: 重構
  - **References**: `testplan.md#NFR-G-001`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1{roomId}/get`

**Checkpoint**: 進入房間成功後，下一次請求失敗時，GET 仍讀得到等待中的房主

---

## Phase 6: 全域 NFR - NFR-G-003 房間讀取在 1 秒內回傳

**Purpose**: 已存在的房間被讀取時，1 秒內回傳

### 後端端點：後端房間 API

**Codebase**: `backend/src/rooms/`、`backend/tests/`

- [ ] T024 紅燈：在 `backend/tests/integration/read-room-latency.test.ts` 寫入 NFR-G-003，並執行到預期失敗
  - **TDD 步驟**: 紅燈
  - **References**: `testplan.md#NFR-G-003`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1{roomId}/get`
- [ ] T025 綠燈：在 `backend/src/rooms/read.ts` 做 NFR-G-003 通過所需的最小實作
  - **TDD 步驟**: 綠燈
  - **References**: `testplan.md#NFR-G-003`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1{roomId}/get`
- [ ] T026 重構：只整理 NFR-G-003 綠燈觸及的實作；沒有可做的結構調整時保持行為不變，並確認測試仍通過
  - **TDD 步驟**: 重構
  - **References**: `testplan.md#NFR-G-003`
  - **References**: `contracts/openapi.yaml#/paths/~1api~1rooms~1{roomId}/get`

**Checkpoint**: 已進入的房間在 1 秒內可被讀回

---

## Phase 7: 總驗收

**Purpose**: 全部使用者故事與全域 NFR 完成後，兩位玩家仍能從進房走到開始對局

### 前端端點：前端對局畫面

**Codebase**: `frontend/src/`、`frontend/tests/`

- [ ] T027 在 `frontend/tests/e2e/accept-match.test.ts` 寫入 ACC-1 並執行到通過；失敗時只修正 `frontend/src/screens/match.ts` 使這條旅程通過
  - **References**: `testplan.md#ACC-1`
  - **References**: `contracts/interface.pen#in-match`

**Checkpoint**: 兩位玩家從進房到開始後，雙方仍看到輪到房主

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 無前置，可立即開始
- **Foundational (Phase 2)**: 依賴 Setup；完成前阻擋全部使用者故事
- **User Stories (Phase 3+)**: 都依賴 Foundational
- **全域 NFR NFR-G-001 (Phase 5)**: 依賴 User Story 1 與 User Story 2 完成
- **全域 NFR NFR-G-003 (Phase 6)**: 接在 NFR-G-001 之後
- **總驗收 (Phase 7)**: 接在 NFR-G-003 之後

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 之後即可開始。順序是 BE-1.1、BE-3.1、FE-1.1
- **User Story 2 (P2)**: 接在 User Story 1 之後。順序是 BE-6.3、FE-2.1。整合測試自行種入雙方已準備的房間

### Within Each User Story

- 每個案例的順序是紅燈、綠燈、重構
- 綠燈只滿足該案例的預期輸出，不提前實作下一個案例
- 重構只整理該案例綠燈觸及的實作
- 執行某個任務時只讀該任務列出的位址
- 全域 NFR Phase 的案例順序沿用該需求在 testplan.md 的 TDD 順序，每個案例仍是紅燈、綠燈、重構
- 總驗收案例各一個任務，寫入後執行到通過，不拆紅燈、綠燈、重構

### Parallel Opportunities

- T003 與 T002 可平行。TDD 任務依所屬章的順序串行，不標 [P]

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational（阻擋所有故事）
3. 完成 Phase 3: User Story 1
4. **STOP and VALIDATE**: 以 Fixture 空資料庫跑 BE-1.1、BE-3.1 與 FE-1.1，確認房主進房、同時進入只產生一個房間，以及畫面顯示等待對手
5. 通過後再做房主開始對局

### Incremental Delivery

1. Setup + Foundational → 基礎可用
2. User Story 1 → 獨立驗證進房、同時進房與進房畫面 → MVP
3. User Story 2 → 獨立驗證房主開始對局與雙方畫面顯示輪到房主
4. 全域 NFR NFR-G-001 → 驗證失敗後已進入的房間仍可讀回
5. 全域 NFR NFR-G-003 → 驗證已進入的房間在 1 秒內可被讀回
6. 總驗收 ACC-1 → 驗證兩位玩家從進房到開始後，雙方仍看到輪到房主

---

## Notes

- [US1]／[US2] 對應 testplan.md 的兩則使用者故事
- 使用者故事與全域 NFR 任務的 **TDD 步驟** 是紅燈、綠燈、重構三者之一。總驗收任務不標 **TDD 步驟**
- 紅燈任務以該案例作為已確認接縫，從撰寫失敗測試開始
- 重構任務的完成包含不調整結構，並確認該案例測試仍通過
- NFR-G-002 在 testplan.md 列為不列為案例，FR-G-004 是全域功能需求；兩者都不產生任務
