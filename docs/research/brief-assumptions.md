Task: check the empirical assumptions behind a simulation, using web search. Do not edit any file except the output file named at the end.

Context: /Users/vishal/research/meckler-exchange-sim/index.html simulates Mark Meckler's six-stage exchange model
(firms build technical, emotional and transaction-cost utility on S-curves; stakeholders value packages against
Minimum Necessary floors and Maximum Demanded ceilings; two-sided negotiation). Read the "How the model works"
section of index.html for the rules.

For EACH assumption below, find the best published evidence (peer-reviewed first; working papers marked as such).
Give: verdict (supported / mixed / unsupported / no evidence found), 2–4 citations with full reference and DOI or URL
you actually opened, one sentence on what each source shows, and what the simulation should change if anything.
Never invent a citation. If you could not open a source, say so.

A1. Human evaluators screen on per-attribute floors (non-compensatory) and then trade off among survivors
    (compensatory) — "consider-then-choose". Check Payne 1976; Bettman, Luce & Payne 1998; Gilbride & Allenby 2004;
    Hauser and colleagues on consideration sets.
A2. LLM "personas" simulating consumers behave more compensatorily (less screening, less noise) than humans.
    Look for 2023–2026 work comparing LLM-simulated respondents with humans in conjoint/choice tasks
    (e.g., Brand, Israeli & Ngwe; Argyle et al.; Horton "homo silicus"; Gui & Toubia; others).
A3. AI agents buying on behalf of a principal apply hard constraints and give little weight to emotional/brand
    attributes. Look for 2024–2026 studies of LLM shopping agents / agentic commerce (brand bias, position bias,
    constraint following).
A4. A stakeholder with more outside options (alternatives) makes leaner offers; negotiations iterate via concessions
    until both clear reservation values (power-dependence, BATNA, concession models).
A5. Customer minimum expectations ratchet upward over time (rising floors): Kano attribute migration
    (attractive → one-dimensional → must-be), Christensen overshoot.
A6. Each utility dimension follows an S-curve with diminishing returns (Foster 1986) — and known critiques
    (e.g., Christensen 1992 on S-curve limits; Sood & Tellis 2005 on step functions).
A7. Installed base and complements raise transaction-cost and technical utility, but can lower emotional utility in
    exclusivity segments (snob effects; Leibenstein 1950; Amaldoss & Jain 2005).

Write the result as Markdown to /Users/vishal/research/meckler-exchange-sim/docs/research/assumptions-check.md,
with a summary table at the top (assumption, verdict, top citation, suggested change).
