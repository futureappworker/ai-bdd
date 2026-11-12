---
name: tasks
description: 在 /dsl-refine 之後，依 `spec.md`、`plan.md`、`features/acceptance/` 與 `features/<interface>/` 下的 `.feature` + `dsl.md` 產出或更新 `tasks.md`。`tasks` 只負責任務拆解、輸出與校驗，不執行任務、不更新 checkbox；任務實作與打勾由 `/implement` 負責。
metadata:
  references:
    - project: GitHub Spec Kit
      url: https://github.com/github/spec-kit
      source: templates/commands/tasks.md
      license: MIT
  copyright: Copyright GitHub, Inc.
---

本 Skill 參考並改寫自 [GitHub Spec Kit](https://github.com/github/spec-kit) 的 [`templates/commands/tasks.md`](https://github.com/github/spec-kit/blob/main/templates/commands/tasks.md)。該原始碼以 MIT License 授權，Copyright GitHub, Inc.。完整授權聲明見 [NOTICE](NOTICE)。

# SOP

## Phase 1: 讀取輸入

1. Read 讀取使用者輸入並取得目標功能目錄、既有 `tasks.md` 與本次是建立或更新。
2. Read [任務清單輸出位置規範](rules/任務清單輸出位置規範.md)並取得輸出位置與上游輸入要求。
3. Think 依已載入規範決定任務清單路徑。

## Phase 2: 對齊介面 Artifact

1. Read 讀取目標功能的 `spec.md` 並取得使用者故事、優先級、全域 NFR 與成功標準。
2. Read 讀取目標功能的 `plan.md` 並取得原始碼落地位置與系統介面盤點。
3. Read 讀取目標功能的 `techstack.md` 並取得 Setup 與 Foundational 要引用的採用技術 Area。
4. Read 讀取目標功能 `features/acceptance/` 下的 feature，並取得驗收旅程、場景標題與來源主張。
5. Read 讀取目標功能 `features/<interface>/` 下的 `.feature` 與 `dsl.md`，並取得介面情境、來源對應、Rule、場景標題與句型。
6. Think 依已載入規範決定 `spec.md`、`plan.md`、`techstack.md`、`features/acceptance/` 與 `features/<interface>/` 是否足以產生任務清單。
7. Read [任務清單輸出規範](rules/任務清單輸出規範.md)並取得階段、端點、BDD 子命令、任務標記、位址與 `/bdd` 委派要求。
8. Think 當足以產生時，依已載入規範決定 Setup、Foundational、每個使用者故事 Phase、每個全域 NFR Phase，以及總驗收 Phase 的委派 `/bdd red`、委派 `/bdd green`、委派 `/bdd refactor` 任務。

## Phase 3: 撰寫任務清單

1. Write 當上游檔案或介面 Artifact 不足時，將缺少的輸入寫入回覆。
2. Think 當上游檔案或介面 Artifact 不足時，決定本次流程停止於缺少輸入。
3. Read [產出覆蓋規範](../constitution/rules/產出覆蓋規範.md)並取得憲法讀取時機、點名部位優先順序與停止寫入條件。
4. Read 若存在，讀取 `constitution/共同/憲法套用規範.md`，取得專案套用規則；檔案不存在時，專案套用規則為空。
5. Read 若存在，讀取 `constitution/tasks/tasks.md`，取得 `tasks.md` 的憲法 Rule；檔案不存在時，憲法 Rule 為空。
6. Think 依已載入規範決定本次是否停止寫入 `tasks.md`。
7. Write 當決定停止寫入時，將拒絕原因寫入回覆。
8. Think 當決定停止寫入時，決定本次流程停止於拒絕原因。
9. Read [Tasks 骨架](templates/tasks.md)並取得任務清單的固定欄位與階段結構。
10. Read [Tasks 範例](templates/tasks.example.md)並取得已確認任務清單的填寫方式。
11. Write 當決定寫入時，依已載入樣板與範例、已載入規範和已載入的憲法 Rule，將任務清單寫入 Phase 1 決定的 `tasks.md`。

## Phase 4: 檢查任務清單

1. Read 依已載入規範、已載入樣板與已載入的憲法 Rule 檢查目標 `tasks.md`，並列出不符合項目。

## Phase 5: 修正任務清單

1. Write 修正目標 `tasks.md` 中全部不符合已載入規範、樣板結構與已載入的憲法 Rule 的項目。
