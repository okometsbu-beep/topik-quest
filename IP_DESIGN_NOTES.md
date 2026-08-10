# IP-safe game design notes

Research date: 2026-08-10

This is a product-design risk memo, not a legal opinion. A Korean IP attorney should review the release candidate before commercial App Store distribution.

## Bottom line

The abstract idea of combining a board-style journey, random movement, multiple-choice questions, and combat feedback can be reused. The original game's title, characters, lore, audiovisual assets, board layouts, text, music, UI composition, and distinctive combination and sequence of rules must not be copied.

A cosmetic reskin is not the target. TOPIK QUEST uses a separately designed Korean-learning loop called **Wordlight Expedition**.

## Legal boundary used for this implementation

- Korea: Copyright Act Article 2 protects creative expression. In Supreme Court case 2017Da212095 (2019-06-27), the Court held that a game's creative individuality can arise from the selection, arrangement, and organic combination of elements, and that copying that expressive combination can be substantially similar even when individual rules are ideas. Official judgment: <https://www.scourt.go.kr/sjudge/1561944813226_103333.pdf>
- United States: 17 U.S.C. §102(b) excludes ideas, procedures, systems, and methods of operation from copyright. The U.S. Copyright Office also states that the idea, title, and methods of playing a game are not protected, while rule text and graphic art may be protected. Sources: <https://www.law.cornell.edu/uscode/text/17/102> and <https://www.copyright.gov/register/tx-games.html>
- U.S. clone cases: *Tetris Holding, LLC v. Xio Interactive, Inc.*, 863 F. Supp. 2d 394 (D.N.J. 2012), and *Spry Fox, LLC v. Lolapps, Inc.*, No. 2:12-cv-00147 (W.D. Wash. 2012), show that copying a game's distinctive look, progression, and expressive combination can be actionable even when mechanics alone are not.
- Japan: the Copyright Act protects creatively expressed works, including programs and audiovisual expression. A 1992 corporate game is not public domain merely because it is old; Japanese corporate and cinematographic copyright generally lasts 70 years after publication. Act text: <https://elaws.e-gov.go.jp/document?lawid=345AC0000000048>
- Trademarks: a name need not be identical to create likely confusion. Similar sound, appearance, meaning, and related goods/services matter. Source: <https://www.uspto.gov/trademarks/search/likelihood-confusion>
- Platform rules are stricter than the minimum copyright boundary. Apple guideline 4.1 rejects copycats, and 5.2 requires ownership or a license for third-party IP. Source: <https://developer.apple.com/app-store/review/guidelines/>
- Capcom actively registers and enforces IP globally. Its 2025 disclosure lists thousands of trademark holdings and more than six thousand annual infringement-removal actions. Source: <https://www.capcom.co.jp/ir/sustainability/ip.html>

## Practical risk matrix

| Proposed use | Risk | Release decision |
|---|---:|---|
| Original ROM, screenshots, sprites, music, text, code, or traced art | Critical | Never use |
| `Quiz & Dragons`, `Capcom`, `Dungeons & Dragons`, original character/lore names, or confusingly similar branding | High | Never use in product or metadata |
| Same four fantasy classes, corresponding abilities, board sequence, special spaces, reward list, and boss presentation with only new artwork | High | Reject as a reskin |
| Dice/random movement + quiz landing + correct-answer combat, considered separately | Low by itself | May be used with independent expression |
| Original Korean-learning artifacts, route length, event mix, combat economy, story, UI, copy, and audiovisual assets | Lower, not zero | Current implementation |
| Describing the product publicly as a remake, clone, tribute, or “inspired by Quiz & Dragons” | Medium to high | Do not use in store metadata or marketing |

The likely first practical threats for a small app are App Store rejection, a platform takedown, or a cease-and-desist letter. Litigation is less likely than those actions but has much higher impact. No percentage estimate is reliable without knowing territories, revenue, marketing language, and a full asset comparison.

## Independent implementation adopted

| Reference-level concept | TOPIK QUEST expression |
|---|---|
| Six-sided board movement | Original 1–3 **syllable cube** on a nine-space Wordlight trail |
| Four fantasy character classes | Three Korean-learning artifacts: Batchim Shield, Context Compass, Word Magnet |
| Character abilities matching classic RPG roles | Focus protection, learning-streak recovery, and shard economy |
| Inn / elf / hidden chest reward structure | Breathing Space and Sentence Workshop events with a different economy and wording |
| General-knowledge trivia | Independently authored TOPIK listening and reading questions |
| Original fantasy lore and villains | Wordlight shards and the original Cloud Warden setting |
| Fixed quiz damage cadence | Three-answer combo damage, focus resource, hints, route events, and a ten-question expedition cap |
| Original map/UI/audio | New dark mobile UI, original inline SVG hero, existing project monster art, and original copy |

## Clean-room rules

1. Do not download, decompile, extract, or inspect the original ROM or source code.
2. Do not import or trace original screenshots, sprites, maps, fonts, sound effects, music, dialogue, or promotional art.
3. Do not reproduce the original character roster, ability mapping, reward inventory, lore, stage names, or board layouts.
4. Keep all product copy, questions, explanations, code, UI, and assets original or licensed, with source/license records.
5. Do not mention Capcom or the reference title in customer-facing metadata, screenshots, keywords, or marketing.
6. Before release, compare complete playthrough videos side by side and remove any distinctive sequence that still creates the same overall impression.

## Separate naming warning

An unrelated Android application named **Topik Quest** by another developer was publicly listed before this project's planned store release, with a similar TOPIK vocabulary RPG concept. Public listing found during clearance: <https://applion.jp/Topik-Quest/android-com.topikquest/>

This is a separate and more immediate naming/copycat-review risk than the 1992 Capcom game. Before an App Store or Google Play release:

1. choose a more distinctive app name;
2. run formal clearance searches in Korea, Japan, and the United States for software and education-service classes;
3. keep `TOPIK` descriptive and avoid implying endorsement by the National Institute for International Education;
4. display an independent/unofficial-study-app disclaimer; and
5. have counsel review the final name, icon, store screenshots, and metadata.

The current build adds an unofficial-app disclaimer but intentionally does not rename the whole product without an explicit product-name decision.
