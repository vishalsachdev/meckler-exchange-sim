# Six-Stage Exchange Simulator

Interactive simulation of Mark R. Meckler's six-stage dynamic symmetrical exchange model
("Optimizing Emotional, Technical and Transaction Cost Utility: Innovation Strategy for
Economizing Firms", JPIM Research Forum 2026, paper 27).

- Live demo: https://vishalsachdev.github.io/meckler-exchange-sim/
- Built by Vishal Sachdev (University of Illinois). The paper itself is not in this repo.

## Versions

- v1–v3 (2026-10-10): one-sided model; evaluator types; firms learn buyer weights.
  Kept at `v3/index.html` for comparison.
- v4 (2026-10-11): built from Mark's 2026-10-11 email. Two-sided exchange with a Stage 4–6
  negotiation loop; deal-breaker floors that rise on both sides; installed base and complements
  shared by all firms, with attention to them varying by firm; every stage-interface variable
  in the paper exposed as a control.

## Run headless

    node tools/run.mjs '{"rule":"human"}'

prints the 200-market summary table for any settings object (keys = control ids in `index.html`).

## Configurable experiments (2026-10-11)

The stage controls, collapsed **Advanced** assumptions and **Firms** overrides expose 144
numeric settings, each with a role and help text. Firm overrides inherit shared attention
settings at −1 and the default TC multiplier at 0. Learning can be switched off per firm.
Installed base and complements remain shared across the four firms.

Settings update the URL automatically. **Copy settings link**, **Export JSON** and **Import JSON**
share non-default settings without downloading files. Import replaces the current settings;
omitted keys return to defaults. Invalid imports leave the current settings intact.

**Sweep** runs 5–11 points on demand and compares survival, final bank, formalized share or
wasted-spend share. Each point uses the same fixed-seed markets. The summary market count
(default 200, range 50–1000) also sets the sweep sample size.

    node tools/run.mjs '{"rule":"persona","markets":50,"techLearns":0}'
    node tools/check.mjs

The checks cover finite results, the persona survival comparison, exact reset, settings
round-trips, every numeric control at both endpoints, disabled learning and stakeholder
resource conservation. Numeric defaults illustrate the paper's architecture; they are
not estimated parameters or empirical evidence for the theory.
