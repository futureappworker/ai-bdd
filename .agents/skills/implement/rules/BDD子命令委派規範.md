# Rule 1 - 有 BDD 子命令的任務必須走 BDD 流程

- 任務標有 **BDD 子命令** 且值為 `red`、`green` 或 `refactor` 時，`implement` 必須以 BDD 流程執行該任務。
- BDD 流程必須使用獨立 `/bdd` 委派模式，或 Rule 3 定義的等價子命令模式。
- 採獨立 `/bdd` 委派模式時，必須帶上這一個子命令、該任務 `References` 中的 `.feature` 場景位址、若存在則帶上的 `dsl.md` 句型位址，以及任務描述中的目標檔。
- 採等價子命令模式時，必須沿用相同的子命令、場景位址、句型位址與目標檔。
- BDD 流程完成證據到位後，`implement` 必須把該任務視為可進入打勾判定。
- BDD 流程回覆阻擋或未完成時，`implement` 必須保留該任務為未勾選，並停止本次流程。
- 沒有 **BDD 子命令** 的任務必須仍由 `implement` 依任務執行規範完成。
- acceptance `.feature` 任務若標有 **BDD 子命令**，也必須依本規範走 BDD 流程。

## Good Example

- `implement` 遇到 `BDD 子命令: red` 時，先進入 BDD 流程，拿到有效失敗證據後再回來決定可打勾。

```text
任務：T006 [US1] 委派 /bdd red
BDD 子命令：red
場景：features/backend/加入房間.feature#場景:BE-1.1 玩家A、房間 2468、進入成功
DSL：features/backend/dsl.md#When:"{玩家}" 以房間代碼 "{房間代碼}" 進入房間
目標檔：backend/features/steps/房間/開房與加入.ts
處置：交給 BDD 流程，等待完成證據
```

## Bad Example

- 任務已標 `BDD 子命令`，卻沒有依 BDD 流程鎖定子命令與場景邊界。

```text
任務：T006 [US1] 委派 /bdd red
BDD 子命令：red
本次變更：implement 直接寫入 backend/features/steps/房間/開房與加入.ts，且未說明 BDD 流程模式
```

# Rule 2 - 委派只覆蓋該子命令

- `red` 必須告知 `/bdd`：本輪只撰寫並確認這一條介面情境的有效紅燈。
- `green` 必須告知 `/bdd`：本輪只做該情境通過所需的最小實作，不進入 `refactor`。
- `refactor` 必須告知 `/bdd`：本輪只整理該情境綠燈觸及的測試程式；沒有可做的結構調整時保持行為不變，並確認情境仍通過。
- 同一次委派不得同時要求 `red`、`green` 與 `refactor`。

## Good Example

- `green` 委派只要求同一情境通過，不包含下一個情境，也不包含重構。

```text
BDD 子命令：green
場景：features/backend/加入房間.feature#場景:BE-1.1 玩家A、房間 2468、進入成功
要求：最小實作使該場景通過
不做：BE-3.1、refactor
```

## Bad Example

- 一次委派把同一情境的三個子命令一起交給 `/bdd`。

```text
BDD 子命令：red、green、refactor
場景：features/backend/加入房間.feature#場景:BE-1.1 玩家A、房間 2468、進入成功
```

# Rule 3 - 無法獨立委派時必須執行等價子命令

- 當目前環境無法把 `/bdd` 當成獨立 Skill 或工具呼叫時，`implement` 必須在同一個目標任務內執行 **等價的單一 BDD 子命令**。
- 等價子命令必須沿用 `/bdd` 的同一個子命令責任、同一條 `.feature` 場景位址、同一條 `dsl.md` 句型位址與同一組目標檔。
- 採等價子命令模式時，`implement` 不得跨到下一個子命令，也不得跳出當前任務邊界。
- 採等價子命令模式時，完成證據與阻擋原因必須與獨立 `/bdd` 回覆同樣可用於打勾或停止判定。

## Good Example

- 無法獨立呼叫 `/bdd` 時，只在同一任務內完成等價的 `green` 子命令。

```text
任務：T082 [US2] 委派 /bdd green
執行模式：等價子命令
子命令：green
場景：features/frontend/送出聊天訊息.feature#場景:FE-1.4 玩家B、房間 3404、訊息1234
目標檔：frontend/src/views/render.ts、frontend/src/api/client.ts、frontend/src/polling/poller.ts
處置：只做 FE-1.4 通過所需的最小實作
```

## Bad Example

- 說是等價子命令，卻順手做完後續情境或下一個子命令。

```text
任務：T082 [US2] 委派 /bdd green
執行模式：等價子命令
處置：做完 FE-1.4，順便處理 FE-7.1 與 refactor
```

# Rule 4 - BDD 任務未完成時必須留在同一子命令

- BDD 任務若未完成，且在目標檔、相鄰測試檔或 `References` 範圍內仍有下一個具體嘗試，處置必須是留在同一個任務、同一個子命令繼續推進。
- `red` 未取得有效失敗時，必須繼續修正 `red`；`green` 未通過時，必須繼續修正 `green`；`refactor` 未確認通過時，必須繼續修正 `refactor`。
- 不得因為 BDD 任務已試過一次就停止整輪 `/implement`。
- 只有在已無下一個具體嘗試、契約與情境矛盾，或本任務所需工具不可用時，才可把 BDD 任務視為硬阻擋。

## Good Example

- `green` 仍有 task-local 下一步，因此留在同一個 `green` 任務。

```text
任務：T087 [US2] 委派 /bdd green
子命令：green
最新失敗：重連後 chat-messages 未更新
下一個具體嘗試：調整 frontend/src/main.ts 的 refreshChat 時機
處置：繼續 T087 green
```

## Bad Example

- `green` 還有具體修正方向，卻直接停止整輪 `/implement`。

```text
任務：T087 [US2] 委派 /bdd green
子命令：green
最新失敗：重連後 chat-messages 未更新
處置：先結束本輪，下一次再說
```
