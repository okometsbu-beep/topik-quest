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
  const SHORT_TYPES = new Set(['vocabulary_blank', 'grammar_blank', 'same_meaning']);
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
  const items = rows.map((row) => ({
    id: row[0], set: Number(row[1]), level: Number(row[2]), section: SECTION[row[3]], no: Number(row[4]),
    itemType: row[5], difficulty: DIFFICULTY[row[6]], difficultyRank: RANK[DIFFICULTY[row[6]]] || 1,
    instruction: cleanProblemText(row[7]), passage: cleanProblemText(row[8]), script: cleanProblemText(row[9]), prompt: cleanProblemText(row[10]), options: row[11],
    answerIndex: row[3] === 'w' ? null : Number(row[12]), acceptedAnswer: row[3] === 'w' ? row[12] : null,
    explanationKo: row[13], explanationJa: row[14], targetSkills: row[15] || [], visual: row[16],
    model: row[17], rubric: row[18], stimulusGroup: row[19] || null
  }));
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
  const PURPOSE_TYPES = new Set(['reason_purpose', 'long_reason', 'speaker_purpose']);
  const MAIN_TYPES = new Set(['main_idea', 'advanced_main_idea', 'main_idea_advanced', 'academic_reasoning']);
  const PRACTICAL_TYPES = new Set(['sign_purpose', 'practical_text', 'practical_information']);
  const INFERENCE_TYPES = new Set(['blank_inference', 'paired_passage', 'paired_long_passage', 'medium_passage_pair', 'long_passage_pair', 'final_passage_pair', 'long_detail_pair', 'long_inference_pair']);
  const VOCAB_TYPES = new Set(['vocabulary_blank', 'paired_vocabulary_main', 'paired_idiom_main']);
  const STOP_WORDS = new Set('것 수 이 그 저 은 는 이 가 을 를 에 에서 로 으로 와 과 도 만 의 한 하다 있다 없다 되다 아니다 그리고 그러나 그래서 다음 내용 글 대화 보기 선택지 정답 가장 알맞은'.split(' '));

  function cleanChoice(value) { return String(value || '').replace(/^\s*[①②③④]\s*/u, '').trim(); }
  function cleanEvidence(value) {
    return cleanProblemText(value).replace(/(^|\n)\s*(?:[^:\n]{1,35}:\s*)+/gu, '$1').replace(/\s+/gu, ' ').trim();
  }
  function tokens(value) {
    return [...new Set((String(value || '').match(/[가-힣]{2,}|[A-Za-z]{2,}|\d+(?:[.,]\d+)?%?/gu) || [])
      .map((token) => token.toLowerCase()).filter((token) => !STOP_WORDS.has(token)))];
  }
  function explanationMode(item) {
    const question = `${item.instruction || ''} ${item.prompt || ''}`;
    if (RESPONSE_TYPES.has(item.itemType)) return 'response';
    if (item.itemType === 'place_identification') return 'place';
    if (item.itemType === 'topic_identification') return 'topic';
    if (item.itemType === 'picture_selection') return 'picture';
    if (item.itemType === 'notice_mismatch' || /(?:일치하지|맞지 않|틀린|아닌|않은)\s*(?:것|내용|문장)/u.test(question)) return 'mismatch';
    if (item.itemType === 'grammar_blank') return 'grammar';
    if (item.itemType === 'vocabulary_blank') return 'vocabulary';
    if (item.itemType === 'same_meaning') return 'paraphrase';
    if (item.itemType === 'headline_interpretation') return 'headline';
    if (item.itemType === 'sentence_order') return 'order';
    if (item.itemType === 'sentence_insertion' || item.itemType === 'sentence_insertion_long') return 'insertion';
    if (/문맥상\s*가장\s*가까운\s*의미|내용에\s*알맞은\s*표현/u.test(question)) return 'wordmeaning';
    if (/글의\s*전개\s*방식|말하는\s*방식|글쓴이의\s*태도/u.test(question)) return 'stance';
    if (/중심\s*(?:생각|내용)|글의\s*요지|글의\s*주제|말하고자\s*하는\s*바|글쓴이의\s*생각/u.test(question)) return 'main';
    if (/목적|이유/u.test(item.prompt || '') || PURPOSE_TYPES.has(item.itemType)) return 'purpose';
    if (/내용과\s*같은|내용으로\s*알\s*수|들은\s*내용과\s*같은/u.test(question) || MATCH_TYPES.has(item.itemType)) return 'match';
    if (/추론|통해\s*알\s*수|들어갈/u.test(item.prompt || '')) return 'inference';
    if (item.itemType === 'speaking_method' || item.itemType === 'author_stance') return 'stance';
    if (MAIN_TYPES.has(item.itemType)) return 'main';
    if (PRACTICAL_TYPES.has(item.itemType)) return 'practical';
    if (VOCAB_TYPES.has(item.itemType)) return 'wordmeaning';
    if (INFERENCE_TYPES.has(item.itemType)) return 'inference';
    return 'general';
  }
  function evidenceSource(item) { return cleanEvidence(item.script || item.passage || item.prompt || item.instruction); }
  function bestEvidence(item, answer) {
    const source = evidenceSource(item);
    if (!source) return '';
    const mode = explanationMode(item);
    if (mode === 'response' || mode === 'place' || mode === 'topic' || mode === 'picture' || mode === 'paraphrase' || mode === 'headline' || mode === 'grammar' || mode === 'vocabulary' || mode === 'order' || mode === 'insertion' || item.itemType === 'reason_purpose') return source.slice(0, 190);
    const wanted = new Set(tokens(answer));
    const parts = source.split(/(?<=[.!?。！？])\s+|\n+/u).map((part) => part.trim()).filter(Boolean);
    if (mode === 'wordmeaning') {
      const target = String(item.prompt || '').match(/[“"]([^”"]+)[”"]/u)?.[1];
      if (target) {
        const direct = parts.find((part) => part.includes(target));
        if (direct) return direct.slice(0, 190);
      }
    }
    if (mode === 'stance') {
      const pivot = parts.findIndex((part) => /(?:그렇지만|하지만|그러나)/u.test(part));
      if (pivot >= 0) return parts.slice(pivot, pivot + 2).join(' ').slice(0, 190);
    }
    let best = parts[0] || source, bestScore = -Infinity;
    for (const part of parts) {
      const hits = tokens(part).reduce((score, token) => score + (wanted.has(token) ? 1 : 0), 0);
      const conclusion = /(?:따라서|결국|저는|핵심|중요)/u.test(part) && (mode === 'main' || mode === 'purpose' || mode === 'stance') ? 3 : 0;
      const score = hits * 20 + conclusion * 10 - Math.min(part.length, 180) / 30;
      if (score > bestScore) { best = part; bestScore = score; }
    }
    return best.replace(/\s+/gu, ' ').slice(0, 190);
  }
  function completedBlank(item, answer) {
    const source = cleanEvidence(item.passage || item.prompt);
    return source.replace(/\(\s*(?:㉠|㉡)?\s*\)/u, answer).slice(0, 190);
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
    return {
      ko: `이 쓰기 문항은 “${task}”의 조건을 빠짐없이 반영해야 합니다. ${skills ? `채점 핵심은 ${skills}이며, ` : ''}모범 답안과 표현이 달라도 문맥과 문법이 자연스럽고 요구한 정보가 모두 들어가면 됩니다.`,
      ja: `この作文問題では「${task}」の条件を漏れなく反映する必要があります。評価の中心は課題条件の充足、構成、文法の正確さです。模範解答と表現が違っても、必要な情報が自然に含まれていれば構いません。`,
      en: `This writing task must cover every condition in “${task}.” It is scored for task completion, organization, and grammatical accuracy; wording may differ from the model answer if it is natural and complete.`,
      zh: `这道写作题必须完整回应“${task}”中的全部要求。评分重点是任务完成度、结构和语法准确性；表达不必与范文完全相同，只要自然且信息完整即可。`
    };
  }
  function explanationReason(item, answer, evidence) {
    const mode = explanationMode(item), filled = completedBlank(item, answer);
    const reasons = {
      response: {
        ko: `앞말 “${evidence}”의 질문·제안·요청에 “${answer}”가 직접 반응하므로 대화가 가장 자연스럽게 이어집니다.`,
        ja: `直前の発話「${evidence}」の質問・提案・依頼に「${answer}」が直接応じているため、会話が最も自然につながります。`,
        en: `“${answer}” directly responds to the question, suggestion, or request in “${evidence},” so it completes the exchange naturally.`,
        zh: `“${answer}”直接回应了“${evidence}”中的提问、建议或请求，因此对话衔接最自然。`
      },
      place: {
        ko: `대화의 단서 “${evidence}”에서 이루어지는 행동과 서비스를 보면 정답 장소는 “${answer}”입니다.`,
        ja: `会話の手掛かり「${evidence}」で行われている行動やサービスが、場所「${answer}」と一致します。`,
        en: `The action and service described in “${evidence}” identify the place as “${answer}.”`,
        zh: `对话线索“${evidence}”中的行为和服务与场所“${answer}”相符。`
      },
      topic: {
        ko: `대화에서 반복되는 핵심 내용 “${evidence}”를 묶으면 주제는 “${answer}”입니다.`,
        ja: `会話で繰り返される中心内容「${evidence}」をまとめると、話題は「${answer}」です。`,
        en: `The recurring ideas in “${evidence}” show that the topic is “${answer}.”`,
        zh: `归纳对话“${evidence}”中反复出现的核心信息，可知话题是“${answer}”。`
      },
      picture: {
        ko: `음성의 행동과 상황 “${evidence}”를 그대로 나타낸 장면이 “${answer}”입니다.`,
        ja: `音声の動作と状況「${evidence}」をそのまま表している場面が「${answer}」です。`,
        en: `“${answer}” is the scene that matches the action and situation described in “${evidence}.”`,
        zh: `“${answer}”所描绘的场景与音频中的行为和情境“${evidence}”一致。`
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
        en: `The time, subject, action, and condition in “${answer}” match the evidence “${evidence}.”`,
        zh: `“${answer}”中的时间、对象、行为和条件与依据“${evidence}”一致。`
      },
      purpose: {
        ko: `근거 “${evidence}”에서 드러나는 이유나 전달 의도를 가장 정확히 정리한 것이 “${answer}”입니다.`,
        ja: `根拠「${evidence}」に表れた理由や伝達意図を最も正確にまとめたものが「${answer}」です。`,
        en: `“${answer}” most accurately states the reason or communicative purpose shown in “${evidence}.”`,
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
        ko: `신문 제목 “${evidence}”의 원인과 결과를 완전한 문장으로 풀어 쓴 것이 “${answer}”입니다.`,
        ja: `新聞見出し「${evidence}」の原因と結果を完全な文に言い換えたものが「${answer}」です。`,
        en: `“${answer}” expands the cause-and-result meaning compressed in the headline “${evidence}.”`,
        zh: `“${answer}”用完整句子展开了标题“${evidence}”中压缩表达的因果关系。`
      },
      main: {
        ko: `핵심 근거 “${evidence}”를 세부 사례까지 포괄해 요약한 중심 생각이 “${answer}”입니다.`,
        ja: `中心となる根拠「${evidence}」を細部の例まで含めて要約した主張が「${answer}」です。`,
        en: `“${answer}” states the main idea that summarizes the key evidence “${evidence}” and the supporting details.`,
        zh: `“${answer}”概括了核心依据“${evidence}”及相关细节，是文章的中心思想。`
      },
      order: {
        ko: `“${answer}”의 순서대로 배열하면 사건의 시작에서 변화와 결과로 이어지는 시간·논리 흐름이 자연스럽습니다.`,
        ja: `「${answer}」の順に並べると、出来事の開始から変化・結果へ進む時間的・論理的な流れが自然です。`,
        en: `The order “${answer}” creates a coherent time and logic sequence from the initial event through change to result.`,
        zh: `按“${answer}”排列，事件从开始到变化再到结果的时间与逻辑顺序最自然。`
      },
      insertion: {
        ko: `삽입 문장 “${cleanEvidence(String(item.prompt || '').replace(/^삽입 문장:\s*/u, ''))}”의 지시어·접속 표현과 앞뒤 논리 관계를 보면 “${answer}” 위치가 가장 자연스럽습니다.`,
        ja: `挿入文「${cleanEvidence(String(item.prompt || '').replace(/^삽입 문장:\s*/u, ''))}」の指示語・接続表現と前後の論理関係を見ると、「${answer}」の位置が最も自然です。`,
        en: `The reference words, connectors, and surrounding logic of “${cleanEvidence(String(item.prompt || '').replace(/^삽입 문장:\s*/u, ''))}” make position “${answer}” the most coherent.`,
        zh: `根据插入句“${cleanEvidence(String(item.prompt || '').replace(/^삽입 문장:\s*/u, ''))}”的指示词、连接表达和前后逻辑，放在“${answer}”处最自然。`
      },
      stance: {
        ko: `말이나 글의 전개 “${evidence}”에서 드러난 태도·설명 방식과 정확히 맞는 표현이 “${answer}”입니다.`,
        ja: `話や文章の展開「${evidence}」から分かる態度・説明方法に正確に合う表現が「${answer}」です。`,
        en: `“${answer}” accurately describes the attitude or method of presentation shown in “${evidence}.”`,
        zh: `“${answer}”准确概括了“${evidence}”所体现的态度或表达方式。`
      },
      practical: {
        ko: `실용문의 핵심 안내 “${evidence}”가 요구하는 행동·대상·조건을 정확히 정리한 것이 “${answer}”입니다.`,
        ja: `実用文の中心的な案内「${evidence}」が示す行動・対象・条件を正確にまとめたものが「${answer}」です。`,
        en: `“${answer}” accurately captures the action, audience, and condition stated in the practical text “${evidence}.”`,
        zh: `“${answer}”准确概括了实用文本“${evidence}”中的行为、对象和条件。`
      },
      inference: /\(\s*(?:㉠|㉡)?\s*\)/u.test(item.passage || '') ? {
        ko: `“${answer}”로 빈칸을 완성하면 “${filled}”가 되어 앞 문장의 근거와 뒤의 결론이 논리적으로 이어집니다.`,
        ja: `「${answer}」で空欄を補うと「${filled}」となり、前の根拠と後ろの結論が論理的につながります。`,
        en: `Filling the blank with “${answer}” gives “${filled},” which logically connects the preceding evidence and the conclusion.`,
        zh: `用“${answer}”补全后成为“${filled}”，前文依据与后文结论在逻辑上自然衔接。`
      } : {
        ko: `본문의 근거 “${evidence}”에서 직접 확인하거나 논리적으로 도출할 수 있는 결론이 “${answer}”입니다.`,
        ja: `本文の根拠「${evidence}」から直接確認、または論理的に導ける結論が「${answer}」です。`,
        en: `“${answer}” is the conclusion directly supported by or logically inferred from the evidence “${evidence}.”`,
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
  function explanationPack(idOrItem, displayedAnswerIndex, displayedChoices) {
    const item = typeof idOrItem === 'string' ? byId.get(idOrItem) : (idOrItem?.bankId ? byId.get(String(idOrItem.bankId)) : idOrItem);
    if (!item) return null;
    if (item.section === 'writing') return writingExplanation(item);
    const choices = Array.isArray(displayedChoices) && displayedChoices.length ? displayedChoices.map(cleanChoice) : item.options.map(cleanChoice);
    const index = Number.isInteger(Number(displayedAnswerIndex)) && Number(displayedAnswerIndex) >= 0 && Number(displayedAnswerIndex) < choices.length
      ? Number(displayedAnswerIndex) : Number(item.answerIndex);
    const answer = cleanChoice(choices[index] || item.options[item.answerIndex]);
    const evidence = bestEvidence(item, answer) || cleanEvidence(item.prompt || item.instruction);
    const reason = explanationReason(item, answer, evidence), position = answerPositionLine(index + 1);
    return Object.freeze({
      ko: `${reason.ko} ${position.ko}`,
      ja: `${reason.ja} ${position.ja}`,
      en: `${reason.en} ${position.en}`,
      zh: `${reason.zh} ${position.zh}`
    });
  }
  function choiceExplanationPack(item, answerIndex, choices, overall) {
    const mode = explanationMode(item), evidence = bestEvidence(item, choices[answerIndex]);
    const packs = { ko: [], ja: [], en: [], zh: [] };
    choices.forEach((choice, index) => {
      if (index === answerIndex) {
        for (const lang of Object.keys(packs)) packs[lang][index] = overall[lang];
        return;
      }
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
        ko: `“${choice}”는 앞말의 질문·제안·요청에 직접 답하지 않아 대화가 자연스럽게 이어지지 않습니다.`,
        ja: `「${choice}」は直前の質問・提案・依頼に直接答えておらず、会話が自然につながりません。`,
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
      } : mode === 'stance' ? {
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
        en: `“${choice}” does not satisfy the requested relationship or match the evidence “${evidence}.”`,
        zh: `“${choice}”不符合题目要求的关系，或与依据“${evidence}”不一致，因此排除。`
      };
      for (const lang of Object.keys(packs)) packs[lang][index] = values[lang];
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
        type: item.itemType === 'grammar_blank' ? 'grammar' : 'word', bankId: item.id,
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
      model: item.model || '', min: item.no <= 52 ? 3 : item.no === 53 ? 180 : 500,
      max: item.no <= 52 ? 100 : item.no === 53 ? 300 : 800, bankId: item.id
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
