# Cucumber：先寫 Gherkin，再翻成測試程式

這份文件只處理一件事：`.feature` 怎麼寫，以及這些句子怎麼對上可執行的 step definition。

程式範例用 [Cucumber.js](https://github.com/cucumber/cucumber-js)（套件 `@cucumber/cucumber`）。Gherkin 語法、匹配規則、Scenario Outline / Data Table / Doc String 的語意，在 Cucumber-JVM、Ruby、Go 是同一套。Java 的狀態寫法見最後一節。

依據：

- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
- [Step definitions](https://cucumber.io/docs/cucumber/step-definitions/)
- [Step organization](https://cucumber.io/docs/gherkin/step-organization/)
- [Writing better Gherkin](https://cucumber.io/docs/bdd/better-gherkin/)
- [Cucumber FAQ](https://cucumber.io/docs/faq/)
- [Cucumber Expressions](https://github.com/cucumber/cucumber-expressions)
- [Cucumber.js step definitions](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/step_definitions.md)、[World](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md)、[Hooks](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md)
- [gherkin-languages.json 的 zh-TW](https://github.com/cucumber/gherkin/blob/main/gherkin-languages.json)

## 1. 實作順序

1. 先寫 `.feature`。句子裡用具體的值（`"A-1"`、`40`、`"餘額不足"`），先不要寫 step definition。
2. 用 dry-run 只做解析與匹配，不真的執行：

   ```bash
   npx cucumber-js --dry-run
   ```

3. 終端機會印出還沒對上的 step，並附上程式片段。把片段貼進 step definition 檔，再填本體。
4. 正式跑：

   ```bash
   npx cucumber-js
   ```

5. 兩個 step 的本體開始重複時，抽出一般函式，從兩邊呼叫。抽的是函式，不是「從某個 step 再呼叫另一句 Gherkin」。

還沒出現在任何場景裡的句子，先不要為它寫 step definition。Cucumber 會把所有已註冊的表達式放進同一個全域池，用不到的表達式之後會跟新句子撞車。

`Feature`、`Scenario`、`Rule` 底下的自由描述**不會被執行**。報告工具可以印出來，runner 不會拿它做斷言。要被檢查的條件，寫成 `假設` / `當` / `那麼`，或寫進 `例子` 表格。

## 2. Feature 檔的格式

一個 `.feature` 只有一個 `功能`。縮排用 2 個空白。註解是整行 `#`，沒有區塊註解。

繁體中文關鍵字要在檔案第一行宣告語言，否則關鍵字是英文：

```gherkin
# language: zh-TW
功能: 從帳戶提款
```

`# language:` 必須是第一行。同一個檔案只用一種語言。

| 用途 | zh-TW 關鍵字 | 後面要有冒號 |
| --- | --- | --- |
| 功能 | `功能` | 要 |
| 業務規則分組 | `Rule`（繁體字庫沒有譯名） | 要 |
| 場景 | `場景` 或 `劇本` | 要 |
| 前置 | `背景` | 要 |
| 參數化場景 | `場景大綱` 或 `劇本大綱` | 要 |
| 大綱的資料 | `例子` | 要 |
| 前置狀態 | `假設`、`假如`、`假定` | 不要 |
| 動作 | `當` | 不要 |
| 結果 | `那麼` | 不要 |
| 延續上一句 | `而且`、`並且`、`同時` | 不要 |
| 反向延續 | `但是` | 不要 |
| 任意步驟 | `*` | 不要 |

步驟關鍵字後面加了冒號，那個步驟會被忽略，場景看起來像通過或像少跑了一步。`功能:`、`場景:`、`背景:`、`場景大綱:`、`例子:` 則必須有冒號。

同一個檔案固定用一組：`假設` / `當` / `那麼` / `而且` / `但是`。關鍵字本身不參與匹配，混用 `假設` 和 `假如` 仍會對到同一個 step definition，但全文搜尋會裂開。

描述區（`功能`、`場景`、`背景`、`場景大綱`、`Rule` 標題下面的自由文字）裡，任何一行都不能以關鍵字開頭，否則那一行會被當成步驟。

## 3. 一個場景怎麼寫

一個場景證明一件行為。標題用一句話講完這次的輸入與結果；標題塞不進一句，就拆成兩個場景。官方建議每個場景 3 到 5 個步驟。

步驟順序：

| 關鍵字 | 寫什麼 | step definition 做什麼 |
| --- | --- | --- |
| `假設` | 動作發生前，系統已經處在的狀態。用過去式的事實，不寫使用者怎麼點 | 直接把系統設成那個狀態：建資料、叫 domain API、種 session |
| `當` | 這次要驗證的那一個動作或事件 | 走這次場景鎖定的那個邊界（HTTP client、browser driver、或 domain service） |
| `那麼` | 看得到的結果 | 讀取那個輸出並斷言。輸出是回應內容、畫面文字、回傳值、訊息 |
| `而且` / `但是` | 同上一種關鍵字的下一句 | 與 `假設` / `當` / `那麼` 相同，關鍵字不進匹配 |

一個場景放一個 `當`。`當` 前面若還有另一個動作，那個動作多半是前置，改寫成 `假設`。

一步只寫一件事。句子中間再出現一個「並且」時，拆成下一個步驟，或收成一個領域動作（見第 4 節）。

`那麼` 要點名斷言對象需要的識別資訊。step definition 不去猜「最後那一筆是哪一個帳戶」。

```gherkin
那麼 帳戶 "A-1" 的最後一筆交易應該是提領 40
```

`那麼` 讀的是這句話點名的輸出。句子沒有提到資料庫，step definition 就不去查資料表。官方對 `Then` 的規定是：斷言系統吐出來的東西（報告、介面、訊息、回傳值）。

每個場景（含 `場景大綱` 的每一列）都要能單獨跑、能平行跑、能任意調換順序。前置寫在這個場景或它的 `背景` 裡。

## 4. 句子與程式的分界

判斷標準：實作一換（URL、欄位名、按鈕文字、CSS、資料表欄位），這句 Gherkin 要不要改？

- 要改：這句寫的是操作路徑。把路徑移進 step definition，Gherkin 改寫成那個路徑完成的行為。
- 這個值本身就是被證明的行為（錯誤的密碼、被拒絕的原因、提領金額）：值留在 Gherkin。

操作路徑寫在 feature 時，登入頁一改，所有場景一起改：

```gherkin
假設 使用者打開 "/login"
當 使用者在欄位 "email" 輸入 "free@example.com"
而且 使用者在欄位 "password" 輸入 "validPassword123"
而且 使用者按下 "送出"
那麼 使用者應該看到 "歡迎"
```

同一件事，行為留在 feature，路徑留在程式：

```gherkin
假設 使用者 "free@example.com" 的方案是 "free"
當 使用者 "free@example.com" 以有效憑證登入
那麼 使用者應該看到方案 "free" 可讀的文章
```

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');

Given('使用者 {string} 的方案是 {string}', function (email, plan) {
  this.users.setPlan(email, plan);
});

When('使用者 {string} 以有效憑證登入', async function (email) {
  await this.sessions.loginWithStoredPassword(email);
});

Then('使用者應該看到方案 {string} 可讀的文章', async function (plan) {
  const titles = await this.catalog.visibleTitles();
  assert.deepEqual(titles, this.catalog.titlesFor(plan));
});
```

密碼、URL、欄位名放在 `loginWithStoredPassword` 裡。場景若就是在證明「這個密碼會被拒絕」，密碼寫回句子，因為它是這次的輸入：

```gherkin
當 使用者 "free@example.com" 以密碼 "wrong" 登入
那麼 登入應該被拒絕，原因是 "憑證無效"
```

兩句話可以共用一個函式，各自註冊自己的表達式：

```javascript
async function login(world, email, password) {
  await world.driver.get('/login');
  await world.driver.findElement({ name: 'email' }).sendKeys(email);
  await world.driver.findElement({ name: 'password' }).sendKeys(password);
  await world.driver.findElement({ css: 'button[type=submit]' }).click();
}

When('使用者 {string} 以有效憑證登入', async function (email) {
  await login(this, email, this.passwords.for(email));
});

When('使用者 {string} 以密碼 {string} 登入', async function (email, password) {
  await login(this, email, password);
});

Given('使用者 {string} 已登入', async function (email) {
  await this.sessions.create(email);
});
```

第三個 `假設` 不經畫面。這個場景要的是「已經登入」這個狀態，登入頁怎麼填不屬於它的斷言。Cucumber 的 `Given` 說明就是：`Given` 把系統設成已知狀態，使用者互動寫在 `When`。

從 step definition 再去呼叫另一句 Gherkin，Cucumber.js 不提供這條路。共用的是上面這種一般函式。（[cucumber-js#1443](https://github.com/cucumber/cucumber-js/issues/1443)，Aslak Hellesøy 的回覆就是抽函式。）

## 5. 匹配規則

Runner 拿掉關鍵字，只用剩下的文字去對表達式。下面兩句是同一句，註冊兩次就是重複定義：

```gherkin
假設 帳戶 "A-1" 的餘額是 430
那麼 帳戶 "A-1" 的餘額是 430
```

結果句改成帶「應該」的說法，表達式就分開了：

```gherkin
假設 帳戶 "A-1" 的餘額是 430
那麼 帳戶 "A-1" 的餘額應該是 430
```

```javascript
Given('帳戶 {string} 的餘額是 {int}', function (id, balance) { /* 設狀態 */ });
Then('帳戶 {string} 的餘額應該是 {int}', function (id, expected) { /* 斷言 */ });
```

`Given` / `When` / `Then` 在 Cucumber.js 裡註冊進同一個池。用 `Given(...)` 註冊的表達式，一樣會對上 `那麼` 開頭的步驟。函式名只影響程式好不好讀，不影響匹配。

同一句業務話，全專案只用一種寫法。Cucumber 沒有「這個 feature 檔專用的 step」。`require` 進來的每個表達式都是全域的。

新步驟用 Cucumber Expression，不用正則。同一個表達式裡不能混用兩種語法。

| 寫法 | 對上的文字 | 傳進函式的值 |
| --- | --- | --- |
| `{int}` | 整數，含負數。正則是 `/-?\d+/` 與 `/\d+/` | number |
| `{float}` | 小數，也含整數與科學記號 | number |
| `{word}` | 不含空白的一段。正則是 `/[^\s]+/` | string，引號也算進去 |
| `{string}` | 必須寫成 `"..."` 或 `'...'` | string，外層引號已去掉 |
| `{}` | `/.*/`，幾乎什麼都吃 | string |

`42.5` 對不上 `{int}`。email、金額這類中間沒空白的 token 可以用 `{word}`，但句子裡要加引號給人讀時，用 `{string}`，Gherkin 就寫 `"a@b.com"`。

`{}` 太寬，容易和別的表達式同時對上，產生 Ambiguous step。參數要有名字、有型別。

可選文字與二選一（Cucumber Expressions 語法）：

```javascript
When('客戶提取 {int} 元', function (amount) {});
// 也可以寫成複數差異：
// Given('I have {int} cucumber(s) in my belly', ...)
// Given('a/an {word} ball', ...)
```

可選片段一多，表達式會變寬，兩個 step 會同時匹配。一個差異就多寫一個有名字的 parameter type，比堆 `(s)` 和 `/` 清楚。

自訂型別在 step definition **被載入之前** 註冊。表達式在註冊當下解析，型別還沒定義會直接失敗。

```javascript
const { defineParameterType } = require('@cucumber/cucumber');

defineParameterType({
  name: 'twd',
  regexp: /\d+ 元/,
  transformer(text) {
    return Number(text.replace(' 元', ''));
  },
  useForSnippets: true,
});
```

```gherkin
當 客戶提取 40 元
```

```javascript
When('客戶提取 {twd}', function (amount) {
  // amount === 40，已經是 number
});
```

`transformer` 若要讀 World（`this`），用一般 `function`，不用箭頭函式。正則若常誤吃別的詞，設 `useForSnippets: false`，避免產生 snippet 時被選走。

正則仍然可用，捕獲群組依序成為參數，預設是字串。只有群組的正則和某個 parameter type 的正則**完全相同**時，才會走那個型別的轉換。新程式用 `{int}` 這種明示寫法。

## 6. 多筆資料怎麼送

三條路，傳進程式的方式不同。

### 同一個行為，每組值各跑一次：場景大綱

步驟文字一樣、結果的形狀一樣，只有值在變，用 `場景大綱`。每一列都是一個完整場景：自己的 World、自己的 `Before`、自己的 `背景`。

`<欄名>` 在匹配 step definition **之前**就換成儲存格文字。表達式寫換完之後的句子，不寫 `<amount>`。

```gherkin
場景大綱: 成功提領後餘額正確
  假設 帳戶 "A-1" 的餘額是 <start>
  當 客戶從帳戶 "A-1" 提取 <amount>
  那麼 帳戶 "A-1" 的餘額應該是 <left>

  例子:
    | start | amount | left |
    | 100   | 40     | 60   |
    | 100   | 100    | 0    |
```

```javascript
Given('帳戶 {string} 的餘額是 {int}', function (id, start) {});
When('客戶從帳戶 {string} 提取 {int}', function (id, amount) {});
Then('帳戶 {string} 的餘額應該是 {int}', function (id, left) {});
```

表格第一列是欄名，不會跑。欄名與 `<欄名>` 大小寫一致。儲存格是純文字；轉成 number 是 `{int}` 的工作。儲存格若是 `40 元` 或 `$40`，`{int}` 對不上，改成對應的 parameter type，或在句子裡只放數字。

引號要寫在句子上，不要期待表格補引號：

```gherkin
當 使用者 "<email>" 登入

例子:
  | email        |
  | a@b.com      |
```

替換後的文字是 `當 使用者 "a@b.com" 登入`，對得上 `{string}`。寫成 `當 使用者 <email> 登入` 時，替換結果沒有引號，`{string}` 對不上。

只有一列時，用一般 `場景`，值直接寫在句子裡。

結果的**種類**不同（成功 vs 拒絕）時，拆成兩個場景，各自有自己的 `那麼`。合成一個大綱會逼出 `那麼 結果應該是 <result>`，step definition 裡再 `if`。失敗時報告只會指向那一個步驟。

`<placeholder>` 可以用在場景標題、Doc String、Data Table 裡，一樣是先替換再執行。

一個大綱可以有多段 `例子`。每段可以掛 tag，用來篩選：

```gherkin
@fast
例子: 小額
  | amount | left |
  | 1      | 99   |

@slow
例子: 整筆提光
  | amount | left |
  | 100    | 0    |
```

### 一個步驟收下一批資料：Data Table

整張表是**這一個步驟**的最後一個參數。它不會變成多個場景，也沒有 `<欄名>` 替換。

```gherkin
假設 系統裡有這些帳戶:
  | id  | balance |
  | A-1 | 100     |
  | A-2 | 40      |
```

```javascript
Given('系統裡有這些帳戶:', function (table) {
  for (const row of table.hashes()) {
    this.accounts.setBalance(row.id, Number(row.balance));
  }
});
```

Cucumber.js 的 `DataTable`：

| 方法 | 結果 |
| --- | --- |
| `hashes()` | 物件陣列，第一列當 key。每個值都是 string |
| `rows()` | 不含表頭的 `string[][]` |
| `raw()` | 含表頭的 `string[][]` |
| `rowsHash()` | 兩欄表格變成一個物件 |

數字、布林、日期在 step definition 裡轉。表格不會依欄名轉型。

儲存格裡的特殊字元：換行寫 `\n`，直線寫 `\|`，反斜線寫 `\\`。

一個步驟只能帶一種多行參數。要同時給一段 JSON 和一張表，拆成兩個步驟。

### 一個步驟收下一大段文字：Doc String

```gherkin
那麼 拒絕訊息應該是:
  """
  餘額不足
  帳戶 A-1 目前餘額 20
  """
```

```javascript
Then('拒絕訊息應該是:', function (message) {
  assert.equal(this.lastWithdrawal.message, message);
});
```

Cucumber.js 傳入的是 string，不會依內容型別自動 `JSON.parse`。開頭的 `"""` 縮排不重要；內容的縮排會依那個 `"""` 所在欄扣除，多出來的空白會保留。內容各行以 `\n` 連接。比對失敗時先印出實際收到的字串，再決定預期值要不要包含結尾換行。

內容型別寫在開頭分隔符後面，給讀的人與 formatter；在 Cucumber.js 仍要自己解析：

````gherkin
假設 請求本文是:
  """json
  {"accountId":"A-1","amount":40}
  """
````

分隔符也可用三個反引號。編輯器對反引號的支援不一致，檔案裡以 `"""` 為主。

## 7. 背景、Rule、Tag

### 背景

`背景` 裡放這個 `功能` 或這個 `Rule` 底下**每個**場景都成立的 `假設`。每個場景開始前都會重跑，`場景大綱` 的每一列也會重跑。

執行順序：

```text
BeforeAll
  每個場景（大綱的每一列各算一個）:
    新的 World
    Before（定義順序）
    功能層級的背景
    Rule 層級的背景
    每個步驟:
      BeforeStep
      step definition
      AfterStep
    After（定義順序的反序）
AfterAll（定義順序的反序）
```

一個 `功能` 一個背景，一個 `Rule` 再一個背景。某個場景需要別的起點時，把那個 `假設` 留在場景裡，並把檔案拆開，而不是在背景下面再覆蓋一次。若 step definition 的「建立帳戶」不是 upsert，背景下面再 `假設` 一次同一筆資料會直接撞鍵。

背景超過 4 行時，把讀場景的人不必逐行知道的細節收進一個較高的 `假設`，例如 `假設 使用者 "Ada" 已登入且擁有帳戶 "A-1"`。那些名字若不影響斷言，就不要鋪在背景裡。

背景裡只放 `假設`。`當` / `那麼` 屬於某個場景。

### Rule

`Rule` 把同一條業務規則的場景放在一起。一個 feature 檔裡有兩組互斥結果（提領成功、提領被拒）時，用兩個 `Rule`，讓各自的背景不會串到對方身上。

### Tag

Tag 寫在 `功能`、`Rule`、`場景`、`例子` 上面。子層會繼承父層的 tag。

```gherkin
@account
功能: 從帳戶提款

  @slow
  場景: 餘額不足
    ...
```

篩選：

```bash
npx cucumber-js --tags "@account and not @slow"
```

Tag 運算式支援 `and`、`or`、`not` 與括號。

Tag 用來選擇要跑哪些場景，以及掛對應的 hook（例如 `@ui` 才開瀏覽器）。業務前置仍然寫成 `假設`：hook 失敗時，報告上是 hook 名稱，不是一句可以讀的步驟。

## 8. 目錄與 step definition 本體

```text
cucumber.js
features/
  withdraw.feature
  support/
    parameter_types.js
    account_service.js
    world.js
    hooks.js
  step_definitions/
    account_steps.js
    session_steps.js
```

```javascript
// cucumber.js
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: [
      'features/support/**/*.js',
      'features/step_definitions/**/*.js',
    ],
  },
};
```

`support` 放在 `step_definitions` 前面，自訂 parameter type 才會先註冊。

Cucumber 載入的是你 `require` 的全部檔案，檔名不會變成命名空間。官方建議一個領域物件一個 step 檔（`account_steps.js`、`session_steps.js`），而不是一個 feature 一個 step 檔。依 feature 拆檔時，同一句話會被複製到兩個檔，兩份表達式同時註冊就變成 ambiguous，或兩邊各改各的。

Step definition 保持薄：取出參數、呼叫 helper、在 `那麼` 裡斷言。selector、SQL、HTTP path 放在 helper。

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');

Given('帳戶 {string} 的餘額是 {int}', function (id, balance) {
  this.accounts.setBalance(id, balance);
});

When('客戶從帳戶 {string} 提取 {int}', async function (id, amount) {
  this.lastWithdrawal = await this.accounts.withdraw(id, amount);
});

Then('帳戶 {string} 的餘額應該是 {int}', function (id, expected) {
  assert.equal(this.accounts.balanceOf(id), expected);
});
```

非同步回傳 Promise，或把函式標成 `async`。Cucumber 會等它結束。不要同時又用 callback。

單步要更長的逾時：

```javascript
When('使用者完成結帳', { timeout: 20_000 }, async function () {
  await this.checkout.submit();
});
```

斷言放在 `那麼`。`假設` / `當` 只有在前置或動作本身失敗（帳戶不存在、連線失敗）時才丟錯，不在那裡斷言這次場景要證明的結果。

## 9. 場景之間的狀態

Cucumber.js 的 World 是每個場景一個新物件，重跑（retry）也是新的。步驟之間要留的東西放在 `this` 上。

用一般 `function`。箭頭函式沒有 Cucumber 綁定的 `this`，`this.accounts` 會是 `undefined`。

```javascript
const { Before, Given, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');

Before(function () {
  this.accounts = new Map();
});

Given('帳戶 {string} 的餘額是 {int}', function (id, balance) {
  this.accounts.set(id, balance);
});

Then('帳戶 {string} 的餘額應該是 {int}', function (id, expected) {
  assert.equal(this.accounts.get(id), expected);
});
```

模組頂層的 `let accounts = new Map()` 會跨場景殘留，平行執行時兩個場景會寫到同一份。可寫狀態放在 World。唯讀設定（base URL、timeout）可以放在模組常數或 World parameters。

`BeforeAll` / `AfterAll` 沒有場景 World。它們在 parallel 模式下預設每個 worker 各跑一次。

## 10. Hook 負責程序，步驟負責業務狀態

| 放在 hook | 放在 `假設` / `背景` |
| --- | --- |
| 啟動與關閉 browser、開 DB 交易、失敗截圖、測試用伺服器 | 這個場景的餘額、方案、是否已登入 |

`Before` 依原始碼順序執行。`After` 依原始碼**反序**執行。把一對 setup / teardown 寫在一起，拆掉的順序就會是堆疊順序：

```javascript
const { After, AfterStep, Before, Status } = require('@cucumber/cucumber');

Before(function () {
  this.driver = buildDriver();
});
After(function () {
  return this.driver.quit();
});

Before(function () {
  this.db = openTransaction();
});
After(function () {
  return this.db.rollback();
});

AfterStep(async function ({ result }) {
  if (result.status !== Status.FAILED || !this.driver) return;
  const png = await this.driver.takeScreenshot();
  this.attach(png, 'image/png');
});
```

實際順序是：開 driver → 開交易 → 背景 → 步驟 → 截圖 hook（若失敗）→ rollback → quit driver。`After` 在場景失敗時仍會跑。

只對某些場景生效：

```javascript
Before({ tags: '@ui' }, function () {
  this.driver = buildDriver();
});
```

`Before({ tags: '@ui' })` 也可以寫成 `Before('@ui', ...)`。

## 11. 完整對照：提款

`當` 這裡呼叫的是 `AccountService`。這次鎖定的邊界若是 HTTP，就把 `withdraw` 換成測試 client；若是瀏覽器，就換成 driver。`.feature` 不用改。

`features/withdraw.feature`：

```gherkin
# language: zh-TW
功能: 從帳戶提款

  Rule: 餘額足夠時，提領金額會從餘額扣除，並留下一筆提領交易

    背景:
      假設 帳戶 "A-1" 的餘額是 100

    場景大綱: 成功提領後餘額與交易正確
      當 客戶從帳戶 "A-1" 提取 <amount>
      那麼 帳戶 "A-1" 的餘額應該是 <balance>
      而且 帳戶 "A-1" 的最後一筆交易應該是提領 <amount>

      例子:
        | amount | balance |
        | 1      | 99      |
        | 40     | 60      |
        | 100    | 0       |

  Rule: 餘額不足時拒絕提領，餘額與交易維持原狀

    場景: 餘額不足
      假設 帳戶 "A-1" 的餘額是 20
      當 客戶從帳戶 "A-1" 提取 40
      那麼 提領應該被拒絕，原因是 "餘額不足"
      而且 帳戶 "A-1" 的餘額應該是 20
      而且 帳戶 "A-1" 應該沒有交易
```

成功那條 `Rule` 的背景只套在它自己的大綱上。餘額不足是另一種起點，所以餘額寫在該場景的 `假設`，不寫進功能層級的背景。

`features/support/account_service.js`：

```javascript
class AccountService {
  constructor() {
    this.accounts = new Map();
  }

  setBalance(id, balance) {
    this.accounts.set(id, { balance, transactions: [] });
  }

  withdraw(id, amount) {
    const account = this.require(id);
    if (account.balance < amount) {
      return { ok: false, reason: '餘額不足' };
    }
    account.balance -= amount;
    account.transactions.push({ type: 'withdraw', amount });
    return { ok: true };
  }

  balanceOf(id) {
    return this.require(id).balance;
  }

  transactionsOf(id) {
    return this.require(id).transactions;
  }

  lastTransaction(id) {
    const transactions = this.transactionsOf(id);
    return transactions[transactions.length - 1];
  }

  require(id) {
    const account = this.accounts.get(id);
    if (!account) throw new Error(`帳戶 ${id} 不存在`);
    return account;
  }
}

module.exports = { AccountService };
```

`features/step_definitions/account_steps.js`：

```javascript
const { Before, Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const { AccountService } = require('../support/account_service');

Before(function () {
  this.accounts = new AccountService();
});

Given('帳戶 {string} 的餘額是 {int}', function (id, balance) {
  this.accounts.setBalance(id, balance);
});

When('客戶從帳戶 {string} 提取 {int}', function (id, amount) {
  this.lastWithdrawal = this.accounts.withdraw(id, amount);
});

Then('帳戶 {string} 的餘額應該是 {int}', function (id, expected) {
  assert.equal(this.accounts.balanceOf(id), expected);
});

Then('帳戶 {string} 的最後一筆交易應該是提領 {int}', function (id, amount) {
  assert.deepEqual(this.accounts.lastTransaction(id), {
    type: 'withdraw',
    amount,
  });
});

Then('提領應該被拒絕，原因是 {string}', function (reason) {
  assert.deepEqual(this.lastWithdrawal, { ok: false, reason });
});

Then('帳戶 {string} 應該沒有交易', function (id) {
  assert.deepEqual(this.accounts.transactionsOf(id), []);
});
```

`假設` 直接 `setBalance`，不呼叫 `withdraw` 來湊出餘額。`那麼` 只讀 `balanceOf` / `lastTransaction` / `lastWithdrawal`，也就是這個邊界回給呼叫端的結果。

同一張 feature 若要一次種多筆，加一個步驟即可，表達式和上面的單筆 `假設` 不同，不會撞車：

```gherkin
假設 系統裡有這些帳戶:
  | id  | balance |
  | A-1 | 100     |
  | A-2 | 40      |
```

```javascript
Given('系統裡有這些帳戶:', function (table) {
  for (const row of table.hashes()) {
    this.accounts.setBalance(row.id, Number(row.balance));
  }
});
```

## 12. 對不上、對到兩個、還沒做完

| 終端機上的狀態 | 原因 | 處理 |
| --- | --- | --- |
| Undefined step，並附上 snippet | 沒有表達式對上這句文字 | 把 snippet 貼進對應的領域 step 檔再實作 |
| Ambiguous step | 兩個以上表達式都能對上 | 把其中一個改窄，或讓兩句 Gherkin 使用不同文字 |
| 場景是 pending | step 回傳 `'pending'` | 實作完就拿掉。pending 不會被當成通過 |
| 步驟被跳過、場景卻綠 | 步驟關鍵字後面多了冒號 | 拿掉步驟上的冒號 |
| `{string}` 對不上 | 句子裡那個值沒有引號 | 改成 `"值"`，或改用 `{word}` / 自訂型別 |
| `{int}` 對不上大綱的某一列 | 儲存格含單位、空白、小數 | 儲存格只留數字，或換 parameter type |
| 第二個場景看到第一個場景的資料 | 狀態寫在模組變數，或 `假設` 用了會重複的固定主鍵 | 狀態放進 World；資料用這一步傳入的 id |
| `this` 是 `undefined` | step 或 hook 用了箭頭函式 | 改成 `function` |

還沒寫完的步驟明示 pending，讓報告和「對不上」分開：

```javascript
Then('帳戶 {string} 的餘額應該是 {int}', function (id, expected) {
  return 'pending';
});
```

改了 Gherkin 的文字，就在同一次修改裡改表達式。匹配是字串對字串，沒有語意模糊搜尋。

## 13. 寫完一個 feature 後對一下

- 檔案第一行是 `# language: zh-TW`，且只有一個 `功能`。
- 每個場景一件事、一個 `當`、大約 3 到 5 步。
- 句子裡的值，要么是這次行為的輸入或預期輸出，要么已經被 `{int}` / `{string}` / 自訂型別吃進參數。
- URL、selector、按鈕、資料表欄位出現在 helper，不出現在 `.feature`。
- `假設` 的實作直接設狀態；`那麼` 的實作讀取句子點名的那個輸出。
- 同一句文字在整個執行裡只註冊一次。`假設` 和 `那麼` 的措辭不同。
- 結果種類不同的案例是兩個場景。值不同、步驟相同的案例是 `場景大綱`。一個步驟要的一批資料是 Data Table。一大段文字是 Doc String。
- `背景` 每個場景都跑得下去，包含大綱的每一列。
- 跨步驟的狀態在 World。沒有模組層級的可寫變數。
- hook 只做啟動、關閉、交易、截圖。業務前置在 `假設` 裡，所以失敗報告看得到那一句。

## 14. Cucumber-JVM 對照

Gherkin 檔不變。註冊方式改成注解，一個表達式一樣全域唯一，關鍵字一樣不參與匹配：

```java
@Given("帳戶 {string} 的餘額是 {int}")
public void 帳戶餘額是(String id, int balance) {
  accounts.setBalance(id, balance);
}
```

Glue class 每個場景新實例。狀態要跨多個 glue class 時，用 scenario-scoped 的依賴注入（cucumber-picocontainer、Spring、Guice）注入同一個 context 物件。不要用 `static` 欄位，否則場景之間、平行執行之間會串資料。

在 Java，字串參數預設是 Cucumber Expression。正則要寫成以 `^` 開頭、`$` 結尾，或寫成 `/.../`。

Data Table 的儲存格同樣全是字串，用 `asMaps()` 或 `asLists()` 之後自己轉型。Doc String 可以收 `String`，或收 `io.cucumber.docstring.DocString` 以讀取 `getMediaType()`。

## 來源

- Gherkin 關鍵字、步驟匹配忽略關鍵字、3–5 步、`Given` / `When` / `Then` 的執行語意、Background、Scenario Outline 先替換再匹配、Doc String 與 Data Table 是最後一個參數：[Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
- 行為寫在場景裡、操作路徑寫在 step definition：[Writing better Gherkin](https://cucumber.io/docs/bdd/better-gherkin/)
- 依領域物件拆 step 檔、只實作場景裡出現的步驟、重複步驟抽 helper：[Step organization](https://cucumber.io/docs/gherkin/step-organization/)
- 表達式與參數型別：[Step definitions](https://cucumber.io/docs/cucumber/step-definitions/)、[Cucumber Expressions](https://github.com/cucumber/cucumber-expressions)
- 內建型別正則（`{int}`、`{float}`、`{word}`、`{string}`、`{}`）：[defineDefaultParameterTypes.ts](https://github.com/cucumber/cucumber-expressions/blob/main/javascript/src/defineDefaultParameterTypes.ts)
- 場景彼此獨立、不從 step 再呼叫場景、通知方式這種實作細節留在 step definition：[Cucumber FAQ](https://cucumber.io/docs/faq/)
- World、箭頭函式、`pending`、hook 順序與 tag hook：[Cucumber.js step definitions](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/step_definitions.md)、[World](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md)、[Hooks](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md)
- 繁體中文關鍵字：[gherkin-languages.json](https://github.com/cucumber/gherkin/blob/main/gherkin-languages.json) 的 `zh-TW`
