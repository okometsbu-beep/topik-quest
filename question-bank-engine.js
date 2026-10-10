// MALBIT question bank engine v1
(function () {
  'use strict';

  const partRows = Array.isArray(window.MALBIT_QUESTION_BANK_PARTS) ? window.MALBIT_QUESTION_BANK_PARTS.flat() : null;
  const raw = window.MALBIT_QUESTION_BANK_RAW || (partRows ? { version: 1, total: partRows.length, rows: partRows } : null);
  if (!raw || !Array.isArray(raw.rows) || raw.total !== raw.rows.length) {
    console.error('[MALBIT bank] data missing');
    return;
  }

  const SECTION = { l: 'listening', r: 'reading', w: 'writing' };
  const DIFFICULTY = { e: 'easy', m: 'medium', h: 'hard', v: 'very_hard' };
  const RANK = { easy: 1, medium: 2, hard: 3, very_hard: 4 };
  const SYMBOLS = ['①', '②', '③', '④'];
  // Shorts is lexical recall only; sentence paraphrase and grammar stay in full practice.
  const SHORT_TYPES = new Set(['vocabulary_blank']);
  const NOISY_PROBLEM_HEADER = /^\s*[<〈《][^>〉》\n]{2,120}[>〉》]\s*(?:\r?\n|$)/gmu;
  const cleanProblemText = (value) => String(value || '').replace(NOISY_PROBLEM_HEADER, '').trim();
  const ITEM_GROUPS = {
    response: '응답', follow_up: '응답', follow_up_response: '응답', place_identification: '장소',
    topic_identification: '중심', picture_selection: '그림 선택', content_match: '내용', detail_match: '세부',
    long_content_match: '긴 글', reason_purpose: '목적', long_reason: '긴 대화', speaker_purpose: '목적',
    speaker_action: '세부', speaking_method: '말하기 방식', vocabulary_blank: '어휘·문법',
    grammar_blank: '어휘·문법', same_meaning: '어휘', sign_purpose: '표지·안내',
    notice_mismatch: '표지·안내', short_content_match: '짧은 글', main_idea: '중심 내용',
    advanced_main_idea: '중심 내용', main_idea_advanced: '중심 내용', blank_inference: '빈칸',
    sentence_order: '순서', sentence_insertion: '문장 삽입', sentence_insertion_long: '문장 삽입',
    paired_passage: '긴 글', paired_long_passage: '긴 글', practical_text: '실용문',
    practical_information: '실용문', medium_passage_pair: '긴 글', long_passage_pair: '긴 글',
    final_passage_pair: '긴 글', paired_vocabulary_main: '어휘', paired_idiom_main: '숙어',
    narrative_detail: '세부', headline_interpretation: '제목', passage_detail: '세부',
    author_stance: '태도', long_detail_pair: '긴 글', long_inference_pair: '긴 글',
    academic_reasoning: '학술 추론'
  };

  const rows = raw.rows;
  const reviewedCoach = window.MALBIT_EXPLANATIONS?.bankCoach || {};
  const rowItem = (row) => ({
    id: row[0], set: Number(row[1]), level: Number(row[2]), section: SECTION[row[3]], no: Number(row[4]),
    itemType: row[5], difficulty: DIFFICULTY[row[6]], difficultyRank: RANK[DIFFICULTY[row[6]]] || 1,
    instruction: cleanProblemText(row[7]), passage: cleanProblemText(row[8]), script: cleanProblemText(row[9]), prompt: cleanProblemText(row[10]), options: row[11],
    answerIndex: row[3] === 'w' ? null : Number(row[12]), acceptedAnswer: row[3] === 'w' ? row[12] : null,
    explanationKo: row[13], explanationJa: row[14], targetSkills: row[15] || [], visual: row[16],
    model: row[17], rubric: row[18], stimulusGroup: row[19] || null, coach: reviewedCoach[row[0]] || null
  });
  const authoredItem = (source) => ({
    id:String(source.id||''),set:Number(source.set)||0,level:Number(source.level)===1?1:2,section:String(source.section||'reading'),no:Number(source.no)||0,
    itemType:String(source.itemType||'content_match'),difficulty:String(source.difficulty||'medium'),difficultyRank:RANK[String(source.difficulty||'medium')]||2,
    instruction:cleanProblemText(source.instruction),passage:cleanProblemText(source.passage),script:cleanProblemText(source.script),prompt:cleanProblemText(source.prompt),
    options:Array.from(source.options||[]),answerIndex:Number(source.answerIndex),acceptedAnswer:null,
    explanationKo:String(source.explanationKo||source.coach?.ko?.reason||''),explanationJa:String(source.explanationJa||source.coach?.ja?.reason||''),
    targetSkills:Array.from(source.targetSkills||[]),visual:null,model:null,rubric:null,stimulusGroup:null,coach:source.coach||null
  });
  const expansion=Array.isArray(window.MALBIT_QUESTION_BANK_EXPANSION)?window.MALBIT_QUESTION_BANK_EXPANSION:[];
  const items=[...rows.map(rowItem),...expansion.map(authoredItem)];
  const uniqueIds=new Set();
  for(const item of items){
    if(!item.id||uniqueIds.has(item.id))throw new Error(`[MALBIT bank] missing or duplicate id: ${item.id}`);
    if(item.section!=='writing'&&(item.options.length!==4||!Number.isInteger(item.answerIndex)||item.answerIndex<0||item.answerIndex>3))throw new Error(`[MALBIT bank] invalid authored MCQ: ${item.id}`);
    uniqueIds.add(item.id);
  }
  const byId = new Map(items.map((item) => [item.id, item]));
  const identity = Object.freeze([0, 1, 2, 3]);

  function cleanOrder(order, count = 4) {
    if (!Array.isArray(order) || order.length !== count) return [...Array(count).keys()];
    const next = order.map(Number);
    return new Set(next).size === count && next.every((value) => value >= 0 && value < count) ? next : [...Array(count).keys()];
  }
  function shuffledOrder(count = 4) {
    const order = [...Array(count).keys()];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    if (count > 1 && order.every((value, index) => value === index)) order.push(order.shift());
    return order;
  }
  function freshOrder(id) {
    const item = byId.get(String(id));
    if (!item || item.section === 'writing') return [];
    const key = `malbitBankAnswerSlot:${item.id}`;
    let previous = item.answerIndex;
    try { const saved = Number(localStorage.getItem(key)); if (Number.isInteger(saved) && saved >= 0) previous = saved; } catch (error) {}
    let order = shuffledOrder(item.options.length), slot = order.indexOf(item.answerIndex), tries = 0;
    while (slot === previous && tries++ < 16) { order = shuffledOrder(item.options.length); slot = order.indexOf(item.answerIndex); }
    if (slot === previous) { order.push(order.shift()); slot = order.indexOf(item.answerIndex); }
    try { localStorage.setItem(key, String(slot)); } catch (error) {}
    return order;
  }
  function recommendedSeconds(item) {
    const chars = `${item.passage || ''}${item.script || ''}${item.prompt || ''}${(item.options || []).join('')}`.length;
    const base = item.section === 'listening' ? 35 : item.section === 'writing' ? (item.no <= 52 ? 180 : item.no === 53 ? 600 : 1800) : 32;
    return Math.max(base, Math.round(base + Math.max(0, chars - 55) * (item.section === 'listening' ? .22 : .16) + item.difficultyRank * 5));
  }
  const RESPONSE_TYPES = new Set(['response', 'follow_up', 'follow_up_response']);
  const MATCH_TYPES = new Set(['content_match', 'detail_match', 'long_content_match', 'short_content_match', 'advanced_content_match', 'passage_detail', 'narrative_detail']);
  const PURPOSE_TYPES = new Set(['speaker_purpose']);
  const REASON_TYPES = new Set(['reason_purpose', 'long_reason']);
  const MAIN_TYPES = new Set(['main_idea', 'advanced_main_idea', 'main_idea_advanced', 'academic_reasoning']);
  const PRACTICAL_TYPES = new Set(['sign_purpose', 'practical_text', 'practical_information']);
  const INFERENCE_TYPES = new Set(['blank_inference', 'paired_passage', 'paired_long_passage', 'medium_passage_pair', 'long_passage_pair', 'final_passage_pair', 'long_detail_pair', 'long_inference_pair']);
  const VOCAB_TYPES = new Set(['vocabulary_blank', 'paired_vocabulary_main', 'paired_idiom_main']);
  const STOP_WORDS = new Set('것 수 이 그 저 은 는 이 가 을 를 에 에서 로 으로 와 과 도 만 의 한 하다 있다 없다 되다 아니다 그리고 그러나 그래서 다음 내용 글 대화 보기 선택지 정답 가장 알맞은'.split(' '));

  function cleanChoice(value) { return String(value || '').replace(/^\s*[①②③④]\s*/u, '').trim(); }
  // Do not append a second full stop to quoted Korean sentences.
  function sentenceQuote(value) {
    const text = String(value || '').trim();
    return `“${text}”${/[.!?。！？]$/u.test(text) ? '' : '.'}`;
  }
  function cleanEvidence(value) {
    // Remove known dialogue labels only. A generic colon rule destroys 07:00–21:00 and notice facts.
    return cleanProblemText(value).replace(/(^|\n)\s*(?:[가-힣]{2,8}\([^()\n]{1,40}\)|남자|여자|직원|손님|사회자|학생|교사|A|B)\s*:\s*/gu, '$1').replace(/\s+/gu, ' ').trim();
  }
  function tokens(value) {
    return [...new Set((String(value || '').match(/[가-힣]{2,}|[A-Za-z]{2,}|\d+(?:[.,]\d+)?%?/gu) || [])
      .map((token) => {
        const lower = token.toLowerCase();
        const stem = lower.replace(/(?:에서는|으로는|에게는|에서|으로|에게|은|는|이|가|을|를|의|도|만|에)$/u, '');
        return /^[가-힣]{2,}$/u.test(stem) ? stem : lower;
      }).filter((token) => !STOP_WORDS.has(token)))];
  }
  function explanationMode(item) {
    const question = `${item.instruction || ''} ${item.prompt || ''}`;
    if (RESPONSE_TYPES.has(item.itemType)) return 'response';
    if (item.itemType === 'place_identification') return 'place';
    if (item.itemType === 'topic_identification') return 'topic';
    if (item.itemType === 'picture_selection') return 'picture';
    if (item.itemType === 'speaker_action') return 'action';
    if (item.itemType === 'notice_mismatch' || /(?:일치하지|맞지 않|틀린|아닌|않은)\s*(?:것|내용|문장)/u.test(question)) return 'mismatch';
    if (item.itemType === 'grammar_blank') return 'grammar';
    if (item.itemType === 'vocabulary_blank') return 'vocabulary';
    if (item.itemType === 'same_meaning') {
      return (item.targetSkills || []).some((skill) => /(?:관용|표현|숙어)/u.test(String(skill))) ? 'wordmeaning' : 'paraphrase';
    }
    if (item.itemType === 'headline_interpretation') return 'headline';
    if (item.itemType === 'sentence_order') return 'order';
    if (item.itemType === 'sentence_insertion' || item.itemType === 'sentence_insertion_long') return 'insertion';
    if (/문맥상\s*가장\s*가까운\s*의미/u.test(question)) return 'wordmeaning';
    if (/내용에\s*알맞은\s*표현/u.test(question)) return 'main';
    if (/글의\s*전개\s*방식|말하는\s*방식/u.test(question) || item.itemType === 'speaking_method') return 'presentation';
    if (/글쓴이의\s*태도/u.test(question)) return 'stance';
    if (/중심\s*(?:생각|내용)|글의\s*요지|글의\s*주제|말하고자\s*하는\s*바|글쓴이의\s*생각/u.test(question)) return 'main';
    if (/이유|원인|계기/u.test(item.prompt || '')) return 'reason';
    if (/목적/u.test(item.prompt || '') || PURPOSE_TYPES.has(item.itemType)) return 'purpose';
    if (REASON_TYPES.has(item.itemType)) return 'reason';
    if (/내용과\s*같은|내용으로\s*알\s*수|들은\s*내용과\s*같은/u.test(question) || MATCH_TYPES.has(item.itemType)) return 'match';
    if (/추론|통해\s*알\s*수|들어갈/u.test(item.prompt || '')) return 'inference';
    if (item.itemType === 'author_stance') return 'stance';
    if (MAIN_TYPES.has(item.itemType)) return 'main';
    if (PRACTICAL_TYPES.has(item.itemType)) return 'practical';
    if (VOCAB_TYPES.has(item.itemType)) return 'wordmeaning';
    if (INFERENCE_TYPES.has(item.itemType)) return 'inference';
    return 'general';
  }
  function evidenceSource(item) { return cleanEvidence(item.script || item.passage || item.prompt || item.instruction); }
  function hasInferenceBlank(item) { return /\(\s*(?:㉠|㉡)?\s*\)/u.test(item.passage || ''); }
  function bestEvidence(item, answer) {
    const source = evidenceSource(item);
    if (!source) return '';
    const mode = explanationMode(item);
    // Keep whole sentences and short notices. Never trim away a decisive condition mid-sentence.
    if (['response', 'place', 'topic', 'picture', 'action', 'paraphrase', 'headline', 'grammar', 'vocabulary', 'order', 'insertion', 'mismatch', 'practical', 'presentation'].includes(mode)) return source;
    const wanted = new Set(tokens(answer));
    const parts = source.split(/(?<=[.!?。！？])\s+|\n+/u).map((part) => part.trim()).filter(Boolean);
    const literal = cleanChoice(answer).replace(/[.!?。！？]$/u, '');
    const exact = literal.length > 4 && parts.find((part) => part.includes(literal));
    if (exact) return exact;
    if (mode === 'wordmeaning') {
      const target = String(item.prompt || '').match(/[“"]([^”"]+)[”"]/u)?.[1];
      const direct = target && parts.find((part) => part.includes(target));
      if (direct) return direct;
    }
    if (mode === 'stance') {
      const pivot = parts.findIndex((part) => /(?:그렇지만|하지만|그러나)/u.test(part));
      if (pivot >= 0) return parts.slice(pivot).join(' ');
    }
    let best = '', bestScore = 0;
    for (const part of parts) {
      const hits = tokens(part).reduce((score, token) => score + (wanted.has(token) ? 1 : 0), 0);
      const conclusion = /(?:따라서|결국|이처럼)/u.test(part) && ['main', 'purpose', 'inference'].includes(mode) ? 1 : 0;
      const score = hits * 20 + conclusion * 10;
      if (score > bestScore) { best = part; bestScore = score; }
    }
    // Lexical overlap is only a retrieval hint, not proof. With weak overlap retain all context.
    return bestScore >= 40 ? best : source;
  }
  function completedBlank(item, answer) {
    const source = cleanEvidence(item.passage || item.prompt);
    return source.replace(/\(\s*(?:㉠|㉡)?\s*\)/u, answer);
  }
  function answerPositionLine(number) {
    return {
      ko: `현재 보기 순서에서는 ${number}번이 정답입니다.`,
      ja: `現在の選択肢では${number}番が正解です。`,
      en: `In the current choice order, option ${number} is correct.`,
      zh: `按当前选项顺序，第${number}项是正确答案。`
    };
  }
  function writingExplanation(item) {
    const task = cleanEvidence(item.prompt || item.passage).slice(0, 150);
    const skills = (item.targetSkills || []).join(' · ');
    const plans = {
      writing_short_fill_practical: {
        ko:'① 앞뒤 문장에서 보내는 사람과 받는 사람의 관계를 확인하고 ② 요청·안내의 핵심 정보를 한 칸에 하나씩 넣은 뒤 ③ 높임말과 문장 끝맺음을 통일합니다.',
        ja:'①前後の文から送り手と受け手の関係を確認し、②依頼・案内の核心情報を一つの空欄に一つずつ入れ、③敬語と文末を統一します。',
        en:'1) Identify sender and recipient. 2) Put one required request or notice in each blank. 3) Keep honorifics and endings consistent.',
        zh:'①确认发件人与收件人的关系；②每个空格只填一个核心请求或通知；③统一敬语和句尾。'
      },
      writing_short_fill_expository: {
        ko:'① 빈칸 앞뒤의 공통 명사를 찾고 ② 원인·결과·대조 중 연결 관계를 정한 뒤 ③ 본문 표현을 짧게 바꾸어 문법적으로 완결된 절을 씁니다.',
        ja:'①空欄前後の共通名詞を探し、②原因・結果・対比のどの関係かを決め、③本文の表現を短く言い換えて文法的に完結した節を書きます。',
        en:'1) Find shared keywords around the blank. 2) Decide cause, result, or contrast. 3) Paraphrase the source as a complete clause.',
        zh:'①找空格前后的共同关键词；②判断因果或对比关系；③简洁改写原文，写成语法完整的分句。'
      },
      writing_graph_summary: {
        ko:'① 전체 증가·감소 흐름을 첫 문장에 쓰고 ② 최고·최저나 큰 변화 수치를 비교하며 ③ 제시된 원인을 덧붙입니다. 자료에 없는 의견은 넣지 않습니다.',
        ja:'①全体の増減傾向を最初に書き、②最高・最低または大きな変化の数値を比較し、③提示された原因を加えます。資料にない意見は書きません。',
        en:'1) State the overall trend. 2) Compare key highs, lows, or changes with figures. 3) Add the given cause without unsupported opinions.',
        zh:'①先写总体增减趋势；②用数字比较最高、最低或主要变化；③补充材料给出的原因，不添加无依据的观点。'
      },
      writing_essay: {
        ko:'① 질문의 세부 요구를 서론의 주장으로 묶고 ② 본론마다 이유와 구체적 예를 하나씩 제시한 뒤 ③ 반론·대안 또는 실천 방안으로 결론을 닫습니다. 600~700자와 격식체를 지킵니다.',
        ja:'①設問の細部を序論の主張にまとめ、②各本論に理由と具体例を一つずつ示し、③反論・代案または実践案で結論を閉じます。600～700字と書き言葉を守ります。',
        en:'1) Turn every sub-prompt into a thesis. 2) Give one reason and concrete example per body paragraph. 3) Conclude with a counterpoint, alternative, or action while keeping 600–700 characters and formal style.',
        zh:'①把各项要求整合成开头论点；②每段给出一个理由和具体例子；③用反驳、替代方案或行动建议收束，并保持600～700字和书面语。'
      }
    };
    const plan=plans[item.itemType]||plans.writing_essay;
    const sourceKo=String(item.explanationKo||'').trim();
    const sourceJa=String(item.explanationJa||'').trim().replace(/\.$/u,'。');
    return {
      ko: `【문제 요구】“${task}”의 조건을 빠짐없이 반영합니다.\n【답안 설계】${sourceKo||'제시된 정보의 관계를 먼저 정리한 뒤 필요한 내용만 자연스러운 문장으로 씁니다.'}\n【유형별 작성법】${plan.ko}${skills?` 채점 핵심: ${skills}.`:''}`,
      ja: `【設問の要求】「${task}」の条件を漏れなく反映します。\n【解答設計】${sourceJa||'提示された情報の関係を整理してから、必要な内容だけを自然な文で書きます。'}\n【タイプ別の書き方】${plan.ja}`,
      en: `【Task requirements】Cover every condition in “${task}.”\n【Answer design】Organize the relationship among the given facts, then write only the required information in natural sentences.\n【Type-specific method】${plan.en}`,
      zh: `【题目要求】完整回应“${task}”中的全部条件。\n【答案设计】先整理材料之间的关系，再用自然句子写出必要信息。\n【题型写法】${plan.zh}`
    };
  }
  function explanationReason(item, answer, evidence) {
    const mode = explanationMode(item), filled = completedBlank(item, answer);
    const reasons = {
      response: {
        ko: `앞말 “${evidence}”의 질문·제안·요청이나 상황 설명에 “${answer}”가 직접 반응하므로 대화가 가장 자연스럽게 이어집니다.`,
        ja: `直前の発話「${evidence}」の質問・提案・依頼や状況説明に「${answer}」が直接応じているため、会話が最も自然につながります。`,
        en: `“${answer}” directly responds to the question, suggestion, request, or situation in “${evidence},” so it completes the exchange naturally.`,
        zh: `“${answer}”直接回应了“${evidence}”中的提问、建议、请求或情况说明，因此对话衔接最自然。`
      },
      place: {
        ko: `대화의 단서 “${evidence}”에서 이루어지는 행동과 서비스를 보면 정답 장소는 “${answer}”입니다.`,
        ja: `会話の手掛かり「${evidence}」で行われている行動やサービスが、場所「${answer}」と一致します。`,
        en: `The action and service described in “${evidence}” identify the place as ${sentenceQuote(answer)}`,
        zh: `对话线索“${evidence}”中的行为和服务与场所“${answer}”相符。`
      },
      topic: {
        ko: `대화의 핵심 내용 “${evidence}”를 묶으면 주제는 “${answer}”입니다.`,
        ja: `会話の中心となる内容「${evidence}」をまとめると、話題は「${answer}」です。`,
        en: `The key ideas in “${evidence}” show that the topic is ${sentenceQuote(answer)}`,
        zh: `归纳对话“${evidence}”中的核心信息，可知话题是“${answer}”。`
      },
      picture: {
        ko: `음성의 행동과 상황 “${evidence}”를 그대로 나타낸 장면이 “${answer}”입니다.`,
        ja: `音声の動作と状況「${evidence}」をそのまま表している場面が「${answer}」です。`,
        en: `“${answer}” is the scene that matches the action and situation described in ${sentenceQuote(evidence)}`,
        zh: `“${answer}”所描绘的场景与音频中的行为和情境“${evidence}”一致。`
      },
      action: {
        ko: `대화의 핵심 목적어와 동작 “${evidence}”를 같은 주체·시제로 바꾸어 말한 행동이 “${answer}”입니다.`,
        ja: `会話の中心となる目的語と動作「${evidence}」を、同じ主体・時制で言い換えた行動が「${answer}」です。`,
        en: `“${answer}” restates the key object and action in “${evidence}” with the same actor and time frame.`,
        zh: `“${answer}”用相同的主体和时态概括了“${evidence}”中的核心对象与动作。`
      },
      mismatch: {
        ko: `이 문제는 내용과 일치하지 않는 보기를 찾는 문제입니다. 근거 “${evidence}”와 달리 “${answer}”는 본문에서 확인되지 않거나 반대되는 내용이므로 정답입니다.`,
        ja: `この問題は内容と一致しない選択肢を選ぶ問題です。根拠「${evidence}」に対して「${answer}」は本文で確認できないか、反対の内容なので正解です。`,
        en: `This asks for the option that does not match. Unlike the evidence “${evidence},” “${answer}” is unsupported or contradicts the source, so it is the answer.`,
        zh: `本题要求选择与原文不符的一项。与依据“${evidence}”相比，“${answer}”在原文中没有依据或与原意相反，因此应选它。`
      },
      match: {
        ko: `근거 “${evidence}”와 “${answer}”의 시간·대상·행동·조건이 일치합니다.`,
        ja: `根拠「${evidence}」と「${answer}」の時刻・対象・行動・条件が一致しています。`,
        en: `The time, subject, action, and condition in “${answer}” match the evidence ${sentenceQuote(evidence)}`,
        zh: `“${answer}”中的时间、对象、行为和条件与依据“${evidence}”一致。`
      },
      reason: {
        ko: `근거 “${evidence}”에서 질문이 묻는 행동·상황의 원인이나 계기를 확인하면 “${answer}”입니다.`,
        ja: `根拠「${evidence}」から、設問で問われた行動・状況の理由やきっかけを確認すると、「${answer}」です。`,
        en: `The evidence “${evidence}” identifies “${answer}” as the reason or trigger for the action or situation asked about.`,
        zh: `根据依据“${evidence}”，题目所问行为或情况的原因、契机是“${answer}”。`
      },
      purpose: {
        ko: `근거 “${evidence}”에서 드러나는 이유나 전달 의도를 가장 정확히 정리한 것이 “${answer}”입니다.`,
        ja: `根拠「${evidence}」に表れた理由や伝達意図を最も正確にまとめたものが「${answer}」です。`,
        en: `“${answer}” most accurately states the reason or communicative purpose shown in ${sentenceQuote(evidence)}`,
        zh: `“${answer}”最准确地概括了依据“${evidence}”所体现的原因或表达目的。`
      },
      grammar: {
        ko: `“${answer}”를 넣으면 “${filled}”가 되어 앞뒤 말의 문법적 관계와 문장 의미가 모두 자연스럽습니다.`,
        ja: `「${answer}」を入れると「${filled}」となり、前後の文法関係と文の意味がともに自然です。`,
        en: `With “${answer},” the sentence becomes “${filled},” which is both grammatically and semantically natural.`,
        zh: `填入“${answer}”后，句子成为“${filled}”，前后语法关系和句意都自然成立。`
      },
      vocabulary: {
        ko: `빈칸의 정답은 “${answer}”입니다. 완성한 문장 “${filled}”가 문맥에 맞고 어휘 결합도 자연스럽습니다.`,
        ja: `「${answer}」を入れた「${filled}」が文脈に合い、語の組み合わせも自然です。`,
        en: `“${filled},” completed with “${answer},” fits the context and forms a natural word combination.`,
        zh: `填入“${answer}”后的“${filled}”符合语境，词语搭配也自然。`
      },
      wordmeaning: {
        ko: `본문의 앞뒤 문맥 “${evidence}”에서 해당 어휘·숙어가 나타내는 뜻이나 기능과 가장 가까운 표현이 “${answer}”입니다.`,
        ja: `前後の文脈「${evidence}」で、その語彙・慣用表現が表す意味や働きに最も近いものが「${answer}」です。`,
        en: `In the context “${evidence},” “${answer}” is closest to the meaning or function of the target word or idiom.`,
        zh: `结合上下文“${evidence}”，“${answer}”最接近目标词语或熟语在文中的含义与作用。`
      },
      paraphrase: {
        ko: `원문 “${evidence}”와 “${answer}”는 주체·행동·시간 관계가 같고 표현만 다릅니다.`,
        ja: `原文「${evidence}」と「${answer}」は主体・行動・時間関係が同じで、表現だけが異なります。`,
        en: `“${answer}” preserves the subject, action, and time relationship of “${evidence}” while changing only the wording.`,
        zh: `“${answer}”与原句“${evidence}”的主体、行为和时间关系相同，只是表达方式不同。`
      },
      headline: {
        ko: `신문 제목 “${evidence}”에 나온 주체와 행동·변화를 완전한 문장으로 풀어 쓴 것이 “${answer}”입니다.`,
        ja: `新聞見出し「${evidence}」の主体と動作・変化を完全な文に言い換えたものが「${answer}」です。`,
        en: `“${answer}” expands the stated action or change compressed in the headline ${sentenceQuote(evidence)}`,
        zh: `“${answer}”用完整句子展开了标题“${evidence}”中省略表达的主体、行为或变化。`
      },
      main: {
        ko: `핵심 근거 “${evidence}”를 세부 사례까지 포괄해 요약한 중심 생각이 “${answer}”입니다.`,
        ja: `中心となる根拠「${evidence}」を細部の例まで含めて要約した主張が「${answer}」です。`,
        en: `“${answer}” states the main idea that summarizes the key evidence “${evidence}” and the supporting details.`,
        zh: `“${answer}”概括了核心依据“${evidence}”及相关细节，是文章的中心思想。`
      },
      order: {
        ko: `“${answer}”의 순서대로 배열하면 문장 사이의 시간 순서나 설명·근거·결론의 연결이 자연스럽습니다.`,
        ja: `「${answer}」の順に並べると、文どうしの時間順や、説明・根拠・結論のつながりが自然です。`,
        en: `The order “${answer}” creates a coherent chronology or a logical connection between explanation, evidence, and conclusion.`,
        zh: `按“${answer}”排列，句间的时间顺序或说明、依据、结论之间的逻辑衔接最自然。`
      },
      insertion: {
        ko: `삽입 문장 “${cleanEvidence(String(item.prompt || '').replace(/^삽입 문장:\s*/u, ''))}”의 지시어·접속 표현과 앞뒤 논리 관계를 보면 “${answer}” 위치가 가장 자연스럽습니다.`,
        ja: `挿入文「${cleanEvidence(String(item.prompt || '').replace(/^삽입 문장:\s*/u, ''))}」の指示語・接続表現と前後の論理関係を見ると、「${answer}」の位置が最も自然です。`,
        en: `The reference words, connectors, and surrounding logic of “${cleanEvidence(String(item.prompt || '').replace(/^삽입 문장:\s*/u, ''))}” make position “${answer}” the most coherent.`,
        zh: `根据插入句“${cleanEvidence(String(item.prompt || '').replace(/^삽입 문장:\s*/u, ''))}”的指示词、连接表达和前后逻辑，放在“${answer}”处最自然。`
      },
      presentation: {
        ko: `말이나 글 “${evidence}”에서 설명·사례·비교·한계·대안이 연결되는 방식을 나타낸 것이 “${answer}”입니다.`,
        ja: `話や文章「${evidence}」で、説明・例・比較・限界・代案がどのようにつながるかを表すものが「${answer}」です。`,
        en: `“${answer}” describes how explanations, examples, comparisons, limitations, or alternatives are connected in ${sentenceQuote(evidence)}`,
        zh: `“${answer}”概括了“${evidence}”中说明、例子、比较、局限或方案的组织方式。`
      },
      stance: {
        ko: `말이나 글의 전개 “${evidence}”에서 드러난 태도·설명 방식과 정확히 맞는 표현이 “${answer}”입니다.`,
        ja: `話や文章の展開「${evidence}」から分かる態度・説明方法に正確に合う表現が「${answer}」です。`,
        en: `“${answer}” accurately describes the attitude or method of presentation shown in ${sentenceQuote(evidence)}`,
        zh: `“${answer}”准确概括了“${evidence}”所体现的态度或表达方式。`
      },
      practical: {
        ko: `실용문의 핵심 안내 “${evidence}”가 요구하는 행동·대상·조건을 정확히 정리한 것이 “${answer}”입니다.`,
        ja: `実用文の中心的な案内「${evidence}」が示す行動・対象・条件を正確にまとめたものが「${answer}」です。`,
        en: `“${answer}” accurately captures the action, audience, and condition stated in the practical text ${sentenceQuote(evidence)}`,
        zh: `“${answer}”准确概括了实用文本“${evidence}”中的行为、对象和条件。`
      },
      inference: hasInferenceBlank(item) ? {
        ko: `“${answer}”로 빈칸을 완성하면 “${filled}”가 되어 빈칸 앞뒤의 문맥이 논리적으로 이어집니다.`,
        ja: `「${answer}」で空欄を補うと「${filled}」となり、空欄前後の文脈が論理的につながります。`,
        en: `Filling the blank with “${answer}” gives “${filled},” which logically connects the context before and after the blank.`,
        zh: `用“${answer}”补全后成为“${filled}”，空格前后的语境在逻辑上自然衔接。`
      } : {
        ko: `본문의 근거 “${evidence}”에서 직접 확인하거나 논리적으로 도출할 수 있는 결론이 “${answer}”입니다.`,
        ja: `本文の根拠「${evidence}」から直接確認、または論理的に導ける結論が「${answer}」です。`,
        en: `“${answer}” is the conclusion directly supported by or logically inferred from the evidence ${sentenceQuote(evidence)}`,
        zh: `“${answer}”是可以从原文依据“${evidence}”直接确认或合理推导出的结论。`
      },
      general: {
        ko: `문제의 근거 “${evidence}”와 질문의 조건을 함께 확인하면 “${answer}”가 가장 알맞습니다.`,
        ja: `問題の根拠「${evidence}」と設問の条件を合わせて確認すると、「${answer}」が最も適切です。`,
        en: `Considering the evidence “${evidence}” together with the question, “${answer}” is the best answer.`,
        zh: `结合题目依据“${evidence}”和设问条件，“${answer}”最恰当。`
      }
    };
    return reasons[mode] || reasons.general;
  }
  function instructorTrap(item){
    const mode=explanationMode(item),packs={
      response:{ko:'질문의 의문사와 말하기 기능을 바꾼 보기는 자연스러워 보여도 직접 응답이 아닙니다.',ja:'疑問詞と発話の働きを変えた選択肢は、自然に見えても直接の返答ではありません。',en:'A choice that changes the question word or speech act may sound natural but does not answer directly.',zh:'改变疑问词或言语功能的选项即使听起来自然，也不是直接回答。'},
      place:{ko:'대화에 나온 한 단어만 보고 장소를 고르지 말고, 그곳에서 하는 행동과 서비스를 함께 확인합니다.',ja:'会話に出た一語だけで場所を決めず、そこで行う行動とサービスを一緒に確認します。',en:'Do not choose a place from one word alone; match both the action and service.',zh:'不要只凭一个词判断场所，要同时核对行为和服务。'},
      topic:{ko:'장소·사람 같은 주변 명사보다 대화에서 반복되거나 새로 바뀐 정보를 중심으로 잡습니다.',ja:'場所・人物などの周辺名詞より、会話で繰り返される情報や新しく変わった情報を中心にします。',en:'Prioritize repeated or newly changed information over incidental nouns such as places or people.',zh:'比起场所、人物等附带名词，应优先抓住反复出现或发生变化的信息。'},
      picture:{ko:'대화에 나온 한 단어만 같은 그림보다 주체·물건·동작·방향이 모두 맞는 장면을 고릅니다.',ja:'会話に出た一語だけが同じ絵ではなく、主体・物・動作・方向がすべて合う場面を選びます。',en:'Do not match one noun alone; the actor, object, action, and direction must all fit.',zh:'不要只匹配一个名词，人物、物品、动作和方向必须全部一致。'},
      action:{ko:'같은 소재라도 누가 무엇을 이미 했는지, 지금 하는지, 앞으로 할지가 다르면 오답입니다.',ja:'同じ話題でも、誰が何をすでにしたか、今しているか、これからするかが違えば誤答です。',en:'A choice is wrong if it changes who performs the action or whether it is past, current, or next.',zh:'即使话题相同，只要改变了动作主体或已做、正在做、将要做的时态，就是错项。'},
      mismatch:{ko:'부정 표현을 놓치면 맞는 보기를 고르게 됩니다. 세 보기가 근거와 맞는지 확인한 뒤 남는 모순을 고릅니다.',ja:'否定表現を見落とすと一致する選択肢を選んでしまいます。三つが根拠と合うことを確認し、残る矛盾を選びます。',en:'Missing the negative reverses the task. Verify three matching choices, then select the remaining contradiction.',zh:'忽略否定词会把题目做反；先确认三项与原文相符，再选剩下的矛盾项。'},
      match:{ko:'시간·대상·수량·긍정/부정 중 하나만 바꾼 보기가 대표적인 함정입니다.',ja:'時間・対象・数量・肯定／否定のうち一つだけを変えた選択肢が典型的なひっかけです。',en:'A typical distractor changes just one axis: time, subject, quantity, or polarity.',zh:'典型干扰项只改动一个要素：时间、对象、数量或肯否。'},
      reason:{ko:'질문이 묻는 행동의 이유와 그 뒤에 생긴 결과·현재 상태·미래 계획을 구분합니다.',ja:'問われた行動の理由を、その後の結果・現在の状態・今後の予定と区別します。',en:'Distinguish the reason for the asked-about action from later results, the current situation, and future plans.',zh:'区分题目所问行为的原因与后续结果、当前情况及未来计划。'},
      purpose:{ko:'소재가 무엇인지가 아니라, 마지막에 상대에게 무엇을 요청·설명·설득하는지를 봅니다.',ja:'話題が何かではなく、最後に相手へ何を依頼・説明・説得しているかを見ます。',en:'Look beyond the topic and identify what the speaker ultimately requests, explains, or persuades.',zh:'不要只看谈论的主题，要看说话者最终想请求、说明或说服什么。'},
      grammar:{ko:'뜻이 비슷해 보여도 앞말의 품사·받침과 뒤 절의 논리 관계가 맞지 않으면 탈락입니다.',ja:'意味が似ていても、前の語の品詞・パッチムと後続節との論理関係が合わなければ除外します。',en:'Eliminate choices whose attachment or clause relationship is wrong, even if their broad meaning seems similar.',zh:'即使大意相近，只要接续形式或前后分句关系不对就应排除。'},
      vocabulary:{ko:'사전 뜻만 비슷한 단어보다 문장 속 목적어·부사와 자연스럽게 결합하는 단어를 고릅니다.',ja:'辞書的な意味が似た語より、文中の目的語・副詞と自然に結びつく語を選びます。',en:'Prefer the word that forms a natural collocation with the sentence, not merely a loose synonym.',zh:'不要只看词典释义相近，要选择与句中宾语、状语搭配自然的词。'},
      wordmeaning:{ko:'숙어를 구성 단어의 문자 뜻으로 풀거나 문맥의 감정 방향을 반대로 바꾼 보기를 조심합니다.',ja:'慣用表現を構成語の字面どおりに解釈したり、文脈の感情方向を逆にした選択肢に注意します。',en:'Beware literal readings of idioms and choices that reverse the context’s emotional direction.',zh:'注意把惯用语按字面解释，或把语境的感情色彩反转的选项。'},
      paraphrase:{ko:'주체·시제·부정·원인과 결과 중 하나라도 달라지면 같은 의미가 아닙니다.',ja:'主体・時制・否定・原因と結果のどれか一つでも変われば同じ意味ではありません。',en:'A change in subject, tense, negation, or cause and result means the sentence is not equivalent.',zh:'主体、时态、否定或因果任一改变，都不再是同义表达。'},
      headline:{ko:'제목에 없는 원인이나 결과를 추측해 더하지 않습니다. 제목에 제시된 사실과 관계만 복원합니다.',ja:'見出しにない原因や結果を推測で加えません。示されている事実と関係だけを文に戻します。',en:'Do not invent a cause or result absent from the headline; restore only its stated facts and relationships.',zh:'不要推测添加标题未给出的原因或结果，只还原其中明示的事实与关系。'},
      main:{ko:'예시 하나만 크게 말한 보기와 본문보다 강한 ‘항상·모두’ 표현을 먼저 제거합니다.',ja:'一つの例だけを大きく述べた選択肢と、本文より強い「常に・すべて」を先に除外します。',en:'First eliminate choices that overfocus on one example or overstate the passage with “always” or “all.”',zh:'先排除只放大一个例子或用“总是、全部”把原文说得过强的选项。'},
      order:{ko:'시간 표현, 지시어, 원인→결과를 따로 표시하면 겉으로 자연스러운 잘못된 순서를 제거할 수 있습니다.',ja:'時間表現・指示語・原因→結果を別々に印を付けると、表面上自然な誤順を除外できます。',en:'Mark time words, references, and cause-result links to reject sequences that only sound smooth.',zh:'分别标出时间词、指示关系和因果，可排除表面通顺但顺序错误的选项。'},
      insertion:{ko:'삽입문의 지시어가 가리키는 대상·상황을 문맥에서 찾습니다. 명사 하나가 아니라 앞 문장 전체를 가리킬 수도 있습니다.',ja:'挿入文の指示語が何を指すかを文脈で確認します。名詞一つではなく、前の文の内容全体を指す場合もあります。',en:'Identify what each demonstrative refers to in context; it may refer to a whole preceding situation, not a single noun.',zh:'结合语境确认插入句中的指示词所指内容；它也可能指前句的整个情况，而非单个名词。'},
      presentation:{ko:'말하는 내용에 찬성하는지와 내용을 어떤 순서·방법으로 설명하는지는 다른 질문입니다.',ja:'内容への賛否と、どの順序・方法で説明するかは別の問いです。',en:'Agreement with the content and the way the content is organized are different questions.',zh:'是否赞同内容，与采用何种顺序和方法说明，是不同的问题。'},
      stance:{ko:'장점을 인정한 뒤 ‘그러나·따라서’ 뒤에 제시한 평가나 대안이 글쓴이의 최종 태도입니다.',ja:'利点を認めた後、「しかし・したがって」以降に示す評価や代案が筆者の最終的な態度です。',en:'After concessions, the evaluation or alternative following “however” or “therefore” usually reveals the final stance.',zh:'承认优点之后，“但是、因此”后提出的评价或方案通常才是作者最终态度。'},
      practical:{ko:'실용문은 대상·날짜·장소·해야 할 행동을 표로 나누듯 비교하면 추측 없이 풀 수 있습니다.',ja:'実用文は対象・日付・場所・必要な行動を表のように分けて比べると、推測せずに解けます。',en:'Treat a practical text like a table: compare audience, date, place, and required action.',zh:'把实用文当作表格，逐项比较对象、日期、地点和必须采取的行动。'},
      inference:hasInferenceBlank(item)?{ko:'상식만으로 답하지 말고, 빈칸 앞뒤의 내용과 문장 관계를 모두 확인합니다.',ja:'常識だけで選ばず、空欄前後の内容と文の関係を確認します。',en:'Do not rely on general knowledge; check the content and relationship on both sides of the blank.',zh:'不要只凭常识选择，要核对空格前后的内容与句间关系。'}:{ko:'본문에 없는 상식이나 지나치게 강한 단정을 더하지 않습니다. 결론의 범위가 근거를 넘지 않아야 합니다.',ja:'本文にない常識や強すぎる断定を加えません。結論の範囲が根拠を超えないようにします。',en:'Do not add outside assumptions or stronger claims; an inference must stay within the evidence.',zh:'不要添加原文没有的常识或过强断言，推论范围不能超出依据。'},
      general:{ko:'문제의 요구어를 먼저 표시하고, 각 보기가 본문 근거와 정확히 같은 범위인지 확인합니다.',ja:'設問の要求語を先に印し、各選択肢が本文の根拠と同じ範囲か確認します。',en:'Mark the task word first, then check whether each choice matches the exact scope of the evidence.',zh:'先标出题目要求词，再核对各选项是否与原文依据范围完全一致。'}
    };
    return packs[mode]||packs.general;
  }
  function instructorStrategy(item){
    const mode=explanationMode(item),packs={
      response:{ko:'① 마지막 말이 질문·제안·요청·상황 설명 중 무엇인지 확인하고 ② 의문사가 있으면 무엇을 묻는지 찾은 뒤 ③ 내용과 기능에 맞는 응답을 고릅니다.',ja:'①最後の発話が質問・誘い・依頼・状況説明のどれかを確認し、②疑問詞があれば何を尋ねるかを見て、③内容と働きに合う返答を選びます。',en:'1) Identify a question, suggestion, request, or statement of a situation. 2) Check any question word. 3) Choose a response fitting the content and function.',zh:'①判断最后一句是提问、建议、请求还是情况说明；②如有疑问词，确认所问信息；③选择符合内容和功能的回应。'},
      place:{ko:'① 사람들의 행동 ② 제공되는 물건·서비스 ③ 장소 전용 표현을 묶어 장소를 확정합니다.',ja:'①人の行動、②提供される物・サービス、③その場所特有の表現を組み合わせて場所を確定します。',en:'Combine 1) actions, 2) goods or services, and 3) place-specific expressions.',zh:'结合①人物行为、②提供的物品或服务、③场所专用表达来确定地点。'},
      topic:{ko:'대화 전체에서 반복되는 명사와 마지막에 새로 결정·변경된 정보를 한 문장으로 요약합니다.',ja:'会話全体で繰り返される名詞と、最後に新しく決定・変更された情報を一文で要約します。',en:'Summarize repeated nouns and the final newly decided or changed information in one sentence.',zh:'用一句话概括对话中反复出现的名词及最后决定或变更的信息。'},
      picture:{ko:'① 문장에서 주체 ② 물건 ③ 동작 ④ 방향·위치를 표시한 뒤 네 요소가 모두 보이는 그림을 고릅니다.',ja:'①文の主体、②物、③動作、④方向・位置に印を付け、四つすべてが見える絵を選びます。',en:'Mark 1) actor, 2) object, 3) action, and 4) direction or position, then choose the scene matching all four.',zh:'①标出人物；②物品；③动作；④方向或位置，再选四项都符合的图。'},
      action:{ko:'① 질문과 대사에서 요청·계획·진행·완료를 구별하고 ② 행동 주체를 확인한 뒤 ③ 실제 대화 상황을 나타내는 보기를 찾습니다.',ja:'①設問と会話から依頼・予定・進行・完了を区別し、②行動する人を確認して、③実際の会話の状況を表す選択肢を探します。',en:'1) Distinguish a request, plan, ongoing action, or completed action in the question and dialogue. 2) Identify the actor. 3) Choose the situation actually supported by the exchange.',zh:'①结合问题和对话区分请求、计划、正在进行或已完成的动作；②确认动作主体；③选择对话实际支持的情境。'},
      mismatch:{ko:'① ‘같지 않은/아닌’을 표시하고 ② 각 보기를 본문에서 하나씩 검증해 ③ 근거가 없거나 반대인 하나를 고릅니다.',ja:'①「一致しない・ではない」に印を付け、②各選択肢を本文で一つずつ検証し、③根拠がないか反対の一つを選びます。',en:'1) Mark the negative. 2) Verify each choice. 3) Select the unsupported or contradictory one.',zh:'①圈出“不符/不是”；②逐项回原文核对；③选择无依据或相反的一项。'},
      match:{ko:'보기마다 사람·시간·수량·장소·긍정/부정을 체크하고 다섯 요소가 모두 같은 보기만 남깁니다.',ja:'各選択肢の人物・時間・数量・場所・肯定／否定を確認し、すべて一致するものだけを残します。',en:'Check person, time, quantity, place, and polarity; keep only the choice matching all five.',zh:'逐项核对人物、时间、数量、地点和肯否，只保留五项都一致的选项。'},
      reason:{ko:'① 어떤 행동·상황의 이유를 묻는지 확인하고 ② 그 일이 생긴 원인·계기를 찾은 뒤 ③ 보기의 주체와 시점이 같은지 비교합니다.',ja:'①何の理由を問うか確認し、②その出来事の原因・きっかけを探し、③選択肢の人物と時点が一致するか比べます。',en:'1) Identify the event being explained. 2) Find its cause or trigger. 3) Compare the actor and time frame with each choice.',zh:'①确认题目问哪件事的原因；②寻找原因或契机；③核对各选项的人物和时间。'},
      purpose:{ko:'사정 설명은 근거이고 마지막 요청·제안·주장이 목적입니다. 마지막 한두 문장을 먼저 확인합니다.',ja:'事情説明は根拠で、最後の依頼・提案・主張が目的です。最後の一、二文を先に確認します。',en:'Background is evidence; the final request, suggestion, or claim is the purpose. Read the last one or two sentences first.',zh:'情况说明是依据，最后的请求、建议或主张才是目的；先看最后一两句。'},
      grammar:{ko:'① 빈칸 앞말의 형태 ② 앞뒤 절의 의미 관계 ③ 시제·높임을 차례로 확인합니다.',ja:'①空欄前の語形、②前後節の意味関係、③時制・敬語の順に確認します。',en:'Check 1) attachment form, 2) clause relation, and 3) tense or politeness.',zh:'依次检查①空前词形、②前后分句关系、③时态与敬语。'},
      vocabulary:{ko:'빈칸 주변의 목적어·부사를 먼저 묶고, 네 보기를 넣어 실제로 자주 쓰는 결합인지 소리 내어 확인합니다.',ja:'空欄周辺の目的語・副詞を先にまとめ、四つを入れて実際によく使う組み合わせか確認します。',en:'Group the nearby object and adverb, then test which option forms the natural collocation.',zh:'先把空格附近的宾语和副词组合起来，再代入四项判断哪一项搭配自然。'},
      wordmeaning:{ko:'목표 어휘·표현이 문맥에서 뜻하는 바를 확인하고, 보기로 바꾸어도 같은 뜻인지 비교합니다. 숙어는 전체 뜻을 봅니다.',ja:'対象の語・表現が文脈で何を意味するかを確認し、選択肢に置き換えても同じ意味か比べます。慣用句全体の意味で考えます。',en:'Identify the target word or expression in context, then check whether replacing it preserves the meaning. Treat an idiom as a whole.',zh:'确定目标词语或表达在语境中的含义，再代入选项检查意思是否不变；熟语要按整体理解。'},
      paraphrase:{ko:'원문과 보기의 주체·시제·부정·원인·결과를 나란히 놓고 모두 같을 때만 정답으로 남깁니다.',ja:'原文と選択肢の主体・時制・否定・原因・結果を並べ、すべて同じ場合だけ正解として残します。',en:'Align subject, tense, negation, cause, and result; all must stay unchanged.',zh:'并列比较主体、时态、否定、原因和结果，全部不变才可能同义。'},
      headline:{ko:'생략된 조사를 보충하고 누가 무엇을 했거나 무엇이 바뀌었는지 확인합니다. 인과 관계는 제목에 있을 때만 반영합니다.',ja:'助詞を補い、誰が何をしたか、何が変わったかを確認します。因果関係は見出しに示されている場合だけ反映します。',en:'Restore who did what or what changed; include a causal link only if the headline states one.',zh:'补出省略成分，确认谁做了什么或什么发生变化；只在标题明示时保留因果关系。'},
      main:{ko:'각 문장의 공통 키워드를 묶고, 예시를 모두 포함하면서도 본문보다 강하지 않은 한 문장을 고릅니다.',ja:'各文の共通キーワードをまとめ、例をすべて含みつつ本文より強くない一文を選びます。',en:'Combine common keywords and choose the statement broad enough for all examples but no stronger than the text.',zh:'归纳各句共同关键词，选择能涵盖所有例子且不比原文更绝对的一句。'},
      order:{ko:'첫 문장 후보를 정한 뒤 지시어의 선행어, 접속어, 시간 순서가 끊기지 않는지 연결합니다.',ja:'最初の文の候補を決め、指示語の先行詞・接続語・時間順が切れないようにつなぎます。',en:'Choose a possible opening, then link antecedents, connectors, and chronology without breaks.',zh:'先确定首句候选，再按指示词先行词、连接词和时间顺序无断裂地连接。'},
      insertion:{ko:'삽입문의 지시어와 접속어를 표시하고, 바로 앞에서 대상을 소개하며 바로 뒤가 그 결과·설명을 잇는 위치를 찾습니다.',ja:'挿入文の指示語と接続語に印を付け、直前で対象を紹介し、直後が結果・説明を続ける位置を探します。',en:'Mark references and connectors; find the point whose previous sentence introduces the referent and next sentence continues it.',zh:'标出插入句的指示词和连接词，寻找前句介绍对象、后句承接结果或说明的位置。'},
      presentation:{ko:'각 문장의 역할을 설명·사례·비교·반론·대안 등으로 표시하고, 실제 전개 순서와 같은 보기를 찾습니다.',ja:'各文の役割を説明・例・比較・反論・代案などと整理し、実際の展開順と一致する選択肢を探します。',en:'Label each sentence’s role, such as explanation, example, comparison, objection, or alternative, then match the actual sequence.',zh:'标注各句是说明、举例、比较、反驳还是提出方案，再匹配实际展开顺序。'},
      stance:{ko:'‘하지만/그러나/따라서’ 뒤의 평가와 해결책에 밑줄을 긋고, 인정·비판·대안 중 태도를 정합니다.',ja:'「しかし・ところが・したがって」以降の評価と解決策に線を引き、容認・批判・代案のどれかを決めます。',en:'Underline evaluation and solution after contrast or conclusion markers, then classify concession, criticism, or alternative.',zh:'给“但是/然而/因此”后的评价与方案画线，再判断是认可、批评还是提出替代方案。'},
      practical:{ko:'제목으로 문서 목적을 잡고 대상·날짜·장소·준비물·금지를 표처럼 정리해 보기와 대조합니다.',ja:'題名で文書の目的をつかみ、対象・日付・場所・持ち物・禁止事項を表のように整理して照合します。',en:'Use the title for purpose, then tabulate audience, date, place, required items, and prohibitions.',zh:'先由标题确定目的，再把对象、日期、地点、准备物和禁止事项列表核对。'},
      inference:hasInferenceBlank(item)?{ko:'빈칸 앞뒤가 원인·결과·대조·예시 중 어떤 관계인지 확인하고, 두 부분을 자연스럽게 잇는 보기를 고릅니다.',ja:'空欄前後が原因・結果・対比・例示のどの関係かを確かめ、両方を自然につなぐ選択肢を選びます。',en:'Identify cause, result, contrast, or example around the blank, then choose the option connecting both sides.',zh:'判断空格前后是因果、对比还是例示关系，再选择能自然衔接两边的选项。'}:{ko:'직접 제시된 사실을 모으고, 그 사실들로부터 도출할 수 있는 결론인지 보기마다 확인합니다.',ja:'本文に示された事実を集め、それらから導ける結論かを選択肢ごとに確認します。',en:'Collect the stated facts, then check whether each proposed conclusion follows from them.',zh:'整理原文明示的事实，再逐项检查能否由这些事实推出该结论。'},
      general:{ko:'먼저 질문이 요구하는 관계를 한 단어로 적고, 본문에 직접 근거가 있는 보기만 남깁니다.',ja:'まず設問が求める関係を一語で書き、本文に直接の根拠がある選択肢だけを残します。',en:'Name the requested relationship first, then keep only choices directly supported by the text.',zh:'先用一个词写出题目要求的关系，再只保留原文有直接依据的选项。'}
    };
    return packs[mode]||packs.general;
  }
  function explanationPack(idOrItem, displayedAnswerIndex, displayedChoices) {
    const item = typeof idOrItem === 'string' ? byId.get(idOrItem) : (idOrItem?.bankId ? byId.get(String(idOrItem.bankId)) : idOrItem);
    if (!item) return null;
    if (item.section === 'writing') return writingExplanation(item);
    const choices = Array.isArray(displayedChoices) && displayedChoices.length ? displayedChoices.map(cleanChoice) : item.options.map(cleanChoice);
    const index = Number.isInteger(Number(displayedAnswerIndex)) && Number(displayedAnswerIndex) >= 0 && Number(displayedAnswerIndex) < choices.length
      ? Number(displayedAnswerIndex) : Number(item.answerIndex);
    const answer = cleanChoice(choices[index] || item.options[item.answerIndex]);
    const evidence = bestEvidence(item, answer) || cleanEvidence(item.prompt || item.instruction);
    const reason=explanationReason(item,answer,evidence),trap=instructorTrap(item),strategy=instructorStrategy(item),position=answerPositionLine(index+1);
    const headings={ko:['정답 근거','오답 함정','유형별 풀이법'],ja:['正解の根拠','ひっかけ分析','タイプ別の解き方'],en:['Why this is correct','Distractor trap','Type-solving method'],zh:['正确依据','干扰项陷阱','题型解法']};
    const answerLines={ko:`정답 표현은 “${answer}”입니다.`,ja:`正解の表現は「${answer}」です。`,en:`The correct expression is ${sentenceQuote(answer)}`,zh:`正确表达是“${answer}”。`};
    const custom=item.coach||{};
    return Object.freeze({
      ...Object.fromEntries(Object.keys(headings).map((lang)=>[lang,`【${headings[lang][0]}】${custom[lang]?.reason||reason[lang]} ${answerLines[lang]}\n【${headings[lang][1]}】${custom[lang]?.trap||trap[lang]}\n【${headings[lang][2]}】${custom[lang]?.strategy||strategy[lang]} ${position[lang]}`]))
    });
  }
  function choiceExplanationPack(item, answerIndex, choices, overall) {
    const mode = explanationMode(item);
    const packs = { ko: [], ja: [], en: [], zh: [] };
    choices.forEach((choice, index) => {
      if (index === answerIndex) {
        for (const lang of Object.keys(packs)) packs[lang][index] = overall[lang];
        return;
      }
      // Each distractor needs its own evidence; the correct answer may concern a different fact.
      const evidence = bestEvidence(item, choice);
      const values = mode === 'mismatch' ? {
        ko: `“${choice}”는 근거 “${evidence}”와 일치하므로 ‘일치하지 않는 것’을 묻는 이 문제의 정답이 아닙니다.`,
        ja: `「${choice}」は根拠「${evidence}」と一致するため、「一致しないもの」を問うこの問題の正解ではありません。`,
        en: `“${choice}” matches the evidence “${evidence},” so it is not the answer to this negative question.`,
        zh: `“${choice}”与依据“${evidence}”相符，因此不是这道“不相符项”题的答案。`
      } : mode === 'grammar' || mode === 'vocabulary' ? {
        ko: `“${choice}”는 이 빈칸의 문맥·문법·어휘 결합 중 하나 이상과 맞지 않습니다.`,
        ja: `「${choice}」は、この空欄の文脈・文法・語の組み合わせのいずれかに合いません。`,
        en: `“${choice}” does not fit at least one of the context, grammar, or word-combination requirements of the blank.`,
        zh: `“${choice}”至少有一方面不符合该空格的语境、语法或词语搭配。`
      } : mode === 'wordmeaning' ? {
        ko: `“${choice}”는 해당 어휘·숙어가 근거 문맥에서 나타내는 뜻이나 기능과 다릅니다.`,
        ja: `「${choice}」は、その語彙・慣用表現が根拠となる文脈で示す意味や働きと異なります。`,
        en: `“${choice}” does not match the meaning or function of the target word or idiom in context.`,
        zh: `“${choice}”与目标词语或熟语在该语境中的含义或作用不符。`
      } : mode === 'response' ? {
        ko: `“${choice}”는 앞말의 질문·제안·요청이나 상황 설명에 직접 답하지 않아 대화가 자연스럽게 이어지지 않습니다.`,
        ja: `「${choice}」は直前の質問・提案・依頼や状況説明に直接答えておらず、会話が自然につながりません。`,
        en: `“${choice}” does not directly answer the preceding question, suggestion, or request.`,
        zh: `“${choice}”没有直接回应前面的提问、建议或请求，对话衔接不自然。`
      } : mode === 'main' ? {
        ko: `“${choice}”는 일부 세부 내용이거나 글 전체를 포괄하지 못해 중심 생각으로는 부족합니다.`,
        ja: `「${choice}」は一部の詳細にとどまるか、文章全体を含んでいないため、中心内容としては不十分です。`,
        en: `“${choice}” is only a detail or does not cover the whole text, so it is not the main idea.`,
        zh: `“${choice}”只是局部细节，或未能概括全文，因此不能作为中心思想。`
      } : mode === 'match' ? {
        ko: `“${choice}”는 근거 “${evidence}”와 비교할 때 시간·대상·행동·조건 중 하나 이상이 달라집니다.`,
        ja: `「${choice}」は根拠「${evidence}」と比べると、時刻・対象・行動・条件のいずれかが異なります。`,
        en: `Compared with “${evidence},” “${choice}” changes at least one time, subject, action, or condition.`,
        zh: `与依据“${evidence}”相比，“${choice}”至少改变了时间、对象、行为或条件中的一项。`
      } : mode === 'reason' ? {
        ko: `“${choice}”는 질문이 묻는 행동·상황의 원인으로 뒷받침되지 않습니다. 근거 “${evidence}”에서 실제 계기를 확인하세요.`,
        ja: `「${choice}」は、問われた行動・状況の理由として裏付けられません。根拠「${evidence}」で実際のきっかけを確認しましょう。`,
        en: `“${choice}” is not supported as the reason for the event asked about. Check the actual trigger in ${sentenceQuote(evidence)}`,
        zh: `“${choice}”并不是材料支持的该事件原因。请在依据“${evidence}”中核对实际契机。`
      } : mode === 'purpose' ? {
        ko: `“${choice}”는 근거의 세부 내용과 전달하려는 이유·목적을 혼동한 보기입니다.`,
        ja: `「${choice}」は根拠の細部と、伝えようとする理由・目的を取り違えています。`,
        en: `“${choice}” confuses a detail in the source with its reason or communicative purpose.`,
        zh: `“${choice}”混淆了材料中的细节与其原因或表达目的。`
      } : mode === 'paraphrase' || mode === 'headline' ? {
        ko: `“${choice}”는 원문의 주체·행동·시간·인과 관계 중 하나 이상을 바꾸어 같은 뜻이 아닙니다.`,
        ja: `「${choice}」は原文の主体・行動・時刻・因果関係のいずれかを変えているため、同じ意味ではありません。`,
        en: `“${choice}” changes the subject, action, time, or cause-and-effect relationship, so it is not equivalent.`,
        zh: `“${choice}”改变了原文的主体、行为、时间或因果关系，因此意思并不相同。`
      } : mode === 'order' || mode === 'insertion' ? {
        ko: `“${choice}”를 적용하면 지시어·접속 표현 또는 사건의 시간·논리 흐름이 끊어집니다.`,
        ja: `「${choice}」を当てはめると、指示語・接続表現、または出来事の時間的・論理的な流れが途切れます。`,
        en: `Using “${choice}” breaks a reference, connector, or the time and logic sequence of the text.`,
        zh: `采用“${choice}”会使指示关系、连接表达或事件的时间与逻辑顺序中断。`
      } : mode === 'presentation' || mode === 'stance' ? {
        ko: `“${choice}”는 글이나 말에서 실제로 사용한 전개 방식·태도와 일치하지 않습니다.`,
        ja: `「${choice}」は文章や発話で実際に用いられた展開方法・態度と一致しません。`,
        en: `“${choice}” does not describe the stance or presentation method actually used.`,
        zh: `“${choice}”与文章或话语实际采用的态度和展开方式不符。`
      } : mode === 'place' || mode === 'topic' || mode === 'picture' ? {
        ko: `“${choice}”는 대화의 핵심 단서·행동·상황과 맞지 않습니다.`,
        ja: `「${choice}」は会話の中心的な手掛かり・動作・状況と一致しません。`,
        en: `“${choice}” does not match the key clue, action, or situation in the dialogue.`,
        zh: `“${choice}”与对话中的核心线索、行为或情境不符。`
      } : {
        ko: `“${choice}”는 문제에서 요구한 관계나 근거 “${evidence}”와 맞지 않으므로 제외합니다.`,
        ja: `「${choice}」は設問が求める関係、または根拠「${evidence}」と合わないため除外します。`,
        en: `“${choice}” does not satisfy the requested relationship or match the evidence ${sentenceQuote(evidence)}`,
        zh: `“${choice}”不符合题目要求的关系，或与依据“${evidence}”不一致，因此排除。`
      };
      for (const lang of Object.keys(packs)) packs[lang][index] = item.coach?.[lang]?.choices?.[choice] || values[lang];
    });
    return packs;
  }
  function present(idOrItem, order) {
    const item = typeof idOrItem === 'string' ? byId.get(idOrItem) : idOrItem;
    if (!item) return null;
    const writing = item.section === 'writing';
    const choiceOrder = writing ? [] : cleanOrder(order, item.options.length);
    const choices = writing ? [] : choiceOrder.map((index) => item.options[index]);
    const answerIndex = writing ? null : choiceOrder.indexOf(item.answerIndex);
    const explanationI18n = explanationPack(item, answerIndex, choices);
    const choiceExplanationsI18n = writing ? null : choiceExplanationPack(item, answerIndex, choices.map(cleanChoice), explanationI18n);
    return {
      id: item.id, bankId: item.id, sourceId: item.no, mockSet: item.set, section: item.section,
      itemType: item.itemType, difficulty: item.difficulty, difficultyRank: item.difficultyRank,
      group: ITEM_GROUPS[item.itemType] || item.targetSkills[0] || item.section,
      instruction: item.instruction, stem: item.passage, passage: item.passage, prompt: item.prompt,
      script: item.script, choices, answerIndex, answer: answerIndex == null ? item.acceptedAnswer : SYMBOLS[answerIndex],
      explanation: explanationI18n.ko, explanationKo: explanationI18n.ko, explanationJa: explanationI18n.ja,
      explanationI18n, choiceExplanationsI18n, targetSkills: item.targetSkills,
      visualOptions: item.visual, visualPending: !!item.visual, model: item.model, rubric: item.rubric,
      stimulusGroup: item.stimulusGroup, choiceOrder, recommendedSec: recommendedSeconds(item)
    };
  }
  function filter(options = {}) {
    const level = Number(options.level) === 1 ? 1 : 2;
    const sections = options.sections ? new Set(options.sections) : null;
    const difficulties = options.difficulties ? new Set(options.difficulties) : null;
    const excluded = new Set((options.exclude || []).map(String));
    return items.filter((item) => item.level === level
      && (!sections || sections.has(item.section))
      && (!difficulties || difficulties.has(item.difficulty))
      && (!options.mcqOnly || item.section !== 'writing')
      && (!options.noVisual || !item.visual)
      && !excluded.has(item.id));
  }
  function choose(list) { return list.length ? list[Math.floor(Math.random() * list.length)] : null; }
  function readRecent(key) {
    try { const value = JSON.parse(localStorage.getItem(`malbitBankRecent:${key}`) || '[]'); return Array.isArray(value) ? value.map(String) : []; }
    catch (error) { return []; }
  }
  function remember(key, id, limit = 240) {
    if (!key || !id) return;
    try {
      const next = readRecent(key).filter((value) => value !== String(id));
      next.push(String(id));
      localStorage.setItem(`malbitBankRecent:${key}`, JSON.stringify(next.slice(-limit)));
    } catch (error) {}
  }
  function draw(options = {}) {
    const recentKey = options.recentKey || '';
    const excluded = new Set([...(options.exclude || []).map(String), ...readRecent(recentKey)]);
    let pool = filter({ ...options, exclude: [...excluded] });
    if (!pool.length) pool = filter({ ...options, exclude: options.exclude || [] });
    const item = choose(pool);
    if (item && recentKey) remember(recentKey, item.id, options.recentLimit || 240);
    return item;
  }
  function mock(level, set, section) {
    return items.filter((item) => item.level === Number(level) && item.set === Number(set) && (!section || item.section === section))
      .sort((a, b) => a.no - b.no);
  }
  function nextMockSet(level) {
    const key = `malbitNextMockSet:${Number(level) === 1 ? 1 : 2}`;
    let previous = 0;
    try { previous = Number(localStorage.getItem(key)) || 0; } catch (error) {}
    const next = previous % 12 + 1;
    try { localStorage.setItem(key, String(next)); } catch (error) {}
    return next;
  }
  function stageDifficulties(level, stage) {
    const n = Math.max(1, Math.min(7, Number(stage) || 1));
    if (Number(level) === 1) return [
      ['easy'], ['easy', 'medium'], ['medium'], ['medium', 'hard'], ['hard'], ['hard'], ['hard']
    ][n - 1];
    return [
      ['medium'], ['medium', 'hard'], ['hard'], ['hard', 'very_hard'], ['very_hard'], ['very_hard'], ['very_hard']
    ][n - 1];
  }
  function gamePool(level, stage, exclude = []) {
    const sections = window.MALBIT_LISTENING_ENABLED?.() === false ? ['reading'] : ['listening', 'reading'];
    let pool = filter({ level, sections, difficulties: stageDifficulties(level, stage), mcqOnly: true, noVisual: true, exclude });
    if (pool.length < 20) pool = filter({ level, sections, mcqOnly: true, noVisual: true, exclude });
    return pool;
  }
  function shorts(level) {
    const maxChars = Number(level) === 1 ? 150 : 180;
    return items.filter((item) => item.level === Number(level) && SHORT_TYPES.has(item.itemType) && item.section !== 'writing'
      && !item.visual && `${item.passage}${item.prompt}`.length <= maxChars)
      .map((item) => {
        const explanationI18n = explanationPack(item, item.answerIndex, item.options);
        return ({
        type: 'word', bankId: item.id,
        term: [item.passage, item.prompt].filter(Boolean).join('\n'), choices: item.options,
        answerIndex: item.answerIndex, explanationKo: explanationI18n.ko, explanationJa: explanationI18n.ja, explanationI18n,
        difficulty: item.difficulty, targetSkills: item.targetSkills
      });
      });
  }
  function toTopik2Legacy(item) {
    const q = present(item, identity);
    if (item.section === 'listening') return {
      ...q, id: item.no, prompt: item.prompt, choices: item.options, answerIndex: item.answerIndex,
      answer: SYMBOLS[item.answerIndex], script: item.script, instruction: item.instruction,
      recommendedSec: recommendedSeconds(item), scriptJa: '', bankId: item.id
    };
    if (item.section === 'writing') return {
      ...q, id: item.no, section: 'writing', stem: [item.passage, item.prompt].filter(Boolean).join('\n\n'),
      model: item.model || '', min: item.no <= 52 ? 3 : item.no === 53 ? 200 : 600,
      max: item.no <= 52 ? 100 : item.no === 53 ? 300 : 700, bankId: item.id
    };
    return {
      ...q, id: item.no, stem: [item.passage, item.prompt].filter(Boolean).join('\n\n'), choices: item.options,
      answerIndex: item.answerIndex, answer: SYMBOLS[item.answerIndex], categoryKo: q.group,
      categoryJa: q.group, translation: '', grammar: item.targetSkills.join(' · '), vocab: '',
      why: q.explanationI18n.ja, bankId: item.id
    };
  }
  function activateTopik2Set(set, listeningTarget, readingWritingTarget) {
    if (!Array.isArray(listeningTarget) || !Array.isArray(readingWritingTarget)) return false;
    const listening = mock(2, set, 'listening').map(toTopik2Legacy);
    const reading = mock(2, set, 'reading').map(toTopik2Legacy);
    const writing = mock(2, set, 'writing').map(toTopik2Legacy);
    if (listening.length !== 50 || reading.length !== 50 || writing.length !== 4) return false;
    listeningTarget.splice(0, listeningTarget.length, ...listening);
    readingWritingTarget.splice(0, readingWritingTarget.length, ...reading, ...writing);
    return true;
  }

  window.MALBIT_BANK = Object.freeze({
    version: raw.version, total: items.length, items, byId: (id) => byId.get(String(id)) || null,
    present, explain: explanationPack, filter, draw, remember, readRecent, mock, nextMockSet, gamePool, stageDifficulties,
    shorts, shuffledOrder, freshOrder, cleanOrder, recommendedSeconds, activateTopik2Set,
    stats: Object.freeze({ total: items.length, topik1: items.filter((item) => item.level === 1).length, topik2: items.filter((item) => item.level === 2).length })
  });
})();
