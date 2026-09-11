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

const TOPIK_I=[
  item(1,'word','가게','상점','店','store; shop','商店','집 앞 가게에서 우유를 샀어요.'),
  item(1,'word','약속','만나기로 정한 일','約束','promise; appointment','约定','친구와 세 시에 만날 약속이 있어요.'),
  item(1,'word','주문하다','음식이나 물건을 달라고 하다','注文する','order','点餐；订购','식당에서 비빔밥을 주문했어요.'),
  item(1,'word','교환하다','다른 것으로 바꾸다','交換する','exchange','更换；交换','작은 신발을 큰 것으로 교환했어요.'),
  item(1,'word','빌리다','남의 것을 잠시 쓰다','借りる','borrow','借','도서관에서 책을 빌렸어요.'),
  item(1,'word','반납하다','빌린 것을 돌려주다','返却する','return','归还','책은 화요일까지 반납하세요.'),
  item(1,'word','무료','돈을 내지 않음','無料','free','免费','수요일 저녁에는 입장이 무료예요.'),
  item(1,'word','늦다','정한 시간보다 뒤가 되다','遅れる；遅い','be late','迟；晚','버스가 십 분 늦게 왔어요.'),
  item(1,'word','열다','문이나 가게를 이용할 수 있게 하다','開ける；開く','open','打开；营业','도서관은 아홉 시에 문을 열어요.'),
  item(1,'word','닫다','열린 것을 막거나 영업을 끝내다','閉める；閉まる','close','关闭','에어컨을 켰으니 문을 닫아 주세요.'),
  item(1,'word','가깝다','거리가 짧다','近い','be near','近','새 회사는 지하철역에서 가까워요.'),
  item(1,'word','고르다','여럿 중 하나를 선택하다','選ぶ','choose','选择','가장 알맞은 답을 고르세요.'),
  item(1,'word','참석하다','모임이나 행사에 가다','参加する','attend','参加','토요일 수업에 참석할 수 있어요?'),
  item(1,'word','미리','정한 때보다 앞서','あらかじめ','in advance','提前','기차표를 미리 예약했어요.'),
  item(1,'word','바꾸다','다른 상태나 것으로 만들다','変える','change','更换','회의 시간을 열한 시로 바꿨어요.'),
  item(1,'word','필요하다','꼭 있어야 하다','必要だ','need; be necessary','需要；必要','통장을 만들려면 신분증이 필요해요.'),
  item(1,'word','도착하다','목적지에 이르다','到着する','arrive','到达','택배가 오늘 오후에 도착해요.'),
  item(1,'word','예약하다','자리나 시간을 미리 정하다','予約する','reserve; book','预约','주말 식당을 예약했어요.'),
  item(1,'word','깜빡하다','해야 할 일이나 물건을 순간적으로 잊다','うっかり忘れる','forget by accident','一时忘记','우산을 가져오는 것을 깜빡했어요.'),
  item(1,'word','미끄럽다','표면이 매끈해서 쉽게 넘어질 수 있다','滑りやすい','be slippery','滑','비가 와서 길이 미끄러워요.'),
  item(1,'word','포장하다','물건을 싸거나 음식을 가져갈 수 있게 담다','包む；持ち帰り用にする','wrap; pack to go','包装；打包','남은 음식은 포장해 주세요.'),
  item(1,'word','직접','다른 사람을 통하지 않고 스스로','直接；自分で','directly; in person','亲自；直接','신청서를 직접 제출했습니다.'),
  reviewedTimeItem('S04-I-W-TIME-01','벌써','already','숙제를 벌써 다 했어요.',{
    ko:'숙제를 벌써 다 했어요.',ja:'宿題をもう全部終えました。',en:'I already finished all my homework.',zh:'我已经把作业全做完了。'
  },{
    ko:'“숙제를 벌써 다 했어요”는 예상보다 이르게 숙제가 이미 끝났다는 뜻입니다.',
    ja:'「숙제를 벌써 다 했어요」は「宿題をもう全部終えました」という、予想より早い完了です。',
    en:'“숙제를 벌써 다 했어요” says the homework is already finished, earlier than expected.',
    zh:'“숙제를 벌써 다 했어요”表示作业已经完成，而且比预想更早。'
  }),
  reviewedTimeItem('S04-I-W-TIME-02','아직','still','가게가 아직 안 열렸어요.',{
    ko:'가게가 아직 안 열렸어요.',ja:'店はまだ開いていません。',en:'The shop is still not open.',zh:'商店还没开门。'
  },{
    ko:'“가게가 아직 안 열렸어요”는 지금까지도 가게가 열리지 않은 미완료 상태입니다.',
    ja:'「가게가 아직 안 열렸어요」は「店はまだ開いていません」という未完了の状態です。',
    en:'“가게가 아직 안 열렸어요” says the shop is still not open, an incomplete state.',
    zh:'“가게가 아직 안 열렸어요”表示商店到现在还没开门，是未完成状态。'
  }),
  reviewedTimeItem('S04-I-W-TIME-03','방금','justNow','기차가 방금 출발했어요.',{
    ko:'기차가 방금 출발했어요.',ja:'列車はたった今出発しました。',en:'The train just left.',zh:'火车刚刚出发了。'
  },{
    ko:'“기차가 방금 출발했어요”는 기차가 말하는 때의 바로 조금 전에 떠났다는 뜻입니다.',
    ja:'「기차가 방금 출발했어요」は「列車はたった今出発しました」という直前の出来事です。',
    en:'“기차가 방금 출발했어요” places the train’s departure in the immediate past: just now.',
    zh:'“기차가 방금 출발했어요”表示火车就在说话前不久刚刚出发。'
  }),
  reviewedTimeItem('S04-I-W-TIME-04','곧','soon','수업이 곧 시작해요.',{
    ko:'수업이 곧 시작해요.',ja:'授業がもうすぐ始まります。',en:'Class will start soon.',zh:'马上就要上课了。'
  },{
    ko:'“수업이 곧 시작해요”는 수업이 아직 시작하지 않았지만 가까운 미래에 시작한다는 뜻입니다.',
    ja:'「수업이 곧 시작해요」は「授業がもうすぐ始まります」という近い未来です。',
    en:'“수업이 곧 시작해요” says the class has not started yet but will start soon.',
    zh:'“수업이 곧 시작해요”表示课程还没开始，但马上就要开始。'
  }),

  item(1,'grammar','-고 싶다','~하기를 원하다','～したい','want to','想……','한국 음식을 먹고 싶어요.'),
  item(1,'grammar','-아/어 주세요','정중하게 부탁함','～してください','please ...','请……','문을 닫아 주세요.'),
  item(1,'grammar','-(으)려고 하다','~할 계획이다','～しようと思う','intend to','打算……','내일 병원에 가려고 해요.'),
  item(1,'grammar','-아/어서','~해서 / 그리고 나서','～ので；～して','because; and then','因为……；然后……','길이 막혀서 지하철을 탔어요.'),
  item(1,'grammar','-(으)ㄹ 수 있다','~하는 것이 가능하다','～できる','can','能……','카드로 계산할 수 있어요.'),
  item(1,'grammar','-지 못하다','~할 수 없다','～できない','cannot','不能……','오늘은 시간이 없어서 가지 못해요.'),
  item(1,'grammar','-아/어야 하다','반드시 ~해야 한다','～しなければならない','must','必须……','책은 14일 안에 반납해야 해요.'),
  item(1,'grammar','-고 나서','~한 뒤에','～してから','after doing','……之后','숙제를 하고 나서 영화를 봤어요.'),
  item(1,'grammar','-지만','앞뒤 내용이 반대됨','～だが；～けれど','but; although','虽然……但是……','작지만 깨끗한 방이에요.'),
  item(1,'grammar','-거나','둘 이상의 선택','～たり；または','or','或者……','주말에는 책을 읽거나 운동해요.'),
  item(1,'grammar','-기 전에','뒤 행동보다 앞서 함','～する前に','before doing','在……之前','집을 나가기 전에 창문을 확인하세요.'),
  item(1,'grammar','-아/어도','그 상황을 인정해도 뒤 내용이 유지됨','～しても','even if; even though','即使……也……','조금 늦어도 꼭 와 주세요.'),
  item(1,'grammar','-(으)면','조건이나 가정을 나타냄','～すれば；～なら','if; when','如果……','시간이 있으면 같이 등산해요.'),
  item(1,'grammar','-는 동안','어떤 행동이나 상태가 계속되는 시간','～している間','while; during','在……期间','버스를 기다리는 동안 책을 읽었어요.'),

  item(1,'expression','마음에 들다','좋아하거나 만족하다','気に入る','like','喜欢；中意','이 셔츠가 마음에 들어요.'),
  item(1,'expression','괜찮아요','문제없어요','大丈夫です','It is okay.','没关系。','조금 늦어도 괜찮아요.'),
  item(1,'expression','잠시만요','조금만 기다려 주세요','少々お待ちください','One moment, please.','请稍等。','잠시만요. 곧 도와드릴게요.'),
  item(1,'expression','처음 뵙겠습니다','처음 만나 인사합니다','初めまして','Nice to meet you.','初次见面。','안녕하세요. 처음 뵙겠습니다.'),
  item(1,'expression','잘 먹겠습니다','먹기 전에 하는 감사 인사','いただきます','Thanks for the meal.','我开动了。','음식을 준비해 주셔서 감사합니다. 잘 먹겠습니다.'),
  item(1,'expression','수고하세요','일하는 사람에게 하는 인사','お疲れさまです','Keep up the good work.','辛苦了。','먼저 가겠습니다. 수고하세요.'),
  item(1,'expression','길이 막히다','교통이 혼잡하다','道が混む','traffic is congested','堵车','월요일 아침에는 길이 많이 막혀요.'),
  item(1,'expression','배가 고프다','음식을 먹고 싶다','お腹がすく','be hungry','饿','아침을 안 먹어서 배가 고파요.'),
  item(1,'expression','시간이 나다','해야 할 일이 없어 여유 시간이 생기다','時間が空く','have some free time','有空','오후에 시간이 나면 같이 차를 마셔요.'),
  item(1,'expression','손이 모자라다','일할 사람이 부족하다','人手が足りない','be short-handed','人手不足','축제 준비를 도울 사람이 적어서 손이 모자라요.'),
  item(1,'expression','잘 부탁드립니다','앞으로 좋은 관계나 도움을 정중히 청하는 인사','よろしくお願いします','I look forward to working with you.','请多关照','오늘부터 함께 일하게 되었습니다. 잘 부탁드립니다.'),
  item(1,'expression','다녀오겠습니다','나갔다가 돌아오겠다고 알리는 인사','行ってきます','I am leaving and will be back.','我出门了，会回来的','학교에 다녀오겠습니다.')
];

const TOPIK_II=[
  item(2,'word','미루다','나중으로 넘기다','先延ばしにする','postpone','推迟；拖延','할 일을 내일로 미루지 마세요.'),
  item(2,'word','꼼꼼하다','빈틈없이 세심하다','几帳面だ','meticulous','仔细；一丝不苟','그분은 일을 아주 꼼꼼하게 해요.'),
  item(2,'word','익숙하다','낯설지 않다','慣れている','be accustomed','熟悉；习惯','이제 한국 생활에 익숙해졌어요.'),
  item(2,'word','아쉽다','기대에 못 미쳐 안타깝다','心残りだ；残念だ','feel regretful','遗憾；可惜','더 이야기하지 못해 아쉬워요.'),
  item(2,'word','챙기다','빠뜨리지 않고 준비하다','忘れずに用意する','make sure to bring','备齐；带好','여권을 꼭 챙기세요.'),
  item(2,'word','부담스럽다','부담을 느끼다','負担に感じる','feel burdened','感到有负担','너무 비싼 선물은 부담스러워요.'),
  item(2,'word','서두르다','급하게 움직이다','急ぐ','hurry','赶忙；着急','늦었으니까 조금 서둘러 주세요.'),
  item(2,'word','차분하다','조용하고 침착하다','落ち着いている','calm; composed','沉着；平静','차분하게 다시 설명해 보세요.'),
  item(2,'word','놓치다','제때 잡거나 얻지 못하다','逃す','miss','错过','버스를 놓쳐서 지각했어요.'),
  item(2,'word','살피다','주의 깊게 보다','注意深く見る','examine','仔细查看','계약 조건을 자세히 살펴야 합니다.'),
  item(2,'word','드물다','자주 있지 않다','珍しい；まれだ','be rare','罕见','현금만 받는 가게는 드물어요.'),
  item(2,'word','넉넉하다','충분하고 여유가 있다','十分だ；余裕がある','be ample','充足；宽裕','시간을 넉넉하게 잡으세요.'),
  item(2,'word','아끼다','소중히 여기거나 절약하다','大切にする；節約する','cherish; save','珍惜；节省','물을 아껴 쓰는 습관이 필요해요.'),
  item(2,'word','막상','실제 상황이 되었을 때','いざ','when it comes to it','真到……时','막상 발표를 시작하니 긴장이 풀렸어요.'),
  item(2,'word','오히려','예상과 반대로','むしろ；かえって','rather; instead','反而','너무 많이 자서 오히려 피곤해요.'),
  item(2,'word','간과하다','중요한 사실을 제대로 보지 못하고 넘기다','見過ごす','overlook','忽视','작은 오류를 간과하면 큰 문제가 될 수 있어요.'),
  item(2,'word','선뜻','망설이지 않고 기꺼이','快く；ためらわずに','readily; willingly','欣然；爽快地','어려운 부탁인데도 선뜻 도와주었어요.'),
  item(2,'word','줄곧','처음부터 끝까지 계속','ずっと；終始','all along; throughout','一直；始终','그는 십 년 동안 줄곧 같은 분야를 연구했어요.'),
  item(2,'word','마련하다','필요한 것을 준비하거나 만들다','用意する；設ける','prepare; provide','准备；筹备','주민들을 위한 쉼터를 마련했어요.'),
  reviewedConnectorItem('S04-II-W-LINK-01','따라서','result','비가 많이 왔습니다. 따라서 경기가 취소되었습니다.',{
    ko:'비가 많이 왔습니다. 따라서 경기가 취소되었습니다.',ja:'大雨が降りました。したがって、試合は中止になりました。',en:'It rained heavily. Therefore, the match was canceled.',zh:'下了大雨。因此，比赛取消了。'
  },{
    ko:'“비가 많이 왔습니다”가 원인이고 경기 취소가 그 결과이므로 “따라서”가 맞습니다.',
    ja:'「大雨が降った」が原因で、試合の中止がその結果なので「따라서」が合います。',
    en:'Heavy rain is the cause and the cancellation is its result, so 따라서 fits.',
    zh:'“下了大雨”是原因，比赛取消是结果，所以应选“따라서”。'
  }),
  reviewedConnectorItem('S04-II-W-LINK-02','반면에','contrast','도시는 편리합니다. 반면에 생활비가 비쌉니다.',{
    ko:'도시는 편리합니다. 반면에 생활비가 비쌉니다.',ja:'都市は便利です。一方で、生活費が高いです。',en:'Cities are convenient. On the other hand, living costs are high.',zh:'城市很方便。另一方面，生活费很高。'
  },{
    ko:'도시의 편리함과 비싼 생활비라는 서로 다른 두 면을 대조하므로 “반면에”가 맞습니다.',
    ja:'都市の便利さと生活費の高さという異なる二面を対比するので「반면에」が合います。',
    en:'The sentence contrasts convenience with high living costs, so 반면에 fits.',
    zh:'句子把城市的便利和高昂的生活费进行对比，所以应选“반면에”。'
  }),
  reviewedConnectorItem('S04-II-W-LINK-03','게다가','addition','이 식당은 음식이 맛있습니다. 게다가 가격도 저렴합니다.',{
    ko:'이 식당은 음식이 맛있습니다. 게다가 가격도 저렴합니다.',ja:'この食堂は料理がおいしいです。そのうえ、値段も安いです。',en:'This restaurant serves delicious food. Moreover, it is inexpensive.',zh:'这家餐厅的菜很好吃。而且，价格也便宜。'
  },{
    ko:'맛있다는 장점에 저렴하다는 장점을 같은 방향으로 더하므로 “게다가”가 맞습니다.',
    ja:'おいしいという長所に、安いという長所を同じ方向で加えるので「게다가」が合います。',
    en:'A second positive point, low price, is added to good taste, so 게다가 fits.',
    zh:'在“好吃”这个优点上又补充“便宜”这个同方向的优点，所以应选“게다가”。'
  }),
  reviewedConnectorItem('S04-II-W-LINK-04','다만','condition','참가비는 무료입니다. 다만 미리 신청해야 합니다.',{
    ko:'참가비는 무료입니다. 다만 미리 신청해야 합니다.',ja:'参加費は無料です。ただし、事前に申し込む必要があります。',en:'Participation is free. However, you must register in advance.',zh:'参加免费。不过，必须提前报名。'
  },{
    ko:'무료라는 앞말은 그대로 두고 사전 신청 조건만 붙이므로 “다만”이 맞습니다.',
    ja:'無料という前言は保ち、事前申請という条件だけを付けるので「다만」が合います。',
    en:'The event remains free, but advance registration is added as a condition, so 다만 fits.',
    zh:'“免费”这一点不变，只补充提前报名的条件，所以应选“다만”。'
  }),
  item(2,'idiom','눈에 띄다','두드러져 보이다','目立つ','stand out','显眼；引人注目','빨간 우산이 멀리서도 눈에 띄어요.'),
  item(2,'idiom','손이 크다','넉넉하게 많이 준비하다','気前よく多く用意する','prepare generously','出手大方；准备得多','할머니는 손이 커서 음식을 많이 만드세요.'),
  item(2,'idiom','기분이 풀리다','화난 마음이 좋아지다','機嫌が直る','feel better','消气；心情好转','사과를 듣고 기분이 풀렸어요.'),
  item(2,'idiom','발이 넓다','아는 사람이 많다','顔が広い','be well-connected','人脉广','민수 씨는 발이 넓어서 아는 사람이 많아요.'),
  item(2,'idiom','귀가 얇다','남의 말에 쉽게 흔들리다','人の話に影響されやすい','be easily swayed','耳根软','저는 귀가 얇아서 광고에 쉽게 끌려요.'),
  item(2,'idiom','한눈을 팔다','다른 데에 정신을 두다','よそ見をする','be distracted','分心；东张西望','운전할 때 한눈을 팔면 위험해요.'),
  item(2,'idiom','입이 무겁다','비밀을 잘 지키다','口が堅い','keep a secret','嘴严；守口如瓶','그 친구는 입이 무거워서 믿을 수 있어요.'),
  item(2,'idiom','마음을 놓다','걱정을 멈추고 안심하다','安心する','feel relieved','放心；安心','검사 결과를 듣고 마음을 놓았어요.'),
  item(2,'idiom','발 벗고 나서다','적극적으로 도와주다','一肌脱ぐ','go out of one’s way to help','挺身相助','친구들이 발 벗고 나서서 도와줬어요.'),
  item(2,'idiom','손에 익다','일이 익숙해지다','手慣れる','get the hang of it','上手；熟练','새 도구가 이제 손에 익었어요.'),
  item(2,'idiom','눈코 뜰 새 없다','잠깐 쉴 틈도 없을 만큼 매우 바쁘다','目が回るほど忙しい','be extremely busy','忙得不可开交','연말이라 눈코 뜰 새 없이 바빠요.'),
  item(2,'idiom','두고 볼 일이다','지금 결론 내리지 않고 앞으로의 결과를 지켜봐야 한다','今後の成り行きを見守る必要がある','remain to be seen','还要看今后的结果','새 정책의 효과는 아직 두고 볼 일이에요.'),
  item(2,'idiom','난처한 입장에 놓이다','대응하기 어려운 곤란한 상황이 되다','困った立場に置かれる','be put in an awkward position','陷入为难的处境','갑작스러운 변경으로 회사가 난처한 입장에 놓였어요.'),
  item(2,'idiom','갈피를 못 잡다','상황을 이해하거나 방향을 정하지 못하다','見当がつかない；方針を決められない','be unable to get one’s bearings','摸不着头绪','정보가 너무 많아서 갈피를 못 잡겠어요.'),

  item(2,'grammar','-는 바람에','뜻밖의 원인으로 나쁜 결과가 생김','～したせいで','because ... unexpectedly','因为意外……而……','버스를 놓치는 바람에 지각했어요.'),
  item(2,'grammar','-기는커녕','앞의 사실은 전혀 아니고 반대 상황임','～どころか','far from; let alone','别说……反而……','도와주기는커녕 방해만 했어요.'),
  item(2,'grammar','-(으)ㄴ 나머지','정도가 지나쳐 뒤의 결과가 생김','～したあまり','as a result of too much','由于过度……','너무 긴장한 나머지 이름을 잊었어요.'),
  item(2,'grammar','-고 말다','결국 원하지 않던 일이 일어남','～してしまう','end up doing','最终还是……','참으려고 했지만 웃고 말았어요.'),
  item(2,'grammar','-(으)ㄹ 법하다','그럴 가능성이나 타당성이 있음','～しそうだ；～して当然だ','be likely to; be understandable','有可能……；也难怪……','오래 연습했으니 실력이 늘 법해요.'),
  item(2,'grammar','-는 김에','기회를 이용해 함께 함','～するついでに','while one is at it','趁着……；顺便','은행에 가는 김에 우체국에도 들렀어요.'),
  item(2,'grammar','-(으)ㄹ수록','정도가 함께 더해짐','～すればするほど','the more ... the more','越……越……','한국어는 공부할수록 재미있어요.'),
  item(2,'grammar','-기는 하지만','사실을 인정한 뒤 반대함','～ではあるが','it is true that ... but','虽然……但是……','싸기는 하지만 품질은 좋아요.'),
  item(2,'grammar','-도록','목적이나 정도에 이르게 함','～するように','so that','为了……；使……','잊지 않도록 메모해 두세요.'),
  item(2,'grammar','-았/었더니','행동 뒤에 알게 된 결과','～したら；～したところ','when I did ...','做了……之后发现……','창문을 열었더니 바람이 들어왔어요.'),
  item(2,'grammar','-(으)ㄴ 채로','상태를 유지하며 뒤 행동을 함','～したまま','while still ...','保持……状态','불을 켠 채로 잠이 들었어요.'),
  item(2,'grammar','-느라고','앞 행동 때문에 뒤 일을 못함','～するのに忙しくて','because one was busy ...','因为忙于……','숙제하느라고 전화를 못 받았어요.'),
  item(2,'grammar','-다 보니','계속한 결과 새 상태가 생김','～しているうちに','as one keeps doing','做着做着……','매일 연습하다 보니 발음이 좋아졌어요.'),
  item(2,'grammar','-는 대신에','앞의 것을 다른 것으로 바꿈','～する代わりに','instead of','代替……','택시 대신에 지하철을 이용했어요.'),
  item(2,'grammar','-(으)려던 참이다','마침 하려고 하던 순간','ちょうど～しようとしていた','be just about to','正打算……','저도 전화하려던 참이었어요.'),
  item(2,'grammar','-(으)ㄹ 리가 없다','가능성을 강하게 부정함','～はずがない','there is no way','不可能……','그 사람이 약속을 잊을 리가 없어요.'),
  item(2,'grammar','-기만 하면','그때마다 같은 결과가 나타남','～するたびに','whenever','每当……','이 노래를 듣기만 하면 여행이 생각나요.'),
  item(2,'grammar','-더라도','앞 상황을 인정해도 뒤의 판단이나 결과가 유지됨','～としても','even if; even though','即使……也……','결과가 좋지 않더라도 과정에서 배울 수 있어요.'),
  item(2,'grammar','-(으)ㄹ 뿐만 아니라','앞의 사실에 뒤의 사실을 더함','～だけでなく','not only ... but also','不仅……而且……','이 도서관은 자료가 다양할 뿐만 아니라 늦게까지 문을 열어요.'),
  item(2,'grammar','-기 마련이다','일반적으로 그렇게 되는 것이 당연하거나 자연스러움','～ものだ','be bound to; naturally','总会……；自然会……','새로운 일을 시작하면 실수하기 마련이에요.'),
  item(2,'grammar','-는 한','앞의 조건이 유지되는 범위에서','～する限り','as long as','只要……','원칙을 지키는 한 신뢰를 잃지 않을 거예요.'),

  reviewedCauseConcessionItem('S04-II-G-CAUSE-01','-(으)ㄴ 탓에','badCause','준비가 부족했던 탓에 발표를 망쳤습니다.',{
    ko:'준비가 부족했던 탓에 발표를 망쳤습니다.',ja:'準備が足りなかったせいで、発表に失敗しました。',en:'I ruined the presentation because I had not prepared enough.',zh:'由于准备不足，我把发表搞砸了。'
  },{
    ko:'“발표를 망쳤습니다”라는 나쁜 결과의 원인을 준비 부족에 돌리므로 “-(으)ㄴ 탓에”가 맞습니다.',
    ja:'「発表に失敗した」という悪い結果の原因を準備不足に求めているので「-(으)ㄴ 탓에」が合います。',
    en:'The sentence blames insufficient preparation for the bad result, a ruined presentation, so -(으)ㄴ 탓에 fits.',
    zh:'句子把“发表搞砸”这一坏结果归因于准备不足，所以应选“-(으)ㄴ 탓에”。'
  }),
  reviewedCauseConcessionItem('S04-II-G-CAUSE-02','-(으)ㄴ 덕분에','goodCause','동료들이 도와준 덕분에 일을 제시간에 끝냈습니다.',{
    ko:'동료들이 도와준 덕분에 일을 제시간에 끝냈습니다.',ja:'同僚が手伝ってくれたおかげで、仕事を時間どおりに終えられました。',en:'Thanks to my colleagues’ help, I finished the work on time.',zh:'多亏同事们帮忙，我按时完成了工作。'
  },{
    ko:'제시간에 끝냈다는 좋은 결과를 동료의 도움 덕으로 평가하므로 “-(으)ㄴ 덕분에”가 맞습니다.',
    ja:'時間どおりに終えたという良い結果を同僚の助けのおかげだと評価するので「-(으)ㄴ 덕분에」が合います。',
    en:'The sentence credits colleagues’ help for the good result of finishing on time, so -(으)ㄴ 덕분에 fits.',
    zh:'句子把按时完成这一好结果归功于同事的帮助，所以应选“-(으)ㄴ 덕분에”。'
  }),
  reviewedCauseConcessionItem('S04-II-G-CAUSE-03','-는데도','factConcession','밤새 비가 왔는데도 길은 막히지 않았습니다.',{
    ko:'밤새 비가 왔는데도 길은 막히지 않았습니다.',ja:'一晩中雨が降ったのに、道は渋滞しませんでした。',en:'Although it rained all night, the roads were not congested.',zh:'尽管下了一整夜的雨，道路却没有堵塞。'
  },{
    ko:'밤새 비가 온 것은 실제 사실이지만 길이 막히지 않았다는 예상 밖 결과가 이어지므로 “-는데도”가 맞습니다.',
    ja:'一晩中雨が降ったのは事実ですが、道が渋滞しなかったという予想外の結果が続くので「-는데도」が合います。',
    en:'It actually rained all night, yet the roads were unexpectedly clear, so -는데도 fits.',
    zh:'下了一整夜雨是事实，但后面却是道路没有堵塞这一意外结果，所以应选“-는데도”。'
  }),
  reviewedCauseConcessionItem('S04-II-G-CAUSE-04','-(으)ㄹ지라도','hypotheticalConcession','실패할지라도 다시 도전하겠습니다.',{
    ko:'실패할지라도 다시 도전하겠습니다.',ja:'たとえ失敗しても、もう一度挑戦します。',en:'Even if I fail, I will try again.',zh:'即使失败，我也会再次挑战。'
  },{
    ko:'실패는 아직 확정되지 않은 가정이고, 그 경우에도 다시 도전하겠다는 의지는 유지되므로 “-(으)ㄹ지라도”가 맞습니다.',
    ja:'失敗はまだ確定していない仮定で、その場合でも再挑戦する意志を保つので「-(으)ㄹ지라도」が合います。',
    en:'Failure is hypothetical, and the resolve to try again remains even in that case, so -(으)ㄹ지라도 fits.',
    zh:'失败还是未确定的假设，即使如此，再次挑战的意志仍不变，所以应选“-(으)ㄹ지라도”。'
  }),

  reviewedInferenceEvidenceItem('S04-II-G-INFER-01','-나 보다','clueGuess','사무실 불이 꺼진 걸 보니 모두 퇴근했나 봐요.',{
    ko:'사무실 불이 꺼진 걸 보니 모두 퇴근했나 봐요.',ja:'事務所の明かりが消えているのを見ると、みんな退勤したようです。',en:'The office lights are off, so it looks like everyone has left.',zh:'看到办公室的灯关了，看来大家都下班了。'
  },{
    ko:'사무실 불이 꺼진 모습을 직접 보고 퇴근을 추측하므로 “-나 보다”가 맞습니다.',
    ja:'事務所の明かりが消えているのを見て、退勤したと推測しているので「-나 보다」が合います。',
    en:'The speaker sees the office lights off and infers that everyone left, so -나 보다 fits.',
    zh:'说话人看到办公室的灯关了，由此推测大家已经下班，所以应选“-나 보다”。'
  }),
  reviewedInferenceEvidenceItem('S04-II-G-INFER-02','-(으)ㄹ지도 모르다','possibility','눈이 많이 오면 기차가 늦을지도 몰라요.',{
    ko:'눈이 많이 오면 기차가 늦을지도 몰라요.',ja:'雪がたくさん降ると、列車が遅れるかもしれません。',en:'If it snows heavily, the train may be late.',zh:'如果雪下得很大，火车可能会晚点。'
  },{
    ko:'기차 지연을 확정하지 않고 가능한 결과 하나로 열어 두므로 “-(으)ㄹ지도 모르다”가 맞습니다.',
    ja:'列車の遅れを断定せず、起こり得る結果として残しているので「-(으)ㄹ지도 모르다」が合います。',
    en:'The delay is not certain; it remains one possible result, so -(으)ㄹ지도 모르다 fits.',
    zh:'句子没有断定火车会晚点，只把它作为一种可能结果，所以应选“-(으)ㄹ지도 모르다”。'
  }),
  reviewedInferenceEvidenceItem('S04-II-G-INFER-03','-(으)ㄹ 것이 틀림없다','certainty','매일 연습했으니 실력이 늘었을 것이 틀림없어요.',{
    ko:'매일 연습했으니 실력이 늘었을 것이 틀림없어요.',ja:'毎日練習したので、実力が伸びたに違いありません。',en:'After practicing every day, their skills must have improved.',zh:'每天都练习，实力一定提高了。'
  },{
    ko:'매일 연습했다는 근거로 실력 향상을 강하게 확신하므로 “-(으)ㄹ 것이 틀림없다”가 맞습니다.',
    ja:'毎日練習したことを根拠に、実力が伸びたと強く確信しているので「-(으)ㄹ 것이 틀림없다」が合います。',
    en:'Daily practice supports a strong conviction that the skills improved, so -(으)ㄹ 것이 틀림없다 fits.',
    zh:'句子以每天练习为根据，强烈确信实力已经提高，所以应选“-(으)ㄹ 것이 틀림없다”。'
  }),
  reviewedInferenceEvidenceItem('S04-II-G-INFER-04','-(으)ㄹ 테니','intentionBasis','제가 자료를 정리할 테니 먼저 발표를 준비하세요.',{
    ko:'제가 자료를 정리할 테니 먼저 발표를 준비하세요.',ja:'私が資料を整理するので、先に発表の準備をしてください。',en:'I will organize the materials, so please prepare the presentation first.',zh:'我来整理资料，请先准备发表。'
  },{
    ko:'내가 자료를 정리하겠다는 의지를 이유로 상대에게 발표 준비를 요청하므로 “-(으)ㄹ 테니”가 맞습니다.',
    ja:'自分が資料を整理するという意志を理由に、相手へ発表準備を頼むので「-(으)ㄹ 테니」が合います。',
    en:'The speaker’s intention to organize the materials supports the request that follows, so -(으)ㄹ 테니 fits.',
    zh:'说话人以自己要整理资料的意志为理由，请对方准备发表，所以应选“-(으)ㄹ 테니”。'
  })
];

window.MALBIT_SHORTS_DECKS={1:TOPIK_I,2:TOPIK_II};
})();
