# Mettre en ligne le livret digital d'un client

Quand quelqu'un commande depuis la page « Créer son livret digital », l'e-mail reçu contient un champ `donnees_livret`.

1. Copiez ce texte (il commence par `{` et finit par `}`) dans un fichier `client.json`.
2. Relisez-le et corrigez les fautes si besoin.
3. Lancez : `pip install qrcode pillow` (une seule fois), puis `python3 tools/client_book.py client.json`
4. Le script crée `l/<nom-xxxx>/index.html` (le livret, sans filigrane) et `l/<nom-xxxx>/qr-code.png` (à imprimer).
5. `git add l && git commit -m "Livret client" && git push`
6. Envoyez au client le lien affiché, le fichier `qr-code.png` et le lien de paiement.

Les livrets clients ne sont pas indexés par Google (balise noindex).
