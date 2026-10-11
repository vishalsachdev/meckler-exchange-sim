# Assumptions check: empirical evidence behind the six-stage exchange simulator

Created: 2026-10-11
Last Updated: 2026-10-11
Task: `docs/research/brief-assumptions.md`
Model rules read from: the "How the model works" section of `index.html` (lines 191–204) and the evaluator and negotiation code (lines 351–445).

## How to read this file

- Each citation has an **Opened** line. It says what I actually read: the full text, an abstract page, or only a catalogue record. A source read as an abstract only supports what the abstract says.
- Working papers and preprints are marked **(working paper)** or **(preprint)**.
- Every DOI was checked against Crossref. Abstracts marked "via OpenAlex" were read from `https://api.openalex.org/works/doi:<DOI>`.
- Search scope: general web search, arXiv, SSRN/HBS, IDEAS/RePEc, ACL Anthology, publisher pages where reachable, Crossref and OpenAlex. Sage, Europe PMC, PubMed and SSRN refused some requests (HTTP 403 or a cookie wall). Each affected source says so.
- Verdict labels follow the brief: supported / mixed / unsupported / no evidence found.

## Summary

| # | Assumption (as the simulation uses it) | Verdict | Top citation | Suggested change |
|---|---|---|---|---|
| A1 | Humans screen on per-attribute floors (non-compensatory), then trade off among survivors (compensatory) | **Supported** | Gilbride & Allenby (2004), *Marketing Science*, doi:10.1287/mksc.1030.0032. 92% of respondents screened on at least one attribute. | Keep floors but make them soft (a penalty, not a wall). Make the trade-off stage actually bind; with default weights it never does. Note that the screening evidence comes from choices among many options, but the simulated human judges one offer. |
| A2 | LLM personas are more compensatory (less screening, less noise) than humans | **Mixed** | Chen, Liu, Shan & Zhong (2023), *PNAS*, doi:10.1073/pnas.2316205120 | Keep lower heterogeneity. Drop "no floors, no noise": add a prompt-dependent reject rate, first-position bias and model-version drift. No study has tested screening rules on LLM respondents directly. |
| A3 | AI agents buying for a principal apply hard constraints and give little weight to emotional/brand attributes | **Mixed** (constraints partly supported; low brand weight unsupported) | Allouah, Besbes, Figueroa, Kanoria & Kumar (2026), WWW '26, doi:10.1145/3774904.3792943 (full version arXiv:2508.02630) | Keep hard floors, but add compliance failure that grows with the number of floors. Set the agent floor multiplier to 1.0 (I found no evidence for 110%). Replace E weight 0.2 with a model-specific brand/endorsement prior that can be large and shifts at model updates. |
| A4 | More outside options mean leaner offers; concessions iterate until both sides clear reservation values | **Supported** (direction) | Backus, Blake, Larsen & Tadelis (2020), *QJE*, doi:10.1093/qje/qjaa003 | Make concessions two-sided and gradual (the firm concedes from an aspiration toward its floor). Add the firm's own alternatives. Allow breakdown even when a deal zone exists. Note a possible reversal near zero alternatives. |
| A5 | Minimum expectations ratchet upward (Kano migration; Christensen overshoot) | **Mixed** | Löfgren, Witell & Gustafsson (2011), *The TQM Journal*, doi:10.1108/17542731111110267 | Make floor rise specific to each dimension and tied to adoption. Allow stalls and reversals. Treat overshoot as a rare scenario. Soften the Maximum Demanded ceiling (positive but small value above it). |
| A6 | Each utility dimension follows an S-curve with diminishing returns | **Mixed** | Sood & Tellis (2005), *Journal of Marketing*, doi:10.1509/jmkg.69.3.152.66361 | Keep the S-curve as the default for T. Add a step-and-wait option and firm-specific ceilings. Use a concave (no take-off) E curve for mature categories. |
| A7 | Installed base and complements raise TC and T utility, but can lower E in exclusivity segments | **Supported** (direction; magnitudes uncertain) | Brynjolfsson & Kemerer (1996), *Management Science*, doi:10.1287/mnsc.42.12.1627 | Make installed base firm- or standard-specific (currently shared by all firms). Let complements follow installed base. Base negative E valence on adoption by dissimilar buyers, not on raw installed base. |

---

## A1. Floors first, then trade-offs ("consider-then-choose")

**What the simulation assumes.** The human evaluator perceives each dimension with noise and rejects outright if TC is below the friction-abort level. It rejects if any dimension is below its floor. Then it requires weighted total value to be at least the sum of the floors (`index.html` line 198; code lines 399–406).

**Verdict: Supported**, with two caveats that matter for this simulation (below).

**Evidence**

1. Payne, J. W. (1976). Task complexity and contingent processing in decision making: An information search and protocol analysis. *Organizational Behavior and Human Performance, 16*(2), 366–387. https://doi.org/10.1016/0030-5073(76)90022-2
   - Opened: abstract page, https://scholars.duke.edu/publication/792478
   - Shows: with two alternatives, people searched in a way consistent with compensatory processing; with many alternatives, they switched to strategies that eliminate options quickly on little information.
2. Gilbride, T. J., & Allenby, G. M. (2004). A choice model with conjunctive, disjunctive, and compensatory screening rules. *Marketing Science, 23*(3), 391–406. https://doi.org/10.1287/mksc.1030.0032
   - Opened: abstract page, https://ideas.repec.org/a/inm/ormksc/v23y2004i3p391-406.html
   - Shows: in a camera conjoint study, a model with a screening stage followed by random-utility choice found that 92% of respondents screened alternatives on one or more attributes.
3. Hauser, J. R. (2014). Consideration-set heuristics. *Journal of Business Research, 67*(8), 1688–1699. https://doi.org/10.1016/j.jbusres.2014.02.015
   - Opened: abstract page, https://ideas.repec.org/a/eee/jbrese/v67y2014i8p1688-1699.html
   - Shows: a review concluding that consumers often form a consideration set and then choose, and that this is rational when there are many products or many features to evaluate.
4. Swait, J. (2001). A non-compensatory choice model incorporating attribute cutoffs. *Transportation Research Part B: Methodological, 35*(10), 903–928. https://doi.org/10.1016/S0191-2615(00)00030-8
   - Opened: abstract page, https://ideas.repec.org/a/eee/transb/v35y2001i10p903-928.html
   - Shows: argues from prior evidence that people treat attribute cutoffs as "soft". The model penalizes violations instead of forbidding them, and it fit a stated-preference experiment better than a two-stage hard-screen model.

**Also checked (named in the brief)**
- Bettman, J. R., Luce, M. F., & Payne, J. W. (1998). Constructive consumer choice processes. *Journal of Consumer Research, 25*(3), 187–217. https://doi.org/10.1086/209535. Opened: abstract page, https://scholars.duke.edu/publication/760814. A review: consumers build preferences with strategies that depend on the task. This agrees with Payne (1976) but adds no separate test.
- Hauser, J. R., Toubia, O., Evgeniou, T., Befurt, R., & Dzyabura, D. (2010). Disjunctions of conjunctions, cognitive simplicity, and consideration sets. *Journal of Marketing Research, 47*(3), 485–496. https://doi.org/10.1509/jmkr.47.3.485. **Could not open.** The publisher page returned 403 and the Columbia PDF did not parse. I saw only a search-engine excerpt of the abstract, so I do not rely on it.

**Caveats for this simulation**
- The screening evidence comes from choices among several options. Payne found compensatory processing with only two options. The simulated human judges **one** offer per period and never chooses among the four firms. So the evidence carries over to an acceptability threshold, not to a consideration set.
- Code observation: with the default human weights of 1, the "total value ≥ sum of floors" test can never fail once every floor passes. Each clamped perceived value is at least its floor, so the sum is too (lines 401–406). The compensatory stage binds only during context shocks (T weight × 0.4) or when the user edits the weights.

**What the simulation should change**
- Make floors soft: subtract a large but finite penalty per unit of shortfall (Swait 2001). Keep true deal-breakers only where the theory needs them.
- Make the compensatory stage bind. Accept when penalized value exceeds a reservation level tied to the stakeholder's alternatives, not the sum of floors. This links A1 to A4.
- If stakeholders later choose among firms, use consider-then-choose there. Screening should get stronger as the number of offers grows (Payne 1976; Hauser 2014).

---

## A2. LLM personas are more compensatory and less noisy than humans

**What the simulation assumes.** "AI persona: trades off only; no floors, no noise, no abort" (line 198). In the code, the persona keeps only the total-value test (line 406). It has no floors (line 362) and no perception noise (line 400).

**Verdict: Mixed.** "Less heterogeneity and more internal consistency" is supported. "More compensatory, no screening" has **no direct test**, and some evidence points the other way.

**Evidence**

1. Chen, Y., Liu, T. X., Shan, Y., & Zhong, S. (2023). The emergence of economic rationality of GPT. *Proceedings of the National Academy of Sciences, 120*(51), e2316205120. https://doi.org/10.1073/pnas.2316205120
   - Opened: abstract page, https://ideas.repec.org/a/nas/journl/v120y2023pe2316205120.html
   - Shows: GPT's budget choices in risk, time, social and food tasks were more consistent with utility maximization than human subjects' choices, and its estimated preference parameters were less heterogeneous.
2. Bisbee, J., Clinton, J. D., Dorff, C., Kenkel, B., & Larson, J. M. (2024). Synthetic replacements for human survey data? The perils of large language models. *Political Analysis, 32*(4), 401–416. https://doi.org/10.1017/pan.2024.5
   - Opened: article page (abstract and introduction), https://www.cambridge.org/core/journals/political-analysis/article/synthetic-replacements-for-human-survey-data-the-perils-of-large-language-models/B92267DC26195C7F36E63EA04A47D2FE
   - Shows: ChatGPT personas matched average ANES feeling-thermometer scores but varied less than humans. 48% of regression coefficients differed significantly from ANES. Results shifted with small prompt changes and over a 3-month gap.
3. Brand, J., Israeli, A., & Ngwe, D. (2026, April 30). *Using LLMs for market research* (Harvard Business School Working Paper 23-062; earlier title "Using GPT for Market Research"). **(working paper; the first author's site lists it as accepted at *Quantitative Marketing and Economics*)**
   - Opened: full text, https://www.hbs.edu/ris/Publication%20Files/23-062_1f58623a-ee21-44b9-a262-276047bc5543.pdf ; acceptance note at https://www.jamesbrandecon.com/research
   - Shows: LLM willingness-to-pay estimates from conjoint tasks were "sometimes comparable" to human estimates but "often inaccurate and in some cases wrong-signed". GPT did not reproduce demographic heterogeneity. GPT favored the first-listed option. Its no-purchase share depended on prompt wording: "Which laptop, if any, did you purchase?" gave "only a handful" of no-purchase answers.
4. Goli, A., & Singh, A. (2024). Frontiers: Can large language models capture human preferences? *Marketing Science, 43*(4), 709–722. https://doi.org/10.1287/mksc.2023.0306
   - Opened: preprint abstract (arXiv:2305.02531v6), https://arxiv.org/abs/2305.02531
   - Shows: in intertemporal choice, GPT-3.5 showed a lexicographic (non-compensatory) preference for earlier rewards, and GPT-4 was much less patient than humans. Chain-of-thought prompting narrowed the gap but did not remove it.

**Also checked (named in the brief)**
- Argyle, L. P., Busby, E. C., Fulda, N., Gubler, J. R., Rytting, C., & Wingate, D. (2023). Out of one, many: Using language models to simulate human samples. *Political Analysis, 31*(3), 337–351. https://doi.org/10.1017/pan.2023.2. Opened: abstract page, https://ideas.repec.org/a/cup/polals/v31y2023i3p337-351_5.html. GPT-3 conditioned on real backstories reproduced subgroup response distributions ("algorithmic fidelity"). It does not test decision rules or noise.
- Horton, J. J., Filippas, A., & Manning, B. S. (2023, revised Feb 2026). *Large language models as simulated economic agents: What can we learn from Homo silicus?* NBER Working Paper 31122. https://doi.org/10.3386/w31122 **(working paper)**. Opened: https://www.nber.org/papers/w31122. LLM agents qualitatively reproduce classic experiments. It does not test screening.
- Gui, G., & Toubia, O. (2023, revised Nov 2025). *The challenge of using LLMs to simulate human behavior: A causal inference perspective.* arXiv:2312.15524v3 **(preprint)**. Opened: full text, https://arxiv.org/html/2312.15524. In blinded simulations the treatment shifts unstated covariates. GPT-4o-mini gave inverted-U demand curves where humans gave downward-sloping ones. It does not test screening. A LinkedIn post claimed this paper shows LLMs "almost never reject a purchase". I did not find that claim in the text I read, so I do not use it.

**No direct evidence found.** I found no study that fits a screening model (for example, a Gilbride–Allenby-type model) to LLM conjoint responses. Searches covered LLM or synthetic respondents with conjoint, consideration sets, conjunctive or non-compensatory rules, "none"-option shares, and decision strategies. Industry claims that LLMs rarely pick the "none" option (Sawtooth proceedings; a vendor report) appeared only in a secondary LinkedIn post. I did not open them and do not rely on them.

**What the simulation should change**
- Keep lower between-respondent heterogeneity for personas (Chen et al.; Bisbee et al.; Brand et al.).
- Replace "no floors" with a reject or opt-out rate set by the prompt (Brand et al.). A floor-enforcement probability works, as long as it is not fixed at zero.
- Replace "no noise" with low idiosyncratic noise, a persistent bias per model version, and an occasional version shock (Bisbee et al. found the same prompt drifted in 3 months). Add an optional first-position bias.
- Label the persona rule as a hypothesis in the UI, since no study tests it directly.

---

## A3. Delegated AI agents: hard constraints, little weight on emotion and brand

**What the simulation assumes.** The delegated agent enforces T and TC floors at 110% of the stakeholder floors. It gives E a weight of 0.2 and has no E floor, no noise and no abort. The commodity buyer weights T 0.8, E 0 and TC 1.6, and enforces T and TC floors at 100% (line 198; code lines 311, 362).

**Verdict: Mixed.** Hard constraints: supported for a single clear constraint with late-2025 frontier models, but not for several constraints at once. Little weight on brand or emotional cues: **unsupported**. Agents concentrate on certain brands, carry brand bias and respond to endorsements and nudges. I found **no evidence** for floors set stricter than the principal's (the 110% default).

**Evidence**

1. Allouah, A., Besbes, O., Figueroa, J. D., Kanoria, Y., & Kumar, A. (2026). What is your AI agent buying? Evaluation, biases, model dependence, & emerging implications of agentic e-commerce. In *Proceedings of the ACM Web Conference 2026* (pp. 8697–8700). https://doi.org/10.1145/3774904.3792943. Full version: arXiv:2508.02630v3 (Dec 2025).
   - Opened: arXiv abstract and full-text PDF, https://arxiv.org/abs/2508.02630 (ACM metadata confirmed via Crossref; ACM page not opened)
   - Shows: late-2025 models failed single-constraint tasks (stated budget, colour or brand) 0–4% of the time (Claude Opus 4.5 missed the colour constraint in 4.0% of trials; the others tested had 0%), and almost never failed simple price and rating checks. But under a generic prompt, choices concentrated on a few products (Amazon Basics dominated staplers; Arrow was never chosen). Shares swung across model versions (Fitbit Inspire went from 45% to 77% with Claude and from 25% to 6% with GPT). Agents showed position bias, penalized "Sponsored" tags and rewarded platform endorsements.
2. Lyu, Y., Zhang, X., Yan, L., de Rijke, M., Ren, Z., & Chen, X. (2025). *DeepShop: A benchmark for deep research shopping agents.* arXiv:2506.02839 **(preprint)**.
   - Opened: abstract and full-text PDF, https://arxiv.org/abs/2506.02839
   - Shows: on shopping queries that combine product attributes, search filters and sorting preferences, the best web agent met all requirements in 32% of tasks. The Gemini and OpenAI deep research systems each met them in 30%. Filters were the hardest part.
3. Kamruzzaman, M., Nguyen, H. M., & Kim, G. L. (2024). "Global is good, local is bad?": Understanding brand bias in LLMs. In *Proceedings of EMNLP 2024* (pp. 12695–12702). https://doi.org/10.18653/v1/2024.emnlp-main.707
   - Opened: abstract page, https://aclanthology.org/2024.emnlp-main.707/
   - Shows: LLMs consistently linked global brands with positive attributes and recommended luxury gifts more often for people in high-income countries. Country-of-origin effects favoured local brands in some contexts.
4. Cherep, M., Ma, C., Xu, A., Shaked, M., Maes, P., & Singh, N. (2026). *A framework for studying AI agent behavior: Evidence from consumer choice experiments.* arXiv:2509.25609v2 **(preprint; the arXiv comment lists ICLR)**.
   - Opened: abstract, https://arxiv.org/abs/2509.25609
   - Shows: in a realistic web shopping environment, agent choices shifted "predictably and substantially" with prices, ratings and psychological nudges. The authors call agents "strongly biased choosers".

**Scope note.** All four studies test consumer shopping agents, mostly in one-shot product selection. None tests a B2B purchasing algorithm, so I found no evidence for or against the commodity buyer's E weight of zero.

**What the simulation should change**
- Keep hard T and TC floors for the agent, but add a compliance probability per floor. It should be near 1 for one floor and fall as floors are added. DeepShop's joint success of about 30% marks the hard end.
- Set the agent floor multiplier default to 1.0. Keep 110% as an option only.
- Replace the fixed E weight of 0.2 with an agent brand/endorsement prior. Each "model" gets its own weight, which can be high. A "model update" event reshuffles it (Allouah et al.).
- Add an optional position bias for agents.
- Keep the commodity buyer as a labelled stylization of the paper's example, not an empirical claim.

---

## A4. Outside options, leaner offers and concessions

**What the simulation assumes.** Stakeholder dependence is `V / (V + alternatives)`. The stakeholder opens at its belief about the firm's payment floor, plus a share of its surplus that grows with dependence. The offer is capped at 90% of assigned value and at the stakeholder's bank. In renegotiation only the stakeholder concedes, by up to 15% of value per round. The firm's floor stays fixed. A stakeholder with low dependence probes lower next time (line 199; code lines 417–445).

**Verdict: Supported** for the direction (more alternatives, better terms; iterative concessions). The simulated *process* differs from field evidence in three ways: concessions are one-sided, breakdown is rare, and the stakeholder always moves first.

**Evidence**

1. Emerson, R. M. (1962). Power-dependence relations. *American Sociological Review, 27*(1), 31–41. https://doi.org/10.2307/2089716
   - Opened: full text, https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Power/Emerson_1962_Power-dependence_relations.pdf
   - Shows: A's dependence on B is "directly proportional to A's motivational investment in goals mediated by B, and inversely proportional to the availability of those goals to A outside of the A-B relation". Emerson says the exact joint function "is an empirical question". Power is reciprocal: Pab = Dba and Pba = Dab.
2. Backus, M., Blake, T., Larsen, B., & Tadelis, S. (2020). Sequential bargaining in the field: Evidence from millions of online bargaining interactions. *The Quarterly Journal of Economics, 135*(3), 1319–1361. https://doi.org/10.1093/qje/qjaa003
   - Opened: abstract page, https://ideas.repec.org/a/oup/qjecon/v135y2020i3p1319-1361..html
   - Shows: across more than 25 million eBay Best Offer listings, stronger bargaining power and better outside options improved outcomes. One-third of interactions ended in immediate agreement; most ended in disagreement or delayed agreement. Concessions were reciprocal and gradual, and parties preferred offers that split the difference.
3. Magee, J. C., Galinsky, A. D., & Gruenfeld, D. H. (2007). Power, propensity to negotiate, and moving first in competitive interactions. *Personality and Social Psychology Bulletin, 33*(2), 200–212. https://doi.org/10.1177/0146167206294413
   - Opened: abstract via OpenAlex
   - Shows: negotiators with strong alternatives were more than three times as likely to intend to make the first offer as those without alternatives, and making the first offer produced a bargaining advantage.
4. Schaerer, M., Swaab, R. I., & Galinsky, A. D. (2015). Anchors weigh more than power: Why absolute powerlessness liberates negotiators to achieve better outcomes. *Psychological Science, 26*(2), 170–181. https://doi.org/10.1177/0956797614558718
   - Opened: abstract via OpenAlex (Europe PMC returned 403; PubMed required cookies)
   - Shows: negotiators with **no** alternative made higher first offers and got better outcomes than those with a **weak** alternative, because a weak alternative anchors the first offer low.

**Also checked:** Pinkley, R. L., Neale, M. A., & Bennett, R. J. (1994). The impact of alternatives to settlement in dyadic negotiation. *Organizational Behavior and Human Decision Processes, 57*(1), 97–116. https://doi.org/10.1006/obhd.1994.1006. Metadata confirmed via Crossref. **Could not open** an abstract or the text (IDEAS and OpenAlex have no abstract), so it is not used.

**What the simulation should change**
- Make concessions two-sided. The firm opens at an aspiration above its payment floor and concedes toward it. Add a split-the-difference option (Backus et al.).
- Add the firm's own alternatives, so the firm also has a dependence value (Emerson's reciprocity). Today only the stakeholder's alternatives matter.
- Allow breakdown inside the deal zone, for example a per-round exit probability. In field data, disagreement and delayed agreement are the majority outcome.
- Let the less dependent side make the first offer (Magee et al.).
- Note in the documentation that `V/(V+alt)` is one functional form among many (Emerson), and that the effect may reverse between "no alternative" and "weak alternative" (Schaerer et al.).

---

## A5. Rising floors: Kano migration and overshoot

**What the simulation assumes.** Every stakeholder floor rises by a fixed amount per period (default 0.002), capped at 90% of Maximum Demanded. The firm's payment floor rises 4× faster. The Maximum Demanded level for T drifts up (default 0.005). Utility above Maximum Demanded adds nothing (line 198; code lines 234–235, 288–289, 354–356, 401).

**Verdict: Mixed.** Upward migration happens, but it is specific to each attribute and segment and is not universal. Some attributes stall or move backward. Overshoot was rare in Christensen's own cases.

**Evidence**

1. Nilsson-Witell, L., & Fundin, A. (2005). Dynamics of service attributes: A test of Kano's theory of attractive quality. *International Journal of Service Industry Management, 16*(2), 152–168. https://doi.org/10.1108/09564230510592289
   - Opened: abstract page, https://research.chalmers.se/en/publication/115031
   - Shows: an e-service was "indifferent" at launch and is now "attractive" to the market, but early adopters already treat it as one-dimensional or must-be. Attribute status depends on the customer's adoption stage.
2. Löfgren, M., Witell, L., & Gustafsson, A. (2011). Theory of attractive quality and life cycles of quality attributes. *The TQM Journal, 23*(2), 235–246. https://doi.org/10.1108/17542731111110267
   - Opened: abstract via OpenAlex
   - Shows: two survey waves (2003 and 2009; 1,456 customers; 24 packaging attributes) revealed three life cycles: successful, flavour-of-the-month and stable. Some attributes moved backward in the cycle, for example after a design change.
3. Adner, R. (2002). When are technologies disruptive? A demand-based view of the emergence of competition. *Strategic Management Journal, 23*(8), 667–688. https://doi.org/10.1002/smj.246
   - Opened: full text of the working-paper version (INSEAD 2001/74/SM), https://flora.insead.edu/fichiersti_wp/inseadwp2001/2001-74.pdf ; journal abstract via OpenAlex
   - Shows: consumers have a functional threshold below which they reject a product at any price. Above their requirements they face decreasing marginal utility, but there is "no analogous boundary" at the top, so willingness to pay stays "positive, but decreasing".
4. King, A. A., & Baatartogtokh, B. (2015). How useful is the theory of disruptive innovation? *MIT Sloan Management Review, 57*(1), 77–90. https://sloanreview.mit.edu/article/how-useful-is-the-theory-of-disruptive-innovation/
   - Opened: article page (paywalled after the introduction). The figures come from the first author's own summary, which I opened in full: King, A. (2017, October 26). The theory of disruptive innovation: Science or allegory? *Entrepreneur & Innovation Exchange*. https://eiexchange.com/content/the-theory-of-disruptive-innovation-science-or-a
   - Shows: experts on the 77 cases in Christensen's books judged that only 7 (9%) matched all of the theory's premises and its prediction. In "nearly 80%" of cases, sustaining innovation never overshot what mainstream customers wanted.

**Could not open:** Kano, Seraku, Takahashi & Tsuji (1984), "Attractive quality and must-be quality", *Hinshitsu* 14(2) (Japanese original). Christensen (1997), *The Innovator's Dilemma* (book). Neither is used as evidence here.

**What the simulation should change**
- Replace the single global "floors rise per period" with a rate for each dimension, allowing zero. Tie the rise to adoption (installed-base growth or cumulative formalized exchanges), so early-adopter segments ratchet faster (Nilsson-Witell & Fundin).
- Allow occasional floor resets, i.e. a backward move after a redesign or a new technology (Löfgren et al.).
- Soften the Maximum Demanded ceiling: give a small positive marginal value above it instead of zero (Adner).
- Treat overshoot as a scenario, not the default. Check how often firms invest above the T ceiling in default runs, and set the drift so that this is the exception (King & Baatartogtokh).

---

## A6. S-curves with diminishing returns

**What the simulation assumes.** Each dimension's utility is a logistic function of a capability stock. T has the highest ceiling and the slowest take-off; E and TC are cheaper but cap lower. Stocks depreciate 3% per period, and the stakeholder's curves have the same shapes (line 195).

**Verdict: Mixed.** Diminishing returns near a limit are well supported. A smooth S with a slow start is not general: technical performance often moves in steps, flattening differs by firm, and response to brand spending is S-shaped only in some categories.

**Evidence**

1. Foster, R. N. (1986). *Innovation: The attacker's advantage.* New York: Summit Books. ISBN 0671622501.
   - Opened: catalogue record only, https://archive.org/details/innovationattack0000fost (text access-restricted). **I did not read the book.** The definition I relied on is quoted from the book in a secondary source I opened: https://fs.blog/richard-foster-the-attackers-advantage/
   - Shows (as quoted there): the S-curve plots effort against results. Progress is slow at first, then fast, then "more and more difficult and expensive" near a limit.
2. Christensen, C. M. (1992). Exploring the limits of the technology S-curve. Part I: Component technologies. *Production and Operations Management, 1*(4), 334–357. https://doi.org/10.1111/j.1937-5956.1992.tb00001.x
   - Opened: abstract via OpenAlex
   - Shows: in disk drives, component technologies followed S-curves, but flattening was firm-specific. Some firms got far more from existing technology, and aggressive S-curve switching gave no strategic advantage.
3. Sood, A., & Tellis, G. J. (2005). Technological evolution and radical innovation. *Journal of Marketing, 69*(3), 152–168. https://doi.org/10.1509/jmkg.69.3.152.66361
   - Opened: abstract via OpenAlex
   - Shows: across 14 technologies in four markets, performance followed a step function (sharp improvements after long flat periods), not a single S-curve. Rival technologies' paths crossed more than once or not at all.
4. Vakratsas, D., Feinberg, F. M., Bass, F. M., & Kalyanaram, G. (2004). The shape of advertising response functions revisited: A model of dynamic probabilistic thresholds. *Marketing Science, 23*(1), 109–119. https://doi.org/10.1287/mksc.1030.0035
   - Opened: abstract via OpenAlex
   - Shows: market-share response to advertising had threshold effects and was not globally concave in two evolving durable categories (SUVs, minivans). This did not hold in a mature nondurable category (liquid detergent).

**Scope note.** The simulation maps capability to *utility*, which joins two links: effort to performance (Foster; Christensen; Sood & Tellis) and performance to utility (Adner 2002, under A5; Kano). Most evidence above is about the first link. Vakratsas et al. is the closest evidence for an E (brand/advocacy) curve.

**What the simulation should change**
- T: add an option for step-and-wait gains (random jumps after flat spells) as an alternative to the smooth logistic (Sood & Tellis). Let the T ceiling vary by firm, or let dynamic capability raise it (Christensen).
- E: offer a concave curve with no take-off threshold as the default for mature categories. Keep the S-shape for new categories (Vakratsas et al.).
- Report the policy comparison under both shapes. The slope-hunter policy depends directly on curvature, so its ranking may change.

---

## A7. Installed base, complements and snob effects

**What the simulation assumes.** Installed base and complements grow on logistic paths that are the same for all firms. Each formalized exchange adds to a shared installed base; complement co-evolution defaults to 0. Complements add to T, scaled by operant resources. Installed base adds to TC and, through the segment valence, to E (negative for exclusivity segments) (line 197; code lines 224–231, 281–287, 350–353, 363).

**Verdict: Supported** for all three directions. Three caveats: network value attaches to a product's or standard's own installed base, complement effects are weaker than often assumed and follow the installed base, and snob losses depend on *who* adopts.

**Evidence**

1. Brynjolfsson, E., & Kemerer, C. F. (1996). Network externalities in microcomputer software: An econometric analysis of the spreadsheet market. *Management Science, 42*(12), 1627–1647. https://doi.org/10.1287/mnsc.42.12.1627
   - Opened: abstract via OpenAlex
   - Shows: in spreadsheet prices from 1987 to 1992, a 1% larger installed base for a product went with a 0.75% higher price, and following the dominant Lotus menu standard went with a 46% higher price.
2. Stremersch, S., Tellis, G. J., Franses, P. H., & Binken, J. L. G. (2007). Indirect network effects in new product growth. *Journal of Marketing, 71*(3), 52–74. https://doi.org/10.1509/jmkg.71.3.52
   - Opened: abstract via OpenAlex
   - Shows: across nine markets, indirect network effects were weaker than prior literature implied. Hardware sales usually led software availability, and the reverse almost never happened.
3. Amaldoss, W., & Jain, S. (2005). Conspicuous consumption and sophisticated thinking. *Management Science, 51*(10), 1449–1466. https://doi.org/10.1287/mnsc.1050.0399
   - Opened: abstract via OpenAlex
   - Shows: in a model supported by laboratory tests, snobs can have an upward-sloping demand curve, but only when consumers who are (weakly) followers are also present.
4. Berger, J., & Heath, C. (2008). Who drives divergence? Identity signaling, outgroup dissimilarity, and the abandonment of cultural tastes. *Journal of Personality and Social Psychology, 95*(3), 593–607. https://doi.org/10.1037/0022-3514.95.3.593
   - Opened: abstract via OpenAlex
   - Shows: across seven studies, people dropped tastes when dissimilar outgroups adopted them, to avoid signalling unwanted identities. In a field study, students stopped wearing a wristband after a "geeky" dorm next door adopted it.

**Also checked (named in the brief)**
- Leibenstein, H. (1950). Bandwagon, snob, and Veblen effects in the theory of consumers' demand. *The Quarterly Journal of Economics, 64*(2), 183–207. https://doi.org/10.2307/1882692. Opened: full text, https://gwern.net/doc/sociology/1950-leibenstein.pdf. On p. 189 the snob effect is "the extent to which the demand for a consumers' good is decreased owing to the fact that others are also consuming the same commodity". This is theory, not a test.
- Amaldoss, W., & Jain, S. (2005). Pricing of conspicuous goods: A competitive analysis of social effects. *Journal of Marketing Research, 42*(1), 30–42. https://doi.org/10.1509/jmkr.42.1.30.56883. Opened: abstract via OpenAlex. A desire for uniqueness raises prices and profits; conformity lowers them. A lab test found demand among uniqueness-seekers can rise with price.

**What the simulation should change**
- Make installed base firm- or standard-specific, with a toggle: shared (open standard) or proprietary. Network value attaches to a product's own installed base (Brynjolfsson & Kemerer), but today `ibExtra` is one shared value for all firms (code line 350).
- Let complements grow from installed base (complement co-evolution > 0, or complements as a lagged function of installed base) instead of an exogenous path (Stremersch et al.). Test a lower complements → T coefficient in sensitivity runs.
- In exclusivity segments, base the negative E valence on adoption by dissimilar buyers, or on installed base above a niche threshold, instead of a linear function of total installed base (Berger & Heath; Amaldoss & Jain).

---

## Sources seen but not used

- Hauser et al. (2010), *JMR*: publisher page returned 403; PDF did not parse.
- Pinkley, Neale & Bennett (1994), *OBHDP*: no abstract or text available.
- Kano et al. (1984), *Hinshitsu*: Japanese original; not opened.
- Christensen (1997), *The Innovator's Dilemma*: book; not opened.
- Cho & Lee, "Can silicon citizens replace human respondents?" (SSRN 7212319): SSRN returned 403; only a search excerpt was seen.
- Sawtooth proceedings and vendor claims about LLM "none"-option shares: seen only in a LinkedIn post; not opened.
- Wadi & Ma (2026), "Does rank still matter? Position bias when AI agents shop on our behalf", arXiv:2608.22697v4: opened, but not needed beyond Allouah et al. Its abstract changed between versions; v4 reports smaller position effects for agents than for humans, concentrated at low reasoning effort.
