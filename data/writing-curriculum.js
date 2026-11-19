// HARUMAL writing: a competency map and one deliberately bounded cause-writing unit.
// Learner text and teacher models are separate. Static data is public, not an answer-security boundary.
// Regex checks describe observable components; they do not certify meaning, naturalness, or mastery.
(function () {
  'use strict';

  const freeze = value => {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  };
  const fact = (ko, ja) => ({ ko, ja });
  const word = (ko, ja) => ({ ko, ja });
  const check = (id, pattern, messageKo, messageJa) => ({ id, pattern, messageKo, messageJa });
  const basic = ['basic_sentence', 'vocabulary', 'relation'];
  const afterForm = [...basic, 'reason_form'];
  const ending = '(?:[.!?。！？]\\s*)?$';
  const allForms = '(?:아서|어서|해서|하여서)';
  const alternatives = '(?:기\\s*때문에|때문에|으니까|니까|기\\s*때문이에요|기\\s*때문입니다)';
  const ordinaryPromptKo = '두 사실을 이유와 결과로 연결해 해요체 한 문장으로 써 보세요. 주어진 뜻을 유지하세요.';
  const ordinaryPromptJa = '2つの事実を理由と結果としてつなぎ、ヘヨ体の1文で書きましょう。示された意味を保ってください。';

  const prerequisites = [
    { id: 'basic_sentence', titleKo: '짧은 해요체 문장', titleJa: '短いヘヨ体の文', helpKo: '누가 무엇을 하는지 또는 무엇이 어떤지 짧은 문장으로 쓸 수 있는지 확인해요.', helpJa: '誰が何をするか、何がどんな状態かを短い文で書けるか確認します。', probeItemIds: ['P01', 'P02'] },
    { id: 'vocabulary', titleKo: '이번 문제의 어휘', titleJa: '今回使う単語', helpKo: '현재 문제에 나온 낱말만 확인해요. 낱말 뜻을 본 기록은 이유 문장을 본 기록과 구분해요.', helpJa: '今の問題に必要な単語だけ確認します。単語の意味を見た記録と、理由の文を見た記録は区別します。', probeItemIds: [] },
    { id: 'relation', titleKo: '원인과 결과의 뜻', titleJa: '原因と結果の意味', helpKo: '한국어 연결형을 몰라도 두 사실 중 무엇이 이유인지 확인할 수 있어요.', helpJa: '韓国語の接続形をまだ知らなくても、どちらが理由なのかを確認できます。', probeItemIds: ['P03'] },
    { id: 'reason_form', titleKo: '이번에 배운 이유 연결형', titleJa: '今回学んだ理由の接続形', helpKo: '형태 연습 뒤 새 문장에서 연결 형태를 확인해요. 연습한 기록과 독립 사용 기록은 달라요.', helpJa: '形の練習後、新しい文で接続形を確認します。練習した記録と自力で使った記録は別です。', probeItemIds: [], practiceGroupIds: ['form-aseo', 'form-eoseo', 'form-haeseo'] },
    { id: 'past', titleKo: '어제의 일을 나타내기', titleJa: '昨日のことを表す', helpKo: '과거 해요체를 먼저 확인해요. 아직 낯설면 시점 변형만 나중에 해도 괜찮아요.', helpJa: '過去のヘヨ体を先に確認します。まだ難しければ、時点を変える練習だけ後にできます。', probeItemIds: ['P06'] },
    { id: 'subject', titleKo: '누가 하는 일인지 표시하기', titleJa: '誰の行動かを示す', helpKo: '동료가, 팀원들이처럼 행동하는 사람을 표시할 수 있는지 확인해요.', helpJa: '「동료가」「팀원들이」のように、行動する人を示せるか確認します。', probeItemIds: [], readinessOnly: true },
    { id: 'negation', titleKo: '없음과 불가능의 뜻', titleJa: 'ないことと、できないこと', helpKo: '없다의 뜻과 못의 불가능 의미를 확인해요. 안을 언제나 자발적인 선택으로 해석하지 않아요.', helpJa: '「없다」の意味と「못」の不可能の意味を確認します。「안」がいつも自発的な選択を表すわけではありません。', probeItemIds: ['P04', 'P05'] },
    { id: 'time_info', titleKo: '필요한 시간 정보', titleJa: '必要な時間の情報', helpKo: '오늘, 어제처럼 새로 넣을 시간 표현을 먼저 확인해요.', helpJa: '「오늘」「어제」など、追加する時間表現を先に確認します。', probeItemIds: [], readinessOnly: true }
  ];

  const node = (id, titleKo, titleJa, summaryKo, prerequisites, prerequisiteNoteKo, subskills, nextUseKo) => ({
    id, titleKo, titleJa, summaryKo, prerequisites, prerequisiteNoteKo, subskills, nextUseKo,
    status: ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07'].includes(id) ? 'partial' : 'planned',
    statusKo: id === 'S07' ? '첫 이유 소단원만 준비됨' : ['S01', 'S02', 'S03', 'S04', 'S05', 'S06'].includes(id) ? '본격 단원 준비됨' : '능력 지도 · 문항 준비 중',
    statusJa: id === 'S07' ? '最初の理由ユニットのみ利用可' : ['S01', 'S02', 'S03', 'S04', 'S05', 'S06'].includes(id) ? '本格ユニット利用可' : '能力マップ・問題は準備中',
    availableGroupIds: []
  });
  const nodes = [
    node('S01', '하나의 사실을 완결된 문장으로', '1つの事実を、完結した文に', '문장에 필요한 성분을 채우고 중심 사실을 분명하게 써요.', [], '한글 읽기·입력과 이번 과제의 핵심 어휘가 필요해요.', ['명사·동사·형용사 서술', '필요한 성분', '분명한 생략과 불필요한 반복'], '수식이나 이유를 붙여도 중심 문장을 유지하는 기준이 돼요.'),
    node('S02', '조사로 역할과 관계 표시하기', '助詞で役割と関係を示す', '주체·대상·장소·수단처럼 말의 역할을 구분해요.', ['S01'], '사용할 동사의 뜻과 해당 조사 기능만 먼저 확인해요.', ['주체와 대상', '주제와 대조', '존재·행동 장소', '출발점과 도착점', '수단·상대·범위'], '문장이 길어져도 누가 무엇을 하는지 잃지 않게 해요.'),
    node('S03', '서술어의 형태와 호응 유지하기', '述語の形と文の対応を保つ', '어간과 어미를 결합하고 주체와 서술어의 뜻을 맞춰요.', ['S01', 'S02'], '피동·사동까지 전부 끝낼 필요는 없어요. 새 과제에 쓰는 활용을 따로 확인해요.', ['어간과 어미', '품사별 활용', '필요한 불규칙', '주체·서술어 호응', '능동·피동·사동의 별도 경로'], '문장 확장과 절 연결의 공통 바탕이 돼요.'),
    node('S04', '시점·부정·판단 강도 조절하기', '時点・否定・判断の強さを調整', '언제의 사실인지, 무엇이 일어나지 않았는지, 얼마나 확실한지 구분해요.', ['S03'], '현재·과거·가능·필요 등의 표현을 한 번에 하나씩 확인해요.', ['현재·과거·미래', '상태와 변화', '안·못·지 않다', '가능·필요·의무·추측'], '이유·조건·자료 변화·주장의 범위를 정확히 해요.'),
    node('S05', '필요한 정보를 한 문장에 더하기', '必要な情報を1文に加える', '독자가 새로 알게 될 정보를 하나씩 더해요.', ['S01', 'S02', 'S03', 'S04'], '이번 문장에 실제로 들어가는 기능만 확인해요.', ['언제·어디서·누구와·방법', '정도와 빈도', '대상 한정', '정보 순서와 수식 범위'], '글자 수보다 정보의 구체성을 높이는 첫 단계예요.'),
    node('S06', '절로 대상을 한정하고 내용 묶기', '節で対象を限定し、内容をまとめる', '수식하는 대상과 주절의 관계를 분명하게 유지해요.', ['S03', 'S04', 'S05'], '관형절·명사화·인용의 형태는 각각 따로 도입해요.', ['현재·과거·예정 관형절', '명사화', '인용과 전달', '수식 대상', '중첩된 수식 줄이기'], '이유나 평가의 대상을 정확하게 설명하게 해요.'),
    node('S07', '원인·이유·판단 근거 설명하기', '原因・理由・判断の根拠を説明', '왜 그런 결과가 생겼는지, 왜 그렇게 생각하는지 설명해요.', ['S01', 'S02', 'S03', 'S04'], '첫 이유 연결에는 짧은 단문과 두 사실의 뜻이면 충분해요. 확장에 필요한 기능은 나중에 추가해요.', ['원인과 결과의 방향', '사실의 원인과 선택의 이유', '판단·권유 근거', '명사와 절의 이유', '뒤에 놓는 이유', '빠진 설명과 근거의 충분성'], '52번 설명 관계, 53번 제공된 이유, 54번 주장 뒷받침으로 이어져요.'),
    node('S08', '대조·양보·비교 대상 구별하기', '対照・譲歩・比較の対象を区別', '공통 기준과 예상되는 결과를 살펴 관계를 선택해요.', ['S01', 'S02', 'S03', 'S04', 'S05'], '단순 대조 뒤에 양보와 반론을 따로 연습해요.', ['같은 기준의 차이', '상반된 특징', '예상 밖 결과', '인정 뒤 주장', '비교 기준 일치'], '53번 비교와 54번 장단점·한계·다른 관점에 쓰여요.'),
    node('S09', '시간·조건·목적에 맞게 연결하기', '時間・条件・目的に合わせてつなぐ', '실제 이유와 목표, 사건 순서와 조건을 구별해요.', ['S03', 'S04'], '사용할 하위 표현의 형태와 뜻만 먼저 확인해요.', ['순서·동시성·선후', '이유와 목표', '조건과 결과', '조건의 범위', '목적과 주체'], '51번 계획·요청, 52번 조건, 54번 방법으로 이어져요.'),
    node('S10', '수량·비교·변화 정확히 서술하기', '数量・比較・変化を正確に述べる', '수치의 대상·단위·기준을 유지하며 설명해요.', ['S02', 'S03', 'S04', 'S05'], '이번 자료의 수 표현과 단위를 먼저 확인해요.', ['대상과 단위', '부분과 전체', '순위와 비율', '시점 비교', '증가·감소', '차이와 변화율'], '53번 자료 설명과 정확한 비교·범위 표현에 쓰여요.'),
    node('S11', '문장 사이 정보 흐름 유지하기', '文と文の情報の流れを保つ', '지시어의 대상, 주체 전환, 설명 순서를 분명하게 해요.', ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10'], '목록의 모든 관계를 끝낼 필요 없이 해당 문단이 사용하는 관계를 확인해요.', ['이미 나온 정보와 새 정보', '지시 대상', '주체 전환', '반복과 생략', '빠진 연결과 설명 순서'], '맞는 문장들을 독자가 따라갈 수 있는 글로 이어 줘요.'),
    node('S12', '글의 목적에 맞게 표현 다듬기', '文章の目的に合わせて表現を磨く', '독자와 목적에 맞는 자연스럽고 정확한 표현을 골라요.', ['S03'], '이번에 적용할 기능과 새 표현을 확인하며 과정 내내 쌓아 가요.', ['높임과 요청', '설명·논증 문체', '어휘 결합', '추상어 구체화', '중복·과도한 명사화 줄이기'], '51번 생활 글과 52~54번 설명·논증의 문체를 구분해요.'),
    node('D01', '문단의 중심과 뒷받침 조직하기', '段落の中心と裏付けを組み立てる', '중심 생각, 관련 이유, 설명과 사례를 하나의 흐름으로 써요.', ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12'], '이 문단에 필요한 문장 기능을 독립적으로 사용한 경험을 확인해요. 모든 노드의 완벽한 완료를 요구하지 않아요.', ['중심 생각', '관련 이유', '빠진 설명', '구체 사례', '범위와 한계', '문단 끝의 역할'], '좋은 문장 몇 개를 넘어 하나의 생각을 독자가 따라가게 해요.'),
    node('D02', '여러 문단으로 완수하고 수정하기', '複数の段落で課題を満たし、推敲する', '요구 사항별 내용을 배분하고 글 전체의 누락과 비약을 고쳐요.', ['D01'], '문단 쓰기와 함께 지시문을 읽고 요구를 나누는 독해를 확인해요.', ['요구 분해와 개요', '문단 순서', '일관된 입장', '중복·누락', '분량 조절', '내용 우선 수정'], '51→52→53→54로 적용 범위를 넓혀 54번의 논리적 글쓰기로 이어져요.')
  ];

  const group = (id, titleKo, titleJa, stage, prerequisites, extra = {}) => ({
    id, nodeId: extra.nodeId || 'S07', titleKo, titleJa, stage, prerequisites, itemIds: [], status: 'ready',
    helpKo: '', helpJa: '', delayedOnly: false, ...extra
  });
  const groups = [
    group('probe-basics', '필요한 것부터 확인', '必要なことから確認', 'probe', [], { selectionKo: '모두 통과하는 시험이 아니에요. 다음 문제에 필요한 확인만 골라 해요.', selectionJa: '全問合格を目指す試験ではありません。次の問題に必要な確認だけ選びましょう。' }),
    group('form-aseo', '형태 하나씩 · 아서', '形を1つずつ · 아서', 'form', basic, { helpKo: '많다·좋다는 많아서·좋아서로 연결해요. 완성된 해요체에 서를 붙이지 않아요. 먼저 한 가지 형태에 집중해요.', helpJa: '「많다・좋다」は「많아서・좋아서」でつなぎます。完成したヘヨ体にそのまま「서」を付けません。まず1つの形に集中しましょう。' }),
    group('form-eoseo', '형태 하나씩 · 어서', '形を1つずつ · 어서', 'form', basic, { helpKo: '없다·멀다는 없어서·멀어서로 연결해요. 앞의 사실이 뒤의 행동을 선택한 이유인지 함께 확인해요.', helpJa: '「없다・멀다」は「없어서・멀어서」でつなぎます。前の事実が、後の行動を選んだ理由になっているかも確認しましょう。' }),
    group('form-haeseo', '형태 하나씩 · 해서', '形を1つずつ · 해서', 'form', basic, { helpKo: '하다로 끝나는 말은 하여서 또는 줄인 해서로 연결해요. 여기서는 조용하다·복잡하다·깨끗하다를 연습해요.', helpJa: '「하다」で終わる語は「하여서」、または短縮形の「해서」でつなぎます。ここでは静か・混雑している・きれい、を練習します。' }),
    group('mixed-reasons', '새 내용으로 섞어 쓰기', '新しい内容で組み合わせる', 'mixed', afterForm),
    group('vary-time', '시점만 바꾸기', '時点だけ変える', 'variation', [...afterForm, 'past'], { variation: 'time' }),
    group('vary-subject', '행동하는 사람 바꾸기', '行動する人を変える', 'variation', [...afterForm, 'subject'], { variation: 'subject' }),
    group('vary-negation', '불가능했던 뜻 유지하기', 'できなかった意味を保つ', 'variation', [...afterForm, 'past', 'negation'], { variation: 'negation' }),
    group('repair-reasons', '형태와 뜻을 나누어 고치기', '形と意味を分けて直す', 'correction', afterForm),
    group('expand-information', '필요한 정보 하나 더하기', '必要な情報を1つ加える', 'expansion', [...afterForm, 'time_info']),
    group('independent-new', '오늘의 새 상황', '今日の新しい場面', 'independent', afterForm, { hideFormLesson: true }),
    group('delayed-new', '다른 날의 새 상황', '別の日の新しい場面', 'delayed', afterForm, { delayedOnly: true, hideFormLesson: true, releasePolicy: 'later_local_calendar_day', previewPolicy: 'hide_items_until_due' })
  ];

  const items = [];
  function sentence(spec) {
    const g = groups.find(value => value.id === spec.groupId);
    const defaults = {
      nodeId: g.nodeId, kind: 'sentence', targetForm: null, prerequisites: [...g.prerequisites],
      promptKo: ordinaryPromptKo, promptJa: ordinaryPromptJa, facts: [], image: null,
      support: { meaningJa: '', vocabulary: [] }, models: [], delayedOnly: g.delayedOnly,
      evidence: { independent: g.stage === 'independent' || g.stage === 'delayed', delayed: g.delayedOnly, assistedByDesign: false, relationProvided: true },
      evaluation: { required: [], forbidden: [], targetPattern: allForms, alternativePattern: alternatives, reviewRequired: false, meaningPolicy: 'not_automatically_verified' }
    };
    const result = { ...defaults, ...spec, evidence: { ...defaults.evidence, ...spec.evidence }, evaluation: { ...defaults.evaluation, ...spec.evaluation } };
    items.push(result);
    g.itemIds.push(result.id);
    return result;
  }
  function constrained(id, groupId, facts, meaningJa, models, cause, result, targetPattern, options = {}) {
    const required = [
      check('cause_component', cause, '주어진 이유의 핵심 내용이 문장에 있는지 확인해 보세요.', '示された理由の中心となる内容が文にあるか確認しましょう。'),
      check('result_component', result + ending, '주어진 행동이나 결과를 해요체로 끝까지 써 보세요.', '示された行動や結果を、ヘヨ体で最後まで書いてみましょう。')
    ];
    const { evaluation: extraEvaluation = {}, vocabulary = [], ...extra } = options;
    return sentence({
      id, groupId, facts, models,
      support: { meaningJa, vocabulary },
      ...extra,
      evaluation: {
        targetPattern,
        ...extraEvaluation,
        required: [...required, ...(extraEvaluation.required || [])],
        forbidden: [check('yo_seo', '(?:아요|어요|해요)\\s*서', '완성된 해요체 뒤에 서를 바로 붙였는지 확인해 보세요.', '完成したヘヨ体の後に、そのまま「서」を付けていないか確認しましょう。'), ...(extraEvaluation.forbidden || [])]
      }
    });
  }

  // P01 checks only these reviewed first-person present study sentences. Full anchoring
  // prevents matching an affirmative fragment inside a negative or unrelated sentence.
  // Subject/time are optional and may move around the required action-place phrase.
  const p01Subject = '(?:저는|제가)', p01Time = '지금(?:은)?', p01Place = '도서관에서';
  const p01Prefixes = [
    [p01Subject, p01Time, p01Place], [p01Subject, p01Place, p01Time],
    [p01Time, p01Subject, p01Place], [p01Time, p01Place, p01Subject],
    [p01Place, p01Subject, p01Time], [p01Place, p01Time, p01Subject],
    [p01Subject, p01Place], [p01Place, p01Subject],
    [p01Time, p01Place], [p01Place, p01Time], [p01Place]
  ].map(parts => parts.join('\\s*')).join('|');
  const p01PresentSentence = '^(?:' + p01Prefixes + ')\\s*공부(?:를\\s*)?(?:해요|하고\\s*있어요)' + ending;

  // Narrow prerequisite probes. Choice answers confirm only the stated interpretation.
  sentence({ id: 'P01', groupId: 'probe-basics', nodeId: 'S01', targetForm: null, prerequisites: ['vocabulary'], image: 'study', promptKo: '지금 내가 하는 일을 해요체 한 문장으로 써 보세요. 행동을 하는 장소도 넣으세요.', promptJa: '今していることをヘヨ体の1文で書きましょう。行動する場所も入れてください。', facts: [fact('장소: 도서관', '場所：図書館'), fact('행동: 공부', '行動：勉強')], support: { meaningJa: '自分が図書館で勉強している場面です。まだ理由は書きません。', vocabulary: [word('도서관', '図書館'), word('공부하다', '勉強する')] }, models: ['저는 도서관에서 공부해요.', '도서관에서 공부해요.'], evidence: { independent: false, relationProvided: false, prerequisiteFor: ['basic_sentence'] }, evaluation: { targetPattern: null, alternativePattern: null, required: [check('action_place', '도서관에서', '공부하는 장소를 나타내 보세요.', '勉強する場所を示してみましょう。'), check('simple_predicate', p01PresentSentence, '자동 확인 범위에서 ‘지금 도서관에서 공부하는 일’을 나타내는 문장을 찾지 못했어요. 문장 전체를 다시 읽어 보세요. 다른 자연스러운 표현일 수도 있어요.', '自動確認の範囲では、「今、図書館で勉強していること」を表す文を確認できませんでした。文全体を読み直してみましょう。別の自然な表現である可能性もあります。')], meaningPolicy: 'not_automatically_verified' } });
  sentence({ id: 'P02', groupId: 'probe-basics', nodeId: 'S03', targetForm: null, prerequisites: ['vocabulary'], image: 'work', promptKo: '두 사실을 각각 해요체 한 문장으로 써 보세요. 아직 두 문장을 연결하지 마세요.', promptJa: '2つの事実を、それぞれヘヨ体の1文で書きましょう。まだ文はつなぎません。', facts: [fact('일: 많다', '仕事：多い'), fact('퇴근: 늦게', '退勤：遅い時間に')], support: { meaningJa: '仕事が多いことと、遅く退勤することを、別々の文で書きます。', vocabulary: [word('일', '仕事'), word('많다', '多い'), word('늦게', '遅く'), word('퇴근하다', '退勤する')] }, models: ['일이 많아요. 늦게 퇴근해요.'], evidence: { independent: false, relationProvided: false, prerequisiteFor: ['basic_sentence'] }, evaluation: { targetPattern: null, alternativePattern: null, required: [check('state_sentence', '일(?:이|은)\\s*많아요', '일의 양을 완결된 문장으로 써 보세요.', '仕事の量を、完結した文で書いてみましょう。'), check('action_sentence', '(?:늦게\\s*퇴근해요|퇴근을\\s*늦게\\s*해요)', '퇴근하는 일을 별도 문장으로 써 보세요.', '退勤することを別の文で書いてみましょう。')], meaningPolicy: 'not_automatically_verified' } });
  sentence({ id: 'P03', groupId: 'probe-basics', kind: 'relation', prerequisites: ['vocabulary'], promptKo: '이 장면에서 늦게 퇴근하는 이유를 고르세요.', promptJa: 'この場面で、退勤が遅くなる理由を選びましょう。', facts: [fact('일이 많아요.', '仕事が多いです。'), fact('늦게 퇴근해요.', '遅く退勤します。')], support: { meaningJa: '仕事の量が多く、帰る時間が遅くなった場面です。', vocabulary: [] }, choices: [{ id: 'work', labelKo: '일이 많아요.', labelJa: '仕事が多いこと' }, { id: 'leaving', labelKo: '늦게 퇴근해요.', labelJa: '遅く退勤すること' }], models: [], evidence: { independent: false, relationProvided: true, prerequisiteFor: ['relation'] }, evaluation: { targetPattern: null, alternativePattern: null, correctChoiceId: 'work', expectedRelation: 'cause', meaningPolicy: 'narrow_choice_only' } });
  sentence({ id: 'P04', groupId: 'probe-basics', nodeId: 'S04', kind: 'relation', prerequisites: ['vocabulary'], promptKo: '이 문장의 뜻과 맞는 쪽을 고르세요.', promptJa: '文の意味に合うものを選びましょう。', facts: [fact('시간이 없어요.', '文を読んで意味を選びましょう。')], support: { meaningJa: '「있다」と「없다」の違いを確認します。', vocabulary: [word('시간', '時間')] }, choices: [{ id: 'available', labelKo: '쓸 시간이 있어요.', labelJa: '使える時間があります。' }, { id: 'unavailable', labelKo: '쓸 시간이 없어요.', labelJa: '使える時間がありません。' }], models: [], evidence: { independent: false, relationProvided: false, prerequisiteFor: ['negation'] }, evaluation: { targetPattern: null, alternativePattern: null, correctChoiceId: 'unavailable', expectedRelation: 'absence', meaningPolicy: 'narrow_choice_only' } });
  sentence({ id: 'P05', groupId: 'probe-basics', nodeId: 'S04', kind: 'relation', prerequisites: ['vocabulary'], promptKo: '영화를 볼 수 없었다는 뜻을 더 분명하게 나타내는 문장을 고르세요.', promptJa: '映画を「見ることができなかった」と、よりはっきり表す文を選びましょう。', facts: [], support: { meaningJa: 'どちらも「見ていない」場面で使えます。できなかったことを明確にする表現を選びます。', vocabulary: [word('영화', '映画'), word('보다', '見る')] }, choices: [{ id: 'not_seen', labelKo: '영화를 보지 않았어요.', labelJa: '영화를 보지 않았어요.' }, { id: 'unable', labelKo: '영화를 보지 못했어요.', labelJa: '영화를 보지 못했어요.' }], models: [], evidence: { independent: false, relationProvided: false, prerequisiteFor: ['negation'] }, evaluation: { targetPattern: null, alternativePattern: null, correctChoiceId: 'unable', expectedRelation: 'inability', meaningPolicy: 'narrow_choice_only' }, teacherNoteKo: '안 부정도 비의도적인 비발생을 표현할 수 있어요. 오직 불가능을 더 명시하는 표현을 확인하는 문항이에요.' });
  sentence({ id: 'P06', groupId: 'probe-basics', nodeId: 'S04', prerequisites: ['basic_sentence', 'vocabulary'], promptKo: '어제의 일을 해요체 한 문장으로 써 보세요. 아직 이유는 넣지 마세요.', promptJa: '昨日のことをヘヨ体の1文で書きましょう。まだ理由は入れません。', facts: [fact('언제: 어제', 'いつ：昨日'), fact('행동: 늦게 퇴근하다', '行動：遅く退勤する')], support: { meaningJa: '昨日、遅く退勤しました。時点だけを確認します。', vocabulary: [word('어제', '昨日')] }, models: ['어제 늦게 퇴근했어요.', '어제는 퇴근을 늦게 했어요.'], evidence: { independent: false, relationProvided: false, prerequisiteFor: ['past'] }, evaluation: { targetPattern: null, alternativePattern: null, required: [check('yesterday', '어제', '어제의 일이라는 정보를 넣어 보세요.', '昨日のことだと分かる情報を入れましょう。'), check('past_action', '(?:늦게\\s*퇴근했어요|퇴근을\\s*늦게\\s*했어요)' + ending, '퇴근한 일을 과거 해요체로 써 보세요.', '退勤したことを過去のヘヨ体で書いてみましょう。')] } });

  // Nine form drills. R01 deliberately reconstructs the teaching model and is not new-context evidence.
  constrained('R01', 'form-aseo', [fact('일이 많아요.', '仕事が多いです。'), fact('늦게 퇴근해요.', '遅く退勤します。')], 'この場面では、仕事が多いことが退勤の遅い理由です。', ['일이 많아서 늦게 퇴근해요.'], '일(?:이|은)\\s*많', '(?:늦게\\s*퇴근해요|퇴근을\\s*늦게\\s*해요)', '일(?:이|은)\\s*많아서', { targetForm: '아서', image: 'work', vocabulary: [word('많다', '多い'), word('퇴근하다', '退勤する')], evidence: { assistedByDesign: true, modelReconstruction: true } });
  constrained('R02', 'form-aseo', [fact('날씨가 좋아요.', '天気がいいです。'), fact('공원에 가요.', '公園に行きます。')], '天気がいいことが、公園へ行く理由です。', ['날씨가 좋아서 공원에 가요.', '날씨가 좋아서 저는 공원에 가요.'], '날씨(?:가|는)\\s*좋', '공원에\\s*가요', '날씨(?:가|는)\\s*좋아서', { targetForm: '아서', image: 'park', vocabulary: [word('날씨', '天気'), word('공원', '公園')] });
  constrained('R03', 'form-aseo', [fact('숙제가 많아요.', '宿題が多いです。'), fact('집에서 공부해요.', '家で勉強します。')], 'この場面では、宿題が多いことが家で勉強する理由です。', ['숙제가 많아서 집에서 공부해요.'], '숙제(?:가|는)\\s*많', '집에서\\s*공부(?:를\\s*)?해요', '숙제(?:가|는)\\s*많아서', { targetForm: '아서', vocabulary: [word('숙제', '宿題'), word('집', '家')] });
  constrained('R04', 'form-eoseo', [fact('시간이 없어요.', '時間がありません。'), fact('택시를 타요.', 'タクシーに乗ります。')], 'この場面では、時間が足りずタクシーを選びます。どんな場合でもタクシーが速いという意味ではありません。', ['시간이 없어서 택시를 타요.'], '시간(?:이|은)\\s*없', '택시(?:를|는)\\s*타요', '시간(?:이|은)\\s*없어서', { targetForm: '어서', vocabulary: [word('시간', '時間'), word('택시', 'タクシー'), word('타다', '乗る')] });
  constrained('R05', 'form-eoseo', [fact('길이 멀어요.', '道のりが遠いです。'), fact('버스를 타요.', 'バスに乗ります。')], '目的地までの道のりが遠いことが、バスに乗る理由です。', ['길이 멀어서 버스를 타요.'], '길(?:이|은)\\s*멀', '버스(?:를|는)\\s*타요', '길(?:이|은)\\s*멀어서', { targetForm: '어서', vocabulary: [word('길', '道のり'), word('멀다', '遠い'), word('버스', 'バス')] });
  constrained('R06', 'form-eoseo', [fact('집에 책이 없어요.', '家に本がありません。'), fact('도서관에 가요.', '図書館に行きます。')], '本を読む場面です。家に本がないことが、図書館へ行く理由です。', ['집에 책이 없어서 도서관에 가요.', '집에는 책이 없어서 도서관에 가요.'], '집에(?:는)?\\s*책(?:이|은)\\s*없', '도서관에\\s*가요', '책(?:이|은)\\s*없어서', { targetForm: '어서', vocabulary: [word('책', '本'), word('도서관', '図書館')] });
  constrained('R07', 'form-haeseo', [fact('길이 복잡해요.', '道が混雑しています。'), fact('지하철을 타요.', '地下鉄に乗ります。')], '道が混雑していることが、地下鉄を選ぶ理由です。', ['길이 복잡해서 지하철을 타요.', '길이 복잡하여서 지하철을 타요.'], '길(?:이|은)\\s*복잡', '지하철(?:을|은)\\s*타요', '길(?:이|은)\\s*복잡(?:해서|하여서)', { targetForm: '해서', vocabulary: [word('복잡하다', '混雑している'), word('지하철', '地下鉄')] });
  constrained('R08', 'form-haeseo', [fact('도서관이 조용해요.', '図書館は静かです。'), fact('여기에서 공부해요.', 'ここで勉強します。')], '「ここ」は図書館です。静かなことが、そこで勉強する理由です。', ['도서관이 조용해서 여기에서 공부해요.', '도서관이 조용해서 저는 그곳에서 공부해요.'], '도서관(?:이|은)\\s*조용', '(?:여기(?:에)?서|그곳에서|도서관에서)\\s*공부(?:를\\s*)?해요', '도서관(?:이|은)\\s*조용(?:해서|하여서)', { targetForm: '해서', image: 'study', vocabulary: [word('조용하다', '静かだ'), word('여기', 'ここ（この図書館）')] });
  constrained('R09', 'form-haeseo', [fact('방이 깨끗해요.', '部屋がきれいです。'), fact('기분이 좋아요.', '気分がいいです。')], '部屋がきれいなことが、気分のいい理由です。', ['방이 깨끗해서 기분이 좋아요.'], '방(?:이|은)\\s*깨끗', '기분(?:이|은)\\s*좋아요', '방(?:이|은)\\s*깨끗(?:해서|하여서)', { targetForm: '해서', vocabulary: [word('방', '部屋'), word('깨끗하다', 'きれいだ'), word('기분', '気分')] });

  // Six mixed whole-sentence items, with no sentence frames.
  constrained('R10', 'mixed-reasons', [fact('행사가 있어요.', 'イベントがあります。'), fact('사람이 많아요.', '人が多いです。')], 'イベントがあることが、その場所に人の多い理由です。', ['행사가 있어서 사람이 많아요.'], '행사(?:가|는)\\s*있', '사람(?:이|은)\\s*많아요', '행사(?:가|는)\\s*있어서', { targetForm: '어서', vocabulary: [word('행사', 'イベント')] });
  constrained('R11', 'mixed-reasons', [fact('돈이 없어요.', 'お金がありません。'), fact('집에서 쉬어요.', '家で休みます。')], 'この場面では、お金がないことが家で休む理由です。', ['돈이 없어서 집에서 쉬어요.'], '돈(?:이|은)\\s*없', '집에서\\s*쉬어요', '돈(?:이|은)\\s*없어서', { targetForm: '어서', vocabulary: [word('돈', 'お金'), word('쉬다', '休む')] });
  constrained('R12', 'mixed-reasons', [fact('공부를 많이 해요.', 'たくさん勉強します。'), fact('답을 알아요.', '答えが分かります。')], 'よく勉強していることが、答えを知っている理由です。', ['공부를 많이 해서 답을 알아요.', '많이 공부해서 답을 알아요.'], '(?:공부(?:를)?\\s*많이|많이\\s*공부)', '답(?:을|은)\\s*알아요', '(?:공부(?:를)?\\s*많이\\s*(?:해서|하여서)|많이\\s*공부(?:해서|하여서))', { targetForm: '해서', vocabulary: [word('많이', 'たくさん'), word('답', '答え'), word('알다', '知っている')] });
  constrained('R13', 'mixed-reasons', [fact('피곤해요.', '疲れています。'), fact('일찍 자요.', '早く寝ます。')], '疲れていることが、早く寝る理由です。', ['피곤해서 일찍 자요.'], '피곤', '일찍\\s*자요', '피곤(?:해서|하여서)', { targetForm: '해서', vocabulary: [word('피곤하다', '疲れている'), word('일찍', '早く')] });
  constrained('R14', 'mixed-reasons', [fact('식당이 유명해요.', '食堂が有名です。'), fact('손님이 많아요.', 'お客さんが多いです。')], 'この場面では、食堂が有名なことが客の多い理由です。', ['식당이 유명해서 손님이 많아요.'], '식당(?:이|은)\\s*유명', '손님(?:이|은)\\s*많아요', '식당(?:이|은)\\s*유명(?:해서|하여서)', { targetForm: '해서', vocabulary: [word('식당', '食堂'), word('유명하다', '有名だ'), word('손님', 'お客さん')] });
  constrained('R15', 'mixed-reasons', [fact('회의실이 작아요.', '会議室が小さいです。'), fact('다른 방을 사용해요.', '別の部屋を使います。')], '会議室が小さいことが、別の部屋を使う理由です。', ['회의실이 작아서 다른 방을 사용해요.', '회의실이 작아서 다른 방을 써요.'], '회의실(?:이|은)\\s*작', '다른\\s*방(?:을|은)\\s*(?:사용해요|써요)', '회의실(?:이|은)\\s*작아서', { targetForm: '아서', vocabulary: [word('회의실', '会議室'), word('작다', '小さい'), word('다른', '別の'), word('사용하다', '使う')] });

  // One changed condition at a time. The negative variation retains the source's already-known past.
  constrained('R16', 'vary-time', [fact('어제 일이 많았어요.', '昨日は仕事が多かったです。'), fact('어제 늦게 퇴근했어요.', '昨日は遅く退勤しました。')], '昨日の出来事です。仕事の量が退勤の遅かった理由です。', ['어제는 일이 많아서 늦게 퇴근했어요.', '어제 일이 많아서 퇴근을 늦게 했어요.'], '일(?:이|은)\\s*많', '(?:늦게\\s*퇴근했어요|퇴근을\\s*늦게\\s*했어요)', '일(?:이|은)\\s*많아서', { targetForm: '아서', image: 'work', evaluation: { required: [check('past_context', '어제', '어제의 일이라는 정보를 유지해 보세요.', '昨日の出来事だと分かる情報を保ちましょう。')] }, teacherNoteKo: '원인절에 과거 표지를 넣지 않은 기본 연결을 연습해요. 현대 한국어의 모든 과거 결합을 불가능하다고 일반화하지 않아요.' });
  constrained('R17', 'vary-time', [fact('어제 방이 깨끗했어요.', '昨日は部屋がきれいでした。'), fact('어제 기분이 좋았어요.', '昨日は気分がよかったです。')], '昨日の出来事です。部屋がきれいだったことが、気分のよかった理由です。', ['어제는 방이 깨끗해서 기분이 좋았어요.'], '방(?:이|은)\\s*깨끗', '기분(?:이|은)\\s*좋았어요', '방(?:이|은)\\s*깨끗(?:해서|하여서)', { targetForm: '해서', evaluation: { required: [check('past_context', '어제', '어제의 일이라는 정보를 유지해 보세요.', '昨日の出来事だと分かる情報を保ちましょう。')] } });
  constrained('R18', 'vary-subject', [fact('도서관이 조용해요.', '図書館は静かです。'), fact('동료가 여기에서 공부해요.', '同僚がここで勉強します。')], '「ここ」は図書館です。静かなことが同僚の勉強する理由です。勉強する人をはっきり示します。', ['도서관이 조용해서 동료가 여기에서 공부해요.', '도서관이 조용해서 동료는 그곳에서 공부해요.'], '도서관(?:이|은)\\s*조용', '(?:여기(?:에)?서|그곳에서|도서관에서)\\s*공부(?:를\\s*)?해요', '도서관(?:이|은)\\s*조용(?:해서|하여서)', { targetForm: '해서', vocabulary: [word('동료', '同僚')], evaluation: { required: [check('named_subject', '동료(?:가|는)', '공부하는 사람이 동료라는 점을 밝혀 보세요.', '勉強する人が同僚だと示しましょう。')] } });
  constrained('R19', 'vary-subject', [fact('일이 많아요.', '仕事が多いです。'), fact('팀원들이 늦게 퇴근해요.', 'チームのメンバーが遅く退勤します。')], '仕事の多さが、チームのメンバーの退勤が遅い理由です。', ['일이 많아서 팀원들이 늦게 퇴근해요.', '일이 많아서 팀원들은 늦게 퇴근해요.'], '일(?:이|은)\\s*많', '(?:늦게\\s*퇴근해요|퇴근을\\s*늦게\\s*해요)', '일(?:이|은)\\s*많아서', { targetForm: '아서', vocabulary: [word('팀원들', 'チームのメンバーたち')], evaluation: { required: [check('named_subject', '팀원들(?:이|은)', '늦게 퇴근하는 사람들이 팀원들이라는 점을 밝혀 보세요.', '遅く退勤するのがチームのメンバーだと示しましょう。')] } });
  constrained('R20', 'vary-negation', [fact('어제 시간이 없었어요.', '昨日は時間がありませんでした。'), fact('어제 영화를 보지 못했어요.', '昨日は映画を見ることができませんでした。')], '時間が足りず、映画を見られませんでした。「できなかった」ことを明確に書きます。', ['어제는 시간이 없어서 영화를 보지 못했어요.', '어제 시간이 없어서 영화를 못 봤어요.'], '시간(?:이|은)\\s*없', '영화(?:를|는)\\s*(?:보지\\s*못했어요|못\\s*봤어요)', '시간(?:이|은)\\s*없어서', { targetForm: '어서', evaluation: { required: [check('past_context', '어제', '어제의 일이라는 정보를 유지해 보세요.', '昨日の出来事だと分かる情報を保ちましょう。'), check('inability', '(?:보지\\s*못했어요|못\\s*봤어요)', '보지 않았다는 사실과 볼 수 없었다는 뜻을 구분해요. 이번에는 못으로 불가능을 더 분명하게 써 보세요.', '見なかった事実と、見られなかったことを区別します。今回は「못」で不可能を明確にしましょう。')] } });
  constrained('R21', 'vary-negation', [fact('어제 돈이 없었어요.', '昨日はお金がありませんでした。'), fact('어제 책을 사지 못했어요.', '昨日は本を買うことができませんでした。')], 'お金がなくて、本を買えませんでした。「できなかった」ことを明確に書きます。', ['어제는 돈이 없어서 책을 사지 못했어요.', '어제 돈이 없어서 책을 못 샀어요.'], '돈(?:이|은)\\s*없', '책(?:을|은)\\s*(?:사지\\s*못했어요|못\\s*샀어요)', '돈(?:이|은)\\s*없어서', { targetForm: '어서', evaluation: { required: [check('past_context', '어제', '어제의 일이라는 정보를 유지해 보세요.', '昨日の出来事だと分かる情報を保ちましょう。'), check('inability', '(?:사지\\s*못했어요|못\\s*샀어요)', '이번에는 책을 살 수 없었다는 뜻을 못으로 더 분명하게 써 보세요.', '今回は「못」を使い、本を買えなかったことを明確にしましょう。')] } });

  // Four repairs: form, direction, precision of inability, and preservation of supplied facts.
  constrained('R22', 'repair-reasons', [fact('일이 많아요.', '仕事が多いです。'), fact('늦게 퇴근해요.', '遅く退勤します。')], '意味を保ち、理由をつなぐ形を直します。', ['일이 많아서 늦게 퇴근해요.'], '일(?:이|은)\\s*많', '(?:늦게\\s*퇴근해요|퇴근을\\s*늦게\\s*해요)', '일(?:이|은)\\s*많아서', { targetForm: '아서', draftKo: '일이 많아요서 늦게 퇴근해요.', promptKo: '초고의 뜻은 유지하고 연결 형태를 고쳐 전체 문장을 다시 써 보세요.', promptJa: '下書きの意味を保ち、接続の形を直して全文を書き直しましょう。', evidence: { independent: false, correctionDimension: 'form' } });
  constrained('R23', 'repair-reasons', [fact('일이 많아요.', '仕事が多いです。'), fact('늦게 퇴근해요.', '遅く退勤します。')], 'この場面では、仕事が多いことが退勤の遅い理由です。下書きはこの関係が逆です。', ['일이 많아서 늦게 퇴근해요.'], '일(?:이|은)\\s*많', '(?:늦게\\s*퇴근해요|퇴근을\\s*늦게\\s*해요)', '일(?:이|은)\\s*많아서', { targetForm: '아서', draftKo: '늦게 퇴근해서 일이 많아요.', promptKo: '이 장면의 이유와 결과에 맞게 초고를 고쳐 전체 문장을 써 보세요.', promptJa: 'この場面の理由と結果に合うように、下書きの全文を書き直しましょう。', teacherNoteKo: '초고는 문법적으로 불가능한 문장이 아니에요. 제공된 장면의 원인 방향과 다르다는 점을 짚어요.', evidence: { independent: false, correctionDimension: 'direction' } });
  constrained('R24', 'repair-reasons', [fact('시간이 없었어요.', '時間がありませんでした。'), fact('영화를 볼 수 없었어요.', '映画を見ることができませんでした。')], '下書きは映画を見なかった事実を表します。今回は時間が足りず見られなかったことを、もっと明確にします。', ['시간이 없어서 영화를 보지 못했어요.', '시간이 없어서 영화를 못 봤어요.'], '시간(?:이|은)\\s*없', '영화(?:를|는)\\s*(?:보지\\s*못했어요|못\\s*봤어요)', '시간(?:이|은)\\s*없어서', { targetForm: '어서', prerequisites: [...afterForm, 'past', 'negation'], draftKo: '시간이 없어서 영화를 보지 않았어요.', promptKo: '초고는 영화를 보지 않았다는 사실을 말해요. 이번에는 시간이 부족해 볼 수 없었다는 뜻이 더 분명하도록 전체 문장을 고쳐 보세요.', promptJa: '下書きは映画を見なかった事実を表します。時間が足りず、見ることができなかったとより明確に伝わる全文に直しましょう。', teacherNoteKo: '보지 않았어요를 문법 오류나 상황 모순으로 단정하지 않아요. 과제에서 요구한 불가능 의미를 더 명시하는 수정이에요.', evidence: { independent: false, correctionDimension: 'precision' } });
  constrained('R25', 'repair-reasons', [fact('도서관이 조용해요.', '図書館は静かです。'), fact('도서관에서 공부해요.', '図書館で勉強します。')], 'この場面で示された理由は、図書館が静かなことです。部屋がきれいかどうかは示されていません。', ['도서관이 조용해서 도서관에서 공부해요.', '도서관이 조용해서 그곳에서 공부해요.'], '도서관(?:이|은)\\s*조용', '(?:도서관에서|그곳에서)\\s*공부(?:를\\s*)?해요', '도서관(?:이|은)\\s*조용(?:해서|하여서)', { targetForm: '해서', draftKo: '방이 깨끗해서 도서관에서 공부해요.', promptKo: '주어진 사실과 이유를 바꾸지 않도록 초고를 고쳐 전체 문장을 써 보세요.', promptJa: '示された事実と理由を変えないように、下書きの全文を書き直しましょう。', teacherNoteKo: '초고가 어떤 상황에서도 틀렸다는 뜻은 아니에요. 이번 과제에 제시된 이유를 유지하도록 고쳐요.', evidence: { independent: false, correctionDimension: 'facts' } });

  constrained('E01', 'expand-information', [fact('회의실이 작아요.', '会議室が小さいです。'), fact('다른 방을 사용해요.', '別の部屋を使います。'), fact('언제: 오늘', 'いつ：今日')], '会議室が小さいことが別の部屋を使う理由です。「今日」という情報を1つ加えてください。', ['회의실이 작아서 오늘은 다른 방을 사용해요.', '오늘은 회의실이 작아서 다른 방을 사용해요.'], '회의실(?:이|은)\\s*작', '다른\\s*방(?:을|은)\\s*(?:사용해요|써요)', '회의실(?:이|은)\\s*작아서', { targetForm: '아서', promptKo: '이유와 결과를 유지하며 오늘이라는 시간 정보 하나를 더해 한 문장으로 써 보세요.', promptJa: '理由と結果を保ち、「今日」という時間の情報を1つ加えて1文で書きましょう。', vocabulary: [word('오늘', '今日')], evaluation: { required: [check('added_time', '오늘', '오늘이라는 새 정보가 문장에 있는지 확인해 보세요.', '「今日」という新しい情報が文にあるか確認しましょう。')] }, evidence: { independent: false, informationAdded: 'time' }, teacherNoteKo: '수량·만·가능 표현·는데를 동시에 넣지 않아요. 각각 준비된 뒤의 후속 과제이며 현재 이용 가능한 문항은 시간 정보 하나까지예요.' });

  // Independent facts are new and have no target conjugation or sentence frame in learner support.
  constrained('I01', 'independent-new', [fact('공원이 넓어요.', '公園が広いです。'), fact('여기에서 산책해요.', 'ここで散歩します。')], '「ここ」はこの公園です。広いことが、ここで散歩する理由です。', ['공원이 넓어서 여기에서 산책해요.', '공원이 넓어서 저는 그곳에서 산책해요.'], '공원(?:이|은)\\s*넓', '(?:여기(?:에)?서|그곳에서|공원에서)\\s*산책(?:을\\s*)?해요', '공원(?:이|은)\\s*넓어서', { targetForm: '어서', image: 'park', promptKo: '새 상황이에요. 예문 없이, 두 사실을 이번에 연습한 이유 연결 형태로 한 문장에 담아 보세요.', promptJa: '新しい場面です。例文を見ずに、2つの事実を今回練習した理由の形で1文にしましょう。', vocabulary: [word('넓다', '広い'), word('산책하다', '散歩する')], evidence: { independent: true, newContext: true } });
  constrained('I02', 'independent-new', [fact('의자가 편해요.', 'いすが快適です。'), fact('여기에 앉아요.', 'ここに座ります。')], '「ここ」はそのいすです。いすが快適なことが、ここに座る理由です。', ['의자가 편해서 여기에 앉아요.', '의자가 편해서 이 의자에 앉아요.'], '의자(?:가|는)\\s*편', '(?:여기에|이\\s*의자에|그\\s*의자에)\\s*앉아요', '의자(?:가|는)\\s*편(?:해서|하여서)', { targetForm: '해서', promptKo: '새 상황이에요. 예문 없이, 두 사실을 이번에 연습한 이유 연결 형태로 한 문장에 담아 보세요.', promptJa: '新しい場面です。例文を見ずに、2つの事実を今回練習した理由の形で1文にしましょう。', vocabulary: [word('의자', 'いす'), word('편하다', '快適だ'), word('앉다', '座る')], evidence: { independent: true, newContext: true } });
  sentence({ id: 'I03', groupId: 'independent-new', kind: 'free', targetForm: null, promptKo: '최근에 장소나 행동을 선택한 이유 하나를 이번에 연습한 형태로 한 문장에 써 보세요. 개인 이야기를 쓰고 싶지 않으면 아래 가상 상황을 써도 좋아요.', promptJa: '最近、場所や行動を選んだ理由を、今回練習した形で1文にしましょう。個人の話を書きたくなければ、下の架空の場面を使ってもかまいません。', facts: [fact('가상 상황: 카페가 조용해요.', '架空の場面：カフェは静かです。'), fact('그곳에서 책을 읽어요.', 'そこで本を読みます。')], support: { meaningJa: '架空の場面では、静かなことがそのカフェで本を読む理由です。別の自分の場面でもかまいません。', vocabulary: [word('카페', 'カフェ'), word('읽다', '読む')] }, models: ['카페가 조용해서 그곳에서 책을 읽어요.'], evaluation: { required: [], forbidden: [], targetPattern: allForms, alternativePattern: alternatives, reviewRequired: true, meaningPolicy: 'human_review_required' }, evidence: { independent: true, newContext: true, relationProvided: true, relationEvidence: 'not_assessed_free_or_provided_fallback', personalDisclosureOptional: true }, teacherNoteKo: '형태가 보인다는 사실과 실제로 타당한 이유를 썼다는 판단을 분리해요. 자기점검은 사람 검토 완료와 다르며 이 문항을 자동 의미 통과로 표시하지 않아요.' });

  // Held-out scenarios: never reuse these facts in lessons, cards, previews, or same-day practice.
  constrained('D01', 'delayed-new', [fact('영화가 재미있어요.', '映画がおもしろいです。'), fact('다시 봐요.', 'もう一度見ます。')], '映画がおもしろいことが、もう一度見る理由です。', ['영화가 재미있어서 다시 봐요.', '영화가 재미있어서 영화를 다시 봐요.'], '영화(?:가|는)\\s*재미있', '(?:영화(?:를|는)\\s*)?다시\\s*봐요', '영화(?:가|는)\\s*재미있어서', { targetForm: '어서', image: 'movie', promptKo: '다른 날의 새 상황이에요. 예문을 열기 전에, 두 사실을 이번에 연습한 이유 연결 형태로 한 문장에 써 보세요.', promptJa: '別の日の新しい場面です。例文を開く前に、2つの事実を今回練習した理由の形で1文にしましょう。', vocabulary: [word('재미있다', 'おもしろい'), word('다시', 'もう一度')], evidence: { independent: true, delayed: true, newContext: true, heldOut: true } });
  constrained('D02', 'delayed-new', [fact('날씨가 맑아요.', '天気が晴れています。'), fact('밖에서 운동해요.', '外で運動します。')], '晴れていることが、外で運動する理由です。', ['날씨가 맑아서 밖에서 운동해요.'], '날씨(?:가|는)\\s*맑', '밖에서\\s*운동(?:을\\s*)?해요', '날씨(?:가|는)\\s*맑아서', { targetForm: '아서', promptKo: '다른 날의 새 상황이에요. 예문을 열기 전에, 두 사실을 이번에 연습한 이유 연결 형태로 한 문장에 써 보세요.', promptJa: '別の日の新しい場面です。例文を開く前に、2つの事実を今回練習した理由の形で1文にしましょう。', vocabulary: [word('맑다', '晴れている'), word('밖', '外'), word('운동하다', '運動する')], evidence: { independent: true, delayed: true, newContext: true, heldOut: true } });

  // Item-specific morphology help belongs only to supported form practice.
  const formLessons = {
    R01: ['많다 → 많아서', '多い → 理由につなぐ形'],
    R02: ['좋다 → 좋아서', 'よい → 理由につなぐ形'],
    R03: ['많다 → 많아서', '多い → 理由につなぐ形'],
    R04: ['없다 → 없어서', 'ない → 理由につなぐ形'],
    R05: ['멀다 → 멀어서', '遠い → 理由につなぐ形'],
    R06: ['없다 → 없어서', 'ない → 理由につなぐ形'],
    R07: ['복잡하다 → 복잡해서', '混雑している → 理由につなぐ形'],
    R08: ['조용하다 → 조용해서', '静かだ → 理由につなぐ形'],
    R09: ['깨끗하다 → 깨끗해서', 'きれいだ → 理由につなぐ形']
  };
  for (const item of items) {
    if (formLessons[item.id]) {
      item.support.lessonKo = formLessons[item.id][0];
      item.support.lessonJa = formLessons[item.id][1];
      item.support.helpKo = '완성된 해요체 뒤에 서를 붙이지 않아요. 연결한 뒤 문장 전체를 직접 써 보세요.';
      item.support.helpJa = '完成したヘヨ体の後にそのまま「서」を付けません。つないだら、全文を自分で書きましょう。';
      item.evidence.assistedByDesign = true;
    }
  }
  // ----- Sentence-foundation sub-units S01–S06 (one bounded unit per ability) ----------------
  // Each node gets one practice unit and one independent transfer item. Automatic checks observe
  // only listed components (a word, a particle, a conjugated ending, a modifier); meaning,
  // naturalness and mastery are never certified, and the feedback says which component is missing.
  const politeEnding = '요\\s*[.!?]?$';
  const unitPrompts = {
    S01: ['주어진 사실을 해요체 한 문장으로 써 보세요. 무엇이 어떤지 분명하게 쓰면 돼요.', '与えられた事実をヘヨ体の1文で書きましょう。何がどうなのかをはっきり書きます。'],
    S02: ['주어진 말에 알맞은 조사를 붙여 해요체 한 문장으로 써 보세요.', '与えられた語に合う助詞を付けて、ヘヨ体の1文で書きましょう。'],
    S03: ['주어진 서술어를 알맞은 형태로 바꾸어 해요체 한 문장으로 써 보세요.', '与えられた述語を正しい形に変えて、ヘヨ体の1文で書きましょう。'],
    S04: ['언제의 일인지, 하지 않았는지가 분명하도록 해요체 한 문장으로 써 보세요.', 'いつのことか、しなかったことかをはっきりさせて、ヘヨ体の1文で書きましょう。'],
    S05: ['주어진 정보를 모두 넣어 해요체 한 문장으로 써 보세요.', '与えられた情報をすべて入れて、ヘヨ体の1文で書きましょう。'],
    S06: ['어떤 대상인지 수식하는 말을 넣어 해요체 한 문장으로 써 보세요.', 'どんな対象かを修飾する言葉を入れて、ヘヨ体の1文で書きましょう。']
  };
  // One message per node keeps the learner-facing feedback specific without inventing a verdict.
  const nodeHint = {
    S01: '주어진 사실을 빠뜨리지 않고 한 문장에 넣었는지 확인해 보세요.',
    S02: '주어진 말에 알맞은 조사를 붙였는지 확인해 보세요.',
    S03: '주어진 서술어를 알맞은 형태로 바꿨는지 확인해 보세요.',
    S04: '언제의 일인지, 하지 않았는지가 드러나는지 확인해 보세요.',
    S05: '주어진 정보를 모두 넣었는지 확인해 보세요.',
    S06: '어떤 대상인지 수식하는 말을 넣었는지 확인해 보세요.'
  };
  const nodeHintJa = {
    S01: '与えられた事実を落とさず、1文に入れたか確認しましょう。',
    S02: '与えられた語に合う助詞を付けたか確認しましょう。',
    S03: '与えられた述語を正しい形に変えたか確認しましょう。',
    S04: 'いつのことか、しなかったことが表れているか確認しましょう。',
    S05: '与えられた情報をすべて入れたか確認しましょう。',
    S06: 'どんな対象かを修飾する言葉を入れたか確認しましょう。'
  };
  const foundationNodes = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06'];
  // Every sentence-foundation node now runs the same stage skeleton as the cause-writing unit:
  // form practice → mixed → variation → correction → expansion → independent → delayed.
  const foundationStages = [
    { key: 'mixed', stage: 'mixed', titleKo: '새 내용으로 쓰기', titleJa: '新しい内容で書く', helpKo: '배운 형태를 처음 보는 사실에 그대로 써 봐요.', helpJa: '習った形を、初めて見る事実にそのまま使ってみます。', promptKo: '새로운 사실로 같은 형태를 한 문장에 써 보세요. 주어진 정보를 모두 넣으세요.', promptJa: '新しい事実で同じ形を1文に書きましょう。与えられた情報をすべて入れてください。' },
    { key: 'vary', stage: 'variation', titleKo: '조건 하나 바꾸기', titleJa: '条件を1つ変える', helpKo: '시제·주체·부정 중 하나만 바꾸고 나머지 뜻은 유지해요.', helpJa: '時制・主体・否定のどれか1つだけを変え、ほかの意味は保ちます。', promptKo: '조건 하나만 바꾸어 뜻을 유지한 채 다시 써 보세요.', promptJa: '条件を1つだけ変え、意味を保ったまま書き直しましょう。' },
    { key: 'repair', stage: 'correction', titleKo: '초고 고치기', titleJa: '下書きを直す', helpKo: '틀린 부분만 고쳐요. 문장 전체를 새로 쓰지 않아도 돼요.', helpJa: '間違っている部分だけを直します。文全体を書き直さなくてもかまいません。', promptKo: '초고에서 잘못된 부분만 고쳐 해요체 한 문장으로 써 보세요.', promptJa: '下書きの間違っている部分だけを直し、ヘヨ体の1文で書きましょう。' },
    { key: 'expand', stage: 'expansion', titleKo: '정보 하나 더하기', titleJa: '情報を1つ加える', helpKo: '시간·장소·상대·정도 중 하나를 더 넣어 정보를 분명하게 해요.', helpJa: '時・場所・相手・程度のどれかを1つ加えて、情報をはっきりさせます。', promptKo: '한 문장에 필요한 정보를 하나 더 넣어 써 보세요.', promptJa: '1文に必要な情報をもう1つ加えて書きましょう。' },
    { key: 'independent', stage: 'independent', titleKo: '새 상황에서 혼자 쓰기', titleJa: '新しい場面で一人で書く', helpKo: '예문 없이, 처음 보는 사실로 한 문장을 써요.', helpJa: '例文なしで、初めて見る事実から1文を書きます。', promptKo: '예문 없이 처음 보는 사실로 해요체 한 문장을 써 보세요.', promptJa: '例文なしで、初めて見る事実からヘヨ体の1文を書きましょう。', hideFormLesson: true },
    { key: 'delayed', stage: 'delayed', titleKo: '다른 날의 새 상황', titleJa: '別の日の新しい場面', helpKo: '첫 독립 작성에서 하루가 지나고 날짜가 바뀌면 열려요.', helpJa: '最初の独立した作文から1日が過ぎ、日付が変わると開きます。', promptKo: '다른 날, 처음 보는 사실로 해요체 한 문장을 써 보세요.', promptJa: '別の日に、初めて見る事実からヘヨ体の1文を書きましょう。', delayedOnly: true, hideFormLesson: true, releasePolicy: 'later_local_calendar_day', previewPolicy: 'hide_items_until_due' },
  ];
  foundationNodes.forEach(nodeId => {
    const target = nodes.find(value => value.id === nodeId), prerequisites = ['basic_sentence'];
    groups.push(group(`${nodeId.toLowerCase()}-practice`, target.titleKo, target.titleJa, 'form', prerequisites, { nodeId, helpKo: unitPrompts[nodeId][0], helpJa: unitPrompts[nodeId][1] }));
    for (const stage of foundationStages.filter(value => value.key !== 'independent' && value.key !== 'delayed')) {
      const extra = { helpKo: stage.helpKo, helpJa: stage.helpJa };
      groups.push(group(`${nodeId.toLowerCase()}-${stage.key}`, stage.titleKo, stage.titleJa, stage.stage, prerequisites, { nodeId, ...extra }));
    }
    groups.push(group(`${nodeId.toLowerCase()}-independent`, '새 상황에서 혼자 쓰기', '新しい場面で一人で書く', 'independent', prerequisites, { nodeId, helpKo: '예문 없이, 처음 보는 사실로 한 문장을 써요.', helpJa: '例文なしで、初めて見る事実から1文を書きます。', hideFormLesson: true }));
    groups.push(group(`${nodeId.toLowerCase()}-delayed`, '다른 날의 새 상황', '別の日の新しい場面', 'delayed', prerequisites, { nodeId, helpKo: '첫 독립 작성에서 하루가 지나고 날짜가 바뀌면 열려요.', helpJa: '最初の独立した作文から1日が過ぎ、日付が変わると開きます。', delayedOnly: true, hideFormLesson: true, releasePolicy: 'later_local_calendar_day', previewPolicy: 'hide_items_until_due' }));
  });
  const findGroup = id => groups.find(value => value.id === id);
  function foundation(id, groupId, facts, meaningJa, models, patterns, vocabulary = []) {
    const g = findGroup(groupId), prompt = unitPrompts[g.nodeId];
    return sentence({
      id, groupId, facts, models,
      support: { meaningJa, vocabulary },
      promptKo: prompt[0], promptJa: prompt[1],
      evaluation: {
        targetPattern: politeEnding,
        alternativePattern: politeEnding,
        required: [
          ...patterns.map((pattern, index) => check(`component_${index + 1}`, pattern, nodeHint[g.nodeId], nodeHintJa[g.nodeId])),
          check('polite_finish', politeEnding, '주어진 행동이나 결과를 해요체로 끝까지 써 보세요.', '示された行動や結果を、ヘヨ体で最後まで書いてみましょう。')
        ],
        forbidden: [
          check('reason_link', '아서|어서|때문에|으니까', '이번 소단원에는 이유 연결을 쓰지 않아요. 주어진 사실을 그대로 써요.', 'この単元では理由の接続を使いません。与えられた事実をそのまま書きましょう。'),
          check('two_sentences', '[.!?][가-힣]', '문장 하나로 써 보세요. 두 문장으로 나누지 않아요.', '1文で書きましょう。2文に分けません。')
        ]
      }
    });
  }

  foundation('S01a', 's01-practice', [{ ko: '오늘 / 날씨가 좋다', ja: '今日 / 天気がよい' }], '今日は天気がいい、という意味です。', ['오늘은 날씨가 좋아요.', '날씨가 좋아요.'], ['날씨']);
  foundation('S01b', 's01-practice', [{ ko: '저는 / 도서관에서 / 공부하다', ja: '私は / 図書館で / 勉強する' }], '私は図書館で勉強する、という意味です。', ['저는 도서관에서 공부해요.', '도서관에서 공부해요.'], ['도서관', '공부']);
  foundation('S01e', 's01-independent', [{ ko: '주말에 / 영화를 / 보다', ja: '週末に / 映画を / 見る' }], '週末に映画を見る、という意味です。', ['주말에 영화를 봐요.'], ['주말', '영화', '봐']);

  foundation('S02a', 's02-practice', [{ ko: '저 / 학교 / 가다', ja: '私 / 学校 / 行く' }], '私は学校に行く、という意味です。', ['저는 학교에 가요.'], ['저는|제가', '학교에']);
  foundation('S02b', 's02-practice', [{ ko: '동생 / 공원 / 놀다', ja: '弟 / 公園 / 遊ぶ' }], '弟は公園で遊ぶ、という意味です。', ['동생은 공원에서 놀아요.'], ['공원에서', '놀']);
  foundation('S02e', 's02-independent', [{ ko: '저 / 아침 / 커피 / 마시다', ja: '私 / 朝 / コーヒー / 飲む' }], '私は朝コーヒーを飲む、という意味です。', ['저는 아침에 커피를 마셔요.', '아침에 커피를 마셔요.'], ['아침에', '커피를', '마셔']);

  foundation('S03a', 's03-practice', [{ ko: '기분이 / 좋다', ja: '気分が / よい' }], '気分がいい、という意味です。', ['기분이 좋아요.'], ['좋아요']);
  foundation('S03b', 's03-practice', [{ ko: '한국어를 / 공부하다', ja: '韓国語を / 勉強する' }], '韓国語を勉強する、という意味です。', ['한국어를 공부해요.'], ['공부해요']);
  foundation('S03e', 's03-independent', [{ ko: '주말에 / 집에서 / 쉬다', ja: '週末 / 家で / 休む' }], '週末に家で休む、という意味です。', ['주말에 집에서 쉬어요.'], ['쉬어요']);

  foundation('S04a', 's04-practice', [{ ko: '어제 / 비가 / 오다', ja: '昨日 / 雨が / 降る' }], '昨日雨が降った、という意味です。', ['어제 비가 왔어요.'], ['어제', '왔']);
  foundation('S04b', 's04-practice', [{ ko: '저는 / 고기를 / 안 먹다', ja: '私は / 肉を / 食べない' }], '私は肉を食べない、という意味です。', ['저는 고기를 안 먹어요.', '저는 고기를 먹지 않아요.'], ['안|지\\s*않']);
  foundation('S04e', 's04-independent', [{ ko: '오늘은 / 운동을 / 안 하다', ja: '今日は / 運動を / しない' }], '今日は運動をしない、という意味です。', ['오늘은 운동을 안 해요.', '오늘은 운동을 하지 않아요.'], ['안|지\\s*않']);

  foundation('S05a', 's05-practice', [{ ko: '토요일 / 친구와 / 영화를 보다', ja: '土曜日 / 友だちと / 映画を見る' }], '土曜日に友だちと映画を見る、という意味です。', ['토요일에 친구와 영화를 봐요.'], ['토요일', '친구와', '영화']);
  foundation('S05b', 's05-practice', [{ ko: '아침 / 공원에서 / 달리다', ja: '朝 / 公園で / 走る' }], '朝、公園で走る、という意味です。', ['아침에 공원에서 달려요.'], ['아침', '공원에서', '달려']);
  foundation('S05e', 's05-independent', [{ ko: '내일 / 도서관에서 / 친구를 만나다', ja: '明日 / 図書館で / 友だちに会う' }], '明日、図書館で友だちに会う、という意味です。', ['내일 도서관에서 친구를 만나요.'], ['내일', '도서관에서', '만나']);

  foundation('S06a', 's06-practice', [{ ko: '재미있다 / 책 / 읽다', ja: '面白い / 本 / 読む' }], '面白い本を読む、という意味です。', ['재미있는 책을 읽어요.'], ['재미있', '책']);
  foundation('S06b', 's06-practice', [{ ko: '키가 크다 / 사람 / 만나다', ja: '背が高い / 人 / 会う' }], '背が高い人に会う、という意味です。', ['키가 큰 사람을 만나요.'], ['큰\\s*사람', '만나']);
  foundation('S06e', 's06-independent', [{ ko: '비가 오다 / 날 / 집에 있다', ja: '雨が降る / 日 / 家にいる' }], '雨が降る日は家にいる、という意味です。', ['비가 오는 날은 집에 있어요.'], ['오는\\s*날', '집에']);

  function foundationStage(stage) {
    return foundationStages.find(value => value.key === stage);
  }
  function foundationSentence(spec) {
    const g = findGroup(spec.groupId), stage = foundationStage(spec.stage);
    return sentence({
      id: spec.id, groupId: spec.groupId, facts: spec.facts, models: spec.models, draftKo: spec.draft || undefined, image: spec.image || null,
      support: { meaningJa: spec.meaningJa, vocabulary: spec.vocabulary || [] },
      promptKo: stage.promptKo, promptJa: stage.promptJa,
      evidence: { relationProvided: false, ...(spec.stage === 'delayed' ? { heldOut: true, newContext: true } : {}) },
      evaluation: {
        targetPattern: politeEnding,
        alternativePattern: politeEnding,
        required: [
          ...spec.patterns.map((pattern, index) => check(`component_${index + 1}`, pattern, nodeHint[g.nodeId], nodeHintJa[g.nodeId])),
          check('polite_finish', politeEnding, '주어진 행동이나 결과를 해요체로 끝까지 써 보세요.', '示された行動や結果を、ヘヨ体で最後まで書いてみましょう。')
        ],
        forbidden: [
          check('reason_link', '아서|어서|때문에|으니까', '이번 소단원에는 이유 연결을 쓰지 않아요. 주어진 사실을 그대로 써요.', 'この単元では理由の接続を使いません。与えられた事実をそのまま書きましょう。'),
          check('two_sentences', '[.!?][가-힣]', '문장 하나로 써 보세요. 두 문장으로 나누지 않아요.', '1文で書きましょう。2文に分けません。')
        ]
      }
    });
  }
  // S01 stages: form practice (above) → mixed → variation → correction → expansion → independent → delayed.
  foundationSentence({ id: 'S01m1', groupId: 's01-mixed', stage: 'mixed', facts: [fact('동생이 / 방에서 / 자다', '弟が / 部屋で / 寝る')], meaningJa: '弟が部屋で寝る場面です。', models: ['동생이 방에서 자요.'], patterns: ['동생[이가은]', '방에서', '자요'], vocabulary: [word('동생', '弟・妹'), word('자다', '寝る')], image: 'study' });
  foundationSentence({ id: 'S01m2', groupId: 's01-mixed', stage: 'mixed', facts: [fact('친구가 / 공원에서 / 사진을 찍다', '友だちが / 公園で / 写真を撮る')], meaningJa: '友だちが公園で写真を撮る場面です。', models: ['친구가 공원에서 사진을 찍어요.'], patterns: ['공원에서', '사진', '찍'], vocabulary: [word('사진', '写真'), word('찍다', '撮る'), word('공원', '公園')], image: 'park' });
  foundationSentence({ id: 'S01v1', groupId: 's01-vary', stage: 'vary', facts: [fact('어제 / 늦게 / 퇴근하다', '昨日 / 遅く / 退勤する')], meaningJa: '時点だけを昨日に変えます。', models: ['어제 늦게 퇴근했어요.'], patterns: ['어제', '퇴근했어요'], vocabulary: [word('퇴근하다', '退勤する'), word('어제', '昨日')], image: 'work' });
  foundationSentence({ id: 'S01v2', groupId: 's01-vary', stage: 'vary', facts: [fact('오늘은 / 시간이 없다', '今日は / 時間がない')], meaningJa: '「없다」の意味をそのまま生かして書きます。', models: ['오늘은 시간이 없어요.'], patterns: ['오늘은', '시간[이은]', '없어요'], vocabulary: [word('시간', '時間'), word('오늘', '今日')], image: 'work' });
  foundationSentence({ id: 'S01r1', groupId: 's01-repair', stage: 'repair', facts: [fact('날씨가 / 좋다', '天気が / よい')], meaningJa: '天気がよいことを、ヘヨ体の1文に直します。', models: ['날씨가 좋아요.'], patterns: ['날씨가', '좋아요'], vocabulary: [word('날씨', '天気')], draft: '날씨가 좋다.' });
  foundationSentence({ id: 'S01r2', groupId: 's01-repair', stage: 'repair', facts: [fact('저는 / 도서관에서 / 공부하다', '私は / 図書館で / 勉強する')], meaningJa: '勉強することを、最後まで書いた1文に直します。', models: ['저는 도서관에서 공부해요.'], patterns: ['도서관에서', '공부해요'], vocabulary: [word('도서관', '図書館')], image: 'study', draft: '저는 도서관에서 공부.' });
  foundationSentence({ id: 'S01x1', groupId: 's01-expand', stage: 'expand', facts: [fact('지금 / 도서관에서 / 조용히 / 공부하다', '今 / 図書館で / 静かに / 勉強する')], meaningJa: '「조용히」を入れて、どうするかを足します。', models: ['지금 도서관에서 조용히 공부해요.'], patterns: ['지금', '조용히', '공부해요'], vocabulary: [word('조용히', '静かに'), word('도서관', '図書館')], image: 'study' });
  foundationSentence({ id: 'S01i1', groupId: 's01-independent', stage: 'independent', facts: [fact('내일 / 친구를 만나다', '明日 / 友だちに会う')], meaningJa: '明日、友だちに会う場面です。', models: ['내일 친구를 만나요.'], patterns: ['내일', '친구', '만나'], vocabulary: [word('내일', '明日'), word('친구', '友だち')], image: 'park' });
  foundationSentence({ id: 'S01d1', groupId: 's01-delayed', stage: 'delayed', facts: [fact('다음 주에 / 새 집으로 이사하다', '来週 / 新しい家に引っ越す')], meaningJa: '来週、新しい家に引っ越す場面です。', models: ['다음 주에 새 집으로 이사해요.'], patterns: ['다음\\s*주에', '이사'], vocabulary: [word('이사하다', '引っ越す'), word('새', '新しい')], image: 'work' });

  // S02 stages: form practice (above) → mixed → variation → correction → expansion → independent → delayed.
  foundationSentence({ id: 'S02m1', groupId: 's02-mixed', stage: 'mixed', facts: [fact('친구 / 도서관 / 책을 빌리다', '友だち / 図書館 / 本を借りる')], meaningJa: '友だちが図書館で本を借りる場面です。', models: ['친구가 도서관에서 책을 빌려요.'], patterns: ['친구[가는이]', '도서관에서', '책을', '빌려'], vocabulary: [word('빌리다', '借りる'), word('도서관', '図書館')], image: 'study' });
  foundationSentence({ id: 'S02m2', groupId: 's02-mixed', stage: 'mixed', facts: [fact('저 / 지하철 / 회사에 가다', '私 / 地下鉄 / 会社へ行く')], meaningJa: '地下鉄で会社へ行く場面です。', models: ['저는 지하철로 회사에 가요.', '지하철을 타고 회사에 가요.'], patterns: ['지하철로|지하철을\\s*타고', '회사에', '가요'], vocabulary: [word('지하철', '地下鉄'), word('회사', '会社')], image: 'work' });
  foundationSentence({ id: 'S02v1', groupId: 's02-vary', stage: 'vary', facts: [fact('오늘은 / 집에서 / 쉬다', '今日は / 家で / 休む')], meaningJa: '場所は家、時点は今日のままです。', models: ['오늘은 집에서 쉬어요.'], patterns: ['오늘은', '집에서', '쉬어'], vocabulary: [word('쉬다', '休む'), word('오늘', '今日')], image: 'study' });
  foundationSentence({ id: 'S02v2', groupId: 's02-vary', stage: 'vary', facts: [fact('동생 / 버스로 학교에 가다', '弟・妹 / バスで学校へ行く')], meaningJa: '手段はバス、到着地は学校です。', models: ['동생은 버스로 학교에 가요.'], patterns: ['버스로', '학교에', '가요'], vocabulary: [word('버스', 'バス'), word('학교', '学校')], image: 'work' });
  foundationSentence({ id: 'S02r1', groupId: 's02-repair', stage: 'repair', facts: [fact('저 / 학교 / 가다', '私 / 学校 / 行く')], meaningJa: '行き先を示す助詞が抜けています。', models: ['저는 학교에 가요.'], patterns: ['학교에', '가요'], vocabulary: [word('학교', '学校')], draft: '저는 학교 가요.' });
  foundationSentence({ id: 'S02r2', groupId: 's02-repair', stage: 'repair', facts: [fact('친구 / 도서관 / 책을 빌리다', '友だち / 図書館 / 本を借りる')], meaningJa: '場所を表す助詞が抜けています。', models: ['친구가 도서관에서 책을 빌려요.'], patterns: ['도서관에서', '책을', '빌려'], vocabulary: [word('빌리다', '借りる'), word('도서관', '図書館')], image: 'study', draft: '친구가 책을 도서관 빌려요.' });
  foundationSentence({ id: 'S02x1', groupId: 's02-expand', stage: 'expand', facts: [fact('저 / 저녁 / 공원에서 / 산책하다', '私 / 夕方 / 公園で / 散歩する')], meaningJa: '時と場所を両方入れて書きます。', models: ['저는 저녁에 공원에서 산책해요.'], patterns: ['저녁에', '공원에서', '산책'], vocabulary: [word('산책하다', '散歩する'), word('저녁', '夕方・夜')], image: 'park' });
  foundationSentence({ id: 'S02i1', groupId: 's02-independent', stage: 'independent', facts: [fact('동생 / 주말에 / 친구를 만나다', '弟・妹 / 週末に / 友だちに会う')], meaningJa: '週末に弟か妹が友だちに会う場面です。', models: ['동생은 주말에 친구를 만나요.'], patterns: ['주말에', '친구를', '만나'], vocabulary: [word('주말', '週末'), word('친구', '友だち')] });
  foundationSentence({ id: 'S02d1', groupId: 's02-delayed', stage: 'delayed', facts: [fact('저 / 내일 / 기차로 부산에 가다', '私 / 明日 / 列車で釜山へ行く')], meaningJa: '明日、列車で釜山へ行く場面です。', models: ['저는 내일 기차로 부산에 가요.'], patterns: ['기차로', '부산에', '가요'], vocabulary: [word('기차', '列車'), word('부산', '釜山')], image: 'work' });

  // S03 stages: form practice (above) → mixed → variation → correction → expansion → independent → delayed.
  foundationSentence({ id: 'S03m1', groupId: 's03-mixed', stage: 'mixed', facts: [fact('날씨가 / 춥다', '天気が / 寒い')], meaningJa: '「춥다」をヘヨ体にします。', models: ['날씨가 추워요.'], patterns: ['날씨가', '추워요'], vocabulary: [word('날씨', '天気'), word('춥다', '寒い')] });
  foundationSentence({ id: 'S03m2', groupId: 's03-mixed', stage: 'mixed', facts: [fact('동생이 / 책을 / 읽다', '弟・妹が / 本を / 読む')], meaningJa: '「읽다」をヘヨ体にします。', models: ['동생이 책을 읽어요.'], patterns: ['동생이', '책을', '읽어요'], vocabulary: [word('읽다', '読む'), word('책', '本')], image: 'study' });
  foundationSentence({ id: 'S03v1', groupId: 's03-vary', stage: 'vary', facts: [fact('어제 / 날씨가 / 춥다', '昨日 / 天気が / 寒い')], meaningJa: '時点だけを昨日に変えます。', models: ['어제는 날씨가 추웠어요.'], patterns: ['어제', '추웠어요'], vocabulary: [word('춥다', '寒い'), word('어제', '昨日')] });
  foundationSentence({ id: 'S03v2', groupId: 's03-vary', stage: 'vary', facts: [fact('친구들이 / 운동을 / 하다', '友だちが / 運動を / する')], meaningJa: '主語が複数でも述語はそのままヘヨ体です。', models: ['친구들이 운동을 해요.'], patterns: ['친구들이', '운동을', '해요'], vocabulary: [word('운동', '運動')], image: 'work' });
  foundationSentence({ id: 'S03r1', groupId: 's03-repair', stage: 'repair', facts: [fact('오늘 / 기분이 / 좋다', '今日 / 気分が / よい')], meaningJa: '「좋다」の形を正しく直します。', models: ['오늘은 기분이 좋아요.'], patterns: ['기분이', '좋아요'], vocabulary: [word('오늘', '今日')], draft: '오늘은 기분이 좋어요.' });
  foundationSentence({ id: 'S03r2', groupId: 's03-repair', stage: 'repair', facts: [fact('내일 / 날씨가 / 춥다', '明日 / 天気が / 寒い')], meaningJa: '「춥다」의 ㅂの形を正しく直します。', models: ['내일은 날씨가 추워요.'], patterns: ['날씨가', '추워요'], vocabulary: [word('춥다', '寒い'), word('날씨', '天気'), word('내일', '明日')], draft: '내일은 날씨가 추우요.' });
  foundationSentence({ id: 'S03x1', groupId: 's03-expand', stage: 'expand', facts: [fact('주말 / 친구와 같이 / 영화를 보다', '週末 / 友だちと一緒に / 映画を見る')], meaningJa: '「같이」を入れて、誰とするかを足します。', models: ['주말에 친구와 같이 영화를 봐요.'], patterns: ['같이', '영화', '봐요'], vocabulary: [word('같이', '一緒に'), word('주말', '週末')], image: 'movie' });
  foundationSentence({ id: 'S03i1', groupId: 's03-independent', stage: 'independent', facts: [fact('오늘 / 날씨가 / 따뜻하다', '今日 / 天気が / 暖かい')], meaningJa: '今日は天気が暖かい場面です。', models: ['오늘은 날씨가 따뜻해요.'], patterns: ['날씨가', '따뜻해요'], vocabulary: [word('오늘', '今日'), word('날씨', '天気')] });
  foundationSentence({ id: 'S03d1', groupId: 's03-delayed', stage: 'delayed', facts: [fact('내일 / 날씨가 / 따뜻하다', '明日 / 天気が / 暖かい')], meaningJa: '明日は天気が暖かいという場面です。', models: ['내일은 날씨가 따뜻해요.'], patterns: ['내일', '따뜻해요'], vocabulary: [word('따뜻하다', '暖かい'), word('날씨', '天気')] });

  // S04 stages: form practice (above) → mixed → variation → correction → expansion → independent → delayed.
  foundationSentence({ id: 'S04m1', groupId: 's04-mixed', stage: 'mixed', facts: [fact('지난주 / 영화를 보다', '先週 / 映画を見る')], meaningJa: '先週、映画を見た場面です。', models: ['지난주에 영화를 봤어요.'], patterns: ['지난주', '봤어요'], vocabulary: [word('지난주', '先週')], image: 'movie' });
  foundationSentence({ id: 'S04m2', groupId: 's04-mixed', stage: 'mixed', facts: [fact('저는 / 커피를 못 마시다', '私は / コーヒーが飲めない')], meaningJa: 'コーヒーが飲めないことを表します。', models: ['저는 커피를 못 마셔요.'], patterns: ['못', '마셔요'], vocabulary: [] });
  foundationSentence({ id: 'S04v1', groupId: 's04-vary', stage: 'vary', facts: [fact('다음 달 / 여행을 가다', '来月 / 旅行に行く')], meaningJa: '時点を来月にします。', models: ['다음 달에 여행을 가요.'], patterns: ['다음\\s*달', '여행', '가요'], vocabulary: [word('다음달', '来月'), word('여행', '旅行')] });
  foundationSentence({ id: 'S04v2', groupId: 's04-vary', stage: 'vary', facts: [fact('어제 / 택시를 못 타다', '昨日 / タクシーに乗れなかった')], meaningJa: 'できなかったことを過去で表します。', models: ['어제는 택시를 못 탔어요.'], patterns: ['어제', '택시', '못', '탔어요'], vocabulary: [word('택시', 'タクシー'), word('어제', '昨日')], image: 'work' });
  foundationSentence({ id: 'S04r1', groupId: 's04-repair', stage: 'repair', facts: [fact('어제 / 비가 오다', '昨日 / 雨が降る')], meaningJa: '過去の形に直します。', models: ['어제 비가 왔어요.'], patterns: ['비가', '왔어요'], vocabulary: [], image: 'rain', draft: '어제 비가 오요.' });
  foundationSentence({ id: 'S04r2', groupId: 's04-repair', stage: 'repair', facts: [fact('어제 / 운동을 안 하다', '昨日 / 運動をしない')], meaningJa: '時点に合わせて過去に直します。', models: ['어제는 운동을 안 했어요.'], patterns: ['어제', '안\\s*했어요|하지\\s*않았어요'], vocabulary: [word('운동', '運動')], draft: '어제는 운동을 안 해요.' });
  foundationSentence({ id: 'S04x1', groupId: 's04-expand', stage: 'expand', facts: [fact('지난 주말 / 친구 / 영화를 못 보다', '先週末 / 友だち / 映画を見られなかった')], meaningJa: '時点を足して、できなかったことを書きます。', models: ['지난 주말에 친구와 영화를 못 봤어요.'], patterns: ['친구', '영화', '못\\s*봤어요'], vocabulary: [word('주말', '週末'), word('친구', '友だち')], image: 'movie' });
  foundationSentence({ id: 'S04i1', groupId: 's04-independent', stage: 'independent', facts: [fact('오늘 / 수업이 없다', '今日 / 授業がない')], meaningJa: '今日は授業がない場面です。', models: ['오늘은 수업이 없어요.'], patterns: ['수업', '없어요'], vocabulary: [word('수업', '授業')] });
  foundationSentence({ id: 'S04d1', groupId: 's04-delayed', stage: 'delayed', facts: [fact('작년 / 제주도에 가다', '去年 / 済州島へ行く')], meaningJa: '去年、済州島へ行った場面です。', models: ['작년에 제주도에 갔어요.'], patterns: ['작년', '제주도', '갔어요'], vocabulary: [word('제주도', '済州島')] });

  // S05 stages: form practice (above) → mixed → variation → correction → expansion → independent → delayed.
  foundationSentence({ id: 'S05m1', groupId: 's05-mixed', stage: 'mixed', facts: [fact('저녁 / 가족과 / 집에서 / 저녁을 먹다', '夕方 / 家族と / 家で / 夕食を食べる')], meaningJa: '家族と家で夕食を食べる場面です。', models: ['저녁에 가족과 집에서 저녁을 먹어요.'], patterns: ['저녁에', '가족과', '집에서', '먹어요'], vocabulary: [word('가족', '家族'), word('저녁식사', '夕食')] });
  foundationSentence({ id: 'S05m2', groupId: 's05-mixed', stage: 'mixed', facts: [fact('아침마다 / 버스를 타고 / 회사에 가다', '毎朝 / バスに乗って / 会社へ行く')], meaningJa: '毎朝、バスで会社へ行く場面です。', models: ['아침마다 버스를 타고 회사에 가요.'], patterns: ['아침마다', '버스', '회사에'], vocabulary: [word('아침마다', '毎朝'), word('버스', 'バス')], image: 'work' });
  foundationSentence({ id: 'S05v1', groupId: 's05-vary', stage: 'vary', facts: [fact('아주 / 재미있다', 'とても / 面白い')], meaningJa: '程度を強く表します。', models: ['아주 재미있어요.'], patterns: ['아주', '재미있어요'], vocabulary: [], image: 'movie' });
  foundationSentence({ id: 'S05v2', groupId: 's05-vary', stage: 'vary', facts: [fact('자주 / 도서관에 가다', 'よく / 図書館へ行く')], meaningJa: '頻度を表す言葉を入れます。', models: ['자주 도서관에 가요.'], patterns: ['자주', '도서관에'], vocabulary: [word('자주', 'よく'), word('도서관', '図書館')] });
  foundationSentence({ id: 'S05r1', groupId: 's05-repair', stage: 'repair', facts: [fact('토요일 / 친구와 / 영화를 보다', '土曜日 / 友だちと / 映画を見る')], meaningJa: '抜けている情報を足します。', models: ['토요일에 친구와 영화를 봐요.'], patterns: ['토요일', '친구와', '영화', '봐요'], vocabulary: [word('친구', '友だち')], image: 'movie', draft: '주말에 영화를 봐요.' });
  foundationSentence({ id: 'S05r2', groupId: 's05-repair', stage: 'repair', facts: [fact('아침 / 공원에서 / 달리다', '朝 / 公園で / 走る')], meaningJa: '時を表す助詞を直します。', models: ['아침에 공원에서 달려요.'], patterns: ['아침에', '공원에서'], vocabulary: [word('아침', '朝'), word('공원', '公園')], image: 'park', draft: '아침 공원에서 달려요.' });
  foundationSentence({ id: 'S05x1', groupId: 's05-expand', stage: 'expand', facts: [fact('지난주 / 부산 / 이틀 동안 머무르다', '先週 / 釜山 / 2日間滞在する')], meaningJa: '滞在した期間を足します。', models: ['지난주에 부산에서 이틀 동안 머물렀어요.'], patterns: ['지난주', '부산', '이틀', '머물'], vocabulary: [word('머무르다', '滞在する'), word('이틀', '2日'), word('부산', '釜山')] });
  foundationSentence({ id: 'S05i1', groupId: 's05-independent', stage: 'independent', facts: [fact('다음 주 / 친구 / 제주도에 가다', '来週 / 友だち / 済州島へ行く')], meaningJa: '来週、友だちと済州島へ行く場面です。', models: ['다음 주에 친구와 제주도에 가요.'], patterns: ['다음\\s*주', '친구', '제주도'], vocabulary: [word('제주도', '済州島'), word('친구', '友だち')] });
  foundationSentence({ id: 'S05d1', groupId: 's05-delayed', stage: 'delayed', facts: [fact('매일 아침 / 공원 / 삼십 분 동안 걷다', '毎朝 / 公園 / 30分歩く')], meaningJa: '毎朝の習慣と、その長さを書きます。', models: ['매일 아침 공원에서 삼십 분 동안 걸어요.'], patterns: ['매일', '공원에서', '삼십\\s*분', '걸어요'], vocabulary: [word('매일', '毎日'), word('걷다', '歩く'), word('삼십분', '30分')], image: 'park' });

  // S06 stages: form practice (above) → mixed → variation → correction → expansion → independent → delayed.
  foundationSentence({ id: 'S06m1', groupId: 's06-mixed', stage: 'mixed', facts: [fact('비싸다 / 가방 / 사다', '高い / かばん / 買う')], meaningJa: '「비싸다」でかばんを限定します。', models: ['비싼 가방을 사요.'], patterns: ['비싼\\s*가방', '사요'], vocabulary: [word('비싸다', '高い'), word('가방', 'かばん')] });
  foundationSentence({ id: 'S06m2', groupId: 's06-mixed', stage: 'mixed', facts: [fact('내가 좋아하다 / 노래 / 듣다', '私が好きだ / 歌 / 聞く')], meaningJa: '私が好きな歌を聞く場面です。', models: ['내가 좋아하는 노래를 들어요.'], patterns: ['좋아하는\\s*노래', '들어요'], vocabulary: [word('좋아하다', '好きだ'), word('노래', '歌')] });
  foundationSentence({ id: 'S06v1', groupId: 's06-vary', stage: 'vary', facts: [fact('어제 만나다 / 사람 / 친절하다', '昨日会った / 人 / 親切だ')], meaningJa: '過去を表す形で人を限定します。', models: ['어제 만난 사람은 친절해요.'], patterns: ['만난\\s*사람', '친절'], vocabulary: [word('친절하다', '親切だ'), word('사람', '人')] });
  foundationSentence({ id: 'S06v2', groupId: 's06-vary', stage: 'vary', facts: [fact('내일 하다 / 일 / 많다', '明日する / こと / 多い')], meaningJa: 'これからすることを表す形で限定します。', models: ['내일 할 일이 많아요.'], patterns: ['할\\s*일', '많아요'], vocabulary: [word('일', '仕事')], image: 'work' });
  foundationSentence({ id: 'S06r1', groupId: 's06-repair', stage: 'repair', facts: [fact('재미있다 / 책 / 읽다', '面白い / 本 / 読む')], meaningJa: '冠形の形に直します。', models: ['재미있는 책을 읽어요.'], patterns: ['재미있는\\s*책', '읽어요'], vocabulary: [word('책', '本')], image: 'study', draft: '재미있다 책을 읽어요.' });
  foundationSentence({ id: 'S06r2', groupId: 's06-repair', stage: 'repair', facts: [fact('비가 오다 / 날 / 집에 있다', '雨が降る / 日 / 家にいる')], meaningJa: '冠形の形に直します。', models: ['비가 오는 날은 집에 있어요.'], patterns: ['오는\\s*날', '집에'], vocabulary: [], draft: '비가 오다 날은 집에 있어요.' });
  foundationSentence({ id: 'S06x1', groupId: 's06-expand', stage: 'expand', facts: [fact('값이 싸다 / 가방 / 사다', '値段が安い / かばん / 買う')], meaningJa: '「싸다」でかばんを限定して書きます。', models: ['값이 싼 가방을 사요.', '값이 싼 가방을 샀어요.'], patterns: ['싼\\s*가방', '샀어요|사요'], vocabulary: [word('값', '値段'), word('싸다', '安い'), word('가방', 'かばん')] });
  foundationSentence({ id: 'S06i1', groupId: 's06-independent', stage: 'independent', facts: [fact('어렵다 / 문제 / 혼자 풀다', '難しい / 問題 / 一人で解く')], meaningJa: '難しい問題を一人で解く場面です。', models: ['어려운 문제를 혼자 풀어요.'], patterns: ['어려운\\s*문제', '혼자', '풀어요'], vocabulary: [word('어렵다', '難しい'), word('문제', '問題'), word('혼자', '一人で')] });
  foundationSentence({ id: 'S06d1', groupId: 's06-delayed', stage: 'delayed', facts: [fact('읽고 싶다 / 책 / 도서관에서 빌리다', '読みたい / 本 / 図書館で借りる')], meaningJa: '読みたい本を図書館で借りる場面です。', models: ['내가 읽고 싶은 책을 도서관에서 빌려요.'], patterns: ['읽고\\s*싶은\\s*책', '도서관에서'], vocabulary: [word('책', '本'), word('도서관', '図書館')], image: 'study' });

  foundationNodes.forEach(nodeId => {
    const node = nodes.find(value => value.id === nodeId);
    node.availableGroupIds = groups.filter(value => value.nodeId === nodeId).map(value => value.id);
  });
  nodes.find(value => value.id === 'S07').availableGroupIds = groups.map(value => value.id);
  window.HARUMAL_WRITING_DATA = freeze({
    version: 1, nodes, groups, items, prerequisites,
    scope: {
      unitId: 'reason-aseo-first', titleKo: '사실의 원인과 결과를 한 문장으로', titleJa: '事実の原因と結果を1文に',
      statusKo: '첫 이유 소단원 제공 · 전체 작문 과정은 준비 중', statusJa: '最初の理由ユニットを提供・全体の作文コースは準備中',
      verifiedRangeKo: '제시된 상태 서술어와 하다 동작 서술어의 이유 연결을 연습해요. 먹어서·사서·와서 및 불규칙 활용은 아직 별도 확인하지 않았어요.',
      verifiedRangeJa: '提示された状態の述語と하다動詞の理由接続を練習します。먹어서・사서・와서や不規則活用は、まだ別途確認していません。',
      assessmentKo: '연습·힌트 없는 새 문장·다른 날의 사용·의미 자기점검·사람 검토를 따로 기록해요. 몇 문제의 성공을 전체 이유 표현이나 54번 쓰기의 숙달로 표시하지 않아요.',
      assessmentJa: '練習・ヒントなしの新しい文・別の日の使用・意味の自己確認・人による確認を別々に記録します。数問の成功を、理由表現全体や54番の作文の習得とは表示しません。',
      readinessPolicy: 'feature_specific_not_all_nodes', selfDeclarationPolicy: 'readiness_not_mastery', automaticMeaningPolicy: 'never_certify',
      delayedPolicy: 'new_scenarios_on_a_later_local_calendar_day_before_models',
      relationPolicyKo: '이 소단원의 제한 문항은 이유 관계를 뜻 도움으로 제공해요. 관계를 스스로 추론한 증거로 세지 않아요.',
      futureKo: ['동작 서술어·축약·불규칙의 추가 이유 연결', '명사 때문에', '기 때문에', '뒤에 놓는 이유', '(으)니까와 권유 근거', '이유·대조·목적의 관계 선택', '근거의 충분성', '문단과 51~54번 적용'],
      provenance: 'Approved HARUMAL curriculum review and first atomic cause unit, 2026-10-07'
    }
  });
}());
