# Rule 1 - 模式只有三種

- 本次執行必須剛好判為「產出 Gherkin」、「修改 Gherkin」或「測試驅動開發」其中一種。
- 使用者尚未明示接受目前 feature 內容時，必須判為「產出 Gherkin」或「修改 Gherkin」。
- 只有使用者明示接受目前這一份 feature、而且沒有同時要求改寫任何 Gherkin 句子時，才必須判為「測試驅動開發」。
- 明示接受必須能對上目前 feature，例如「Review 通過」「Gherkin 可以」「開始寫測試」。
- 使用者同時接受並要求改句子時，必須判為「修改 Gherkin」。
- 沒有可寫成 `假設`、`當`、`那麼` 的需求時，必須停止，不得建立 feature。

## Good Example

- 使用者只接受目前 feature，沒有要求改句子，因此進入測試驅動開發。

```text
Review 通過，開始為每個情境寫測試。
```

## Bad Example

- 使用者雖然說通過，但同時要求改句子，仍把模式判成測試驅動開發。

```text
Review 通過，但是把提領金額改成 80，然後直接開始寫產品程式。
```

# Rule 2 - 通過前不得進入測試驅動

- 「產出 Gherkin」與「修改 Gherkin」結束時必須停止在 Review 閘門。
- 停止前不得新增或修改 step definition、hook、測試支撐或產品程式。
- 停止前不得執行會跑情境的測試命令。
- Gherkin 結構檢查 Script 可以在停止前執行。

## Good Example

- feature 寫完並檢查後停止，測試與產品程式都還沒改。

```text
已寫入 features/withdraw.feature。測試驅動尚未開始，請 Review 這份 Gherkin。
```

## Bad Example

- Gherkin 還沒被接受，就已經補上 step definition 與產品實作。

```text
feature 已寫好。我同時新增了 account_steps.js，並讓提領測試通過。
```

# Rule 3 - 通過後鎖定 feature

- 「測試驅動開發」期間不得修改目前 feature。
- 使用者在測試驅動期間要求改 Gherkin 時，必須改判為「修改 Gherkin」，改完後再次停在 Review 閘門。
- 情境無法依現有句子執行時，必須停止並指出衝突的句子。
- 不得為了讓測試通過而自行改寫已接受的 Gherkin。

## Good Example

- 句子與產品邊界衝突時停止，feature 維持使用者接受的內容。

```text
場景「餘額不足」要求餘額變為 20，但同一步又要求餘額不變。feature 未改，測試驅動已停止。
```

## Bad Example

- 為了讓測試好寫，自行刪掉已接受場景裡的一個 `那麼`。

```text
這個斷言太難做，我已把「應該沒有交易」從 feature 刪除並讓測試通過。
```

# Rule 4 - Review 回覆必須可審

- 「產出 Gherkin」或「修改 Gherkin」的回覆必須包含 feature 路徑、完整 feature 內容、每個場景標題，以及無法寫成步驟的缺口。
- 回覆必須寫明測試驅動尚未開始，並等待使用者接受這一份 Gherkin。
- 缺口必須是需求裡缺少的可觀察結果或條件，不得用猜測填進 feature。

## Good Example

- 回覆含有完整 feature、一個尚未寫入的缺口，以及等待接受的語句。

```text
features/withdraw.feature
功能: 從帳戶提款
  場景: 餘額不足
    假設 帳戶 "A-1" 的餘額是 20
    當 客戶從帳戶 "A-1" 提取 40
    那麼 提領應該被拒絕
缺口：需求沒有寫拒絕時使用者看得到的原因。
測試驅動尚未開始，請 Review 這份 Gherkin。
```

## Bad Example

- 回覆只說寫好了，沒有 feature 內容，也沒有標明還在等待接受。

```text
Gherkin 已完成。
```
