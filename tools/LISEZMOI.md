# Mettre en ligne le livret digital d'un client (sans rien installer)

Quand un client commande depuis la page « Créer son livret digital », tu reçois un e-mail avec 4 étapes :

1. **etape_1_creer_le_fichier** : clique sur le lien. GitHub s'ouvre avec le nom du fichier déjà rempli (`l/data/nom-xxxx.json`).
2. **etape_2_coller_ce_contenu** : copie tout ce bloc (de `{` à `}`), colle-le dans GitHub, corrige les fautes si besoin, puis clique sur « Commit changes ».
3. **etape_3_lien_du_livret** : après 1 minute, le livret est en ligne à ce lien. Envoie-le au client.
4. **etape_4_qr_code** : ouvre ce lien, clique sur « Télécharger le PNG » et envoie le QR code au client (ou imprime-le).

## Modifier un livret plus tard (abonnement annuel)
Dans GitHub, ouvre `l/data/nom-xxxx.json`, clique sur le crayon, change le texte (code Wi-Fi, adresses…), puis « Commit changes ». Le lien et le QR code ne changent pas.

## Arrêter un livret
Supprime le fichier `l/data/nom-xxxx.json` : le lien affiche alors « pas encore en ligne ».

Les livrets clients ne sont pas indexés par Google (balise noindex). Attention : le dépôt est public, donc toute personne qui connaît le nom du fichier peut lire son contenu (comme le livret lui-même).

Variante en ligne de commande : `python3 tools/client_book.py client.json` (nécessite `pip install qrcode pillow`).
