// Original contextual transfer and retrieval supplements. Existing lesson IDs preserved.
window.HARUMAL_GRAMMAR_PACK_LEGACY_CORE = [
  {
    "id": "sentence-order",
    "supplement": true,
    "activities": [
      {
        "id": "sentence-order-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "처음 배우는 중립적인 주어-목적어-동사 순서로 말하세요.",
        "contextMeaning": {
          "ko": "처음 배우는 중립적인 주어-목적어-동사 순서로 말하세요.",
          "ja": "基本の中立的な主語・目的語・動詞の順にしてください。",
          "en": "Use the basic neutral subject–object–verb order.",
          "zh": "请使用基本中性语序：主语、宾语、动词。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "correct",
            "text": "저는 빵을 먹어요.",
            "feedback": {
              "ko": "기본 연습에서는 목적어 빵을 뒤에 서술어 먹어요를 둡니다. 회화의 뒤늦은 덧붙임과 구별하세요.",
              "ja": "基本練習では目的語빵을の後に述語먹어요を置きます。会話で後から付け足す場合とは区別します。",
              "en": "In this basic-order task, 먹어요 follows the object 빵을. This differs from a conversational afterthought.",
              "zh": "基本语序练习中，谓语먹어요放在宾语빵을之后，要与口语中的事后补充区分。"
            }
          },
          {
            "id": "distractor",
            "text": "저는 먹어요 빵을.",
            "feedback": {
              "ko": "기본 연습에서는 목적어 빵을 뒤에 서술어 먹어요를 둡니다. 회화의 뒤늦은 덧붙임과 구별하세요.",
              "ja": "基本練習では目的語빵을の後に述語먹어요を置きます。会話で後から付け足す場合とは区別します。",
              "en": "In this basic-order task, 먹어요 follows the object 빵을. This differs from a conversational afterthought.",
              "zh": "基本语序练习中，谓语먹어요放在宾语빵을之后，要与口语中的事后补充区分。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "기본 연습에서는 목적어 빵을 뒤에 서술어 먹어요를 둡니다. 회화의 뒤늦은 덧붙임과 구별하세요.",
          "ja": "基本練習では目的語빵을の後に述語먹어요を置きます。会話で後から付け足す場合とは区別します。",
          "en": "In this basic-order task, 먹어요 follows the object 빵을. This differs from a conversational afterthought.",
          "zh": "基本语序练习中，谓语먹어요放在宾语빵을之后，要与口语中的事后补充区分。"
        }
      },
      {
        "id": "sentence-order-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "저는 / 차를 / 마셔요 → 주어-목적어-동사 순서로 모두 쓰세요.",
        "contextMeaning": {
          "ko": "저는 / 차를 / 마셔요 → 주어-목적어-동사 순서로 모두 쓰세요.",
          "ja": "저는 / 차를 / 마셔요 → すべてを主語・目的語・動詞の順で使います。",
          "en": "저는 / 차를 / 마셔요 → Use all parts in subject–object–verb order.",
          "zh": "저는 / 차를 / 마셔요 → 全部使用，按主语、宾语、动词排序。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "저는 차를 마셔요",
          "저는 차를 마셔요."
        ],
        "explanation": {
          "ko": "저는 차를 마셔요 — 저는은 주어 쪽 화제, 차를은 목적어, 마셔요는 마지막 서술어입니다.",
          "ja": "저는 차를 마셔요 — 저는は主語側の話題、차를は目的語、마셔요は文末の述語です。",
          "en": "저는 차를 마셔요 — 저는 marks the subject-side topic; 차를 is the object; 마셔요 is the final predicate.",
          "zh": "저는 차를 마셔요 — 저는是主语侧的话题，차를是宾语，마셔요是句末谓语。"
        }
      },
      {
        "id": "sentence-order-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "처음 만난 사람에게 자신의 아침 식사 습관을 기본 어순으로 소개합니다.",
        "contextMeaning": {
          "ko": "처음 만난 사람에게 자신의 아침 식사 습관을 기본 어순으로 소개합니다.",
          "ja": "初対面の人に朝食の習慣を基本語順で紹介します。",
          "en": "Introduce your breakfast habit to someone new using basic word order.",
          "zh": "用基本语序向初次见面的人介绍早餐习惯。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 주어–목적어–서술어, 해요체\n제시어: 저는 / 아침에 / 과일을 / 먹다",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：主語–目的語–述語、ヘヨ体\n語句：저는 / 아침에 / 과일을 / 먹다",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: subject–object–predicate, polite 해요 style\nCues: 저는 / 아침에 / 과일을 / 먹다",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：主语–宾语–谓语，해요体\n提示词：저는 / 아침에 / 과일을 / 먹다"
        },
        "accepted": [
          "저는 아침에 과일을 먹어요"
        ],
        "explanation": {
          "ko": "저는 아침에 과일을 먹어요\n형태를 만드는 과정: 먹다 → 먹- + -어요; 서술어는 마지막",
          "ja": "저는 아침에 과일을 먹어요\n形の作り方：먹다 → 먹- + -어요; 述語は最後",
          "en": "저는 아침에 과일을 먹어요\nFormation: 먹다 → 먹- + -어요; predicate last",
          "zh": "저는 아침에 과일을 먹어요\n变形过程：먹다 → 먹- + -어요; 谓语在最后"
        }
      }
    ]
  },
  {
    "id": "sentence-omission",
    "supplement": true,
    "activities": [
      {
        "id": "sentence-omission-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "A가 B에게 어디에 가는지 물었습니다. B가 회사에 가요라고 답했어요. 생략된 주어는 누구인가요?",
        "contextMeaning": {
          "ko": "A가 B에게 어디에 가는지 물었습니다. B가 회사에 가요라고 답했어요. 생략된 주어는 누구인가요?",
          "ja": "AがBに行き先を聞き、Bが회사에 가요と答えました。省略された主語は誰ですか。",
          "en": "A asks B where B is going. B replies 회사에 가요. Who is the omitted subject?",
          "zh": "A问B去哪里，B回答회사에 가요。省略的主语是谁？"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "처음 등장하는 다른 사람",
            "feedback": {
              "ko": "질문에 답한 B 자신의 행선지임을 문맥이 알려 줍니다. 새로운 다른 사람은 근거가 없습니다.",
              "ja": "文脈からB本人の行き先と分かります。新しい他人と考える根拠はありません。",
              "en": "The context identifies B as the person going. There is no evidence of a new third person.",
              "zh": "语境表明去公司的是B本人，没有依据引入另一个新人物。"
            }
          },
          {
            "id": "correct",
            "text": "B 자신",
            "feedback": {
              "ko": "질문에 답한 B 자신의 행선지임을 문맥이 알려 줍니다. 새로운 다른 사람은 근거가 없습니다.",
              "ja": "文脈からB本人の行き先と分かります。新しい他人と考える根拠はありません。",
              "en": "The context identifies B as the person going. There is no evidence of a new third person.",
              "zh": "语境表明去公司的是B本人，没有依据引入另一个新人物。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "질문에 답한 B 자신의 행선지임을 문맥이 알려 줍니다. 새로운 다른 사람은 근거가 없습니다.",
          "ja": "文脈からB本人の行き先と分かります。新しい他人と考える根拠はありません。",
          "en": "The context identifies B as the person going. There is no evidence of a new third person.",
          "zh": "语境表明去公司的是B本人，没有依据引入另一个新人物。"
        }
      },
      {
        "id": "sentence-omission-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "A: 뭐 먹어요? B: 저는 사과를 먹어요. → B 자신의 이야기임이 분명해요. 주어 저는만 생략하세요.",
        "contextMeaning": {
          "ko": "A: 뭐 먹어요? B: 저는 사과를 먹어요. → B 자신의 이야기임이 분명해요. 주어 저는만 생략하세요.",
          "ja": "A: 뭐 먹어요? B: 저는 사과를 먹어요. → B自身の話だと明らかです。저는だけ省略します。",
          "en": "A: 뭐 먹어요? B: 저는 사과를 먹어요. → B clearly refers to themself. Omit only 저는.",
          "zh": "A: 뭐 먹어요? B: 저는 사과를 먹어요. → 明确是B在说自己，请仅省略저는。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "사과를 먹어요",
          "사과를 먹어요."
        ],
        "explanation": {
          "ko": "사과를 먹어요 — 주어 저는만 지우고 목적어 사과를과 서술어 먹어요는 유지합니다.",
          "ja": "사과를 먹어요 — 主語저는だけ除き、사과를と먹어요は残します。",
          "en": "사과를 먹어요 — Remove only 저는; keep 사과를 and 먹어요.",
          "zh": "사과를 먹어요 — 只去掉저는，保留사과를和먹어요。"
        }
      },
      {
        "id": "sentence-omission-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "상대가 나에게 아침으로 무엇을 먹는지 묻습니다. 내가 먹는다는 것은 분명하므로 주어를 덧붙이지 않고 답합니다.",
        "contextMeaning": {
          "ko": "상대가 나에게 아침으로 무엇을 먹는지 묻습니다. 내가 먹는다는 것은 분명하므로 주어를 덧붙이지 않고 답합니다.",
          "ja": "相手が自分の朝食を尋ねます。自分の話だと明らかなので主語を加えず答えます。",
          "en": "Someone asks what you eat for breakfast. The subject is clearly you, so answer without adding it.",
          "zh": "对方问你的早餐，明确是在说自己，因此不加主语回答。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 주어 생략, 을/를 사용, 해요체\n제시어: 빵 / 먹다",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：主語を省略、을/를を使用、ヘヨ体\n語句：빵 / 먹다",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: omit the subject, use 을/를, polite 해요 style\nCues: 빵 / 먹다",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：省略主语，使用을/를，해요体\n提示词：빵 / 먹다"
        },
        "accepted": [
          "빵을 먹어요"
        ],
        "explanation": {
          "ko": "빵을 먹어요\n형태를 만드는 과정: 빵 + 을; 먹다 → 먹어요; 주어는 문맥으로 생략",
          "ja": "빵을 먹어요\n形の作り方：빵 + 을; 먹다 → 먹어요; 主語は文脈から省略",
          "en": "빵을 먹어요\nFormation: 빵 + 을; 먹다 → 먹어요; subject omitted from context",
          "zh": "빵을 먹어요\n变形过程：빵 + 을; 먹다 → 먹어요; 根据语境省略主语"
        }
      }
    ]
  },
  {
    "id": "copula",
    "supplement": true,
    "activities": [
      {
        "id": "copula-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "직업이 의사예요. 의사는 모음으로 끝납니다. 올바른 명사문을 고르세요.",
        "contextMeaning": {
          "ko": "직업이 의사예요. 의사는 모음으로 끝납니다. 올바른 명사문을 고르세요.",
          "ja": "職業は医師です。의사は母音で終わります。正しい名詞文を選びます。",
          "en": "The occupation is doctor. 의사 ends in a vowel. Choose the correct noun sentence.",
          "zh": "职业是医生，의사以元音结尾，请选正确名词句。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "correct",
            "text": "저는 의사예요.",
            "feedback": {
              "ko": "받침 없는 의사 뒤에는 예요를 붙입니다. 받침 있는 명사에는 이에요를 씁니다.",
              "ja": "パッチムのない의사には예요です。パッチムがある名詞は이에요です。",
              "en": "의사 has no final consonant, so use 예요. Consonant-final nouns take 이에요.",
              "zh": "의사没有收音，接예요；有收音的名词接이에요。"
            }
          },
          {
            "id": "distractor",
            "text": "저는 의사이에요.",
            "feedback": {
              "ko": "받침 없는 의사 뒤에는 예요를 붙입니다. 받침 있는 명사에는 이에요를 씁니다.",
              "ja": "パッチムのない의사には예요です。パッチムがある名詞は이에요です。",
              "en": "의사 has no final consonant, so use 예요. Consonant-final nouns take 이에요.",
              "zh": "의사没有收音，接예요；有收音的名词接이에요。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "받침 없는 의사 뒤에는 예요를 붙입니다. 받침 있는 명사에는 이에요를 씁니다.",
          "ja": "パッチムのない의사には예요です。パッチムがある名詞は이에요です。",
          "en": "의사 has no final consonant, so use 예요. Consonant-final nouns take 이에요.",
          "zh": "의사没有收音，接예요；有收音的名词接이에요。"
        }
      },
      {
        "id": "copula-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "친구 + 이에요/예요 → 알맞은 명사문 형태만 쓰세요.",
        "contextMeaning": {
          "ko": "친구 + 이에요/예요 → 알맞은 명사문 형태만 쓰세요.",
          "ja": "친구 + 이에요/예요 → 正しい名詞文の形を書きます。",
          "en": "친구 + 이에요/예요 → Write the correct noun-predicate form.",
          "zh": "친구 + 이에요/예요 → 写出正确名词谓语形式。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "친구예요",
          "친구예요."
        ],
        "explanation": {
          "ko": "친구예요 — 친구는 모음으로 끝나므로 친구예요입니다. 친구이예요가 아닙니다.",
          "ja": "친구예요 — 친구は母音で終わるので친구예요です。친구이예요ではありません。",
          "en": "친구예요 — 친구 ends in a vowel: 친구예요, not 친구이예요.",
          "zh": "친구예요 — 친구以元音结尾，正确形式为친구예요，不是친구이예요。"
        }
      },
      {
        "id": "copula-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "가족사진에서 한 사람을 가리키며 그 사람이 자신의 동생임을 소개합니다.",
        "contextMeaning": {
          "ko": "가족사진에서 한 사람을 가리키며 그 사람이 자신의 동생임을 소개합니다.",
          "ja": "家族写真の一人を指し、自分の弟・妹だと紹介します。",
          "en": "Point to someone in a family photo and introduce them as your younger sibling.",
          "zh": "指着家庭照片中的一个人，介绍是自己的弟弟或妹妹。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 이에요/예요\n제시어: 이 사람은 / 제 동생",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：이에요/예요\n語句：이 사람은 / 제 동생",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: 이에요/예요\nCues: 이 사람은 / 제 동생",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：이에요/예요\n提示词：이 사람은 / 제 동생"
        },
        "accepted": [
          "이 사람은 제 동생이에요"
        ],
        "explanation": {
          "ko": "이 사람은 제 동생이에요\n형태를 만드는 과정: 동생 + 이에요 (받침 뒤)",
          "ja": "이 사람은 제 동생이에요\n形の作り方：동생 + 이에요 (パッチムの後)",
          "en": "이 사람은 제 동생이에요\nFormation: 동생 + 이에요 (after a final consonant)",
          "zh": "이 사람은 제 동생이에요\n变形过程：동생 + 이에요 (收音后)"
        }
      }
    ]
  },
  {
    "id": "not-copula",
    "supplement": true,
    "activities": [
      {
        "id": "not-copula-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "이 장소는 학교가 아니라 병원입니다. 학교라는 정체를 부정하세요.",
        "contextMeaning": {
          "ko": "이 장소는 학교가 아니라 병원입니다. 학교라는 정체를 부정하세요.",
          "ja": "ここは学校ではなく病院です。学校だということを否定します。",
          "en": "This place is a hospital, not a school. Deny that it is a school.",
          "zh": "这里是医院而非学校，请否定学校这一身份。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "여기는 학교를 아니에요.",
            "feedback": {
              "ko": "아니다 앞의 부정할 명사에는 이/가를 붙입니다. 목적격 을/를이 아닙니다.",
              "ja": "아니다の前で否定する名詞には이/가を付け、을/를ではありません。",
              "en": "The rejected noun before 아니다 takes 이/가, not object marker 을/를.",
              "zh": "아니다前被否定的名词接이/가，不接宾格을/를。"
            }
          },
          {
            "id": "correct",
            "text": "여기는 학교가 아니에요.",
            "feedback": {
              "ko": "아니다 앞의 부정할 명사에는 이/가를 붙입니다. 목적격 을/를이 아닙니다.",
              "ja": "아니다の前で否定する名詞には이/가を付け、을/를ではありません。",
              "en": "The rejected noun before 아니다 takes 이/가, not object marker 을/를.",
              "zh": "아니다前被否定的名词接이/가，不接宾格을/를。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "아니다 앞의 부정할 명사에는 이/가를 붙입니다. 목적격 을/를이 아닙니다.",
          "ja": "아니다の前で否定する名詞には이/가を付け、을/를ではありません。",
          "en": "The rejected noun before 아니다 takes 이/가, not object marker 을/를.",
          "zh": "아니다前被否定的名词接이/가，不接宾格을/를。"
        }
      },
      {
        "id": "not-copula-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "가수 → 가수가 아님을 해요체로 쓰세요. 주어는 덧붙이지 마세요.",
        "contextMeaning": {
          "ko": "가수 → 가수가 아님을 해요체로 쓰세요. 주어는 덧붙이지 마세요.",
          "ja": "가수 → 歌手ではないとヘヨ体で書きます。主語は加えません。",
          "en": "가수 → Write that someone is not a singer in 해요 style. Do not add a subject.",
          "zh": "가수 → 用해요体写不是歌手，不加主语。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "가수가 아니에요",
          "가수가 아니에요."
        ],
        "explanation": {
          "ko": "가수가 아니에요 — 가수는 모음으로 끝나므로 가를 붙이고 아니에요를 씁니다.",
          "ja": "가수가 아니에요 — 가수は母音で終わるので가を付けて아니에요を使います。",
          "en": "가수가 아니에요 — 가수 ends in a vowel, so add 가 and 아니에요.",
          "zh": "가수가 아니에요 — 가수以元音结尾，接가再加아니에요。"
        }
      },
      {
        "id": "not-copula-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "상대가 사무실을 교실로 착각했습니다. 이곳이 교실이라는 말을 부정합니다.",
        "contextMeaning": {
          "ko": "상대가 사무실을 교실로 착각했습니다. 이곳이 교실이라는 말을 부정합니다.",
          "ja": "相手が事務所を教室と勘違いしたので、その認識を否定します。",
          "en": "Someone mistakes the office for a classroom. Deny that this is a classroom.",
          "zh": "对方误把办公室当教室，请否定这里是教室。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 이/가 아니에요\n제시어: 여기는 / 교실 / 아니다",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：이/가 아니에요\n語句：여기는 / 교실 / 아니다",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: 이/가 아니에요\nCues: 여기는 / 교실 / 아니다",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：이/가 아니에요\n提示词：여기는 / 교실 / 아니다"
        },
        "accepted": [
          "여기는 교실이 아니에요"
        ],
        "explanation": {
          "ko": "여기는 교실이 아니에요\n형태를 만드는 과정: 교실 + 이; 아니다 → 아니에요",
          "ja": "여기는 교실이 아니에요\n形の作り方：교실 + 이; 아니다 → 아니에요",
          "en": "여기는 교실이 아니에요\nFormation: 교실 + 이; 아니다 → 아니에요",
          "zh": "여기는 교실이 아니에요\n变形过程：교실 + 이; 아니다 → 아니에요"
        }
      }
    ]
  },
  {
    "id": "question-words",
    "supplement": true,
    "activities": [
      {
        "id": "question-words-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "친구가 늦은 이유를 알고 싶습니다. 방법이 아니라 이유를 물으세요.",
        "contextMeaning": {
          "ko": "친구가 늦은 이유를 알고 싶습니다. 방법이 아니라 이유를 물으세요.",
          "ja": "友だちが遅れた理由を知りたいです。方法ではなく理由を尋ねます。",
          "en": "You want to know the reason your friend was late. Ask why, not how.",
          "zh": "你想知道朋友迟到的原因，请问原因而非方法。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "correct",
            "text": "왜 늦었어요?",
            "feedback": {
              "ko": "왜는 이유, 어떻게는 방법이나 양상을 묻습니다. 이 문맥에서는 이유가 목표입니다.",
              "ja": "왜は理由、어떻게は方法や様子です。ここでは理由を尋ねます。",
              "en": "왜 asks the reason; 어떻게 asks manner or method. The target is a reason.",
              "zh": "왜问原因，어떻게问方法或方式，本题目标是原因。"
            }
          },
          {
            "id": "distractor",
            "text": "어떻게 늦었어요?",
            "feedback": {
              "ko": "왜는 이유, 어떻게는 방법이나 양상을 묻습니다. 이 문맥에서는 이유가 목표입니다.",
              "ja": "왜は理由、어떻게は方法や様子です。ここでは理由を尋ねます。",
              "en": "왜 asks the reason; 어떻게 asks manner or method. The target is a reason.",
              "zh": "왜问原因，어떻게问方法或方式，本题目标是原因。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "왜는 이유, 어떻게는 방법이나 양상을 묻습니다. 이 문맥에서는 이유가 목표입니다.",
          "ja": "왜は理由、어떻게は方法や様子です。ここでは理由を尋ねます。",
          "en": "왜 asks the reason; 어떻게 asks manner or method. The target is a reason.",
          "zh": "왜问原因，어떻게问方法或方式，本题目标是原因。"
        }
      },
      {
        "id": "question-words-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "학교의 위치를 물어요. 학교가 ___에 있어요? 빈칸의 의문사만 쓰세요.",
        "contextMeaning": {
          "ko": "학교의 위치를 물어요. 학교가 ___에 있어요? 빈칸의 의문사만 쓰세요.",
          "ja": "学校の場所を尋ねます。학교가 ___에 있어요? 空欄の疑問詞だけ書きます。",
          "en": "Ask the school’s location: 학교가 ___에 있어요? Write only the question word.",
          "zh": "询问学校位置：학교가 ___에 있어요? 只填写疑问词。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "어디",
          "어디."
        ],
        "explanation": {
          "ko": "어디 — 위치를 물을 때 어디를 씁니다. 에는 이미 문장에 있어요.",
          "ja": "어디 — 場所には어디を使います。에は文にすでにあります。",
          "en": "어디 — 어디 asks location; 에 is already supplied in the sentence.",
          "zh": "어디 — 位置用어디，句中已经有에。"
        }
      },
      {
        "id": "question-words-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "공항에 가는 방법을 모릅니다. 이유나 장소가 아니라 이동 방법을 질문합니다.",
        "contextMeaning": {
          "ko": "공항에 가는 방법을 모릅니다. 이유나 장소가 아니라 이동 방법을 질문합니다.",
          "ja": "空港への行き方が分かりません。理由や場所ではなく方法を尋ねます。",
          "en": "You do not know how to reach the airport. Ask about the method, not the reason or place.",
          "zh": "不知道如何去机场，请问方法而非原因或地点。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 해요체 질문\n제시어: 공항에 / 어떻게 / 가다",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：ヘヨ体の質問\n語句：공항에 / 어떻게 / 가다",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: question in polite 해요 style\nCues: 공항에 / 어떻게 / 가다",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：해요体问句\n提示词：공항에 / 어떻게 / 가다"
        },
        "accepted": [
          "공항에 어떻게 가요?"
        ],
        "explanation": {
          "ko": "공항에 어떻게 가요?\n형태를 만드는 과정: 가다 → 가요; 어떻게는 방법 질문",
          "ja": "공항에 어떻게 가요?\n形の作り方：가다 → 가요; 어떻게は方法の質問",
          "en": "공항에 어떻게 가요?\nFormation: 가다 → 가요; 어떻게 asks how",
          "zh": "공항에 어떻게 가요?\n变形过程：가다 → 가요; 어떻게询问方法"
        }
      }
    ]
  },
  {
    "id": "topic",
    "supplement": true,
    "activities": [
      {
        "id": "topic-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "커피와 차를 대조합니다. 커피에 대조 화제 조사를 붙이세요.",
        "contextMeaning": {
          "ko": "커피와 차를 대조합니다. 커피에 대조 화제 조사를 붙이세요.",
          "ja": "コーヒーとお茶を対比します。커피に対比の話題助詞を付けます。",
          "en": "Contrast coffee with tea. Mark 커피 as a contrastive topic.",
          "zh": "比较咖啡与茶，请给커피加对比话题助词。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "커피를 좋아하지만 차는 안 좋아해요.",
            "feedback": {
              "ko": "요청한 대조 화제는 는입니다. 를 문장도 가능하지만 목적어 표시이며 요청한 대조 표지는 아닙니다.",
              "ja": "指定された対比の話題は는です。를の文も可能ですが目的語を示し、指定の対比助詞ではありません。",
              "en": "는 explicitly marks the requested contrastive topic. 를 is grammatical but marks the object, not that requested topic marker.",
              "zh": "는明确标记题目要求的对比话题；를句也可成立，但标记宾语，并非所要求的话题助词。"
            }
          },
          {
            "id": "correct",
            "text": "커피는 좋아하지만 차는 안 좋아해요.",
            "feedback": {
              "ko": "요청한 대조 화제는 는입니다. 를 문장도 가능하지만 목적어 표시이며 요청한 대조 표지는 아닙니다.",
              "ja": "指定された対比の話題は는です。를の文も可能ですが目的語を示し、指定の対比助詞ではありません。",
              "en": "는 explicitly marks the requested contrastive topic. 를 is grammatical but marks the object, not that requested topic marker.",
              "zh": "는明确标记题目要求的对比话题；를句也可成立，但标记宾语，并非所要求的话题助词。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "요청한 대조 화제는 는입니다. 를 문장도 가능하지만 목적어 표시이며 요청한 대조 표지는 아닙니다.",
          "ja": "指定された対比の話題は는です。를の文も可能ですが目的語を示し、指定の対比助詞ではありません。",
          "en": "는 explicitly marks the requested contrastive topic. 를 is grammatical but marks the object, not that requested topic marker.",
          "zh": "는明确标记题目要求的对比话题；를句也可成立，但标记宾语，并非所要求的话题助词。"
        }
      },
      {
        "id": "topic-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "오늘 + 은/는 → 화제를 표시한 형태만 쓰세요.",
        "contextMeaning": {
          "ko": "오늘 + 은/는 → 화제를 표시한 형태만 쓰세요.",
          "ja": "오늘 + 은/는 → 話題を示す形だけ書きます。",
          "en": "오늘 + 은/는 → Write just the topic-marked form.",
          "zh": "오늘 + 은/는 → 只写话题标记形式。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "오늘은",
          "오늘은."
        ],
        "explanation": {
          "ko": "오늘은 — 오늘은 ㄹ 받침이 있으므로 은을 붙입니다.",
          "ja": "오늘은 — 오늘にはㄹパッチムがあるので은を付けます。",
          "en": "오늘은 — 오늘 ends in ㄹ, so attach 은.",
          "zh": "오늘은 — 오늘有ㄹ收音，因此接은。"
        }
      },
      {
        "id": "topic-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "월요일과 화요일의 일정을 대조합니다. 앞에는 바쁨, 뒤에는 한가함을 말합니다.",
        "contextMeaning": {
          "ko": "월요일과 화요일의 일정을 대조합니다. 앞에는 바쁨, 뒤에는 한가함을 말합니다.",
          "ja": "月曜と火曜の予定を対比し、前者は忙しく後者は暇だと述べます。",
          "en": "Contrast Monday and Tuesday: busy on the former, free on the latter.",
          "zh": "比较周一与周二的安排：前者忙，后者有空。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 은/는 대조\n제시어: 월요일 / 바쁘지만 / 화요일 / 한가해요",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：은/는で対比\n語句：월요일 / 바쁘지만 / 화요일 / 한가해요",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: contrast with 은/는\nCues: 월요일 / 바쁘지만 / 화요일 / 한가해요",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：用은/는对比\n提示词：월요일 / 바쁘지만 / 화요일 / 한가해요"
        },
        "accepted": [
          "월요일은 바쁘지만 화요일은 한가해요",
          "월요일은 바쁘지만, 화요일은 한가해요"
        ],
        "explanation": {
          "ko": "월요일은 바쁘지만 화요일은 한가해요\n형태를 만드는 과정: 월요일 + 은; 화요일 + 은 (받침 뒤)",
          "ja": "월요일은 바쁘지만 화요일은 한가해요\n形の作り方：월요일 + 은; 화요일 + 은 (パッチムの後)",
          "en": "월요일은 바쁘지만 화요일은 한가해요\nFormation: 월요일 + 은; 화요일 + 은 (after a final consonant)",
          "zh": "월요일은 바쁘지만 화요일은 한가해요\n变形过程：월요일 + 은; 화요일 + 은 (收音后)"
        }
      }
    ]
  },
  {
    "id": "subject",
    "supplement": true,
    "activities": [
      {
        "id": "subject-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "누가 왔어요?라는 질문에 새로 온 사람을 초점으로 답합니다.",
        "contextMeaning": {
          "ko": "누가 왔어요?라는 질문에 새로 온 사람을 초점으로 답합니다.",
          "ja": "누가 왔어요?への答えで、来た人物を新情報の焦点にします。",
          "en": "Answer 누가 왔어요? by focusing the person who arrived as new information.",
          "zh": "回答누가 왔어요?，以新到来的人为信息焦点。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "correct",
            "text": "민수가 왔어요.",
            "feedback": {
              "ko": "오다의 주체인 민수에 가를 붙입니다. 을/를은 이 문장의 주체를 표시하지 않습니다.",
              "ja": "오다の主体민수に가を付けます。을/를はこの文の主体を示しません。",
              "en": "민수 is the subject of 오다, so use 가. 을/를 does not mark that subject.",
              "zh": "민수是오다的主体，应接가；을/를不标记此处主语。"
            }
          },
          {
            "id": "distractor",
            "text": "민수를 왔어요.",
            "feedback": {
              "ko": "오다의 주체인 민수에 가를 붙입니다. 을/를은 이 문장의 주체를 표시하지 않습니다.",
              "ja": "오다の主体민수に가を付けます。을/를はこの文の主体を示しません。",
              "en": "민수 is the subject of 오다, so use 가. 을/를 does not mark that subject.",
              "zh": "민수是오다的主体，应接가；을/를不标记此处主语。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "오다의 주체인 민수에 가를 붙입니다. 을/를은 이 문장의 주체를 표시하지 않습니다.",
          "ja": "오다の主体민수に가を付けます。을/를はこの文の主体を示しません。",
          "en": "민수 is the subject of 오다, so use 가. 을/를 does not mark that subject.",
          "zh": "민수是오다的主体，应接가；을/를不标记此处主语。"
        }
      },
      {
        "id": "subject-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "꽃 + 이/가 → 주어 형태만 쓰세요.",
        "contextMeaning": {
          "ko": "꽃 + 이/가 → 주어 형태만 쓰세요.",
          "ja": "꽃 + 이/가 → 主語の形だけ書きます。",
          "en": "꽃 + 이/가 → Write only the subject-marked form.",
          "zh": "꽃 + 이/가 → 只写主语标记形式。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "꽃이",
          "꽃이."
        ],
        "explanation": {
          "ko": "꽃이 — 꽃에는 ㅊ 받침이 있으므로 이를 붙입니다.",
          "ja": "꽃이 — 꽃にはㅊパッチムがあるので이を付けます。",
          "en": "꽃이 — 꽃 ends in ㅊ, so attach 이.",
          "zh": "꽃이 — 꽃有ㅊ收音，因此接이。"
        }
      },
      {
        "id": "subject-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "창문을 연 사람이 누구냐는 질문에, 유나가 그 일을 했다고 답합니다.",
        "contextMeaning": {
          "ko": "창문을 연 사람이 누구냐는 질문에, 유나가 그 일을 했다고 답합니다.",
          "ja": "窓を開けたのは誰かと聞かれ、ユナがしたと答えます。",
          "en": "Asked who opened the window, answer that Yuna did.",
          "zh": "被问谁开了窗，回答是有娜。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 이/가 초점\n제시어: 유나 / 창문을 / 열었어요",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：이/가で焦点を示す\n語句：유나 / 창문을 / 열었어요",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: focus with 이/가\nCues: 유나 / 창문을 / 열었어요",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：用이/가标记焦点\n提示词：유나 / 창문을 / 열었어요"
        },
        "accepted": [
          "유나가 창문을 열었어요"
        ],
        "explanation": {
          "ko": "유나가 창문을 열었어요\n형태를 만드는 과정: 유나 + 가 (모음 뒤)",
          "ja": "유나가 창문을 열었어요\n形の作り方：유나 + 가 (母音の後)",
          "en": "유나가 창문을 열었어요\nFormation: 유나 + 가 (after a vowel)",
          "zh": "유나가 창문을 열었어요\n变形过程：유나 + 가 (元音后)"
        }
      }
    ]
  },
  {
    "id": "object",
    "supplement": true,
    "activities": [
      {
        "id": "object-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "책을 읽는 행동에서 읽는 대상을 표시합니다.",
        "contextMeaning": {
          "ko": "책을 읽는 행동에서 읽는 대상을 표시합니다.",
          "ja": "本を読む行為で、読む対象を示します。",
          "en": "Mark the thing being read in the action of reading a book.",
          "zh": "在读书这一动作中标记被读的对象。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "저는 책이 읽어요.",
            "feedback": {
              "ko": "읽는 대상 책은 목적어라 을을 붙입니다. 이 문맥에서 책은 읽는 사람이 아닙니다.",
              "ja": "読む対象책は目的語なので을です。ここで책は読む人ではありません。",
              "en": "책 is the object being read, so use 을. It is not the person doing the reading.",
              "zh": "책是被读的宾语，应接을，并非执行阅读的人。"
            }
          },
          {
            "id": "correct",
            "text": "저는 책을 읽어요.",
            "feedback": {
              "ko": "읽는 대상 책은 목적어라 을을 붙입니다. 이 문맥에서 책은 읽는 사람이 아닙니다.",
              "ja": "読む対象책は目的語なので을です。ここで책は読む人ではありません。",
              "en": "책 is the object being read, so use 을. It is not the person doing the reading.",
              "zh": "책是被读的宾语，应接을，并非执行阅读的人。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "읽는 대상 책은 목적어라 을을 붙입니다. 이 문맥에서 책은 읽는 사람이 아닙니다.",
          "ja": "読む対象책は目的語なので을です。ここで책は読む人ではありません。",
          "en": "책 is the object being read, so use 을. It is not the person doing the reading.",
          "zh": "책是被读的宾语，应接을，并非执行阅读的人。"
        }
      },
      {
        "id": "object-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "사과 + 을/를 → 목적어 형태만 쓰세요.",
        "contextMeaning": {
          "ko": "사과 + 을/를 → 목적어 형태만 쓰세요.",
          "ja": "사과 + 을/를 → 目的語の形だけ書きます。",
          "en": "사과 + 을/를 → Write only the object-marked form.",
          "zh": "사과 + 을/를 → 只写宾语标记形式。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "사과를",
          "사과를."
        ],
        "explanation": {
          "ko": "사과를 — 사과는 모음으로 끝나므로 를을 붙입니다.",
          "ja": "사과를 — 사과は母音で終わるので를です。",
          "en": "사과를 — 사과 ends in a vowel, so attach 를.",
          "zh": "사과를 — 사과以元音结尾，因此接를。"
        }
      },
      {
        "id": "object-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "아이의 행동을 관찰합니다. 아이가 마시는 대상은 우유입니다.",
        "contextMeaning": {
          "ko": "아이의 행동을 관찰합니다. 아이가 마시는 대상은 우유입니다.",
          "ja": "子どもの行動を観察しています。飲んでいるものは牛乳です。",
          "en": "Describe a child’s action: the thing being drunk is milk.",
          "zh": "观察孩子的行为，喝的对象是牛奶。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 을/를 + 해요체\n제시어: 아이가 / 우유 / 마시다",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：을/를＋ヘヨ体\n語句：아이가 / 우유 / 마시다",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: 을/를 + polite 해요 style\nCues: 아이가 / 우유 / 마시다",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：을/를＋해요体\n提示词：아이가 / 우유 / 마시다"
        },
        "accepted": [
          "아이가 우유를 마셔요",
          "아이가 우유를 마시어요"
        ],
        "explanation": {
          "ko": "아이가 우유를 마셔요\n형태를 만드는 과정: 우유 + 를; 마시다 → 마셔요",
          "ja": "아이가 우유를 마셔요\n形の作り方：우유 + 를; 마시다 → 마셔요",
          "en": "아이가 우유를 마셔요\nFormation: 우유 + 를; 마시다 → 마셔요",
          "zh": "아이가 우유를 마셔요\n变形过程：우유 + 를; 마시다 → 마셔요"
        }
      }
    ]
  },
  {
    "id": "destination-time",
    "supplement": true,
    "activities": [
      {
        "id": "destination-time-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "친구를 만나는 시각은 세 시입니다. 시각을 표시하세요.",
        "contextMeaning": {
          "ko": "친구를 만나는 시각은 세 시입니다. 시각을 표시하세요.",
          "ja": "友だちに会う時刻は3時です。時刻を示します。",
          "en": "You meet your friend at three o’clock. Mark that time.",
          "zh": "见朋友的时间是三点，请标记时刻。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "correct",
            "text": "세 시에 만나요.",
            "feedback": {
              "ko": "만나는 시각에는 에를 씁니다. 에서는 이 시각의 기본 표지가 아닙니다.",
              "ja": "会う時刻には에を使い、에서はこの時刻の基本助詞ではありません。",
              "en": "Use 에 for the meeting time. 에서 is not the basic time marker here.",
              "zh": "见面的时刻用에，에서不是此处的基本时间标记。"
            }
          },
          {
            "id": "distractor",
            "text": "세 시에서 만나요.",
            "feedback": {
              "ko": "만나는 시각에는 에를 씁니다. 에서는 이 시각의 기본 표지가 아닙니다.",
              "ja": "会う時刻には에を使い、에서はこの時刻の基本助詞ではありません。",
              "en": "Use 에 for the meeting time. 에서 is not the basic time marker here.",
              "zh": "见面的时刻用에，에서不是此处的基本时间标记。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "만나는 시각에는 에를 씁니다. 에서는 이 시각의 기본 표지가 아닙니다.",
          "ja": "会う時刻には에を使い、에서はこの時刻の基本助詞ではありません。",
          "en": "Use 에 for the meeting time. 에서 is not the basic time marker here.",
          "zh": "见面的时刻用에，에서不是此处的基本时间标记。"
        }
      },
      {
        "id": "destination-time-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "학교 + 에 → 도착점 조사와 함께 쓰세요.",
        "contextMeaning": {
          "ko": "학교 + 에 → 도착점 조사와 함께 쓰세요.",
          "ja": "학교 + 에 → 到着点の助詞を付けて書きます。",
          "en": "학교 + 에 → Write the destination-marked form.",
          "zh": "학교 + 에 → 写出加到达点助词的形式。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "학교에",
          "학교에."
        ],
        "explanation": {
          "ko": "학교에 — 가는 도착점 학교에 에를 붙여 학교에입니다.",
          "ja": "학교에 — 行き先학교に에を付けて학교에です。",
          "en": "학교에 — Add 에 to the destination 학교: 학교에.",
          "zh": "학교에 — 到达点학교接에，成为학교에。"
        }
      },
      {
        "id": "destination-time-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "출발 시각을 정오로 알려 줍니다. 시각에 알맞은 조사를 붙입니다.",
        "contextMeaning": {
          "ko": "출발 시각을 정오로 알려 줍니다. 시각에 알맞은 조사를 붙입니다.",
          "ja": "出発時刻が正午だと伝え、時刻に合う助詞を使います。",
          "en": "Tell someone the departure time is noon, marking the time appropriately.",
          "zh": "告知出发时间为中午，使用正确时间助词。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 시각 에\n제시어: 정오 / 출발해요",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：時刻の에\n語句：정오 / 출발해요",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: time marker 에\nCues: 정오 / 출발해요",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：时间助词에\n提示词：정오 / 출발해요"
        },
        "accepted": [
          "정오에 출발해요"
        ],
        "explanation": {
          "ko": "정오에 출발해요\n형태를 만드는 과정: 정오 + 에 (시각)",
          "ja": "정오에 출발해요\n形の作り方：정오 + 에 (時刻)",
          "en": "정오에 출발해요\nFormation: 정오 + 에 (time)",
          "zh": "정오에 출발해요\n变形过程：정오 + 에 (时刻)"
        }
      }
    ]
  },
  {
    "id": "action-place",
    "supplement": true,
    "activities": [
      {
        "id": "action-place-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "책을 읽는 행동이 도서관 안에서 이루어집니다. 행동 장소를 표시하세요.",
        "contextMeaning": {
          "ko": "책을 읽는 행동이 도서관 안에서 이루어집니다. 행동 장소를 표시하세요.",
          "ja": "本を読む行為が図書館内で行われます。行動の場所を示します。",
          "en": "The reading happens inside the library. Mark the place of the action.",
          "zh": "阅读发生在图书馆内，请标记动作场所。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "도서관에 책을 읽어요.",
            "feedback": {
              "ko": "읽는 행동이 이루어지는 장소에는 에서를 씁니다. 에는 존재 장소나 도착점 등에 쓰입니다.",
              "ja": "読む行為の場所には에서です。에は存在場所や到着点などです。",
              "en": "Use 에서 for the location where reading happens. 에 marks existence location or destination, among other uses.",
              "zh": "阅读动作发生的地点用에서；에可标记存在地点或到达点等。"
            }
          },
          {
            "id": "correct",
            "text": "도서관에서 책을 읽어요.",
            "feedback": {
              "ko": "읽는 행동이 이루어지는 장소에는 에서를 씁니다. 에는 존재 장소나 도착점 등에 쓰입니다.",
              "ja": "読む行為の場所には에서です。에は存在場所や到着点などです。",
              "en": "Use 에서 for the location where reading happens. 에 marks existence location or destination, among other uses.",
              "zh": "阅读动作发生的地点用에서；에可标记存在地点或到达点等。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "읽는 행동이 이루어지는 장소에는 에서를 씁니다. 에는 존재 장소나 도착점 등에 쓰입니다.",
          "ja": "読む行為の場所には에서です。에は存在場所や到着点などです。",
          "en": "Use 에서 for the location where reading happens. 에 marks existence location or destination, among other uses.",
          "zh": "阅读动作发生的地点用에서；에可标记存在地点或到达点等。"
        }
      },
      {
        "id": "action-place-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "공원 + 에서 → 행동 장소를 표시한 형태만 쓰세요.",
        "contextMeaning": {
          "ko": "공원 + 에서 → 행동 장소를 표시한 형태만 쓰세요.",
          "ja": "공원 + 에서 → 行動場所を示す形だけ書きます。",
          "en": "공원 + 에서 → Write only the action-location form.",
          "zh": "공원 + 에서 → 只写动作场所形式。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "공원에서",
          "공원에서."
        ],
        "explanation": {
          "ko": "공원에서 — 공원에서 운동해요처럼 행동 장소 공원에 에서를 붙입니다.",
          "ja": "공원에서 — 공원에서 운동해요のように、行動場所공원に에서を付けます。",
          "en": "공원에서 — Add 에서 to 공원 as in 공원에서 운동해요.",
          "zh": "공원에서 — 如공원에서 운동해요，把에서接在动作地点공원后。"
        }
      },
      {
        "id": "action-place-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "쉬는 행동을 하는 장소가 집이라고 말합니다. 도착점을 말하는 것이 아닙니다.",
        "contextMeaning": {
          "ko": "쉬는 행동을 하는 장소가 집이라고 말합니다. 도착점을 말하는 것이 아닙니다.",
          "ja": "休む行動の場所が家だと述べます。到着点ではありません。",
          "en": "Say the place where you rest is home, not a destination.",
          "zh": "说明休息发生的地方是家，而非到达点。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 행동 장소 에서\n제시어: 저는 / 집 / 쉬어요",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：行動場所の에서\n語句：저는 / 집 / 쉬어요",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: action-place marker 에서\nCues: 저는 / 집 / 쉬어요",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：动作场所助词에서\n提示词：저는 / 집 / 쉬어요"
        },
        "accepted": [
          "저는 집에서 쉬어요"
        ],
        "explanation": {
          "ko": "저는 집에서 쉬어요\n형태를 만드는 과정: 집 + 에서 (행동 장소)",
          "ja": "저는 집에서 쉬어요\n形の作り方：집 + 에서 (行動場所)",
          "en": "저는 집에서 쉬어요\nFormation: 집 + 에서 (place of action)",
          "zh": "저는 집에서 쉬어요\n变形过程：집 + 에서 (动作场所)"
        }
      }
    ]
  },
  {
    "id": "addition-limit",
    "supplement": true,
    "activities": [
      {
        "id": "addition-limit-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "친구는 갔고, 나 역시 갔습니다. 추가를 표시하세요.",
        "contextMeaning": {
          "ko": "친구는 갔고, 나 역시 갔습니다. 추가를 표시하세요.",
          "ja": "友だちが行き、自分も行きました。追加を示します。",
          "en": "Your friend went, and you went too. Mark addition.",
          "zh": "朋友去了，你也去了，请标记追加。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "correct",
            "text": "저도 갔어요.",
            "feedback": {
              "ko": "도는 다른 사람에 나도 포함합니다. 만은 나만으로 제한하여 문맥과 다릅니다.",
              "ja": "도は他の人に自分も加えます。만は自分だけに限定して文脈と違います。",
              "en": "도 includes you as well. 만 limits it to you alone and conflicts with the context.",
              "zh": "도把你也包括进去；만限制为只有你，与语境不符。"
            }
          },
          {
            "id": "distractor",
            "text": "저만 갔어요.",
            "feedback": {
              "ko": "도는 다른 사람에 나도 포함합니다. 만은 나만으로 제한하여 문맥과 다릅니다.",
              "ja": "도は他の人に自分も加えます。만は自分だけに限定して文脈と違います。",
              "en": "도 includes you as well. 만 limits it to you alone and conflicts with the context.",
              "zh": "도把你也包括进去；만限制为只有你，与语境不符。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "도는 다른 사람에 나도 포함합니다. 만은 나만으로 제한하여 문맥과 다릅니다.",
          "ja": "도は他の人に自分も加えます。만は自分だけに限定して文脈と違います。",
          "en": "도 includes you as well. 만 limits it to you alone and conflicts with the context.",
          "zh": "도把你也包括进去；만限制为只有你，与语境不符。"
        }
      },
      {
        "id": "addition-limit-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "물 + 만 → 물로만 한정한 형태를 쓰세요.",
        "contextMeaning": {
          "ko": "물 + 만 → 물로만 한정한 형태를 쓰세요.",
          "ja": "물 + 만 → 水だけに限定した形を書きます。",
          "en": "물 + 만 → Write the form limiting the choice to water.",
          "zh": "물 + 만 → 写出限定为只有水的形式。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "물만",
          "물만."
        ],
        "explanation": {
          "ko": "물만 — 명사 물에 한정 조사 만을 붙여 물만입니다.",
          "ja": "물만 — 名詞물に限定助詞만を付けて물만です。",
          "en": "물만 — Attach limiting 만 to 물: 물만.",
          "zh": "물만 — 名词물接限定助词만，成为물만。"
        }
      },
      {
        "id": "addition-limit-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "오늘 마실 것은 차 하나로 제한합니다. 다른 음료는 포함하지 않습니다.",
        "contextMeaning": {
          "ko": "오늘 마실 것은 차 하나로 제한합니다. 다른 음료는 포함하지 않습니다.",
          "ja": "今日飲むものをお茶だけに限定し、ほかの飲み物は含めません。",
          "en": "Limit today’s drinks to tea, excluding other drinks.",
          "zh": "将今天喝的东西限定为茶，不包括其他饮料。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 한정 만\n제시어: 오늘은 / 차 / 마셔요",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：限定の만\n語句：오늘은 / 차 / 마셔요",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: restriction with 만\nCues: 오늘은 / 차 / 마셔요",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：限定助词만\n提示词：오늘은 / 차 / 마셔요"
        },
        "accepted": [
          "오늘은 차만 마셔요"
        ],
        "explanation": {
          "ko": "오늘은 차만 마셔요\n형태를 만드는 과정: 차 + 만 (한정)",
          "ja": "오늘은 차만 마셔요\n形の作り方：차 + 만 (限定)",
          "en": "오늘은 차만 마셔요\nFormation: 차 + 만 (restriction)",
          "zh": "오늘은 차만 마셔요\n变形过程：차 + 만 (限定)"
        }
      }
    ]
  },
  {
    "id": "and-particles",
    "supplement": true,
    "activities": [
      {
        "id": "and-particles-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "사과와 배 두 종류를 모두 샀습니다. 와/과로 나열하세요.",
        "contextMeaning": {
          "ko": "사과와 배 두 종류를 모두 샀습니다. 와/과로 나열하세요.",
          "ja": "リンゴと梨の両方を買いました。와/과で並べます。",
          "en": "You bought both apples and pears. List them with 와/과.",
          "zh": "买了苹果和梨两种水果，请用와/과并列。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "사과과 배를 샀어요.",
            "feedback": {
              "ko": "사과는 모음으로 끝나므로 와를 씁니다. 받침 뒤에는 과입니다.",
              "ja": "사과は母音で終わるので와です。パッチム後は과です。",
              "en": "사과 ends in a vowel, so use 와; 과 follows a final consonant.",
              "zh": "사과以元音结尾，接와；有收音时接과。"
            }
          },
          {
            "id": "correct",
            "text": "사과와 배를 샀어요.",
            "feedback": {
              "ko": "사과는 모음으로 끝나므로 와를 씁니다. 받침 뒤에는 과입니다.",
              "ja": "사과は母音で終わるので와です。パッチム後は과です。",
              "en": "사과 ends in a vowel, so use 와; 과 follows a final consonant.",
              "zh": "사과以元音结尾，接와；有收音时接과。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "사과는 모음으로 끝나므로 와를 씁니다. 받침 뒤에는 과입니다.",
          "ja": "사과は母音で終わるので와です。パッチム後は과です。",
          "en": "사과 ends in a vowel, so use 와; 과 follows a final consonant.",
          "zh": "사과以元音结尾，接와；有收音时接과。"
        }
      },
      {
        "id": "and-particles-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "책 + 와/과 → 알맞은 연결 조사만 붙이세요.",
        "contextMeaning": {
          "ko": "책 + 와/과 → 알맞은 연결 조사만 붙이세요.",
          "ja": "책 + 와/과 → 正しい接続助詞を付けます。",
          "en": "책 + 와/과 → Attach the correct linking particle.",
          "zh": "책 + 와/과 → 接上正确连接助词。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "책과",
          "책과."
        ],
        "explanation": {
          "ko": "책과 — 책은 ㄱ 받침이 있으므로 과를 붙입니다.",
          "ja": "책과 — 책にはㄱパッチムがあるので과です。",
          "en": "책과 — 책 ends in ㄱ, so attach 과.",
          "zh": "책과 — 책有ㄱ收音，因此接과。"
        }
      },
      {
        "id": "and-particles-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "장보기에서 양파와 당근 두 가지를 모두 샀다고 말합니다.",
        "contextMeaning": {
          "ko": "장보기에서 양파와 당근 두 가지를 모두 샀다고 말합니다.",
          "ja": "買い物で玉ねぎとにんじんの両方を買ったと伝えます。",
          "en": "Say you bought both onions and carrots while shopping.",
          "zh": "说购物时买了洋葱和胡萝卜两种。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 와/과 나열\n제시어: 양파 / 당근을 / 샀어요",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：와/과で並列\n語句：양파 / 당근을 / 샀어요",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: listing with 와/과\nCues: 양파 / 당근을 / 샀어요",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：用와/과并列\n提示词：양파 / 당근을 / 샀어요"
        },
        "accepted": [
          "양파와 당근을 샀어요"
        ],
        "explanation": {
          "ko": "양파와 당근을 샀어요\n형태를 만드는 과정: 양파 + 와 (모음 뒤)",
          "ja": "양파와 당근을 샀어요\n形の作り方：양파 + 와 (母音の後)",
          "en": "양파와 당근을 샀어요\nFormation: 양파 + 와 (after a vowel)",
          "zh": "양파와 당근을 샀어요\n变形过程：양파 + 와 (元音后)"
        }
      }
    ]
  },
  {
    "id": "possessive",
    "supplement": true,
    "activities": [
      {
        "id": "possessive-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "이 가방의 주인은 친구입니다. 소유 관계를 의로 나타내세요.",
        "contextMeaning": {
          "ko": "이 가방의 주인은 친구입니다. 소유 관계를 의로 나타내세요.",
          "ja": "このかばんの持ち主は友だちです。所有関係を의で表します。",
          "en": "This bag belongs to your friend. Mark possession with 의.",
          "zh": "这个包属于朋友，请用의表示所属关系。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "correct",
            "text": "친구의 가방이에요.",
            "feedback": {
              "ko": "소유자인 친구와 물건 가방을 의로 연결합니다. 를은 소유 조사가 아닙니다.",
              "ja": "持ち主친구と物가방を의でつなぎます。를は所有の助詞ではありません。",
              "en": "의 links the owner 친구 to the bag 가방. 를 does not mark possession.",
              "zh": "의连接所有者친구与物品가방；를不是所属助词。"
            }
          },
          {
            "id": "distractor",
            "text": "친구를 가방이에요.",
            "feedback": {
              "ko": "소유자인 친구와 물건 가방을 의로 연결합니다. 를은 소유 조사가 아닙니다.",
              "ja": "持ち主친구と物가방を의でつなぎます。를は所有の助詞ではありません。",
              "en": "의 links the owner 친구 to the bag 가방. 를 does not mark possession.",
              "zh": "의连接所有者친구与物品가방；를不是所属助词。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "소유자인 친구와 물건 가방을 의로 연결합니다. 를은 소유 조사가 아닙니다.",
          "ja": "持ち主친구と物가방を의でつなぎます。를は所有の助詞ではありません。",
          "en": "의 links the owner 친구 to the bag 가방. 를 does not mark possession.",
          "zh": "의连接所有者친구与物品가방；를不是所属助词。"
        }
      },
      {
        "id": "possessive-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "언니 + 의 + 책 → 소유 관계를 그대로 쓰세요.",
        "contextMeaning": {
          "ko": "언니 + 의 + 책 → 소유 관계를 그대로 쓰세요.",
          "ja": "언니 + 의 + 책 → 所有関係を書きます。",
          "en": "언니 + 의 + 책 → Write the possessive noun phrase.",
          "zh": "언니 + 의 + 책 → 写出所属名词短语。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "언니의 책",
          "언니의 책."
        ],
        "explanation": {
          "ko": "언니의 책 — 언니에 의를 붙이고 책 앞에 놓습니다. 의는 앞말에 붙여 씁니다.",
          "ja": "언니의 책 — 언니に의を付けて책の前に置きます。의は前の語と続けて書きます。",
          "en": "언니의 책 — Attach 의 to 언니 and place it before 책. 의 is written with the preceding noun.",
          "zh": "언니의 책 — 将의接在언니后，放在책前；의与前面的名词连写。"
        }
      },
      {
        "id": "possessive-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "가방의 주인이 동생임을 의를 사용하여 말합니다.",
        "contextMeaning": {
          "ko": "가방의 주인이 동생임을 의를 사용하여 말합니다.",
          "ja": "かばんの持ち主が弟・妹だと의を使って述べます。",
          "en": "Use 의 to say the bag belongs to your younger sibling.",
          "zh": "用의说明包属于弟弟或妹妹。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 소유 의\n제시어: 이것은 / 동생 / 가방이에요",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：所有の의\n語句：이것은 / 동생 / 가방이에요",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: possession with 의\nCues: 이것은 / 동생 / 가방이에요",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：所属助词의\n提示词：이것은 / 동생 / 가방이에요"
        },
        "accepted": [
          "이것은 동생의 가방이에요"
        ],
        "explanation": {
          "ko": "이것은 동생의 가방이에요\n형태를 만드는 과정: 동생 + 의 → 동생의",
          "ja": "이것은 동생의 가방이에요\n形の作り方：동생 + 의 → 동생의",
          "en": "이것은 동생의 가방이에요\nFormation: 동생 + 의 → 동생의",
          "zh": "이것은 동생의 가방이에요\n变形过程：동생 + 의 → 동생의"
        }
      }
    ]
  },
  {
    "id": "direction-tool",
    "supplement": true,
    "activities": [
      {
        "id": "direction-tool-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "문을 여는 도구는 열쇠입니다. 도구를 표시하세요.",
        "contextMeaning": {
          "ko": "문을 여는 도구는 열쇠입니다. 도구를 표시하세요.",
          "ja": "ドアを開ける道具は鍵です。道具を示します。",
          "en": "The tool for opening the door is a key. Mark the tool.",
          "zh": "开门工具是钥匙，请标记工具。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "열쇠에게 문을 열어요.",
            "feedback": {
              "ko": "도구 열쇠에는 (으)로를 씁니다. 에게는 사람 등의 상대를 표시합니다.",
              "ja": "道具열쇠には(으)로を使います。에게は人などの相手です。",
              "en": "The tool 열쇠 takes (으)로. 에게 marks a recipient such as a person.",
              "zh": "工具열쇠接(으)로；에게标记人等接受对象。"
            }
          },
          {
            "id": "correct",
            "text": "열쇠로 문을 열어요.",
            "feedback": {
              "ko": "도구 열쇠에는 (으)로를 씁니다. 에게는 사람 등의 상대를 표시합니다.",
              "ja": "道具열쇠には(으)로を使います。에게は人などの相手です。",
              "en": "The tool 열쇠 takes (으)로. 에게 marks a recipient such as a person.",
              "zh": "工具열쇠接(으)로；에게标记人等接受对象。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "도구 열쇠에는 (으)로를 씁니다. 에게는 사람 등의 상대를 표시합니다.",
          "ja": "道具열쇠には(으)로を使います。에게は人などの相手です。",
          "en": "The tool 열쇠 takes (으)로. 에게 marks a recipient such as a person.",
          "zh": "工具열쇠接(으)로；에게标记人等接受对象。"
        }
      },
      {
        "id": "direction-tool-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "지하철 + (으)로 → 교통수단을 표시하세요.",
        "contextMeaning": {
          "ko": "지하철 + (으)로 → 교통수단을 표시하세요.",
          "ja": "지하철 + (으)로 → 交通手段を示します。",
          "en": "지하철 + (으)로 → Mark the means of transport.",
          "zh": "지하철 + (으)로 → 标记交通方式。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "지하철로",
          "지하철로."
        ],
        "explanation": {
          "ko": "지하철로 — 지하철은 ㄹ 받침이므로 으 없이 로를 붙입니다. 지하철으로가 아닙니다.",
          "ja": "지하철로 — 지하철はㄹパッチムなので으なしの로です。지하철으로ではありません。",
          "en": "지하철로 — 지하철 ends in ㄹ, so add 로 without 으: 지하철로.",
          "zh": "지하철로 — 지하철以ㄹ收音结尾，因此不用으，接로。"
        }
      },
      {
        "id": "direction-tool-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "종이를 자르는 데 사용한 도구가 가위임을 말합니다.",
        "contextMeaning": {
          "ko": "종이를 자르는 데 사용한 도구가 가위임을 말합니다.",
          "ja": "紙を切るための道具がはさみだと述べます。",
          "en": "Say scissors are the tool used to cut the paper.",
          "zh": "说明剪纸所用的工具是剪刀。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 수단 (으)로\n제시어: 가위 / 종이를 / 잘라요",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：手段の(으)로\n語句：가위 / 종이를 / 잘라요",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: means with (으)로\nCues: 가위 / 종이를 / 잘라요",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：手段助词(으)로\n提示词：가위 / 종이를 / 잘라요"
        },
        "accepted": [
          "가위로 종이를 잘라요"
        ],
        "explanation": {
          "ko": "가위로 종이를 잘라요\n형태를 만드는 과정: 가위 + 로 (모음 뒤)",
          "ja": "가위로 종이를 잘라요\n形の作り方：가위 + 로 (母音の後)",
          "en": "가위로 종이를 잘라요\nFormation: 가위 + 로 (after a vowel)",
          "zh": "가위로 종이를 잘라요\n变形过程：가위 + 로 (元音后)"
        }
      }
    ]
  },
  {
    "id": "recipient",
    "supplement": true,
    "activities": [
      {
        "id": "recipient-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "내가 친구에게 선물을 줍니다. 받는 사람을 표시하세요.",
        "contextMeaning": {
          "ko": "내가 친구에게 선물을 줍니다. 받는 사람을 표시하세요.",
          "ja": "自分が友だちに贈り物を渡します。受け取る人を示します。",
          "en": "You give your friend a gift. Mark the recipient.",
          "zh": "你给朋友礼物，请标记接受者。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "correct",
            "text": "친구에게 선물을 줘요.",
            "feedback": {
              "ko": "선물을 받는 상대에는 에게입니다. 에게서는 누구에게서 받았는지 출처를 나타냅니다.",
              "ja": "贈り物の受け手は에게です。에게서は誰から受け取るかという出どころです。",
              "en": "에게 marks the person receiving the gift. 에게서 marks the source it came from.",
              "zh": "에게标记礼物接受者；에게서标记来源。"
            }
          },
          {
            "id": "distractor",
            "text": "친구에게서 선물을 줘요.",
            "feedback": {
              "ko": "선물을 받는 상대에는 에게입니다. 에게서는 누구에게서 받았는지 출처를 나타냅니다.",
              "ja": "贈り物の受け手は에게です。에게서は誰から受け取るかという出どころです。",
              "en": "에게 marks the person receiving the gift. 에게서 marks the source it came from.",
              "zh": "에게标记礼物接受者；에게서标记来源。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "선물을 받는 상대에는 에게입니다. 에게서는 누구에게서 받았는지 출처를 나타냅니다.",
          "ja": "贈り物の受け手は에게です。에게서は誰から受け取るかという出どころです。",
          "en": "에게 marks the person receiving the gift. 에게서 marks the source it came from.",
          "zh": "에게标记礼物接受者；에게서标记来源。"
        }
      },
      {
        "id": "recipient-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "동생 + 한테 → 받는 상대를 표시한 형태만 쓰세요.",
        "contextMeaning": {
          "ko": "동생 + 한테 → 받는 상대를 표시한 형태만 쓰세요.",
          "ja": "동생 + 한테 → 受け手を示す形だけ書きます。",
          "en": "동생 + 한테 → Write only the recipient-marked form.",
          "zh": "동생 + 한테 → 只写接受者标记形式。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "동생한테",
          "동생한테."
        ],
        "explanation": {
          "ko": "동생한테 — 사람 동생에 회화의 상대 조사 한테를 붙입니다.",
          "ja": "동생한테 — 人を表す동생に、会話の相手助詞한테を付けます。",
          "en": "동생한테 — Attach conversational recipient marker 한테 to 동생.",
          "zh": "동생한테 — 在表示人的동생后接口语接受者助词한테。"
        }
      },
      {
        "id": "recipient-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "이메일을 받는 사람이 선배라고 말합니다. 출처가 아니라 받는 사람입니다.",
        "contextMeaning": {
          "ko": "이메일을 받는 사람이 선배라고 말합니다. 출처가 아니라 받는 사람입니다.",
          "ja": "メールの受け手が先輩だと述べます。出どころではありません。",
          "en": "State that a senior colleague receives the email, not that they are its source.",
          "zh": "说明邮件接受者是前辈，而非发件来源。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 받는 상대 에게\n제시어: 선배 / 이메일을 / 보냈어요",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：受け手の에게\n語句：선배 / 이메일을 / 보냈어요",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: recipient marker 에게\nCues: 선배 / 이메일을 / 보냈어요",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：接受对象助词에게\n提示词：선배 / 이메일을 / 보냈어요"
        },
        "accepted": [
          "선배에게 이메일을 보냈어요"
        ],
        "explanation": {
          "ko": "선배에게 이메일을 보냈어요\n형태를 만드는 과정: 선배 + 에게 (받는 상대)",
          "ja": "선배에게 이메일을 보냈어요\n形の作り方：선배 + 에게 (受け手)",
          "en": "선배에게 이메일을 보냈어요\nFormation: 선배 + 에게 (recipient)",
          "zh": "선배에게 이메일을 보냈어요\n变形过程：선배 + 에게 (接受者)"
        }
      }
    ]
  },
  {
    "id": "range",
    "supplement": true,
    "activities": [
      {
        "id": "range-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "수업은 아홉 시에 시작해서 열한 시에 끝납니다. 시작과 끝을 나타내세요.",
        "contextMeaning": {
          "ko": "수업은 아홉 시에 시작해서 열한 시에 끝납니다. 시작과 끝을 나타내세요.",
          "ja": "授業は9時に始まり11時に終わります。始まりと終わりを表します。",
          "en": "Class starts at nine and ends at eleven. Mark both boundaries.",
          "zh": "课程九点开始十一点结束，请标记起止。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "아홉 시까지 열한 시부터 수업해요.",
            "feedback": {
              "ko": "부터는 시작 아홉 시, 까지는 끝 열한 시에 붙입니다. 거꾸로 붙이면 범위가 뒤바뀝니다.",
              "ja": "부터は開始の9時、까지は終了の11時です。逆にすると範囲が変わります。",
              "en": "부터 marks the nine-o’clock start; 까지 marks the eleven-o’clock end. Reversing them reverses the boundaries.",
              "zh": "부터标记九点这一开始，까지标记十一点这一结束，反用会颠倒范围。"
            }
          },
          {
            "id": "correct",
            "text": "아홉 시부터 열한 시까지 수업해요.",
            "feedback": {
              "ko": "부터는 시작 아홉 시, 까지는 끝 열한 시에 붙입니다. 거꾸로 붙이면 범위가 뒤바뀝니다.",
              "ja": "부터は開始の9時、까지は終了の11時です。逆にすると範囲が変わります。",
              "en": "부터 marks the nine-o’clock start; 까지 marks the eleven-o’clock end. Reversing them reverses the boundaries.",
              "zh": "부터标记九点这一开始，까지标记十一点这一结束，反用会颠倒范围。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "부터는 시작 아홉 시, 까지는 끝 열한 시에 붙입니다. 거꾸로 붙이면 범위가 뒤바뀝니다.",
          "ja": "부터は開始の9時、까지は終了の11時です。逆にすると範囲が変わります。",
          "en": "부터 marks the nine-o’clock start; 까지 marks the eleven-o’clock end. Reversing them reverses the boundaries.",
          "zh": "부터标记九点这一开始，까지标记十一点这一结束，反用会颠倒范围。"
        }
      },
      {
        "id": "range-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "월요일 + 부터 + 금요일 + 까지 → 시간 범위를 쓰세요.",
        "contextMeaning": {
          "ko": "월요일 + 부터 + 금요일 + 까지 → 시간 범위를 쓰세요.",
          "ja": "월요일 + 부터 + 금요일 + 까지 → 期間を書きます。",
          "en": "월요일 + 부터 + 금요일 + 까지 → Write the time range.",
          "zh": "월요일 + 부터 + 금요일 + 까지 → 写出时间范围。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "월요일부터 금요일까지",
          "월요일부터 금요일까지."
        ],
        "explanation": {
          "ko": "월요일부터 금요일까지 — 시작 월요일에 부터, 끝 금요일에 까지를 붙입니다.",
          "ja": "월요일부터 금요일까지 — 始まりの월요일に부터、終わりの금요일に까지です。",
          "en": "월요일부터 금요일까지 — Attach 부터 to Monday and 까지 to Friday.",
          "zh": "월요일부터 금요일까지 — 周一接부터，周五接까지。"
        }
      },
      {
        "id": "range-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "도서관이 여는 기간은 화요일에 시작하여 토요일에 끝납니다.",
        "contextMeaning": {
          "ko": "도서관이 여는 기간은 화요일에 시작하여 토요일에 끝납니다.",
          "ja": "図書館の開館期間は火曜日から土曜日までです。",
          "en": "The library’s opening period begins Tuesday and ends Saturday.",
          "zh": "图书馆开放从周二开始，周六结束。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 부터 … 까지\n제시어: 화요일 / 토요일 / 문을 열어요",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：부터 … 까지\n語句：화요일 / 토요일 / 문을 열어요",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: 부터 … 까지\nCues: 화요일 / 토요일 / 문을 열어요",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：부터 … 까지\n提示词：화요일 / 토요일 / 문을 열어요"
        },
        "accepted": [
          "화요일부터 토요일까지 문을 열어요"
        ],
        "explanation": {
          "ko": "화요일부터 토요일까지 문을 열어요\n형태를 만드는 과정: 화요일 + 부터; 토요일 + 까지",
          "ja": "화요일부터 토요일까지 문을 열어요\n形の作り方：화요일 + 부터; 토요일 + 까지",
          "en": "화요일부터 토요일까지 문을 열어요\nFormation: 화요일 + 부터; 토요일 + 까지",
          "zh": "화요일부터 토요일까지 문을 열어요\n变形过程：화요일 + 부터; 토요일 + 까지"
        }
      }
    ]
  },
  {
    "id": "comparison",
    "supplement": true,
    "activities": [
      {
        "id": "comparison-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "버스 요금이 지하철 요금보다 비쌉니다. 지하철을 비교 기준으로 표시하세요.",
        "contextMeaning": {
          "ko": "버스 요금이 지하철 요금보다 비쌉니다. 지하철을 비교 기준으로 표시하세요.",
          "ja": "バスは地下鉄より高いです。地下鉄を比較基準にします。",
          "en": "The bus costs more than the subway. Mark the subway as the comparison standard.",
          "zh": "公交比地铁贵，请把地铁标记为比较基准。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "correct",
            "text": "버스가 지하철보다 비싸요.",
            "feedback": {
              "ko": "보다로 가격 차이를 비교합니다. 처럼은 비슷한 모습이라 더 비싸다는 비교를 표시하지 않습니다.",
              "ja": "보다は価格差の比較です。처럼は似ている様子で、より高いという比較ではありません。",
              "en": "보다 compares a difference in price. 처럼 marks similarity rather than a higher price.",
              "zh": "보다比较价格差异；처럼表示相似，不表示价格更高。"
            }
          },
          {
            "id": "distractor",
            "text": "버스가 지하철처럼 비싸요.",
            "feedback": {
              "ko": "보다로 가격 차이를 비교합니다. 처럼은 비슷한 모습이라 더 비싸다는 비교를 표시하지 않습니다.",
              "ja": "보다は価格差の比較です。처럼は似ている様子で、より高いという比較ではありません。",
              "en": "보다 compares a difference in price. 처럼 marks similarity rather than a higher price.",
              "zh": "보다比较价格差异；처럼表示相似，不表示价格更高。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "보다로 가격 차이를 비교합니다. 처럼은 비슷한 모습이라 더 비싸다는 비교를 표시하지 않습니다.",
          "ja": "보다は価格差の比較です。처럼は似ている様子で、より高いという比較ではありません。",
          "en": "보다 compares a difference in price. 처럼 marks similarity rather than a higher price.",
          "zh": "보다比较价格差异；처럼表示相似，不表示价格更高。"
        }
      },
      {
        "id": "comparison-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "어제 + 보다 → 비교 기준 형태만 쓰세요.",
        "contextMeaning": {
          "ko": "어제 + 보다 → 비교 기준 형태만 쓰세요.",
          "ja": "어제 + 보다 → 比較基準の形だけ書きます。",
          "en": "어제 + 보다 → Write only the comparison-standard form.",
          "zh": "어제 + 보다 → 只写比较基准形式。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "어제보다",
          "어제보다."
        ],
        "explanation": {
          "ko": "어제보다 — 비교 기준 어제 뒤에 보다를 붙입니다.",
          "ja": "어제보다 — 比較基準어제の後に보다を付けます。",
          "en": "어제보다 — Attach 보다 to the comparison standard 어제.",
          "zh": "어제보다 — 比较基准어제后接보다。"
        }
      },
      {
        "id": "comparison-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "기차의 빠르기를 버스를 기준으로 비교하여 더 빠르다고 말합니다.",
        "contextMeaning": {
          "ko": "기차의 빠르기를 버스를 기준으로 비교하여 더 빠르다고 말합니다.",
          "ja": "列車の速さをバスと比べ、より速いと述べます。",
          "en": "Compare the train’s speed with the bus and say it is faster.",
          "zh": "以公交为基准比较火车速度，说火车更快。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 비교 보다\n제시어: 기차가 / 버스 / 더 빨라요",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：比較の보다\n語句：기차가 / 버스 / 더 빨라요",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: comparison with 보다\nCues: 기차가 / 버스 / 더 빨라요",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：比较助词보다\n提示词：기차가 / 버스 / 더 빨라요"
        },
        "accepted": [
          "기차가 버스보다 더 빨라요"
        ],
        "explanation": {
          "ko": "기차가 버스보다 더 빨라요\n형태를 만드는 과정: 버스 + 보다 (비교 기준)",
          "ja": "기차가 버스보다 더 빨라요\n形の作り方：버스 + 보다 (比較基準)",
          "en": "기차가 버스보다 더 빨라요\nFormation: 버스 + 보다 (comparison standard)",
          "zh": "기차가 버스보다 더 빨라요\n变形过程：버스 + 보다 (比较基准)"
        }
      }
    ]
  },
  {
    "id": "dictionary-stem",
    "supplement": true,
    "activities": [
      {
        "id": "dictionary-stem-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "찾다를 활용하려고 합니다. 사전형의 다를 뺀 어간을 고르세요.",
        "contextMeaning": {
          "ko": "찾다를 활용하려고 합니다. 사전형의 다를 뺀 어간을 고르세요.",
          "ja": "찾다を活用します。辞書形の다を除いた語幹を選びます。",
          "en": "To conjugate 찾다, select the stem after removing dictionary-form 다.",
          "zh": "准备活用찾다，请选择去掉词典形다后的词干。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "찾다-",
            "feedback": {
              "ko": "사전형 찾다에서 끝의 다를 빼면 어간 찾-가 남습니다.",
              "ja": "辞書形찾다の末尾다を除くと찾-が残ります。",
              "en": "Remove final 다 from 찾다 to obtain 찾-.",
              "zh": "从찾다去掉末尾다，留下찾-。"
            }
          },
          {
            "id": "correct",
            "text": "찾-",
            "feedback": {
              "ko": "사전형 찾다에서 끝의 다를 빼면 어간 찾-가 남습니다.",
              "ja": "辞書形찾다の末尾다を除くと찾-が残ります。",
              "en": "Remove final 다 from 찾다 to obtain 찾-.",
              "zh": "从찾다去掉末尾다，留下찾-。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "사전형 찾다에서 끝의 다를 빼면 어간 찾-가 남습니다.",
          "ja": "辞書形찾다の末尾다を除くと찾-が残ります。",
          "en": "Remove final 다 from 찾다 to obtain 찾-.",
          "zh": "从찾다去掉末尾다，留下찾-。"
        }
      },
      {
        "id": "dictionary-stem-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "공부하다 → 다를 뺀 어간만 쓰세요. 붙임표는 쓰지 마세요.",
        "contextMeaning": {
          "ko": "공부하다 → 다를 뺀 어간만 쓰세요. 붙임표는 쓰지 마세요.",
          "ja": "공부하다 → 다を除いた語幹だけ書きます。ハイフンは不要です。",
          "en": "공부하다 → Write only the stem without 다. Do not add a hyphen.",
          "zh": "공부하다 → 只写去掉다的词干，不加连字符。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "공부하",
          "공부하."
        ],
        "explanation": {
          "ko": "공부하 — 공부하다에서 다만 빼므로 공부하입니다. 하까지 지우지 않습니다.",
          "ja": "공부하 — 공부하다から다だけ除くので공부하です。하は消しません。",
          "en": "공부하 — Remove only 다, leaving 공부하; do not remove 하.",
          "zh": "공부하 — 只去掉다，保留공부하，不要把하也去掉。"
        }
      },
      {
        "id": "dictionary-stem-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "자신의 일상 습관을 말합니다. 제시된 동사의 다를 뺀 뒤 현재 해요체 문장을 만듭니다.",
        "contextMeaning": {
          "ko": "자신의 일상 습관을 말합니다. 제시된 동사의 다를 뺀 뒤 현재 해요체 문장을 만듭니다.",
          "ja": "日常の習慣を述べます。動詞の다を取り、現在ヘヨ体の文を作ります。",
          "en": "Describe a daily habit. Remove dictionary 다 and form a present polite sentence.",
          "zh": "描述日常习惯，去掉动词词典形다后组成现在敬语句。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 어간 + 현재 해요체\n제시어: 저는 / 매일 / 산책하다",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：語幹＋現在ヘヨ体\n語句：저는 / 매일 / 산책하다",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: stem + present polite 해요 style\nCues: 저는 / 매일 / 산책하다",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：词干＋现在해요体\n提示词：저는 / 매일 / 산책하다"
        },
        "accepted": [
          "저는 매일 산책해요",
          "저는 매일 산책하여요"
        ],
        "explanation": {
          "ko": "저는 매일 산책해요\n형태를 만드는 과정: 산책하다 → 산책하- → 산책해요",
          "ja": "저는 매일 산책해요\n形の作り方：산책하다 → 산책하- → 산책해요",
          "en": "저는 매일 산책해요\nFormation: 산책하다 → 산책하- → 산책해요",
          "zh": "저는 매일 산책해요\n变形过程：산책하다 → 산책하- → 산책해요"
        }
      }
    ]
  },
  {
    "id": "present-haeyo",
    "supplement": true,
    "activities": [
      {
        "id": "present-haeyo-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "보다를 현재 해요체로 말합니다. 보아가 축약된 형태를 고르세요.",
        "contextMeaning": {
          "ko": "보다를 현재 해요체로 말합니다. 보아가 축약된 형태를 고르세요.",
          "ja": "보다を現在のヘヨ体にします。보아が縮まった形を選びます。",
          "en": "Use 보다 in present 해요 style. Choose the contraction of 보아.",
          "zh": "把보다变为现在해요体，请选보아的缩约形式。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "correct",
            "text": "봐요",
            "feedback": {
              "ko": "보아가 봐로 축약되어 봐요입니다. 보여요는 보이다의 활용이라 다른 형태입니다.",
              "ja": "보아が봐に縮まって봐요です。보여요は보이다の活用です。",
              "en": "보아 contracts to 봐, giving 봐요. 보여요 conjugates 보이다 instead.",
              "zh": "보아缩为봐，因此为봐요；보여요是보이다的活用。"
            }
          },
          {
            "id": "distractor",
            "text": "보여요",
            "feedback": {
              "ko": "보아가 봐로 축약되어 봐요입니다. 보여요는 보이다의 활용이라 다른 형태입니다.",
              "ja": "보아が봐に縮まって봐요です。보여요は보이다の活用です。",
              "en": "보아 contracts to 봐, giving 봐요. 보여요 conjugates 보이다 instead.",
              "zh": "보아缩为봐，因此为봐요；보여요是보이다的活用。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "보아가 봐로 축약되어 봐요입니다. 보여요는 보이다의 활용이라 다른 형태입니다.",
          "ja": "보아が봐に縮まって봐요です。보여요は보이다の活用です。",
          "en": "보아 contracts to 봐, giving 봐요. 보여요 conjugates 보이다 instead.",
          "zh": "보아缩为봐，因此为봐요；보여요是보이다的活用。"
        }
      },
      {
        "id": "present-haeyo-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "마시다 → 현재 해요체로 쓰세요.",
        "contextMeaning": {
          "ko": "마시다 → 현재 해요체로 쓰세요.",
          "ja": "마시다 → 現在のヘヨ体にします。",
          "en": "마시다 → Write the present 해요 form.",
          "zh": "마시다 → 写出现在해요体。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "마셔요",
          "마셔요.",
          "마시어요",
          "마시어요."
        ],
        "explanation": {
          "ko": "마셔요 — 마시-에 -어요를 붙이면 마시어요이고, 시어가 셔로 줄어 마셔요가 됩니다.",
          "ja": "마셔요 — 마시-に-어요を付けると마시어요、시어が셔に縮まると마셔요です。",
          "en": "마셔요 — 마시- plus -어요 yields 마시어요; 시어 contracts to 셔 in 마셔요.",
          "zh": "마셔요 — 마시-接-어요为마시어요，시어缩为셔成为마셔요。"
        }
      },
      {
        "id": "present-haeyo-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "동네에서 자주 보는 친구의 행동을 현재 해요체로 말합니다.",
        "contextMeaning": {
          "ko": "동네에서 자주 보는 친구의 행동을 현재 해요체로 말합니다.",
          "ja": "近所でよく見る友だちの行動を現在ヘヨ体で述べます。",
          "en": "Describe a friend’s usual action in the neighborhood using present polite style.",
          "zh": "用现在敬语体描述邻居朋友平常的行动。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 현재 해요체\n제시어: 친구가 / 매일 / 걷다",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：現在ヘヨ体\n語句：친구가 / 매일 / 걷다",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: present polite 해요 style\nCues: 친구가 / 매일 / 걷다",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：现在해요体\n提示词：친구가 / 매일 / 걷다"
        },
        "accepted": [
          "친구가 매일 걸어요"
        ],
        "explanation": {
          "ko": "친구가 매일 걸어요\n형태를 만드는 과정: 걷다 → 걸- + -어요 (ㄷ 불규칙)",
          "ja": "친구가 매일 걸어요\n形の作り方：걷다 → 걸- + -어요 (ㄷ変則)",
          "en": "친구가 매일 걸어요\nFormation: 걷다 → 걸- + -어요 (ㄷ irregular)",
          "zh": "친구가 매일 걸어요\n变形过程：걷다 → 걸- + -어요 (ㄷ不规则)"
        }
      }
    ]
  },
  {
    "id": "formal-present",
    "supplement": true,
    "activities": [
      {
        "id": "formal-present-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "발표에서 먹다를 현재 하십시오체 평서문으로 말합니다.",
        "contextMeaning": {
          "ko": "발표에서 먹다를 현재 하십시오체 평서문으로 말합니다.",
          "ja": "発表で먹다を現在の格式ある平叙文にします。",
          "en": "In a presentation, use 먹다 in formal present declarative style.",
          "zh": "发表时，把먹다变为正式现在陈述体。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "먹ㅂ니다.",
            "feedback": {
              "ko": "먹-에는 받침이 있으므로 -습니다를 붙입니다. -ㅂ니다는 모음 어간에 씁니다.",
              "ja": "먹-にはパッチムがあるので-습니다です。-ㅂ니다は母音語幹です。",
              "en": "먹- ends in a consonant, so add -습니다. -ㅂ니다 follows vowel stems.",
              "zh": "먹-以辅音结尾，接-습니다；-ㅂ니다用于元音词干。"
            }
          },
          {
            "id": "correct",
            "text": "먹습니다.",
            "feedback": {
              "ko": "먹-에는 받침이 있으므로 -습니다를 붙입니다. -ㅂ니다는 모음 어간에 씁니다.",
              "ja": "먹-にはパッチムがあるので-습니다です。-ㅂ니다は母音語幹です。",
              "en": "먹- ends in a consonant, so add -습니다. -ㅂ니다 follows vowel stems.",
              "zh": "먹-以辅音结尾，接-습니다；-ㅂ니다用于元音词干。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "먹-에는 받침이 있으므로 -습니다를 붙입니다. -ㅂ니다는 모음 어간에 씁니다.",
          "ja": "먹-にはパッチムがあるので-습니다です。-ㅂ니다は母音語幹です。",
          "en": "먹- ends in a consonant, so add -습니다. -ㅂ니다 follows vowel stems.",
          "zh": "먹-以辅音结尾，接-습니다；-ㅂ니다用于元音词干。"
        }
      },
      {
        "id": "formal-present-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "가다 → 현재 격식체 평서형으로 쓰세요.",
        "contextMeaning": {
          "ko": "가다 → 현재 격식체 평서형으로 쓰세요.",
          "ja": "가다 → 現在の格式ある平叙形にします。",
          "en": "가다 → Write the formal present declarative form.",
          "zh": "가다 → 写出正式现在陈述形式。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "갑니다",
          "갑니다."
        ],
        "explanation": {
          "ko": "갑니다 — 모음 어간 가-에 -ㅂ니다를 붙여 갑니다입니다.",
          "ja": "갑니다 — 母音語幹가-に-ㅂ니다を付けて갑니다です。",
          "en": "갑니다 — Add -ㅂ니다 to vowel stem 가-: 갑니다.",
          "zh": "갑니다 — 元音词干가-接-ㅂ니다，成为갑니다。"
        }
      },
      {
        "id": "formal-present-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "공식 안내에서 다음 행사 순서를 시작한다고 발표합니다.",
        "contextMeaning": {
          "ko": "공식 안내에서 다음 행사 순서를 시작한다고 발표합니다.",
          "ja": "公式案内で、次のプログラムを開始すると発表します。",
          "en": "In a formal announcement, say the next part of the event is starting.",
          "zh": "在正式通知中宣布下一个活动环节开始。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: -ㅂ니다/습니다\n제시어: 다음 순서를 / 시작하다",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：-ㅂ니다/습니다\n語句：다음 순서를 / 시작하다",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: -ㅂ니다/습니다\nCues: 다음 순서를 / 시작하다",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：-ㅂ니다/습니다\n提示词：다음 순서를 / 시작하다"
        },
        "accepted": [
          "다음 순서를 시작합니다"
        ],
        "explanation": {
          "ko": "다음 순서를 시작합니다\n형태를 만드는 과정: 시작하다 → 시작하- + -ㅂ니다",
          "ja": "다음 순서를 시작합니다\n形の作り方：시작하다 → 시작하- + -ㅂ니다",
          "en": "다음 순서를 시작합니다\nFormation: 시작하다 → 시작하- + -ㅂ니다",
          "zh": "다음 순서를 시작합니다\n变形过程：시작하다 → 시작하- + -ㅂ니다"
        }
      }
    ]
  },
  {
    "id": "past",
    "supplement": true,
    "activities": [
      {
        "id": "past-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "어제 공부를 끝냈습니다. 과거 해요체로 말하세요.",
        "contextMeaning": {
          "ko": "어제 공부를 끝냈습니다. 과거 해요체로 말하세요.",
          "ja": "昨日勉強を終えました。過去のヘヨ体で述べます。",
          "en": "You finished studying yesterday. Use past 해요 style.",
          "zh": "昨天已经学完，请用过去해요体。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "correct",
            "text": "어제 공부했어요.",
            "feedback": {
              "ko": "끝난 과거이므로 하다의 과거 했어요를 씁니다. 할 거예요는 예정·추측입니다.",
              "ja": "終わった過去なので하다の過去했어요です。할 거예요は予定・推測です。",
              "en": "The action is completed in the past, so use 했어요. 할 거예요 expresses a plan or prediction.",
              "zh": "动作已在过去完成，用했어요；할 거예요表示计划或推测。"
            }
          },
          {
            "id": "distractor",
            "text": "어제 공부할 거예요.",
            "feedback": {
              "ko": "끝난 과거이므로 하다의 과거 했어요를 씁니다. 할 거예요는 예정·추측입니다.",
              "ja": "終わった過去なので하다の過去했어요です。할 거예요は予定・推測です。",
              "en": "The action is completed in the past, so use 했어요. 할 거예요 expresses a plan or prediction.",
              "zh": "动作已在过去完成，用했어요；할 거예요表示计划或推测。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "끝난 과거이므로 하다의 과거 했어요를 씁니다. 할 거예요는 예정·추측입니다.",
          "ja": "終わった過去なので하다の過去했어요です。할 거예요は予定・推測です。",
          "en": "The action is completed in the past, so use 했어요. 할 거예요 expresses a plan or prediction.",
          "zh": "动作已在过去完成，用했어요；할 거예요表示计划或推测。"
        }
      },
      {
        "id": "past-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "배우다 → 과거 해요체로 쓰세요.",
        "contextMeaning": {
          "ko": "배우다 → 과거 해요체로 쓰세요.",
          "ja": "배우다 → 過去のヘヨ体にします。",
          "en": "배우다 → Write the past 해요 form.",
          "zh": "배우다 → 写出过去해요体。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "배웠어요",
          "배웠어요.",
          "배우었어요",
          "배우었어요."
        ],
        "explanation": {
          "ko": "배웠어요 — 배우-에 -었어요를 붙인 배우었어요가 배웠어요로 줄어듭니다.",
          "ja": "배웠어요 — 배우-に-었어요を付けた배우었어요が배웠어요に縮まります。",
          "en": "배웠어요 — 배우- plus -었어요 gives 배우었어요, contracted to 배웠어요.",
          "zh": "배웠어요 — 배우-接-었어요为배우었어요，缩为배웠어요。"
        }
      },
      {
        "id": "past-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "어제 운동장에서 친구와 놀았던 일을 보고합니다.",
        "contextMeaning": {
          "ko": "어제 운동장에서 친구와 놀았던 일을 보고합니다.",
          "ja": "昨日、運動場で友だちと遊んだことを伝えます。",
          "en": "Report playing with a friend on the playground yesterday.",
          "zh": "叙述昨天与朋友在操场玩的事。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: 과거 해요체\n제시어: 어제 / 운동장에서 / 친구와 / 놀다",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：過去ヘヨ体\n語句：어제 / 운동장에서 / 친구와 / 놀다",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: past polite 해요 style\nCues: 어제 / 운동장에서 / 친구와 / 놀다",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：过去해요体\n提示词：어제 / 운동장에서 / 친구와 / 놀다"
        },
        "accepted": [
          "어제 운동장에서 친구와 놀았어요"
        ],
        "explanation": {
          "ko": "어제 운동장에서 친구와 놀았어요\n형태를 만드는 과정: 놀다 → 놀- + -았어요",
          "ja": "어제 운동장에서 친구와 놀았어요\n形の作り方：놀다 → 놀- + -았어요",
          "en": "어제 운동장에서 친구와 놀았어요\nFormation: 놀다 → 놀- + -았어요",
          "zh": "어제 운동장에서 친구와 놀았어요\n变形过程：놀다 → 놀- + -았어요"
        }
      }
    ]
  },
  {
    "id": "future-plan",
    "supplement": true,
    "activities": [
      {
        "id": "future-plan-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "내일 친구를 만나기로 정했습니다. -(으)ㄹ 거예요로 예정만 말하세요.",
        "contextMeaning": {
          "ko": "내일 친구를 만나기로 정했습니다. -(으)ㄹ 거예요로 예정만 말하세요.",
          "ja": "明日友だちに会う予定です。-(으)ㄹ 거예요で予定を述べます。",
          "en": "You plan to meet a friend tomorrow. Express the plan with -(으)ㄹ 거예요.",
          "zh": "计划明天见朋友，请用-(으)ㄹ 거예요表达安排。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "내일 친구를 만났어요.",
            "feedback": {
              "ko": "만나다의 어간 만나-에 -ㄹ 거예요를 붙여 만날 거예요입니다. 만났어요는 과거입니다.",
              "ja": "만나-に-ㄹ 거예요を付けて만날 거예요です。만났어요は過去です。",
              "en": "만나- takes -ㄹ 거예요: 만날 거예요. 만났어요 is past.",
              "zh": "만나-接-ㄹ 거예요为만날 거예요；만났어요是过去。"
            }
          },
          {
            "id": "correct",
            "text": "내일 친구를 만날 거예요.",
            "feedback": {
              "ko": "만나다의 어간 만나-에 -ㄹ 거예요를 붙여 만날 거예요입니다. 만났어요는 과거입니다.",
              "ja": "만나-に-ㄹ 거예요を付けて만날 거예요です。만났어요は過去です。",
              "en": "만나- takes -ㄹ 거예요: 만날 거예요. 만났어요 is past.",
              "zh": "만나-接-ㄹ 거예요为만날 거예요；만났어요是过去。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "만나다의 어간 만나-에 -ㄹ 거예요를 붙여 만날 거예요입니다. 만났어요는 과거입니다.",
          "ja": "만나-に-ㄹ 거예요を付けて만날 거예요です。만났어요は過去です。",
          "en": "만나- takes -ㄹ 거예요: 만날 거예요. 만났어요 is past.",
          "zh": "만나-接-ㄹ 거예요为만날 거예요；만났어요是过去。"
        }
      },
      {
        "id": "future-plan-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "읽다 → -(으)ㄹ 거예요로 예정을 쓰세요.",
        "contextMeaning": {
          "ko": "읽다 → -(으)ㄹ 거예요로 예정을 쓰세요.",
          "ja": "읽다 → -(으)ㄹ 거예요で予定を表します。",
          "en": "읽다 → Express a plan using -(으)ㄹ 거예요.",
          "zh": "읽다 → 使用-(으)ㄹ 거예요表达安排。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "읽을 거예요",
          "읽을 거예요."
        ],
        "explanation": {
          "ko": "읽을 거예요 — 읽-에는 받침이 있으므로 -을 거예요를 붙이고 거예요 앞은 띄어 씁니다.",
          "ja": "읽을 거예요 — 읽-にはパッチムがあるので-을 거예요を付け、거예요の前を空けます。",
          "en": "읽을 거예요 — 읽- has a final consonant, so add -을 거예요 with a space before 거예요.",
          "zh": "읽을 거예요 — 읽-有收音，接-을 거예요，거예요前空格。"
        }
      },
      {
        "id": "future-plan-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "다가오는 주말에 가족을 방문할 계획을 말합니다.",
        "contextMeaning": {
          "ko": "다가오는 주말에 가족을 방문할 계획을 말합니다.",
          "ja": "今度の週末に家族を訪ねる計画を述べます。",
          "en": "Describe your plan to visit family this coming weekend.",
          "zh": "说出即将到来的周末探望家人的计划。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: -(으)ㄹ 거예요\n제시어: 이번 주말에 / 가족을 / 방문하다",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：-(으)ㄹ 거예요\n語句：이번 주말에 / 가족을 / 방문하다",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: -(으)ㄹ 거예요\nCues: 이번 주말에 / 가족을 / 방문하다",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：-(으)ㄹ 거예요\n提示词：이번 주말에 / 가족을 / 방문하다"
        },
        "accepted": [
          "이번 주말에 가족을 방문할 거예요"
        ],
        "explanation": {
          "ko": "이번 주말에 가족을 방문할 거예요\n형태를 만드는 과정: 방문하다 → 방문하- + -ㄹ 거예요",
          "ja": "이번 주말에 가족을 방문할 거예요\n形の作り方：방문하다 → 방문하- + -ㄹ 거예요",
          "en": "이번 주말에 가족을 방문할 거예요\nFormation: 방문하다 → 방문하- + -ㄹ 거예요",
          "zh": "이번 주말에 가족을 방문할 거예요\n变形过程：방문하다 → 방문하- + -ㄹ 거예요"
        }
      }
    ]
  },
  {
    "id": "progressive",
    "supplement": true,
    "activities": [
      {
        "id": "progressive-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "친구는 지금 편지를 쓰는 중입니다. 진행 중인 동작을 표시하세요.",
        "contextMeaning": {
          "ko": "친구는 지금 편지를 쓰는 중입니다. 진행 중인 동작을 표시하세요.",
          "ja": "友だちは今手紙を書いている最中です。進行中の動作を示します。",
          "en": "Your friend is in the middle of writing a letter. Mark the ongoing action.",
          "zh": "朋友正在写信，请标记进行中的动作。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "correct",
            "text": "편지를 쓰고 있어요.",
            "feedback": {
              "ko": "현재 진행은 쓰고 있어요입니다. 쓴 적이 있어요는 이전 경험의 유무입니다.",
              "ja": "現在の進行は쓰고 있어요です。쓴 적이 있어요は過去の経験です。",
              "en": "쓰고 있어요 is ongoing now; 쓴 적이 있어요 describes prior experience.",
              "zh": "쓰고 있어요表示现在进行；쓴 적이 있어요表示过去经历。"
            }
          },
          {
            "id": "distractor",
            "text": "편지를 쓴 적이 있어요.",
            "feedback": {
              "ko": "현재 진행은 쓰고 있어요입니다. 쓴 적이 있어요는 이전 경험의 유무입니다.",
              "ja": "現在の進行は쓰고 있어요です。쓴 적이 있어요は過去の経験です。",
              "en": "쓰고 있어요 is ongoing now; 쓴 적이 있어요 describes prior experience.",
              "zh": "쓰고 있어요表示现在进行；쓴 적이 있어요表示过去经历。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "현재 진행은 쓰고 있어요입니다. 쓴 적이 있어요는 이전 경험의 유무입니다.",
          "ja": "現在の進行は쓰고 있어요です。쓴 적이 있어요は過去の経験です。",
          "en": "쓰고 있어요 is ongoing now; 쓴 적이 있어요 describes prior experience.",
          "zh": "쓰고 있어요表示现在进行；쓴 적이 있어요表示过去经历。"
        }
      },
      {
        "id": "progressive-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "공부하다 → -고 있다의 현재 해요체를 쓰세요.",
        "contextMeaning": {
          "ko": "공부하다 → -고 있다의 현재 해요체를 쓰세요.",
          "ja": "공부하다 → -고 있다の現在ヘヨ体にします。",
          "en": "공부하다 → Use -고 있다 in present 해요 style.",
          "zh": "공부하다 → 使用-고 있다的现在해요体。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "공부하고 있어요",
          "공부하고 있어요."
        ],
        "explanation": {
          "ko": "공부하고 있어요 — 어간 공부하-에 -고 있어요를 붙입니다.",
          "ja": "공부하고 있어요 — 語幹공부하-に-고 있어요を付けます。",
          "en": "공부하고 있어요 — Attach -고 있어요 to 공부하-.",
          "zh": "공부하고 있어요 — 词干공부하-后接-고 있어요。"
        }
      },
      {
        "id": "progressive-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "지금 밖에서 아이들이 노는 행동이 진행 중이라고 묘사합니다.",
        "contextMeaning": {
          "ko": "지금 밖에서 아이들이 노는 행동이 진행 중이라고 묘사합니다.",
          "ja": "今外で子どもたちが遊んでいる最中だと述べます。",
          "en": "Describe children who are in the middle of playing outside now.",
          "zh": "描述孩子们现在正在外面玩的动作。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: -고 있어요\n제시어: 아이들이 / 밖에서 / 놀다",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：-고 있어요\n語句：아이들이 / 밖에서 / 놀다",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: -고 있어요\nCues: 아이들이 / 밖에서 / 놀다",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：-고 있어요\n提示词：아이들이 / 밖에서 / 놀다"
        },
        "accepted": [
          "아이들이 밖에서 놀고 있어요"
        ],
        "explanation": {
          "ko": "아이들이 밖에서 놀고 있어요\n형태를 만드는 과정: 놀다 → 놀- + -고 있어요 (ㄹ 유지)",
          "ja": "아이들이 밖에서 놀고 있어요\n形の作り方：놀다 → 놀- + -고 있어요 (ㄹを保持)",
          "en": "아이들이 밖에서 놀고 있어요\nFormation: 놀다 → 놀- + -고 있어요 (retain ㄹ)",
          "zh": "아이들이 밖에서 놀고 있어요\n变形过程：놀다 → 놀- + -고 있어요 (保留ㄹ)"
        }
      }
    ]
  },
  {
    "id": "negation",
    "supplement": true,
    "activities": [
      {
        "id": "negation-core-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "갈 수는 있지만 스스로 가지 않기로 했습니다. 불가능이 아니라 일반 부정을 말하세요.",
        "contextMeaning": {
          "ko": "갈 수는 있지만 스스로 가지 않기로 했습니다. 불가능이 아니라 일반 부정을 말하세요.",
          "ja": "行けますが、自分で行かないと決めました。不可能でなく通常の否定を表します。",
          "en": "You can go but choose not to. Express ordinary negation rather than inability.",
          "zh": "能够去，但自己选择不去，请表达普通否定而非不能。"
        },
        "prompt": {
          "ko": "지시와 문맥에 맞게 고르세요.",
          "ja": "指示と文脈に合うものを選びます。",
          "en": "Choose the option that fits the instruction and context.",
          "zh": "选择符合要求与语境的选项。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "오늘은 못 가요.",
            "feedback": {
              "ko": "안은 선택한 부정에 맞습니다. 못은 능력이나 상황상 불가능을 나타내 이 문맥과 다릅니다.",
              "ja": "안は選んだ否定に合います。못は能力や状況上の不可能なので違います。",
              "en": "안 fits the choice not to go. 못 indicates inability or circumstantial impossibility.",
              "zh": "안符合自主选择不去；못表示能力或条件上的不能。"
            }
          },
          {
            "id": "correct",
            "text": "오늘은 안 가요.",
            "feedback": {
              "ko": "안은 선택한 부정에 맞습니다. 못은 능력이나 상황상 불가능을 나타내 이 문맥과 다릅니다.",
              "ja": "안は選んだ否定に合います。못は能力や状況上の不可能なので違います。",
              "en": "안 fits the choice not to go. 못 indicates inability or circumstantial impossibility.",
              "zh": "안符合自主选择不去；못表示能力或条件上的不能。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "안은 선택한 부정에 맞습니다. 못은 능력이나 상황상 불가능을 나타내 이 문맥과 다릅니다.",
          "ja": "안は選んだ否定に合います。못は能力や状況上の不可能なので違います。",
          "en": "안 fits the choice not to go. 못 indicates inability or circumstantial impossibility.",
          "zh": "안符合自主选择不去；못表示能力或条件上的不能。"
        }
      },
      {
        "id": "negation-core-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "먹다 → -지 않다의 현재 해요체로 부정하세요.",
        "contextMeaning": {
          "ko": "먹다 → -지 않다의 현재 해요체로 부정하세요.",
          "ja": "먹다 → -지 않다の現在ヘヨ体で否定します。",
          "en": "먹다 → Negate using -지 않다 in present 해요 style.",
          "zh": "먹다 → 用-지 않다的现在해요体否定。"
        },
        "prompt": {
          "ko": "조건에 맞는 답만 쓰세요.",
          "ja": "条件に合う答えだけ書きます。",
          "en": "Write only the answer requested by the conditions.",
          "zh": "只写符合条件的答案。"
        },
        "accepted": [
          "먹지 않아요",
          "먹지 않아요."
        ],
        "explanation": {
          "ko": "먹지 않아요 — 먹-에 -지 않아요를 붙입니다. 요청한 긴 부정형이므로 안 먹어요 대신 먹지 않아요를 씁니다.",
          "ja": "먹지 않아요 — 먹-に-지 않아요を付けます。指定の長い否定形なので안 먹어요でなく먹지 않아요です。",
          "en": "먹지 않아요 — Add -지 않아요 to 먹-. The requested long negative is 먹지 않아요 rather than 안 먹어요.",
          "zh": "먹지 않아요 — 먹-接-지 않아요；题目要求长否定，因此用먹지 않아요而非안 먹어요。"
        }
      },
      {
        "id": "negation-sentence-construction",
        "type": "text",
        "phase": "transfer",
        "role": "construction",
        "contextKorean": "먹을 수 없다는 뜻이 아니라 평소 고기를 먹지 않는다는 습관을 긴 부정으로 말합니다.",
        "contextMeaning": {
          "ko": "먹을 수 없다는 뜻이 아니라 평소 고기를 먹지 않는다는 습관을 긴 부정으로 말합니다.",
          "ja": "食べられないのでなく、普段肉を食べない習慣を長い否定形で述べます。",
          "en": "Use the long negative to state a habit of not eating meat, not an inability.",
          "zh": "用长否定表达平时不吃肉的习惯，而非不能吃。"
        },
        "prompt": {
          "ko": "제시어를 모두 주어진 순서로 사용해 완전한 문장을 만드세요. 주어진 조사는 유지하고 필요한 조사·어미만 더하세요. 목표 형태: -지 않아요\n제시어: 저는 / 고기를 / 먹다",
          "ja": "語句をすべて示された順番で使い、完全な文を作ってください。すでにある助詞は残し、必要な助詞・語尾だけ加えます。指定の形：-지 않아요\n語句：저는 / 고기를 / 먹다",
          "en": "Use every cue in the given order to build a complete sentence. Keep supplied particles; add only the needed particles and endings. Required form: -지 않아요\nCues: 저는 / 고기를 / 먹다",
          "zh": "按给定顺序使用所有提示词，组成完整句子。保留已有助词，只添加所需助词和词尾。指定形式：-지 않아요\n提示词：저는 / 고기를 / 먹다"
        },
        "accepted": [
          "저는 고기를 먹지 않아요"
        ],
        "explanation": {
          "ko": "저는 고기를 먹지 않아요\n형태를 만드는 과정: 먹다 → 먹- + -지 않아요",
          "ja": "저는 고기를 먹지 않아요\n形の作り方：먹다 → 먹- + -지 않아요",
          "en": "저는 고기를 먹지 않아요\nFormation: 먹다 → 먹- + -지 않아요",
          "zh": "저는 고기를 먹지 않아요\n变形过程：먹다 → 먹- + -지 않아요"
        }
      }
    ]
  }
];
