# 前端句型

## 參數約定

句中的字串參數用雙引號。句中的整數參數不加引號。Data Table 儲存格不加引號。

- **{會員}**：字串。會員名稱。示範用會員A。
- **{商品編號}**：字串。可以含前導零，例如 SKU-0042。不是整數。
- **{優惠代碼}**：字串。SAVE80、SAVE10。
- **{配送地區}**：字串。台北市、高雄市。
- **{付款方式}**：字串。信用卡。
- **{訂單階段}**：字串。待付款、已付款。待付款對後端 `pending_payment`。已付款對 `paid`。
- **{數量}**、**{折抵}**、**{應付金額}**、**{金額}**：整數。

目錄、優惠與運費跟後端 `dsl.md` 的參數約定相同。SKU-1001 單價 500、庫存 10。SKU-0042 單價 120、庫存 8。SAVE80 滿 1000 折 80。SAVE10 滿 100 折 10。台北市運費 80。高雄市運費 150。兩件 SKU-1001 的商品金額是 1000。未折抵時台北市應付 1080、高雄市應付 1150。套用 SAVE80 後台北市應付 1000。

## 頁面約定

playwright-bdd 的 When 使用 fixture `page`、`會員視角`，以及 Playwright 的 `baseURL`。

`會員視角(會員)` 回傳該會員的 `{ page, sku, screen, lastError }`。沒有視角時開新的 `browser.newContext()` 和 `newPage()`，`sessionStorage` 保持空白。這一步的 `page` 就是該視角的 `page`。

錯誤訊息沒有 test id，定位固定是 `page.locator("p.error")`。前端 step 不直接開 sqlite。When 不建立 session，也不斷言金額公式。

畫面 test id：

| test id | 用途 |
| --- | --- |
| screen-catalog | 商品頁 |
| screen-cart | 購物車頁 |
| screen-order | 訂單頁 |
| member-name | 會員名稱輸入 |
| login-submit | 登入 |
| sku-input | 商品編號 |
| qty-input | 加入時的數量 |
| add-to-cart | 加入購物車 |
| cart-line | 一列購物車商品，`data-sku` 是商品編號 |
| cart-qty | 該列的數量輸入 |
| update-qty | 該列的更新數量 |
| coupon-input | 優惠代碼 |
| coupon-submit | 套用優惠 |
| discount-amount | 折抵金額 |
| go-checkout | 前往結帳 |
| region-select | 配送地區 |
| checkout-submit | 結帳 |
| order-phase | 訂單階段文字 |
| payable-amount | 應付金額 |
| pay-method | 付款方式 |
| pay-amount | 付款金額 |
| pay-submit | 付款 |

`sessionStorage` 的 token 鍵是 `shop_token`，購物車鍵是 `shop_cart`，訂單鍵是 `shop_order`。

## 通道

前後端共用這五個名稱。一句的測試撰寫語意只寫與這句有關的通道。

- **呈現結果**：畫面上使用者看得到的結果。
- **權威狀態**：讀該會員 page 的 `sessionStorage`。用 `page.request` 對 Playwright baseURL 發 GET，Header 是 `Authorization: Bearer ${shop_token}`。購物車是 `GET /v1/cart`。有 `shop_order` 時訂單是 `GET /v1/orders/{shop_order}`。結果放在 `serverView`。
- **再讀確認**：`page.reload()` 之後，同一個畫面事實還在。
- **跨視角**：不適用。這個示範每個場景只有會員A。
- **不該發生**：不該停在錯的畫面，不該在拒絕後仍顯示成功金額或已付款。

When 只負責畫面操作與回寫，不斷言，也不填這五個通道。

## When 句型

| When 句型 | Gherkin 參數 | Data Table 參數 | 預設參數 | 測試撰寫語意 |
| --- | --- | --- | --- | --- |
| "{會員}" 把商品 "{商品編號}" 以數量 {數量} 加入購物車 | • 會員：字串<br>• 商品編號：字串<br>• 數量：整數 | 不支援。 | 無 | • 使用 fixture：page、會員視角<br>• Arrange 來源：該會員的 page 已在 `screen-catalog`<br>• 畫面操作：`getByTestId("sku-input").fill(商品編號)`；`getByTestId("qty-input").fill(String(數量))`；`getByTestId("add-to-cart").click()`<br>• 等待條件：`getByTestId("screen-cart")` 或 `locator("p.error")` 其一可見<br>• 回寫資料：`sku`＝商品編號。看得到 `screen-cart` 時 `screen`＝`screen-cart`，否則維持 `screen-catalog`。`lastError`＝`p.error` 的文字，沒有就是空字串 |
| "{會員}" 在畫面上把商品 "{商品編號}" 的數量改成 {數量} | • 會員：字串<br>• 商品編號：字串<br>• 數量：整數 | 不支援。 | 無 | • 使用 fixture：page、會員視角<br>• Arrange 來源：該會員的 page 已在 `screen-cart`，而且有 `cart-line[data-sku="{商品編號}"]`。沒有就失敗，不輸入<br>• 畫面操作：該列的 `getByTestId("cart-qty").fill(String(數量))`；該列的 `getByTestId("update-qty").click()`<br>• 等待條件：該列數量文字變成句子裡的數量，或 `locator("p.error")` 可見<br>• 回寫資料：`screen`＝`screen-cart`。`lastError`＝`p.error` 的文字，沒有就是空字串 |
| "{會員}" 在畫面上套用優惠代碼 "{優惠代碼}" | • 會員：字串<br>• 優惠代碼：字串 | 不支援。 | 無 | • 使用 fixture：page、會員視角<br>• Arrange 來源：該會員的 page 已在 `screen-cart`<br>• 畫面操作：`getByTestId("coupon-input").fill(優惠代碼)`；`getByTestId("coupon-submit").click()`<br>• 等待條件：`getByTestId("discount-amount")` 的文字改變，或 `locator("p.error")` 可見<br>• 回寫資料：`screen`＝`screen-cart`。`lastError`＝`p.error` 的文字，沒有就是空字串 |
| "{會員}" 在畫面上以配送地區 "{配送地區}" 結帳 | • 會員：字串<br>• 配送地區：字串 | 不支援。 | 無 | • 使用 fixture：page、會員視角<br>• Arrange 來源：該會員的 page 已在 `screen-catalog` 或 `screen-cart`<br>• 畫面操作：`getByTestId("go-checkout").click()`；`getByTestId("region-select").selectOption(配送地區)`；`getByTestId("checkout-submit").click()`<br>• 等待條件：`getByTestId("screen-order")` 或 `locator("p.error")` 其一可見<br>• 回寫資料：看得到 `screen-order` 時 `screen`＝`screen-order`，否則維持原畫面。`lastError`＝`p.error` 的文字，沒有就是空字串 |
| "{會員}" 在畫面上以 "{付款方式}" 支付 {金額} 元 | • 會員：字串<br>• 付款方式：字串<br>• 金額：整數 | 不支援。 | 無 | • 使用 fixture：page、會員視角<br>• Arrange 來源：該會員的 page 已在 `screen-order`<br>• 畫面操作：`getByTestId("pay-method").selectOption(付款方式)`；`getByTestId("pay-amount").fill(String(金額))`；`getByTestId("pay-submit").click()`<br>• 等待條件：`getByTestId("order-phase")` 的文字改變，或 `locator("p.error")` 可見<br>• 回寫資料：`screen`＝`screen-order`。`lastError`＝`p.error` 的文字，沒有就是空字串 |

與 When 文字相同的假設，沿用上面的 When 句型，不另建一列。

## Given 句型

| Given 句型 | Gherkin 參數 | Data Table 參數 | 預設參數 | 測試撰寫語意 |
| --- | --- | --- | --- | --- |
| 商店沒有進行中的購物車與訂單 | 無 | 不支援。 | 無 | • 權威狀態：Playwright 啟動的後端在這次測試開始時是參數約定的目錄，購物車與訂單都是空的。這一步不發清理請求，目前沒有這個端點 |
| "{會員}" 的畫面停在商品頁 | • 會員：字串 | 不支援。 | 無 | • 呈現結果：`會員視角(會員)` 沒有視角時開新的，`sessionStorage` 空白。`page.goto("/")` 後 `getByTestId("member-name").fill(會員)`，`getByTestId("login-submit").click()`，然後 `getByTestId("screen-catalog")` 可見<br>• 權威狀態：`sessionStorage` 的 `shop_token` 是非空字串<br>• 不該發生：`screen-cart` 與 `screen-order` 不可見<br>• 回寫：`screen`＝`screen-catalog` |
| "{會員}" 的畫面購物車已有定價商品 | • 會員：字串 | 不支援。 | • 商品編號＝SKU-1001<br>• 數量＝2 | • 依序沿用："{會員}" 把商品 "{商品編號}" 以數量 {數量} 加入購物車<br>• 不重新建立瀏覽器。page 不存在就失敗<br>• 呈現結果：做完後 `screen-cart` 可見，該商品的 `cart-line` 數量文字是預設數量<br>• 權威狀態：`serverView` 的該商品 quantity 等於 2，goodsAmount 等於 1000<br>• 不該發生：`screen-order` 不可見。加入沒有 `p.error` |
| "{會員}" 的畫面已有待付款訂單，配送地區 "{配送地區}" | • 會員：字串<br>• 配送地區：字串 | 不支援。 | • 商品編號＝SKU-1001<br>• 數量＝2 | • 依序沿用：「{會員} 的畫面購物車已有定價商品」；「{會員} 在畫面上以配送地區 {配送地區} 結帳」<br>• 不重新建立瀏覽器<br>• 呈現結果：做完後 `screen-order` 可見，`order-phase` 的文字是「待付款」<br>• 權威狀態：`serverView.orderPhase` 是 `pending_payment`。配送地區是台北市時 payableAmount 是 1080。是高雄市時 payableAmount 是 1150<br>• 不該發生：`order-phase` 不是「已付款」。結帳沒有 `p.error`<br>• 回寫：`screen`＝`screen-order` |

## Then 句型

| Then 句型 | Gherkin 參數 | Data Table 參數 | 預設參數 | 測試撰寫語意 |
| --- | --- | --- | --- | --- |
| "{會員}" 應該在購物車看見商品 "{商品編號}" 數量 {數量} | • 會員：字串<br>• 商品編號：字串<br>• 數量：整數 | 不支援。 | 無 | • 呈現結果：`getByTestId("screen-cart")` 可見。`cart-line[data-sku="{商品編號}"]` 的數量文字等於數量<br>• 權威狀態：`serverView.items` 裡該商品的 quantity 等於數量，`shop_cart` 是非空字串<br>• 再讀確認：重新載入後仍停在 `screen-cart`，該列數量仍等於數量<br>• 跨視角：不適用，場景只有這位會員<br>• 不該發生：`screen-catalog` 不可見。`p.error` 不可見 |
| "{會員}" 應該看見折抵 {折抵} 元 | • 會員：字串<br>• 折抵：整數 | 不支援。 | 無 | • 呈現結果：`getByTestId("discount-amount")` 的文字等於折抵<br>• 權威狀態：`serverView.discount` 等於折抵<br>• 再讀確認：重新載入後 `discount-amount` 仍等於折抵<br>• 跨視角：不適用，場景只有這位會員<br>• 不該發生：`p.error` 不可見 |
| "{會員}" 應該看見錯誤訊息 | • 會員：字串 | 不支援。 | 無 | • 呈現結果：`locator("p.error")` 可見，文字是非空字串。不斷言全文<br>• 權威狀態：不適用，錯誤文案不一定有對應的資料庫欄位<br>• 再讀確認：不適用，重新載入後這次操作的錯誤不一定還在<br>• 跨視角：不適用，場景只有這位會員<br>• 不該發生：不因為這次拒絕而出現 `screen-order` 的「已付款」 |
| "{會員}" 應該停在商品頁 | • 會員：字串 | 不支援。 | 無 | • 呈現結果：`getByTestId("screen-catalog")` 可見<br>• 權威狀態：`GET /v1/cart` 的 totalQuantity 是 0<br>• 再讀確認：重新載入後仍是 `screen-catalog`<br>• 跨視角：不適用，場景只有這位會員<br>• 不該發生：`screen-order` 不可見 |
| "{會員}" 應該看見訂單階段 "{訂單階段}" | • 會員：字串<br>• 訂單階段：字串 | 不支援。 | 無 | • 呈現結果：`getByTestId("screen-order")` 可見，`getByTestId("order-phase")` 的文字等於訂單階段<br>• 權威狀態：`serverView.orderPhase` 對到參數約定的階段，`shop_order` 是非空字串<br>• 再讀確認：重新載入後 `order-phase` 仍等於訂單階段<br>• 跨視角：不適用，場景只有這位會員<br>• 不該發生：待付款時文字不是「已付款」。已付款時文字不是「待付款」 |
| "{會員}" 應該看見應付金額 {應付金額} 元 | • 會員：字串<br>• 應付金額：整數 | 不支援。 | 無 | • 呈現結果：`getByTestId("payable-amount")` 的文字等於應付金額<br>• 權威狀態：`serverView.payableAmount` 等於應付金額<br>• 再讀確認：重新載入後 `payable-amount` 仍等於應付金額<br>• 跨視角：不適用，場景只有這位會員<br>• 不該發生：金額文字不是空字串 |
