---
name: store-submit
description: 'Publier une app mobile sur les stores : numéroter les versions, construire via EAS, envoyer un binaire, et surtout constituer correctement une soumission App Store Connect (app + achats intégrés dans un même envoi). Use when submitting or resubmitting an app to the App Store or Google Play, when an App Store Connect submission is stuck ("Impossible de soumettre pour vérification", "une erreur inattendue s''est produite", submission showing 1 item instead of 2), when an in-app purchase cannot be added to a submission, when Apple rejects under 2.1(b) for in-app purchases not submitted for review, or when Play Console refuses an AAB signature.'
---

# Soumettre une app aux stores

Ce skill couvre la **phase de publication** : numérotation, build EAS, envoi, et constitution
d'une soumission. Pour diagnostiquer un achat qui **échoue à l'exécution** (produit introuvable,
prix de secours affiché), voir le skill `iap-troubleshooting` — c'est un autre problème.

L'essentiel de ce qui suit vient de sept rejets Apple consécutifs sur un même projet. Plusieurs
d'entre eux n'avaient **aucune cause technique** : uniquement une soumission mal constituée.

## Le contrôle qui prime sur tous les autres : compter les éléments

Avant chaque envoi, et après. Une soumission App Store Connect est un panier :

- **1 élément** = l'app seule. Si l'app référence un pack payant, c'est un rejet 2.1(b) certain :
  *« the app includes references to X but the associated In-App Purchase products have not been
  submitted for review »*.
- **2 éléments** = l'app + l'achat intégré. C'est ce qu'il faut.

Se vérifie sur **Vérification de l'app → Soumission iOS**, et dans l'email d'accusé de réception
d'Apple : *« Number of items submitted: N »*.

## Mécanique de soumission App Store Connect (achats intégrés)

Cette section vient de trois allers-retours perdus sur la seule mécanique de l'interface,
alors que le code et la configuration étaient corrects. Elle décrit le modèle réel d'ASC.

### Le modèle : une soumission, plusieurs éléments, chacun ajouté depuis sa propre fiche

Une soumission est un panier. Chaque élément (version d'app, achat intégré) s'y ajoute
**depuis sa propre page**, via son bouton « Ajouter pour vérification » / *Add for Review* :

- version d'app → page **App iOS → 1.2.x**, bouton en haut à droite
- achat intégré → **Monétisation → Achats intégrés → le produit**, bouton en haut à droite

La section « Achats intégrés » de la page de version **ne sert plus à rien** : elle n'affiche
qu'un bandeau d'information. Y chercher un « + » pour rattacher un produit est une impasse.

### L'ordre qui fonctionne : l'achat intégré d'abord, la version ensuite

Une soumission ne part que si elle contient une version d'app. Mais la fusion des deux
éléments ne s'offre que dans un seul sens.

**Séquence qui fonctionne :**

1. **Fiche du produit** → « Ajouter pour vérification » → crée un brouillon ne contenant que
   l'achat intégré. Le panneau affiche alors :

   > Impossible de soumettre pour vérification — Pour soumettre vos éléments pour
   > vérification, ajoutez une version de l'app pour la plateforme sélectionnée.

   **C'est normal, ce n'est pas une impasse.** Fermer le panneau, le brouillon est conservé.

2. **Page de version** → « Ajouter pour vérification » → ASC propose alors d'ajouter la
   version **au brouillon existant du pack**. Accepter.

3. Vérifier « Éléments prêts à être envoyés (**2**) », puis **Envoyer pour vérification**.

Le piège : cet avertissement ressemble à un blocage définitif et donne envie de tout reprendre
dans l'autre sens. Or en commençant par la version, ASC lui crée sa propre soumission et ne
propose jamais de rejoindre celle du pack — on accumule alors des brouillons orphelins à un
élément, sans moyen de les fusionner.

### Un élément n'appartient qu'à une seule soumission

Tant qu'un élément est rattaché à un brouillon, il est indisponible ailleurs — et ASC ne le
dit pas : il propose simplement « Créer une soumission » sans jamais offrir l'existante.
Sa fiche affiche alors :

> Cet élément a été ajouté pour vérification, mais vous pouvez toujours **le retirer**.

Cliquer « le retirer » le libère. Enchaîner des « Ajouter pour vérification » sans retirer
d'abord fabrique une collection de brouillons orphelins à un élément.

### Compter les éléments, avant ET après

Le seul contrôle fiable : le compteur de la soumission.

- **1 élément** = l'app seule → rejet 2.1(b) garanti si l'app mentionne un pack payant
  (*« the app includes references to X but the associated In-App Purchase products have
  not been submitted for review »*)
- **2 éléments** = l'app + l'achat intégré → correct

Vérifier sur la page **Vérification de l'app → Soumission iOS** après envoi, et dans l'email
d'accusé de réception d'Apple (*« Number of items submitted: N »*).

### Le premier achat intégré exige réellement un nouveau binaire

> *« The first consumable, non-consumable, auto-renewable subscription, and non-renewing
> subscription In-App Purchase of each type must be submitted with a new app version. »*
> — [doc Apple](https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase)

Ce n'est pas la formule générique « upload a new binary » des rejets : c'est une contrainte
documentée. Prévoir un bump de version + build avant de soumettre un premier produit d'un type
donné. Une fois le premier approuvé, les suivants passent sans nouveau binaire.

### Un achat intégré ne se supprime jamais

Apple n'expose aucun bouton de suppression, même pour un brouillon jamais approuvé — ni dans
la liste (le bouton « Modifier » n'offre que « Ajouter pour vérification »), ni sur la fiche.

Quand un rejet demande *« remove them from App Store Connect »* pour un produit retiré du
binaire, le maximum atteignable est :

1. **Disponibilité → Retirer de la vente**
2. **Renommer le « Nom de référence »** en quelque chose de neutre
3. **Vider les « Remarques destinées à l'équipe de vérification »**
4. Ne plus jamais l'inclure dans une soumission

Les points 2 et 3 ne sont pas cosmétiques : le nom de référence et les remarques sont des
**métadonnées lues par le reviewer**. Un produit mort nommé « Pack Coupe du Monde 2026 » avec
la note « 700 questions about Football 2026 season » alimente un rejet 5.2.1 pour propriété
intellectuelle alors que le pack n'est plus dans l'app depuis des versions.

### Capture de vérification : métadonnée obligatoire

Section « Informations destinées à l'équipe de vérification » de la fiche produit. Sans elle,
le produit reste en « Finaliser avant soumission » et **ne peut pas être soumis** :

> *« you must provide an App Review screenshot in App Store Connect in order to submit
> In-App Purchases for review »*

N'importe quelle image ≥ 640×920 montrant le produit dans la boutique in-app convient — elle
n'est pas publiée. Sans appareil Apple, une capture prise sur la version Android fait l'affaire.

### « Une erreur inattendue s'est produite lors de l'envoi pour vérification »

Message générique d'ASC, à ne pas confondre avec ses messages précis (ex. Game Center).
Cause observée : la soumission contenait un achat intégré **absent du binaire**. Vérifier la
page Soumission — si un produit supprimé de l'app y figure encore, le retirer de la soumission
débloque l'envoi. Écarter d'abord les fausses pistes : build en cours de traitement (vérifiable
dans TestFlight — statut « Terminé » = traitement fini) et session ASC expirée.

## Numérotation des versions

- **`cli.appVersionSource: "local"`** dans `eas.json`. Sans ce réglage, la numérotation distante
  d'EAS diverge de `app.json` et App Store Connect affiche des couples version/build incohérents,
  ce qui rend les emails de rejet ininterprétables.
- En **bare workflow**, `app.json` ne suffit pas : `android/app/build.gradle` porte ses propres
  `versionCode` / `versionName` et ne sera pas synchronisé par Expo. Bumper **les deux** :

  ```bash
  sed -i 's/"version": "1.2.22"/"version": "1.2.23"/; s/"buildNumber": "22"/"buildNumber": "23"/; s/"versionCode": 22/"versionCode": 23/' app.json
  sed -i 's/versionCode 22/versionCode 23/; s/versionName "1.2.22"/versionName "1.2.23"/' android/app/build.gradle
  ```

## Build et envoi via EAS

```bash
npx eas-cli build  --platform ios --profile production --non-interactive
npx eas-cli submit --platform ios --profile production --non-interactive --latest
```

- Après l'envoi, Apple traite le binaire 5 à 15 min. **TestFlight fait foi** : statut « Terminé »
  = traitement fini. Un build en cours de traitement n'est pas sélectionnable dans une version.
- **`eas submit --platform android` exige un compte de service Google.** Sans lui, récupérer
  l'`.aab` depuis l'URL d'artefact et l'importer manuellement dans Play Console.
- **Signature Android refusée par Play Console** : comparer l'empreinte attendue avec le keystore
  local.

  ```bash
  keytool -list -v -keystore android/app/release.keystore -alias <alias>
  ```

  (`keytool` est fourni avec Android Studio : `<Android Studio>/jbr/bin/keytool.exe`.)
  Si elle correspond, forcer EAS à l'utiliser via `credentials.json` + `"credentialsSource": "local"`
  dans le profil de build. **Ajouter `credentials.json` au `.gitignore`** : il contient le mot de
  passe du keystore.

## Blocages App Store Connect qui empêchent toute soumission

- **Message précis, ex. « Vous devez ajouter la clé `com.apple.developer.game-center` dans Xcode »**
  → Game Center activé côté App Store Connect sans entitlement correspondant dans le binaire. Tant
  que ce message est là, aucune soumission ne peut être finalisée. Si la fonctionnalité n'est pas
  utilisée, la désactiver côté App Store Connect est plus rapide que de rebuilder.
- **Message générique « Une erreur inattendue s'est produite lors de l'envoi pour vérification »**
  → voir la section dédiée ci-dessus. Ne pas confondre avec les messages précis : leur imprécision
  est elle-même l'indice.

## Lire un rejet Apple

- Le texte des rejets **2.1(b)** est générique : il liste toujours agrément payant + StoreKit, même
  quand ce n'est pas la cause. Ne pas le lire comme un diagnostic — lire la ligne « Specifically, … »,
  c'est la seule qui porte l'information.
- *« upload a new binary »* est également générique. Sauf pour un **premier achat intégré d'un type
  donné**, où la contrainte est réelle et documentée (voir plus haut).
- Un rejet **5.2.1** (propriété intellectuelle) peut porter sur les **métadonnées seules** alors que
  le binaire est propre. Les métadonnées incluent : nom, sous-titre, description, texte promotionnel,
  mots-clés, notes de version, captures, **et le nom de référence + les remarques de vérification de
  chaque achat intégré** — y compris ceux retirés de la vente. Vérifier **chaque langue**.
- Des questions de culture générale sur un événement (« qui a gagné la Coupe du monde 1998 ? ») ne
  constituent pas une atteinte à l'IP. Ne pas amputer le contenu du jeu sur un rejet qui vise les
  métadonnées.

## Règles

1. Compter les éléments de la soumission avant et après envoi. C'est le contrôle le moins cher et le
   plus souvent omis.
2. Ajouter l'**achat intégré d'abord**, la version d'app ensuite. L'inverse fabrique des brouillons
   orphelins impossibles à fusionner.
3. Un élément n'appartient qu'à une soumission : le retirer avant de l'ajouter ailleurs.
4. Ne jamais promettre à l'utilisateur qu'un élément est parti en review sans avoir vu le compteur.
5. Avant d'incriminer le contenu de l'app sur un rejet, vérifier si le motif ne vise pas les seules
   métadonnées.
