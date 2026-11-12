---

description: "{{TASKS_DESCRIPTION}}"
---

# Tasks: {{FEATURE_NAME}}

**Input**: Design documents from `{{SPEC_DIRECTORY}}`

**Prerequisites**: 本清單已對齊 `spec.md`、`plan.md`、`techstack.md`、`features/acceptance/` 與 `features/<interface>/` 下的 `.feature`、`dsl.md`。開發任務的情境與順序來自介面 `.feature` 的來源對應與場景順序。執行時由上往下，不要在開工時讀完整個 `features/acceptance/`、整個 `features/<interface>/` 或整份 `contracts/`。每個任務下方的 **References** 才是載入時機，而且只讀該位址。路徑相對於 `{{SPEC_DIRECTORY}}`。

**Tests**: 使用者故事、全域 NFR 與總驗收的每個 `.feature` 情境依所屬來源順序拆成委派給 `/bdd` 的 `red`、`green`、`refactor`。`red` 先寫該情境並執行到有效失敗；`green` 只做該情境通過所需的最小實作；`refactor` 只整理該情境綠燈觸及的測試程式，並確認情境仍通過。

**Organization**: Phase 3 起每個使用者故事對應 `spec.md` 的一則使用者故事。全部使用者故事之後，每條有介面情境的全域 NFR 各一個 Phase。有驗收旅程時，最後加一個總驗收 Phase。有情境的介面才用 `###` 開端點小節。{{STORY_ENDPOINT_SUMMARY}} {{GLOBAL_NFR_PHASE_SUMMARY}} {{ACCEPTANCE_PHASE_SUMMARY}} Setup 與 Foundational 沒有情境，不標 **BDD 子命令**。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可平行（不同檔案、不依賴同階段尚未完成的任務）。同一情境的委派 `/bdd red`、委派 `/bdd green`、委派 `/bdd refactor` 串行，不標 [P]
- **[Story]**: 該任務所屬使用者故事（{{STORY_LABELS}}）。全域 NFR 與總驗收任務不標 [Story]
- 描述含精確檔案路徑
- 使用者故事、全域 NFR 與總驗收 Phase 的端點小節使用 `###`。端點小節只標 **Codebase**
- **BDD 子命令** 寫在每個 `.feature` 情境任務下方，值為 `red`、`green` 或 `refactor` 之一
- **References** 寫在任務正下方，一行一個位址。介面 BDD 任務至少兩行：介面 `.feature` 場景，以及 `dsl.md` 的對應句型；必要時再加契約位址。驗收旅程 BDD 任務至少一行：acceptance feature 場景；必要時再加契約位址
- 位址寫法：介面情境用 `features/{interface}/{file}.feature#場景:{標題}`；驗收旅程用 `features/acceptance/{file}.feature#場景:{標題}`；DSL 句型用 `features/{interface}/dsl.md#{Section}:{句子}`；HTTP 操作用 `contracts/openapi.yaml#/paths/~1{path}/{method}`；畫面用 `contracts/interface.pen#{frameId}`；DBML 用 `contracts/schema.dbml#Table/{name}`；技術選型用 `techstack.md#採用技術/{Area}`；目錄用 `plan.md#原始碼：儲存庫根目錄`

## Path Conventions

- **Web app**: {{PATH_CONVENTION_WEB_APP}}
- {{PATH_CONVENTION_STACK}}
- {{PATH_CONVENTION_ENDPOINTS}}

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: {{PHASE_1_PURPOSE}}

- [ ] {{T001_TASK}}
  - **References**: `{{T001_REFERENCE_1}}`
- [ ] {{T002_TASK}}
  - **References**: `{{T002_REFERENCE_1}}`
- [ ] {{T003_TASK}}
  - **References**: `{{T003_REFERENCE_1}}`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: {{PHASE_2_PURPOSE}}

**⚠️ CRITICAL**: 本階段完成前不得開始任何使用者故事

- [ ] {{T004_TASK}}
  - **References**: `{{T004_REFERENCE_1}}`
- [ ] {{T005_TASK}}
  - **References**: `{{T005_REFERENCE_1}}`

**Checkpoint**: {{PHASE_2_CHECKPOINT}}

---

## Phase 3: User Story 1 - {{USER_STORY_1_TITLE}}（Priority: {{USER_STORY_1_PRIORITY}}）🎯 MVP

**Goal**: {{USER_STORY_1_GOAL}}

**Independent Test**: {{USER_STORY_1_INDEPENDENT_TEST}}

### {{USER_STORY_1_BACKEND_HEADING}}

**Codebase**: `{{USER_STORY_1_BACKEND_CODEBASE}}`

- [ ] {{T006_TASK}}
  - **BDD 子命令**: red
  - **References**: `{{T006_REFERENCE_1}}`
  - **References**: `{{T006_REFERENCE_2}}`
  - **References**: `{{T006_REFERENCE_3}}`
- [ ] {{T007_TASK}}
  - **BDD 子命令**: green
  - **References**: `{{T007_REFERENCE_1}}`
  - **References**: `{{T007_REFERENCE_2}}`
  - **References**: `{{T007_REFERENCE_3}}`
- [ ] {{T008_TASK}}
  - **BDD 子命令**: refactor
  - **References**: `{{T008_REFERENCE_1}}`
  - **References**: `{{T008_REFERENCE_2}}`

### {{USER_STORY_1_FRONTEND_HEADING}}

**Codebase**: `{{USER_STORY_1_FRONTEND_CODEBASE}}`

- [ ] {{T009_TASK}}
  - **BDD 子命令**: red
  - **References**: `{{T009_REFERENCE_1}}`
  - **References**: `{{T009_REFERENCE_2}}`
  - **References**: `{{T009_REFERENCE_3}}`
- [ ] {{T010_TASK}}
  - **BDD 子命令**: green
  - **References**: `{{T010_REFERENCE_1}}`
  - **References**: `{{T010_REFERENCE_2}}`
  - **References**: `{{T010_REFERENCE_3}}`
- [ ] {{T011_TASK}}
  - **BDD 子命令**: refactor
  - **References**: `{{T011_REFERENCE_1}}`
  - **References**: `{{T011_REFERENCE_2}}`

**Checkpoint**: {{USER_STORY_1_CHECKPOINT}}

---

## Phase 4: User Story 2 - {{USER_STORY_2_TITLE}}（Priority: {{USER_STORY_2_PRIORITY}}）

**Goal**: {{USER_STORY_2_GOAL}}

**Independent Test**: {{USER_STORY_2_INDEPENDENT_TEST}}

### {{USER_STORY_2_BACKEND_HEADING}}

**Codebase**: `{{USER_STORY_2_BACKEND_CODEBASE}}`

- [ ] {{T012_TASK}}
  - **BDD 子命令**: red
  - **References**: `{{T012_REFERENCE_1}}`
  - **References**: `{{T012_REFERENCE_2}}`
  - **References**: `{{T012_REFERENCE_3}}`
- [ ] {{T013_TASK}}
  - **BDD 子命令**: green
  - **References**: `{{T013_REFERENCE_1}}`
  - **References**: `{{T013_REFERENCE_2}}`
  - **References**: `{{T013_REFERENCE_3}}`
- [ ] {{T014_TASK}}
  - **BDD 子命令**: refactor
  - **References**: `{{T014_REFERENCE_1}}`
  - **References**: `{{T014_REFERENCE_2}}`

**Checkpoint**: {{USER_STORY_2_CHECKPOINT}}

---

## Phase 5: 全域 NFR - {{GLOBAL_NFR_1_ID}} {{GLOBAL_NFR_1_TITLE}}

**Purpose**: {{GLOBAL_NFR_1_PURPOSE}}

### {{GLOBAL_NFR_1_HEADING}}

**Codebase**: `{{GLOBAL_NFR_1_CODEBASE}}`

- [ ] {{T015_TASK}}
  - **BDD 子命令**: red
  - **References**: `{{T015_REFERENCE_1}}`
  - **References**: `{{T015_REFERENCE_2}}`
- [ ] {{T016_TASK}}
  - **BDD 子命令**: green
  - **References**: `{{T016_REFERENCE_1}}`
  - **References**: `{{T016_REFERENCE_2}}`
- [ ] {{T017_TASK}}
  - **BDD 子命令**: refactor
  - **References**: `{{T017_REFERENCE_1}}`
  - **References**: `{{T017_REFERENCE_2}}`

**Checkpoint**: {{GLOBAL_NFR_1_CHECKPOINT}}

---

## Phase 6: 總驗收

**Purpose**: {{ACCEPTANCE_PURPOSE}}

### {{ACCEPTANCE_HEADING}}

**Codebase**: `{{ACCEPTANCE_CODEBASE}}`

- [ ] {{T018_TASK}}
  - **BDD 子命令**: red
  - **References**: `{{T018_REFERENCE_1}}`
  - **References**: `{{T018_REFERENCE_2}}`
- [ ] {{T019_TASK}}
  - **BDD 子命令**: green
  - **References**: `{{T019_REFERENCE_1}}`
  - **References**: `{{T019_REFERENCE_2}}`
- [ ] {{T020_TASK}}
  - **BDD 子命令**: refactor
  - **References**: `{{T020_REFERENCE_1}}`
  - **References**: `{{T020_REFERENCE_2}}`

**Checkpoint**: {{ACCEPTANCE_CHECKPOINT}}

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 無前置，可立即開始
- **Foundational (Phase 2)**: 依賴 Setup；完成前阻擋全部使用者故事
- **User Stories (Phase 3+)**: 都依賴 Foundational
- **全域 NFR {{GLOBAL_NFR_1_ID}} (Phase 5)**: {{GLOBAL_NFR_1_DEPENDENCY}}
- **總驗收 (Phase 6)**: {{ACCEPTANCE_DEPENDENCY}}

### Within Each Scenario

- 每個 `.feature` 情境的順序是委派 `/bdd red`、委派 `/bdd green`、委派 `/bdd refactor`
- `/bdd green` 只滿足該情境的預期輸出，不提前實作下一個情境
- `/bdd refactor` 只整理該情境綠燈觸及的測試程式
- 執行某個任務時只讀該任務列出的位址
- 總驗收旅程的每個場景也依序是委派 `/bdd red`、委派 `/bdd green`、委派 `/bdd refactor`

### Parallel Opportunities

- {{PARALLEL_OPPORTUNITIES}}

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational（阻擋所有故事）
3. 完成 Phase 3: User Story 1
4. **STOP and VALIDATE**: {{MVP_VALIDATION}}
5. {{MVP_NEXT}}

### Incremental Delivery

1. Setup + Foundational → 基礎可用
2. {{INCREMENTAL_USER_STORY_1}}
3. {{INCREMENTAL_USER_STORY_2}}
4. {{INCREMENTAL_GLOBAL_NFR_1}}
5. {{INCREMENTAL_ACCEPTANCE}}

---

## Notes

- {{NOTES_STORY_LABELS}}
- 所有 `.feature` 情境任務的 **BDD 子命令** 都是 `red`、`green`、`refactor` 三者之一
- 委派 `/bdd red` 的任務以該 `.feature` 情境作為權威來源，從撰寫並驗證有效失敗開始
- 委派 `/bdd refactor` 的任務完成包含不調整結構，並確認該情境仍通過
- {{NOTES_EXCLUDED_REQUIREMENT}}
