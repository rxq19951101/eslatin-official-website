#!/usr/bin/env python3
"""Create web-ready EsLatin logo assets from the dark Illustrator/PDF master."""

from __future__ import annotations

import argparse
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


def remove_black_background(image: Image.Image) -> Image.Image:
    rgb = np.asarray(image.convert("RGB"), dtype=np.float32) / 255
    alpha = rgb.max(axis=2)
    alpha = np.clip((alpha - 0.003) / 0.997, 0, 1)
    divisor = np.maximum(alpha[..., None], 1 / 255)
    color = np.clip(rgb / divisor, 0, 1)
    rgba = np.dstack((color, alpha))
    return Image.fromarray(np.round(rgba * 255).astype(np.uint8))


def tighten_alpha(image: Image.Image, cutoff: int) -> Image.Image:
    result = image.copy()
    alpha = np.asarray(result.getchannel("A"), dtype=np.float32)
    alpha = np.clip((alpha - cutoff) * 255 / (255 - cutoff), 0, 255)
    result.putalpha(Image.fromarray(np.round(alpha).astype(np.uint8)))
    return result


def visible_crop(image: Image.Image, threshold: int = 4, padding: int = 18) -> Image.Image:
    alpha = np.asarray(image.getchannel("A"))
    ys, xs = np.where(alpha > threshold)
    if not len(xs):
        raise ValueError("No visible artwork found in source image.")
    left = max(0, int(xs.min()) - padding)
    top = max(0, int(ys.min()) - padding)
    right = min(image.width, int(xs.max()) + padding + 1)
    bottom = min(image.height, int(ys.max()) + padding + 1)
    return image.crop((left, top, right, bottom))


def fit_height(image: Image.Image, height: int) -> Image.Image:
    width = round(image.width * height / image.height)
    return image.resize((width, height), Image.Resampling.LANCZOS)


def build_assets(source: Path, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="eslatin-logo-") as temp_dir:
        rendered = Path(temp_dir) / "master"
        subprocess.run(
            [
                "pdftoppm",
                "-f",
                "1",
                "-singlefile",
                "-png",
                "-r",
                "600",
                str(source),
                str(rendered),
            ],
            check=True,
        )
        transparent = remove_black_background(Image.open(rendered.with_suffix(".png")))

    split_y = round(transparent.height * 0.67)
    mark = visible_crop(tighten_alpha(transparent.crop((0, 0, transparent.width, split_y)), 42))
    wordmark = visible_crop(tighten_alpha(transparent.crop((0, split_y, transparent.width, transparent.height)), 72))
    stacked = visible_crop(transparent)

    mark_large = fit_height(mark, 286)
    wordmark_large = fit_height(wordmark, 104)
    gap = 42
    horizontal = Image.new(
        "RGBA",
        (mark_large.width + gap + wordmark_large.width + 40, 326),
        (0, 0, 0, 0),
    )
    horizontal.alpha_composite(mark_large, (20, (horizontal.height - mark_large.height) // 2))
    horizontal.alpha_composite(
        wordmark_large,
        (20 + mark_large.width + gap, (horizontal.height - wordmark_large.height) // 2),
    )

    mark_icon = fit_height(mark, 430)
    icon = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    icon.alpha_composite(mark_icon, ((512 - mark_icon.width) // 2, (512 - mark_icon.height) // 2))

    app_icon = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(app_icon)
    draw.rounded_rectangle((8, 8, 504, 504), radius=116, fill=(2, 6, 23, 255))
    app_mark = fit_height(mark, 372)
    app_icon.alpha_composite(app_mark, ((512 - app_mark.width) // 2, (512 - app_mark.height) // 2))

    stacked_large = fit_height(stacked, 1200)
    horizontal.save(output_dir / "eslatin-logo-horizontal.png", optimize=True)
    icon.save(output_dir / "eslatin-mark.png", optimize=True)
    app_icon.save(output_dir / "eslatin-app-icon.png", optimize=True)
    stacked_large.save(output_dir / "eslatin-logo-stacked.png", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    build_assets(args.source, args.output_dir)


if __name__ == "__main__":
    main()
