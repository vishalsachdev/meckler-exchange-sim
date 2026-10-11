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
