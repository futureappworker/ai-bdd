---
name: specify
description: 將使用者的 Feature Prompt 轉換為可進入 planning 的 Feature Specification；當核心需求不明確時，先產生可澄清的 spec 初稿。規格與 checklist 寫完後，若狀態仍是 Needs Clarification，轉交 clarify-over-specs 以提問模式產生澄清問題。
metadata:
  references:
    - project: GitHub Spec Kit
      url: https://github.com/github/spec-kit
      source: templates/commands/specify.md
      license: MIT
      copyright: Copyright GitHub, Inc.
---

本 Skill 參考並改寫自 [GitHub Spec Kit](https://github.com/github/spec-kit) 的 [`templates/commands/specify.md`](https://github.com/github/spec-kit/blob/main/templates/commands/specify.md)。該原始碼以 MIT License 授權，Copyright GitHub, Inc.。完整授權聲明見 [NOTICE](NOTICE)。

# SOP

## Phase 1: 讀取輸入與樣板

1. Read 讀取使用者輸入並取得原始 Feature Prompt、目標輸出意圖、已提供的澄清答案，以及是否明確指定既有 Feature Specification 路徑。
2. Read [規格輸出位置規範](rules/規格輸出位置規範.md)並取得目標路徑、檔名、寫入模式、狀態與既有規格選擇要求。
3. Read 讀取 `specs/` 下每個 feature 目錄的 `spec.md` 狀態列；`specs/` 不存在或沒有 feature 目錄時，既有規格為空。
4. Think 依已載入規範決定目標 Feature Specification 路徑與本次寫入模式，或決定本次為等待使用者選擇。
5. Write 若本次為等待使用者選擇，將尚未完成的 feature 目錄與選擇問題寫入回覆，並停止本次 SOP 的所有後續步驟。
6. Read [Spec Template 骨架](templates/spec.md)並取得 Feature Specification 的固定輸出結構。
7. Read [Spec Template 範例](templates/spec.example.md)並取得完整 Artifact 的填寫方式。

## Phase 2: 推導規格內容

1. Read [Spec 推導品質規範](rules/spec推導品質規範.md)並取得需求抽取、User Story 分群、FR/NFR 歸屬、全域需求與核心缺口標記要求。
2. Think 依已載入規範從使用者輸入抽取明確需求、限制條件、資料物件、互動行為、未知點與可成立假設。
3. Think 依已載入規範決定 User Stories、Acceptance Scenarios、Functional Requirements、Non-Functional Requirements、Global Requirements、Edge Cases、Key Entities、Success Criteria 與 Assumptions。

## Phase 3: 判斷澄清需求

1. Think 依已載入規範判斷是否存在會影響核心規格的未回答缺口。
2. Read [產出覆蓋規範](../constitution/rules/產出覆蓋規範.md)並取得憲法讀取時機、點名部位優先順序與停止寫入條件。
3. Read 若存在，讀取 `constitution/共同/憲法套用規範.md`，取得專案套用規則；檔案不存在時，專案套用規則為空。
4. Read 若存在，讀取 `constitution/specify/spec.md`，取得 `spec.md` 的憲法 Rule；檔案不存在時，憲法 Rule 為空。
5. Think 依已載入規範決定本次是否停止寫入 `spec.md`。
6. Write 當決定停止寫入時，將拒絕原因寫入回覆。
7. Think 當決定停止寫入時，決定本次流程停止於拒絕原因。
8. Write 當存在核心缺口且決定寫入時，依已載入樣板與已載入的憲法 Rule 將可由明確資訊產生的內容寫入目標 Feature Specification，並將 Status 設為 `Needs Clarification`。

## Phase 4: 撰寫完整規格

1. Write 當不存在核心缺口或使用者答案已套用，且未因憲法停止時，依已載入樣板與已載入的憲法 Rule 將完整 Feature Specification 寫入目標檔案。

## Phase 5: 產生 Requirements Checklist

1. Read [Requirements Checklist 品質規範](rules/requirements-checklist品質規範.md)並取得獨立 Artifact 路徑、逐項驗證與修正閉環要求。
2. Think 決定目標 Requirements Checklist 路徑與本次 checklist 建立模式。
3. Read [Requirements Checklist 骨架](templates/requirements-checklist.md)並取得固定內容結構。
4. Read [Requirements Checklist 範例](templates/requirements-checklist.example.md)並取得完整使用方式。
5. Read 若存在，讀取 `constitution/specify/requirements.md`，取得 checklist 的憲法 Rule；檔案不存在時，憲法 Rule 為空。
6. Think 依已載入規範決定本次是否停止寫入 checklist。
7. Write 當決定停止寫入時，將拒絕原因寫入回覆。
8. Think 當決定停止寫入時，決定本次流程停止於拒絕原因。
9. Write 當決定寫入時，依已載入樣板與範例與已載入的憲法 Rule 將 Requirements Checklist 寫入目標 Feature Specification 所屬 feature 目錄。

## Phase 6: 檢查規格與 Checklist 一致性

1. Read 依已載入規範與已載入的憲法 Rule 檢查目標 Feature Specification 是否存在捏造澄清、需求錯誤歸屬、未處理核心缺口、矛盾需求、過時 Assumptions、樣板結構偏離或憲法未通過項目，並列出不符合項目。
2. Read 依已載入規範與已載入的憲法 Rule 逐項驗證目標 Requirements Checklist 並列出未通過項目。

## Phase 7: 修正規格並更新 Checklist

1. Write 修正目標 Feature Specification 中可由既有資訊處理的全部不符合已載入規範、樣板結構與已載入的憲法 Rule 的問題。
2. Write 更新目標 Requirements Checklist 中各項通過狀態與 Notes，並修正未通過的憲法 Rule。

## Phase 8: 委派規格澄清提問

1. Read [規格澄清提問委派規範](rules/規格澄清提問委派規範.md)並取得委派條件與委派邊界。
2. Think 依已載入規範決定本次是否委派規格澄清提問。
3. Delegate `clarify-over-specs` 當已載入規範要求委派時，針對已寫入的 Feature Specification 以提問模式產生澄清問題。
