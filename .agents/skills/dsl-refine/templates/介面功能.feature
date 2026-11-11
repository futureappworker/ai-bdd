# language: zh-TW
功能: {{FEATURE_NAME}}

  {{FEATURE_DESCRIPTION}}

  背景:
    假設 {{BACKGROUND_GIVEN}}

  # 來源驗收檔案="{{ACCEPTANCE_FILE}}"
  # 來源驗收主張="{{ACCEPTANCE_RULE_CLAIM}}"
  Rule: {{INTERFACE_RULE_CLAIM}}

    # 來源驗收場景="{{ACCEPTANCE_SCENARIO_NAME}}"
    場景: {{INTERFACE_SCENARIO_NAME}}
      假設 {{ARRANGE_GIVEN}}
      而且 {{ARRANGE_AND_GIVEN}}
      當 {{ACT_WHEN}}
      那麼 {{ASSERT_THEN}}
      而且 {{ASSERT_AND_THEN}}
