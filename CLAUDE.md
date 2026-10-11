# CLAUDE.md

type: code (single-file vanilla JS simulator, no build step, no test runner)

Interactive simulation of Mark Meckler's (Univ. of Portland) six-stage economizing-exchange model, built from his JPIM RF 2026 paper 27 and his 2026-10-11 email. Collaborator file: `~/mykai-home/PEOPLE/mark-meckler.md`. Origin context: `~/research/jpim26` (Session Log 2026-10-11).

## Key facts
- Public: repo github.com/vishalsachdev/meckler-exchange-sim, demo on GitHub Pages (`.nojekyll`), old v3 kept at `/v3/`.
- `index.html` = the simulator. Controls live in the `CTL` array (id, group, label, role, min, max, step, default, ...); add a control there, not in markup.
- `llm.js` = LLM negotiation lab. Works only inside claude.ai (artifact `sample` capability); on GitHub Pages it shows a link to the artifact https://claude.ai/artifact/XGjZvvkpAaQAfEThYYV7fY.
- Artifact republish: `node tools/build-artifact.mjs` → `dist/artifact.html` (gitignored, inlines llm.js), publish to the artifact URL above; keep `capabilities: {sample:{}}`.
- Headless runs: `node tools/run.mjs '{"rule":"human"}'` (extracts code between `(function(){` and `// ---------- drawing`; keep those markers). Checks: `node tools/check.mjs`.
- Payment = value × `rate` (1.6). With rate 1.0 all firms go bankrupt (v4 bug).
- Shared installed base and complements are identical for all firms on purpose (Mark's spec); only attention and learning vary.
- Research notes: `docs/research/` (assumptions brief, Devin check, literature review). Sent email: `docs/communications/`.

## Session Log
### 2026-10-11
- Completed: v4 → v4.1 (144+ controls, sweep, settings sharing, per-firm overrides, LLM lab), reply sent to Mark.
- Next: Vishal tests the LLM lab in claude.ai; v5 roadmap (README) once Mark replies.
