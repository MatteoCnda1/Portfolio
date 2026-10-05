# Directives agents — Portfolio

Règles de collaboration pour les agents (Claude / Gemini) sur le portfolio **Portfolio** (site Astro / TypeScript).

---

## 📍 0. Contexte vivant (lire en premier)

L'état **dynamique** du projet (focus, en cours, décisions) est maintenu dans
**[`.ai/STATE.md`](.ai/STATE.md)** pour éviter de le re-dériver — et donc de rebrûler des %
de session — à chaque conversation. Il est importé ici :

@.ai/STATE.md

Convention complète dans [`.ai/README.md`](.ai/README.md). En fin de session, rafraîchir
l'état : `bash .ai/ctx.sh` (ou la commande `/handoff` sous Claude Code).

---

## 🧱 Stack
- Front : **Astro** + **TypeScript** (`astro.config.mjs`, `src/`).
- Build : `npm run build` (sortie `dist/`).
- Déploiement : `Dockerfile` + `nginx.conf` (`docker-compose.yml`).

<!-- Ajoute ici les règles statiques du projet (workflow git, conventions, contraintes). -->
