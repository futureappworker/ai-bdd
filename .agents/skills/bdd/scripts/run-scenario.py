# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Run one already-decided test command and write a JSON result.

The command is everything after ``--``. ``--dry-run`` writes the command
without executing it. ``--execute`` runs it and records the process result.
"""

from __future__ import annotations

import json
import subprocess
import sys
from argparse import ArgumentParser
from pathlib import Path

OUTPUT_LIMIT = 200_000
DEFAULT_TIMEOUT_SECONDS = 180


def main() -> int:
    raw_args = sys.argv[1:]
    if "--" in raw_args:
        split_at = raw_args.index("--")
        own_args = raw_args[:split_at]
        command = raw_args[split_at + 1 :]
    else:
        own_args = raw_args
        command = []

    parser = ArgumentParser(
        description="Run a test command and write stdout, stderr, and exit code as JSON."
    )
    parser.add_argument("--cwd", required=True, help="Working directory for the command")
    parser.add_argument("--output", required=True, help="JSON result path to write")
    parser.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT_SECONDS, help="Seconds before the command is stopped")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--execute", action="store_true", help="Run the command")
    mode.add_argument("--dry-run", action="store_true", help="Record the command without running it")
    args = parser.parse_args(own_args)

    if args.timeout <= 0:
        print("--timeout must be a positive number of seconds", file=sys.stderr)
        return 1
    if not command:
        print("command is required after --", file=sys.stderr)
        return 1

    cwd = Path(args.cwd)
    output_path = Path(args.output)
    if not cwd.is_dir():
        print(f"working directory does not exist: {cwd}", file=sys.stderr)
        return 1
    if not output_path.parent.exists():
        print(f"output directory does not exist: {output_path.parent}", file=sys.stderr)
        return 1

    result = {
        "executed": False,
        "command": command,
        "cwd": str(cwd),
        "exitCode": None,
        "stdout": "",
        "stderr": "",
        "timedOut": False,
    }
    if args.execute:
        result = execute(command, cwd, args.timeout, result)

    try:
        output_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    except OSError as error:
        print(f"cannot write result {output_path}: {error}", file=sys.stderr)
        return 1
    return 0


def execute(command: list[str], cwd: Path, timeout: int, result: dict[str, object]) -> dict[str, object]:
    result["executed"] = True
    try:
        completed = subprocess.run(
            command,
            cwd=cwd,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout,
            check=False,
        )
    except subprocess.TimeoutExpired as error:
        result["timedOut"] = True
        result["stdout"] = clip(error.stdout)
        result["stderr"] = clip(error.stderr)
        return result
    except OSError as error:
        result["stderr"] = f"cannot start command: {error}"
        return result
    result["exitCode"] = completed.returncode
    result["stdout"] = clip(completed.stdout)
    result["stderr"] = clip(completed.stderr)
    return result


def clip(value: str | bytes | None) -> str:
    if value is None:
        return ""
    if isinstance(value, bytes):
        text = value.decode("utf-8", errors="replace")
    else:
        text = value
    if len(text) <= OUTPUT_LIMIT:
        return text
    return text[:OUTPUT_LIMIT] + "\n[truncated]"


if __name__ == "__main__":
    raise SystemExit(main())
