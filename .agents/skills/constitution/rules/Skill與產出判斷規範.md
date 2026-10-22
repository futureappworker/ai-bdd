# Rule 1 - 依描述判斷唯一 Skill

- 候選 Skill 必須來自 `.agents/skills/` 中會把產出寫入專案檔案的 Skill。
- 正在執行本流程的 `constitution` Skill 不得列為候選。
- 符合必須同時對上該 Skill 的 description 與它自己的寫入產出種類。
- 只因描述與 Skill 名稱或 description 有共同詞彙，不得視為符合。
- 使用者已點名 Skill 時，必須採用該 Skill。
- 只有一個 Skill 符合時，必須採用該 Skill。
- 沒有 Skill 符合，或有多個 Skill 符合且使用者未點名時，目標 Skill 必須為空。

## Good Example

- 描述是「API Spec」與「查詢 API」。`api-plan` 的寫入步驟產出 OpenAPI，因此目標 Skill 是 `api-plan`。

```text
目標 Skill: api-plan
```

## Bad Example

- 同一則描述因為都有 Spec，改採寫入 Feature Specification 的 `specify`。

```text
目標 Skill: specify
```

# Rule 2 - 依已決定的 Skill 判斷產出檔名

- 目標 Skill 只寫入一份產出時，必須採用該寫入步驟引用的樣板檔名。
- 目標 Skill 寫入多份產出時，必須採用描述唯一對上的那一份樣板檔名。
- 仍有多份產出對上時，產出檔名必須為空。
- 目標 Skill 為空時，產出檔名必須為空。

## Good Example

- 目標 Skill 已是 `api-plan`，它的寫入步驟只引用 OpenAPI 樣板，因此產出檔名是 `openapi.yaml`。

```text
產出檔名: openapi.yaml
```

## Bad Example

- 同一則 `api-plan` 只寫入一份 OpenAPI，產出檔名卻留空。

```text
產出檔名:
```
