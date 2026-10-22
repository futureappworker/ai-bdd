# Rule 1 - Checklist 必須是獨立 Artifact

- Requirements checklist 必須寫入目標 Feature Specification 同層 feature 目錄下的 `checklists/requirements.md`。
- Requirements checklist 必須依已載入樣板與範例產生，不得嵌入 Feature Specification 內。
- Requirements checklist 必須連結或標示其檢查的目標 `spec.md` 路徑。
- 當目標 Feature Specification 因核心缺口進入 `Needs Clarification` 時，可以先建立 checklist，但不得將核心缺口相關項目標記為通過。

## Good Example

- Checklist 位於 feature 專屬目錄的 `checklists/` 下，且不是 spec 內部章節。

```text
specs/001-photo-album-organizer/spec.md
specs/001-photo-album-organizer/checklists/requirements.md
```

## Bad Example

- Checklist 被寫入 spec 本文，無法成為 planning 前可獨立審查的 Artifact。

```markdown
# 功能規格 ( Feature Specification )：照片相簿整理

## 規格品質檢查清單 ( Specification Quality Checklist )

- [ ] 需求可測試且沒有歧義
```

# Rule 2 - Checklist 項目必須逐項驗證

- 每個 checklist 項目必須依目標 Feature Specification 內容判斷通過或未通過。
- 通過項目必須標記為 `[x]`。
- 未通過項目必須保留 `[ ]`，並在 Notes 中記錄具體問題。
- Notes 中的未通過說明必須指出受影響的 spec 區段、缺少內容或矛盾內容。
- 不得因為 checklist 檔案已建立就將全部項目標記為通過。

## Good Example

- 未通過項目維持未勾選，Notes 指出具體缺口。

```markdown
- [ ] Success Criteria 可量測且不依賴特定技術

## 備註 ( Notes )

- 成功標準 ( Success Criteria ) 中的 SC-002 只寫「使用者覺得更快」，缺少可量測條件。
```

## Bad Example

- 沒有逐項驗證就全部勾選，Notes 也沒有說明依據。

```markdown
- [x] Success Criteria 可量測且不依賴特定技術

## 備註 ( Notes )

- Looks good.
```

# Rule 3 - Checklist 驗證必須驅動 Spec 修正

- 當 checklist 出現未通過項目且該問題可由既有使用者資訊修正時，`specify` 必須修正目標 Feature Specification。
- 修正後必須重新驗證 checklist 中受影響的項目。
- 若未通過項目源自核心缺口且需要使用者回答，Feature Specification 的 Status 必須維持 `Needs Clarification`，且 checklist 不得標記該項通過。
- 若同一 checklist 項目經過三次修正仍未通過，必須在 Notes 中保留剩餘問題並停止自動修正。

## Good Example

- 可由既有資訊修正的問題先回寫 spec，再更新 checklist 狀態。

```markdown
- [x] Functional Requirements 已歸屬於最相關的 User Story，或有充分理由列為全域需求

## 備註 ( Notes )

- FR-G-002 已移至使用者故事 3 ( User Story 3 )，因為它只支援相簿預覽。
```

## Bad Example

- Checklist 發現問題後只留下備註，卻沒有修正可直接處理的 spec 問題。

```markdown
- [ ] Functional Requirements 已歸屬於最相關的 User Story，或有充分理由列為全域需求

## 備註 ( Notes )

- Some requirements may be in the wrong section, but spec was not updated.
```
