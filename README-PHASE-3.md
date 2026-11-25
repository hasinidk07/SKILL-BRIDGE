# SkillBridge – Phase 3: Skill Assessment & Skill Gap Engine

## Implemented
- Career-specific assessment questions for all 8 prototype career paths.
- Skill matching by normalized skill name.
- Transparent scoring: correct answer = 100 demonstrated points; incorrect answer = 0 demonstrated points.
- Separate optional self-reported confidence ratings; these never inflate demonstrated scores.
- Missing-skill detection and weighted priority ranking.
- Weighted skill coverage calculation and skill-by-skill comparison.
- Assessment results saved in browser localStorage through StudentContext.

## Run
From the project folder:

```bash
npm install
npm run dev
```

Open `/assessment`, complete all questions, submit, and then open `/skill-gaps`.

## Rule engine
`src/data/skillEngine.js` contains the editable career requirements, weights, question bank, matching, scoring and coverage logic. Requirement values are illustrative prototype assumptions, not official industry standards.
