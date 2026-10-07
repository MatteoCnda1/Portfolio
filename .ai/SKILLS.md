# 🧰 Skills à utiliser — Portfolio

> Quelle skill lancer selon la tâche. Fiche **statique** du kit `.ai/` (auto-chargée via `AGENTS.md`).
> Gemini/Antigravity : pas de `/commande`, mais lire le `SKILL.md` indiqué et appliquer la méthode.

## Communes à tous les repos
| Quand | Skill | Où |
|---|---|---|
| Avant une feature / un plan non trivial : se faire cuisiner sur le design | `grill-me` | `.claude/skills/grill-me/` (embarquée) |
| Fin de session : rafraîchir le contexte vivant | `/handoff` | `.claude/commands/handoff.md` |
| Avant d'ouvrir une PR : chasser les bugs du diff | `/code-review` | intégrée Claude Code |
| Changement touchant auth, sessions, paiement, entrées utilisateur | `/security-review` | intégrée Claude Code |
| Nettoyer le code fraîchement écrit (sans changer le comportement) | `/simplify` | intégrée Claude Code |
| Vérifier un changement dans l'app réelle (pas seulement les tests) | `/run` | intégrée Claude Code |

## Spécifiques à ce projet
| Quand | Skill |
|---|---|
| Nouvelle UI / refonte (Astro, palette douce) | `frontend-design:frontend-design`, `ui-ux-pro-max:ui-ux-pro-max` |
| Perf / Core Web Vitals | `cloudflare:web-perf` |
| Vidéo de lancement / partage du portfolio | `brag:brag-slim` |

Besoin d'une skill absente ? `find-skills`. En ajouter une au repo : la copier dans `.claude/skills/<nom>/` et l'inscrire ici.
