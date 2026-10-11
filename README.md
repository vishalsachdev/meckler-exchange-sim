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

## Research behind the model (2026-10-11)

- `docs/research/assumptions-check.md` (Devin): evidence for seven assumptions. Supported: floors-then-trade-off
  screening by humans, leaner offers with more alternatives, network effects with snob effects. Mixed: AI personas
  as purely compensatory, delegated agents' low brand weight, rising floors, S-curves.
- `docs/research/literature-review.md`: simulation as theory-building, NPD and negotiation models, attention and
  learning models, LLMs as synthetic respondents and buying agents. No agent-based model built on the
  attention-based view was found (provisional gap).

Applied in v4.1: AI persona screening control (default 0, evidence suggests testing higher); agent floor
multiplier default lowered from 1.1 to 1.0.

Kept on purpose: the installed base is shared by all firms. The assumptions check suggests firm-specific installed
bases, but Mark Meckler's 2026-10-11 specification is that installed base and complements grow the same way for
all firms and only attention to them varies.

## Roadmap (v5 candidates)

1. Soft floors (a value penalty below the floor) as an option beside hard deal-breakers.
2. Make the human trade-off stage bind under default weights (it rarely does now).
3. Delegated agents: compliance failure that grows with the number of constraints; model-specific brand prior.
4. Two-sided gradual concessions (the firm concedes from an aspiration toward its floor) and firm-side alternatives.
5. Dimension-specific floor rise tied to adoption, with stalls; soft Maximum Demanded ceiling.
6. Step-and-wait technology curves (Sood and Tellis 2005); concave E curve for mature categories.
7. Attention modeled on Ocasio's three principles, absorptive capacity that grows with past investment.
8. Validation: "hot stove" checks for terminated firms; live LLM agents in a testbed; a small human lab study.
