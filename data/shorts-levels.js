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
  zh:'先看变化或持续的是什么：因情况而开始的新动作＝게 되다，性质变化＝아/어지다，正在进行的动作＝고 있다，动作结束后持续的结果状态＝아/어 있다。'
});
const reviewedStateChangeItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=STATE_CHANGE[key];
  return Object.freeze({
    id,level:2,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:STATE_CHANGE_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(STATE_CHANGE_ORDER.map(choiceKey=>Object.freeze({
      meaning:STATE_CHANGE[choiceKey].meaning,
      explanationI18n:STATE_CHANGE[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】-게 되다=상황에 따른 새 행동, -아/어지다=성질·상태 변화, -고 있다=진행 중인 동작, -아/어 있다=끝난 동작의 결과 상태로 기준이 다릅니다.\n【재사용 풀이】${STATE_CHANGE_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】-게 되다＝状況による新しい行動、-아/어지다＝性質・状態の変化、-고 있다＝進行中の動作、-아/어 있다＝終わった動作の結果状態で、基準が異なります。\n【再利用できる解き方】${STATE_CHANGE_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] -게 되다 marks a new action due to circumstances, -아/어지다 a quality change, -고 있다 an action in progress, and -아/어 있다 a remaining result state.\n[Reusable method] ${STATE_CHANGE_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】-게 되다表示因情况而开始的新动作，-아/어지다表示性质或状态变化，-고 있다表示正在进行的动作，-아/어 있다表示动作结束后持续的结果状态，判断标准各不相同。\n【通用解法】${STATE_CHANGE_METHOD.zh}`
    })
  });
};

const CONDITION_RELATIONS=Object.freeze({
  eventCondition:Object.freeze({
    meaning:Object.freeze({ko:'앞일이 생기면 뒤의 지시를 실행',ja:'前のことが起きたら後の指示を実行',en:'do the instruction if the event occurs',zh:'前件发生时执行后面的指示'}),
    selected:Object.freeze({
      ko:'“-거든”은 앞 상황이 실제로 생길 때 뒤의 부탁이나 지시를 실행하라는 조건을 나타냅니다.',
      ja:'「-거든」は、前の状況が実際に起きたら、後ろの依頼・指示を実行するという条件を表します。',
      en:'“-거든” sets an event as the condition for carrying out the following request or instruction.',
      zh:'“-거든”表示前面的情况实际发生时，再执行后面的请求或指示。'
    })
  }),
  necessaryCondition:Object.freeze({
    meaning:Object.freeze({ko:'오직 앞 조건을 충족해야 뒤가 가능',ja:'前の条件を満たしてこそ後が可能',en:'only if the first condition is met',zh:'只有满足前项条件才可能'}),
    selected:Object.freeze({
      ko:'“-아/어야만”은 앞 조건이 반드시 충족되어야 뒤 결과가 가능함을 강조합니다.',
      ja:'「-아/어야만」は、前の条件を必ず満たして初めて後ろの結果が可能になることを強調します。',
      en:'“-아/어야만” emphasizes that the following result is possible only when the preceding condition is met.',
      zh:'“-아/어야만”强调必须满足前面的条件，后面的结果才有可能。'
    })
  }),
  hypotheticalCondition:Object.freeze({
    meaning:Object.freeze({ko:'아직 정해지지 않은 상황을 가정',ja:'まだ決まっていない状況を仮定',en:'suppose an undecided situation',zh:'假设尚未确定的情况'}),
    selected:Object.freeze({
      ko:'“-(으)ㄴ/는다면”은 아직 정해지지 않은 상황을 가정하고 그 경우를 생각합니다.',
      ja:'「-(으)ㄴ/는다면」は、まだ決まっていない状況を仮定し、その場合について考えます。',
      en:'“-(으)ㄴ/는다면” supposes an undecided situation and considers what would happen in that case.',
      zh:'“-(으)ㄴ/는다면”假设一个尚未确定的情况，并思考在这种情况下会怎样。'
    })
  }),
  warningCondition:Object.freeze({
    meaning:Object.freeze({ko:'지금 행동을 계속하면 나쁜 결과를 경고',ja:'今の行動を続けると悪い結果になると警告',en:'warn of a bad result if this continues',zh:'警告继续当前行为会有坏结果'}),
    selected:Object.freeze({
      ko:'“-다가는”은 지금과 같은 행동이 계속되면 좋지 않은 결과가 생길 수 있다고 경고합니다.',
      ja:'「-다가는」は、今のような行動を続けると、よくない結果になり得ると警告します。',
      en:'“-다가는” warns that continuing the current behavior may lead to an undesirable result.',
      zh:'“-다가는”警告如果继续当前的行为，可能会导致不好的结果。'
    })
  })
});
const CONDITION_RELATION_ORDER=['eventCondition','necessaryCondition','hypotheticalCondition','warningCondition'];
const CONDITION_RELATION_METHOD=Object.freeze({
  ko:'뒤 절의 역할을 먼저 보세요. 실제 발생 뒤 부탁·지시=거든, 반드시 충족할 조건=아/어야만, 미정 상황 가정=ㄴ/는다면, 계속할 때의 나쁜 결과 경고=다가는입니다.',
  ja:'後件の役割を先に見ます。実際に起きた後の依頼・指示＝거든、必須条件＝아/어야만、未定の状況の仮定＝ㄴ/는다면、続けた場合の悪い結果への警告＝다가는です。',
  en:'Check the following clause first: request after an actual event = 거든, required condition = 아/어야만, undecided hypothesis = ㄴ/는다면, and warning about a bad result from continuing = 다가는.',
  zh:'先看后句的作用：事情发生后的请求或指示＝거든，必要条件＝아/어야만，假设未定情况＝ㄴ/는다면，继续下去会有坏结果的警告＝다가는。'
});
const reviewedConditionRelationItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=CONDITION_RELATIONS[key];
  return Object.freeze({
    id,level:2,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:CONDITION_RELATION_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(CONDITION_RELATION_ORDER.map(choiceKey=>Object.freeze({
      meaning:CONDITION_RELATIONS[choiceKey].meaning,
      explanationI18n:CONDITION_RELATIONS[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】-거든=실제 발생 뒤 부탁·지시, -아/어야만=필수 조건, -(으)ㄴ/는다면=미정 상황 가정, -다가는=계속할 때의 나쁜 결과 경고로 기준이 다릅니다.\n【재사용 풀이】${CONDITION_RELATION_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】-거든＝実際に起きた後の依頼・指示、-아/어야만＝必須条件、-(으)ㄴ/는다면＝未定の状況の仮定、-다가는＝続けた場合の悪い結果への警告で、基準が異なります。\n【再利用できる解き方】${CONDITION_RELATION_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] -거든 sets an actual-event condition for a request, -아/어야만 a necessary condition, -(으)ㄴ/는다면 an undecided hypothesis, and -다가는 a warning about continuing behavior.\n[Reusable method] ${CONDITION_RELATION_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】-거든表示事情发生后执行请求或指示，-아/어야만表示必要条件，-(으)ㄴ/는다면表示假设未定情况，-다가는表示继续当前行为会产生坏结果的警告，判断标准各不相同。\n【通用解法】${CONDITION_RELATION_METHOD.zh}`
    })
  });
};

const COMPLETION_EXPERIENCE=Object.freeze({
  completeAll:Object.freeze({
    meaning:Object.freeze({ko:'남김없이 끝냄',ja:'すっかり完了する',en:'finish completely',zh:'彻底做完'}),
    selected:Object.freeze({
      ko:'“-아/어 버리다”는 행동이 남김없이 끝났음을 나타내며, 문맥에 따라 아쉬움이나 후련함이 더해질 수 있습니다.',
      ja:'「-아/어 버리다」は、行為がすっかり完了したことを表し、文脈によって残念さやすっきりした気持ちが加わります。',
      en:'“-아/어 버리다” marks an action as fully completed and can add regret or relief depending on context.',
      zh:'“-아/어 버리다”表示动作彻底完成，根据语境还可带有遗憾或轻松的语气。'
    })
  }),
  longProcessResult:Object.freeze({
    meaning:Object.freeze({ko:'긴 과정 뒤 결과',ja:'長い過程の末の結果',en:'result after a long process',zh:'漫长过程后的结果'}),
    selected:Object.freeze({
      ko:'“-(으)ㄴ 끝에”는 길거나 반복된 과정이 끝난 뒤 얻은 마지막 결과를 나타냅니다.',
      ja:'「-(으)ㄴ 끝에」は、長い、または繰り返された過程の末に得た最終結果を表します。',
      en:'“-(으)ㄴ 끝에” marks the final result reached after a long or repeated process.',
      zh:'“-(으)ㄴ 끝에”表示经过漫长或反复的过程后得到的最终结果。'
    })
  }),
  pastExperience:Object.freeze({
    meaning:Object.freeze({ko:'과거에 해 본 경험',ja:'過去にした経験',en:'past experience',zh:'过去做过的经历'}),
    selected:Object.freeze({
      ko:'“-아/어 본 적이 있다”는 과거에 그 행동을 경험한 일이 있음을 나타냅니다.',
      ja:'「-아/어 본 적이 있다」は、過去にその行為を経験したことがあると表します。',
      en:'“-아/어 본 적이 있다” says that the action has been experienced at some time in the past.',
      zh:'“-아/어 본 적이 있다”表示过去曾经有过做该动作的经历。'
    })
  }),
  preparedState:Object.freeze({
    meaning:Object.freeze({ko:'미리 해 둔 상태',ja:'前もってした状態',en:'prepare and keep ready',zh:'事先做好并保持'}),
    selected:Object.freeze({
      ko:'“-아/어 놓다”는 나중을 위해 행동을 미리 끝내고 그 결과 상태를 유지함을 나타냅니다.',
      ja:'「-아/어 놓다」は、後のために行為を前もって済ませ、その結果の状態を保つことを表します。',
      en:'“-아/어 놓다” means doing something in advance and keeping the resulting state for later.',
      zh:'“-아/어 놓다”表示为了之后先完成动作，并保持其结果状态。'
    })
  })
});
const COMPLETION_EXPERIENCE_ORDER=['completeAll','longProcessResult','pastExperience','preparedState'];
const COMPLETION_EXPERIENCE_METHOD=Object.freeze({
  ko:'끝난 뒤 무엇을 강조하는지 보세요. 남김없는 완료=버리다, 긴 과정의 마지막 결과=끝에, 과거 경험=본 적이 있다, 미리 준비해 둔 상태=놓다입니다.',
  ja:'終わった後に何を強調するかを見ます。完全な終了＝버리다、長い過程の最終結果＝끝에、過去の経験＝본 적이 있다、前もって準備した状態＝놓다です。',
  en:'Check what is emphasized after the action: total completion = 버리다, a final result after a long process = 끝에, past experience = 본 적이 있다, and a prepared state kept for later = 놓다.',
  zh:'看动作之后强调什么：彻底完成＝버리다，漫长过程的最终结果＝끝에，过去经历＝본 적이 있다，事先准备并保持状态＝놓다。'
});
const reviewedCompletionExperienceItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=COMPLETION_EXPERIENCE[key];
  return Object.freeze({
    id,level:2,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:COMPLETION_EXPERIENCE_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(COMPLETION_EXPERIENCE_ORDER.map(choiceKey=>Object.freeze({
      meaning:COMPLETION_EXPERIENCE[choiceKey].meaning,
      explanationI18n:COMPLETION_EXPERIENCE[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】-아/어 버리다=남김없는 완료, -(으)ㄴ 끝에=긴 과정 뒤의 마지막 결과, -아/어 본 적이 있다=과거 경험, -아/어 놓다=미리 준비해 유지하는 상태로 기준이 다릅니다.\n【재사용 풀이】${COMPLETION_EXPERIENCE_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】-아/어 버리다＝完全な終了、-(으)ㄴ 끝에＝長い過程の最終結果、-아/어 본 적이 있다＝過去の経験、-아/어 놓다＝前もって準備して保つ状態で、基準が異なります。\n【再利用できる解き方】${COMPLETION_EXPERIENCE_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] -아/어 버리다 marks total completion, -(으)ㄴ 끝에 a final result after a long process, -아/어 본 적이 있다 past experience, and -아/어 놓다 a prepared state kept for later.\n[Reusable method] ${COMPLETION_EXPERIENCE_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】-아/어 버리다表示彻底完成，-(으)ㄴ 끝에表示漫长过程后的最终结果，-아/어 본 적이 있다表示过去经历，-아/어 놓다表示事先准备并保持状态，判断标准各不相同。\n【通用解法】${COMPLETION_EXPERIENCE_METHOD.zh}`
    })
  });
};

const JUDGMENT_CONSTRAINT=Object.freeze({
  necessary:Object.freeze({
    meaning:Object.freeze({ko:'그 행동을 할 필요가 있음',ja:'～する必要がある',en:'need to do it',zh:'有必要那么做'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ 필요가 있다”는 목표나 조건을 위해 그 행동이 요구된다고 판단합니다.',
      ja:'「-(으)ㄹ 필요가 있다」は、目標や条件のために、その行動が必要だと判断します。',
      en:'“-(으)ㄹ 필요가 있다” judges that an action is required for a goal or condition.',
      zh:'“-(으)ㄹ 필요가 있다”表示为了目标或条件，需要采取该行动。'
    })
  }),
  unavoidable:Object.freeze({
    meaning:Object.freeze({ko:'다른 방법이 없어 그렇게 함',ja:'ほかに方法がなく～するしかない',en:'have no choice but to do it',zh:'别无选择，只能那么做'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ 수밖에 없다”는 다른 선택이나 방법이 남지 않아 그 행동을 피할 수 없음을 나타냅니다.',
      ja:'「-(으)ㄹ 수밖에 없다」は、ほかの選択肢や方法がなく、その行動を避けられないことを表します。',
      en:'“-(으)ㄹ 수밖에 없다” means no alternative remains, so the action cannot be avoided.',
      zh:'“-(으)ㄹ 수밖에 없다”表示没有其他选择或办法，只能采取该行动。'
    })
  }),
  unnecessary:Object.freeze({
    meaning:Object.freeze({ko:'그 행동을 다시 할 필요가 없음',ja:'～する必要がない',en:'do not need to do it',zh:'没有必要那么做'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ 필요가 없다”는 이미 충족되었거나 요구되지 않아 그 행동을 하지 않아도 됨을 나타냅니다.',
      ja:'「-(으)ㄹ 필요가 없다」は、すでに満たされているか要求されておらず、その行動をしなくてもよいことを表します。',
      en:'“-(으)ㄹ 필요가 없다” means an action is not required because the need is already met or absent.',
      zh:'“-(으)ㄹ 필요가 없다”表示需求已经满足或本来就不存在，因此不必采取该行动。'
    })
  }),
  worthwhile:Object.freeze({
    meaning:Object.freeze({ko:'해 볼 가치가 있음',ja:'～する価値がある',en:'be worth doing',zh:'值得一做'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ 만하다”는 어떤 행동이나 대상을 시도할 가치가 있거나 받아들일 만하다고 평가합니다.',
      ja:'「-(으)ㄹ 만하다」は、ある行動や対象に試す価値がある、または受け入れられると評価します。',
      en:'“-(으)ㄹ 만하다” evaluates an action or thing as worth trying or acceptable.',
      zh:'“-(으)ㄹ 만하다”评价某个行动或对象值得尝试，或可以接受。'
    })
  })
});
const JUDGMENT_CONSTRAINT_ORDER=['unavoidable','worthwhile','necessary','unnecessary'];
const JUDGMENT_CONSTRAINT_METHOD=Object.freeze({
  ko:'행동을 둘러싼 판단을 보세요. 선택지가 사라짐=수밖에 없다, 해 볼 가치=만하다, 해야 할 요구=필요가 있다, 이미 충족되어 하지 않아도 됨=필요가 없다입니다.',
  ja:'行動についての判断を見ます。選択肢がない＝수밖에 없다、試す価値＝만하다、する必要がある＝필요가 있다、すでに満たされていて不要＝필요가 없다です。',
  en:'Identify the judgment around the action: no alternative = 수밖에 없다, worth doing = 만하다, required = 필요가 있다, and already unnecessary = 필요가 없다.',
  zh:'先看对行动的判断：没有选择＝수밖에 없다，值得尝试＝만하다，需要做＝필요가 있다，需求已满足而不必做＝필요가 없다。'
});
const reviewedJudgmentConstraintItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=JUDGMENT_CONSTRAINT[key];
  return Object.freeze({
    id,level:2,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:JUDGMENT_CONSTRAINT_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(JUDGMENT_CONSTRAINT_ORDER.map(choiceKey=>Object.freeze({
      meaning:JUDGMENT_CONSTRAINT[choiceKey].meaning,
      explanationI18n:JUDGMENT_CONSTRAINT[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】-(으)ㄹ 수밖에 없다=다른 선택 없음, -(으)ㄹ 만하다=해 볼 가치, -(으)ㄹ 필요가 있다=해야 할 요구, -(으)ㄹ 필요가 없다=하지 않아도 됨으로 기준이 다릅니다.\n【재사용 풀이】${JUDGMENT_CONSTRAINT_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】-(으)ㄹ 수밖에 없다＝ほかに選択肢がない、-(으)ㄹ 만하다＝試す価値、-(으)ㄹ 필요가 있다＝する必要がある、-(으)ㄹ 필요가 없다＝しなくてもよいで、判断基準が異なります。\n【再利用できる解き方】${JUDGMENT_CONSTRAINT_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] -(으)ㄹ 수밖에 없다 marks no alternative, -(으)ㄹ 만하다 something worth doing, -(으)ㄹ 필요가 있다 a required action, and -(으)ㄹ 필요가 없다 an unnecessary action.\n[Reusable method] ${JUDGMENT_CONSTRAINT_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】-(으)ㄹ 수밖에 없다表示没有其他选择，-(으)ㄹ 만하다表示值得尝试，-(으)ㄹ 필요가 있다表示需要做，-(으)ㄹ 필요가 없다表示不必做，判断标准各不相同。\n【通用解法】${JUDGMENT_CONSTRAINT_METHOD.zh}`
    })
  });
};

const PLAN_STAGE=Object.freeze({
  intention:Object.freeze({
    meaning:Object.freeze({ko:'아직 정하지 않은 개인의 의향',ja:'まだ確定していない本人の意向',en:'a personal intention not yet fixed',zh:'尚未最终确定的个人意向'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ 생각이다”는 앞으로 그렇게 하려는 개인의 생각이나 의향을 나타냅니다.',
      ja:'「-(으)ㄹ 생각이다」は、これからそうしようとする本人の考え・意向を表します。',
      en:'“-(으)ㄹ 생각이다” expresses a person’s intention or idea about a future action.',
      zh:'“-(으)ㄹ 생각이다”表示本人今后打算采取某个行动的想法或意向。'
    })
  }),
  decision:Object.freeze({
    meaning:Object.freeze({ko:'논의·판단 뒤에 이미 내린 결정',ja:'話し合い・判断の後ですでに決めたこと',en:'a decision already made',zh:'经过讨论或判断后已经作出的决定'}),
    selected:Object.freeze({
      ko:'“-기로 하다”는 혼자 또는 함께 의논해 앞으로 할 일을 이미 결정했음을 나타냅니다.',
      ja:'「-기로 하다」は、一人で、または話し合って、これからすることをすでに決めたことを表します。',
      en:'“-기로 하다” means a future action has already been decided, individually or together.',
      zh:'“-기로 하다”表示个人或共同商议后，已经决定今后要做的事。'
    })
  }),
  tentative:Object.freeze({
    meaning:Object.freeze({ko:'아직 결정하지 않고 고민 중',ja:'まだ決めずに考えている段階',en:'still considering, not decided yet',zh:'尚未决定，仍在考虑'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ까 하다”는 아직 결정하지 않은 일을 할지 생각하거나 조심스럽게 제안하는 단계입니다.',
      ja:'「-(으)ㄹ까 하다」は、まだ決めていないことをしようかと考える、または控えめに提案する段階です。',
      en:'“-(으)ㄹ까 하다” marks a tentative thought about doing something that is not decided yet.',
      zh:'“-(으)ㄹ까 하다”表示还没决定，正在考虑是否要做某事。'
    })
  }),
  scheduled:Object.freeze({
    meaning:Object.freeze({ko:'날짜·계획표에 정해진 예정',ja:'日程・計画表で決まっている予定',en:'an event fixed on a schedule',zh:'按日期或日程已经安排好的计划'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ 예정이다”는 날짜나 계획에 따라 일이 진행되도록 예정되어 있음을 나타냅니다.',
      ja:'「-(으)ㄹ 예정이다」は、日付や計画に沿って行われる予定が決まっていることを表します。',
      en:'“-(으)ㄹ 예정이다” marks an event arranged to happen according to a date or schedule.',
      zh:'“-(으)ㄹ 예정이다”表示某件事已经按日期或计划安排进行。'
    })
  })
});
const PLAN_STAGE_ORDER=['intention','decision','tentative','scheduled'];
const PLAN_STAGE_METHOD=Object.freeze({
  ko:'계획이 어느 단계인지 보세요. 아직 고민=ㄹ까 하다, 개인 의향=생각이다, 이미 내린 결정=기로 하다, 날짜·일정 확정=예정이다입니다.',
  ja:'計画がどの段階かを見ます。まだ検討中＝ㄹ까 하다、本人の意向＝생각이다、決定済み＝기로 하다、日付・日程が確定＝예정이다です。',
  en:'Identify the plan stage: still considering = ㄹ까 하다, personal intention = 생각이다, decision already made = 기로 하다, fixed date or schedule = 예정이다.',
  zh:'先看计划处于哪个阶段：仍在考虑＝ㄹ까 하다，个人意向＝생각이다，已经决定＝기로 하다，日期或日程已确定＝예정이다。'
});
const reviewedPlanStageItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=PLAN_STAGE[key];
  return Object.freeze({
    id,level:2,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:PLAN_STAGE_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(PLAN_STAGE_ORDER.map(choiceKey=>Object.freeze({
      meaning:PLAN_STAGE[choiceKey].meaning,
      explanationI18n:PLAN_STAGE[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】-(으)ㄹ까 하다=아직 고민 중, -(으)ㄹ 생각이다=개인 의향, -기로 하다=이미 내린 결정, -(으)ㄹ 예정이다=확정된 일정으로 계획 단계가 다릅니다.\n【재사용 풀이】${PLAN_STAGE_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】-(으)ㄹ까 하다＝まだ検討中、-(으)ㄹ 생각이다＝本人の意向、-기로 하다＝決定済み、-(으)ㄹ 예정이다＝確定した日程で、計画の段階が異なります。\n【再利用できる解き方】${PLAN_STAGE_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] -(으)ㄹ까 하다 marks tentative consideration, -(으)ㄹ 생각이다 personal intention, -기로 하다 a decision already made, and -(으)ㄹ 예정이다 a fixed schedule.\n[Reusable method] ${PLAN_STAGE_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】-(으)ㄹ까 하다表示仍在考虑，-(으)ㄹ 생각이다表示个人意向，-기로 하다表示已经决定，-(으)ㄹ 예정이다表示确定的日程，计划阶段各不相同。\n【通用解法】${PLAN_STAGE_METHOD.zh}`
    })
  });
};

const TIME_RELATION=Object.freeze({
  immediate:Object.freeze({
    meaning:Object.freeze({ko:'첫 동작 직후 바로 이어짐',ja:'最初の動作の直後にすぐ続く',en:'the second action follows immediately',zh:'前一动作一结束就立刻进行后一动作'}),
    selected:Object.freeze({
      ko:'“-자마자”는 첫 동작이 끝난 직후 시간 간격 없이 다음 동작이 바로 이어짐을 나타냅니다.',
      ja:'「-자마자」は、最初の動作が終わった直後、間を置かず次の動作が続くことを表します。',
      en:'“-자마자” means the next action follows immediately after the first action ends.',
      zh:'“-자마자”表示前一动作一结束，后一动作就立刻发生。'
    })
  }),
  afterCompletion:Object.freeze({
    meaning:Object.freeze({ko:'첫 동작을 끝낸 뒤 다음 동작',ja:'最初の動作を終えてから次の動作',en:'the next action after completion',zh:'完成前一动作后再进行下一动作'}),
    selected:Object.freeze({
      ko:'“-고 나서”는 첫 동작을 마친 뒤에 다음 동작을 하는 순서를 나타냅니다.',
      ja:'「-고 나서」は、最初の動作を終えてから次の動作をする順序を表します。',
      en:'“-고 나서” marks the next action after the first action has been completed.',
      zh:'“-고 나서”表示完成前一动作之后，再进行下一动作。'
    })
  }),
  overlap:Object.freeze({
    meaning:Object.freeze({ko:'한 동작이 계속되는 시간에 다른 동작',ja:'一つの動作が続く間に別の動作',en:'another action during the same interval',zh:'一个动作持续期间同时进行另一个动作'}),
    selected:Object.freeze({
      ko:'“-는 동안”은 한 동작이 계속되는 시간에 다른 동작도 함께 일어남을 나타냅니다.',
      ja:'「-는 동안」は、一つの動作が続く時間に別の動作も起こることを表します。',
      en:'“-는 동안” marks another action happening during the same time interval.',
      zh:'“-는 동안”表示一个动作持续的期间，另一个动作也同时发生。'
    })
  }),
  before:Object.freeze({
    meaning:Object.freeze({ko:'첫 동작보다 앞서 하는 동작',ja:'最初の動作より前にすること',en:'an action before the first one',zh:'在前一动作之前进行的动作'}),
    selected:Object.freeze({
      ko:'“-기 전에”는 기준이 되는 동작보다 앞서 다른 동작을 함을 나타냅니다.',
      ja:'「-기 전에」は、基準となる動作より前に別の動作をすることを表します。',
      en:'“-기 전에” marks an action that happens before the reference action.',
      zh:'“-기 전에”表示在作为基准的动作之前，先进行另一个动作。'
    })
  })
});
const TIME_RELATION_ORDER=['immediate','afterCompletion','overlap','before'];
const TIME_RELATION_METHOD=Object.freeze({
  ko:'두 동작의 순서와 겹침을 보세요. 즉시 이어짐=자마자, 끝낸 뒤=고 나서, 같은 시간에 겹침=는 동안, 앞선 행동=기 전입니다.',
  ja:'二つの動作の順序と重なりを見ます。直後＝자마자、終えてから＝고 나서、同じ時間に重なる＝는 동안、前にする＝기 전です。',
  en:'Compare the order and overlap of the two actions: immediate = 자마자, after completion = 고 나서, overlapping interval = 는 동안, and before = 기 전.',
  zh:'比较两个动作的先后与重叠：立刻接续＝자마자，完成后＝고 나서，同时段重叠＝는 동안，之前＝기 전。'
});
const reviewedTimeRelationItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=TIME_RELATION[key];
  return Object.freeze({
    id,level:2,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:TIME_RELATION_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(TIME_RELATION_ORDER.map(choiceKey=>Object.freeze({
      meaning:TIME_RELATION[choiceKey].meaning,
      explanationI18n:TIME_RELATION[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】-자마자=직후 바로, -고 나서=끝낸 뒤, -는 동안=같은 시간에 겹침, -기 전에=기준 동작보다 앞서로 시간 관계가 다릅니다.\n【재사용 풀이】${TIME_RELATION_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】-자마자＝直後、-고 나서＝終えてから、-는 동안＝同じ時間に重なる、-기 전에＝前にすることで、時間関係が異なります。\n【再利用できる解き方】${TIME_RELATION_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] -자마자 means immediately after, -고 나서 after completion, -는 동안 during an overlapping interval, and -기 전에 before the reference action.\n[Reusable method] ${TIME_RELATION_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】-자마자表示紧接着，-고 나서表示完成之后，-는 동안表示同一时段重叠，-기 전에表示在基准动作之前，时间关系各不相同。\n【通用解法】${TIME_RELATION_METHOD.zh}`
    })
  });
};

const FORMAL_RELATION=Object.freeze({
  source:Object.freeze({
    meaning:Object.freeze({ko:'조사·발표 등 정보의 출처',ja:'調査・発表などの情報源',en:'source of reported information',zh:'调查或发布等信息的来源'}),
    selected:Object.freeze({
      ko:'“-에 따르면”은 뒤에 전하는 정보가 어디에서 나온 것인지 출처를 밝힙니다.',
      ja:'「-에 따르면」は、後ろで伝える情報がどこから出たのか、その情報源を示します。',
      en:'“-에 따르면” identifies the source from which the following information comes.',
      zh:'“-에 따르면”说明后面所传达的信息来自哪里。'
    })
  }),
  standard:Object.freeze({
    meaning:Object.freeze({ko:'기준·조건에 따라 결과가 달라짐',ja:'基準・条件によって結果が変わる',en:'result varying by a condition',zh:'结果随基准或条件而变化'}),
    selected:Object.freeze({
      ko:'“-에 따라(서)”는 앞의 기준이나 조건이 달라지면 뒤의 결과도 달라짐을 나타냅니다.',
      ja:'「-에 따라(서)」は、前の基準や条件が変わると後ろの結果も変わることを表します。',
      en:'“-에 따라(서)” means the result changes when the preceding standard or condition changes.',
      zh:'“-에 따라(서)”表示前面的基准或条件变化时，后面的结果也随之变化。'
    })
  }),
  channel:Object.freeze({
    meaning:Object.freeze({ko:'수단·경로를 거쳐 얻거나 실행함',ja:'手段・経路を通じて得る・行う',en:'means or channel used',zh:'通过某种手段或渠道获得、实施'}),
    selected:Object.freeze({
      ko:'“-을/를 통해(서)”는 어떤 수단이나 경로를 거쳐 배우거나 얻거나 실행함을 나타냅니다.',
      ja:'「-을/를 통해(서)」は、ある手段や経路を通じて学ぶ・得る・行うことを表します。',
      en:'“-을/를 통해(서)” marks the means or channel through which something is learned, obtained, or done.',
      zh:'“-을/를 통해(서)”表示通过某种手段或渠道学习、获得或实施。'
    })
  }),
  agent:Object.freeze({
    meaning:Object.freeze({ko:'피동문의 행위 주체·공식적 원인',ja:'受け身文の動作主・公的な原因',en:'passive agent or formal cause',zh:'被动句的施事者或正式原因'}),
    selected:Object.freeze({
      ko:'“-에 의해(서)”는 피동문에서 그 행동을 한 주체나 공식적으로 서술하는 원인을 나타냅니다.',
      ja:'「-에 의해(서)」は、受け身文でその動作をした主体、または改まって述べる原因を表します。',
      en:'“-에 의해(서)” marks the agent of a passive action or a cause stated in a formal style.',
      zh:'“-에 의해(서)”表示被动句中动作的施事者，或正式表述的原因。'
    })
  })
});
const FORMAL_RELATION_ORDER=['source','standard','channel','agent'];
const FORMAL_RELATION_METHOD=Object.freeze({
  ko:'앞 명사의 역할을 보세요. 정보가 나온 곳=따르면, 결과를 가르는 기준=따라서, 이용한 수단·경로=통해서, 피동 행동의 주체=의해서입니다.',
  ja:'前の名詞の役割を見ます。情報源＝따르면、結果を分ける基準＝따라서、使った手段・経路＝통해서、受け身動作の主体＝의해서です。',
  en:'Identify the role of the preceding noun: information source = 따르면, varying standard = 따라서, means or channel = 통해서, and passive agent = 의해서.',
  zh:'先判断前面名词的作用：信息来源＝따르면，决定结果的基准＝따라서，使用的手段或渠道＝통해서，被动动作的施事者＝의해서。'
});
const reviewedFormalRelationItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=FORMAL_RELATION[key];
  return Object.freeze({
    id,level:2,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:FORMAL_RELATION_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(FORMAL_RELATION_ORDER.map(choiceKey=>Object.freeze({
      meaning:FORMAL_RELATION[choiceKey].meaning,
      explanationI18n:FORMAL_RELATION[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】-에 따르면=정보 출처, -에 따라(서)=변화 기준, -을/를 통해(서)=수단·경로, -에 의해(서)=피동 주체·공식적 원인으로 앞 명사의 역할이 다릅니다.\n【재사용 풀이】${FORMAL_RELATION_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】-에 따르면＝情報源、-에 따라(서)＝変化の基準、-을/를 통해(서)＝手段・経路、-에 의해(서)＝受け身の主体・改まった原因で、前の名詞の役割が異なります。\n【再利用できる解き方】${FORMAL_RELATION_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] -에 따르면 marks an information source, -에 따라(서) a varying standard, -을/를 통해(서) a means or channel, and -에 의해(서) a passive agent or formal cause.\n[Reusable method] ${FORMAL_RELATION_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】-에 따르면表示信息来源，-에 따라(서)表示变化基准，-을/를 통해(서)表示手段或渠道，-에 의해(서)表示被动施事者或正式原因，前面名词的作用各不相同。\n【通用解法】${FORMAL_RELATION_METHOD.zh}`
    })
  });
};

const DEGREE_COMPARISON=Object.freeze({
  baseline:Object.freeze({
    meaning:Object.freeze({ko:'기준 대상과 비교한 차이',ja:'基準となる対象と比べた差',en:'a difference from an explicit baseline',zh:'与明确基准对象相比的差异'}),
    selected:Object.freeze({
      ko:'“-에 비해(서)”는 앞의 대상을 비교 기준으로 삼아 뒤 대상의 차이를 말합니다.',
      ja:'「-에 비해(서)」は、前の対象を比較の基準にして、後ろの対象との違いを述べます。',
      en:'“-에 비해(서)” sets the preceding item as the baseline and states how the following item differs.',
      zh:'“-에 비해(서)”把前面的对象作为比较基准，说明后面对象与它的差异。'
    })
  }),
  noLess:Object.freeze({
    meaning:Object.freeze({ko:'기준 대상에 뒤지지 않는 정도',ja:'基準となる対象に劣らない程度',en:'a degree not inferior to a reference',zh:'不逊于基准对象的程度'}),
    selected:Object.freeze({
      ko:'“-에 못지않게”는 뒤 대상의 정도가 앞의 기준 대상보다 뒤떨어지지 않음을 나타냅니다.',
      ja:'「-에 못지않게」は、後ろの対象の程度が前の基準となる対象に劣らないことを表します。',
      en:'“-에 못지않게” means the following item is not inferior in degree to the preceding reference.',
      zh:'“-에 못지않게”表示后面对象的程度不逊于前面的基准对象。'
    })
  }),
  equal:Object.freeze({
    meaning:Object.freeze({ko:'기준 대상과 같은 정도',ja:'基準となる対象と同じ程度',en:'the same degree as a reference',zh:'与基准对象相同的程度'}),
    selected:Object.freeze({
      ko:'“-만큼”은 앞의 대상을 기준으로 뒤 대상의 정도가 그와 같거나 맞먹음을 나타냅니다.',
      ja:'「-만큼」は、前の対象を基準に、後ろの対象の程度が同じくらいであることを表します。',
      en:'“-만큼” uses the preceding item as a reference and marks an equal or matching degree.',
      zh:'“-만큼”以前面的对象为基准，表示后面对象的程度与其相同或相当。'
    })
  }),
  extent:Object.freeze({
    meaning:Object.freeze({ko:'결과로 드러나는 매우 큰 정도',ja:'結果から分かる非常に大きな程度',en:'an extreme degree shown by its result',zh:'由结果体现出的很大程度'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ 정도로”는 뒤의 결과가 생길 만큼 앞의 상태나 행동 정도가 큼을 나타냅니다.',
      ja:'「-(으)ㄹ 정도로」は、後ろの結果が生じるほど、前の状態・動作の程度が大きいことを表します。',
      en:'“-(으)ㄹ 정도로” shows that the preceding state or action is strong enough to produce the following result.',
      zh:'“-(으)ㄹ 정도로”表示前面的状态或动作程度很大，足以产生后面的结果。'
    })
  })
});
const DEGREE_COMPARISON_ORDER=['baseline','noLess','equal','extent'];
const DEGREE_COMPARISON_METHOD=Object.freeze({
  ko:'문장 속 기준과 정도 관계를 보세요. 두 대상의 차이=비해서, 기준에 뒤지지 않음=못지않게, 같은 정도=만큼, 결과가 보여 주는 큰 정도=ㄹ 정도로입니다.',
  ja:'文中の基準と程度の関係を見ます。二つの対象の差＝비해서、基準に劣らない＝못지않게、同じ程度＝만큼、結果で分かる大きな程度＝ㄹ 정도로です。',
  en:'Find the reference and degree relation: difference between two items = 비해서, not inferior to the reference = 못지않게, equal degree = 만큼, and an extreme degree shown by a result = ㄹ 정도로.',
  zh:'先找句中的基准和程度关系：两个对象的差异＝비해서，不逊于基准＝못지않게，相同程度＝만큼，由结果体现的大程度＝ㄹ 정도로。'
});
const reviewedDegreeComparisonItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=DEGREE_COMPARISON[key];
  return Object.freeze({
    id,level:2,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:DEGREE_COMPARISON_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(DEGREE_COMPARISON_ORDER.map(choiceKey=>Object.freeze({
      meaning:DEGREE_COMPARISON[choiceKey].meaning,
      explanationI18n:DEGREE_COMPARISON[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】-에 비해(서)=두 대상의 차이, -에 못지않게=기준에 뒤지지 않음, -만큼=같은 정도, -(으)ㄹ 정도로=결과가 보여 주는 큰 정도로 관계가 다릅니다.\n【재사용 풀이】${DEGREE_COMPARISON_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】-에 비해(서)＝二つの対象の差、-에 못지않게＝基準に劣らない、-만큼＝同じ程度、-(으)ㄹ 정도로＝結果で分かる大きな程度で、関係が異なります。\n【再利用できる解き方】${DEGREE_COMPARISON_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] -에 비해(서) compares two items, -에 못지않게 means not inferior to a reference, -만큼 equal degree, and -(으)ㄹ 정도로 an extreme degree shown by a result.\n[Reusable method] ${DEGREE_COMPARISON_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】-에 비해(서)表示两个对象的差异，-에 못지않게表示不逊于基准，-만큼表示相同程度，-(으)ㄹ 정도로表示由结果体现出的很大程度，关系各不相同。\n【通用解法】${DEGREE_COMPARISON_METHOD.zh}`
    })
  });
};

const BASIC_CONNECTIVES=Object.freeze({
  simultaneous:Object.freeze({
    meaning:Object.freeze({ko:'두 행동이 같은 시간에 진행됨',ja:'二つの動作が同時に進む',en:'two actions happen at the same time',zh:'两个动作同时进行'}),
    selected:Object.freeze({
      ko:'“-(으)면서”는 한 사람이 두 행동을 같은 시간에 하고 있음을 나타냅니다.',
      ja:'「-(으)면서」は、一人が二つの動作を同時にしていることを表します。',
      en:'“-(으)면서” shows that the same person performs two actions at the same time.',
      zh:'“-(으)면서”表示同一个人同时进行两个动作。'
    })
  }),
  reason:Object.freeze({
    meaning:Object.freeze({ko:'앞 이유를 들어 뒤에서 판단·요청함',ja:'前に理由を示し、後ろで判断・依頼をする',en:'gives a reason for a judgment or request',zh:'先说明原因，再作判断或请求'}),
    selected:Object.freeze({
      ko:'“-(으)니까”는 앞 절을 이유로 제시하고 뒤에서 판단하거나 요청할 때 씁니다.',
      ja:'「-(으)니까」は、前の節を理由として示し、後ろで判断や依頼をするときに使います。',
      en:'“-(으)니까” presents the first clause as a reason for a judgment or request in the second.',
      zh:'“-(으)니까”把前句作为理由，用于后句的判断或请求。'
    })
  }),
  movementPurpose:Object.freeze({
    meaning:Object.freeze({ko:'이동하는 목적을 나타냄',ja:'移動する目的を表す',en:'marks the purpose of movement',zh:'表示移动的目的'}),
    selected:Object.freeze({
      ko:'“-(으)러”는 가다·오다 같은 이동 동사 앞에서 그 이동의 목적을 나타냅니다.',
      ja:'「-(으)러」は、가다・오다 などの移動動詞の前で、その移動の目的を表します。',
      en:'“-(으)러” comes before a movement verb such as 가다 or 오다 and marks the purpose of that movement.',
      zh:'“-(으)러”放在가다、오다等移动动词前，表示移动的目的。'
    })
  }),
  background:Object.freeze({
    meaning:Object.freeze({ko:'뒤말의 배경·상황을 먼저 제시함',ja:'後ろの内容の背景・状況を先に示す',en:'sets up background for what follows',zh:'先交代后项内容的背景或情况'}),
    selected:Object.freeze({
      ko:'“-는데”는 뒤에서 말할 결정이나 설명을 이해하는 데 필요한 현재 상황을 먼저 제시합니다.',
      ja:'「-는데」は、後ろの決定や説明を理解するために必要な現在の状況を先に示します。',
      en:'“-는데” first supplies the current situation needed to understand the decision or explanation that follows.',
      zh:'“-는데”先交代当前情况，为理解后面的决定或说明提供背景。'
    })
  })
});
const BASIC_CONNECTIVE_ORDER=['simultaneous','reason','movementPurpose','background'];
const BASIC_CONNECTIVE_METHOD=Object.freeze({
  ko:'두 절의 관계와 뒤 동사를 보세요. 동시 행동=(으)면서, 이유 뒤 판단·요청=(으)니까, 이동 목적=(으)러, 뒤말의 배경=는데입니다.',
  ja:'二つの節の関係と後ろの動詞を見ます。同時動作＝(으)면서、理由の後の判断・依頼＝(으)니까、移動目的＝(으)러、後ろの内容の背景＝는데です。',
  en:'Read the relation and the following verb: simultaneous actions = (으)면서, reason for a judgment or request = (으)니까, movement purpose = (으)러, and background for what follows = 는데.',
  zh:'结合分句关系和后面的动词判断：同时动作＝(으)면서，作为判断或请求的理由＝(으)니까，移动目的＝(으)러，后项背景＝는데。'
});
const reviewedBasicConnectiveItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=BASIC_CONNECTIVES[key];
  return Object.freeze({
    id,level:1,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:BASIC_CONNECTIVE_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(BASIC_CONNECTIVE_ORDER.map(choiceKey=>Object.freeze({
      meaning:BASIC_CONNECTIVES[choiceKey].meaning,
      explanationI18n:BASIC_CONNECTIVES[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】-(으)면서=동시 행동, -(으)니까=이유 뒤 판단·요청, -(으)러=이동 목적, -는데=뒤말의 배경으로 관계가 다릅니다.\n【재사용 풀이】${BASIC_CONNECTIVE_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】-(으)면서＝同時動作、-(으)니까＝理由の後の判断・依頼、-(으)러＝移動目的、-는데＝後ろの内容の背景で、関係が異なります。\n【再利用できる解き方】${BASIC_CONNECTIVE_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] -(으)면서 marks simultaneous actions, -(으)니까 a reason for a judgment or request, -(으)러 movement purpose, and -는데 background for what follows.\n[Reusable method] ${BASIC_CONNECTIVE_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】-(으)면서表示同时动作，-(으)니까表示判断或请求的理由，-(으)러表示移动目的，-는데表示后项背景，关系各不相同。\n【通用解法】${BASIC_CONNECTIVE_METHOD.zh}`
    })
  });
};

const BASIC_NEGATION=Object.freeze({
  general:Object.freeze({
    meaning:Object.freeze({ko:'행동·상태를 단순히 부정함',ja:'動作・状態の単純な否定（～しない）',en:'simple negation of an action or state',zh:'对动作或状态作一般否定'}),
    selected:Object.freeze({
      ko:'“안”은 용언 앞에서 그 행동을 하지 않거나 상태가 그렇지 않다고 단순히 부정합니다.',
      ja:'「안」は用言の前で、その動作をしないことや、その状態ではないことを単純に否定します。',
      en:'“안” comes before a predicate to simply negate an action or state.',
      zh:'“안”放在谓词前，单纯否定某个动作或状态。'
    })
  }),
  inability:Object.freeze({
    meaning:Object.freeze({ko:'능력·상황 때문에 할 수 없음',ja:'能力・状況のためできない',en:'cannot because of skill or situation',zh:'因能力或情况而无法做到'}),
    selected:Object.freeze({
      ko:'“못”은 의지가 아니라 능력이나 상황 때문에 동작을 할 수 없음을 나타냅니다.',
      ja:'「못」は意思ではなく、能力や状況のため動作ができないことを表します。',
      en:'“못” marks that an action is impossible because of ability or circumstances, not merely a choice not to act.',
      zh:'“못”表示并非出于意愿，而是因能力或情况无法完成动作。'
    })
  }),
  identity:Object.freeze({
    meaning:Object.freeze({ko:'명사의 정체·분류가 아님',ja:'名詞の身分・分類ではない（～ではない）',en:'not being the stated noun or category',zh:'不是该名词所指的身份或类别'}),
    selected:Object.freeze({
      ko:'“아니에요”는 명사 뒤의 이/가와 함께 그 정체나 분류가 아님을 나타냅니다.',
      ja:'「아니에요」は名詞に付く이/가とともに、その身分・分類ではないことを表します。',
      en:'“아니에요” follows a noun marked by 이/가 to deny an identity or category.',
      zh:'“아니에요”与名词后的이/가一起使用，否定其身份或类别。'
    })
  }),
  absence:Object.freeze({
    meaning:Object.freeze({ko:'사람·물건·시간 등이 존재하지 않음',ja:'人・物・時間などがない／いない',en:'absence of a person, thing, or time',zh:'人、物品或时间等不存在、没有'}),
    selected:Object.freeze({
      ko:'“없어요”는 사람이나 물건이 존재하지 않거나 가진 것이 없음을 나타냅니다.',
      ja:'「없어요」は、人や物が存在しないこと、または持っていないことを表します。',
      en:'“없어요” says that a person or thing does not exist or that something is not available or possessed.',
      zh:'“없어요”表示人或物不存在，或表示没有、未持有某物。'
    })
  })
});
const BASIC_NEGATION_ORDER=['general','inability','identity','absence'];
const BASIC_NEGATION_METHOD=Object.freeze({
  ko:'무엇을 부정하는지 먼저 보세요. 행동·상태의 단순 부정=안, 능력·상황상 불가능=못, 명사의 정체 부정=아니에요, 존재·소유의 부정=없어요입니다.',
  ja:'何を否定するかを先に見ます。動作・状態の単純否定＝안、能力・状況による不可能＝못、名詞の身分・分類の否定＝아니에요、存在・所有の否定＝없어요です。',
  en:'First identify what is negated: a simple action or state = 안, inability from skill or circumstances = 못, noun identity or category = 아니에요, existence or possession = 없어요.',
  zh:'先判断否定对象：一般动作或状态＝안，因能力或情况无法做到＝못，否定名词身份或类别＝아니에요，否定存在或拥有＝없어요。'
});
const reviewedBasicNegationItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=BASIC_NEGATION[key];
  return Object.freeze({
    id,level:1,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:BASIC_NEGATION_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(BASIC_NEGATION_ORDER.map(choiceKey=>Object.freeze({
      meaning:BASIC_NEGATION[choiceKey].meaning,
      explanationI18n:BASIC_NEGATION[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】안=단순 부정, 못=불가능, 아니에요=명사 정체 부정, 없어요=존재·소유 부정으로 부정하는 대상과 이유가 다릅니다.\n【재사용 풀이】${BASIC_NEGATION_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】안＝単純否定、못＝不可能、아니에요＝名詞の身分・分類の否定、없어요＝存在・所有の否定で、否定する対象と理由が異なります。\n【再利用できる解き方】${BASIC_NEGATION_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] 안 is simple negation, 못 marks inability, 아니에요 denies noun identity or category, and 없어요 denies existence or possession.\n[Reusable method] ${BASIC_NEGATION_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】안表示一般否定，못表示无法做到，아니에요否定名词身份或类别，없어요否定存在或拥有，否定对象和原因各不相同。\n【通用解法】${BASIC_NEGATION_METHOD.zh}`
    })
  });
};

const BASIC_TENSE=Object.freeze({
  presentHabit:Object.freeze({
    meaning:Object.freeze({ko:'반복되는 현재 습관',ja:'今の習慣・繰り返し',en:'a present habit or routine',zh:'当前的习惯或反复动作'}),
    selected:Object.freeze({
      ko:'“-아/어요”는 “매일”처럼 반복되는 현재의 습관이나 일반적인 일을 말할 수 있습니다.',
      ja:'「-아/어요」は、「毎日」のように繰り返す現在の習慣や一般的なことを表せます。',
      en:'“-아/어요” can describe a present habit or routine repeated regularly, such as every day.',
      zh:'“-아/어요”可以表示像“每天”这样反复进行的当前习惯或一般情况。'
    })
  }),
  completedPast:Object.freeze({
    meaning:Object.freeze({ko:'이미 끝난 과거의 일',ja:'すでに終わった過去の出来事',en:'an action completed in the past',zh:'已经结束的过去动作'}),
    selected:Object.freeze({
      ko:'“-았/었어요”는 “어제”처럼 과거에 일어나 이미 끝난 일을 나타냅니다.',
      ja:'「-았/었어요」は、「昨日」のように過去に起きてすでに終わったことを表します。',
      en:'“-았/었어요” marks an action that happened and finished in the past, such as yesterday.',
      zh:'“-았/었어요”表示像“昨天”那样发生在过去并已经结束的动作。'
    })
  }),
  ongoingNow:Object.freeze({
    meaning:Object.freeze({ko:'지금 진행 중인 동작',ja:'今している途中の動作',en:'an action in progress now',zh:'现在正在进行的动作'}),
    selected:Object.freeze({
      ko:'“-고 있어요”는 “지금” 하는 동작이 아직 진행 중임을 나타냅니다.',
      ja:'「-고 있어요」は、「今」している動作がまだ進行中であることを表します。',
      en:'“-고 있어요” marks an action that is still in progress right now.',
      zh:'“-고 있어요”表示“现在”正在进行、尚未结束的动作。'
    })
  }),
  futurePlan:Object.freeze({
    meaning:Object.freeze({ko:'앞으로 할 계획',ja:'これからする予定',en:'a plan for the future',zh:'今后要做的计划'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ 거예요”는 “내일”처럼 앞으로 하려는 계획이나 미래의 일을 나타냅니다.',
      ja:'「-(으)ㄹ 거예요」は、「明日」のようにこれからする予定や未来のことを表します。',
      en:'“-(으)ㄹ 거예요” marks a future plan or something expected to happen, such as tomorrow.',
      zh:'“-(으)ㄹ 거예요”表示像“明天”那样今后要做的计划或未来的事情。'
    })
  })
});
const BASIC_TENSE_ORDER=['presentHabit','completedPast','ongoingNow','futurePlan'];
const BASIC_TENSE_METHOD=Object.freeze({
  ko:'시간 단서를 먼저 찾으세요. 매일·보통=현재 습관, 어제·지난주=완료 과거, 지금·하는 중=진행, 내일·다음 주=미래 계획입니다.',
  ja:'時間の手掛かりを先に探します。毎日・普段＝現在の習慣、昨日・先週＝完了した過去、今・途中＝進行、明日・来週＝未来の予定です。',
  en:'Find the time cue first: every day or usually = present habit, yesterday or last week = completed past, now or in progress = ongoing, tomorrow or next week = future plan.',
  zh:'先找时间线索：每天或平时＝当前习惯，昨天或上周＝完成的过去，现在或正在＝进行中，明天或下周＝未来计划。'
});
const reviewedBasicTenseItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=BASIC_TENSE[key];
  return Object.freeze({
    id,level:1,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:BASIC_TENSE_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(BASIC_TENSE_ORDER.map(choiceKey=>Object.freeze({
      meaning:BASIC_TENSE[choiceKey].meaning,
      explanationI18n:BASIC_TENSE[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】-아/어요=현재 습관, -았/었어요=완료 과거, -고 있어요=현재 진행, -(으)ㄹ 거예요=미래 계획으로 시간 기준이 다릅니다.\n【재사용 풀이】${BASIC_TENSE_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】-아/어요＝現在の習慣、-았/었어요＝完了した過去、-고 있어요＝現在進行、-(으)ㄹ 거예요＝未来の予定で、時間の基準が異なります。\n【再利用できる解き方】${BASIC_TENSE_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] -아/어요 marks a present habit, -았/었어요 a completed past action, -고 있어요 an action in progress now, and -(으)ㄹ 거예요 a future plan.\n[Reusable method] ${BASIC_TENSE_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】-아/어요表示当前习惯，-았/었어요表示完成的过去，-고 있어요表示现在进行，-(으)ㄹ 거예요表示未来计划，时间基准各不相同。\n【通用解法】${BASIC_TENSE_METHOD.zh}`
    })
  });
};

const POLITE_INTERACTION=Object.freeze({
  objectRequest:Object.freeze({
    meaning:Object.freeze({ko:'물건을 달라고 정중하게 부탁함',ja:'物を求める丁寧な依頼（～をください）',en:'politely asking for an item',zh:'礼貌地请求对方给某物'}),
    selected:Object.freeze({
      ko:'“주세요”는 명사 뒤에서 상대에게 그 물건을 달라고 정중하게 부탁합니다.',
      ja:'「주세요」は名詞の後で、相手にその物を求める丁寧な依頼を表します。',
      en:'“주세요” after a noun politely asks the listener to give that item.',
      zh:'“주세요”接在名词后，礼貌地请求对方给出该物品。'
    })
  }),
  actionRequest:Object.freeze({
    meaning:Object.freeze({ko:'상대에게 행동을 정중하게 요청함',ja:'相手に行動を丁寧に求める（～してください）',en:'politely asking someone to do an action',zh:'礼貌地请对方做某个动作'}),
    selected:Object.freeze({
      ko:'“-(으)세요”는 듣는 사람에게 어떤 행동을 하도록 정중하게 요청하거나 안내합니다.',
      ja:'「-(으)세요」は、聞き手にある行動をするよう丁寧に求めたり案内したりします。',
      en:'“-(으)세요” politely asks or directs the listener to do an action.',
      zh:'“-(으)세요”礼貌地请求或指引听话者做某个动作。'
    })
  }),
  prohibition:Object.freeze({
    meaning:Object.freeze({ko:'어떤 행동을 하지 말라고 정중하게 요청함',ja:'行動をしないよう丁寧に求める（～しないでください）',en:'politely asking someone not to act',zh:'礼貌地请对方不要做某个动作'}),
    selected:Object.freeze({
      ko:'“-지 마세요”는 듣는 사람에게 그 행동을 하지 말라고 정중하게 요청합니다.',
      ja:'「-지 마세요」は、聞き手にその行動をしないよう丁寧に求めます。',
      en:'“-지 마세요” politely asks the listener not to do an action.',
      zh:'“-지 마세요”礼貌地请求听话者不要做某个动作。'
    })
  }),
  suggestion:Object.freeze({
    meaning:Object.freeze({ko:'함께 할 행동을 제안함',ja:'一緒にする行動を提案する（～しましょうか）',en:'suggesting an action to do together',zh:'提议一起做某个动作'}),
    selected:Object.freeze({
      ko:'“-(으)ㄹ까요?”는 화자와 듣는 사람이 함께 할 행동을 제안할 때 쓸 수 있습니다.',
      ja:'「-(으)ㄹ까요？」は、話し手と聞き手が一緒にする行動を提案するときに使えます。',
      en:'“-(으)ㄹ까요?” can suggest an action for the speaker and listener to do together.',
      zh:'“-(으)ㄹ까요？”可以用来提议说话者和听话者一起做某个动作。'
    })
  })
});
const POLITE_INTERACTION_ORDER=['objectRequest','actionRequest','prohibition','suggestion'];
const POLITE_INTERACTION_METHOD=Object.freeze({
  ko:'말하는 목적을 먼저 보세요. 명사 뒤 물건 요청=주세요, 행동 요청=-(으)세요, 하지 말라는 금지=-지 마세요, 함께하자는 제안=-(으)ㄹ까요?입니다.',
  ja:'発話の目的を先に見ます。名詞の後で物を求める＝주세요、行動を求める＝-(으)세요、禁止＝-지 마세요、一緒にする提案＝-(으)ㄹ까요？です。',
  en:'Identify the speech goal first: 주세요 after a noun requests an item, -(으)세요 requests an action, -지 마세요 prohibits an action, and -(으)ㄹ까요? suggests doing something together.',
  zh:'先判断说话目的：名词后用주세요请求物品，-(으)세요请求动作，-지 마세요表示禁止，-(으)ㄹ까요？提议一起行动。'
});
const reviewedPoliteInteractionItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=POLITE_INTERACTION[key];
  return Object.freeze({
    id,level:1,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:POLITE_INTERACTION_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(POLITE_INTERACTION_ORDER.map(choiceKey=>Object.freeze({
      meaning:POLITE_INTERACTION[choiceKey].meaning,
      explanationI18n:POLITE_INTERACTION[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】주세요=물건 요청, -(으)세요=행동 요청, -지 마세요=금지, -(으)ㄹ까요?=함께할 행동 제안으로 말하는 목적이 다릅니다.\n【재사용 풀이】${POLITE_INTERACTION_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】주세요＝物の依頼、-(으)세요＝行動の依頼、-지 마세요＝禁止、-(으)ㄹ까요？＝一緒にする行動の提案で、発話の目的が異なります。\n【再利用できる解き方】${POLITE_INTERACTION_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] 주세요 requests an item, -(으)세요 requests an action, -지 마세요 prohibits an action, and -(으)ㄹ까요? suggests doing an action together.\n[Reusable method] ${POLITE_INTERACTION_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】주세요用于请求物品，-(으)세요用于请求动作，-지 마세요表示禁止，-(으)ㄹ까요？表示提议一起行动，说话目的各不相同。\n【通用解法】${POLITE_INTERACTION_METHOD.zh}`
    })
  });
};

const LOCATION_WORDS=Object.freeze({
  opposite:Object.freeze({
    meaning:Object.freeze({ko:'길·공간의 반대쪽',ja:'道・空間の向こう側',en:'opposite side',zh:'道路或空间的对面'}),
    selected:Object.freeze({
      ko:'“건너편”은 길이나 열린 공간을 건너 마주 보는 반대쪽입니다.',
      ja:'「건너편」は、道や空間を挟んで向かい合う反対側です。',
      en:'“건너편” is the opposite side across a road or open space.',
      zh:'“건너편”指隔着道路或空间相对的另一边。'
    })
  }),
  nextTo:Object.freeze({
    meaning:Object.freeze({ko:'바로 곁',ja:'すぐ隣・横',en:'right next to',zh:'紧挨着；旁边'}),
    selected:Object.freeze({
      ko:'“옆”은 한 기준점의 바로 곁이나 좌우에 붙은 위치입니다.',
      ja:'「옆」は、一つの基準となる場所のすぐ隣・横です。',
      en:'“옆” is directly beside one reference point.',
      zh:'“옆”指紧挨着一个参照地点的旁边。'
    })
  }),
  between:Object.freeze({
    meaning:Object.freeze({ko:'둘의 가운데',ja:'二つの間',en:'between two places',zh:'两者之间'}),
    selected:Object.freeze({
      ko:'“사이”는 두 기준점의 가운데에 있는 위치입니다.',
      ja:'「사이」は、二つの基準となる場所の間にある位置です。',
      en:'“사이” is a position between two reference points.',
      zh:'“사이”指位于两个参照地点之间的位置。'
    })
  }),
  nearby:Object.freeze({
    meaning:Object.freeze({ko:'가까운 주변',ja:'近く・周辺',en:'nearby area',zh:'附近一带'}),
    selected:Object.freeze({
      ko:'“근처”는 바로 붙어 있지 않아도 기준점에서 가까운 주변입니다.',
      ja:'「근처」は、すぐ隣でなくても基準となる場所から近い周辺です。',
      en:'“근처” is the nearby area, not necessarily directly beside the reference point.',
      zh:'“근처”指参照地点附近的一带，不一定紧挨着。'
    })
  })
});
const LOCATION_ORDER=['opposite','nextTo','between','nearby'];
const LOCATION_METHOD=Object.freeze({
  ko:'기준점 수와 거리를 보세요. 길 너머 반대쪽=건너편, 한 곳 바로 곁=옆, 두 곳 가운데=사이, 정확한 옆이 아닌 가까운 주변=근처입니다.',
  ja:'基準となる場所の数と距離を見ます。道の向こう側＝건너편、一か所のすぐ隣＝옆、二か所の間＝사이、すぐ隣とは限らない近い周辺＝근처です。',
  en:'Check the number of reference points and distance: across a road = 건너편, directly beside one place = 옆, between two places = 사이, nearby but not necessarily adjacent = 근처.',
  zh:'看参照地点的数量和距离：隔路相对＝건너편，紧挨一处＝옆，两处中间＝사이，不一定紧挨的附近＝근처。'
});
const reviewedLocationItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=LOCATION_WORDS[key];
  return Object.freeze({
    id,level:1,type:'word',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:LOCATION_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(LOCATION_ORDER.map(choiceKey=>Object.freeze({
      meaning:LOCATION_WORDS[choiceKey].meaning,
      explanationI18n:LOCATION_WORDS[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】건너편=길·공간 너머 반대쪽, 옆=한 곳 바로 곁, 사이=두 곳 가운데, 근처=가까운 주변으로 기준점과 거리가 다릅니다.\n【재사용 풀이】${LOCATION_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】건너편＝道・空間の向こう側、옆＝一か所のすぐ隣、사이＝二か所の間、근처＝近い周辺で、基準となる場所と距離が異なります。\n【再利用できる解き方】${LOCATION_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] 건너편 is across a road or space, 옆 directly beside one place, 사이 between two places, and 근처 the nearby area.\n[Reusable method] ${LOCATION_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】건너편是隔着道路或空间的对面，옆是一处旁边，사이是两处中间，근처是附近一带，参照地点和距离各不相同。\n【通用解法】${LOCATION_METHOD.zh}`
    })
  });
};

const FREQUENCY_WORDS=Object.freeze({
  always:Object.freeze({
    meaning:Object.freeze({ko:'매번 빠짐없이',ja:'いつも；毎回',en:'always; every time',zh:'总是；每次'}),
    selected:Object.freeze({
      ko:'“항상”은 예외 없이 매번 같은 일이 일어남을 나타냅니다.',
      ja:'「항상」は、例外なく毎回同じことが起こることを表します。',
      en:'“항상” means the same thing happens every time, without an exception.',
      zh:'“항상”表示没有例外，每次都会发生同样的事情。'
    })
  }),
  often:Object.freeze({
    meaning:Object.freeze({ko:'횟수가 많게',ja:'よく；頻繁に',en:'often; frequently',zh:'经常；频繁'}),
    selected:Object.freeze({
      ko:'“자주”는 어떤 일이 여러 번, 높은 빈도로 일어남을 나타냅니다.',
      ja:'「자주」は、あることが何度も高い頻度で起こることを表します。',
      en:'“자주” means something happens many times or with high frequency.',
      zh:'“자주”表示某事发生很多次、频率较高。'
    })
  }),
  sometimes:Object.freeze({
    meaning:Object.freeze({ko:'때때로; 어떤 때에는',ja:'時々；たまに',en:'sometimes; occasionally',zh:'有时；偶尔'}),
    selected:Object.freeze({
      ko:'“가끔”은 늘 그렇지는 않고 어떤 때에만 일이 일어남을 나타냅니다.',
      ja:'「가끔」は、いつもではなく、ある時だけ起こることを表します。',
      en:'“가끔” means something happens on some occasions, but not regularly.',
      zh:'“가끔”表示并非总是如此，只在有些时候发生。'
    })
  }),
  notAtAll:Object.freeze({
    meaning:Object.freeze({ko:'부정문에서 조금도 아님',ja:'否定とともに「まったく～ない」',en:'not at all (with a negative)',zh:'与否定搭配，完全不'}),
    selected:Object.freeze({
      ko:'“전혀”는 “안·못·없다” 같은 부정 표현과 함께 정도나 횟수가 조금도 없음을 강조합니다.',
      ja:'「전혀」は「안・못・없다」などの否定表現とともに使い、程度や回数がまったくないことを強調します。',
      en:'“전혀” combines with a negative such as 안, 못, or 없다 to stress “not at all.”',
      zh:'“전혀”与“안、못、없다”等否定表达搭配，强调程度或次数完全为零。'
    })
  })
});
const FREQUENCY_ORDER=['always','often','sometimes','notAtAll'];
const FREQUENCY_METHOD=Object.freeze({
  ko:'빈도를 먼저 나누세요. 예외 없이 매번=항상, 횟수가 많음=자주, 어떤 때에만=가끔, 부정 표현과 함께 0회·0정도=전혀입니다.',
  ja:'頻度を先に分けます。例外なく毎回＝항상、高い頻度＝자주、ある時だけ＝가끔、否定表現とともに0回・0程度＝전혀です。',
  en:'Classify the frequency first: every time = 항상, high frequency = 자주, on some occasions = 가끔, and zero with a negative expression = 전혀.',
  zh:'先判断频率：每次无例外＝항상，频率高＝자주，有时才发生＝가끔，与否定搭配表示零次或零程度＝전혀。'
});
const reviewedFrequencyItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=FREQUENCY_WORDS[key];
  return Object.freeze({
    id,level:1,type:'word',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:FREQUENCY_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(FREQUENCY_ORDER.map(choiceKey=>Object.freeze({
      meaning:FREQUENCY_WORDS[choiceKey].meaning,
      explanationI18n:FREQUENCY_WORDS[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】항상=매번, 자주=높은 빈도, 가끔=어떤 때에만, 전혀=부정 표현과 함께 0회·0정도로 빈도가 다릅니다.\n【재사용 풀이】${FREQUENCY_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】항상＝毎回、자주＝高い頻度、가끔＝ある時だけ、전혀＝否定表現とともに0回・0程度で、頻度が異なります。\n【再利用できる解き方】${FREQUENCY_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] 항상 means every time, 자주 high frequency, 가끔 some occasions, and 전혀 zero frequency or degree with a negative expression.\n[Reusable method] ${FREQUENCY_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】항상表示每次，자주表示高频，가끔表示有时，전혀与否定搭配表示零次或零程度，频率各不相同。\n【通用解法】${FREQUENCY_METHOD.zh}`
    })
  });
};

const QUESTION_WORDS=Object.freeze({
  person:Object.freeze({
    meaning:Object.freeze({ko:'사람을 물음',ja:'人を尋ねる「だれ」',en:'who; asks about a person',zh:'询问人物：谁'}),
    selected:Object.freeze({
      ko:'“누구”는 이름이나 관계를 모르는 사람을 물을 때 씁니다.',
      ja:'「누구」は、名前や関係が分からない人を尋ねるときに使います。',
      en:'“누구” asks who a person is when their name or relationship is unknown.',
      zh:'“누구”用于询问姓名或关系不清楚的人。'
    })
  }),
  place:Object.freeze({
    meaning:Object.freeze({ko:'장소를 물음',ja:'場所を尋ねる「どこ」',en:'where; asks about a place',zh:'询问地点：哪里'}),
    selected:Object.freeze({
      ko:'“어디”는 위치나 가고 오는 장소를 물을 때 씁니다.',
      ja:'「어디」は、位置や行き来する場所を尋ねるときに使います。',
      en:'“어디” asks about a location or a place someone goes to or comes from.',
      zh:'“어디”用于询问位置或往来的地点。'
    })
  }),
  time:Object.freeze({
    meaning:Object.freeze({ko:'시간을 물음',ja:'時を尋ねる「いつ」',en:'when; asks about time',zh:'询问时间：什么时候'}),
    selected:Object.freeze({
      ko:'“언제”는 일이 일어나는 날이나 시각을 물을 때 씁니다.',
      ja:'「언제」は、物事が起こる日や時刻を尋ねるときに使います。',
      en:'“언제” asks for the day or time when something happens.',
      zh:'“언제”用于询问事情发生的日期或时刻。'
    })
  }),
  price:Object.freeze({
    meaning:Object.freeze({ko:'가격·금액을 물음',ja:'値段・金額を尋ねる「いくら」',en:'how much; asks about a price or amount',zh:'询问价格或金额：多少钱'}),
    selected:Object.freeze({
      ko:'“얼마”는 물건의 가격이나 돈의 액수를 물을 때 씁니다.',
      ja:'「얼마」は、品物の値段やお金の金額を尋ねるときに使います。',
      en:'“얼마” asks for the price of an item or an amount of money.',
      zh:'“얼마”用于询问物品价格或钱的数额。'
    })
  })
});
const QUESTION_WORD_ORDER=['person','place','time','price'];
const QUESTION_WORD_METHOD=Object.freeze({
  ko:'묻는 대상을 먼저 보세요. 사람=누구, 장소=어디, 날·시각=언제, 가격·금액=얼마입니다.',
  ja:'何を尋ねるかを先に見ます。人＝누구、場所＝어디、日・時刻＝언제、値段・金額＝얼마です。',
  en:'Identify what is being asked: person = 누구, place = 어디, day or time = 언제, and price or amount = 얼마.',
  zh:'先看询问对象：人物＝누구，地点＝어디，日期或时刻＝언제，价格或金额＝얼마。'
});
const reviewedQuestionWordItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=QUESTION_WORDS[key];
  return Object.freeze({
    id,level:1,type:'word',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:QUESTION_WORD_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(QUESTION_WORD_ORDER.map(choiceKey=>Object.freeze({
      meaning:QUESTION_WORDS[choiceKey].meaning,
      explanationI18n:QUESTION_WORDS[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】누구=사람, 어디=장소, 언제=날·시각, 얼마=가격·금액으로 묻는 대상이 다릅니다.\n【재사용 풀이】${QUESTION_WORD_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】누구＝人、어디＝場所、언제＝日・時刻、얼마＝値段・金額で、尋ねる対象が異なります。\n【再利用できる解き方】${QUESTION_WORD_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] 누구 asks about a person, 어디 a place, 언제 a day or time, and 얼마 a price or amount.\n[Reusable method] ${QUESTION_WORD_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】누구问人物，어디问地点，언제问日期或时刻，얼마问价格或金额，询问对象各不相同。\n【通用解法】${QUESTION_WORD_METHOD.zh}`
    })
  });
};

const PARTICLE_ROLES=Object.freeze({
  destination:Object.freeze({
    meaning:Object.freeze({ko:'이동이 끝나는 곳',ja:'移動の到着点（～へ／～に）',en:'destination of movement',zh:'移动的目的地'}),
    selected:Object.freeze({
      ko:'“에”는 가다·오다 같은 이동 동사와 함께 도착하는 장소를 나타냅니다.',
      ja:'「에」は、가다・오다 などの移動動詞とともに、到着する場所を表します。',
      en:'“에” marks the destination reached with a movement verb such as 가다 or 오다.',
      zh:'“에”与가다、오다等移动动词搭配，表示到达的地点。'
    })
  }),
  actionPlace:Object.freeze({
    meaning:Object.freeze({ko:'행동이 일어나는 곳',ja:'動作が行われる場所（～で）',en:'place where an action happens',zh:'动作发生的场所'}),
    selected:Object.freeze({
      ko:'“에서”는 공부하다·먹다처럼 실제 행동이 일어나는 장소를 나타냅니다.',
      ja:'「에서」は、공부하다・먹다 のような実際の動作が行われる場所を表します。',
      en:'“에서” marks the place where an action such as studying or eating happens.',
      zh:'“에서”表示공부하다、먹다等实际动作发生的场所。'
    })
  }),
  means:Object.freeze({
    meaning:Object.freeze({ko:'이동 수단·방법',ja:'手段・方法（～で）',en:'means or method',zh:'手段或方法'}),
    selected:Object.freeze({
      ko:'“(으)로”는 버스·지하철처럼 행동에 사용하는 수단이나 방법을 나타냅니다.',
      ja:'「(으)로」は、バス・地下鉄など、動作に使う手段や方法を表します。',
      en:'“(으)로” marks the means or method used for an action, such as a bus or subway.',
      zh:'“(으)로”表示做某事所用的手段或方法，例如公交车、地铁。'
    })
  }),
  recipient:Object.freeze({
    meaning:Object.freeze({ko:'사람인 받는 대상',ja:'人である受け手（～に）',en:'person receiving something',zh:'人的接受对象'}),
    selected:Object.freeze({
      ko:'“에게”는 주다·말하다 같은 행동이 향하는 사람을 나타냅니다.',
      ja:'「에게」は、주다・말하다 などの動作が向かう人を表します。',
      en:'“에게” marks the person toward whom an action such as giving or speaking is directed.',
      zh:'“에게”表示주다、말하다等动作所指向的人。'
    })
  })
});
const PARTICLE_ROLE_ORDER=['destination','actionPlace','means','recipient'];
const PARTICLE_ROLE_METHOD=Object.freeze({
  ko:'동사와 명사의 역할을 함께 보세요. 이동의 도착점=에, 행동 장소=에서, 수단·방법=(으)로, 행동을 받는 사람=에게입니다.',
  ja:'動詞と名詞の役割を一緒に見ます。移動の到着点＝에、動作の場所＝에서、手段・方法＝(으)로、動作を受ける人＝에게 です。',
  en:'Read the verb and the noun role together: destination = 에, action location = 에서, means or method = (으)로, and human recipient = 에게.',
  zh:'结合动词和名词的作用判断：移动目的地＝에，动作场所＝에서，手段或方法＝(으)로，动作的接受者＝에게。'
});
const reviewedParticleItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=PARTICLE_ROLES[key];
  return Object.freeze({
    id,level:1,type:'grammar',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:PARTICLE_ROLE_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(PARTICLE_ROLE_ORDER.map(choiceKey=>Object.freeze({
      meaning:PARTICLE_ROLES[choiceKey].meaning,
      explanationI18n:PARTICLE_ROLES[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】에=이동 도착점, 에서=행동 장소, (으)로=수단·방법, 에게=사람인 받는 대상으로 명사의 역할이 다릅니다.\n【재사용 풀이】${PARTICLE_ROLE_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】에＝移動の到着点、에서＝動作の場所、(으)로＝手段・方法、에게＝人である受け手で、名詞の役割が異なります。\n【再利用できる解き方】${PARTICLE_ROLE_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] 에 marks a destination, 에서 an action location, (으)로 a means or method, and 에게 a human recipient.\n[Reusable method] ${PARTICLE_ROLE_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】에表示移动目的地，에서表示动作场所，(으)로表示手段或方法，에게表示人的接受对象，名词的作用各不相同。\n【通用解法】${PARTICLE_ROLE_METHOD.zh}`
    })
  });
};

const DEMONSTRATIVES=Object.freeze({
  speaker:Object.freeze({
    meaning:Object.freeze({ko:'화자 가까이에 있는 물건',ja:'話し手の近くの物（これ）',en:'object near the speaker (this)',zh:'靠近说话者的物品（这个）'}),
    selected:Object.freeze({
      ko:'“이것”은 말하는 사람 가까이에 있는 물건을 가리킵니다.',
      ja:'「이것」は、話し手の近くにある物を指し、日本語の「これ」に当たります。',
      en:'“이것” points to an object near the speaker and corresponds to “this.”',
      zh:'“이것”指靠近说话者的物品，相当于“这个”。'
    })
  }),
  listenerOrMentioned:Object.freeze({
    meaning:Object.freeze({ko:'청자 가까이·이미 말한 물건',ja:'聞き手の近く・話題の物（それ）',en:'object near listener or mentioned',zh:'靠近听话者或已提到的物品'}),
    selected:Object.freeze({
      ko:'“그것”은 듣는 사람 가까이에 있거나 앞에서 이미 말한 물건을 가리킵니다.',
      ja:'「그것」は、聞き手の近くにある物や、すでに話題に出た物を指し、日本語の「それ」に当たります。',
      en:'“그것” points to an object near the listener or one already mentioned, corresponding to “that.”',
      zh:'“그것”指靠近听话者或前文已经提到的物品，相当于“那个”。'
    })
  }),
  far:Object.freeze({
    meaning:Object.freeze({ko:'화자·청자 모두에게서 먼 물건',ja:'二人から遠い物（あれ）',en:'object far from both people',zh:'离说话者和听话者都远的物品'}),
    selected:Object.freeze({
      ko:'“저것”은 말하는 사람과 듣는 사람 모두에게서 먼 물건을 가리킵니다.',
      ja:'「저것」は、話し手と聞き手の両方から遠い物を指し、日本語の「あれ」に当たります。',
      en:'“저것” points to an object far from both speaker and listener, corresponding to “that over there.”',
      zh:'“저것”指离说话者和听话者双方都远的物品，相当于“远处那个”。'
    })
  }),
  which:Object.freeze({
    meaning:Object.freeze({ko:'여럿 중 어떤 물건인지 물음',ja:'複数から選ぶ物（どれ）',en:'which object among choices',zh:'在多个选项中询问哪一个'}),
    selected:Object.freeze({
      ko:'“어느 것”은 여러 물건 가운데 어떤 물건인지 물을 때 씁니다.',
      ja:'「어느 것」は、複数の物からどの物かを尋ねる表現で、日本語の「どれ」に当たります。',
      en:'“어느 것” asks which object is meant among two or more choices.',
      zh:'“어느 것”用于询问多个物品中的哪一个。'
    })
  })
});
const DEMONSTRATIVE_ORDER=['speaker','listenerOrMentioned','far','which'];
const DEMONSTRATIVE_METHOD=Object.freeze({
  ko:'물건과 사람의 관계를 먼저 보세요. 화자 가까이=이것, 청자 가까이·앞서 말함=그것, 둘 모두에게서 멂=저것, 여럿 중 질문=어느 것입니다.',
  ja:'物と人の関係を先に見ます。話し手の近く＝이것（これ）、聞き手の近く・話題の物＝그것（それ）、二人から遠い＝저것（あれ）、複数から質問＝어느 것（どれ）です。',
  en:'Check the object’s relation first: near the speaker = 이것, near the listener or mentioned = 그것, far from both = 저것, and asking among choices = 어느 것.',
  zh:'先判断物品与人的关系：靠近说话者＝이것，靠近听话者或前文已提到＝그것，离双方都远＝저것，在多个选项中提问＝어느 것。'
});
const reviewedDemonstrativeItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=DEMONSTRATIVES[key];
  return Object.freeze({
    id,level:1,type:'word',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:DEMONSTRATIVE_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(DEMONSTRATIVE_ORDER.map(choiceKey=>Object.freeze({
      meaning:DEMONSTRATIVES[choiceKey].meaning,
      explanationI18n:DEMONSTRATIVES[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】이것=화자 가까이, 그것=청자 가까이·이미 말함, 저것=둘 모두에게서 멂, 어느 것=여럿 중 질문으로 관계가 다릅니다.\n【재사용 풀이】${DEMONSTRATIVE_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】이것＝これ（話し手の近く）、그것＝それ（聞き手の近く・話題の物）、저것＝あれ（二人から遠い）、어느 것＝どれ（複数から質問）で、物と人の関係が異なります。\n【再利用できる解き方】${DEMONSTRATIVE_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] 이것 is near the speaker, 그것 near the listener or already mentioned, 저것 far from both, and 어느 것 asks which one among choices.\n[Reusable method] ${DEMONSTRATIVE_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】이것靠近说话者，그것靠近听话者或前文已提到，저것离双方都远，어느 것用于在多个选项中提问，所指关系各不相同。\n【通用解法】${DEMONSTRATIVE_METHOD.zh}`
    })
  });
};

const COUNTER_UNITS=Object.freeze({
  people:Object.freeze({
    meaning:Object.freeze({ko:'사람을 세는 단위',ja:'人を数える助数詞（～人）',en:'counter for people',zh:'数人的量词（名、位）'}),
    selected:Object.freeze({
      ko:'“명”은 사람의 수를 셀 때 쓰는 단위입니다.',
      ja:'「명」は、人の人数を数えるときに使う助数詞です。',
      en:'“명” is the counter used for people.',
      zh:'“명”是计算人数时使用的量词。'
    })
  }),
  general:Object.freeze({
    meaning:Object.freeze({ko:'일반적인 물건을 세는 단위',ja:'一般の物を数える助数詞（～個）',en:'general counter for objects',zh:'数一般物品的量词（个）'}),
    selected:Object.freeze({
      ko:'“개”는 특별한 단위가 없는 일반적인 물건의 수를 셀 때 씁니다.',
      ja:'「개」は、専用の助数詞がない一般の物を数えるときに使います。',
      en:'“개” is the general counter for objects without a more specific counter.',
      zh:'“개”用于计算没有专用量词的一般物品。'
    })
  }),
  bottles:Object.freeze({
    meaning:Object.freeze({ko:'병에 든 것을 세는 단위',ja:'瓶入りの物を数える助数詞（～本）',en:'counter for bottles',zh:'数瓶装物品的量词（瓶）'}),
    selected:Object.freeze({
      ko:'“병”은 물이나 음료처럼 병에 담긴 것의 수를 셀 때 쓰는 단위입니다.',
      ja:'「병」は、水や飲み物など瓶に入った物を数えるときに使う助数詞です。',
      en:'“병” counts bottles or things packaged in bottles, such as water or drinks.',
      zh:'“병”用于计算水、饮料等瓶装物品。'
    })
  }),
  volumes:Object.freeze({
    meaning:Object.freeze({ko:'책·공책을 세는 단위',ja:'本・冊子を数える助数詞（～冊）',en:'counter for books and bound volumes',zh:'数书本的量词（册、本）'}),
    selected:Object.freeze({
      ko:'“권”은 책이나 공책처럼 묶인 책 형태의 물건을 셀 때 쓰는 단위입니다.',
      ja:'「권」は、本やノートなど冊子になった物を数えるときに使う助数詞です。',
      en:'“권” counts books, notebooks, and other bound volumes.',
      zh:'“권”用于计算书、笔记本等装订成册的物品。'
    })
  })
});
const COUNTER_ORDER=['people','general','bottles','volumes'];
const COUNTER_METHOD=Object.freeze({
  ko:'세는 대상의 종류를 먼저 보세요. 사람=명, 일반 물건=개, 병에 든 것=병, 책·공책=권입니다.',
  ja:'数える対象を先に見ます。人＝명、一般の物＝개、瓶入りの物＝병、本・ノート＝권です。',
  en:'Identify what is being counted first: people = 명, general objects = 개, bottles = 병, and books or notebooks = 권.',
  zh:'先看要数的对象：人＝명，一般物品＝개，瓶装物品＝병，书或笔记本＝권。'
});
const reviewedCounterItem=(id,term,key,example,exampleI18n,evidence)=>{
  const target=COUNTER_UNITS[key];
  return Object.freeze({
    id,level:1,type:'word',difficulty:'easy',term,meaning:target.meaning,example,exampleI18n:Object.freeze(exampleI18n),answerIndex:COUNTER_ORDER.indexOf(key),shortsFastReview:true,
    shortChoices:Object.freeze(COUNTER_ORDER.map(choiceKey=>Object.freeze({
      meaning:COUNTER_UNITS[choiceKey].meaning,
      explanationI18n:COUNTER_UNITS[choiceKey].selected
    }))),
    coach:Object.freeze(Object.fromEntries(['ko','ja','en','zh'].map(lang=>[lang,Object.freeze({short:evidence[lang]})]))),
    explanationI18n:Object.freeze({
      ko:`【정답 근거】${evidence.ko}\n【오답 함정】명=사람, 개=일반 물건, 병=병에 든 것, 권=책·공책으로 세는 대상이 다릅니다.\n【재사용 풀이】${COUNTER_METHOD.ko}`,
      ja:`【正解の根拠】${evidence.ja}\n【誤答の罠】명＝人、개＝一般の物、병＝瓶入りの物、권＝本・ノートで、数える対象が異なります。\n【再利用できる解き方】${COUNTER_METHOD.ja}`,
      en:`[Decisive evidence] ${evidence.en}\n[Distractor traps] 명 counts people, 개 general objects, 병 bottles, and 권 books or notebooks.\n[Reusable method] ${COUNTER_METHOD.en}`,
      zh:`【正答依据】${evidence.zh}\n【错项陷阱】명数人，개数一般物品，병数瓶装物品，권数书或笔记本，计数对象各不相同。\n【通用解法】${COUNTER_METHOD.zh}`
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
  item(1,'expression','다녀오겠습니다','나갔다가 돌아오겠다고 알리는 인사','行ってきます','I am leaving and will be back.','我出门了，会回来的','학교에 다녀오겠습니다.'),

  reviewedLocationItem('S04-I-W-PLACE-01','건너편','opposite','은행은 길 건너편에 있어요.',{
    ko:'은행은 길 건너편에 있어요.',ja:'銀行は道の向こう側にあります。',en:'The bank is on the other side of the street.',zh:'银行在马路对面。'
  },{
    ko:'“길 건너편”은 길을 사이에 두고 마주 보는 반대쪽이므로 “건너편”이 맞습니다.',
    ja:'「길 건너편」は道を挟んで向かい合う反対側なので、「건너편」が合います。',
    en:'“길 건너편” is the opposite side across the street, so 건너편 fits.',
    zh:'“길 건너편”是隔着马路相对的另一边，所以应选“건너편”。'
  }),
  reviewedLocationItem('S04-I-W-PLACE-02','옆','nextTo','약국은 병원 옆에 있어요.',{
    ko:'약국은 병원 옆에 있어요.',ja:'薬局は病院の隣にあります。',en:'The pharmacy is next to the hospital.',zh:'药店在医院旁边。'
  },{
    ko:'약국이 병원 한 곳의 바로 곁에 있으므로 “옆”이 맞습니다.',
    ja:'薬局が病院という一か所のすぐ隣にあるので、「옆」が合います。',
    en:'The pharmacy is directly beside one reference point, the hospital, so 옆 fits.',
    zh:'药店紧挨着医院这一处参照地点，所以应选“옆”。'
  }),
  reviewedLocationItem('S04-I-W-PLACE-03','사이','between','화장실은 식당과 카페 사이에 있어요.',{
    ko:'화장실은 식당과 카페 사이에 있어요.',ja:'トイレは食堂とカフェの間にあります。',en:'The restroom is between the restaurant and the cafe.',zh:'洗手间在餐厅和咖啡店之间。'
  },{
    ko:'식당과 카페라는 두 기준점의 가운데이므로 “사이”가 맞습니다.',
    ja:'食堂とカフェという二つの場所の間なので、「사이」が合います。',
    en:'The restroom is between two reference points, the restaurant and cafe, so 사이 fits.',
    zh:'洗手间位于餐厅和咖啡店两个参照地点之间，所以应选“사이”。'
  }),
  reviewedLocationItem('S04-I-W-PLACE-04','근처','nearby','역 근처에 편의점이 있어요.',{
    ko:'역 근처에 편의점이 있어요.',ja:'駅の近くにコンビニがあります。',en:'There is a convenience store near the station.',zh:'车站附近有一家便利店。'
  },{
    ko:'편의점이 역의 바로 옆이라고 한정하지 않고 가까운 주변에 있으므로 “근처”가 맞습니다.',
    ja:'コンビニが駅のすぐ隣とは限らず、近い周辺にあるので、「근처」が合います。',
    en:'The store is in the area near the station, not necessarily directly beside it, so 근처 fits.',
    zh:'便利店在车站附近一带，不限定为紧挨着，所以应选“근처”。'
  }),
  reviewedFrequencyItem('S04-I-W-FREQ-01','항상','always','저는 항상 아침밥을 먹어요.',{
    ko:'저는 항상 아침밥을 먹어요.',ja:'私はいつも朝ご飯を食べます。',en:'I always eat breakfast.',zh:'我总是吃早饭。'
  },{
    ko:'“저는 항상 아침밥을 먹어요”는 예외 없이 매번 아침밥을 먹는다는 뜻입니다.',
    ja:'「저는 항상 아침밥을 먹어요」は「私はいつも朝ご飯を食べます」という、例外のない毎回の習慣です。',
    en:'“저는 항상 아침밥을 먹어요” says breakfast is eaten every time, without exception.',
    zh:'“저는 항상 아침밥을 먹어요”表示每次都吃早饭，没有例外。'
  }),
  reviewedFrequencyItem('S04-I-W-FREQ-02','자주','often','주말에 이 공원에 자주 와요.',{
    ko:'주말에 이 공원에 자주 와요.',ja:'週末はこの公園によく来ます。',en:'I often come to this park on weekends.',zh:'我周末经常来这个公园。'
  },{
    ko:'“주말에 이 공원에 자주 와요”는 공원에 오는 횟수가 많다는 뜻입니다.',
    ja:'「주말에 이 공원에 자주 와요」は「週末はこの公園によく来ます」という、高い頻度を表します。',
    en:'“주말에 이 공원에 자주 와요” says visits to the park happen with high frequency.',
    zh:'“주말에 이 공원에 자주 와요”表示周末来这个公园的频率很高。'
  }),
  reviewedFrequencyItem('S04-I-W-FREQ-03','가끔','sometimes','저는 가끔 버스로 학교에 가요.',{
    ko:'저는 가끔 버스로 학교에 가요.',ja:'私は時々バスで学校へ行きます。',en:'I sometimes go to school by bus.',zh:'我有时坐公交车去学校。'
  },{
    ko:'“저는 가끔 버스로 학교에 가요”는 늘 버스를 타는 것이 아니라 어떤 때에만 탄다는 뜻입니다.',
    ja:'「저는 가끔 버스로 학교에 가요」は「私は時々バスで学校へ行きます」という、ある時だけの行動です。',
    en:'“저는 가끔 버스로 학교에 가요” says the bus is used on some occasions, not every time.',
    zh:'“저는 가끔 버스로 학교에 가요”表示不是每次，而是有时坐公交车去学校。'
  }),
  reviewedFrequencyItem('S04-I-W-FREQ-04','전혀','notAtAll','저는 매운 음식을 전혀 못 먹어요.',{
    ko:'저는 매운 음식을 전혀 못 먹어요.',ja:'私は辛い物がまったく食べられません。',en:'I cannot eat spicy food at all.',zh:'我完全不能吃辣的食物。'
  },{
    ko:'“전혀 못 먹어요”는 부정 표현 “못”과 함께 먹을 수 있는 정도가 조금도 없음을 강조합니다.',
    ja:'「전혀 못 먹어요」は、否定表現「못」とともに「まったく食べられない」と0の程度を強調します。',
    en:'“전혀 못 먹어요” combines 전혀 with 못 to emphasize zero ability: cannot eat it at all.',
    zh:'“전혀 못 먹어요”把전혀和否定词“못”搭配，强调一点也不能吃。'
  }),
  reviewedCounterItem('S04-I-W-COUNT-01','명','people','교실에 학생이 두 명 있어요.',{
    ko:'교실에 학생이 두 명 있어요.',ja:'教室に学生が二人います。',en:'There are two students in the classroom.',zh:'教室里有两名学生。'
  },{
    ko:'“학생이 두 명”은 사람인 학생의 수를 세므로 “명”이 맞습니다.',
    ja:'「학생이 두 명」は、人である学生の人数を数えているので「명」が合います。',
    en:'“학생이 두 명” counts students, who are people, so 명 fits.',
    zh:'“학생이 두 명”计算的是学生人数，所以应选“명”。'
  }),
  reviewedCounterItem('S04-I-W-COUNT-02','개','general','사과를 세 개 샀어요.',{
    ko:'사과를 세 개 샀어요.',ja:'りんごを三個買いました。',en:'I bought three apples.',zh:'我买了三个苹果。'
  },{
    ko:'“사과 세 개”는 일반적인 물건인 사과의 수를 세므로 “개”가 맞습니다.',
    ja:'「사과를 세 개」は、一般の物であるりんごの数を数えているので「개」が合います。',
    en:'“사과를 세 개” counts apples as general objects, so 개 fits.',
    zh:'“사과를 세 개”计算的是一般物品苹果的数量，所以应选“개”。'
  }),
  reviewedCounterItem('S04-I-W-COUNT-03','병','bottles','물을 한 병 주세요.',{
    ko:'물을 한 병 주세요.',ja:'水を一本ください。',en:'Please give me one bottle of water.',zh:'请给我一瓶水。'
  },{
    ko:'“물 한 병”은 병에 든 물 하나를 세므로 “병”이 맞습니다.',
    ja:'「물을 한 병」は、瓶に入った水を一本と数えているので「병」が合います。',
    en:'“물을 한 병” counts one bottle of water, so 병 fits.',
    zh:'“물을 한 병”计算的是一瓶水，所以应选“병”。'
  }),
  reviewedCounterItem('S04-I-W-COUNT-04','권','volumes','책을 네 권 빌렸어요.',{
    ko:'책을 네 권 빌렸어요.',ja:'本を四冊借りました。',en:'I borrowed four books.',zh:'我借了四本书。'
  },{
    ko:'“책 네 권”은 책의 수를 세므로 “권”이 맞습니다.',
    ja:'「책을 네 권」は、本の冊数を数えているので「권」が合います。',
    en:'“책을 네 권” counts books as bound volumes, so 권 fits.',
    zh:'“책을 네 권”计算的是书的数量，所以应选“권”。'
  }),
  reviewedQuestionWordItem('S04-I-W-QUESTION-01','누구','person','저 사람은 누구예요?',{
    ko:'저 사람은 누구예요?',ja:'あの人はだれですか。',en:'Who is that person?',zh:'那个人是谁？'
  },{
    ko:'“저 사람”의 이름이나 관계를 묻고 있으므로 사람을 묻는 “누구”가 맞습니다.',
    ja:'「저 사람（あの人）」の名前や関係を尋ねているので、人を尋ねる「누구」が合います。',
    en:'The sentence asks for the identity of “that person,” so the person question word 누구 fits.',
    zh:'句子在询问“那个人”的身份，所以应选询问人物的“누구”。'
  }),
  reviewedQuestionWordItem('S04-I-W-QUESTION-02','어디','place','화장실이 어디에 있어요?',{
    ko:'화장실이 어디에 있어요?',ja:'トイレはどこにありますか。',en:'Where is the restroom?',zh:'洗手间在哪里？'
  },{
    ko:'화장실의 위치를 묻고 있으므로 장소를 묻는 “어디”가 맞습니다.',
    ja:'トイレの位置を尋ねているので、場所を尋ねる「어디」が合います。',
    en:'The sentence asks for the restroom’s location, so the place question word 어디 fits.',
    zh:'句子在询问洗手间的位置，所以应选询问地点的“어디”。'
  }),
  reviewedQuestionWordItem('S04-I-W-QUESTION-03','언제','time','시험이 언제예요?',{
    ko:'시험이 언제예요?',ja:'試験はいつですか。',en:'When is the exam?',zh:'考试是什么时候？'
  },{
    ko:'시험이 있는 날이나 시각을 묻고 있으므로 시간을 묻는 “언제”가 맞습니다.',
    ja:'試験がある日や時刻を尋ねているので、時を尋ねる「언제」が合います。',
    en:'The sentence asks for the exam’s day or time, so the time question word 언제 fits.',
    zh:'句子在询问考试的日期或时刻，所以应选询问时间的“언제”。'
  }),
  reviewedQuestionWordItem('S04-I-W-QUESTION-04','얼마','price','이 가방은 얼마예요?',{
    ko:'이 가방은 얼마예요?',ja:'このかばんはいくらですか。',en:'How much is this bag?',zh:'这个包多少钱？'
  },{
    ko:'가방의 가격을 묻고 있으므로 가격·금액을 묻는 “얼마”가 맞습니다.',
    ja:'かばんの値段を尋ねているので、値段・金額を尋ねる「얼마」が合います。',
    en:'The sentence asks for the bag’s price, so the price question word 얼마 fits.',
    zh:'句子在询问包的价格，所以应选询问价格或金额的“얼마”。'
  }),
  reviewedParticleItem('S04-I-G-PARTICLE-01','에','destination','학교에 가요.',{
    ko:'학교에 가요.',ja:'学校へ行きます。',en:'I go to school.',zh:'我去学校。'
  },{
    ko:'“가요”는 이동이고 “학교”는 도착하는 곳이므로 “에”가 맞습니다.',
    ja:'「가요」は移動で、「학교」は到着する場所なので「에」が合います。',
    en:'“가요” expresses movement and “학교” is its destination, so 에 fits.',
    zh:'“가요”表示移动，“학교”是到达的地点，所以应选“에”。'
  }),
  reviewedParticleItem('S04-I-G-PARTICLE-02','에서','actionPlace','도서관에서 공부해요.',{
    ko:'도서관에서 공부해요.',ja:'図書館で勉強します。',en:'I study at the library.',zh:'我在图书馆学习。'
  },{
    ko:'“공부해요”라는 행동이 도서관에서 일어나므로 “에서”가 맞습니다.',
    ja:'「공부해요」という動作が図書館で行われるので「에서」が合います。',
    en:'The action “공부해요” happens at the library, so 에서 fits.',
    zh:'“공부해요”这一动作发生在图书馆，所以应选“에서”。'
  }),
  reviewedParticleItem('S04-I-G-PARTICLE-03','(으)로','means','버스로 회사에 가요.',{
    ko:'버스로 회사에 가요.',ja:'バスで会社へ行きます。',en:'I go to work by bus.',zh:'我坐公交车去公司。'
  },{
    ko:'버스는 회사에 가는 데 사용하는 이동 수단이므로 “(으)로”가 맞습니다.',
    ja:'バスは会社へ行くために使う移動手段なので「(으)로」が合います。',
    en:'The bus is the means used to travel to work, so (으)로 fits.',
    zh:'公交车是去公司时使用的交通手段，所以应选“(으)로”。'
  }),
  reviewedParticleItem('S04-I-G-PARTICLE-04','에게','recipient','친구에게 선물을 줘요.',{
    ko:'친구에게 선물을 줘요.',ja:'友達にプレゼントをあげます。',en:'I give a gift to a friend.',zh:'我送礼物给朋友。'
  },{
    ko:'친구는 선물을 받는 사람이므로 사람인 대상을 나타내는 “에게”가 맞습니다.',
    ja:'友達はプレゼントを受け取る人なので、人である受け手を表す「에게」が合います。',
    en:'The friend is the person receiving the gift, so 에게 fits.',
    zh:'朋友是接受礼物的人，所以应选表示人的接受对象的“에게”。'
  }),
  reviewedDemonstrativeItem('S04-I-W-DEMONSTRATIVE-01','이것','speaker','이것은 제가 들고 있는 우산이에요.',{
    ko:'이것은 제가 들고 있는 우산이에요.',ja:'これは私が持っている傘です。',en:'This is the umbrella I am holding.',zh:'这是我手里拿着的雨伞。'
  },{
    ko:'“제가 들고 있는” 물건은 말하는 사람 가까이에 있으므로 “이것”이 맞습니다.',
    ja:'「私が持っている」物は話し手の近くにあるため、「これ」に当たる「이것」が合います。',
    en:'The speaker is holding the umbrella, so it is near the speaker and 이것 fits.',
    zh:'雨伞正由说话者拿着，靠近说话者，所以应选“이것”。'
  }),
  reviewedDemonstrativeItem('S04-I-W-DEMONSTRATIVE-02','그것','listenerOrMentioned','네 앞에 있는 그것을 주세요.',{
    ko:'네 앞에 있는 그것을 주세요.',ja:'あなたの前にあるそれをください。',en:'Please give me that one in front of you.',zh:'请把你面前的那个给我。'
  },{
    ko:'“네 앞에 있는” 물건은 듣는 사람 가까이에 있으므로 “그것”이 맞습니다.',
    ja:'「あなたの前にある」物は聞き手の近くにあるため、「それ」に当たる「그것」が合います。',
    en:'The object is in front of the listener, so 그것 fits.',
    zh:'物品在听话者面前，靠近听话者，所以应选“그것”。'
  }),
  reviewedDemonstrativeItem('S04-I-W-DEMONSTRATIVE-03','저것','far','저기 멀리 보이는 저것은 남산타워예요.',{
    ko:'저기 멀리 보이는 저것은 남산타워예요.',ja:'遠くに見えるあれは南山タワーです。',en:'That thing visible far over there is Namsan Tower.',zh:'远处看见的那个是南山塔。'
  },{
    ko:'“저기 멀리”는 두 사람에게서 먼 곳을 가리키므로 “저것”이 맞습니다.',
    ja:'「遠くに見える」は二人から離れた物なので、「あれ」に当たる「저것」が合います。',
    en:'“Far over there” places the object away from both people, so 저것 fits.',
    zh:'“远处”表示物品离说话者和听话者都远，所以应选“저것”。'
  }),
  reviewedDemonstrativeItem('S04-I-W-DEMONSTRATIVE-04','어느 것','which','이 가방들 중에서 어느 것이 가장 가벼워요?',{
    ko:'이 가방들 중에서 어느 것이 가장 가벼워요?',ja:'このかばんの中では、どれがいちばん軽いですか。',en:'Which one of these bags is the lightest?',zh:'这些包里哪一个最轻？'
  },{
    ko:'“가방들 중에서” 하나를 묻고 있으므로 “어느 것”이 맞습니다.',
    ja:'「かばんの中で」一つを尋ねているため、「どれ」に当たる「어느 것」が合います。',
    en:'The question asks for one item among several bags, so 어느 것 fits.',
    zh:'句子在多个包中询问一个，所以应选“어느 것”。'
  }),
  reviewedBasicTenseItem('S04-I-G-TENSE-01','-아/어요','presentHabit','저는 매일 아침 일곱 시에 일어나요.',{
    ko:'저는 매일 아침 일곱 시에 일어나요.',ja:'私は毎朝7時に起きます。',en:'I get up at seven every morning.',zh:'我每天早上七点起床。'
  },{
    ko:'“매일 아침”은 일곱 시에 일어나는 일이 반복되는 현재 습관임을 보여 줍니다.',
    ja:'「毎朝」が、7時に起きることを繰り返す現在の習慣だと示します。',
    en:'“Every morning” shows that getting up at seven is a repeated present routine.',
    zh:'“每天早上”表明七点起床是反复进行的当前习惯。'
  }),
  reviewedBasicTenseItem('S04-I-G-TENSE-02','-았/었어요','completedPast','어제 도서관에서 책을 빌렸어요.',{
    ko:'어제 도서관에서 책을 빌렸어요.',ja:'昨日、図書館で本を借りました。',en:'I borrowed a book at the library yesterday.',zh:'我昨天在图书馆借了书。'
  },{
    ko:'“어제”와 “빌렸어요”는 책을 빌리는 일이 과거에 끝났음을 보여 줍니다.',
    ja:'「昨日」と「借りました」が、本を借りることが過去に終わったと示します。',
    en:'“Yesterday” and “borrowed” show that the action was completed in the past.',
    zh:'“昨天”和“借了”表明借书这一动作已经在过去完成。'
  }),
  reviewedBasicTenseItem('S04-I-G-TENSE-03','-고 있어요','ongoingNow','지금 버스를 기다리고 있어요.',{
    ko:'지금 버스를 기다리고 있어요.',ja:'今、バスを待っています。',en:'I am waiting for the bus now.',zh:'我现在正在等公交车。'
  },{
    ko:'“지금”과 “기다리고 있어요”는 기다리는 동작이 현재 계속되고 있음을 보여 줍니다.',
    ja:'「今」と「待っています」が、待つ動作が現在も続いていると示します。',
    en:'“Now” and “am waiting” show that the action is still in progress.',
    zh:'“现在”和“正在等”表明等待这一动作仍在进行。'
  }),
  reviewedBasicTenseItem('S04-I-G-TENSE-04','-(으)ㄹ 거예요','futurePlan','내일 친구를 만날 거예요.',{
    ko:'내일 친구를 만날 거예요.',ja:'明日、友達に会います。',en:'I will meet a friend tomorrow.',zh:'我明天要见朋友。'
  },{
    ko:'“내일”과 “만날 거예요”는 친구를 만나는 일이 앞으로 할 계획임을 보여 줍니다.',
    ja:'「明日」と「会います」が、友達に会うことをこれからする予定だと示します。',
    en:'“Tomorrow” and “will meet” show that meeting the friend is a future plan.',
    zh:'“明天”和“要见”表明见朋友是今后要做的计划。'
  }),
  reviewedPoliteInteractionItem('S04-I-G-INTERACTION-01','주세요','objectRequest','물 한 병 주세요.',{
    ko:'물 한 병 주세요.',ja:'水を一本ください。',en:'Please give me one bottle of water.',zh:'请给我一瓶水。'
  },{
    ko:'“물 한 병”이라는 명사 뒤의 “주세요”는 그 물건을 달라는 요청입니다.',
    ja:'名詞「물 한 병（水一本）」の後の「주세요」は、その物を求める依頼です。',
    en:'“주세요” follows the noun phrase “one bottle of water,” so it requests that item.',
    zh:'“주세요”接在名词短语“一瓶水”后，因此是在请求该物品。'
  }),
  reviewedPoliteInteractionItem('S04-I-G-INTERACTION-02','-(으)세요','actionRequest','여기에서 잠깐 기다리세요.',{
    ko:'여기에서 잠깐 기다리세요.',ja:'ここで少し待ってください。',en:'Please wait here for a moment.',zh:'请在这里稍等一下。'
  },{
    ko:'“잠깐 기다리세요”는 듣는 사람에게 기다리는 행동을 하도록 정중하게 요청합니다.',
    ja:'「少し待ってください」は、聞き手に待つ行動をするよう丁寧に求めています。',
    en:'“Please wait for a moment” politely asks the listener to perform the action of waiting.',
    zh:'“请稍等一下”是在礼貌地请求听话者做“等待”这一动作。'
  }),
  reviewedPoliteInteractionItem('S04-I-G-INTERACTION-03','-지 마세요','prohibition','안에 들어가지 마세요.',{
    ko:'안에 들어가지 마세요.',ja:'中に入らないでください。',en:'Please do not go inside.',zh:'请不要进去。'
  },{
    ko:'“들어가지” 뒤의 “마세요”는 안에 들어가는 행동을 하지 말라는 뜻입니다.',
    ja:'「들어가지」の後の「마세요」は、中に入る行動をしないよう求めています。',
    en:'“마세요” after “들어가지” asks the listener not to perform the action of going inside.',
    zh:'“마세요”接在“들어가지”后，表示请对方不要做“进去”这一动作。'
  }),
  reviewedPoliteInteractionItem('S04-I-G-INTERACTION-04','-(으)ㄹ까요?','suggestion','같이 사진을 찍을까요?',{
    ko:'같이 사진을 찍을까요?',ja:'一緒に写真を撮りましょうか。',en:'Shall we take a picture together?',zh:'我们一起拍张照好吗？'
  },{
    ko:'“같이”와 물음형 “찍을까요?”는 화자와 듣는 사람이 함께 사진을 찍자고 제안합니다.',
    ja:'「一緒に」と疑問形「찍을까요？」が、話し手と聞き手で写真を撮る提案を示します。',
    en:'“Together” plus the question “shall we take” proposes a shared action by speaker and listener.',
    zh:'“一起”和疑问形式“要拍吗”表明说话者提议双方共同拍照。'
  }),
  reviewedBasicNegationItem('S04-I-G-NEGATION-01','안','general','저는 아침에 커피를 안 마셔요.',{
    ko:'저는 아침에 커피를 안 마셔요.',ja:'私は朝、コーヒーを飲みません。',en:'I do not drink coffee in the morning.',zh:'我早上不喝咖啡。'
  },{
    ko:'“안”이 동사 “마셔요” 바로 앞에서 커피를 마시는 행동을 단순히 부정합니다.',
    ja:'「안」が動詞「마셔요」の直前にあり、コーヒーを飲む動作を単純に否定しています。',
    en:'“안” appears directly before “마셔요,” simply negating the action of drinking coffee.',
    zh:'“안”直接放在动词“마셔요”前，单纯否定喝咖啡这一动作。'
  }),
  reviewedBasicNegationItem('S04-I-G-NEGATION-02','못','inability','오늘은 바빠서 친구를 못 만나요.',{
    ko:'오늘은 바빠서 친구를 못 만나요.',ja:'今日は忙しくて友達に会えません。',en:'I cannot meet my friend today because I am busy.',zh:'今天很忙，所以没法见朋友。'
  },{
    ko:'“바빠서”라는 상황 때문에 만나고 싶어도 만날 수 없으므로 “못”은 불가능을 나타냅니다.',
    ja:'「忙しくて」という状況のため、会いたくても会えないので、「못」は不可能を表します。',
    en:'Being busy prevents the meeting even if it is wanted, so “못” marks circumstantial inability.',
    zh:'因为“很忙”这一情况，即使想见也无法见面，所以“못”表示客观上无法做到。'
  }),
  reviewedBasicNegationItem('S04-I-G-NEGATION-03','아니에요','identity','여기는 약국이 아니에요. 은행이에요.',{
    ko:'여기는 약국이 아니에요. 은행이에요.',ja:'ここは薬局ではありません。銀行です。',en:'This is not a pharmacy. It is a bank.',zh:'这里不是药店，是银行。'
  },{
    ko:'“약국이 아니에요” 뒤에 실제 분류인 “은행이에요”가 이어져 장소의 정체를 부정합니다.',
    ja:'「薬局ではありません」の後に実際の分類「銀行です」が続き、場所の身分・分類を否定しています。',
    en:'“It is a bank” supplies the actual category after “not a pharmacy,” so 아니에요 denies noun identity.',
    zh:'“不是药店”之后接着说明实际类别“是银行”，因此“아니에요”否定名词身份。'
  }),
  reviewedBasicNegationItem('S04-I-G-NEGATION-04','없어요','absence','냉장고에 우유가 없어요.',{
    ko:'냉장고에 우유가 없어요.',ja:'冷蔵庫に牛乳がありません。',en:'There is no milk in the refrigerator.',zh:'冰箱里没有牛奶。'
  },{
    ko:'장소 “냉장고에”와 주어 “우유가” 뒤의 “없어요”는 우유가 존재하지 않음을 나타냅니다.',
    ja:'場所「冷蔵庫に」と主語「牛乳が」の後の「없어요」は、牛乳が存在しないことを表します。',
    en:'With the location “in the refrigerator” and subject “milk,” 없어요 states that the milk is absent.',
    zh:'在地点“冰箱里”和主语“牛奶”之后使用“없어요”，表示牛奶不存在。'
  }),
  reviewedBasicConnectiveItem('S04-I-G-CONNECTIVE-01','-(으)면서','simultaneous','친구와 이야기하면서 커피를 마셨어요.',{
    ko:'친구와 이야기하면서 커피를 마셨어요.',ja:'友達と話しながらコーヒーを飲みました。',en:'I drank coffee while talking with a friend.',zh:'我一边和朋友聊天，一边喝了咖啡。'
  },{
    ko:'한 사람이 친구와 이야기하는 동안 커피도 마셨으므로 두 행동이 같은 시간에 진행됩니다.',
    ja:'同じ人が友達と話している間にコーヒーも飲んだので、二つの動作が同時に進んでいます。',
    en:'The same person talks with a friend and drinks coffee during the same time, so the actions are simultaneous.',
    zh:'同一个人在和朋友聊天的同时也喝咖啡，因此两个动作同时进行。'
  }),
  reviewedBasicConnectiveItem('S04-I-G-CONNECTIVE-02','-(으)니까','reason','비가 오니까 우산을 가져가세요.',{
    ko:'비가 오니까 우산을 가져가세요.',ja:'雨が降っているので、傘を持って行ってください。',en:'It is raining, so please take an umbrella.',zh:'因为下雨，请带上伞。'
  },{
    ko:'비가 온다는 이유를 먼저 말한 뒤 “가져가세요”라고 요청하므로 이유 뒤에 요청이 이어집니다.',
    ja:'雨が降っているという理由を先に述べ、その後で「持って行ってください」と依頼しています。',
    en:'The rain is given first as the reason, followed by the request “please take an umbrella.”',
    zh:'先说明下雨这一原因，后面接“请带上伞”的请求。'
  }),
  reviewedBasicConnectiveItem('S04-I-G-CONNECTIVE-03','-(으)러','movementPurpose','책을 빌리러 도서관에 갔어요.',{
    ko:'책을 빌리러 도서관에 갔어요.',ja:'本を借りに図書館へ行きました。',en:'I went to the library to borrow a book.',zh:'我去图书馆借书了。'
  },{
    ko:'뒤의 이동 동사 “도서관에 갔어요” 앞에서 “책을 빌리다”가 그 이동의 목적을 밝힙니다.',
    ja:'後ろの移動動詞「図書館へ行きました」の前で、「本を借りる」がその移動の目的を示しています。',
    en:'Before the movement “went to the library,” borrowing a book states the purpose of that trip.',
    zh:'在后面的移动表达“去了图书馆”之前，“借书”说明了这次移动的目的。'
  }),
  reviewedBasicConnectiveItem('S04-I-G-CONNECTIVE-04','-는데','background','지금 회의 중인데 나중에 전화할게요.',{
    ko:'지금 회의 중인데 나중에 전화할게요.',ja:'今は会議中なので、後で電話しますね。',en:'I am in a meeting now, so I will call you later.',zh:'我现在正在开会，稍后给你打电话。'
  },{
    ko:'“지금 회의 중”이라는 현재 상황을 먼저 제시한 뒤, 그 배경에서 나중에 전화하겠다는 결정을 말합니다.',
    ja:'「今は会議中」という現在の状況を先に示し、その背景を受けて後で電話するという判断を述べています。',
    en:'The current meeting is supplied as background before the speaker says they will call later.',
    zh:'先说明“现在正在开会”这一当前情况，再在此背景下表示稍后会打电话。'
  })
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
  }),

  reviewedReportedSpeechItem('S04-II-G-REPORT-01','-다고 하다','statement','민수 씨는 오늘 바쁘다고 했어요.',{
    ko:'민수 씨는 오늘 바쁘다고 했어요.',ja:'ミンスさんは今日忙しいと言いました。',en:'Minsu said that he was busy today.',zh:'敏洙说他今天很忙。'
  },{
    ko:'“오늘 바쁘다”라는 사실을 평서문으로 전하므로 “-다고 하다”가 맞습니다.',
    ja:'「今日は忙しい」という事実を平叙文として伝えているので「-다고 하다」が合います。',
    en:'The speaker reports the declarative fact “Minsu is busy today,” so -다고 하다 fits.',
    zh:'句子把“敏洙今天很忙”作为陈述事实转述，所以应选“-다고 하다”。'
  }),
  reviewedReportedSpeechItem('S04-II-G-REPORT-02','-냐고 하다','question','친구가 언제 출발하냐고 물었어요.',{
    ko:'친구가 언제 출발하냐고 물었어요.',ja:'友だちがいつ出発するのかと聞きました。',en:'My friend asked when we would leave.',zh:'朋友问什么时候出发。'
  },{
    ko:'“언제 출발하나?”라는 물음을 간접적으로 전달하므로 “-냐고 하다”가 맞습니다.',
    ja:'「いつ出発するのか」という質問を間接的に伝えているので「-냐고 하다」が合います。',
    en:'The sentence indirectly reports the question “When will you leave?”, so -냐고 하다 fits.',
    zh:'句子间接转述“什么时候出发？”这一提问，所以应选“-냐고 하다”。'
  }),
  reviewedReportedSpeechItem('S04-II-G-REPORT-03','-(으)라고 하다','command','직원이 여기에서 기다리라고 했어요.',{
    ko:'직원이 여기에서 기다리라고 했어요.',ja:'職員がここで待つように言いました。',en:'The staff member told me to wait here.',zh:'工作人员让我在这里等。'
  },{
    ko:'직원이 상대에게 “여기에서 기다리세요”라고 요구했으므로 “-(으)라고 하다”가 맞습니다.',
    ja:'職員が相手に「ここで待ってください」と求めたので「-(으)라고 하다」が合います。',
    en:'The staff member tells someone to “wait here,” so -(으)라고 하다 fits.',
    zh:'工作人员要求对方“在这里等”，所以应选“-(으)라고 하다”。'
  }),
  reviewedReportedSpeechItem('S04-II-G-REPORT-04','-자고 하다','suggestion','친구가 주말에 같이 등산하자고 했어요.',{
    ko:'친구가 주말에 같이 등산하자고 했어요.',ja:'友だちが週末に一緒に登山しようと言いました。',en:'My friend suggested that we go hiking together this weekend.',zh:'朋友提议周末一起去登山。'
  },{
    ko:'친구가 주말에 함께 등산하자고 제안했으므로 “-자고 하다”가 맞습니다.',
    ja:'友だちが週末に一緒に登山しようと提案したので「-자고 하다」が合います。',
    en:'The friend suggests that they go hiking together, so -자고 하다 fits.',
    zh:'朋友提议周末一起去登山，所以应选“-자고 하다”。'
  }),

  reviewedStateChangeItem('S04-II-G-STATE-01','-게 되다','circumstanceChange','회사 사정으로 다음 달부터 부산에서 근무하게 되었습니다.',{
    ko:'회사 사정으로 다음 달부터 부산에서 근무하게 되었습니다.',ja:'会社の事情で、来月から釜山で勤務することになりました。',en:'Due to company circumstances, I will start working in Busan next month.',zh:'由于公司的安排，我从下个月起将在釜山工作。'
  },{
    ko:'회사 사정이라는 외부 상황 때문에 다음 달부터 새로 부산 근무를 하게 되므로 “-게 되다”가 맞습니다.',
    ja:'会社の事情という外部の状況により、来月から新たに釜山で勤務することになったので「-게 되다」が合います。',
    en:'Company circumstances lead to the new action of working in Busan next month, so -게 되다 fits.',
    zh:'由于公司安排这一外部情况，下个月起将开始在釜山工作，所以应选“-게 되다”。'
  }),
  reviewedStateChangeItem('S04-II-G-STATE-02','-아/어지다','qualityChange','봄이 오면서 날씨가 따뜻해졌습니다.',{
    ko:'봄이 오면서 날씨가 따뜻해졌습니다.',ja:'春が来て、天気が暖かくなりました。',en:'As spring arrived, the weather became warmer.',zh:'随着春天到来，天气变暖了。'
  },{
    ko:'날씨의 성질이 “따뜻하다”라는 새 상태로 변했으므로 “-아/어지다”가 맞습니다.',
    ja:'天気の性質が「暖かい」という新しい状態に変わったので「-아/어지다」が合います。',
    en:'The quality of the weather changes to the new state “warm,” so -아/어지다 fits.',
    zh:'天气的性质变成“温暖”这一新状态，所以应选“-아/어지다”。'
  }),
  reviewedStateChangeItem('S04-II-G-STATE-03','-고 있다','actionProgress','학생들이 지금 도서관에서 공부하고 있습니다.',{
    ko:'학생들이 지금 도서관에서 공부하고 있습니다.',ja:'学生たちは今、図書館で勉強しています。',en:'The students are studying in the library now.',zh:'学生们现在正在图书馆学习。'
  },{
    ko:'“지금” 학생들이 하는 공부 동작이 진행 중이므로 “-고 있다”가 맞습니다.',
    ja:'「今」、学生たちが行う勉強という動作が進行中なので「-고 있다」が合います。',
    en:'The word “now” shows that the students’ action of studying is in progress, so -고 있다 fits.',
    zh:'“现在”表明学生们学习这一动作正在进行，所以应选“-고 있다”。'
  }),
  reviewedStateChangeItem('S04-II-G-STATE-04','-아/어 있다','resultState','회의실 문이 열려 있습니다.',{
    ko:'회의실 문이 열려 있습니다.',ja:'会議室のドアが開いています。',en:'The meeting-room door is open.',zh:'会议室的门开着。'
  },{
    ko:'문을 여는 동작은 끝났고 열린 결과 상태가 그대로 유지되므로 “-아/어 있다”가 맞습니다.',
    ja:'ドアを開ける動作は終わり、開いた結果の状態がそのまま続いているので「-아/어 있다」が合います。',
    en:'The opening action is complete and the resulting open state remains, so -아/어 있다 fits.',
    zh:'开门的动作已经结束，门开着的结果状态仍在持续，所以应选“-아/어 있다”。'
  }),

  reviewedConditionRelationItem('S04-II-G-COND-01','-거든','eventCondition','시간이 나거든 이 서류를 확인해 주세요.',{
    ko:'시간이 나거든 이 서류를 확인해 주세요.',ja:'時間ができたら、この書類を確認してください。',en:'If you have time, please check this document.',zh:'如果有时间，请确认一下这份文件。'
  },{
    ko:'시간이 나는 일이 실제로 생길 때 서류를 확인해 달라고 부탁하므로 “-거든”이 맞습니다.',
    ja:'時間ができたときに書類を確認してほしいという依頼なので「-거든」が合います。',
    en:'The speaker asks the listener to check the document when time becomes available, so -거든 fits.',
    zh:'说话人请对方在有时间时确认文件，所以应选“-거든”。'
  }),
  reviewedConditionRelationItem('S04-II-G-COND-02','-아/어야만','necessaryCondition','신분증을 보여야만 들어갈 수 있습니다.',{
    ko:'신분증을 보여야만 들어갈 수 있습니다.',ja:'身分証を見せなければ入れません。',en:'You can enter only if you show identification.',zh:'只有出示身份证件才能进入。'
  },{
    ko:'신분증을 보이는 것이 입장에 반드시 필요한 조건이므로 “-아/어야만”이 맞습니다.',
    ja:'身分証を見せることが入場に必須の条件なので「-아/어야만」が合います。',
    en:'Showing identification is a required condition for entry, so -아/어야만 fits.',
    zh:'出示身份证件是进入的必要条件，所以应选“-아/어야만”。'
  }),
  reviewedConditionRelationItem('S04-II-G-COND-03','-(으)ㄴ/는다면','hypotheticalCondition','회사를 옮긴다면 어떤 일을 하고 싶어요?',{
    ko:'회사를 옮긴다면 어떤 일을 하고 싶어요?',ja:'もし転職するなら、どんな仕事をしたいですか。',en:'If you changed companies, what kind of work would you like to do?',zh:'如果换工作，你想做什么样的工作？'
  },{
    ko:'회사 이동이 아직 정해지지 않은 상황을 가정해 희망을 묻기 때문에 “-(으)ㄴ/는다면”이 맞습니다.',
    ja:'転職がまだ決まっていない状況を仮定して希望を尋ねるので「-(으)ㄴ/는다면」が合います。',
    en:'The question supposes an undecided job change and asks about a preference, so -(으)ㄴ/는다면 fits.',
    zh:'句子假设尚未确定的换工作情况，并询问意愿，所以应选“-(으)ㄴ/는다면”。'
  }),
  reviewedConditionRelationItem('S04-II-G-COND-04','-다가는','warningCondition','계속 무리하다가는 건강을 해칠 거예요.',{
    ko:'계속 무리하다가는 건강을 해칠 거예요.',ja:'このまま無理を続けると、健康を害しますよ。',en:'If you keep overworking, you will harm your health.',zh:'再这样勉强下去，会损害健康。'
  },{
    ko:'무리하는 행동을 계속할 때 건강을 해치는 나쁜 결과를 경고하므로 “-다가는”이 맞습니다.',
    ja:'無理を続けた場合に健康を害するという悪い結果を警告するので「-다가는」が合います。',
    en:'The sentence warns that continuing to overwork will cause the bad result of harming one’s health, so -다가는 fits.',
    zh:'句子警告继续勉强下去会损害健康，所以应选“-다가는”。'
  }),

  reviewedCompletionExperienceItem('S04-II-G-COMPLETE-01','-아/어 버리다','completeAll','밀린 보고서를 오늘 다 써 버렸습니다.',{
    ko:'밀린 보고서를 오늘 다 써 버렸습니다.',ja:'たまっていた報告書を今日全部書き上げました。',en:'I finished writing all the overdue reports today.',zh:'我今天把积压的报告全都写完了。'
  },{
    ko:'“다”가 보고서 작성이 남김없이 끝났음을 보여 주므로 “-아/어 버리다”가 맞습니다.',
    ja:'「全部」が、たまっていた報告書を書き残さず終えたことを示すので「-아/어 버리다」が合います。',
    en:'“All” shows that none of the overdue reports remain unfinished, so -아/어 버리다 fits.',
    zh:'“全都”表明积压的报告已经一个不剩地写完，所以应选“-아/어 버리다”。'
  }),
  reviewedCompletionExperienceItem('S04-II-G-COMPLETE-02','-(으)ㄴ 끝에','longProcessResult','여러 번 고친 끝에 보고서를 완성했습니다.',{
    ko:'여러 번 고친 끝에 보고서를 완성했습니다.',ja:'何度も直した末に、報告書を完成させました。',en:'After revising it many times, I completed the report.',zh:'经过多次修改，终于完成了报告。'
  },{
    ko:'“여러 번 고친” 긴 과정 뒤에 보고서 완성이라는 마지막 결과가 나왔으므로 “-(으)ㄴ 끝에”가 맞습니다.',
    ja:'「何度も直した」という長い過程の後に完成という最終結果が出たので「-(으)ㄴ 끝에」が合います。',
    en:'Completion is the final result after many revisions, so -(으)ㄴ 끝에 fits.',
    zh:'经过“多次修改”这一过程后得到完成报告的最终结果，所以应选“-(으)ㄴ 끝에”。'
  }),
  reviewedCompletionExperienceItem('S04-II-G-COMPLETE-03','-아/어 본 적이 있다','pastExperience','제주도에서 한라산에 올라 본 적이 있습니다.',{
    ko:'제주도에서 한라산에 올라 본 적이 있습니다.',ja:'済州島で漢拏山に登ったことがあります。',en:'I have climbed Hallasan on Jeju Island before.',zh:'我曾经在济州岛登过汉拿山。'
  },{
    ko:'과거에 한라산 등반을 경험한 일이 있음을 말하므로 “-아/어 본 적이 있다”가 맞습니다.',
    ja:'過去に漢拏山へ登った経験があると述べているので「-아/어 본 적이 있다」が合います。',
    en:'The sentence states a past experience of climbing Hallasan, so -아/어 본 적이 있다 fits.',
    zh:'句子说明过去有登汉拿山的经历，所以应选“-아/어 본 적이 있다”。'
  }),
  reviewedCompletionExperienceItem('S04-II-G-COMPLETE-04','-아/어 놓다','preparedState','손님이 오기 전에 방을 청소해 놓았습니다.',{
    ko:'손님이 오기 전에 방을 청소해 놓았습니다.',ja:'お客さんが来る前に、部屋を掃除しておきました。',en:'I cleaned the room in advance before the guests arrived.',zh:'客人来之前，我事先把房间打扫好了。'
  },{
    ko:'손님을 맞을 준비로 방 청소를 미리 끝내고 깨끗한 상태를 유지하므로 “-아/어 놓다”가 맞습니다.',
    ja:'客を迎える準備として前もって掃除を済ませ、きれいな状態を保つので「-아/어 놓다」が合います。',
    en:'The room is cleaned beforehand and kept ready for the guests, so -아/어 놓다 fits.',
    zh:'为了迎接客人，房间已事先打扫并保持整洁状态，所以应选“-아/어 놓다”。'
  }),

  reviewedJudgmentConstraintItem('S04-II-G-JUDGMENT-01','-(으)ㄹ 수밖에 없다','unavoidable','막차가 끊겨서 택시를 탈 수밖에 없었어요.',{
    ko:'막차가 끊겨서 택시를 탈 수밖에 없었어요.',ja:'終電がなくなり、タクシーに乗るしかありませんでした。',en:'The last train had stopped running, so I had no choice but to take a taxi.',zh:'末班车已经停运，所以我只能坐出租车。'
  },{
    ko:'“막차가 끊겨서”가 다른 이동 선택을 없애 택시를 피할 수 없게 합니다.',
    ja:'「終電がなくなり」がほかの移動手段をなくし、タクシーを避けられない状況にしています。',
    en:'“The last train had stopped running” removes the alternative and makes the taxi unavoidable.',
    zh:'“末班车已经停运”排除了其他出行选择，只能坐出租车。'
  }),
  reviewedJudgmentConstraintItem('S04-II-G-JUDGMENT-02','-(으)ㄹ 만하다','worthwhile','이 영화는 결말이 좋아서 다시 볼 만해요.',{
    ko:'이 영화는 결말이 좋아서 다시 볼 만해요.',ja:'この映画は結末がよくて、もう一度見る価値があります。',en:'This film has a good ending, so it is worth watching again.',zh:'这部电影结局很好，值得再看一次。'
  },{
    ko:'“결말이 좋아서”가 다시 보는 행동에 가치가 있다고 평가하는 근거입니다.',
    ja:'「結末がよくて」が、もう一度見る行動に価値があると評価する根拠です。',
    en:'“Has a good ending” supports the evaluation that watching it again is worthwhile.',
    zh:'“结局很好”是评价再次观看值得去做的依据。'
  }),
  reviewedJudgmentConstraintItem('S04-II-G-JUDGMENT-03','-(으)ㄹ 필요가 있다','necessary','신청하려면 오늘 서류를 낼 필요가 있어요.',{
    ko:'신청하려면 오늘 서류를 낼 필요가 있어요.',ja:'申し込むなら、今日書類を出す必要があります。',en:'To apply, you need to submit the documents today.',zh:'如果要申请，今天需要提交材料。'
  },{
    ko:'“신청하려면”이 목표이고 오늘 서류 제출은 그 목표에 필요한 행동입니다.',
    ja:'「申し込むなら」が目標で、今日の書類提出はその目標に必要な行動です。',
    en:'“To apply” sets the goal, and submitting the documents today is required for it.',
    zh:'“如果要申请”是目标，今天提交材料是实现该目标所需的行动。'
  }),
  reviewedJudgmentConstraintItem('S04-II-G-JUDGMENT-04','-(으)ㄹ 필요가 없다','unnecessary','이미 예약했으니 표를 다시 살 필요가 없어요.',{
    ko:'이미 예약했으니 표를 다시 살 필요가 없어요.',ja:'すでに予約したので、切符をもう一度買う必要はありません。',en:'It is already booked, so there is no need to buy the ticket again.',zh:'已经预订了，所以不必再买票。'
  },{
    ko:'“이미 예약했으니”가 표를 다시 사야 할 요구가 이미 충족되었음을 보여 줍니다.',
    ja:'「すでに予約したので」が、切符をもう一度買う必要がすでに満たされていることを示します。',
    en:'“It is already booked” shows that the need to buy the ticket has already been met.',
    zh:'“已经预订了”表明购票需求已经满足，不必再次购买。'
  }),

  reviewedPlanStageItem('S04-II-G-PLAN-01','-(으)ㄹ 생각이다','intention','졸업 후에는 한국에서 일할 생각이에요.',{
    ko:'졸업 후에는 한국에서 일할 생각이에요.',ja:'卒業後は韓国で働こうと考えています。',en:'I intend to work in Korea after graduation.',zh:'毕业后我打算在韩国工作。'
  },{
    ko:'“생각이에요”는 졸업 뒤에 그렇게 하려는 말하는 사람의 의향을 보여 줍니다.',
    ja:'「考えています」は、卒業後にそうしようとする話し手本人の意向を示します。',
    en:'“I intend” shows the speaker’s personal plan for after graduation.',
    zh:'“打算”表明说话者本人毕业后的个人意向。'
  }),
  reviewedPlanStageItem('S04-II-G-PLAN-02','-기로 하다','decision','가족 회의에서 올해는 제주도로 여행하기로 했어요.',{
    ko:'가족 회의에서 올해는 제주도로 여행하기로 했어요.',ja:'家族会議で、今年は済州島へ旅行することにしました。',en:'At the family meeting, we decided to travel to Jeju this year.',zh:'我们在家庭会议上决定今年去济州岛旅行。'
  },{
    ko:'“가족 회의에서”와 “하기로 했어요”가 함께 의논한 뒤 이미 결정을 내렸음을 보여 줍니다.',
    ja:'「家族会議で」と「することにしました」が、話し合いの後ですでに決めたことを示します。',
    en:'“At the family meeting” and “decided” show that the choice was already made after discussion.',
    zh:'“在家庭会议上”和“决定”表明大家讨论后已经作出决定。'
  }),
  reviewedPlanStageItem('S04-II-G-PLAN-03','-(으)ㄹ까 하다','tentative','요즘 퇴근 후에 수영을 배울까 해요.',{
    ko:'요즘 퇴근 후에 수영을 배울까 해요.',ja:'最近、退勤後に水泳を習おうかと考えています。',en:'These days, I am thinking about taking swimming lessons after work.',zh:'最近我在考虑下班后学游泳。'
  },{
    ko:'“배울까 해요”는 아직 수영을 배우기로 결정하지 않고 생각 중임을 보여 줍니다.',
    ja:'「習おうかと考えています」は、まだ水泳を習うと決めず、検討中であることを示します。',
    en:'“Am thinking about” shows that the swimming plan is still under consideration, not decided.',
    zh:'“在考虑”表明学游泳这件事尚未决定，仍处在考虑阶段。'
  }),
  reviewedPlanStageItem('S04-II-G-PLAN-04','-(으)ㄹ 예정이다','scheduled','설명회는 다음 주 월요일에 열릴 예정입니다.',{
    ko:'설명회는 다음 주 월요일에 열릴 예정입니다.',ja:'説明会は来週の月曜日に開かれる予定です。',en:'The information session is scheduled for next Monday.',zh:'说明会定于下周一举行。'
  },{
    ko:'“다음 주 월요일”이라는 구체적 날짜가 행사 일정이 정해져 있음을 보여 줍니다.',
    ja:'「来週の月曜日」という具体的な日付が、行事の日程が決まっていることを示します。',
    en:'The specific date “next Monday” shows that the event is fixed on a schedule.',
    zh:'“下周一”这一具体日期表明活动已经列入确定的日程。'
  }),

  reviewedTimeRelationItem('S04-II-G-TIME-01','-자마자','immediate','집에 도착하자마자 손을 씻었어요.',{
    ko:'집에 도착하자마자 손을 씻었어요.',ja:'家に着くとすぐ手を洗いました。',en:'As soon as I got home, I washed my hands.',zh:'我一到家就洗了手。'
  },{
    ko:'“도착하자마자”가 도착 뒤에 시간 간격 없이 바로 손을 씻었음을 보여 줍니다.',
    ja:'「着くとすぐ」が、到着後に間を置かずすぐ手を洗ったことを示します。',
    en:'“As soon as I got home” shows that washing followed the arrival with no delay.',
    zh:'“一到家就”表明到家后没有间隔，马上洗了手。'
  }),
  reviewedTimeRelationItem('S04-II-G-TIME-02','-고 나서','afterCompletion','회의를 마치고 나서 보고서를 보냈어요.',{
    ko:'회의를 마치고 나서 보고서를 보냈어요.',ja:'会議を終えてから報告書を送りました。',en:'After finishing the meeting, I sent the report.',zh:'开完会后，我发送了报告。'
  },{
    ko:'“회의를 마치고 나서”가 회의를 끝낸 다음 보고서를 보냈다는 순서를 보여 줍니다.',
    ja:'「会議を終えてから」が、会議を完了した後に報告書を送った順序を示します。',
    en:'“After finishing the meeting” shows that the meeting was completed before the report was sent.',
    zh:'“开完会后”表明先结束会议，然后才发送报告。'
  }),
  reviewedTimeRelationItem('S04-II-G-TIME-03','-는 동안','overlap','기차를 기다리는 동안 책을 읽었어요.',{
    ko:'기차를 기다리는 동안 책을 읽었어요.',ja:'電車を待っている間、本を読みました。',en:'I read a book while waiting for the train.',zh:'等火车期间，我读了书。'
  },{
    ko:'“기차를 기다리는 동안”이 기다리는 시간과 책을 읽는 시간이 겹쳤음을 보여 줍니다.',
    ja:'「待っている間」が、電車を待つ時間と本を読む時間が重なっていたことを示します。',
    en:'“While waiting for the train” shows that waiting and reading overlapped in time.',
    zh:'“等火车期间”表明等待和读书发生在同一段时间里。'
  }),
  reviewedTimeRelationItem('S04-II-G-TIME-04','-기 전에','before','잠자기 전에 알람을 맞췄어요.',{
    ko:'잠자기 전에 알람을 맞췄어요.',ja:'寝る前にアラームをセットしました。',en:'Before going to bed, I set the alarm.',zh:'睡觉前，我设好了闹钟。'
  },{
    ko:'“잠자기 전에”가 잠드는 것보다 알람을 맞추는 행동이 먼저였음을 보여 줍니다.',
    ja:'「寝る前に」が、寝ることよりアラームをセットする行動が先だったことを示します。',
    en:'“Before going to bed” shows that setting the alarm happened first.',
    zh:'“睡觉前”表明设闹钟这一动作先于睡觉发生。'
  }),

  reviewedFormalRelationItem('S04-II-G-RELATION-01','-에 따르면','source','기상청 발표에 따르면 내일 비가 옵니다.',{
    ko:'기상청 발표에 따르면 내일 비가 옵니다.',ja:'気象庁の発表によると、明日は雨です。',en:'According to the weather agency announcement, it will rain tomorrow.',zh:'据气象厅发布的消息，明天会下雨。'
  },{
    ko:'“기상청 발표”가 내일 비가 온다는 정보의 출처이므로 “-에 따르면”이 맞습니다.',
    ja:'「気象庁の発表」が、明日は雨だという情報の出所なので「-에 따르면」が合います。',
    en:'“The weather agency announcement” is the source of the forecast, so -에 따르면 fits.',
    zh:'“气象厅发布的消息”是明天下雨这一信息的来源，所以应选“-에 따르면”。'
  }),
  reviewedFormalRelationItem('S04-II-G-RELATION-02','-에 따라(서)','standard','계절에 따라 해가 지는 시간이 달라집니다.',{
    ko:'계절에 따라 해가 지는 시간이 달라집니다.',ja:'季節によって、日が沈む時刻が変わります。',en:'The time the sun sets varies by season.',zh:'日落时间会随季节而变化。'
  },{
    ko:'계절이 바뀌면 해 지는 시간도 달라지므로 “계절”은 변화의 기준입니다.',
    ja:'季節が変わると日没時刻も変わるため、「季節」は変化の基準です。',
    en:'The sunset time changes when the season changes, so “season” is the varying standard.',
    zh:'季节变化时日落时间也会变化，因此“季节”是变化的基准。'
  }),
  reviewedFormalRelationItem('S04-II-G-RELATION-03','-을/를 통해(서)','channel','온라인 강의를 통해 한국어를 배웠습니다.',{
    ko:'온라인 강의를 통해 한국어를 배웠습니다.',ja:'オンライン講義を通じて韓国語を学びました。',en:'I learned Korean through online classes.',zh:'我通过在线课程学习了韩语。'
  },{
    ko:'“온라인 강의”는 한국어를 배우는 데 이용한 수단·경로이므로 “-을/를 통해(서)”가 맞습니다.',
    ja:'「オンライン講義」は韓国語を学ぶために使った手段・経路なので「-을/를 통해(서)」が合います。',
    en:'“Online classes” are the means used to learn Korean, so -을/를 통해(서) fits.',
    zh:'“在线课程”是学习韩语所使用的手段或渠道，所以应选“-을/를 통해(서)”。'
  }),
  reviewedFormalRelationItem('S04-II-G-RELATION-04','-에 의해(서)','agent','이 다리는 유명한 건축가에 의해 설계되었습니다.',{
    ko:'이 다리는 유명한 건축가에 의해 설계되었습니다.',ja:'この橋は有名な建築家によって設計されました。',en:'This bridge was designed by a famous architect.',zh:'这座桥由一位著名建筑师设计。'
  },{
    ko:'“설계되었습니다”는 피동이고 “유명한 건축가”는 설계한 주체이므로 “-에 의해(서)”가 맞습니다.',
    ja:'「設計されました」は受け身で、「有名な建築家」は設計した主体なので「-에 의해(서)」が合います。',
    en:'“Was designed” is passive, and “a famous architect” is the agent, so -에 의해(서) fits.',
    zh:'“被设计”是被动表达，“著名建筑师”是动作的施事者，所以应选“-에 의해(서)”。'
  }),

  reviewedDegreeComparisonItem('S04-II-G-DEGREE-01','-에 비해(서)','baseline','지난달에 비해 이번 달 매출이 늘었습니다.',{
    ko:'지난달에 비해 이번 달 매출이 늘었습니다.',ja:'先月に比べて、今月の売上が増えました。',en:'Compared with last month, sales increased this month.',zh:'与上个月相比，这个月的销售额增加了。'
  },{
    ko:'“지난달”과 “이번 달” 두 대상을 직접 비교해 매출 차이를 말하므로 “-에 비해(서)”가 맞습니다.',
    ja:'「先月」と「今月」の二つを直接比べて売上の差を述べるので「-에 비해(서)」が合います。',
    en:'The sentence directly compares last month with this month and states a sales difference, so -에 비해(서) fits.',
    zh:'句子直接比较“上个月”和“这个月”并说明销售额的差异，所以应选“-에 비해(서)”。'
  }),
  reviewedDegreeComparisonItem('S04-II-G-DEGREE-02','-에 못지않게','noLess','이 작품은 전작에 못지않게 인기가 많습니다.',{
    ko:'이 작품은 전작에 못지않게 인기가 많습니다.',ja:'この作品は前作に劣らず人気があります。',en:'This work is no less popular than the previous one.',zh:'这部作品的人气不逊于前作。'
  },{
    ko:'이 작품의 인기가 기준인 “전작”보다 뒤떨어지지 않는다고 하므로 “-에 못지않게”가 맞습니다.',
    ja:'この作品の人気が基準となる「前作」に劣らないと述べるので「-에 못지않게」が合います。',
    en:'The current work is said to be no less popular than the previous one, so -에 못지않게 fits.',
    zh:'句子表示这部作品的人气不逊于作为基准的“前作”，所以应选“-에 못지않게”。'
  }),
  reviewedDegreeComparisonItem('S04-II-G-DEGREE-03','-만큼','equal','동생은 형만큼 키가 큽니다.',{
    ko:'동생은 형만큼 키가 큽니다.',ja:'弟は兄と同じくらい背が高いです。',en:'The younger brother is as tall as his older brother.',zh:'弟弟和哥哥一样高。'
  },{
    ko:'동생의 키가 기준인 “형”과 같은 정도라고 하므로 “-만큼”이 맞습니다.',
    ja:'弟の背が基準となる「兄」と同じ程度だと述べるので「-만큼」が合います。',
    en:'The younger brother’s height is stated to equal the older brother’s, so -만큼 fits.',
    zh:'句子表示弟弟的身高与作为基准的“哥哥”相同，所以应选“-만큼”。'
  }),
  reviewedDegreeComparisonItem('S04-II-G-DEGREE-04','-(으)ㄹ 정도로','extent','목소리가 밖에서도 들릴 정도로 컸습니다.',{
    ko:'목소리가 밖에서도 들릴 정도로 컸습니다.',ja:'声は外でも聞こえるほど大きかったです。',en:'The voice was so loud that it could be heard outside.',zh:'声音大得连外面都能听见。'
  },{
    ko:'“밖에서도 들리다”라는 결과가 목소리가 얼마나 컸는지 보여 주므로 “-(으)ㄹ 정도로”가 맞습니다.',
    ja:'「外でも聞こえる」という結果が、声がどれほど大きかったかを示すので「-(으)ㄹ 정도로」が合います。',
    en:'The result “could be heard outside” shows how loud the voice was, so -(으)ㄹ 정도로 fits.',
    zh:'“连外面都能听见”这一结果体现了声音有多大，所以应选“-(으)ㄹ 정도로”。'
  })
];

window.MALBIT_SHORTS_DECKS={1:TOPIK_I,2:TOPIK_II};
})();
