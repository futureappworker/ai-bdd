---
name: clarify
description: 針對任何任務、Artifact 或決策中的核心不確定處產生澄清問題。依影響排序，最多五題；不把回答寫入目標檔案。
metadata:
  references:
    - project: GitHub Spec Kit
      url: https://github.com/github/spec-kit
      source: templates/commands/clarify.md
      license: MIT
      copyright: Copyright GitHub, Inc.
---

本 Skill 參考並改寫自 [GitHub Spec Kit](https://github.com/github/spec-kit) 的 [`templates/commands/clarify.md`](https://github.com/github/spec-kit/blob/main/templates/commands/clarify.md)。該原始碼以 MIT License 授權，Copyright GitHub, Inc.。完整授權聲明見 [NOTICE](NOTICE)。

# SOP

## Phase 1: 讀取輸入與目標

1. Read 讀取使用者輸入並取得澄清意圖、目標任務或 Artifact、可用上下文、目標檔案位置與呼叫者已鎖定的題目。
2. Read 當使用者提供目標檔案時，讀取目標檔案並取得其目的、狀態、既有澄清紀錄、決策點、需求、假設與未解缺口。

## Phase 2: 決定提問清單

1. Read [Clarification 品質規範](rules/clarification品質規範.md)並取得提問範圍、題數、排序、鎖定題目與問題格式要求。
2. Think 依已載入規範決定本次要輸出的澄清問題清單；沒有核心缺口時，決定不產出問題。

## Phase 3: 產生澄清問題

1. Read 當本次要產出問題時，讀取 [Clarification Question 骨架](templates/clarification-question.md)並取得固定內容結構。
2. Read 當本次要產出問題時，讀取 [Clarification Question 範例](templates/clarification-question.example.md)並取得完整使用方式。
3. Write 當本次要產出問題時，依已載入規範、樣板與範例將澄清問題與選項寫入回覆 Artifact。

## Phase 4: 檢查澄清問題

1. Read 當回覆已寫入澄清問題時，依已載入規範與樣板檢查問題清單、選項、推薦與題數，並列出不符合項目。

## Phase 5: 修正澄清問題

1. Write 當檢查發現不符合項目時，修正回覆 Artifact 中全部不符合已載入規範與樣板的澄清問題。
