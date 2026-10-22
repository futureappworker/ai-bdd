# Rule 1 - 參考 Artifact 必須具體可讀

- 參考 Artifact Example 必須是可讀取的檔案、貼上的完整內容，或使用者明確指定的既有 Artifact。
- 參考 Artifact Example 必須能代表目標 Skill 最終要穩定產出的 Artifact 類型。
- 若使用者只描述想法而沒有提供 Artifact Example，必須先請使用者提供或允許先創建一份 Artifact Example。
- 不得在沒有具體 Artifact Example 的情況下進入 Template 倒抽。

## Good Example

- 使用者指定了可讀取的 Artifact Example 檔案，且該檔案代表目標產物。

```text
Reference Artifact Example: .agents/skills/specify/templates/spec.example.md
Target Artifact Type: Feature Specification
```

## Bad Example

- 使用者只說想要一個「報告類 Skill」，但沒有提供 Artifact Example。

```text
Reference Artifact Example: 一種報告，大概像文件那樣
Target Artifact Type: 未決定
```

# Rule 2 - 客製化必須先於 Template 倒抽完成

- Artifact Example 必須先依使用者客製化需求修改到使用者明確滿意，才可以委派 `skill-form-template`。
- 使用者尚未確認 Artifact Example 滿意時，必須停在客製化或確認回合。
- Artifact Example 的格式、章節、欄位、命名與範例內容仍在變動時，不得建立 Template 骨架。
- `/clarify` 可以用於會影響目標 Artifact 契約、Skill 用途、輸入情境、品質邊界或後續工程路徑的核心不確定處。
- 一般 Artifact 的表面格式、章節命名、欄位語氣與範例措辭偏好不得委派給 `/clarify`，除非該問題會改變可重複產出的 Artifact 契約。
- AI 不得把自己推測的滿意版本當成使用者確認。

## Good Example

- 使用者明確確認 Artifact Example 已達到目標，才進入 Template 倒抽。

```text
User: 這個版本 OK，可以拿它當最終 Artifact Example。
Next Step: Delegate skill-form-template
```

## Bad Example

- 使用者仍在要求調整 Artifact Example，卻提前抽 Template。

```text
User: FR/NFR 的結構我還想再改。
Next Step: Delegate skill-form-template
```

# Rule 3 - Template 必須成為目標 Artifact 契約

- Template 骨架與 Template 範例必須以已確認的 Artifact Example 為來源。
- Template 骨架必須保留目標 Artifact 的完整結構與必要欄位。
- Template 範例必須保留使用者確認過的具體 Artifact 內容。
- 若 Template 與已確認 Artifact Example 結構不一致，必須回到 Template 修正，不得進入 `skill-engineering`。

## Good Example

- Template pair 直接對應使用者確認過的 Artifact Example。

```text
Confirmed Example: templates/spec.example.md
Template Skeleton: templates/spec.md
Template Example: templates/spec.example.md
```

## Bad Example

- Template 骨架省略了已確認 Artifact Example 中的必要章節。

```text
Confirmed Example Sections: Metadata, User Stories, Global Requirements, Success Criteria
Template Skeleton Sections: Metadata, User Stories
```

# Rule 4 - Skill Engineering 交付必須包含目標與邊界

- 交給 `skill-engineering` 前，必須整理目標 Skill 名稱、用途、觸發條件、預期輸入 Prompt 類型與目標 Artifact Template。
- 交給 `skill-engineering` 前，必須說明目標 Skill 要達成的可靠度要求。
- 交給 `skill-engineering` 前，必須說明不得過度工程的邊界。
- 不得只把 Template 路徑交給 `skill-engineering` 而省略目標 Skill 的用途與輸入情境。

## Good Example

- 交付內容同時包含產物、輸入與工程邊界。

```text
Target Skill: specify
Purpose: 將自然語言 Feature Prompt 轉成 Feature Specification
Input Prompt Type: 使用者描述想開發的功能
Target Template: .agents/skills/specify/templates/spec.md
Reliability Requirement: 不捏造 Clarifications，FR/NFR 優先歸屬 User Story
Engineering Boundary: 先建立最小 SOP 與必要 rules，不建立 script
```

## Bad Example

- 交付內容只有 Template，缺少 Skill 用途與輸入情境。

```text
Target Template: .agents/skills/specify/templates/spec.md
```

# Rule 5 - 模組化必須避免過度工程

- `artifact-to-skill-engineering` 必須優先建立或委派最小可執行 SOP。
- Rule File 只應用於品質判斷、命名規則、閘門條件或禁止事項。
- Template 只應用於目標 Artifact 的固定輸出結構。
- Script 只應用於可由相同輸入重複執行的確定性操作。
- 不得為了預留擴充性而建立未被 SOP 載入、委派或使用的模組。

## Good Example

- 只有判斷標準被抽成 Rule，固定輸出結構交給 Template，沒有新增 Script。

```text
SOP: 編排 Artifact 確認、Template 倒抽與 skill-engineering 交付
Rules: 客製化確認與交付邊界
Templates: 由目標 Skill 自己持有
Scripts: 無
```

## Bad Example

- 在沒有確定性自動化需求時，建立未被流程使用的 Script。

```text
SOP: 沒有任何 Delegate script 步驟
Scripts: scripts/generate_target_skill.py
```
