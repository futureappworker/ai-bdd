---
name: implement
description: 在 `/tasks` 產出 `tasks.md` 之後，依 feature 目錄中的 `tasks.md` 由上往下執行全部任務、更新 checkbox；標有 **BDD 子命令** 的任務由 `implement` 委派給 `/bdd`。全部任務完成後，`implement` 必須把 `spec.md` 標為 Implemented。
metadata:
  references:
    - project: GitHub Spec Kit
      url: https://github.com/github/spec-kit
      source: templates/commands/implement.md
      license: MIT
      copyright: Copyright GitHub, Inc.
---

本 Skill 參考並改寫自 [GitHub Spec Kit](https://github.com/github/spec-kit) 的 [`templates/commands/implement.md`](https://github.com/github/spec-kit/blob/main/templates/commands/implement.md)。該原始碼以 MIT License 授權，Copyright GitHub, Inc.。完整授權聲明見 [NOTICE](NOTICE)。

# SOP

## Phase 1: 讀取輸入與定位任務清單

1. Read 讀取使用者輸入並取得目標 feature 目錄，以及是否允許略過規格品質清單。
2. Think 決定目標 `tasks.md` 路徑為指定 feature 目錄或目前功能目錄中的任務清單。
3. Read 讀取目標 `tasks.md` 並取得未完成任務、任務描述與 References。
4. Read 讀取同目錄 `plan.md` 並取得原始碼落地位置。

## Phase 2: 確認規格品質清單

1. Read 若 feature 目錄存在 `checklists/`，讀取其中的 checklist 檔案並取得勾選狀態。
2. Read [規格品質清單確認規範](rules/規格品質清單確認規範.md)並取得未完成項目與略過條件。
3. Think 依已載入規範決定本次是停下詢問，或繼續執行任務。
4. Write 若本次是停下詢問，將未完成的 checklist 項目與是否繼續的問題寫入回覆，並停止本次 SOP 的所有後續步驟。

## Phase 3: 選擇下一個任務

1. Read 讀取 `tasks.md` 並取得未完成任務。
2. Read [任務選擇規範](rules/任務選擇規範.md)並取得單一任務的選擇要求。
3. Think 依已載入規範決定本次唯一目標任務；沒有未完成任務時，目標任務為空。
4. Think 若目標任務為空，決定進入 Phase 9，並停止本 Phase 之後、Phase 9 之前的所有步驟。

## Phase 4: 載入任務最小上下文

1. Read [任務上下文載入規範](rules/任務上下文載入規範.md)並取得 References 與原始碼讀取要求。
2. Read 依已載入規範讀取本次目標任務的 References 位址並取得權威場景、DSL 句型、契約部位或驗收旅程。
3. Read 依已載入規範讀取本次目標任務的目標檔案、相鄰測試檔與必要原始碼並取得既有實作模式。

## Phase 5: 執行目前任務

1. Read [任務執行規範](rules/任務執行規範.md)並取得變更範圍、BDD 任務與非 BDD 工程任務要求。
2. Read [BDD子命令委派規範](rules/BDD子命令委派規範.md)並取得有 **BDD 子命令** 的任務委派要求。
3. Think 依已載入規範決定本次目標任務唯一允許使用的場景位址、驗證命令邊界、目標檔案與可接受輸出證據。
4. Think 依已載入規範決定本次目標任務是 BDD 子命令或非 BDD 工程任務，以及該任務的完成判定。
5. Think 若本次目標任務標有 **BDD 子命令**，依已載入規範決定本輪採獨立 `/bdd` 委派模式或等價子命令模式。
6. Delegate 若本次目標任務標有 **BDD 子命令** 且本輪採獨立 `/bdd` 委派模式，依已載入規範將該任務的子命令、`.feature` 場景位址、若存在則帶上的 `dsl.md` 句型位址，以及目標檔交給 `/bdd`。
7. Write 若本次目標任務標有 **BDD 子命令** 且本輪採等價子命令模式，依已載入規範只寫入這一個子命令需要的測試程式、最小實作或重構。
8. Write 若本次目標任務沒有 **BDD 子命令**、且是非 BDD 工程任務，依已載入規範將最小變更寫入目標檔案。

## Phase 6: 驗證目前任務

1. Read 當本次目標任務標有 **BDD 子命令** 且本輪採獨立 `/bdd` 委派模式時，讀取 `/bdd` 的回覆並取得完成證據、阻擋原因與是否可打勾。
2. Read 當本次目標任務標有 **BDD 子命令** 且本輪採等價子命令模式時，讀取本輪情境命令輸出與修改結果並取得完成證據、阻擋原因與是否可打勾。
3. Read 當本次目標任務沒有 **BDD 子命令** 時，讀取專案根目錄的套件、測試、lint 與格式化設定檔並取得可用驗證命令。
4. Read 當本次目標任務沒有 **BDD 子命令** 時，讀取 [任務驗證規範](rules/任務驗證規範.md)並取得驗證與修正要求。
5. Think 當本次目標任務沒有 **BDD 子命令** 時，依已載入規範決定本次目標任務的驗證命令。
6. Delegate 當本次目標任務沒有 **BDD 子命令** 時，依已載入規範使用專案既有測試、lint 或 typecheck 指令驗證本次目標任務並取得結果。
7. Read 當本次目標任務沒有 **BDD 子命令** 時，讀取本次驗證輸出並取得通過或失敗證據。
8. Think 依已載入規範決定處置是通過、修正目前任務或停止於硬阻擋。

## Phase 7: 修正或停止目前任務

1. Read [硬阻擋判定規範](rules/硬阻擋判定規範.md)並取得停止證據、可繼續條件與回覆要求。
2. Think 依已載入規範決定本次目標任務是繼續同一任務、或已命中硬阻擋。
3. Delegate 當本次目標任務標有 **BDD 子命令**、本輪採獨立 `/bdd` 委派模式、且仍有同任務下一個具體嘗試時，依已載入規範以同一子命令與同一場景再次交給 `/bdd`，回到 Phase 6 第 1 步，並停止本步驟之後的步驟。
4. Write 當本次目標任務標有 **BDD 子命令**、本輪採等價子命令模式、且仍有同任務下一個具體嘗試時，依已載入規範修正目標檔案，回到 Phase 6 第 2 步，並停止本步驟之後的步驟。
5. Write 當本次目標任務沒有 **BDD 子命令** 且仍有同任務下一個具體嘗試時，依已載入規範修正該任務描述列出的檔案，回到 Phase 6 第 5 步，並停止本步驟之後的步驟。
6. Write 當本次目標任務已命中硬阻擋時，將阻擋原因、最新失敗摘要與當前任務 ID 寫入回覆，並停止本步驟之後的步驟。

## Phase 8: 打勾並決定下一步

1. Read [任務打勾規範](rules/任務打勾規範.md)並取得 checkbox 的寫入與符合狀態要求。
2. Write 依已載入規範將本次目標任務 checkbox 從 `[ ]` 更新為 `[X]`。
3. Read [連續執行規範](rules/連續執行規範.md)並取得下一個執行位置與同一輪跑完的要求。
4. Think 若仍有未完成任務且未命中硬阻擋，決定在同一輪使用者訊息內回到 Phase 3 繼續，並停止本 Phase 之後、下次完成任務前的所有步驟。
5. Think 若任務已全數完成，決定進入 Phase 9。

## Phase 9: 標記規格完成狀態

1. Read 讀取 `tasks.md` 並取得未完成任務。
2. Read 讀取目標 `spec.md` 的狀態列；檔案不存在時，規格狀態為空。
3. Read [規格完成狀態規範](rules/規格完成狀態規範.md)並取得完成狀態的寫入條件與狀態值。
4. Think 依已載入規範決定本次是否滿足完成狀態的寫入條件。
5. Read 若滿足寫入條件且本次尚未載入 [產出覆蓋規範](../constitution/rules/產出覆蓋規範.md)，讀取該規範並取得憲法讀取時機與停止寫入條件。
6. Read 若滿足寫入條件且本次尚未載入，讀取 `constitution/共同/憲法套用規範.md`；檔案不存在時，專案套用規則為空。
7. Read 若滿足寫入條件且本次尚未載入，讀取 `constitution/specify/spec.md`，取得 `spec.md` 的憲法 Rule；檔案不存在時，憲法 Rule 為空。
8. Think 若滿足寫入條件，依已載入規範決定本次是更新目標 `spec.md` 的狀態，或因憲法停止寫入。
9. Write 若本次是因憲法停止寫入，將拒絕原因寫入回覆。
10. Write 若本次是更新狀態，依已載入規範與已載入的憲法 Rule 只更新目標 `spec.md` 的狀態列。

## Phase 10: 檢查規格完成狀態

1. Read 讀取目標 `spec.md` 的狀態列，並依已載入規範檢查完成狀態，列出不符合項目；檔案不存在時，規格狀態為空。

## Phase 11: 修正規格完成狀態

1. Write 依已載入規範與已載入的憲法 Rule 修正目標 `spec.md` 狀態列的不符合項目。

## Phase 12: 檢查是否允許結束本次執行

1. Read 讀取 `tasks.md` 並取得已完成任務、未完成任務與文件順序上的第一個未完成任務 ID。
2. Read 讀取目標 `spec.md` 的狀態列；檔案不存在時，規格狀態為空。
3. Read [回覆結束閘門規範](rules/回覆結束閘門規範.md)並取得允許結束條件、禁止收尾條件與未跑完回覆要求。
4. Think 依已載入規範決定本次是否已符合結束條件、是否必須回到 Phase 3，以及若不可結束時的第一個未完成任務 ID。
5. Think 若仍有未完成任務且未命中硬阻擋，決定回到 Phase 3 繼續，並停止本 Phase 之後的步驟。
6. Think 若任務已全數完成，決定進入 Phase 13。
7. Think 若命中硬阻擋或環境上限，決定進入 Phase 13 並保留 **implement 未跑完** 所需資訊與第一個未完成任務 ID。

## Phase 13: 回報並結束本次執行

1. Read 讀取 `tasks.md` 並取得已完成任務、未完成任務與文件順序上的第一個未完成任務 ID。
2. Read 讀取目標 `spec.md` 的狀態列；檔案不存在時，規格狀態為空。
3. Think 決定完成的任務、驗證結果、規格狀態、未完成任務、第一個未完成任務 ID、憲法停止寫入的拒絕原因、是否為 SOP 定義的正常結束，以及回覆內容。
4. Write 將完成的任務 ID、修改摘要、驗證結果、是否已打勾、規格狀態與未完成任務寫入回覆，並結束本次執行。全部任務全勾時回報完成。仍有 `[ ]` 時僅在硬阻擋或無法再執行工具時才可結束回覆，且必須標明 **implement 未跑完**、硬阻擋原因與第一個未完成任務 ID。
