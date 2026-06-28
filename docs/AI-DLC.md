# AI-DLC 2026 – Arbeitsweise für Bibelmap

**Was:** AI-DLC (*AI-Driven Development Lifecycle*) ist eine Methodik für die
gemeinsame Entwicklung von Mensch und KI. Sie strukturiert Arbeit in vier Phasen
und nutzt „Hüte" (hats) als Rollen innerhalb dieser Phasen.
**Status:** Methodik-Dokumentation · noch kein Tooling im Repo eingerichtet.
**Quelle:** [TheBushidoCollective/ai-dlc](https://github.com/TheBushidoCollective/ai-dlc)

> An interactive map of the Bible deserves a calm, deliberate way of building it.
> This document explains the AI-DLC methodology and how the Bibelmap project would
> use it – it is documentation only, no tooling is installed yet.

---

## 1. Grundidee

KI-Assistenten arbeiten mit einem begrenzten Kontextfenster. AI-DLC behandelt
**Kontext-Resets als Feature, nicht als Fehler**: Absicht und Fortschritt leben
in **committeten Dateien** (überleben jeden Reset), während Sitzungszustand
**flüchtig** ist und jederzeit verworfen werden darf.

Drei Leitprinzipien:

1. **Kontext-Resets einplanen** – jede Iteration ist so geschnitten, dass sie
   ohne Vorwissen aus den committeten Artefakten fortgesetzt werden kann.
2. **Quality Gates als Gegendruck** – Tests, Linting, Typecheck und Build sind
   keine Checkliste am Ende, sondern bremsen die Arbeit laufend ein.
3. **Absicht und Fortschritt versioniert halten** – `intent.md` und
   `unit-*.md` sind die Quelle der Wahrheit, nicht der Chatverlauf.

---

## 2. Begriffe

| Begriff | Bedeutung |
|---|---|
| **Intent** | Übergeordnetes Ziel, z. B. „Mobile-Layout für den Präsentationsmodus". |
| **Unit** | Abgegrenztes Arbeitspaket innerhalb eines Intents. |
| **Bolt** | Eine Iteration, begrenzt durch einen Kontext-Reset. |
| **Hat** | Rolle/Verantwortung für eine Phase (Planner, Builder, Reviewer …). |

---

## 3. Die vier Phasen

| Phase | Zweck | Bei Bibelmap konkret |
|---|---|---|
| **Elaboration** | Intent, Units und Erfolgskriterien gemeinsam festlegen. | Roadmap-Punkt aus `docs/PRD.md` in einen Intent mit Units übersetzen. |
| **Execution** | Autonome Schleife durch die Hüte der gewählten Workflow. | Komponente bauen, `npm run build` als Gate, Review. |
| **Operation** | Operative Aufgaben ausführen. | GitHub-Pages-Deploy (`.github/workflows/deploy.yml`), Daten-Rebuild (`npm run data` / `npm run text`). |
| **Reflection** | Abgeschlossenen Zyklus auswerten und Erkenntnisse sichern. | Was lief gut/schlecht, Anpassungen an Workflow oder Hüten. |

---

## 4. Hut-basierte Workflows

Ein **Workflow** ist eine benannte Abfolge von Hüten. Die mitgelieferten:

| Workflow | Hüte |
|---|---|
| **Default** | Planner → Builder → Reviewer |
| **Adversarial** | Planner → Builder → Red Team → Blue Team → Reviewer |
| **Design** | Planner → Designer → Reviewer |
| **TDD** | Test Writer → Implementer → Refactorer → Reviewer |
| **Hypothesis** | Observer → Hypothesizer → Experimenter → Analyst |

Jeder Hut folgt einem festen Aufbau: Überblick, Parameter, Voraussetzungen,
Schritte (nach RFC 2119: MUST/SHOULD/MAY), Erfolgskriterien und Fehlerbehandlung.

**Empfehlung für Bibelmap:** Für UI-/Karten-Features eignet sich der
**Design-Workflow** (das Look-&-Feel-Ziel aus dem PRD ist explizit), für
Datenpipeline-Änderungen (`scripts/build-data.mjs`, `scripts/build-text.mjs`)
der **Default-Workflow** mit strengem Build-Gate.

---

## 5. Repository-Struktur (wenn eingerichtet)

AI-DLC legt ein `.ai-dlc/`-Verzeichnis an. **Noch nicht in diesem Repo vorhanden**
– so würde es aussehen:

```
.ai-dlc/
  workflows.yml                  # eigene Workflow-Definitionen
  {intent-slug}/
    intent.md                    # Ziel + Abschlusskriterien
    unit-01-{slug}.md            # Arbeitspakete
    unit-02-{slug}.md
    discovery.md                 # Domänen-Notizen aus der Elaboration
    hats/
      {custom-hat}.md            # projektspezifische Hut-Overrides
    state/                       # FLÜCHTIG – nicht committen
      iteration.json             # aktueller Hut, Iterationszähler, Status
      scratchpad.md              # Fortschrittsnotizen
      blockers.md                # dokumentierte Hindernisse
```

**Committet** werden `intent.md`, die `unit-*.md`, `discovery.md` und `hats/`.
**Flüchtig** (per `.gitignore` ausschließen) ist alles unter `state/`.

### Frontmatter

`intent.md`: `workflow`, `git.change_strategy` (Branch pro Unit oder pro Intent),
`git.auto_merge`, `git.auto_squash`, `announcements`, `status`
(active/completed/blocked/abandoned), `epic`.

`unit-NN-*.md`: `status`, `depends_on` (DAG-Abhängigkeiten), `branch`,
`discipline` (backend/frontend/documentation …), `workflow`, `ticket`.

### Branch-Namen

```
ai-dlc/{intent-slug}/{unit-number}-{unit-slug}
```
Beispiel: `ai-dlc/mobile-presentation/01-responsive-split-view`

---

## 6. Befehle

| Befehl | Zweck |
|---|---|
| `/ai-dlc:setup` | Methodik fürs Projekt konfigurieren. |
| `/ai-dlc:elaborate` | Intent, Units und Kriterien definieren. |
| `/ai-dlc:execute` | Autonome Ausführungsschleife. |
| `/ai-dlc:operate` | Operative Aufgaben verwalten. |
| `/ai-dlc:reflect` | Abgeschlossenen Zyklus auswerten. |
| `/ai-dlc:refine` | Spezifikation während der Ausführung anpassen. |
| `/ai-dlc:resume` | Verlorenen flüchtigen Zustand wiederherstellen. |
| `/ai-dlc:reset` | Flüchtigen Zustand löschen. |
| `/ai-dlc:cleanup` | Verwaiste git-worktrees entfernen. |

---

## 7. Einrichtung in diesem Repo (noch offen)

Wenn das Team AI-DLC aktiv nutzen will:

1. **Plugin installieren** (Claude Code):
   ```bash
   /plugin marketplace add thebushidocollective/ai-dlc
   /plugin install ai-dlc@thebushidocollective-ai-dlc --scope project
   ```
2. **Voraussetzungen:** `jq` (v1.7+) und `yq` (mikefarah/Go v4+).
3. **`/ai-dlc:setup`** ausführen, um `.ai-dlc/` und `workflows.yml` anzulegen.
4. **`state/` ignorieren** – in `.gitignore` ergänzen:
   ```
   .ai-dlc/**/state/
   ```
5. **Ersten Intent** aus der Roadmap in `docs/PRD.md` ableiten.

---

## 8. Wie das zu Bibelmap passt

Bibelmap bringt bereits die nötige Infrastruktur mit, die AI-DLC als Quality
Gates und Operationen voraussetzt:

- **Quality Gate:** `npm run build` (`tsc --noEmit && vite build`) – Typecheck +
  Production-Build als Gegendruck in der Execution-Phase.
- **Operation:** GitHub-Pages-Deploy über `.github/workflows/deploy.yml`,
  Daten-Builds über `npm run data` und `npm run text`.
- **Elaboration-Quelle:** `docs/PRD.md` mit Vision, Personas, Akzeptanzkriterien
  und offener Roadmap (v0.2–v1.0) – ideale Vorlage für erste Intents und Units.

Damit lässt sich die Roadmap des PRD schrittweise als AI-DLC-Intents abarbeiten,
sobald das Tooling eingerichtet ist.
