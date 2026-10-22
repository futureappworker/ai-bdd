# 系統分析規劃

## 專案結構 (Project Structure)

### 文件：本功能 (Documentation: this feature)

```text
{{FEATURE_DOCUMENTATION_TREE}}
```

### 原始碼：儲存庫根目錄 (Source Code: repository root)

```text
{{SOURCE_CODE_TREE}}
```

**Structure Decision**: {{STRUCTURE_DECISION}}

## 分析流程規劃

### 系統介面盤點

依據使用者需求原文，先盤點本次系統分析需要涵蓋的技術端點，並把每個端點視為一個獨立 system 的介面。此處只建立後續分析順序，不在本段落執行實際系統分析。

{{SYSTEM_INTERFACE_INVENTORY}}

{{EXCLUDED_ENDPOINT_TYPES}}

### 分析流程安排

後續系統分析會依照需求依賴程度分成多個 Wave。每個 Wave 裡只放技術端點，不放實際分析結果；同一個 Wave 內的端點代表可以平行開 Sub-agent，並委派給對應的小 Skill 執行後續介面分析。
每個端點會列出具名 Planner Skill，供後續 Wave 執行時委派。

{{ANALYSIS_WAVES}}
