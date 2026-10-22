# ai-bdd

下單優惠的結帳試算與 Cucumber 規格。先安裝依賴：

```bash
npm install
```

## `npm run cli`

在終端機裡開啟結帳畫面，即時試算購物車成交金額。必須在真正的終端機執行；管道或非互動環境會直接結束。

```bash
npm run cli
```

畫面分成商品、購物車、結帳條件與已套用優惠。用 Tab 移動焦點。

| 按鍵 | 作用 |
| --- | --- |
| Tab / Shift+Tab | 切換商品、購物車、結帳條件、優惠 |
| ↑ ↓ 或 j k | 移動選取 |
| Enter 或空白鍵 | 加入選到的商品；在結帳條件上則切換下一個值 |
| ← → 或 h l | 調整目前的結帳條件 |
| 1–4 | 直接加入對應商品 |
| x | 移除購物車裡選到的件 |
| C | 清空購物車 |
| [ ] | 點數減 10 / 加 10 |
| { } | 點數減 100 / 加 100 |
| D | 載入下一組範例購物車 |
| q 或 Ctrl+C | 離開 |

## `npm test`

跑 `features/` 裡的 Gherkin 場景。結束代碼是 0 代表全部通過。

```bash
npm test
```

可以只跑一個 feature，或用名稱篩場景。`--` 後面的參數會原樣傳給 Cucumber。

```bash
npm test -- features/下單優惠-驗算成交金額.feature
npm test -- --name "金卡買一件高山烏龍"
```

場景分三份：

- `features/下單優惠-驗算成交金額.feature`：套用優惠後的成交金額
- `features/下單優惠-規則與邊界.feature`：一次只改一個條件的規則與邊界
- `features/下單優惠-部分退貨重算.feature`：已成立訂單的部分退貨重算

## `npm run report`

和 `npm test` 執行同一支 `cucumber-js`。設定在 `cucumber.js`：每次執行都會用 `formatters/html-report.js` 寫出 HTML 報告。

```bash
npm run report
```

報告路徑是 `reports/cucumber-report.html`。在 macOS 可直接打開：

```bash
open reports/cucumber-report.html
```

`npm test` 也會覆寫同一份報告。想只產生某一批場景的報告時，參數寫法與測試相同：

```bash
npm run report -- features/下單優惠-部分退貨重算.feature
```
