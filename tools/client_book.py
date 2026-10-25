# -*- coding: utf-8 -*-
"""Met en ligne le livret digital d'un client, sans filigrane, avec son QR code.

1. Copiez le champ « donnees_livret » de l'e-mail reçu dans un fichier, par ex. client.json
2. python3 tools/client_book.py client.json [chemin_du_depot]
   -> crée l/<nom-xxxx>/index.html et l/<nom-xxxx>/qr-code.png dans le dépôt
3. git add l && git commit -m "Livret client" && git push
4. Envoyez au client le lien affiché et le fichier qr-code.png
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
    slug = slugify(d.get("name", "")) + "-" + secrets.token_hex(2)
    out = os.path.join(repo, "l", slug); os.makedirs(out, exist_ok=True)
    url = f"{DOMAIN}/l/{slug}/"
    name = d.get("name") or "Welcome"
    lang = d.get("lang", "fr")
    data = json.dumps(d, ensure_ascii=False).replace("</", "<\\/")
    page = f"""<!doctype html>
<html lang="{html.escape(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(name)} · Welcome book</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#FBF7F0">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23173A5E'/%3E%3Ctext x='32' y='43' font-family='Georgia,serif' font-size='30' text-anchor='middle' fill='%23E2A62A' font-style='italic'%3EGJ%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Karla:wght@400;500;700&display=swap">
<link rel="stylesheet" href="../../assets/wb.css">
<style>html,body{{margin:0;height:100%;background:#E9E1D3}}#book{{max-width:480px;height:100vh;height:100dvh;margin:0 auto;box-shadow:0 0 40px rgba(0,0,0,.08)}}</style>
</head>
<body>
<div id="book" class="wb"></div>
<script src="../../assets/qrcode.js"></script>
<script src="../../assets/wb.js"></script>
<script>WB.render({data}, document.getElementById('book'), {{img: '../../img/'}});</script>
</body>
</html>
"""
    open(os.path.join(out, "index.html"), "w", encoding="utf-8").write(page)
    qr_card(url, name, os.path.join(out, "qr-code.png"))
    print("Livret :", url)
    print("QR code :", os.path.join(out, "qr-code.png"))


if __name__ == "__main__":
    main()
