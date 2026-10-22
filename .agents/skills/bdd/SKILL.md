---
name: bdd
description: 依需求先寫 Gherkin 並停止等待 Review；使用者明示接受目前 feature 後，才對每個情境逐一做紅燈、綠燈與重構。Use when the user asks to turn a requirement into Gherkin or Cucumber scenarios, review a feature file, or implement approved scenarios with test-driven development.
---

# SOP

## Phase 1: 判斷 Gherkin 與實作模式

1. Read 讀取使用者本次輸入、需求來源、專案內既有 `.feature`、step definition、測試執行設定與產品邊界，取得需求範圍、Review 結論與 Cucumber 佈局。
2. Read [Review 閘門規範](rules/Review閘門規範.md)並取得模式判斷、停止條件與回覆要求。
3. Think 依已載入規範決定本次模式是「產出 Gherkin」、「修改 Gherkin」或「測試驅動開發」，並決定 feature 路徑、專案目錄、檢查報告路徑與執行結果路徑；後兩個路徑不得覆寫 feature 或產品程式。

## Phase 2: 撰寫 Gherkin

1. Read 當本次模式是產出或修改 Gherkin 時，讀取 [Gherkin 格式規範](rules/Gherkin格式規範.md)並取得 feature 格式要求。
2. Read 當本次模式是產出或修改 Gherkin 時，讀取 [Gherkin 情境規範](rules/Gherkin情境規範.md)並取得情境內容要求。
3. Write 當本次模式是產出或修改 Gherkin 時，依已載入規範把 feature 寫入已決定的 feature 路徑。

## Phase 3: 檢查 Gherkin

1. Delegate 當本次模式是產出或修改 Gherkin 時，使用 `uv run --script` 執行 [Gherkin 檢查 Script](scripts/check-gherkin.py)，以 `--feature` 傳入 feature 路徑、以 `--output` 傳入檢查報告路徑，並把檢查報告寫入該路徑。
2. Read 當本次模式是產出或修改 Gherkin 時，讀取檢查報告、本次 feature 與專案內其他 `.feature`，依已載入規範列出全部不符合項目。

## Phase 4: 修正 Gherkin

1. Write 當檢查列出不符合項目時，依已載入規範修正 feature 檔的全部不符合項目。

## Phase 5: 停止等待 Review

1. Think 當本次模式是產出或修改 Gherkin 時，依已載入規範決定在 Review 閘門停止，並確定回覆必含的 feature 路徑、完整 feature 內容、場景標題與缺口。

## Phase 6: 撰寫下一個情境的紅燈

1. Read 當本次模式是測試驅動開發時，讀取 [情境測試驅動規範](rules/情境測試驅動規範.md)並取得盤點、紅燈、綠燈、重構與推進要求。
2. Think 當本次模式是測試驅動開發時，依已載入規範決定本輪預期是「盤點」、「紅燈」或「通過」、本輪命令，以及是否寫入一個未通過情境的 step definition。
3. Write 當已決定寫入一個未通過情境的紅燈時，依已載入規範只把該情境的 step definition 與必要測試支撐寫入已存在或本輪建立的測試檔。

## Phase 7: 檢查紅燈步驟

1. Read 當本輪已寫入 step definition 時，讀取該情境的 feature 步驟與 step definition，依已載入規範列出全部不符合項目。

## Phase 8: 修正紅燈步驟

1. Write 當紅燈檢查列出不符合項目時，依已載入規範修正該情境的 step definition 與測試支撐，不寫入產品行為。

## Phase 9: 執行目前情境

1. Delegate 當本輪已決定命令時，使用 `uv run --script` 執行 [情境執行 Script](scripts/run-scenario.py)，以 `--cwd` 傳入專案目錄、以 `--output` 傳入結果路徑、以 `--execute` 授權執行，並把本輪命令接在 `--` 之後；Script 將執行結果寫入 `--output`。
2. Read 當本輪命令已執行時，讀取該結果檔並取得 `executed`、`exitCode`、`stdout`、`stderr` 與 `timedOut`。

## Phase 10: 檢查執行結果

1. Read 當本輪已有結果檔時，讀取本輪結果檔，依已載入規範列出本輪預期下的不符合項目。

## Phase 11: 修正錯誤紅燈

1. Write 當本輪預期是「紅燈」且執行結果列出不符合項目時，依已載入規範修正 step definition 或測試支撐，不寫入產品行為。

## Phase 12: 撰寫產品行為

1. Write 當最新結果已是符合規範的紅燈且本情境產品行為尚未寫入時，依已載入規範只把該情境的產品行為寫入產品模組。

## Phase 13: 檢查產品行為

1. Read 當本輪已寫入產品行為時，讀取該次產品程式與對應 feature，依已載入規範列出全部不符合項目。

## Phase 14: 修正產品行為

1. Write 當本次模式是測試驅動開發，且產品行為檢查列出不符合項目或預期「通過」的最新執行結果失敗時，依已載入規範修正產品程式。

## Phase 15: 重構測試程式

1. Write 當本情境最新執行已通過，且 step definition 仍違反已載入規範時，依已載入規範重構測試程式，不改變產品行為與 feature。

## Phase 16: 檢查重構

1. Read 當本輪已重構測試程式時，讀取重構後的測試程式與該情境 feature，依已載入規範列出全部不符合項目。

## Phase 17: 修正重構

1. Write 當重構檢查列出不符合項目時，依已載入規範修正測試程式。

## Phase 18: 決定下一輪

1. Think 當本次模式是測試驅動開發時，依本輪預期、最新結果檔、產品程式是否在最近一次執行之後又被修改，以及已載入規範，決定且只決定一項下一步：盤點尚未完成時從 Phase 9 以整個 feature 的命令執行，預期為「盤點」；盤點完成且有未通過情境時從 Phase 6 寫下一個未通過情境的紅燈；紅燈證據尚未符合時從 Phase 9 再執行且不寫產品行為；紅燈證據已符合但尚未寫入產品行為時從 Phase 12 繼續；產品行為已寫入但尚未以預期「通過」執行，或產品程式在最近一次執行之後又被修改時，從 Phase 9 再執行，預期為「通過」；預期「通過」但結果失敗時從 Phase 14 修正產品程式；本情境已通過且測試程式仍違反已載入規範時從 Phase 15 重構；本情境已通過且仍有下一個未通過情境時從 Phase 6 繼續，沿用已載入規範，不再次 Read 同一 Rule File；全部情境已通過但尚未執行整個 feature 時從 Phase 9 以整個 feature 的命令執行，預期為「通過」；整個 feature 已通過時結束，並在回覆列出 feature 路徑與每個情境的通過結果。
