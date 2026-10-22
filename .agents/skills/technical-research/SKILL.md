---
name: technical-research
description: 在 `/specify` 產出的 Feature Specification 之後，推導可進入 planning 的技術決策 Research 與 Tech Stack 文件。
metadata:
  references:
    - project: GitHub Spec Kit
      url: https://github.com/github/spec-kit
      source: templates/commands/plan.md
      scope: Phase 0 research.md
      license: MIT
      copyright: Copyright GitHub, Inc.
---

本 Skill 參考並改寫自 [GitHub Spec Kit](https://github.com/github/spec-kit) 的 [`templates/commands/plan.md`](https://github.com/github/spec-kit/blob/main/templates/commands/plan.md)（Phase 0 research.md）。該原始碼以 MIT License 授權，Copyright GitHub, Inc.。完整授權聲明見 [NOTICE](NOTICE)。

# SOP

## Phase 1: 讀取輸入與樣板

1. Read 讀取使用者輸入並取得目標 Feature Specification 路徑、研究輸出意圖與已提供的技術偏好。
2. Read [Research 輸出品質規範](rules/research輸出品質規範.md)並取得輸入來源、輸出位置、決策推導、替代方案、Tech Stack 摘要與 planning 邊界要求。
3. Read [Research Template 骨架](templates/research.md)並取得 Technical Research 的固定輸出結構。
4. Read [Research Template 範例](templates/research.example.md)並取得完整 Artifact 的填寫方式。
5. Read [Tech Stack Template 骨架](templates/techstack.md)並取得 Tech Stack Summary 的固定輸出結構。
6. Read [Tech Stack Template 範例](templates/techstack.example.md)並取得完整 Artifact 的填寫方式。
7. Think 依已載入規範決定目標 Research 文件路徑、目標 Tech Stack 文件路徑與本次輸出模式。

## Phase 2: 讀取 Feature Specification

1. Read 讀取目標 Feature Specification 並取得功能名稱、狀態、使用者故事、功能需求、非功能需求、全域需求、邊界情境、關鍵實體、成功標準與假設。
2. Think 依已載入規範判斷 Feature Specification 是否已足以進入 Technical Research。

## Phase 3: 推導技術決策與堆疊摘要

1. Think 依已載入規範從 Feature Specification 與使用者技術偏好推導需要在 planning 前固定的技術取捨。
2. Think 依已載入規範為每個技術取捨決定 Decision 標題、Rationale 與 Alternatives considered。
3. Think 依已載入規範從已決定的技術取捨萃取採用技術、延後或不採用技術與 planning implications。

## Phase 4: 撰寫 Research 與 Tech Stack

1. Read [產出覆蓋規範](../constitution/rules/產出覆蓋規範.md)並取得憲法讀取時機、點名部位優先順序與停止寫入條件。
2. Read 若存在，讀取 `constitution/共同/憲法套用規範.md`，取得專案套用規則；檔案不存在時，專案套用規則為空。
3. Read 若存在，讀取 `constitution/technical-research/research.md`，取得 `research.md` 的憲法 Rule；檔案不存在時，憲法 Rule 為空。
4. Read 若存在，讀取 `constitution/technical-research/techstack.md`，取得 `techstack.md` 的憲法 Rule；檔案不存在時，憲法 Rule 為空。
5. Think 依已載入規範決定本次是否停止寫入。
6. Write 當決定停止寫入時，將拒絕原因寫入回覆。
7. Think 當決定停止寫入時，決定本次流程停止於拒絕原因。
8. Write 當決定寫入時，依已載入樣板與範例與已載入的憲法 Rule 將 Technical Research 寫入目標 Research 文件。
9. Write 當決定寫入時，依已載入樣板與範例與已載入的憲法 Rule 將 Tech Stack Summary 寫入目標 Tech Stack 文件。

## Phase 5: 檢查 Research 與 Tech Stack

1. Read 依已載入規範與已載入的憲法 Rule 檢查目標 Research 文件與目標 Tech Stack 文件是否符合 Feature Specification 來源、決策粒度、替代方案完整性、Tech Stack 可追溯性、planning 邊界、樣板結構或憲法通過條件，並列出不符合項目。

## Phase 6: 修正 Research 與 Tech Stack

1. Write 修正目標 Research 文件與目標 Tech Stack 文件中可由既有資訊處理的全部不符合已載入規範、樣板結構與已載入的憲法 Rule 的問題。
