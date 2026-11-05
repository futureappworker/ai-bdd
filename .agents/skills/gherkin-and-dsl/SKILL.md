---
name: gherkin-and-dsl
description: 評估 Gherkin 與 DSL 能否不靠猜測落地成步驟定義。完整對照見 examples/features 的電商後端與前端，各有多份 feature 與一份 dsl.md。Use when the user asks to evaluate, review, or check feature files and a DSL for atomic rules, backgrounds, scenario outlines, step sentences, or whether tests can be written from the DSL.
---

# SOP

## Phase 1: 取得受評範圍

1. Read 讀取使用者指定的 `.feature` 與 DSL；未指定時讀取本次對話正在處理的 feature 目錄與同目錄 DSL，取得每條 Rule、每個場景、每句步驟，以及 DSL 的句型、參數、預設與通道。
2. Think 決定本次受評的 feature 清單與 DSL 路徑。`examples/features` 的電商示範不納入評估，除非使用者指定要評估它。

## Phase 2: 執行 Gherkin 機械檢查

1. Think 決定每個受評 feature 的檢查報告路徑，該路徑不得覆寫 feature、DSL 或產品程式。
2. Delegate 當 `.agents/skills/bdd/scripts/check-gherkin.py` 存在時，對每個受評 feature 以 `uv run --script` 執行該 script，`--feature` 傳入 feature 路徑、`--output` 傳入已決定的檢查報告路徑。
3. Read 讀取每份檢查報告並取得錯誤代碼；script 不存在時，取得「機械檢查未執行」。

## Phase 3: 評估 Gherkin 語意

1. Read [Gherkin階層與原子規則規範](rules/Gherkin階層與原子規則規範.md)並取得階層、原子規則與場景標題要求。
2. Read [Gherkin背景與場景大綱規範](rules/Gherkin背景與場景大綱規範.md)並取得背景範圍與場景大綱要求。
3. Read [Gherkin步驟格式規範](rules/Gherkin步驟格式規範.md)並取得關鍵字、引號與同句步驟要求。
4. Read [後端加入購物車](examples/features/backend/加入購物車.feature)並取得有庫存加入、一次多項與庫存不足的寫法。
5. Read [後端調整數量](examples/features/backend/調整數量.feature)並取得改數量、超過庫存與改成 0 的寫法。
6. Read [後端套用優惠](examples/features/backend/套用優惠.feature)並取得折抵、金額與無效代碼的寫法。
7. Read [後端結帳](examples/features/backend/結帳.feature)並取得空購物車、運費、折抵後金額與不可配送的寫法。
8. Read [後端付款](examples/features/backend/付款.feature)並取得付清、金額不符、付款方式與重複付款的寫法。
9. Read [後端查看訂單](examples/features/backend/查看訂單.feature)並取得同一動作觀察不同欄位的寫法。
10. Read [後端句型](examples/features/backend/dsl.md)並取得後端每一句的參數、HTTP、預設與五個通道。
11. Read [前端加入購物車](examples/features/frontend/加入購物車.feature)並取得畫面上加入商品的寫法。
12. Read [前端調整數量](examples/features/frontend/調整數量.feature)並取得畫面上改數量的寫法。
13. Read [前端套用優惠](examples/features/frontend/套用優惠.feature)並取得畫面上折抵的寫法。
14. Read [前端結帳](examples/features/frontend/結帳.feature)並取得空購物車與可配送地區結帳的寫法。
15. Read [前端付款](examples/features/frontend/付款.feature)並取得付清與金額不符的寫法。
16. Read [前端完成購物](examples/features/frontend/完成購物.feature)並取得一次旅程只用一個當的寫法。
17. Read [前端句型](examples/features/frontend/dsl.md)並取得前端每一句的畫面操作、test id 與五個通道。
18. Think 依已載入規範、已載入電商 features，以及檢查報告，列出每個 feature 中無法單獨執行，或會讓步驟定義猜測的 Gherkin 項目。

## Phase 4: 評估 DSL

1. Read [DSL可落地規範](rules/DSL可落地規範.md)並取得句型、通道與高階句子要求。
2. Think 依已載入規範與已載入電商 features，比對受評 feature 的每句步驟與 DSL，列出缺句、缺參數、缺技術入口、缺通道，以及 When 夾帶斷言的項目。

## Phase 5: 產出評估結論

1. Read [評估結論規範](rules/評估結論規範.md)並取得結論分級與停止要求。
2. Think 依已載入規範把 Phase 3 與 Phase 4 的不符合項目分成必須修正與刻意保留，並決定目前能否開始撰寫步驟定義。
