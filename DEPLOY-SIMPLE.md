# 🚀 Déploiement GitHub Pages - Version Simplifiée

## ✅ Configuration Actuelle

Tous les fichiers sont maintenant à la **racine** du projet:
```
/
├── index.html          ← Page principale (plus de redirection!)
├── 404.html           ← Page d'erreur
├── favicon.ico
├── robots.txt
├── .nojekyll          ← Important pour GitHub Pages
└── assets/
    ├── index-*.js     ← Application React
    ├── index-*.css    ← Styles
    └── *.jpg          ← Images
```

---

## 🎯 Déployer sur GitHub

### Étape 1: Commit les fichiers
```bash
git add -A
git commit -m "Deploy: all files at root, no redirect"
```

### Étape 2: Push vers GitHub
```bash
git push origin main
```

### Étape 3: Configurer GitHub Pages
1. Va sur GitHub → Ton repo → **Settings**
2. Clique sur **Pages** (menu gauche)
3. Configure:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Clique **Save**

### Étape 4: Attendre le déploiement
- GitHub va builder le site (1-2 minutes)
- Tu verras un lien vert: `✓ Your site is live at https://...`

---

## 🔄 Rebuilder après des changements

Si tu modifies le code source (`src/`), rebuild pour GitHub:

```bash
./build-for-github.sh
git add -A
git commit -m "Update build"
git push origin main
```

---

## 🌐 URLs

- **Local**: http://localhost:8080
- **GitHub Pages**: `https://notebuddy-web.github.io/INNLUXE/`

**⚠️ IMPORTANT:** Le `base` dans `vite.config.ts` doit correspondre au nom de ton repo!
- Nom du repo: `INNLUXE`
- Config: `base: '/INNLUXE/'` ✅

---

## ✅ Avantages de cette structure

✓ **Pas de redirection** - Le site s'ouvre directement  
✓ **Pas de sous-dossier** - Tout à la racine  
✓ **Plus simple** - Un seul `index.html`  
✓ **Plus rapide** - Moins de fichiers à gérer  

---

## 🐛 Si quelque chose ne marche pas

### Le site est blanc sur GitHub Pages?
1. Vérifie que `.nojekyll` existe à la racine
2. Vérifie que `index.html` contient bien `<script src="/assets/index-*.js">`
3. Hard refresh: `Cmd+Shift+R` (Mac) ou `Ctrl+Shift+R` (Windows)

### Les assets ne chargent pas?
1. Vérifie que le dossier `assets/` est bien commité
2. Vérifie que `vite.config.ts` a `base: '/'`

---

**C'est tout! 🎉**

