# Rule 1 - 有 TDD 步驟的任務必須交給 tdd

- 任務標有 **TDD 步驟** 且值為 `紅燈`、`綠燈` 或 `重構` 時，該任務必須交給 `tdd` 執行。
- 委派時必須告知這一個步驟名稱、該任務 `References` 中的 `testplan.md` 案例位址，以及任務描述中的目標檔。
- `implement` 不得在同一步驟自行撰寫該任務的測試、最小實作或重構。
- 沒有 **TDD 步驟** 的任務必須仍由 `implement` 依任務執行規範完成。
- 總驗收任務沒有 **TDD 步驟**，不得交給 `tdd`。

## Good Example

- 紅燈任務把案例與目標測試檔交給 `tdd`，`implement` 不自己寫測試。

```text
任務：T006 紅燈，寫入 BE-1.1
TDD 步驟：紅燈
案例：testplan.md#BE-1.1
目標檔：backend/tests/integration/enter-room.test.ts
交給：tdd
```

## Bad Example

- 同一紅燈任務已標明步驟，`implement` 仍自己把斷言寫進測試檔。

```text
任務：T006 紅燈，寫入 BE-1.1
TDD 步驟：紅燈
本次變更：implement 直接寫入 enter-room.test.ts
```

# Rule 2 - 委派只覆蓋該步驟

- `紅燈` 必須告知 `tdd`：測試計劃案例是已確認接縫，本輪只撰寫並確認這一條失敗測試。
- `綠燈` 必須告知 `tdd`：本輪只做該案例通過所需的最小實作，不重構。
- `重構` 必須告知 `tdd`：本輪只整理該案例綠燈觸及的實作；沒有可做的結構調整時保持行為不變，並確認測試仍通過。
- 同一次委派不得同時要求紅燈、綠燈與重構。

## Good Example

- 綠燈委派只要求 BE-1.1 通過，不包含下一個案例，也不包含重構。

```text
TDD 步驟：綠燈
案例：testplan.md#BE-1.1
要求：最小實作使 BE-1.1 通過
不做：BE-3.1、重構
```

## Bad Example

- 一次委派把同一案例的紅燈、綠燈與重構一起交給 `tdd`。

```text
TDD 步驟：紅燈、綠燈、重構
案例：testplan.md#BE-1.1
```
