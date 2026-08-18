from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFont
from qrcode.constants import ERROR_CORRECT_H


ROOT = Path(__file__).resolve().parents[1]
URL = "https://eslatin.com.co/survey/"
OUTPUT = ROOT / "public" / "brand" / "eslatin-survey-qr.png"
OUTPUT_ES = ROOT / "public" / "brand" / "eslatin-survey-qr-es.png"
MARK = ROOT / "public" / "brand" / "eslatin-mark.png"


qr = qrcode.QRCode(
    version=None,
    error_correction=ERROR_CORRECT_H,
    box_size=24,
    border=4,
)
qr.add_data(URL)
qr.make(fit=True)

image = qr.make_image(fill_color="#071426", back_color="#FFFFFF").convert("RGBA")
logo = Image.open(MARK).convert("RGBA")

logo_size = round(image.width * 0.17)
logo.thumbnail((logo_size, logo_size), Image.Resampling.LANCZOS)
padding = round(image.width * 0.018)
plate_size = max(logo.width, logo.height) + 2 * padding
plate_x = (image.width - plate_size) // 2
plate_y = (image.height - plate_size) // 2

plate = Image.new("RGBA", (plate_size, plate_size), (255, 255, 255, 255))
mask = Image.new("L", (plate_size, plate_size), 0)
ImageDraw.Draw(mask).rounded_rectangle(
    (0, 0, plate_size - 1, plate_size - 1),
    radius=round(plate_size * 0.2),
    fill=255,
)
image.paste(plate, (plate_x, plate_y), mask)
image.alpha_composite(
    logo,
    ((image.width - logo.width) // 2, (image.height - logo.height) // 2),
)

header_height = 168
canvas = Image.new("RGB", (image.width, image.height + header_height), "#FFFFFF")
draw = ImageDraw.Draw(canvas)
font = ImageFont.truetype("/System/Library/Fonts/STHeiti Light.ttc", 48)
title = "扫码预约 EsLatin 上门勘察充电桩安装"
text_box = draw.textbbox((0, 0), title, font=font)
text_width = text_box[2] - text_box[0]
draw.text(
    ((canvas.width - text_width) // 2, 44),
    title,
    font=font,
    fill="#071426",
)
accent_width = 112
accent_x = (canvas.width - accent_width) // 2
draw.rounded_rectangle(
    (accent_x, 115, accent_x + accent_width, 123),
    radius=4,
    fill="#10B981",
)
canvas.paste(image.convert("RGB"), (0, header_height))
canvas.save(OUTPUT, quality=100, dpi=(300, 300))
print(OUTPUT)

spanish_header_height = 210
spanish_canvas = Image.new(
    "RGB",
    (image.width, image.height + spanish_header_height),
    "#FFFFFF",
)
spanish_draw = ImageDraw.Draw(spanish_canvas)
spanish_font = ImageFont.truetype("/Library/Fonts/Arial Unicode.ttf", 42)
spanish_lines = (
    "Escanee para agendar una visita técnica",
    "para la instalación de su cargador",
)
for index, line in enumerate(spanish_lines):
    line_box = spanish_draw.textbbox((0, 0), line, font=spanish_font)
    line_width = line_box[2] - line_box[0]
    spanish_draw.text(
        ((spanish_canvas.width - line_width) // 2, 30 + index * 54),
        line,
        font=spanish_font,
        fill="#071426",
    )
spanish_draw.rounded_rectangle(
    (accent_x, 153, accent_x + accent_width, 161),
    radius=4,
    fill="#10B981",
)
spanish_canvas.paste(image.convert("RGB"), (0, spanish_header_height))
spanish_canvas.save(OUTPUT_ES, quality=100, dpi=(300, 300))
print(OUTPUT_ES)
