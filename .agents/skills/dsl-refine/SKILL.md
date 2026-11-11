---
name: dsl-refine
description: 依 Spec Package 的 `features/acceptance` 驗收 Gherkin，以原子 3A 粒度衍生 `features/<interface>/` 下可落地的介面 `.feature` 與 `dsl.md`（一場景一個當）。嚴格遵照 acceptance、保留來源對應，並以 `gherkin-and-dsl` 當品質 gate。Use when the user asks for dsl-refine, interface-specific Gherkin, backend/frontend features, or deriving DSL from acceptance features.
---

# SOP

## Phase 1: 決定目標 Spec Package 與介面

1. Read 讀取使用者輸入並取得目標 Spec Package、已回答的澄清、指定介面與額外限制。
2. Read [輸出位置與權威順序規範](rules/輸出位置與權威順序規範.md)並取得目錄、預設介面與權威順序要求。
3. Think 決定本次要使用的 `spec.md`、`features/acceptance/` 與 `features/<interface>/`；無法判斷 Spec Package 時，決定先向使用者確認路徑並停止後續步驟。

## Phase 2: 讀取權威來源與既有介面輸出

1. Read 讀取目標 `spec.md` 並取得使用者故事、驗收情境、邊界情境與既有澄清。
2. Read 讀取目標 `features/acceptance/` 下的 feature 並取得 Rule、場景、步驟與終點驗收事實（**旅程粒度僅作拆分來源，不得當介面輸出範本**）。
3. Read 當目標 `features/<interface>/` 或 `features/<interface>/dsl.md` 已存在時，讀取既有介面 feature 與 `dsl.md` 並取得待保留與待對齊內容。
4. Read [介面原子粒度規範](rules/介面原子粒度規範.md)並取得 acceptance 與介面層粒度差異、3A、Rule 拆分與檔案拆分要求。
5. Read [加入購物車](../gherkin-and-dsl/examples/features/backend/加入購物車.feature)與 [付款](../gherkin-and-dsl/examples/features/backend/付款.feature)並取得介面層原子 Rule 與單一 `當` 的標竿寫法。
6. Think 依 acceptance 與已載入粒度規範，決定每條 acceptance 場景要拆成哪些介面 Rule、檔案、場景編號、高階 Given 與唯一 `當`；不得以流程場景直出。

## Phase 3: 撰寫介面 Artifact

1. Read [介面衍生與對應規範](rules/介面衍生與對應規範.md)並取得拆分、來源對應與成對輸出要求。
2. Read [阻塞與澄清規範](rules/阻塞與澄清規範.md)並取得可直接推導、必須澄清與停止條件。
3. Read [Gherkin階層與原子規則規範](../gherkin-and-dsl/rules/Gherkin階層與原子規則規範.md)並取得介面 feature 的階層、Rule 主張與場景標題要求。
4. Read [Gherkin背景與場景大綱規範](../gherkin-and-dsl/rules/Gherkin背景與場景大綱規範.md)並取得背景、場景大綱與資料換值要求。
5. Read [Gherkin步驟格式規範](../gherkin-and-dsl/rules/Gherkin步驟格式規範.md)並取得關鍵字、一個當、引號與同句步驟要求。
6. Read [DSL可落地規範](../gherkin-and-dsl/rules/DSL可落地規範.md)並取得句型、五個通道與技術入口要求。
7. Read [介面功能骨架](templates/介面功能.feature)並取得介面 feature 的固定結構。
8. Read [介面功能範例](templates/介面功能.example.feature)並取得來源對應與**原子**介面場景的寫法。
9. Read [DSL骨架](templates/dsl.md)並取得介面 `dsl.md` 的固定結構。
10. Read [DSL範例](templates/dsl.example.md)並取得介面句型、高階 Given 與技術入口寫法。
11. Read [後端句型](../gherkin-and-dsl/examples/features/backend/dsl.md)當目標介面包含 `backend` 時，取得後端 `dsl.md` 的欄位與語意寫法。
12. Read [前端句型](../gherkin-and-dsl/examples/features/frontend/dsl.md)當目標介面包含 `frontend` 時，取得前端 `dsl.md` 的欄位與語意寫法。
13. Write 依已載入規範、骨架與範例，將各介面的 `.feature` 與 `dsl.md` 寫入目標 Spec Package 的 `features/<interface>/`。**撰寫時逐場景自檢：僅一個 `當`、前置在 Given、新 Given 同步寫入 `dsl.md`。**

## Phase 4: 檢查介面 Artifact

1. Think 逐檔檢查：是否存在旅程式場景、Rule 混測多主張、或 `當` 後仍有第二個被測動作；有則回到 Phase 3 拆分。
2. Delegate `gherkin-and-dsl` 評估本次寫入的介面 `.feature` 與 `dsl.md` 是否能不靠猜測落地成步驟定義。
3. Think 依委派結果決定哪些不符合項目可直接修正、哪些仍缺少權威來源而形成硬阻塞。

## Phase 5: 修正或澄清

1. Write 修正目標 `features/<interface>/` 中全部可直接修正的不符合項目（含粒度與 dsl 句型缺口）。
2. Think 當仍有缺少權威來源的硬阻塞時，決定要向使用者提出的澄清問題並停止本次流程。
3. Think 當已無硬阻塞時，決定本次介面 `.feature` 與 `dsl.md` 已完成。
