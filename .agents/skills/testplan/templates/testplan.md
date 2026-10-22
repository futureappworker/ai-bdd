# 測試計劃 ( Test Plan )：{{FEATURE_NAME}}

**輸入 ( Input )**：`{{SPEC_PATH}}`、`{{PLAN_PATH}}`、`{{OPENAPI_PATH}}`、`{{INTERFACE_PEN_PATH}}`

案例的受測操作只使用契約檔已有的操作。故事歸屬、全域 NFR 歸屬、FR/NFR 索引與斷言字面值來自 `spec.md`。這份計劃不重寫呼叫契約。

## 上游介面索引 ( Upstream Interfaces )

| 介面 | plan.md 盤點 | 契約 |
| --- | --- | --- |
| {{INTERFACE_NAME_1}} | {{INTERFACE_INVENTORY_1}} | `{{INTERFACE_CONTRACT_1}}` |
| {{INTERFACE_NAME_2}} | {{INTERFACE_INVENTORY_2}} | `{{INTERFACE_CONTRACT_2}}` |

## 共用 Arrange Fixtures

兩個以上案例共用的前置狀態寫在這裡。只被一個案例使用的前置寫在該案例內。

1. **Fixture {{FIXTURE_NAME_1}}**：{{FIXTURE_BODY_1}}

## 使用者故事 1 - {{USER_STORY_1_TITLE}}（Priority: {{USER_STORY_1_PRIORITY}}）

{{USER_STORY_1_SUMMARY}}

### TDD 順序 ( Atomic Order )

#### 單元與服務測試

1. {{CASE_ID_1}}
2. {{CASE_ID_2}}

#### 瀏覽器端到端測試

1. {{CASE_ID_3}}

### {{CASE_ID_1}} {{CASE_TITLE_1}}

- **對應需求 ( Traces )** {{CASE_TRACES_1}}
- **契約位址 ( Contract )** `{{CASE_CONTRACT_1}}`
- **唯一測試意圖 ( Intent )** {{CASE_INTENT_1}}
- **受測部位 ( Subject )** {{CASE_SUBJECT_1}}
- **受測操作 ( Operation )** {{CASE_OPERATION_1}}
- **前置條件 ( Arrange )** {{CASE_ARRANGE_1}}
- **操作 ( Act )** {{CASE_ACT_1}}
- **觀測通道 ( Observation Channel )** {{CASE_CHANNEL_1}}
- **預期輸出 ( Expected Output )** {{CASE_EXPECTED_1}}
- **必須維持不變 ( Must Stay )** {{CASE_MUST_STAY_1}}
- **本案例不驗證 ( Not Verified )** {{CASE_NOT_VERIFIED_1}}
- **預期 RED 原因 ( Expected Red )** {{CASE_EXPECTED_RED_1}}

### {{CASE_ID_2}} {{CASE_TITLE_2}}

- **對應需求 ( Traces )** {{CASE_TRACES_2}}
- **契約位址 ( Contract )** `{{CASE_CONTRACT_2}}`
- **唯一測試意圖 ( Intent )** {{CASE_INTENT_2}}
- **受測部位 ( Subject )** {{CASE_SUBJECT_2}}
- **受測操作 ( Operation )** {{CASE_OPERATION_2}}
- **前置條件 ( Arrange )** {{CASE_ARRANGE_2}}
- **操作 ( Act )** {{CASE_ACT_2}}
- **觀測通道 ( Observation Channel )** {{CASE_CHANNEL_2}}
- **預期輸出 ( Expected Output )** {{CASE_EXPECTED_2}}
- **必須維持不變 ( Must Stay )** {{CASE_MUST_STAY_2}}
- **本案例不驗證 ( Not Verified )** {{CASE_NOT_VERIFIED_2}}
- **預期 RED 原因 ( Expected Red )** {{CASE_EXPECTED_RED_2}}

### {{CASE_ID_3}} {{CASE_TITLE_3}}

- **對應需求 ( Traces )** {{CASE_TRACES_3}}
- **契約位址 ( Contract )** `{{CASE_CONTRACT_3}}`
- **唯一測試意圖 ( Intent )** {{CASE_INTENT_3}}
- **受測部位 ( Subject )** {{CASE_SUBJECT_3}}
- **受測操作 ( Operation )** {{CASE_OPERATION_3}}
- **前置條件 ( Arrange )** {{CASE_ARRANGE_3}}
- **操作 ( Act )** {{CASE_ACT_3}}
- **觀測通道 ( Observation Channel )** {{CASE_CHANNEL_3}}
- **預期輸出 ( Expected Output )** {{CASE_EXPECTED_3}}
- **必須維持不變 ( Must Stay )** {{CASE_MUST_STAY_3}}
- **本案例不驗證 ( Not Verified )** {{CASE_NOT_VERIFIED_3}}
- **預期 RED 原因 ( Expected Red )** {{CASE_EXPECTED_RED_3}}

## 使用者故事 2 - {{USER_STORY_2_TITLE}}（Priority: {{USER_STORY_2_PRIORITY}}）

{{USER_STORY_2_SUMMARY}}

### TDD 順序 ( Atomic Order )

#### 單元與服務測試

1. {{CASE_ID_4}}

#### 瀏覽器端到端測試

1. {{CASE_ID_5}}
2. {{CASE_ID_6}}

### {{CASE_ID_4}} {{CASE_TITLE_4}}

- **對應需求 ( Traces )** {{CASE_TRACES_4}}
- **契約位址 ( Contract )** `{{CASE_CONTRACT_4}}`
- **唯一測試意圖 ( Intent )** {{CASE_INTENT_4}}
- **受測部位 ( Subject )** {{CASE_SUBJECT_4}}
- **受測操作 ( Operation )** {{CASE_OPERATION_4}}
- **前置條件 ( Arrange )** {{CASE_ARRANGE_4}}
- **操作 ( Act )** {{CASE_ACT_4}}
- **觀測通道 ( Observation Channel )** {{CASE_CHANNEL_4}}
- **預期輸出 ( Expected Output )** {{CASE_EXPECTED_4}}
- **必須維持不變 ( Must Stay )** {{CASE_MUST_STAY_4}}
- **本案例不驗證 ( Not Verified )** {{CASE_NOT_VERIFIED_4}}
- **預期 RED 原因 ( Expected Red )** {{CASE_EXPECTED_RED_4}}

### {{CASE_ID_5}} {{CASE_TITLE_5}}

- **對應需求 ( Traces )** {{CASE_TRACES_5}}
- **契約位址 ( Contract )** `{{CASE_CONTRACT_5}}`
- **唯一測試意圖 ( Intent )** {{CASE_INTENT_5}}
- **受測部位 ( Subject )** {{CASE_SUBJECT_5}}
- **受測操作 ( Operation )** {{CASE_OPERATION_5}}
- **前置條件 ( Arrange )** {{CASE_ARRANGE_5}}
- **操作 ( Act )** {{CASE_ACT_5}}
- **觀測通道 ( Observation Channel )** {{CASE_CHANNEL_5}}
- **預期輸出 ( Expected Output )** {{CASE_EXPECTED_5}}
- **必須維持不變 ( Must Stay )** {{CASE_MUST_STAY_5}}
- **本案例不驗證 ( Not Verified )** {{CASE_NOT_VERIFIED_5}}
- **預期 RED 原因 ( Expected Red )** {{CASE_EXPECTED_RED_5}}

### {{CASE_ID_6}} {{CASE_TITLE_6}}

- **對應需求 ( Traces )** {{CASE_TRACES_6}}
- **契約位址 ( Contract )** `{{CASE_CONTRACT_6}}`
- **唯一測試意圖 ( Intent )** {{CASE_INTENT_6}}
- **受測部位 ( Subject )** {{CASE_SUBJECT_6}}
- **受測操作 ( Operation )** {{CASE_OPERATION_6}}
- **前置條件 ( Arrange )** {{CASE_ARRANGE_6}}
- **操作 ( Act )** {{CASE_ACT_6}}
- **觀測通道 ( Observation Channel )** {{CASE_CHANNEL_6}}
- **預期輸出 ( Expected Output )** {{CASE_EXPECTED_6}}
- **必須維持不變 ( Must Stay )** {{CASE_MUST_STAY_6}}
- **本案例不驗證 ( Not Verified )** {{CASE_NOT_VERIFIED_6}}
- **預期 RED 原因 ( Expected Red )** {{CASE_EXPECTED_RED_6}}

## 全域 NFR - {{GLOBAL_NFR_1_ID}} {{GLOBAL_NFR_1_TITLE}}

{{GLOBAL_NFR_1_SUMMARY}}

### TDD 順序 ( Atomic Order )

#### 單元與服務測試

1. {{CASE_ID_7}}

### {{CASE_ID_7}} {{CASE_TITLE_7}}

- **對應需求 ( Traces )** {{CASE_TRACES_7}}
- **契約位址 ( Contract )** `{{CASE_CONTRACT_7}}`
- **唯一測試意圖 ( Intent )** {{CASE_INTENT_7}}
- **受測部位 ( Subject )** {{CASE_SUBJECT_7}}
- **受測操作 ( Operation )** {{CASE_OPERATION_7}}
- **前置條件 ( Arrange )** {{CASE_ARRANGE_7}}
- **操作 ( Act )** {{CASE_ACT_7}}
- **觀測通道 ( Observation Channel )** {{CASE_CHANNEL_7}}
- **預期輸出 ( Expected Output )** {{CASE_EXPECTED_7}}
- **必須維持不變 ( Must Stay )** {{CASE_MUST_STAY_7}}
- **本案例不驗證 ( Not Verified )** {{CASE_NOT_VERIFIED_7}}
- **預期 RED 原因 ( Expected Red )** {{CASE_EXPECTED_RED_7}}

## 全域 NFR - {{GLOBAL_NFR_2_ID}} {{GLOBAL_NFR_2_TITLE}}

{{GLOBAL_NFR_2_SUMMARY}}

### TDD 順序 ( Atomic Order )

#### 單元與服務測試

1. {{CASE_ID_8}}

### {{CASE_ID_8}} {{CASE_TITLE_8}}

- **對應需求 ( Traces )** {{CASE_TRACES_8}}
- **契約位址 ( Contract )** `{{CASE_CONTRACT_8}}`
- **唯一測試意圖 ( Intent )** {{CASE_INTENT_8}}
- **受測部位 ( Subject )** {{CASE_SUBJECT_8}}
- **受測操作 ( Operation )** {{CASE_OPERATION_8}}
- **前置條件 ( Arrange )** {{CASE_ARRANGE_8}}
- **操作 ( Act )** {{CASE_ACT_8}}
- **觀測通道 ( Observation Channel )** {{CASE_CHANNEL_8}}
- **預期輸出 ( Expected Output )** {{CASE_EXPECTED_8}}
- **必須維持不變 ( Must Stay )** {{CASE_MUST_STAY_8}}
- **本案例不驗證 ( Not Verified )** {{CASE_NOT_VERIFIED_8}}
- **預期 RED 原因 ( Expected Red )** {{CASE_EXPECTED_RED_8}}

## 總驗收

{{ACCEPTANCE_SUMMARY}}

### TDD 順序 ( Atomic Order )

#### 瀏覽器端到端測試

1. {{CASE_ID_9}}

### {{CASE_ID_9}} {{CASE_TITLE_9}}

- **對應需求 ( Traces )** {{CASE_TRACES_9}}
- **契約位址 ( Contract )** `{{CASE_CONTRACT_9}}`
- **唯一測試意圖 ( Intent )** {{CASE_INTENT_9}}
- **受測部位 ( Subject )** {{CASE_SUBJECT_9}}
- **受測操作 ( Operation )** {{CASE_OPERATION_9}}
- **前置條件 ( Arrange )** {{CASE_ARRANGE_9}}
- **操作 ( Act )** {{CASE_ACT_9}}
- **觀測通道 ( Observation Channel )** {{CASE_CHANNEL_9}}
- **預期輸出 ( Expected Output )** {{CASE_EXPECTED_9}}
- **必須維持不變 ( Must Stay )** {{CASE_MUST_STAY_9}}
- **本案例不驗證 ( Not Verified )** {{CASE_NOT_VERIFIED_9}}
- **預期 RED 原因 ( Expected Red )** {{CASE_EXPECTED_RED_9}}

## 不列為案例

- **{{EXCLUDED_REQUIREMENT_1}}**：{{EXCLUDED_STATEMENT_1}}
- **{{EXCLUDED_REQUIREMENT_2}}**：{{EXCLUDED_STATEMENT_2}}
