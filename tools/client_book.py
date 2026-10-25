# -*- coding: utf-8 -*-
"""Variante en ligne de commande (facultative) de la mise en ligne d'un livret client.
python3 tools/client_book.py client.json  ->  l/data/<nom-xxxx>.json + QR code PNG, puis git add/commit/push.
La méthode sans installation est décrite dans tools/LISEZMOI.md.
"""
import sys, os, json, re, html, secrets, unicodedata
import qrcode
from PIL import Image, ImageDraw, ImageFont

DOMAIN = "https://thomem.github.io/gj-welcomebooks"
FONT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")


def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:40] or "livret"


def font(size, bold=False, display=False):
    """Polices du site (fournies dans tools/fonts), sinon police par défaut."""
    p = os.path.join(FONT_DIR, "CormorantGaramond.ttf" if display else "Karla.ttf")
    try:
        f = ImageFont.truetype(p, size)
        try:
            f.set_variation_by_axes([600 if display else (700 if bold else 400)])
        except Exception:
            pass
        return f
    except Exception:
        return ImageFont.load_default(size)


def qr_card(url, name, path, color="#173A5E"):
    """QR code prêt à imprimer (format carte 1200×1500)."""
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=1, box_size=24)
    q.add_data(url); q.make(fit=True)
    img = q.make_image(fill_color=color, back_color="white").convert("RGB").resize((820, 820), Image.NEAREST)
    card = Image.new("RGB", (1200, 1500), "#FBF7F0")
    d = ImageDraw.Draw(card)
    d.rounded_rectangle((150, 300, 1050, 1200), 40, fill="white", outline="#E4D7C2", width=4)
    card.paste(img, (190, 340))
    f1, f2, f3 = font(92, display=True), font(40, True), font(30)
    d.text((600, 150), name, fill=color, font=f1, anchor="mm")
    d.text((600, 235), "Livret d'accueil · Welcome book · Benvenuti", fill="#625D55", font=f3, anchor="mm")
    d.text((600, 1290), "Scannez avec l'appareil photo", fill=color, font=f2, anchor="mm")
    d.text((600, 1345), "Scan with your camera · Inquadra con la fotocamera", fill="#625D55", font=f3, anchor="mm")
    for i in range(0, 1200, 40):  # frise zigzag terre cuite / ocre
        d.polygon([(i, 1500), (i + 20, 1470), (i + 40, 1500)], fill="#C46F48" if (i // 40) % 2 else "#E2A62A")
    card.save(path)


def main():
    src = sys.argv[1]
    repo = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    d = json.load(open(src, encoding="utf-8"))
    slug = sys.argv[3] if len(sys.argv) > 3 else slugify(d.get("name", "")) + "-" + secrets.token_hex(2)
    os.makedirs(os.path.join(repo, "l", "data"), exist_ok=True)
    json.dump(d, open(os.path.join(repo, "l", "data", slug + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    url = f"{DOMAIN}/l/?c={slug}"
    png = os.path.join(repo, "l", "data", slug + "-qr.png")
    qr_card(url, d.get("name") or "Welcome", png)
    print("Livret :", url)
    print("QR code :", png)


if __name__ == "__main__":
    main()
