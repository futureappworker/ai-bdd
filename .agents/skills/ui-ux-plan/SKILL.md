---
name: ui-ux-plan
description: 分析前端端點、瀏覽器互動、畫面狀態與使用者流程，產出可供 API 與資料規劃對齊的 Pencil UI/UX 介面分析。
metadata:
  references:
    - project: GitHub Spec Kit
      url: https://github.com/github/spec-kit
      source: templates/commands/plan.md
      scope: Phase 1 介面契約
      license: MIT
      copyright: Copyright GitHub, Inc.
---

本 Skill 參考並改寫自 [GitHub Spec Kit](https://github.com/github/spec-kit) 的 [`templates/commands/plan.md`](https://github.com/github/spec-kit/blob/main/templates/commands/plan.md)（Phase 1 介面契約）。該原始碼以 MIT License 授權，Copyright GitHub, Inc.。完整授權聲明見 [NOTICE](NOTICE)。

# SOP

## Phase 1: 讀取介面分析輸入

1. Read 讀取使用者輸入或上游委派內容並取得系統介面名稱、端點類型、需求依據、介面定位、所在 Wave、上游分析結果與目標輸出位置。
2. Think 判斷輸入資訊是否足以分析前端互動邊界、畫面狀態與使用者流程。
3. Delegate `clarify` 當缺少會影響 UI/UX 介面邊界的核心資訊時產生澄清問題。
4. Think 當已轉交 `clarify` 時，決定本次流程停止於澄清問題產出。

## Phase 2: 推導 UI/UX 介面分析

1. Think 從需求依據推導使用者流程、主要畫面、畫面狀態、使用者操作、系統回饋與錯誤狀態。
2. Think 推導前端需要讀取、提交、訂閱或暫存的資料，取得對 API 與資料端點的需求輸入。
3. Think 推導可用性、裝置限制、狀態一致性與資訊揭露限制，取得前端介面風險與後續依賴。

## Phase 3: 撰寫 UI/UX 介面分析

1. Read [Pencil 骨架](templates/interface.pen)並取得固定內容結構。
2. Read [Pencil 範例](templates/interface.example.pen)並取得完整使用方式。
3. Read [產出覆蓋規範](../constitution/rules/產出覆蓋規範.md)並取得憲法讀取時機、點名部位優先順序與停止寫入條件。
4. Read 若存在，讀取 `constitution/共同/憲法套用規範.md`，取得專案套用規則；檔案不存在時，專案套用規則為空。
5. Read 若存在，讀取 `constitution/ui-ux-plan/interface.pen.md`，取得 Pencil 的憲法 Rule；檔案不存在時，憲法 Rule 為空。
6. Think 依已載入規範決定本次是否停止寫入。
7. Write 當決定停止寫入時，將拒絕原因寫入回覆。
8. Think 當決定停止寫入時，決定本次流程停止於拒絕原因。
9. Write 當決定寫入時，依已載入樣板與範例與已載入的憲法 Rule 將 UI/UX 介面分析寫入目標 Pencil 檔案。

## Phase 4: 檢查 UI/UX 介面分析

1. Read 依已載入規範與已載入的憲法 Rule 檢查 UI/UX 介面分析是否保留需求追溯、涵蓋使用者流程、畫面狀態、操作回饋、資料交換需求、待澄清缺口與憲法通過條件，並列出不符合項目。

## Phase 5: 修正 UI/UX 介面分析

1. Write 修正 UI/UX 介面分析中可由既有資訊處理的全部不符合已載入規範與已載入的憲法 Rule 的項目。
