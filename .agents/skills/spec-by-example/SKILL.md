---
name: spec-by-example
description: 在 specify 的 spec.md 之後，把總驗收寫成 Spec Package 的 features/acceptance Gherkin 旅程，並依 [Need Clarifications] 標籤立刻向使用者依序澄清。Use when the user asks for spec-by-example, acceptance journeys, or Gherkin acceptance criteria from a feature spec before system analysis.
---

# SOP

## Phase 1: 取得規格與驗收目錄

1. Read 讀取使用者輸入並取得目標 `spec.md` 路徑、是否已回答既有澄清標籤，以及回答內容。
2. Read [驗收輸出位置規範](rules/驗收輸出位置規範.md)並取得目錄、檔名與單一份總驗收的要求。
3. Think 依已載入規範決定目標 `spec.md` 與 `features/acceptance` 路徑；無法判斷 Spec Package 時，決定本次要向使用者確認路徑。
4. Write 當路徑無法判斷時，將需要使用者指定的 Spec Package 寫入回覆，並停止本次 SOP 的後續步驟。
5. Read 讀取目標 `spec.md` 並取得使用者故事、驗收情境、功能需求、邊界情境與關鍵實體。
6. Read 讀取目標 `features/acceptance`；目錄不存在時，既有旅程與既有標籤為空。
7. Think 決定要寫或要更新的 feature 清單，以及本次是套用回答、撰寫旅程，或兩者都做。

## Phase 2: 套用已回答的澄清

1. Read [澄清標籤規範](rules/澄清標籤規範.md)並取得標籤位置、題數、暫定讀法與依序澄清要求。
2. Think 決定哪些已回答標籤要改哪一個步驟、要刪哪一行註解，以及同一句出現在其他場景時是否一起改。
3. Write 當使用者已回答既有標籤時，依已載入規範把回答寫進 `features/acceptance` 的對應步驟並移除該標籤。

## Phase 3: 撰寫驗收旅程

1. Read [驗收旅程規範](rules/驗收旅程規範.md)並取得旅程顆粒度、背景是否寫入、一個當、終點驗收與系統事實要求。
2. Read [Gherkin 階層與原子規則規範](../gherkin-and-dsl/rules/Gherkin階層與原子規則規範.md)並取得階層、縮排與場景標題要求。
3. Read [Gherkin 背景與場景大綱規範](../gherkin-and-dsl/rules/Gherkin背景與場景大綱規範.md)並取得場景大綱要求，以及已決定寫入背景時背景可包含的內容。
4. Read [Gherkin 步驟格式規範](../gherkin-and-dsl/rules/Gherkin步驟格式規範.md)並取得關鍵字、引號、一個當與同句步驟要求。
5. Read [電商完成一筆訂單](templates/電商範例/完成一筆訂單.feature)並取得單賣家旅程、澄清標籤與變種分支的寫法。
6. Read [電商多賣家交易完成](templates/電商範例/多賣家交易完成.feature)並取得跨角色長旅程與終點表的寫法。
7. Read [電商送達後退貨](templates/電商範例/送達後退貨.feature)並取得後段旅程用假設承接前段結果的寫法。
8. Read [驗收旅程骨架](templates/驗收旅程.feature)並取得單份 feature 的固定結構。
9. Read [驗收旅程範例](templates/驗收旅程.example.feature)並取得骨架的填寫方式。
10. Write 依已載入規範與已載入樣板與範例，把總驗收旅程寫入目標 `features/acceptance`。

## Phase 4: 檢查驗收旅程

1. Read 讀取目標 `features/acceptance` 的 feature，依已載入規範列出不符合項目。

## Phase 5: 修正驗收旅程

1. Write 修正目標 `features/acceptance` 中全部不符合已載入規範的項目。

## Phase 6: 依序澄清

1. Think 依已載入規範，按 feature 檔名與檔內出現順序整理尚未回答的澄清標籤，並決定本次鎖定題目；沒有未回答標籤時，決定不委派。
2. Delegate `clarify` 當本次有未回答標籤時，依已排好的順序交出鎖定題目，由它產生澄清問題。
3. Think 當本次問完後仍有未回答標籤時，決定流程停在這一批問題，等待使用者回答後再問下一批。
