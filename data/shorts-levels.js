// MALBIT · reviewed Shorts decks separated by TOPIK level.
(function(){
'use strict';

const TYPE_TIP={
  word:{
    ko:'뜻만 따로 외우지 말고 예문에서 어떤 말과 함께 쓰였는지 묶어 기억하세요.',
    ja:'意味だけを単独で覚えず、例文でどの語と一緒に使われるかをまとめて覚えましょう。',
    en:'Learn the word together with the words it naturally pairs with in the example.',
    zh:'不要只记单独的词义，要连同例句中的常见搭配一起记。'
  },
  grammar:{
    ko:'앞절과 뒤절의 관계를 먼저 판단하고, 예문의 연결 형태까지 한 덩어리로 익히세요.',
    ja:'前件と後件の関係を先に判断し、例文の接続形まで一まとまりで覚えましょう。',
    en:'Identify the relationship between the two clauses, then learn the attached form as one chunk.',
    zh:'先判断前后分句的关系，再把例句中的接续形式整体记住。'
  },
  expression:{
    ko:'낱말을 직역하지 말고 표현 전체를 하나의 의미 덩어리로 기억하세요.',
    ja:'単語ごとに直訳せず、表現全体を一つの意味のまとまりとして覚えましょう。',
    en:'Do not translate each word literally; learn the whole expression as one meaning unit.',
    zh:'不要逐词直译，要把整个表达当作一个意义单位来记。'
  },
  idiom:{
    ko:'낱말을 직역하지 말고 관용 표현 전체가 문맥에서 만드는 뜻을 확인하세요.',
    ja:'単語どおりに直訳せず、慣用表現全体が文脈で表す意味を確認しましょう。',
    en:'Avoid a literal word-by-word reading; identify what the full idiom means in context.',
    zh:'不要逐词按字面理解，要确认整个惯用语在语境中的意思。'
  }
};
const item=(level,type,term,ko,ja,en,zh,example)=>{
  const tip=TYPE_TIP[type]||TYPE_TIP.word;
  return Object.freeze({
    level,type,term,meaning:Object.freeze({ko,ja,en,zh}),example,
    explanationI18n:Object.freeze({
      ko:`【뜻】${ko}\n【문맥】“${example}”에서 실제 쓰임을 확인하세요.\n【기억법】${tip.ko}`,
      ja:`【意味】${ja}\n【文脈】「${example}」で実際の使い方を確認しましょう。\n【覚え方】${tip.ja}`,
      en:`[Meaning] ${en}\n[Context] See how it works in “${example}”\n[Study tip] ${tip.en}`,
      zh:`【含义】${zh}\n【语境】请通过“${example}”确认实际用法。\n【记忆法】${tip.zh}`
    })
  });
};

const TIME_WORDS=Object.freeze({
  already:Object.freeze({
    meaning:Object.freeze({ko:'예상보다 이르게 이미',ja:'もう（予想より早く）',en:'already (earlier than expected)',zh:'已经（比预想早）'}),
    selected:Object.freeze({
      ko:'“벌써”는 예상보다 이른 완료를 나타냅니다. 완료 시점이 뜻밖에 빠른지 확인하세요.',
      ja:'「벌써」は予想より早い完了を表します。完了が思ったより早いかを確認しましょう。',
      en:'“벌써” marks an earlier-than-expected completion. Check whether the result is already complete.',
      zh:'“벌써”表示比预想更早完成。请确认事情是否已经完成。'
    })
  }),
  still:Object.freeze({
    meaning:Object.freeze({ko:'지금까지도; 아직은',ja:'まだ',en:'still; yet',zh:'还；尚未'}),
    selected:Object.freeze({
      ko:'“아직”은 상태가 지금까지 계속되거나 일이 완료되지 않았음을 나타냅니다.',
      ja:'「아직」は状態の継続、または物事が完了していないことを表します。',
      en:'“아직” marks a continuing state or something that is not complete yet.',
      zh:'“아직”表示状态仍在持续，或事情尚未完成。'
    })
  }),
  justNow:Object.freeze({
    meaning:Object.freeze({ko:'바로 조금 전',ja:'たった今',en:'just now',zh:'刚刚'}),
    selected:Object.freeze({
      ko:'“방금”은 말하는 때에서 아주 가까운 과거를 가리킵니다.',
      ja:'「방금」は発話時点のすぐ前、つまりごく近い過去を指します。',
      en:'“방금” points to the immediate past, just before the moment of speaking.',
      zh:'“방금”指说话时刻之前不久，也就是刚刚发生。'
    })
  }),
  soon:Object.freeze({
    meaning:Object.freeze({ko:'짧은 시간이 지나면',ja:'もうすぐ',en:'soon; shortly',zh:'马上；不久'}),
    selected:Object.freeze({
      ko:'“곧”은 아직 일어나지 않았지만 가까운 미래에 일어날 일을 나타냅니다.',
      ja:'「곧」はまだ起きていないものの、近い未来に起きることを表します。',
      en:'“곧” marks something that has not happened yet but will happen in the near future.',
      zh:'“곧”表示事情尚未发生，但会在不久的将来发生。'
    })
  })
});
const TIME_ORDER=['already','still','justNow','soon'];
const TIME_METHOD=Object.freeze({
  ko:'예상보다 이른 완료=벌써, 지속·미완료=아직, 바로 전=방금, 가까운 미래=곧으로 시점을 먼저 나누세요.',
  ja:'予想より早い完了＝벌써、継続・未完了＝아직、直前＝방금、近い未来＝곧、と時点を先に分けます。',
  en:'First classify the time: earlier-than-expected completion = 벌써, continuing or incomplete = 아직, immediate past = 방금, near future = 곧.',
  zh:'先判断时间：比预想早完成＝벌써，持续或未完成＝아직，刚刚过去＝방금，不久的将来＝곧。'
});
const reviewedTimeItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=TIME_WORDS[key];
  return Object.freeze({
    id,level:1,type:'word',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:TIME_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(TIME_ORDER.map(choiceKey=>Object.freeze({
      meaning:TIME_WORDS[choiceKey].meaning,
      explanationI18n:TIME_WORDS[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]} )]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】벌써·아직·방금·곧은 각각 이른 완료·지속/미완료·바로 전·가까운 미래로 시간 기준이 다릅니다.\n【재사용 풀이】${TIME_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】벌써・아직・방금・곧 はそれぞれ、早い完了・継続/未完了・直前・近い未来を表し、時間の基準が異なります。\n【再利用できる解き方】${TIME_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] 벌써, 아직, 방금, and 곧 mark earlier completion, continuation/incompletion, the immediate past, and the near future respectively.\n[Reusable method] ${TIME_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】벌써、아직、방금、곧分别表示提前完成、持续/未完成、刚刚过去和不久的将来，时间基准不同。\n【通用解法】${TIME_METHOD.zh}`
    })
  });
};

const CONNECTOR_WORDS=Object.freeze({
  result:Object.freeze({
    meaning:Object.freeze({ko:'앞 내용의 결과를 이어 말함',ja:'したがって；そのため',en:'therefore; as a result',zh:'因此；所以'}),
    selected:Object.freeze({
      ko:'“따라서”는 앞의 원인이나 근거에서 나온 결과를 이어 말합니다.',
      ja:'「따라서」は、前の原因・根拠から導かれる結果を続けます。',
      en:'“따라서” introduces a result that follows from the preceding cause or reason.',
      zh:'“따라서”用于引出由前面的原因或依据得出的结果。'
    })
  }),
  contrast:Object.freeze({
    meaning:Object.freeze({ko:'서로 다른 두 면을 대조함',ja:'一方で；それに対して',en:'whereas; on the other hand',zh:'另一方面；与此相反'}),
    selected:Object.freeze({
      ko:'“반면에”는 두 대상이나 상황의 서로 다른 면을 나란히 대조합니다.',
      ja:'「반면에」は、二つの対象や状況の異なる面を並べて対比します。',
      en:'“반면에” contrasts different sides of two subjects or situations.',
      zh:'“반면에”把两个对象或情况的不同方面放在一起对比。'
    })
  }),
  addition:Object.freeze({
    meaning:Object.freeze({ko:'같은 방향의 내용을 더함',ja:'そのうえ；さらに',en:'moreover; in addition',zh:'而且；此外'}),
    selected:Object.freeze({
      ko:'“게다가”는 앞 내용과 같은 방향의 정보를 하나 더 보탭니다.',
      ja:'「게다가」は、前の内容と同じ方向の情報をさらに付け加えます。',
      en:'“게다가” adds another point in the same direction as the preceding statement.',
      zh:'“게다가”在前面内容的同一方向上再补充一点。'
    })
  }),
  condition:Object.freeze({
    meaning:Object.freeze({ko:'앞 내용을 제한하는 조건을 덧붙임',ja:'ただし；ただ',en:'however; with one condition',zh:'不过；只是'}),
    selected:Object.freeze({
      ko:'“다만”은 앞 내용을 유지하면서 제한이나 조건을 덧붙입니다.',
      ja:'「다만」は、前の内容を保ちながら制限や条件を付け加えます。',
      en:'“다만” keeps the preceding statement but adds a limitation or condition.',
      zh:'“다만”保留前面的内容，同时补充限制或条件。'
    })
  })
});
const CONNECTOR_ORDER=['result','contrast','addition','condition'];
const CONNECTOR_METHOD=Object.freeze({
  ko:'원인 뒤 결과=따라서, 두 면의 대조=반면에, 같은 방향의 추가=게다가, 앞말을 유지한 조건=다만으로 관계를 먼저 고르세요.',
  ja:'原因の後の結果＝따라서、二面の対比＝반면에、同方向の追加＝게다가、前言を保った条件＝다만、と関係を先に選びます。',
  en:'Classify the link first: result after a cause = 따라서, contrast = 반면에, same-direction addition = 게다가, retained statement plus a condition = 다만.',
  zh:'先判断关系：原因后的结果＝따라서，两面对比＝반면에，同方向补充＝게다가，保留前述内容并加条件＝다만。'
});
const reviewedConnectorItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=CONNECTOR_WORDS[key];
  return Object.freeze({
    id,level:2,type:'word',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:CONNECTOR_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(CONNECTOR_ORDER.map(choiceKey=>Object.freeze({
      meaning:CONNECTOR_WORDS[choiceKey].meaning,
      explanationI18n:CONNECTOR_WORDS[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】따라서=결과, 반면에=대조, 게다가=같은 방향의 추가, 다만=제한 조건으로 문장 관계가 각각 다릅니다.\n【재사용 풀이】${CONNECTOR_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】따라서＝結果、반면에＝対比、게다가＝同方向の追加、다만＝制限条件で、文の関係がそれぞれ異なります。\n【再利用できる解き方】${CONNECTOR_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] 따라서 marks a result, 반면에 a contrast, 게다가 a same-direction addition, and 다만 a limiting condition.\n[Reusable method] ${CONNECTOR_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】따라서表示结果，반면에表示对比，게다가表示同方向补充，다만表示限制条件，句间关系各不相同。\n【通用解法】${CONNECTOR_METHOD.zh}`
    })
  });
};

const CAUSE_CONCESSION=Object.freeze({
  badCause:Object.freeze({
    meaning:Object.freeze({ko:'나쁜 결과의 원인·책임',ja:'悪い結果の原因（～せいで）',en:'bad result from a cause',zh:'坏结果的原因（都怪……）'}),
    selected:Object.freeze({
      ko:'“-(으)ㄴ 탓에”는 좋지 않은 결과의 원인이나 책임을 앞 내용에 돌립니다.',
      ja:'「-(으)ㄴ 탓에」は、悪い結果の原因・責任を前の内容に求めます。',
      en:'“-(으)ㄴ 탓에” attributes a bad result or blame to the preceding cause.',
      zh:'“-(으)ㄴ 탓에”把坏结果的原因或责任归于前面的内容。'
    })
  }),
  goodCause:Object.freeze({
    meaning:Object.freeze({ko:'좋은 결과의 원인·고마움',ja:'良い結果の原因（～おかげで）',en:'good result thanks to a cause',zh:'好结果的原因（多亏……）'}),
    selected:Object.freeze({
      ko:'“-(으)ㄴ 덕분에”는 좋은 결과를 가능하게 한 원인에 고마움이나 긍정 평가를 담습니다.',
      ja:'「-(으)ㄴ 덕분에」は、良い結果をもたらした原因への感謝・肯定を表します。',
      en:'“-(으)ㄴ 덕분에” credits a cause for a good result, often with gratitude.',
      zh:'“-(으)ㄴ 덕분에”表示某个原因带来了好结果，常含感谢之意。'
    })
  }),
  factConcession:Object.freeze({
    meaning:Object.freeze({ko:'사실인데도 예상과 다른 결과',ja:'事実に反する結果（～のに）',en:'unexpected result despite a fact',zh:'尽管是事实，结果却相反'}),
    selected:Object.freeze({
      ko:'“-는데도”는 실제로 성립한 앞 사실을 인정하지만 뒤에 예상과 다른 결과가 나옵니다.',
      ja:'「-는데도」は、実際に成立した前の事実を認めつつ、予想に反する結果を続けます。',
      en:'“-는데도” concedes an actual fact, then gives a result contrary to expectation.',
      zh:'“-는데도”承认前面的事实已经成立，但后面出现与预期相反的结果。'
    })
  }),
  hypotheticalConcession:Object.freeze({
    meaning:Object.freeze({ko:'가정해도 뒤 판단을 유지함',ja:'仮定しても結論維持（たとえ～ても）',en:'same conclusion even if imagined',zh:'即使假设成立，结论仍不变'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ지라도”는 아직 확정되지 않은 상황을 가정해 인정해도 뒤 판단이나 의지를 유지합니다.',
      ja:'「-(으)ㄹ지라도」は、未確定の状況を仮定して認めても、後の判断・意志を保ちます。',
      en:'“-(으)ㄹ지라도” concedes a hypothetical situation while keeping the following judgment or resolve.',
      zh:'“-(으)ㄹ지라도”先假设并承认尚未确定的情况，后面的判断或意志仍保持不变。'
    })
  })
});
const CAUSE_CONCESSION_ORDER=['badCause','goodCause','factConcession','hypotheticalConcession'];
const CAUSE_CONCESSION_METHOD=Object.freeze({
  ko:'결과의 평가와 현실성을 먼저 보세요. 나쁜 원인=탓에, 좋은 원인=덕분에, 실제 사실과 반대=는데도, 가정해도 결론 유지=ㄹ지라도입니다.',
  ja:'結果の評価と現実性を先に見ます。悪い原因＝탓에、良い原因＝덕분에、実際の事実に反する結果＝는데도、仮定しても結論維持＝ㄹ지라도です。',
  en:'Check the result value and reality first: bad cause = 탓에, beneficial cause = 덕분에, actual fact but contrary result = 는데도, hypothetical concession with a retained conclusion = ㄹ지라도.',
  zh:'先看结果的好坏和现实性：坏原因＝탓에，好原因＝덕분에，既成事实却有相反结果＝는데도，假设成立结论仍不变＝ㄹ지라도。'
});
const reviewedCauseConcessionItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=CAUSE_CONCESSION[key];
  return Object.freeze({
    id,level:2,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:CAUSE_CONCESSION_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(CAUSE_CONCESSION_ORDER.map(choiceKey=>Object.freeze({
      meaning:CAUSE_CONCESSION[choiceKey].meaning,
      explanationI18n:CAUSE_CONCESSION[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】탓에=나쁜 원인, 덕분에=좋은 원인, 는데도=실제 사실과 반대 결과, ㄹ지라도=가정해도 유지되는 결론으로 기준이 다릅니다.\n【재사용 풀이】${CAUSE_CONCESSION_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】탓에＝悪い原因、덕분에＝良い原因、는데도＝実際の事実に反する結果、ㄹ지라도＝仮定しても保つ結論で、基準が異なります。\n【再利用できる解き方】${CAUSE_CONCESSION_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] 탓에 marks a bad cause, 덕분에 a beneficial cause, 는데도 an actual fact with a contrary result, and ㄹ지라도 a hypothetical concession with a retained conclusion.\n[Reusable method] ${CAUSE_CONCESSION_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】탓에表示坏原因，덕분에表示好原因，는데도表示既成事实却有相反结果，ㄹ지라도表示即使假设成立结论仍不变，判断标准各不相同。\n【通用解法】${CAUSE_CONCESSION_METHOD.zh}`
    })
  });
};

const INFERENCE_EVIDENCE=Object.freeze({
  clueGuess:Object.freeze({
    meaning:Object.freeze({ko:'보이는 단서로 조심스럽게 추측',ja:'見える手掛かりから推測',en:'guess from visible clues',zh:'根据眼前线索推测'}),
    selected:Object.freeze({
      ko:'“-나 보다”는 보고 들은 단서를 바탕으로 상황을 조심스럽게 추측합니다.',
      ja:'「-나 보다」は、見聞きした手掛かりから状況を控えめに推測します。',
      en:'“-나 보다” makes a tentative guess from something seen or heard.',
      zh:'“-나 보다”根据看到或听到的线索谨慎推测情况。'
    })
  }),
  possibility:Object.freeze({
    meaning:Object.freeze({ko:'가능성을 열어 둠',ja:'可能性を残す（～かもしれない）',en:'leave open a possibility',zh:'保留某种可能性'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ지도 모르다”는 미래 상황이 그렇게 될 가능성을 확정하지 않고 열어 둡니다.',
      ja:'「-(으)ㄹ지도 모르다」は、今後そうなる可能性を確定せずに残します。',
      en:'“-(으)ㄹ지도 모르다” leaves open the possibility that something may happen.',
      zh:'“-(으)ㄹ지도 모르다”不下定论，保留将来可能发生的情况。'
    })
  }),
  certainty:Object.freeze({
    meaning:Object.freeze({ko:'사실이라고 강하게 확신',ja:'事実だと強く確信（～に違いない）',en:'strong certainty it is true',zh:'强烈确信这是事实'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ 것이 틀림없다”는 말하는 사람이 그 판단을 사실이라고 강하게 확신합니다.',
      ja:'「-(으)ㄹ 것이 틀림없다」は、話し手がその判断を事実だと強く確信します。',
      en:'“-(으)ㄹ 것이 틀림없다” expresses strong confidence that the judgment is true.',
      zh:'“-(으)ㄹ 것이 틀림없다”表示说话人强烈确信该判断属实。'
    })
  }),
  intentionBasis:Object.freeze({
    meaning:Object.freeze({ko:'내 의지를 이유로 뒤 행동 요청',ja:'自分の意志を理由に後を依頼',en:'my intention supports a request',zh:'以自己的意志为理由提出请求'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ 테니”는 말하는 사람의 의지나 예상을 근거로 뒤의 부탁·지시를 이어 갑니다.',
      ja:'「-(으)ㄹ 테니」は、話し手の意志・予想を根拠に、後ろの依頼や指示へ続けます。',
      en:'“-(으)ㄹ 테니” uses the speaker’s intention or prediction as the basis for a following request.',
      zh:'“-(으)ㄹ 테니”以说话人的意志或预想为根据，接着提出请求或指示。'
    })
  })
});
const INFERENCE_EVIDENCE_ORDER=['clueGuess','possibility','certainty','intentionBasis'];
const INFERENCE_EVIDENCE_METHOD=Object.freeze({
  ko:'단서·확신도·뒷문장을 보세요. 관찰 뒤 추측=나 보다, 가능성만 남김=ㄹ지도 모르다, 강한 확신=ㄹ 것이 틀림없다, 내 의지 뒤 부탁=ㄹ 테니입니다.',
  ja:'手掛かり・確信度・後続文を見ます。観察後の推測＝나 보다、可能性を残す＝ㄹ지도 모르다、強い確信＝ㄹ 것이 틀림없다、自分の意志の後に依頼＝ㄹ 테니です。',
  en:'Check the clue, certainty, and next clause: observed clue = 나 보다, open possibility = ㄹ지도 모르다, strong certainty = ㄹ 것이 틀림없다, my intention followed by a request = ㄹ 테니.',
  zh:'看线索、确信程度和后句：观察后推测＝나 보다，保留可能＝ㄹ지도 모르다，强烈确信＝ㄹ 것이 틀림없다，以自己的意志接请求＝ㄹ 테니。'
});
const reviewedInferenceEvidenceItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=INFERENCE_EVIDENCE[key];
  return Object.freeze({
    id,level:2,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:INFERENCE_EVIDENCE_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(INFERENCE_EVIDENCE_ORDER.map(choiceKey=>Object.freeze({
      meaning:INFERENCE_EVIDENCE[choiceKey].meaning,
      explanationI18n:INFERENCE_EVIDENCE[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】나 보다=관찰 단서의 추측, ㄹ지도 모르다=열린 가능성, ㄹ 것이 틀림없다=강한 확신, ㄹ 테니=내 의지·예상 뒤 부탁으로 판단 기준이 다릅니다.\n【재사용 풀이】${INFERENCE_EVIDENCE_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】나 보다＝観察した手掛かりからの推測、ㄹ지도 모르다＝残された可能性、ㄹ 것이 틀림없다＝強い確信、ㄹ 테니＝自分の意志・予想に続く依頼で、判断基準が異なります。\n【再利用できる解き方】${INFERENCE_EVIDENCE_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] 나 보다 infers from observed clues, ㄹ지도 모르다 leaves possibility open, ㄹ 것이 틀림없다 marks strong certainty, and ㄹ 테니 supports a following request with the speaker’s intention or prediction.\n[Reusable method] ${INFERENCE_EVIDENCE_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】나 보다表示根据观察线索推测，ㄹ지도 모르다保留可能性，ㄹ 것이 틀림없다表示强烈确信，ㄹ 테니以说话人的意志或预想引出请求，判断标准各不相同。\n【通用解法】${INFERENCE_EVIDENCE_METHOD.zh}`
    })
  });
};

const REPORTED_SPEECH=Object.freeze({
  statement:Object.freeze({
    meaning:Object.freeze({ko:'진술·사실을 전달',ja:'発言・事実の伝達',en:'report a statement or fact',zh:'转述陈述或事实'}),
    selected:Object.freeze({
      ko:'“-다고 하다”는 평서문으로 말한 내용이나 사실을 인용해 전달합니다.',
      ja:'「-다고 하다」は、平叙文で述べた内容や事実を引用して伝えます。',
      en:'“-다고 하다” reports the content or fact stated in a declarative sentence.',
      zh:'“-다고 하다”用于转述陈述句中说出的内容或事实。'
    })
  }),
  question:Object.freeze({
    meaning:Object.freeze({ko:'질문을 전달',ja:'質問の伝達',en:'report a question',zh:'转述提问'}),
    selected:Object.freeze({
      ko:'“-냐고 하다”는 상대가 물은 내용을 간접적으로 전달합니다.',
      ja:'「-냐고 하다」は、相手が尋ねた内容を間接的に伝えます。',
      en:'“-냐고 하다” indirectly reports what someone asked.',
      zh:'“-냐고 하다”用于间接转述别人询问的内容。'
    })
  }),
  command:Object.freeze({
    meaning:Object.freeze({ko:'명령·요청을 전달',ja:'命令・依頼の伝達',en:'report a command or request',zh:'转述命令或请求'}),
    selected:Object.freeze({
      ko:'“-(으)라고 하다”는 누군가에게 하라고 한 명령이나 요청을 전달합니다.',
      ja:'「-(으)라고 하다」は、誰かにするよう求めた命令・依頼を伝えます。',
      en:'“-(으)라고 하다” reports a command or request telling someone to do something.',
      zh:'“-(으)라고 하다”用于转述让某人做某事的命令或请求。'
    })
  }),
  suggestion:Object.freeze({
    meaning:Object.freeze({ko:'함께하자는 제안을 전달',ja:'一緒にしようという提案の伝達',en:'report a suggestion to do together',zh:'转述一起做某事的建议'}),
    selected:Object.freeze({
      ko:'“-자고 하다”는 화자가 함께하자고 제안한 내용을 전달합니다.',
      ja:'「-자고 하다」は、話し手が一緒にしようと提案した内容を伝えます。',
      en:'“-자고 하다” reports a suggestion that the speaker and listener do something together.',
      zh:'“-자고 하다”用于转述说话人提议大家一起做某事。'
    })
  })
});
const REPORTED_SPEECH_ORDER=['statement','question','command','suggestion'];
const REPORTED_SPEECH_METHOD=Object.freeze({
  ko:'인용한 원래 문장의 기능을 먼저 보세요. 설명·사실=다고, 물음=냐고, 상대에게 시킴·부탁=라고, 함께하자는 제안=자고입니다.',
  ja:'引用された元の文の働きを先に見ます。説明・事実＝다고、質問＝냐고、相手への命令・依頼＝라고、一緒にしようという提案＝자고です。',
  en:'First identify the original sentence function: statement or fact = 다고, question = 냐고, command or request = 라고, and suggestion to do together = 자고.',
  zh:'先判断原句的功能：陈述或事实＝다고，提问＝냐고，命令或请求＝라고，一起做某事的建议＝자고。'
});
const reviewedReportedSpeechItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=REPORTED_SPEECH[key];
  return Object.freeze({
    id,level:2,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:REPORTED_SPEECH_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(REPORTED_SPEECH_ORDER.map(choiceKey=>Object.freeze({
      meaning:REPORTED_SPEECH[choiceKey].meaning,
      explanationI18n:REPORTED_SPEECH[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】-다고 하다=진술·사실, -냐고 하다=질문, -(으)라고 하다=명령·요청, -자고 하다=함께하자는 제안을 전달합니다.\n【재사용 풀이】${REPORTED_SPEECH_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】-다고 하다＝発言・事実、-냐고 하다＝質問、-(으)라고 하다＝命令・依頼、-자고 하다＝一緒にしようという提案を伝えます。\n【再利用できる解き方】${REPORTED_SPEECH_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] -다고 하다 reports a statement or fact, -냐고 하다 a question, -(으)라고 하다 a command or request, and -자고 하다 a suggestion to do something together.\n[Reusable method] ${REPORTED_SPEECH_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】-다고 하다转述陈述或事实，-냐고 하다转述提问，-(으)라고 하다转述命令或请求，-자고 하다转述一起做某事的建议。\n【通用解法】${REPORTED_SPEECH_METHOD.zh}`
    })
  });
};

const STATE_CHANGE=Object.freeze({
  circumstanceChange:Object.freeze({
    meaning:Object.freeze({ko:'상황의 흐름으로 새롭게 하게 됨',ja:'状況の流れで～することになる',en:'come to do through circumstances',zh:'因情况变化而开始做'}),
    selected:Object.freeze({
      ko:'“-게 되다”는 계획·상황의 변화로 이전과 달리 어떤 일을 새롭게 하게 됨을 나타냅니다.',
      ja:'「-게 되다」は、計画・状況の変化により、以前とは違って新たに何かをすることになったことを表します。',
      en:'“-게 되다” marks that circumstances or plans led to doing something new.',
      zh:'“-게 되다”表示由于计划或情况变化，开始做以前没有做的事。'
    })
  }),
  qualityChange:Object.freeze({
    meaning:Object.freeze({ko:'성질·상태가 달라짐',ja:'性質・状態が～く／になる',en:'a quality or state becomes different',zh:'性质或状态发生变化'}),
    selected:Object.freeze({
      ko:'“-아/어지다”는 형용사로 나타낸 성질이나 상태가 이전과 다르게 변함을 나타냅니다.',
      ja:'「-아/어지다」は、形容詞で表す性質・状態が以前と違う状態に変わることを表します。',
      en:'“-아/어지다” marks a change in a quality or state expressed by an adjective.',
      zh:'“-아/어지다”表示由形容词表达的性质或状态发生变化。'
    })
  }),
  actionProgress:Object.freeze({
    meaning:Object.freeze({ko:'동작이 지금 진행 중',ja:'動作が今進行中（～している）',en:'an action is in progress now',zh:'动作现在正在进行'}),
    selected:Object.freeze({
      ko:'“-고 있다”는 주어가 하는 동작이 말하는 시점에 진행 중임을 나타냅니다.',
      ja:'「-고 있다」は、主語が行う動作が話している時点で進行中であることを表します。',
      en:'“-고 있다” marks an action the subject is performing at the present moment.',
      zh:'“-고 있다”表示主语所做的动作在说话时正在进行。'
    })
  }),
  resultState:Object.freeze({
    meaning:Object.freeze({ko:'동작이 끝난 뒤 결과 상태 유지',ja:'動作後の結果状態が続く',en:'a result state remains after an action',zh:'动作结束后的结果状态持续'}),
    selected:Object.freeze({
      ko:'“-아/어 있다”는 동작이 끝난 뒤 생긴 결과 상태가 그대로 이어짐을 나타냅니다.',
      ja:'「-아/어 있다」は、動作が終わった後に生じた結果の状態がそのまま続いていることを表します。',
      en:'“-아/어 있다” marks that the state produced by a completed action still remains.',
      zh:'“-아/어 있다”表示动作结束后形成的结果状态仍在持续。'
    })
  })
});
const STATE_CHANGE_ORDER=['circumstanceChange','qualityChange','actionProgress','resultState'];
const STATE_CHANGE_METHOD=Object.freeze({
  ko:'무엇이 달라지거나 이어지는지 보세요. 상황 때문에 새 행동=게 되다, 성질 변화=아/어지다, 지금 하는 동작=고 있다, 끝난 동작의 결과 유지=아/어 있다입니다.',
  ja:'何が変わる・続くのかを見ます。状況による新しい行動＝게 되다、性質の変化＝아/어지다、今している動作＝고 있다、終わった動作の結果状態＝아/어 있다です。',
  en:'Identify what changes or continues: a new action caused by circumstances = 게 되다, a quality change = 아/어지다, an action happening now = 고 있다, and a remaining result state = 아/어 있다.',
  zh:'先看变化或持续的是什么：因情况而开始的新动作＝게 되다，性质变化＝아/어지다，正在进行的动作�