"""Port of scripts/tokens.ts from KostaD02/brand: CSS custom properties to tokens.json."""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Callable, TypedDict

BLOCK = re.compile(r"([^{}]+)\{([^{}]*)\}")
DECLARATION = re.compile(r"--([a-z0-9-]+)\s*:\s*([^;]+);")
COMMENT = re.compile(r"/\*[\s\S]*?\*/")
PACKAGE_JSON = Path(__file__).resolve().parent.parent / "package.json"

Blocks = dict[str, dict[str, str]]


class Manifest(TypedDict):
    version: str
    prefix: str
    theme: dict[str, dict[str, str]]
    token: dict[str, str]
    themeColor: dict[str, str]
    breakpoint: dict[str, int]


def log(message: str, is_silent: bool = False, is_error: bool = False) -> None:
    if is_silent:
        return

    stream = sys.stderr if is_error else sys.stdout
    print(f"[{datetime.now():%d.%m.%Y, %H:%M:%S}]: {message}", file=stream)


def parse(css: str, prefix: str) -> Blocks:
    blocks: Blocks = {}

    for block in BLOCK.finditer(css):
        selector = " ".join(COMMENT.sub("", block[1]).split())
        if not selector:
            continue

        declarations = blocks.setdefault(selector, {})
        for name, value in DECLARATION.findall(block[2]):
            if name.startswith(prefix):
                declarations[name.removeprefix(prefix)] = value.strip()

    return {selector: values for selector, values in blocks.items() if values}


def pick(blocks: Blocks, test: Callable[[str], bool]) -> dict[str, str]:
    result: dict[str, str] = {}

    for selector, declarations in blocks.items():
        if test(selector):
            result |= declarations

    return result


def theme(name: str) -> Callable[[str], bool]:
    pattern = re.compile(rf"""\[data-theme=["']?{name}["']?\]""")
    return lambda selector: pattern.search(selector) is not None


def write_token_manifest(css: str, json_path: Path, prefix: str, is_silent: bool = False) -> bool:
    try:
        package = json.loads(PACKAGE_JSON.read_text(encoding="utf-8"))
        blocks = parse(css, prefix)

        dark = pick(blocks, theme("dark"))
        light = pick(blocks, theme("light"))
        token = {
            name: value
            for name, value in pick(blocks, lambda selector: selector == ":root").items()
            if name not in dark
        }

        manifest: Manifest = {
            "version": package["version"],
            "prefix": prefix,
            "theme": {"dark": dark, "light": light},
            "token": token,
            "themeColor": {"dark": dark.get("bg", ""), "light": light.get("bg", "")},
            "breakpoint": {
                name.removeprefix("breakpoint-"): int(re.match(r"\d+", value)[0])
                for name, value in token.items()
                if name.startswith("breakpoint-")
            },
        }

        json_path.write_text(f"{json.dumps(manifest, indent=2)}\n", encoding="utf-8")
        log(f"Wrote {json_path}", is_silent)

        return True
    except (OSError, KeyError, TypeError, ValueError) as error:
        log(f"Error while writing {json_path}: {error}", is_silent, is_error=True)

        return False
