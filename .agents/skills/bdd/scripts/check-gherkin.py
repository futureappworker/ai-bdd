# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Check one Gherkin feature file for mechanical structure errors.

Supports the ``en``, ``zh-TW`` and ``zh-CN`` dialects. Other language codes
produce a single skipped finding and do not rewrite the file.
"""

from __future__ import annotations

import json
import re
import sys
from argparse import ArgumentParser
from pathlib import Path

LANGUAGE_LINE = re.compile(r"^#\s*language\s*:\s*([A-Za-z_-]+)\s*$", re.IGNORECASE)

LANGUAGE_CODES = ("en", "zh-TW", "zh-CN")

STEP_KEYWORDS: dict[str, dict[str, tuple[str, ...]]] = {
    "en": {
        "given": ("Given ",),
        "when": ("When ",),
        "then": ("Then ",),
        "and": ("And ", "But ", "* "),
    },
    "zh-TW": {
        "given": ("假如", "假設", "假定"),
        "when": ("當",),
        "then": ("那麼",),
        "and": ("而且", "並且", "同時", "但是", "* "),
    },
    "zh-CN": {
        "given": ("假如", "假设", "假定"),
        "when": ("当",),
        "then": ("那么",),
        "and": ("而且", "并且", "同时", "但是", "* "),
    },
}

TITLE_KEYWORDS: dict[str, dict[str, tuple[str, ...]]] = {
    "en": {
        "feature": ("Feature", "Business Need", "Ability"),
        "rule": ("Rule",),
        "background": ("Background",),
        "scenario": ("Example", "Scenario"),
        "outline": ("Scenario Outline", "Scenario Template"),
        "examples": ("Examples", "Scenarios"),
    },
    "zh-TW": {
        "feature": ("功能",),
        "rule": ("Rule",),
        "background": ("背景",),
        "scenario": ("場景", "劇本"),
        "outline": ("場景大綱", "劇本大綱"),
        "examples": ("例子",),
    },
    "zh-CN": {
        "feature": ("功能",),
        "rule": ("Rule", "规则"),
        "background": ("背景",),
        "scenario": ("场景", "剧本"),
        "outline": ("场景大纲", "剧本大纲"),
        "examples": ("例子",),
    },
}


def main() -> int:
    parser = ArgumentParser(description="Mechanically check one Gherkin feature file.")
    parser.add_argument("--feature", required=True, help="Feature file to check")
    parser.add_argument("--output", required=True, help="JSON report path to write")
    args = parser.parse_args()

    feature_path = Path(args.feature)
    output_path = Path(args.output)
    if not output_path.parent.exists():
        print(f"output directory does not exist: {output_path.parent}", file=sys.stderr)
        return 1
    if not feature_path.is_file():
        print(f"feature file does not exist: {feature_path}", file=sys.stderr)
        return 1

    try:
        text = feature_path.read_text(encoding="utf-8")
    except UnicodeError as error:
        print(f"cannot read feature file {feature_path}: {error}", file=sys.stderr)
        return 1
    except OSError as error:
        print(f"cannot read feature file {feature_path}: {error}", file=sys.stderr)
        return 1

    report = check_feature(text, str(feature_path))
    try:
        output_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    except OSError as error:
        print(f"cannot write report {output_path}: {error}", file=sys.stderr)
        return 1
    return 0


def check_feature(text: str, path: str) -> dict[str, object]:
    if text.startswith("\ufeff"):
        text = text[1:]
    lines = text.splitlines()
    language, findings = read_language(lines, path)
    scenarios: list[dict[str, object]] = []
    if language is None or language not in STEP_KEYWORDS:
        return {"language": language, "scenarios": scenarios, "findings": findings}

    step_index: dict[str, tuple[int, str]] = {}
    parsed = parse_lines(lines, language, path, step_index)
    findings.extend(parsed["findings"])
    scenarios.extend(parsed["scenarios"])
    findings.sort(key=lambda item: (item["line"], item["code"]))
    return {"language": language, "scenarios": scenarios, "findings": findings}


def read_language(lines: list[str], path: str) -> tuple[str | None, list[dict[str, object]]]:
    header = lines[0].strip() if lines else ""
    matched = LANGUAGE_LINE.fullmatch(header)
    if matched is None:
        return "en", [
            finding(
                path,
                1,
                "missing-language-header",
                "error",
                "第一行必須是 # language: <語言碼>",
            )
        ]
    code = matched.group(1)
    if code not in LANGUAGE_CODES:
        return code, [
            finding(
                path,
                1,
                "unsupported-language",
                "skipped",
                f"Script 只檢查 {', '.join(LANGUAGE_CODES)}，{code} 需改由人工檢查關鍵字",
            )
        ]
    return code, []


def parse_lines(
    lines: list[str],
    language: str,
    path: str,
    step_index: dict[str, tuple[int, str]],
) -> dict[str, list]:
    findings: list[dict[str, object]] = []
    scenarios: list[dict[str, object]] = []
    titles = title_entries(language)
    steps = step_entries(language)
    names: dict[str, int] = {}
    feature_count = 0
    block: dict[str, object] | None = None
    in_doc = False
    doc_marker = ""
    in_examples = False

    def close_block() -> None:
        nonlocal block, in_examples
        if block is None:
            return
        close_example_table(block)
        kind = str(block["kind"])
        if kind in ("scenario", "outline"):
            if int(block["step_count"]) == 0:
                findings.append(
                    finding(path, int(block["line"]), "empty-scenario", "error", "情境沒有步驟")
                )
            if int(block["when_count"]) > 1:
                findings.append(
                    finding(
                        path,
                        int(block["line"]),
                        "multiple-when",
                        "error",
                        "一個情境只能有一個當",
                    )
                )
        if kind == "outline":
            if int(block["example_blocks"]) == 0 or int(block["example_rows"]) == 0 or int(block["empty_tables"]) > 0:
                findings.append(
                    finding(
                        path,
                        int(block["line"]),
                        "outline-missing-examples",
                        "error",
                        "場景大綱的每個例子都必須至少有一列資料",
                    )
                )
            missing = set(block["placeholders"]) - set(block["headers"])
            if missing:
                joined = ", ".join(sorted(missing))
                findings.append(
                    finding(
                        path,
                        int(block["line"]),
                        "unknown-placeholder",
                        "error",
                        f"占位符沒有對應表頭: {joined}",
                    )
                )
        block = None
        in_examples = False

    for line_number, raw in enumerate(lines, 1):
        stripped = raw.strip()
        if in_doc:
            if stripped.startswith(doc_marker):
                in_doc = False
            elif block is not None and block["kind"] == "outline":
                block["placeholders"] = set(block["placeholders"]) | placeholders(stripped)
            continue
        if stripped.startswith('"""') or stripped.startswith("```"):
            in_doc = True
            doc_marker = stripped[:3]
            continue
        if stripped == "" or stripped.startswith("#"):
            continue
        if stripped.startswith("@"):
            continue
        if stripped.startswith("|"):
            if block is not None and in_examples:
                consume_example_row(block, stripped)
            elif block is not None and block["kind"] == "outline":
                for cell in table_cells(stripped):
                    block["placeholders"] = set(block["placeholders"]) | placeholders(cell)
            continue

        title = match_title(stripped, titles)
        if title is not None:
            kind, name, problem = title
            if problem == "missing-colon":
                findings.append(
                    finding(path, line_number, "title-missing-colon", "error", f"{name} 後面必須緊接半形冒號")
                )
                continue
            if problem == "spaced-colon":
                findings.append(
                    finding(
                        path,
                        line_number,
                        "title-colon-spacing",
                        "error",
                        f"{name} 與冒號之間不得有空白",
                    )
                )
                continue
            if kind == "feature":
                feature_count += 1
                close_block()
                continue
            if kind == "rule":
                close_block()
                continue
            if kind == "examples":
                if block is None or block["kind"] != "outline":
                    findings.append(
                        finding(
                            path,
                            line_number,
                            "scenario-has-examples",
                            "error",
                            "例子只能出現在場景大綱",
                        )
                    )
                else:
                    close_example_table(block)
                    in_examples = True
                    block["awaiting_header"] = True
                    block["table_open"] = True
                    block["example_blocks"] = int(block["example_blocks"]) + 1
                continue
            close_block()
            block = new_block(kind, name, line_number)
            in_examples = False
            if kind in ("scenario", "outline"):
                if name == "":
                    findings.append(
                        finding(path, line_number, "empty-scenario", "error", "情境標題不得是空白")
                    )
                elif name in names:
                    findings.append(
                        finding(
                            path,
                            line_number,
                            "duplicate-scenario-name",
                            "error",
                            f"情境標題與第 {names[name]} 行重複",
                        )
                    )
                else:
                    names[name] = line_number
                scenarios.append(
                    {
                        "kind": "outline" if kind == "outline" else "scenario",
                        "name": name,
                        "line": line_number,
                    }
                )
                block["placeholders"] = placeholders(name)
            continue

        step = match_step(stripped, steps)
        if step is None:
            continue
        keyword_type, text, colon = step
        if colon:
            findings.append(
                finding(path, line_number, "step-keyword-colon", "error", "步驟關鍵字後面不得加冒號")
            )
            continue
        if text == "":
            findings.append(finding(path, line_number, "empty-step", "error", "步驟沒有內容"))
            continue
        normalized = " ".join(text.split())
        if normalized in step_index:
            previous_line, _previous_path = step_index[normalized]
            findings.append(
                finding(
                    path,
                    line_number,
                    "duplicate-step-text",
                    "error",
                    f"步驟文字與第 {previous_line} 行重複",
                )
            )
        else:
            step_index[normalized] = (line_number, path)
        if block is None:
            findings.append(
                finding(path, line_number, "step-outside-scenario", "error", "步驟必須寫在背景或情境裡")
            )
            continue
        in_examples = False
        block["step_count"] = int(block["step_count"]) + 1
        if keyword_type == "and":
            effective = block["last_primary"]
        else:
            effective = keyword_type
            block["last_primary"] = keyword_type
        if block["kind"] == "background" and effective in ("when", "then"):
            code = "background-when" if effective == "when" else "background-then"
            label = "當" if effective == "when" else "那麼"
            findings.append(finding(path, line_number, code, "error", f"背景不得包含{label}"))
        if keyword_type == "when" and block["kind"] != "background":
            block["when_count"] = int(block["when_count"]) + 1
        if block["kind"] == "outline":
            block["placeholders"] = set(block["placeholders"]) | placeholders(text)

    close_block()
    if feature_count == 0:
        findings.append(finding(path, 1, "no-feature", "error", "檔案必須有一個功能標題"))
    elif feature_count > 1:
        findings.append(finding(path, 1, "multiple-features", "error", "一個檔案只能有一個功能標題"))
    return {"findings": findings, "scenarios": scenarios}


def new_block(kind: str, name: str, line: int) -> dict[str, object]:
    return {
        "kind": kind,
        "name": name,
        "line": line,
        "step_count": 0,
        "when_count": 0,
        "last_primary": None,
        "placeholders": set(),
        "headers": set(),
        "example_blocks": 0,
        "example_rows": 0,
        "empty_tables": 0,
        "awaiting_header": False,
        "table_open": False,
        "current_rows": 0,
    }


def close_example_table(block: dict[str, object]) -> None:
    if not bool(block["table_open"]):
        return
    if bool(block["awaiting_header"]) or int(block["current_rows"]) == 0:
        block["empty_tables"] = int(block["empty_tables"]) + 1
    block["table_open"] = False
    block["awaiting_header"] = False
    block["current_rows"] = 0


def consume_example_row(block: dict[str, object], stripped: str) -> None:
    cells = table_cells(stripped)
    if bool(block["awaiting_header"]):
        block["headers"] = set(block["headers"]) | {cell for cell in cells if cell}
        block["awaiting_header"] = False
        block["current_rows"] = 0
        return
    if any(cells):
        block["example_rows"] = int(block["example_rows"]) + 1
        block["current_rows"] = int(block["current_rows"]) + 1


def title_entries(language: str) -> list[tuple[str, str]]:
    entries: list[tuple[str, str]] = []
    for kind, keywords in TITLE_KEYWORDS[language].items():
        entries.extend((keyword, kind) for keyword in keywords)
    entries.sort(key=lambda item: len(item[0]), reverse=True)
    return entries


def step_entries(language: str) -> list[tuple[str, str]]:
    entries: list[tuple[str, str]] = []
    for kind, keywords in STEP_KEYWORDS[language].items():
        entries.extend((keyword, kind) for keyword in keywords)
    entries.sort(key=lambda item: len(item[0]), reverse=True)
    return entries


def match_title(line: str, titles: list[tuple[str, str]]) -> tuple[str, str, str | None] | None:
    for keyword, kind in titles:
        if not line.startswith(keyword):
            continue
        rest = line[len(keyword) :]
        if rest.startswith(":"):
            return kind, rest[1:].strip(), None
        if rest.startswith("：") or rest.startswith(" :") or rest.startswith(" ："):
            return kind, keyword, "spaced-colon"
        if rest == "" or rest[0].isspace():
            return kind, keyword, "missing-colon"
    return None


def match_step(line: str, steps: list[tuple[str, str]]) -> tuple[str, str, bool] | None:
    for keyword, kind in steps:
        if line.startswith(keyword):
            rest = line[len(keyword) :].strip()
            colon = rest.startswith(":") or rest.startswith("：")
            return kind, rest[1:].strip() if colon else rest, colon
    for keyword, kind in steps:
        base = keyword.strip()
        if base in ("", "*"):
            continue
        if not line.startswith(base):
            continue
        rest = line[len(base) :]
        if rest.startswith(":") or rest.startswith("：") or rest.startswith(" :") or rest.startswith(" ："):
            return kind, "", True
    return None


def placeholders(text: str) -> set[str]:
    found: set[str] = set()
    cursor = 0
    while True:
        start = text.find("<", cursor)
        if start < 0:
            return found
        end = text.find(">", start + 1)
        if end < 0:
            return found
        token = text[start + 1 : end].strip()
        if token and "<" not in token and " " not in token:
            found.add(token)
        cursor = end + 1


def table_cells(line: str) -> list[str]:
    cells: list[str] = []
    current: list[str] = []
    first = True
    index = 0
    while index < len(line):
        char = line[index]
        index += 1
        if char == "|":
            if first:
                first = False
            else:
                cells.append("".join(current).strip())
            current = []
            continue
        if char == "\\" and index < len(line):
            escaped = line[index]
            index += 1
            current.append("\n" if escaped == "n" else escaped)
            continue
        current.append(char)
    return cells


def finding(path: str, line: int, code: str, severity: str, message: str) -> dict[str, object]:
    return {
        "severity": severity,
        "code": code,
        "path": path,
        "line": line,
        "message": message,
    }


if __name__ == "__main__":
    raise SystemExit(main())
