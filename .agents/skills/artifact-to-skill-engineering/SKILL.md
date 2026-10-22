---
name: artifact-to-skill-engineering
description: 從已確認滿意的 Artifact Example 反推出可穩定產出該 Artifact 的目標 Skill，並編排 skill-form-template 與 skill-engineering 完成最小必要工程。
---

# SOP

## Phase 1: 取得目標與參考 Artifact

1. Read 讀取使用者輸入、目標 Skill 名稱、參考 Artifact Example 來源、預期輸入 Prompt 類型與客製化意圖。
2. Read [Artifact-to-Skill 工程規範](rules/artifact-to-skill工程規範.md)並取得參考 Artifact、客製化確認、Template 倒抽與 Skill Engineering 交付要求。
3. Think 依已載入規範決定目標 Artifact 類型、目標 Skill 邊界、已具備輸入與缺少的必要輸入。
4. Write 當缺少必要輸入時，將缺少輸入清單與下一步確認問題寫入回覆並停止後續 Phase。

## Phase 2: 客製化並確認 Artifact Example

1. Think 依已載入規範比較參考 Artifact Example 與使用者客製化意圖，決定需要修改的 Artifact 內容範圍與修改目標。
2. Write 當需要修改 Artifact Example 時，將客製化後的 Artifact Example 寫入指定檔案或回覆。
3. Think 依已載入規範判斷使用者是否已明確確認 Artifact Example 滿意。
4. Write 當使用者尚未確認 Artifact Example 滿意時，將待確認的 Artifact Example、確認問題與停止原因寫入回覆並停止後續 Phase。

## Phase 3: 倒抽並驗證 Template

1. Delegate `skill-form-template` 依已確認的 Artifact Example 建立或更新目標 Skill 的成對 Template。
2. Read 讀取已產出的 Template 骨架與 Template 範例，取得目標 Artifact 的固定結構、必要欄位與範例對應關係。
3. Think 依已載入規範判斷 Template 是否完整保留已確認 Artifact Example 的結構、欄位與內容契約。
4. Delegate 當 Template 不符合已載入規範時，交給 `skill-form-template` 修正 Template 骨架與 Template 範例。

## Phase 4: 整理 Skill Engineering 交付

1. Think 依已載入規範整理目標 Skill 名稱、用途、觸發條件、輸入 Prompt 類型、目標 Artifact Template、可靠度要求、建立或優化模式與工程邊界。
2. Delegate `skill-engineering` 依已整理的交付內容建立或優化目標 Skill。

## Phase 5: 檢查整體結果

1. Read 讀取目標 Skill 的 `SKILL.md`、`rules/`、`templates/` 與 `scripts/`，取得 SOP、模組使用關係與產物結構。
2. Think 依已載入規範判斷目標 Skill 是否能由預期輸入 Prompt 可靠產出已確認的 Artifact Template。
3. Delegate 當目標 Skill 存在孤兒模組、過度工程或產物契約不一致時，交給 `skill-engineering` 修正目標 Skill。
4. Write 將完成結果、剩餘風險或等待使用者確認的事項寫入回覆。
