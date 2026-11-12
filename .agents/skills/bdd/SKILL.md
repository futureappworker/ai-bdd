---
name: bdd
description: 對上游已產出的既有 `.feature`，依呼叫者指定的 `red`、`green` 或 `refactor` 子命令，逐一推進單一情境的測試驅動開發。支援 `features/<interface>/` 與 `features/acceptance/` 下的 `.feature`。Use when the caller already has accepted feature files and wants to run exactly one TDD phase for one scenario at a time.
---

# SOP

## Phase 1: 決定本次子命令與目標

1. Read 讀取使用者輸入、目標 `.feature`、相關 step definition、測試執行設定與產品邊界，取得本次子命令、feature 路徑、情境標題、專案目錄、測試命令、前一輪結果路徑與本輪結果路徑。
2. Read [共用執行邊界規範](rules/共用執行邊界規範.md)並取得使用時機、feature 權威、子命令責任、目標情境、命令邊界與停止條件。
3. Think 依已載入規範決定本次唯一子命令、目標情境、本輪要修改的測試檔或產品模組，以及本輪命令。

## Phase 2: 撰寫紅燈測試

1. Read 當本次子命令是 `red` 時，讀取 [紅燈規範](rules/紅燈規範.md)並取得紅燈修改邊界、接線方式與失敗證據要求。
2. Write 當本次子命令是 `red` 時，依已載入規範只把目標情境的 step definition、World 或必要測試支撐寫入既有或本輪建立的測試檔。

## Phase 3: 檢查紅燈修改

1. Read 當本次子命令是 `red` 時，讀取目標情境的 feature 步驟與本輪測試程式，依已載入規範列出全部不符合項目。

## Phase 4: 修正紅燈修改

1. Write 當本次子命令是 `red` 且紅燈修改列出不符合項目時，依已載入規範修正本輪測試程式與測試支撐，不寫入產品行為。

## Phase 5: 執行紅燈命令

1. Delegate 當本次子命令是 `red` 時，使用 `uv run --script` 執行 [情境執行 Script](scripts/run-scenario.py)，以 `--cwd` 傳入專案目錄、以 `--output` 傳入本輪結果路徑、以 `--execute` 授權執行，並把本輪命令接在 `--` 之後。
2. Read 當本次子命令是 `red` 時，讀取本輪結果檔並取得 `executed`、`exitCode`、`stdout`、`stderr` 與 `timedOut`。

## Phase 6: 檢查紅燈結果

1. Read 當本次子命令是 `red` 時，讀取本輪結果檔，依已載入規範列出紅燈證據下的全部不符合項目。

## Phase 7: 修正錯誤紅燈

1. Write 當本次子命令是 `red` 且紅燈結果列出不符合項目時，依已載入規範修正本輪測試程式與測試支撐，不寫入產品行為。

## Phase 8: 決定是否進入綠燈

1. Read 當本次子命令是 `green` 時，讀取 [綠燈規範](rules/綠燈規範.md)並取得綠燈前提、產品行為邊界與通過要求。
2. Think 當本次子命令是 `green` 時，依已載入規範決定最新紅燈證據是否允許寫入產品行為，以及本輪要修改的產品模組。

## Phase 9: 撰寫綠燈產品行為

1. Write 當本次子命令是 `green` 且已決定可以進入綠燈時，依已載入規範只把目標情境需要的產品行為寫入產品模組。

## Phase 10: 檢查綠燈修改

1. Read 當本次子命令是 `green` 且本輪已寫入產品行為時，讀取本輪產品程式、目標情境與對應測試程式，依已載入規範列出全部不符合項目。

## Phase 11: 修正綠燈修改

1. Write 當本次子命令是 `green` 且綠燈修改列出不符合項目時，依已載入規範修正本輪產品程式。

## Phase 12: 執行綠燈命令

1. Delegate 當本次子命令是 `green` 時，使用 `uv run --script` 執行 [情境執行 Script](scripts/run-scenario.py)，以 `--cwd` 傳入專案目錄、以 `--output` 傳入本輪結果路徑、以 `--execute` 授權執行，並把本輪命令接在 `--` 之後。
2. Read 當本次子命令是 `green` 時，讀取本輪結果檔並取得 `executed`、`exitCode`、`stdout`、`stderr` 與 `timedOut`。

## Phase 13: 檢查綠燈結果

1. Read 當本次子命令是 `green` 時，讀取本輪結果檔，依已載入規範列出綠燈通過要求下的全部不符合項目。

## Phase 14: 修正失敗綠燈

1. Write 當本次子命令是 `green` 且綠燈結果列出不符合項目時，依已載入規範修正本輪產品程式。

## Phase 15: 決定是否進入重構

1. Read 當本次子命令是 `refactor` 時，讀取 [重構規範](rules/重構規範.md)並取得重構範圍、可接受改動與回歸要求。
2. Think 當本次子命令是 `refactor` 時，依已載入規範決定最新通過證據是否允許重構，以及本輪要整理的測試程式。

## Phase 16: 重構測試程式

1. Write 當本次子命令是 `refactor` 且已決定可以進入重構時，依已載入規範重構目標情境的 step definition、World 或測試 helper，不改變 feature 與產品行為。

## Phase 17: 檢查重構修改

1. Read 當本次子命令是 `refactor` 且本輪已重構測試程式時，讀取重構後的測試程式與目標情境，依已載入規範列出全部不符合項目。

## Phase 18: 修正重構修改

1. Write 當本次子命令是 `refactor` 且重構修改列出不符合項目時，依已載入規範修正本輪測試程式。

## Phase 19: 執行重構驗證

1. Delegate 當本次子命令是 `refactor` 時，使用 `uv run --script` 執行 [情境執行 Script](scripts/run-scenario.py)，以 `--cwd` 傳入專案目錄、以 `--output` 傳入本輪結果路徑、以 `--execute` 授權執行，並把本輪命令接在 `--` 之後。
2. Read 當本次子命令是 `refactor` 時，讀取本輪結果檔並取得 `executed`、`exitCode`、`stdout`、`stderr` 與 `timedOut`。

## Phase 20: 檢查重構結果

1. Read 當本次子命令是 `refactor` 時，讀取本輪結果檔，依已載入規範列出重構後仍須通過下的全部不符合項目。

## Phase 21: 修正失敗重構

1. Write 當本次子命令是 `refactor` 且重構結果列出不符合項目時，依已載入規範修正本輪測試程式，不主動重構產品程式。
