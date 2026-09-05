---
name: iap-troubleshooting
description: 'Diagnostiquer un achat intégré qui échoue (RevenueCat, StoreKit, Play Billing) sur React Native / Expo. Use when an in-app purchase fails, when the store returns "product not found" / "produit introuvable dans les offerings", when prices show a hardcoded fallback instead of the store price, or on an Apple rejection under Guideline 2.1(b) for in-app purchases. For constituting the store submission itself, see the `store-submit` skill.'
---

# Diagnostic d'un achat intégré qui échoue

Cette skill existe parce qu'un bug d'une seule ligne a coûté **5 rejets Apple consécutifs et plusieurs jours** de chasse dans les dashboards RevenueCat, App Store Connect et Google Play Console — alors que **toute la configuration était correcte depuis le début**. Suis cet ordre : il est conçu pour éliminer d'abord ce qui coûte le moins cher à vérifier.

## Règle d'or : d'où vient le message d'erreur ?

Avant toute chose, retrouve la chaîne exacte du message dans le code du projet (`grep`).

- **Le message vient du code de l'app** (message custom type "Produit X introuvable dans les offerings") → **c'est un bug de code**. Ne va PAS fouiller les dashboards. Va directement à « Pièges de code » ci-dessous.
- **Le message vient du SDK ou du store** ("There was a problem with the App Store", "Cannot connect to iTunes Store", code d'erreur RevenueCat) → alors seulement, suspecte la config ou l'environnement.

Se tromper sur ce point est la première cause de perte de temps.

## Les deux signaux qui tranchent immédiatement

**1. L'historique client RevenueCat est vide.**
Dashboard RevenueCat → Customers → ouvrir le client → History. Si on ne voit que « Last opened the app » / « First seen » et **aucune tentative d'achat**, alors `purchasePackage()` n'a jamais été appelé. Le bug est **en amont**, dans la résolution du package côté app. Les credentials, l'agrément Apple, le statut des produits ne peuvent PAS en être la cause — ils n'ont même pas encore été sollicités.

**2. Le prix affiché est le fallback codé en dur.**
Si l'UI montre le prix de secours du catalogue local au lieu du prix formaté par le store, c'est que la récupération des produits échoue **aussi**. Deux symptômes, une seule cause racine — et elle est dans le code de lecture des produits.

## Pièges de code (par ordre de fréquence)

### 1. Mauvais nom de champ pour l'identifiant produit ⚠️ LE piège

Dans **`react-native-purchases`** (SDK natif), le type `PurchasesStoreProduct` expose :

```ts
readonly identifier: string;   // ✅ "Product Id."
readonly priceString: string;
```

Il n'y a **pas** de champ `productIdentifier`. Ce nom-là n'existe que dans **`@revenuecat/purchases-js`** (le SDK **Web**) et dans les objets de transaction de `customerInfo`. Confondre les deux donne :

```ts
p.product.productIdentifier === sku   // undefined === "com.x.pack" → TOUJOURS false
```

→ aucun package n'est jamais trouvé, **sur iOS comme sur Android**, quelle que soit la qualité de la configuration. Le retry n'y change rien : le champ restera `undefined` indéfiniment.

**Issue confirmée** : après correction de ce seul champ, la mention 2.1(b) a disparu des rejets Apple suivants, alors qu'elle revenait sur cinq soumissions d'affilée. Le reviewer a pu acheter.

Vérifie toujours dans la source, jamais de mémoire :

```bash
awk '/export interface PurchasesStoreProduct \{/,/^\}/' \
  node_modules/@revenuecat/purchases-typescript-internal/dist/offerings.d.ts
```

Champs réels utiles : `identifier`, `priceString`, `price`, `title`, `description`.
Sur `PurchasesPackage` : `identifier`, `packageType`, `product`, `offeringIdentifier`.

### 2. Un cast `any` qui désactive toute vérification de types

Le pattern « wrapper natif + formes minimales maison » est courant pour permettre un mock web :

```ts
const rc = (x: unknown): any => x;          // ❌ TypeScript ne vérifie plus rien
getOfferings: () => rc(Purchases.getOfferings()),
```

Combiné à un type maison qui déclare un champ inexistant, **le code compile parfaitement en cherchant un champ qui n'existe pas**. C'est exactement ainsi que le piège n°1 survit à `tsc --noEmit`.

Règle : si tu redéfinis des « formes minimales » des objets du SDK pour découpler un mock, **vérifie chaque nom de champ contre les `.d.ts` réels du SDK**, et ajoute un commentaire dans le type rappelant le piège. Un type maison est une affirmation non vérifiée, pas une garantie.

### 3. Chercher un produit sans garde sur `.product`

```ts
(p) => p.product && p.product.identifier === sku    // ✅ garde nécessaire
```

Un package dont le produit n'a pas été résolu par le store fait planter le `.find()` sans garde.

### 4. Dépendance de facturation orpheline après migration

Après une migration `react-native-iap` → RevenueCat, une dépendance native peut rester dans `android/app/build.gradle` (ex. `io.github.hyochan.openiap:openiap-google`) alors que plus rien en JS ne l'utilise. Deux `BillingClient` dans le même process peuvent se gêner. À vérifier :

```bash
grep -iE "openiap|iap|billing" android/app/build.gradle
grep -iE "iap|purchase" package.json
```

## Comment observer le réel quand on n'a pas de debugger branché

Un build de production installé depuis un store n'expose pas les `console.log`. Plutôt que de deviner, **affiche le diagnostic dans le message d'erreur lui-même**, temporairement :

```ts
const dump = Object.values(offerings.all).map(o =>
  `[${o.identifier}] ` + o.availablePackages
    .map(p => `${p.identifier}→${p.product ? p.product.identifier : 'NO_PRODUCT'}`)
    .join(', ')
).join(' | ');
return { ok: false, error: `Introuvable.\n\nDEBUG: ${dump}` };
```

L'utilisateur envoie une capture d'écran, et on sait immédiatement si le problème est « le SDK ne renvoie rien » (→ config/store) ou « le SDK renvoie bien le produit mais le code ne le reconnaît pas » (→ bug de code).

**Retire ce dump avant toute soumission au store** : un message technique affiché à un reviewer est en soi un motif de rejet.

## Vérifications de configuration (seulement après avoir éliminé le code)

À faire dans cet ordre, en s'arrêtant au premier écart réel :

1. **Identifiants produits** identiques entre le code, RevenueCat, et le store. Attention aux artefacts d'affichage : un iPhone coupe une longue chaîne en fin de ligne et peut faire apparaître un tiret qui n'existe pas — vérifier dans le code, pas sur une capture.
2. **RevenueCat → Product catalog → Offerings** : chaque package contient bien une entrée produit **par plateforme** (une Apple, une Android).
3. **Entitlements** : les `lookup_key` correspondent exactement à ceux utilisés dans `customerInfo.entitlements.active[...]`.
4. **Clés API SDK** : une clé par plateforme (`appl_…` / `goog_…`). Une clé croisée renvoie un catalogue vide.
5. **Statut des produits** : « Actif » côté Play Console, métadonnées complètes côté App Store Connect.
6. **Apple — Business → Contrats** : contrat pour applications payantes, **comptes bancaires** et **formulaires fiscaux** doivent tous être « Actif ». Le contrat seul ne suffit pas.

## Spécifique Apple

- **« Ready to Submit » n'empêche pas un achat de fonctionner en sandbox.** Apple l'écrit explicitement dans ses rejets : *« In-App Purchase products do not need prior approval to function in review. »* Ne pas partir sur cette fausse piste.
- Le texte de rejet 2.1(b) est **générique** : il liste toujours agrément payant + StoreKit, même quand ce n'est pas la cause. Ne pas le lire comme un diagnostic.

## Soumettre l'achat intégré aux stores

Constituer la soumission (app + achat intégré dans un même envoi), numéroter les versions,
builder et envoyer via EAS, signer un AAB : tout cela est couvert par le skill **`store-submit`**.
S'y reporter dès qu'un produit ne peut pas être ajouté à une soumission, qu'App Store Connect
affiche « Impossible de soumettre pour vérification », ou qu'une soumission part avec un seul
élément.

Deux points à retenir ici, parce qu'ils se confondent avec un bug d'achat :

- Un rejet 2.1(b) *« the associated In-App Purchase products have not been submitted for review »*
  n'est **pas** un problème de code : le produit n'a simplement pas été mis dans la soumission.
- Le **premier achat intégré de chaque type** doit obligatoirement être soumis avec une **nouvelle
  version de l'app**. Contrainte documentée par Apple, pas une formule générique.

## Tester sans appareil Apple

Par ordre d'efficacité réelle :

1. **Lien public TestFlight** (App Store Connect → TestFlight → Testeurs externes → lien public) envoyé à un proche disposant d'un iPhone/iPad. C'est la voie la plus rapide et la plus fiable. Fournir des instructions pas-à-pas et demander **une capture de chaque écran**, y compris en cas de succès.
2. **Fermes d'appareils** (BrowserStack App Live, LambdaTest, AWS Device Farm). Attention : les essais gratuits limitent les sessions à ~2 minutes, insuffisant pour connexion Apple ID + 2FA + TestFlight + achat.

## Règles

1. Toujours identifier la source du message d'erreur avant d'ouvrir un dashboard.
2. Un historique client RevenueCat vide disqualifie toutes les hypothèses de configuration.
3. Vérifier les noms de champs du SDK dans les `.d.ts`, jamais de mémoire — y compris ceux suggérés par un assistant ou un exemple de documentation.
4. Ne jamais conclure « la config est en cause » sans avoir prouvé que le SDK renvoie bien les produits.
5. Un achat qui ne peut pas être *soumis* n'est pas un achat qui *échoue* : voir `store-submit`.
