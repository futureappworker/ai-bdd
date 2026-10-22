---
name: testplan
description: 在 /system-analysis 之後、/tasks 之前，依規格與上游系統分析制定測試計劃。使用者故事各成一章，其後每條有案例的全域 NFR 各成一章，最後在有跨故事旅程時加一章總驗收。使用時機：使用者要測試計劃、testplan，或要求在 tasks 之前先定義案例、Fixture 與各章 TDD 順序。
---

# SOP

## Phase 1: 讀取輸入與輸出位置

1. Read 讀取使用者輸入並取得需求範圍、規格來源、plan 來源與指定的輸出路徑。
2. Read [測試計劃輸出位置規範](rules/測試計劃輸出位置規範.md)並取得目標路徑、上游輸入與寫入邊界。
3. Think 依已載入規範決定目標測試計劃路徑。

## Phase 2: 讀取規格與上游系統分析

1. Read 讀取目標 `spec.md` 並取得使用者故事、FR、NFR、全域需求與成功標準。
2. Read 讀取目標 `plan.md` 並取得系統介面盤點與產出契約路徑。
3. Read 讀取 plan.md 產出契約列出的契約檔，並取得案例可引用的操作與 frame id。
4. Think 決定 `spec.md`、`plan.md` 與契約檔是否足以制定測試計劃。

## Phase 3: 推導測試計劃內容

1. Read [測試計劃品質規範](rules/測試計劃品質規範.md)並取得上游介面、使用者故事章、全域 NFR 章、總驗收章、Fixture、原子案例、不列為案例與各章 TDD 順序要求。
2. Think 依已載入規範決定上游介面索引、共用 Arrange Fixtures、使用者故事章、全域 NFR 章、總驗收章、不列為案例與各章 TDD 順序。

## Phase 4: 撰寫測試計劃

1. Write 當上游輸入不足時，將缺少的輸入寫入回覆。
2. Think 當上游輸入不足時，決定本次流程停止於缺少輸入。
3. Read [Test Plan Template 骨架](templates/testplan.md)並取得測試計劃的固定輸出結構。
4. Read [Test Plan Template 範例](templates/testplan.example.md)並取得完整 Artifact 的填寫方式。
5. Write 當上游輸入足夠時，依已載入樣板與範例和已載入規範將測試計劃寫入目標檔案。

## Phase 5: 檢查測試計劃

1. Read 依已載入規範與已載入樣板檢查目標測試計劃，並列出不符合項目。

## Phase 6: 修正測試計劃

1. Write 修正目標測試計劃中全部不符合已載入規範與樣板結構的項目。
