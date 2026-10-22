# 測試計劃 ( Test Plan )：線上 PVP 1A2B 猜數字

**輸入 ( Input )**：`specs/001-online-pvp-1a2b/spec.md`、`specs/001-online-pvp-1a2b/plan.md`、`specs/001-online-pvp-1a2b/contracts/openapi.yaml`、`specs/001-online-pvp-1a2b/contracts/interface.pen`

案例的受測操作只使用契約檔已有的操作。故事歸屬、全域 NFR 歸屬、FR/NFR 索引與斷言字面值來自 `spec.md`。這份計劃不重寫呼叫契約。

## 上游介面索引 ( Upstream Interfaces )

| 介面 | plan.md 盤點 | 契約 |
| --- | --- | --- |
| 後端房間 API | 系統介面盤點的後端端點「後端房間 API」 | `contracts/openapi.yaml` |
| 前端對局畫面 | 系統介面盤點的前端端點「前端對局畫面」 | `contracts/interface.pen` |

## 共用 Arrange Fixtures

兩個以上案例共用的前置狀態寫在這裡。只被一個案例使用的前置寫在該案例內。

1. **Fixture 空資料庫**：啟動接到空資料庫的後端。沒有進行中的房間。

## 使用者故事 1 - 以暱稱與房號進入房間（Priority: P1）

玩家用暱稱與房號進入。房號尚不存在時，進入者成為房主，房間等待對手。兩次同時進入同一個不存在的房號只產生一個房間。進房後，畫面上看得到等待對手。

### TDD 順序 ( Atomic Order )

#### 單元與服務測試

1. BE-1.1
2. BE-3.1

#### 瀏覽器端到端測試

1. FE-1.1

### BE-1.1 玩家以暱稱與不存在的房號進入房間後成為房主並等待對手

- **對應需求 ( Traces )** FR-US1-001
- **契約位址 ( Contract )** `contracts/openapi.yaml#/paths/~1api~1rooms~1enter/post`
- **唯一測試意圖 ( Intent )** 不存在的房號會開出等待對手的房間，進入者是房主。
- **受測部位 ( Subject )** 後端房間 API
- **受測操作 ( Operation )** `POST /api/rooms/enter`
- **前置條件 ( Arrange )** Fixture 空資料庫。
- **操作 ( Act )** `nickname` 為「玩家A」，`roomCode` 為「1234」。
- **觀測通道 ( Observation Channel )** 這次進入的回應。
- **預期輸出 ( Expected Output )** HTTP 201。`role` 為房主。`room.roomCode` 為 1234，`room.status` 為等待對手。`room.players` 只有一位：房主、暱稱玩家A、`ready` 為 false。
- **必須維持不變 ( Must Stay )** 無。
- **本案例不驗證 ( Not Verified )** 祕密答案、猜測紀錄、離開、第二位玩家。
- **預期 RED 原因 ( Expected Red )** 尚不能以暱稱與房號建立房間，進入回應不是 HTTP 201 的房主、等待對手。

### BE-3.1 兩位玩家同時進入同一個不存在的房號時只建立一個房間

- **對應需求 ( Traces )** NFR-US1-001
- **契約位址 ( Contract )** `contracts/openapi.yaml#/paths/~1api~1rooms~1enter/post`
- **唯一測試意圖 ( Intent )** 兩次同時進入只產生一個房間，一人是房主、一人是加入者。
- **受測部位 ( Subject )** 後端房間 API
- **受測操作 ( Operation )** 同時兩次 `POST /api/rooms/enter`
- **前置條件 ( Arrange )** Fixture 空資料庫。
- **操作 ( Act )** 玩家A 與玩家B 的兩次進入都送出之後，才讀取兩次回應。`roomCode` 都是「1234」。
- **觀測通道 ( Observation Channel )** 兩次進入的回應。
- **預期輸出 ( Expected Output )** 一次 HTTP 201 且 `role` 為房主，另一次 HTTP 200 且 `role` 為加入者。兩個 `room.roomId` 相同。房主人數為 1，加入者人數為 1。
- **必須維持不變 ( Must Stay )** 無。
- **本案例不驗證 ( Not Verified )** 祕密答案、猜測、離開。
- **預期 RED 原因 ( Expected Red )** 兩次進入得到兩個 `roomId`，或兩個角色都是房主。

### FE-1.1 玩家進入不存在的房號後畫面顯示等待對手

- **對應需求 ( Traces )** FR-US1-001
- **契約位址 ( Contract )** `contracts/interface.pen#waiting-room`
- **唯一測試意圖 ( Intent )** 玩家在畫面上進入不存在的房號後，看得到自己是房主且房間在等待對手。
- **受測部位 ( Subject )** 瀏覽器對局畫面
- **受測操作 ( Operation )** 按「進入房間」
- **前置條件 ( Arrange )** 開一個瀏覽器進入對局頁，接到空資料庫的後端。尚未按「進入房間」。
- **操作 ( Act )** 在「暱稱」填玩家A、在「房號」填 1234，按「進入房間」。
- **觀測通道 ( Observation Channel )** 畫面上的「房間狀態」與「玩家」。兩個區塊去掉首尾空白後比對。
- **預期輸出 ( Expected Output )** 房間狀態為「等待對手」。玩家為「房主 玩家A」。
- **必須維持不變 ( Must Stay )** 無。
- **本案例不驗證 ( Not Verified )** 第二位玩家、祕密答案、開始對局、猜測、同時進入。
- **預期 RED 原因 ( Expected Red )** 按下「進入房間」後，畫面還沒有「等待對手」與「房主 玩家A」。

## 使用者故事 2 - 房主開始對局（Priority: P2）

雙方都已準備時，房主開始對局，雙方都看到輪到房主。

### TDD 順序 ( Atomic Order )

#### 單元與服務測試

1. BE-6.3

#### 瀏覽器端到端測試

1. FE-2.1
2. NFR-US2-001

### BE-6.3 雙方都準備好後房主開始對局且輪到房主

- **對應需求 ( Traces )** FR-US2-004
- **契約位址 ( Contract )** `contracts/openapi.yaml#/paths/~1api~1rooms~1{roomId}~1start/post`
- **唯一測試意圖 ( Intent )** 雙方都已準備後，房主開始，雙方都看到輪到房主。
- **受測部位 ( Subject )** 後端房間 API
- **受測操作 ( Operation )** `POST /api/rooms/:roomId/start`
- **前置條件 ( Arrange )** 玩家A 呼叫 `POST /api/rooms/enter`，`nickname` 為「玩家A」，`roomCode` 為「1234」，成為房主。玩家B 再呼叫 `POST /api/rooms/enter`，`nickname` 為「玩家B」，`roomCode` 為「1234」。房主 `secret` 為「5678」，加入者 `secret` 為「1234」，雙方 `ready` 為 true。尚未呼叫 `POST /api/rooms/:roomId/start`。保留 `roomId` 與雙方 `playerId`。
- **操作 ( Act )** 房主以自己的 `playerId` 開始對局。
- **觀測通道 ( Observation Channel )** 這次開始的回應，以及房主與加入者各自的 `GET /api/rooms/:roomId`。
- **預期輸出 ( Expected Output )** 開始 HTTP 200。雙方讀到的 `status` 都是對局中，`turn` 都是房主。
- **必須維持不變 ( Must Stay )** 房主的 `ownSecret` 仍是 5678。加入者的回應仍沒有 `ownSecret`，也沒有 `opponentSecret`。
- **本案例不驗證 ( Not Verified )** 猜測內容、勝負。
- **預期 RED 原因 ( Expected Red )** 開始後 `status` 不是對局中，或 `turn` 不是房主。

### FE-2.1 房主開始對局後雙方畫面都顯示輪到房主

- **對應需求 ( Traces )** FR-US2-004
- **契約位址 ( Contract )** `contracts/interface.pen#in-match`
- **唯一測試意圖 ( Intent )** 雙方都已準備後，房主在畫面上開始，雙方都看到輪到房主。
- **受測部位 ( Subject )** 瀏覽器對局畫面
- **受測操作 ( Operation )** 房主按「開始對局」
- **前置條件 ( Arrange )** 開兩個瀏覽器進入對局頁，接到同一個後端。玩家A 在「暱稱」填玩家A、在「房號」填 1234 並按「進入房間」。玩家B 在「暱稱」填玩家B、在「房號」填 1234 並按「進入房間」。房主在「祕密答案」填 5678 並按「設定祕密答案」。加入者在「祕密答案」填 1234 並按「設定祕密答案」。尚未按「開始對局」。
- **操作 ( Act )** 房主按「開始對局」。
- **觀測通道 ( Observation Channel )** 雙方畫面上的「房間狀態」與「輪到」。兩個區塊去掉首尾空白後比對。
- **預期輸出 ( Expected Output )** 雙方的房間狀態都是「對局中」。雙方的輪到都是「房主」。
- **必須維持不變 ( Must Stay )** 無。
- **本案例不驗證 ( Not Verified )** 猜測內容、勝負、祕密答案是否出現在畫面上。
- **預期 RED 原因 ( Expected Red )** 房主按下「開始對局」後，任一方畫面還沒有「對局中」與輪到「房主」。

### NFR-US2-001 房主開始後 1 秒內雙方畫面都顯示對局中

- **對應需求 ( Traces )** NFR-US2-001
- **契約位址 ( Contract )** `contracts/interface.pen#in-match`
- **唯一測試意圖 ( Intent )** 規格要求開始後 1 秒內可見；房主按下開始後，雙方在 1 秒內都看到對局中。
- **受測部位 ( Subject )** 瀏覽器對局畫面
- **受測操作 ( Operation )** 房主按「開始對局」
- **前置條件 ( Arrange )** 開兩個瀏覽器進入對局頁，接到同一個後端。玩家A 在「暱稱」填玩家A、在「房號」填 1234 並按「進入房間」。玩家B 在「暱稱」填玩家B、在「房號」填 1234 並按「進入房間」。房主在「祕密答案」填 5678 並按「設定祕密答案」。加入者在「祕密答案」填 1234 並按「設定祕密答案」。尚未按「開始對局」。
- **操作 ( Act )** 房主按「開始對局」，並在按下後 1 秒讀取雙方畫面。
- **觀測通道 ( Observation Channel )** 按下後 1 秒時，雙方畫面上的「房間狀態」。
- **預期輸出 ( Expected Output )** 1 秒內雙方的房間狀態都是「對局中」。
- **必須維持不變 ( Must Stay )** 無。
- **本案例不驗證 ( Not Verified )** 輪到誰、猜測內容、勝負。
- **預期 RED 原因 ( Expected Red )** 按下開始後超過 1 秒，任一方畫面仍沒有「對局中」。

## 全域 NFR - NFR-G-001 失敗後已進入的房間仍保留

玩家已進入房間後，若下一次請求失敗，該房間仍可被讀回。

### TDD 順序 ( Atomic Order )

#### 單元與服務測試

1. NFR-G-001

### NFR-G-001 進入房間成功後請求失敗，房間仍可被讀回

- **對應需求 ( Traces )** NFR-G-001
- **契約位址 ( Contract )** `contracts/openapi.yaml#/paths/~1api~1rooms~1{roomId}/get`
- **唯一測試意圖 ( Intent )** 玩家已進入房間後，下一次請求失敗，該房間仍可被讀回。
- **受測部位 ( Subject )** 後端房間 API
- **受測操作 ( Operation )** `GET /api/rooms/:roomId`
- **前置條件 ( Arrange )** 玩家A 呼叫 `POST /api/rooms/enter`，`nickname` 為「玩家A」，`roomCode` 為「1234」，成為房主。保留 `playerId` 與 `roomId`。房間 `status` 為等待對手，`players` 只有房主玩家A、`ready` 為 false。接著呼叫 `POST /api/rooms/:roomId/start`，`playerId` 為「沒有這位玩家」，這次開始失敗。
- **操作 ( Act )** 以玩家A 的 `playerId` 讀取同一個 `roomId`。
- **觀測通道 ( Observation Channel )** 這次 `GET` 的回應。
- **預期輸出 ( Expected Output )** HTTP 200。`roomCode` 為 1234，`status` 為等待對手。`players` 只有房主玩家A、`ready` 為 false。
- **必須維持不變 ( Must Stay )** 無。
- **本案例不驗證 ( Not Verified )** 開始請求的錯誤內容、第二位玩家、祕密答案、1 秒內回傳。
- **預期 RED 原因 ( Expected Red )** 開始請求失敗後，GET 讀不到這個 `roomId`，或讀到的不是等待對手的房主玩家A。

## 全域 NFR - NFR-G-003 房間讀取在 1 秒內回傳

已存在的房間被讀取時，1 秒內回傳。

### TDD 順序 ( Atomic Order )

#### 單元與服務測試

1. NFR-G-003

### NFR-G-003 已存在的房間在 1 秒內回傳

- **對應需求 ( Traces )** NFR-G-003
- **契約位址 ( Contract )** `contracts/openapi.yaml#/paths/~1api~1rooms~1{roomId}/get`
- **唯一測試意圖 ( Intent )** 已存在的房間被讀取時，1 秒內回傳。
- **受測部位 ( Subject )** 後端房間 API
- **受測操作 ( Operation )** `GET /api/rooms/:roomId`
- **前置條件 ( Arrange )** 玩家A 呼叫 `POST /api/rooms/enter`，`nickname` 為「玩家A」，`roomCode` 為「1234」，成為房主。保留 `playerId` 與 `roomId`。房間 `status` 為等待對手，`players` 只有房主玩家A、`ready` 為 false。尚未讀取這個房間。
- **操作 ( Act )** 以玩家A 的 `playerId` 讀取同一個 `roomId`，並在送出後 1 秒內讀取回應。
- **觀測通道 ( Observation Channel )** 送出後 1 秒內的這次 `GET` 回應。
- **預期輸出 ( Expected Output )** 1 秒內 HTTP 200。`roomCode` 為 1234，`status` 為等待對手。`players` 只有房主玩家A、`ready` 為 false。
- **必須維持不變 ( Must Stay )** 無。
- **本案例不驗證 ( Not Verified )** 請求失敗後是否仍保留房間、第二位玩家、祕密答案。
- **預期 RED 原因 ( Expected Red )** 超過 1 秒才回傳，或回應不是等待對手的房主玩家A。

## 總驗收

全部使用者故事與全域 NFR 完成後，兩位玩家仍能從進房走到開始對局，雙方看到輪到房主。

### TDD 順序 ( Atomic Order )

#### 瀏覽器端到端測試

1. ACC-1

### ACC-1 兩位玩家從進房到開始對局後雙方仍看到輪到房主

- **對應需求 ( Traces )** FR-US1-001、FR-US2-004
- **契約位址 ( Contract )** `contracts/interface.pen#in-match`
- **唯一測試意圖 ( Intent )** 兩位玩家沿畫面完成進房與準備後，房主開始對局，雙方仍看到輪到房主。
- **受測部位 ( Subject )** 瀏覽器對局畫面
- **受測操作 ( Operation )** 房主按「開始對局」
- **前置條件 ( Arrange )** 開兩個瀏覽器進入對局頁，接到同一個後端。玩家A 在「暱稱」填玩家A、在「房號」填 1234 並按「進入房間」。玩家B 在「暱稱」填玩家B、在「房號」填 1234 並按「進入房間」。房主在「祕密答案」填 5678 並按「設定祕密答案」。加入者在「祕密答案」填 1234 並按「設定祕密答案」。尚未按「開始對局」。
- **操作 ( Act )** 房主按「開始對局」。
- **觀測通道 ( Observation Channel )** 雙方畫面上的「房間狀態」與「輪到」。兩個區塊去掉首尾空白後比對。
- **預期輸出 ( Expected Output )** 雙方的房間狀態都是「對局中」。雙方的輪到都是「房主」。
- **必須維持不變 ( Must Stay )** 無。
- **本案例不驗證 ( Not Verified )** 同時進入、開始後 1 秒、失敗後保留房間、猜測內容、勝負、祕密答案是否出現在畫面上。
- **預期 RED 原因 ( Expected Red )** 房主按下「開始對局」後，任一方畫面沒有「對局中」，或輪到不是「房主」。

## 不列為案例

- **NFR-G-002**：玩家應感受到即時回饋。原因：規格原文只有感受描述，沒有時間、數量、可見狀態或失敗後仍須保留的資料。
- **FR-G-004**：已寫入的房間必須能由另一條連到同一資料庫的連線讀回。原因：全域功能需求不進入任務清單。
