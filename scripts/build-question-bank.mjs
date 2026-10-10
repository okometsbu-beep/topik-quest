#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { repairListeningScript } from './lib/listening-script-repairs.mjs';
import { repairListeningChoices } from './lib/listening-choice-repairs.mjs';

const root = path.resolve(import.meta.dirname, '..');

// These are the 44 reviewed noun slots in the imported topic, graph, hobby and
// essay templates. Do not guess particles from arbitrary words: Korean verb
// endings such as "있는" and noun stems such as "평가" are not particle errors.
export const generatedNounPhrases = [
  '중고 거래', '학교 급식', '재난 문자', '지역 축제', '생활 체육',
  '공유 이동수단', '야간 조명', '도시 열섬 현상', '원격 근무', '공공도서관의 변화',
  '수리 문화', '수면과 학습', '지역 화폐', '도시 생물다양성', '박물관의 참여형 전시',
  '인공지능 번역', '음식물 쓰레기', '디지털 접근성', '공동체 텃밭', '탄소 표시제',
  '전자책 대출 건수', '지역 체육시설 이용자 수', '중고 거래 참여자 수', '공공 자전거 이용자 수',
  '수영', '사진 찍기', '요리', '자전거 타기', '독서', '그림 그리기', '배드민턴', '등산',
  '공공장소의 조용한 공간', '지역 상점의 역할', '인공지능과 학습', '도시의 걷기 환경',
  '중고 거래 문화', '일과 휴식의 경계', '지역 축제의 지속 가능성', '디지털 소외',
  '학교의 환경 교육', '공유 공간의 규칙', '건강 정보의 신뢰성', '문화유산과 현대적 활용'
];
const particlePairs = { 은: ['은', '는'], 는: ['은', '는'], 을: ['을', '를'], 를: ['을', '를'],
  이: ['이', '가'], 가: ['이', '가'], 과: ['과', '와'], 와: ['과', '와'],
  으로: ['으로', '로'], 로: ['으로', '로'] };
export function withKoreanParticle(noun, particle) {
  const text = String(noun).trimEnd();
  const code = text.charCodeAt(text.length - 1) - 0xac00;
  if (!Number.isInteger(code) || code < 0 || code > 11171 || !particlePairs[particle]) {
    throw new Error(`Expected a Hangul noun and supported particle: ${noun}/${particle}`);
  }
  const batchim = code % 28;
  const vowelForm = batchim === 0 || (particlePairs[particle][0] === '으로' && batchim === 8);
  return text + particlePairs[particle][vowelForm ? 1 : 0];
}
const nounPattern = [...generatedNounPhrases].sort((a, b) => b.length - a.length).join('|');
const interpolatedParticle = new RegExp(`(^|[^가-힣])(${nounPattern})(으로|은|는|을|를|이|가|과|와|로)(?=$|[^가-힣])`, 'gu');
export function repairGeneratedParticles(value) {
  if (typeof value === 'string') return value.replace(interpolatedParticle,
    (_, boundary, noun, particle) => boundary + withKoreanParticle(noun, particle));
  if (Array.isArray(value)) return value.map(repairGeneratedParticles);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .map(([key, entry]) => [key, repairGeneratedParticles(entry)]));
  return value;
}

// Nine semantic source families, reviewed against every edition's dialogue.
// Correct the written situation/choices, never the recorded listening script or
// the stable answer index. Names alone do not establish a speaker's gender.
export const pictureSelectionRepairs = [
  {
    evidence: '우유만 계산하면 돼요.',
    options: [
      ['남자가 편의점 계산대에서 우유를 사고 있다.', '한 사람이 우유를 계산하려고 한다.'],
      ['남자가 상자에 우유를 정리하고 있다.', '한 사람이 상자에 우유를 정리하고 있다.'],
      ['남자가 카페에서 우유를 마시고 있다.', '한 사람이 카페에서 우유를 마시고 있다.'],
      ['남자가 편의점 진열대에서 물건을 고르고 있다.', '한 사람이 가게 진열대에서 물건을 고르고 있다.']
    ],
    ko: '“우유만 계산하면 돼요”는 물건을 고른 뒤 우유 값을 지불하려는 상황입니다. 성별이나 가게 종류는 대화에 나오지 않습니다.',
    ja: '「우유만 계산하면 돼요」は、品物を選び終え、牛乳の代金を払おうとしている場面です。話し手の性別や店の種類は述べられていません。'
  },
  {
    evidence: '가방이 무거우니까 조심해요.',
    options: [
      ['여자가 여행 가방을 끌고 집을 나가고 있다.', '한 사람이 가방을 가지고 출발하려고 한다.'],
      ['두 사람이 현관에서 택배 상자를 받고 있다.', '두 사람이 현관에서 택배 상자를 받고 있다.'],
      ['여자가 방에서 옷을 가방에 넣고 있다.', '한 사람이 방에서 옷을 가방에 넣고 있다.'],
      ['남자가 여자의 가방을 들어 주고 있다.', '한 사람이 다른 사람의 가방을 들어 주고 있다.']
    ],
    ko: '“이제 출발할게요”와 무거운 가방을 조심하라는 말을 연결하면 가방을 가지고 출발하려는 장면입니다. 성별이나 출발 장소는 특정하지 않습니다.',
    ja: '「이제 출발할게요」と重いかばんへの注意を合わせると、かばんを持って出発しようとする場面です。性別や出発場所は特定されていません。'
  },
  {
    evidence: '지도를 펴 보세요.',
    options: [
      ['두 사람이 공원 벤치에 앉아 지도를 보고 있다.', '두 사람이 길을 확인하려고 지도를 펴려 한다.'],
      ['두 사람이 자전거를 타고 있다.', '두 사람이 자전거를 타고 있다.'],
      ['남자가 혼자 지도를 들고 걷고 있다.', '한 사람이 혼자 지도를 들고 걷고 있다.'],
      ['여자가 벤치에서 책을 읽고 있다.', '한 사람이 벤치에서 책을 읽고 있다.']
    ],
    ko: '“길을 한번 확인해 볼까요?”에 “지도를 펴 보세요”라고 답하므로 함께 길을 확인하려는 상황입니다. 공원이나 벤치에 있다는 정보는 없습니다.',
    ja: '道を確認しようという提案に「지도를 펴 보세요」と答えているため、二人で地図を広げて道を確かめようとする場面です。公園やベンチという情報はありません。'
  },
  {
    evidence: '제가 접시부터 놓을게요.',
    options: [
      ['여자가 식탁 위에 접시를 놓고 있다.', '한 사람이 식탁에 접시를 놓으려 한다.'],
      ['여자가 접시를 씻고 있다.', '한 사람이 접시를 씻고 있다.'],
      ['남자가 음식을 포장하고 있다.', '한 사람이 음식을 포장하고 있다.'],
      ['두 사람이 식당에서 주문하고 있다.', '두 사람이 식당에서 주문하고 있다.']
    ],
    ko: '손님이 오기 전에 식탁을 준비하자는 말에 “제가 접시부터 놓을게요”라고 답합니다. 접시를 놓겠다는 의도를 나타내며 성별은 특정하지 않습니다.',
    ja: '来客前の食卓の準備を提案され、「제가 접시부터 놓을게요」と皿を置く意志を示しています。話し手の性別は特定されていません。'
  }
];
export const speakerActionRepairs = [
  { evidence: '신분증을 보여 주시면 여기에서 바로 고쳐 드릴게요.', old: '신청서의 정보를 수정하고 있다.',
    corrected: '신청서에 잘못 쓴 주소를 수정해 달라고 요청하고 있다.',
    ko: '“수정할 수 있을까요?”는 주소 수정을 요청하는 말입니다. “신분증을 보여 주시면 … 고쳐 드릴게요”는 조건이 충족되면 수정하겠다는 제안이므로 수정이 이미 진행 중이라는 뜻은 아닙니다.',
    ja: '「수정할 수 있을까요?」は住所の訂正の依頼です。「신분증을 보여 주시면 … 고쳐 드릴게요」は条件が満たされた後の対応を申し出ており、既に訂正作業中だとは述べていません。' },
  { evidence: '상태를 확인한 뒤 반납 처리를 해 드리겠습니다.', old: '빌린 장비를 반납하고 있다.',
    corrected: '빌린 장비를 반납하려고 한다.',
    ko: '“오늘 반납하려고 왔어요”가 방문 목적을 직접 말합니다. 상태 확인 후에 반납 처리하겠다고 했으므로 처리가 끝났다고 판단하지 않습니다.',
    ja: '「오늘 반납하려고 왔어요」が訪問目的を示しています。状態確認後に返却処理をすると言っているため、処理が完了したとは判断しません。' },
  { evidence: '다음 주 발표 순서를 바꾸고 싶어서요.', old: '발표 일정을 조정하려고 한다.',
    corrected: '발표 순서를 바꾸려고 한다.',
    ko: '바꾸고 싶은 것은 “다음 주 발표 순서”입니다. 다른 발표자와 먼저 협의하라는 답변도 순서 조정이 아직 확정되지 않았음을 보여 줍니다.',
    ja: '変更したいのは「다음 주 발표 순서」、つまり来週の発表順です。他の発表者との相談を求めているため、変更はまだ確定していません。' },
  { evidence: '구매 영수증이 있으면 날짜를 확인해 드릴게요.', old: '제품의 보증 기간을 확인하고 있다.',
    corrected: '제품의 보증 기간이 남았는지 문의하고 있다.',
    ko: '“보증 기간이 아직 남았는지 확인하고 싶습니다”는 보증 기간에 대한 문의입니다. 영수증이 있으면 확인하겠다는 답변이므로 확인 결과는 아직 나오지 않았습니다.',
    ja: '「보증 기간이 아직 남았는지 확인하고 싶습니다」は保証期間についての問い合わせです。領収書があれば確認すると答えており、確認結果はまだ示されていません。' },
  { evidence: '행사 자원봉사 신청은 어디에서 하나요?', old: '자원봉사 참여를 신청하고 있다.',
    corrected: '자원봉사 신청 방법을 묻고 있다.',
    ko: '“신청은 어디에서 하나요?”는 신청 방법을 묻는 말입니다. 화면에서 희망 시간을 선택하라는 안내가 이어지며, 신청을 완료했다는 내용은 없습니다.',
    ja: '「신청은 어디에서 하나요?」は申込方法を尋ねる言葉です。画面で希望時間を選ぶよう案内しており、申込が完了したとは述べていません。' }
];
export function repairGeneratedKoreanItem(sourceItem) {
  const item = { ...sourceItem, options: repairListeningChoices(sourceItem) };
  if (item.section === 'listening' && ['picture_selection', 'speaker_action'].includes(item.item_type)) {
    const rules = item.item_type === 'picture_selection' ? pictureSelectionRepairs : speakerActionRepairs;
    const rule = rules.find(entry => String(item.audio_script).includes(entry.evidence));
    if (!rule) throw new Error(`Unreviewed listening situation: ${item.id}`);
    const changes = rule.options || [[rule.old, rule.corrected]];
    const [oldAnswer, newAnswer] = changes[0];
    if (![oldAnswer, newAnswer].includes(item.options[item.answer - 1])) throw new Error(`Unexpected situation key: ${item.id}`);
    const replacements = new Map(changes);
    item.options = item.options.map(option => replacements.get(option) || option);
    if (Array.isArray(item.visual_asset_prompt)) item.visual_asset_prompt = item.visual_asset_prompt.map(option => replacements.get(option) || option);
    if (item.item_type === 'speaker_action') {
      item.instruction = '다음을 듣고 대화 상황으로 가장 알맞은 것을 고르십시오.';
      item.prompt = '대화에 나타난 상황으로 가장 알맞은 것을 고르십시오.';
    }
    item.explanation_ko = `정답은 ${item.answer}입니다. ${rule.ko}`;
    item.explanation_ja = `正解は${item.answer}番です。${rule.ja}`;
  }
  // Never apply written-language normalization to the exact audio catalog keys.
  const fields = ['instruction', 'prompt', 'options', 'explanation_ko', 'explanation_ja', 'visual_asset_prompt', 'model_answer', 'rubric'];
  if (item.section !== 'listening') fields.push('passage');
  for (const field of fields) item[field] = repairGeneratedParticles(item[field]);
  return item;
}

export function buildQuestionBank(inputPath = '../upload/02-topik_question_bank.json') {
const input = path.resolve(inputPath);
const partCount = 4;
const outputPattern = (part) => path.join(root, 'data', `question-bank-v1-part${part}.js`);
const manifestPath = path.join(root, 'data', 'question-bank-manifest.json');
const source = JSON.parse(fs.readFileSync(input, 'utf8'));
const items = Array.isArray(source.items) ? source.items.map(repairGeneratedKoreanItem) : [];

if (items.length !== 2088) throw new Error(`Expected 2,088 items, received ${items.length}`);

const sectionCode = { listening: 'l', reading: 'r', writing: 'w' };
const difficultyCode = { easy: 'e', medium: 'm', hard: 'h', very_hard: 'v' };
const noisyProblemHeader = /^\s*[<〈《][^>〉》\n]{2,120}[>〉》]\s*(?:\r?\n|$)/gmu;
const cleanProblemText = (value) => String(value || '').replace(noisyProblemHeader, '').trim();
const seen = new Set();
const rows = items.map((item) => {
  if (!item.id || seen.has(item.id)) throw new Error(`Missing or duplicate id: ${item.id}`);
  seen.add(item.id);
  const writing = item.section === 'writing';
  if (!writing && (item.options?.length !== 4 || !Number.isInteger(item.answer) || item.answer < 1 || item.answer > 4)) {
    throw new Error(`Invalid MCQ: ${item.id}`);
  }
  if (!sectionCode[item.section] || !difficultyCode[item.difficulty]) throw new Error(`Invalid taxonomy: ${item.id}`);
  return [
    item.id,
    item.mock_set,
    item.level === 'TOPIK I' ? 1 : 2,
    sectionCode[item.section],
    item.question_no,
    item.item_type,
    difficultyCode[item.difficulty],
    cleanProblemText(item.instruction),
    cleanProblemText(item.section === 'listening' ? repairListeningScript(item.passage) : item.passage),
    cleanProblemText(item.section === 'listening' ? repairListeningScript(item.audio_script) : item.audio_script),
    cleanProblemText(item.prompt),
    item.options,
    writing ? item.answer : item.answer - 1,
    item.explanation_ko || '',
    item.explanation_ja || '',
    item.target_skills || [],
    item.visual_asset_prompt || null,
    item.model_answer || null,
    item.rubric || null,
    item.stimulus_group || null
  ];
});

const chunkSize = Math.ceil(rows.length / partCount);
const payloads = Array.from({ length: partCount }, (_, index) => {
  const chunk = rows.slice(index * chunkSize, (index + 1) * chunkSize);
  return `/* Generated by scripts/build-question-bank.mjs. Do not edit by hand. */\n(window.MALBIT_QUESTION_BANK_PARTS=window.MALBIT_QUESTION_BANK_PARTS||[]).push(${JSON.stringify(chunk)});\n`;
});
payloads.forEach((payload, index) => fs.writeFileSync(outputPattern(index + 1), payload));
const legacyOutput = path.join(root, 'data', 'question-bank-v1.js');
if (fs.existsSync(legacyOutput)) fs.rmSync(legacyOutput);

const countBy = (fn) => items.reduce((out, item) => {
  const key = fn(item);
  out[key] = (out[key] || 0) + 1;
  return out;
}, {});
const manifest = {
  version: 1,
  generated_at: new Date().toISOString(),
  source_sha256: crypto.createHash('sha256').update(fs.readFileSync(input)).digest('hex'),
  source_provenance: source.source_note || 'Imported source JSON.',
  outputs: payloads.map((payload, index) => ({
    file: path.relative(root, outputPattern(index + 1)),
    bytes: Buffer.byteLength(payload),
    sha256: crypto.createHash('sha256').update(payload).digest('hex')
  })),
  total_items: items.length,
  multiple_choice_items: items.filter((item) => item.options?.length === 4).length,
  writing_items: items.filter((item) => item.section === 'writing').length,
  visual_description_items: items.filter((item) => item.visual_asset_prompt).length,
  by_level_section: countBy((item) => `${item.level}::${item.section}`),
  by_difficulty: countBy((item) => `${item.level}::${item.section}::${item.difficulty}`),
  mode_policy: {
    mock_exam: 'One complete original set, fixed order; 12 sets rotate without changing official-style section volume.',
    random_practice: 'Level-specific adaptive pool; recent IDs are excluded and choices are shuffled.',
    game_regular: 'Lower band for the selected stage and TOPIK level; no repeated ID during an expedition.',
    game_elite: 'Middle-to-upper band for the selected stage and TOPIK level; no repeated ID during an expedition.',
    game_boss: 'Upper band for the selected stage and TOPIK level; no repeated ID during an expedition.',
    shorts: 'Only short vocabulary, grammar, and same-meaning MCQs are mixed into the curated multilingual deck.',
    review: 'The exact bank ID and displayed choice order are retained for retry.'
  }
};
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${rows.length} items to ${partCount} data parts (${payloads.reduce((sum, payload) => sum + Buffer.byteLength(payload), 0).toLocaleString()} bytes)`);
console.log(`Wrote ${path.relative(root, manifestPath)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildQuestionBank(process.argv[2]);
