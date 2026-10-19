// Original morphology practice supplements; original lesson IDs and drills are preserved.
window.HARUMAL_GRAMMAR_PACK_LEGACY_MORPHOLOGY = [
  {
    "id": "batchim-eu",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-batchim-eu-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "옷이 작을 때 바꿔 달라고 해요. 작다에 조건 -(으)면을 붙인 문장을 고르세요.",
        "contextMeaning": {
          "ko": "옷이 작을 때 바꿔 달라고 해요. 작다에 조건 -(으)면을 붙인 문장을 고르세요.",
          "ja": "服が小さい場合は交換を頼みます。작다に条件の-(으)면を付けた文を選んでください。",
          "en": "You ask for an exchange if the clothes are small. Choose 작다 with conditional -(으)면.",
          "zh": "衣服小的话就要求换货，请选择작다加条件-(으)면的句子。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "correct",
            "text": "작으면 바꿔 주세요.",
            "feedback": {
              "ko": "작-은 ㄱ 받침이 있어 -으면을 붙입니다. 작면은 필요한 으를 빠뜨렸습니다.",
              "ja": "작-にはㄱパッチムがあるため-으면を付けます。작면では必要な으が抜けています。",
              "en": "작- ends in ㄱ, so it takes -으면. 작면 omits the required 으.",
              "zh": "작-有ㄱ收音，应接-으면；작면遗漏了必要的으。"
            }
          },
          {
            "id": "distractor",
            "text": "작면 바꿔 주세요.",
            "feedback": {
              "ko": "작-은 ㄱ 받침이 있어 -으면을 붙입니다. 작면은 필요한 으를 빠뜨렸습니다.",
              "ja": "작-にはㄱパッチムがあるため-으면を付けます。작면では必要な으が抜けています。",
              "en": "작- ends in ㄱ, so it takes -으면. 작면 omits the required 으.",
              "zh": "작-有ㄱ收音，应接-으면；작면遗漏了必要的으。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "작-은 ㄱ 받침이 있어 -으면을 붙입니다. 작면은 필요한 으를 빠뜨렸습니다.",
          "ja": "작-にはㄱパッチムがあるため-으면を付けます。작면では必要な으が抜けています。",
          "en": "작- ends in ㄱ, so it takes -으면. 작면 omits the required 으.",
          "zh": "작-有ㄱ收音，应接-으면；작면遗漏了必要的으。"
        }
      },
      {
        "id": "legacy-extra-batchim-eu-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "입다 + -(으)면 → 조건형만 쓰세요.",
        "contextMeaning": {
          "ko": "입다 + -(으)면 → 조건형만 쓰세요.",
          "ja": "입다＋-(으)면の条件形だけを書いてください。",
          "en": "Write only the conditional form of 입다 + -(으)면.",
          "zh": "只写입다加-(으)면的条件形。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "입으면",
          "입으면."
        ],
        "explanation": {
          "ko": "정답: 입으면\n입- + -으면 → 입으면. ㅂ 받침 뒤에 으를 넣습니다.",
          "ja": "正解：입으면\n입-＋-으면→입으면。ㅂパッチムの後に으を入れます。",
          "en": "Answer: 입으면\n입- + -으면 → 입으면. Include 으 after final ㅂ.",
          "zh": "答案：입으면\n입-＋-으면→입으면，ㅂ收音后加으。"
        }
      }
    ]
  },
  {
    "id": "rieul-selection",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-rieul-selection-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "연필을 도구로 써요. 연필에 -(으)로를 붙이세요.",
        "contextMeaning": {
          "ko": "연필을 도구로 써요. 연필에 -(으)로를 붙이세요.",
          "ja": "鉛筆を道具として使います。연필に-(으)로を付けてください。",
          "en": "You use a pencil as a tool. Attach -(으)로 to 연필.",
          "zh": "你把铅笔当作工具，请在연필后接-(으)로。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "연필으로 써요.",
            "feedback": {
              "ko": "ㄹ 받침 뒤에는 으 없이 로를 씁니다. 연필으로는 으를 잘못 넣은 형태입니다.",
              "ja": "ㄹパッチムの後は으を入れず로を使います。연필으로は으を余分に入れた形です。",
              "en": "Final ㄹ takes 로 without 으. 연필으로 incorrectly inserts 으.",
              "zh": "ㄹ收音后直接接로；연필으로错误地加了으。"
            }
          },
          {
            "id": "correct",
            "text": "연필로 써요.",
            "feedback": {
              "ko": "ㄹ 받침 뒤에는 으 없이 로를 씁니다. 연필으로는 으를 잘못 넣은 형태입니다.",
              "ja": "ㄹパッチムの後は으を入れず로を使います。연필으로は으を余分に入れた形です。",
              "en": "Final ㄹ takes 로 without 으. 연필으로 incorrectly inserts 으.",
              "zh": "ㄹ收音后直接接로；연필으로错误地加了으。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "ㄹ 받침 뒤에는 으 없이 로를 씁니다. 연필으로는 으를 잘못 넣은 형태입니다.",
          "ja": "ㄹパッチムの後は으を入れず로を使います。연필으로は으を余分に入れた形です。",
          "en": "Final ㄹ takes 로 without 으. 연필으로 incorrectly inserts 으.",
          "zh": "ㄹ收音后直接接로；연필으로错误地加了으。"
        }
      },
      {
        "id": "legacy-extra-rieul-selection-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "열다 + -(으)ㄹ 거예요 → 미래 계획, 해요체",
        "contextMeaning": {
          "ko": "열다 + -(으)ㄹ 거예요 → 미래 계획, 해요체",
          "ja": "열다＋-(으)ㄹ 거예요で未来の予定をヘヨ体にしてください。",
          "en": "Use 열다 + -(으)ㄹ 거예요 for a future plan in polite style.",
          "zh": "用열다加-(으)ㄹ 거예요表达将来计划，使用해요体。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "열 거예요",
          "열 거예요."
        ],
        "explanation": {
          "ko": "정답: 열 거예요\n열-의 ㄹ을 유지하고 거예요를 붙입니다. 열을 거예요가 아닙니다.",
          "ja": "正解：열 거예요\n열-のㄹを保って거예요を付けます。열을 거예요にはしません。",
          "en": "Answer: 열 거예요\nRetain the ㄹ of 열- and add 거예요; do not add another 을.",
          "zh": "答案：열 거예요\n保留열-的ㄹ，后接거예요，不再加을。"
        }
      }
    ]
  },
  {
    "id": "vowel-contraction",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-vowel-contraction-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "아이를 잠들게 해요. 재우다의 현재 해요체 축약형을 고르세요.",
        "contextMeaning": {
          "ko": "아이를 잠들게 해요. 재우다의 현재 해요체 축약형을 고르세요.",
          "ja": "子どもを寝かせます。재우다の現在ヘヨ体の縮約形を選んでください。",
          "en": "You put a child to sleep. Choose the contracted present polite form of 재우다.",
          "zh": "你哄孩子睡觉，请选择재우다的现在해요体缩约形。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "correct",
            "text": "아이를 재워요.",
            "feedback": {
              "ko": "재우- + -어요에서 ㅜ+ㅓ가 ㅝ로 줄어 재워요가 됩니다. 재와요는 모음 결합이 틀립니다.",
              "ja": "재우-＋-어요ではㅜ＋ㅓがㅝに縮まり재워요になります。재와요は母音の組み合わせが違います。",
              "en": "재우- + -어요 contracts ㅜ + ㅓ to ㅝ: 재워요. 재와요 combines the vowels incorrectly.",
              "zh": "재우-＋-어요中ㅜ＋ㅓ缩为ㅝ，成为재워요；재와요的元音结合错误。"
            }
          },
          {
            "id": "distractor",
            "text": "아이를 재와요.",
            "feedback": {
              "ko": "재우- + -어요에서 ㅜ+ㅓ가 ㅝ로 줄어 재워요가 됩니다. 재와요는 모음 결합이 틀립니다.",
              "ja": "재우-＋-어요ではㅜ＋ㅓがㅝに縮まり재워요になります。재와요は母音の組み合わせが違います。",
              "en": "재우- + -어요 contracts ㅜ + ㅓ to ㅝ: 재워요. 재와요 combines the vowels incorrectly.",
              "zh": "재우-＋-어요中ㅜ＋ㅓ缩为ㅝ，成为재워요；재와요的元音结合错误。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "재우- + -어요에서 ㅜ+ㅓ가 ㅝ로 줄어 재워요가 됩니다. 재와요는 모음 결합이 틀립니다.",
          "ja": "재우-＋-어요ではㅜ＋ㅓがㅝに縮まり재워요になります。재와요は母音の組み合わせが違います。",
          "en": "재우- + -어요 contracts ㅜ + ㅓ to ㅝ: 재워요. 재와요 combines the vowels incorrectly.",
          "zh": "재우-＋-어요中ㅜ＋ㅓ缩为ㅝ，成为재워요；재와요的元音结合错误。"
        }
      },
      {
        "id": "legacy-extra-vowel-contraction-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "비우다 → 현재 해요체의 축약형만 쓰세요.",
        "contextMeaning": {
          "ko": "비우다 → 현재 해요체의 축약형만 쓰세요.",
          "ja": "비우다の現在ヘヨ体の縮約形だけを書いてください。",
          "en": "Write only the contracted present polite form of 비우다.",
          "zh": "只写비우다的现在해요体缩约形。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "비워요",
          "비워요."
        ],
        "explanation": {
          "ko": "정답: 비워요\n비우- + -어요 → 비우어요 → 비워요.",
          "ja": "正解：비워요\n비우-＋-어요→비우어요→비워요。",
          "en": "Answer: 비워요\n비우- + -어요 → 비우어요 → 비워요.",
          "zh": "答案：비워요\n비우-＋-어요→비우어요→비워요。"
        }
      }
    ]
  },
  {
    "id": "honorific-si",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-honorific-si-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "교수님이 어제 도착했어요. 주어를 높이는 과거 문장을 고르세요.",
        "contextMeaning": {
          "ko": "교수님이 어제 도착했어요. 주어를 높이는 과거 문장을 고르세요.",
          "ja": "教授が昨日到着しました。主語を敬う過去の文を選んでください。",
          "en": "The professor arrived yesterday. Choose a past sentence that honors the subject.",
          "zh": "教授昨天到了，请选择尊敬主语的过去时句子。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "교수님이 어제 도착하실 거예요.",
            "feedback": {
              "ko": "도착하- + -시- + -었어요는 도착하셨어요입니다. 도착하실 거예요는 미래라 어제와 맞지 않습니다.",
              "ja": "도착하-＋-시-＋-었어요は도착하셨어요です。도착하실 거예요は未来なので어제と合いません。",
              "en": "도착하- + -시- + -었어요 becomes 도착하셨어요. 도착하실 거예요 is future and conflicts with yesterday.",
              "zh": "도착하-＋-시-＋-었어요成为도착하셨어요；도착하실 거예요表示将来，与昨天不符。"
            }
          },
          {
            "id": "correct",
            "text": "교수님이 어제 도착하셨어요.",
            "feedback": {
              "ko": "도착하- + -시- + -었어요는 도착하셨어요입니다. 도착하실 거예요는 미래라 어제와 맞지 않습니다.",
              "ja": "도착하-＋-시-＋-었어요は도착하셨어요です。도착하실 거예요は未来なので어제と合いません。",
              "en": "도착하- + -시- + -었어요 becomes 도착하셨어요. 도착하실 거예요 is future and conflicts with yesterday.",
              "zh": "도착하-＋-시-＋-었어요成为도착하셨어요；도착하실 거예요表示将来，与昨天不符。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "도착하- + -시- + -었어요는 도착하셨어요입니다. 도착하실 거예요는 미래라 어제와 맞지 않습니다.",
          "ja": "도착하-＋-시-＋-었어요は도착하셨어요です。도착하실 거예요は未来なので어제と合いません。",
          "en": "도착하- + -시- + -었어요 becomes 도착하셨어요. 도착하실 거예요 is future and conflicts with yesterday.",
          "zh": "도착하-＋-시-＋-었어요成为도착하셨어요；도착하실 거예요表示将来，与昨天不符。"
        }
      },
      {
        "id": "legacy-extra-honorific-si-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "앉다 → 주체 높임 과거 해요체",
        "contextMeaning": {
          "ko": "앉다 → 주체 높임 과거 해요체",
          "ja": "앉다を主体敬語・過去のヘヨ体にしてください。",
          "en": "Conjugate 앉다 in past polite style with subject honorification.",
          "zh": "将앉다变为尊敬主语的过去해요体。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "앉으셨어요",
          "앉으셨어요.",
          "앉으시었어요",
          "앉으시었어요."
        ],
        "explanation": {
          "ko": "정답: 앉으셨어요\n앉- + -으시- + -었어요 → 앉으셨어요. 받침 뒤라 으시를 씁니다.",
          "ja": "正解：앉으셨어요\n앉-＋-으시-＋-었어요→앉으셨어요。パッチムの後なので으시です。",
          "en": "Answer: 앉으셨어요\n앉- + -으시- + -었어요 → 앉으셨어요. The final consonant requires 으시.",
          "zh": "答案：앉으셨어요\n앉-＋-으시-＋-었어요→앉으셨어요，有收音所以用으시。"
        }
      }
    ]
  },
  {
    "id": "numbers-counters",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-numbers-counters-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "고양이가 넷 있어요. 마리 앞에 알맞은 수를 고르세요.",
        "contextMeaning": {
          "ko": "고양이가 넷 있어요. 마리 앞에 알맞은 수를 고르세요.",
          "ja": "猫が4匹います。마리の前に適切な数の形を選んでください。",
          "en": "There are four cats. Choose the correct number form before 마리.",
          "zh": "有四只猫，请选择마리前正确的数词形式。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "correct",
            "text": "고양이 네 마리",
            "feedback": {
              "ko": "넷은 단위 명사 마리 앞에서 네가 됩니다. 넷 마리는 이 결합에 맞지 않습니다.",
              "ja": "넷は助数詞마리の前で네になります。넷 마리는この組み合わせに合いません。",
              "en": "넷 becomes 네 before counter 마리. 넷 마리 uses the wrong pre-counter form.",
              "zh": "넷在量词마리前变为네，넷 마리的量词前形式不正确。"
            }
          },
          {
            "id": "distractor",
            "text": "고양이 넷 마리",
            "feedback": {
              "ko": "넷은 단위 명사 마리 앞에서 네가 됩니다. 넷 마리는 이 결합에 맞지 않습니다.",
              "ja": "넷は助数詞마리の前で네になります。넷 마리는この組み合わせに合いません。",
              "en": "넷 becomes 네 before counter 마리. 넷 마리 uses the wrong pre-counter form.",
              "zh": "넷在量词마리前变为네，넷 마리的量词前形式不正确。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "넷은 단위 명사 마리 앞에서 네가 됩니다. 넷 마리는 이 결합에 맞지 않습니다.",
          "ja": "넷は助数詞마리の前で네になります。넷 마리는この組み合わせに合いません。",
          "en": "넷 becomes 네 before counter 마리. 넷 마리 uses the wrong pre-counter form.",
          "zh": "넷在量词마리前变为네，넷 마리的量词前形式不正确。"
        }
      },
      {
        "id": "legacy-extra-numbers-counters-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "책 / 스물 / 권 → 명사구 전체를 쓰세요.",
        "contextMeaning": {
          "ko": "책 / 스물 / 권 → 명사구 전체를 쓰세요.",
          "ja": "책／스물／권を使って名詞句全体を書いてください。",
          "en": "Write the full noun phrase using 책 / 스물 / 권.",
          "zh": "用책／스물／권写出完整名词短语。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "책 스무 권",
          "책 스무 권."
        ],
        "explanation": {
          "ko": "정답: 책 스무 권\n스물 → 스무: 책 + 스무 + 권 → 책 스무 권.",
          "ja": "正解：책 스무 권\n스물→스무：책＋스무＋권→책 스무 권。",
          "en": "Answer: 책 스무 권\n스물 → 스무 before a counter: 책 스무 권.",
          "zh": "答案：책 스무 권\n스물在量词前变为스무：책 스무 권。"
        }
      }
    ]
  },
  {
    "id": "bieup-irregular",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-bieup-irregular-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "국의 온도가 높아요. 뜨겁다의 현재 해요체를 고르세요.",
        "contextMeaning": {
          "ko": "국의 온도가 높아요. 뜨겁다의 현재 해요체를 고르세요.",
          "ja": "スープの温度が高いです。뜨겁다の現在ヘヨ体を選んでください。",
          "en": "The soup is hot. Choose the present polite form of 뜨겁다.",
          "zh": "汤很烫，请选择뜨겁다的现在해요体。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "국이 뜨겁어요.",
            "feedback": {
              "ko": "뜨겁-의 ㅂ이 우로 바뀌어 뜨거우- + -어요 → 뜨거워요가 됩니다. 뜨겁어요는 변화를 빠뜨렸습니다.",
              "ja": "뜨겁-のㅂが우に変わり、뜨거우-＋-어요→뜨거워요になります。뜨겁어요はこの変化がありません。",
              "en": "뜨겁- changes ㅂ to 우: 뜨거우- + -어요 → 뜨거워요. 뜨겁어요 misses that change.",
              "zh": "뜨겁-的ㅂ变为우，뜨거우-＋-어요→뜨거워요；뜨겁어요遗漏了变化。"
            }
          },
          {
            "id": "correct",
            "text": "국이 뜨거워요.",
            "feedback": {
              "ko": "뜨겁-의 ㅂ이 우로 바뀌어 뜨거우- + -어요 → 뜨거워요가 됩니다. 뜨겁어요는 변화를 빠뜨렸습니다.",
              "ja": "뜨겁-のㅂが우に変わり、뜨거우-＋-어요→뜨거워요になります。뜨겁어요はこの変化がありません。",
              "en": "뜨겁- changes ㅂ to 우: 뜨거우- + -어요 → 뜨거워요. 뜨겁어요 misses that change.",
              "zh": "뜨겁-的ㅂ变为우，뜨거우-＋-어요→뜨거워요；뜨겁어요遗漏了变化。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "뜨겁-의 ㅂ이 우로 바뀌어 뜨거우- + -어요 → 뜨거워요가 됩니다. 뜨겁어요는 변화를 빠뜨렸습니다.",
          "ja": "뜨겁-のㅂが우に変わり、뜨거우-＋-어요→뜨거워요になります。뜨겁어요はこの変化がありません。",
          "en": "뜨겁- changes ㅂ to 우: 뜨거우- + -어요 → 뜨거워요. 뜨겁어요 misses that change.",
          "zh": "뜨겁-的ㅂ变为우，뜨거우-＋-어요→뜨거워요；뜨겁어요遗漏了变化。"
        }
      },
      {
        "id": "legacy-extra-bieup-irregular-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "가볍다 → 현재 해요체",
        "contextMeaning": {
          "ko": "가볍다 → 현재 해요체",
          "ja": "가볍다を現在のヘヨ体にしてください。",
          "en": "Conjugate 가볍다 in present polite style.",
          "zh": "将가볍다变为现在해요体。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "가벼워요",
          "가벼워요."
        ],
        "explanation": {
          "ko": "정답: 가벼워요\n가볍- → 가벼우- + -어요 → 가벼워요. ㅂ이 우로 바뀝니다.",
          "ja": "正解：가벼워요\n가볍-→가벼우-＋-어요→가벼워요。ㅂが우に変わります。",
          "en": "Answer: 가벼워요\n가볍- → 가벼우- + -어요 → 가벼워요; ㅂ changes to 우.",
          "zh": "答案：가벼워요\n가볍-→가벼우-＋-어요→가벼워요，ㅂ变为우。"
        }
      }
    ]
  },
  {
    "id": "digeut-irregular",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-digeut-irregular-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "모르는 길을 질문해요. 묻다(질문하다)의 현재 해요체를 고르세요.",
        "contextMeaning": {
          "ko": "모르는 길을 질문해요. 묻다(질문하다)의 현재 해요체를 고르세요.",
          "ja": "知らない道を尋ねます。묻다（質問する）の現在ヘヨ体を選んでください。",
          "en": "You ask for directions. Choose the present polite form of 묻다 (ask).",
          "zh": "你询问不认识的路，请选择묻다（提问）的现在해요体。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "correct",
            "text": "길을 물어요.",
            "feedback": {
              "ko": "질문한다는 묻다는 모음 어미 앞에서 ㄷ이 ㄹ로 바뀌어 물어요가 됩니다. 묻어요는 땅에 묻다 등의 규칙 활용입니다.",
              "ja": "質問する意味の묻다は母音語尾の前でㄷがㄹに変わり물어요になります。묻어요は「埋める」などの規則活用です。",
              "en": "묻다 meaning ask changes ㄷ to ㄹ before a vowel: 물어요. 묻어요 is the regular form for meanings such as bury.",
              "zh": "表示提问的묻다在元音词尾前把ㄷ变为ㄹ，成为물어요；묻어요用于埋藏等规则变化的含义。"
            }
          },
          {
            "id": "distractor",
            "text": "길을 묻어요.",
            "feedback": {
              "ko": "질문한다는 묻다는 모음 어미 앞에서 ㄷ이 ㄹ로 바뀌어 물어요가 됩니다. 묻어요는 땅에 묻다 등의 규칙 활용입니다.",
              "ja": "質問する意味の묻다は母音語尾の前でㄷがㄹに変わり물어요になります。묻어요は「埋める」などの規則活用です。",
              "en": "묻다 meaning ask changes ㄷ to ㄹ before a vowel: 물어요. 묻어요 is the regular form for meanings such as bury.",
              "zh": "表示提问的묻다在元音词尾前把ㄷ变为ㄹ，成为물어요；묻어요用于埋藏等规则变化的含义。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "질문한다는 묻다는 모음 어미 앞에서 ㄷ이 ㄹ로 바뀌어 물어요가 됩니다. 묻어요는 땅에 묻다 등의 규칙 활용입니다.",
          "ja": "質問する意味の묻다は母音語尾の前でㄷがㄹに変わり물어요になります。묻어요は「埋める」などの規則活用です。",
          "en": "묻다 meaning ask changes ㄷ to ㄹ before a vowel: 물어요. 묻어요 is the regular form for meanings such as bury.",
          "zh": "表示提问的묻다在元音词尾前把ㄷ变为ㄹ，成为물어요；묻어요用于埋藏等规则变化的含义。"
        }
      },
      {
        "id": "legacy-extra-digeut-irregular-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "싣다(짐을 차에 싣다) → 현재 해요체",
        "contextMeaning": {
          "ko": "싣다(짐을 차에 싣다) → 현재 해요체",
          "ja": "싣다（荷物を車に積む）を現在ヘヨ体にしてください。",
          "en": "Conjugate 싣다 (load cargo onto a vehicle) in present polite style.",
          "zh": "将싣다（把货物装上车）变为现在해요体。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "실어요",
          "실어요."
        ],
        "explanation": {
          "ko": "정답: 실어요\n싣-의 ㄷ → ㄹ: 실- + -어요 → 실어요.",
          "ja": "正解：실어요\n싣-のㄷ→ㄹ：실-＋-어요→실어요。",
          "en": "Answer: 실어요\n싣- changes ㄷ to ㄹ: 실- + -어요 → 실어요.",
          "zh": "答案：실어요\n싣-的ㄷ变为ㄹ：실-＋-어요→실어요。"
        }
      }
    ]
  },
  {
    "id": "reu-irregular",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-reu-irregular-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "두 가방의 색이 같지 않아요. 다르다의 현재 해요체를 고르세요.",
        "contextMeaning": {
          "ko": "두 가방의 색이 같지 않아요. 다르다의 현재 해요체를 고르세요.",
          "ja": "二つのかばんの色は同じではありません。다르다の現在ヘヨ体を選んでください。",
          "en": "The two bags differ in color. Choose the present polite form of 다르다.",
          "zh": "两个包的颜色不同，请选择다르다的现在해요体。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "색이 다라요.",
            "feedback": {
              "ko": "다르-는 앞 음절에 ㄹ을 더하고 르를 라로 바꿔 달라요가 됩니다. 다라요는 추가 ㄹ이 없습니다.",
              "ja": "다르-は前の音節にㄹを加え、르を라にして달라요になります。다라요は追加のㄹがありません。",
              "en": "다르- adds ㄹ to the preceding syllable and changes 르 to 라: 달라요. 다라요 omits the added ㄹ.",
              "zh": "다르-在前一音节增加ㄹ，르变为라，成为달라요；다라요遗漏了增加的ㄹ。"
            }
          },
          {
            "id": "correct",
            "text": "색이 달라요.",
            "feedback": {
              "ko": "다르-는 앞 음절에 ㄹ을 더하고 르를 라로 바꿔 달라요가 됩니다. 다라요는 추가 ㄹ이 없습니다.",
              "ja": "다르-は前の音節にㄹを加え、르を라にして달라요になります。다라요は追加のㄹがありません。",
              "en": "다르- adds ㄹ to the preceding syllable and changes 르 to 라: 달라요. 다라요 omits the added ㄹ.",
              "zh": "다르-在前一音节增加ㄹ，르变为라，成为달라요；다라요遗漏了增加的ㄹ。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "다르-는 앞 음절에 ㄹ을 더하고 르를 라로 바꿔 달라요가 됩니다. 다라요는 추가 ㄹ이 없습니다.",
          "ja": "다르-は前の音節にㄹを加え、르を라にして달라요になります。다라요は追加のㄹがありません。",
          "en": "다르- adds ㄹ to the preceding syllable and changes 르 to 라: 달라요. 다라요 omits the added ㄹ.",
          "zh": "다르-在前一音节增加ㄹ，르变为라，成为달라요；다라요遗漏了增加的ㄹ。"
        }
      },
      {
        "id": "legacy-extra-reu-irregular-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "고르다 → 현재 해요체",
        "contextMeaning": {
          "ko": "고르다 → 현재 해요체",
          "ja": "고르다を現在ヘヨ体にしてください。",
          "en": "Conjugate 고르다 in present polite style.",
          "zh": "将고르다变为现在해요体。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "골라요",
          "골라요."
        ],
        "explanation": {
          "ko": "정답: 골라요\n고르- + -아요 → 골라요. 고에 ㄹ을 더하고 르를 라로 바꿉니다.",
          "ja": "正解：골라요\n고르-＋-아요→골라요。고にㄹを加え、르を라にします。",
          "en": "Answer: 골라요\n고르- + -아요 → 골라요. Add ㄹ to 고 and change 르 to 라.",
          "zh": "答案：골라요\n고르-＋-아요→골라요，在고后增加ㄹ，르变为라。"
        }
      }
    ]
  },
  {
    "id": "siot-irregular",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-siot-irregular-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "컵에 물을 넣어요. 붓다의 현재 해요체를 고르세요.",
        "contextMeaning": {
          "ko": "컵에 물을 넣어요. 붓다의 현재 해요체를 고르세요.",
          "ja": "コップに水を注ぎます。붓다の現在ヘヨ体を選んでください。",
          "en": "You pour water into a cup. Choose the present polite form of 붓다.",
          "zh": "你往杯子里倒水，请选择붓다的现在해요体。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "correct",
            "text": "컵에 물을 부어요.",
            "feedback": {
              "ko": "붓-의 ㅅ이 모음 어미 앞에서 빠져 부어요가 됩니다. 붓어요는 ㅅ을 잘못 남겼습니다.",
              "ja": "붓-のㅅが母音語尾の前で落ち、부어요になります。붓어요はㅅを誤って残しています。",
              "en": "붓- drops ㅅ before a vowel ending: 부어요. 붓어요 wrongly retains ㅅ.",
              "zh": "붓-的ㅅ在元音词尾前脱落，成为부어요；붓어요错误地保留了ㅅ。"
            }
          },
          {
            "id": "distractor",
            "text": "컵에 물을 붓어요.",
            "feedback": {
              "ko": "붓-의 ㅅ이 모음 어미 앞에서 빠져 부어요가 됩니다. 붓어요는 ㅅ을 잘못 남겼습니다.",
              "ja": "붓-のㅅが母音語尾の前で落ち、부어요になります。붓어요はㅅを誤って残しています。",
              "en": "붓- drops ㅅ before a vowel ending: 부어요. 붓어요 wrongly retains ㅅ.",
              "zh": "붓-的ㅅ在元音词尾前脱落，成为부어요；붓어요错误地保留了ㅅ。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "붓-의 ㅅ이 모음 어미 앞에서 빠져 부어요가 됩니다. 붓어요는 ㅅ을 잘못 남겼습니다.",
          "ja": "붓-のㅅが母音語尾の前で落ち、부어요になります。붓어요はㅅを誤って残しています。",
          "en": "붓- drops ㅅ before a vowel ending: 부어요. 붓어요 wrongly retains ㅅ.",
          "zh": "붓-的ㅅ在元音词尾前脱落，成为부어요；붓어요错误地保留了ㅅ。"
        }
      },
      {
        "id": "legacy-extra-siot-irregular-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "젓다(국을 젓다) → 현재 해요체",
        "contextMeaning": {
          "ko": "젓다(국을 젓다) → 현재 해요체",
          "ja": "젓다（スープをかき混ぜる）を現在ヘヨ体にしてください。",
          "en": "Conjugate 젓다 (stir soup) in present polite style.",
          "zh": "将젓다（搅拌汤）变为现在해요体。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "저어요",
          "저어요."
        ],
        "explanation": {
          "ko": "정답: 저어요\n젓- → 저- + -어요 → 저어요. ㅅ이 빠져도 두 어를 합치지 않습니다.",
          "ja": "正解：저어요\n젓-→저-＋-어요→저어요。ㅅが落ちても二つの어を一つにしません。",
          "en": "Answer: 저어요\n젓- → 저- + -어요 → 저어요. After dropping ㅅ, retain both 어 vowels.",
          "zh": "答案：저어요\n젓-→저-＋-어요→저어요；ㅅ脱落后，两个어仍保留。"
        }
      }
    ]
  },
  {
    "id": "hieut-irregular",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-hieut-irregular-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "잘 익은 토마토의 색을 말해요. 빨갛다의 현재 해요체를 고르세요.",
        "contextMeaning": {
          "ko": "잘 익은 토마토의 색을 말해요. 빨갛다의 현재 해요체를 고르세요.",
          "ja": "熟したトマトの色を述べます。빨갛다の現在ヘヨ体を選んでください。",
          "en": "Describe a ripe tomato’s color. Choose the present polite form of 빨갛다.",
          "zh": "描述成熟番茄的颜色，请选择빨갛다的现在해요体。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "토마토가 빨갛아요.",
            "feedback": {
              "ko": "빨갛-은 ㅎ이 빠지고 모음이 바뀌어 빨개요가 됩니다. 빨갛아요는 불규칙 변화를 빠뜨렸습니다.",
              "ja": "빨갛-はㅎが落ちて母音が変わり、빨개요になります。빨갛아요は変則変化がありません。",
              "en": "빨갛- drops ㅎ and changes its vowel to form 빨개요. 빨갛아요 misses the irregular change.",
              "zh": "빨갛-脱落ㅎ并改变元音，成为빨개요；빨갛아요遗漏了不规则变化。"
            }
          },
          {
            "id": "correct",
            "text": "토마토가 빨개요.",
            "feedback": {
              "ko": "빨갛-은 ㅎ이 빠지고 모음이 바뀌어 빨개요가 됩니다. 빨갛아요는 불규칙 변화를 빠뜨렸습니다.",
              "ja": "빨갛-はㅎが落ちて母音が変わり、빨개요になります。빨갛아요は変則変化がありません。",
              "en": "빨갛- drops ㅎ and changes its vowel to form 빨개요. 빨갛아요 misses the irregular change.",
              "zh": "빨갛-脱落ㅎ并改变元音，成为빨개요；빨갛아요遗漏了不规则变化。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "빨갛-은 ㅎ이 빠지고 모음이 바뀌어 빨개요가 됩니다. 빨갛아요는 불규칙 변화를 빠뜨렸습니다.",
          "ja": "빨갛-はㅎが落ちて母音が変わり、빨개요になります。빨갛아요は変則変化がありません。",
          "en": "빨갛- drops ㅎ and changes its vowel to form 빨개요. 빨갛아요 misses the irregular change.",
          "zh": "빨갛-脱落ㅎ并改变元音，成为빨개요；빨갛아요遗漏了不规则变化。"
        }
      },
      {
        "id": "legacy-extra-hieut-irregular-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "노랗다 → 현재 해요체",
        "contextMeaning": {
          "ko": "노랗다 → 현재 해요체",
          "ja": "노랗다を現在ヘヨ体にしてください。",
          "en": "Conjugate 노랗다 in present polite style.",
          "zh": "将노랗다变为现在해요体。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "노래요",
          "노래요."
        ],
        "explanation": {
          "ko": "정답: 노래요\n노랗- + -아요 → 노래요. ㅎ이 빠지고 ㅏ가 ㅐ로 바뀝니다.",
          "ja": "正解：노래요\n노랗-＋-아요→노래요。ㅎが落ち、ㅏがㅐに変わります。",
          "en": "Answer: 노래요\n노랗- + -아요 → 노래요. Drop ㅎ and change ㅏ to ㅐ.",
          "zh": "答案：노래요\n노랗-＋-아요→노래요，ㅎ脱落，ㅏ变为ㅐ。"
        }
      }
    ]
  },
  {
    "id": "eu-irregular",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-eu-irregular-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "아기가 보기 좋아요. 예쁘다의 현재 해요체를 고르세요.",
        "contextMeaning": {
          "ko": "아기가 보기 좋아요. 예쁘다의 현재 해요체를 고르세요.",
          "ja": "赤ちゃんがかわいいです。예쁘다の現在ヘヨ体を選んでください。",
          "en": "The baby is pretty. Choose the present polite form of 예쁘다.",
          "zh": "宝宝很可爱，请选择예쁘다的现在해요体。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "correct",
            "text": "아기가 예뻐요.",
            "feedback": {
              "ko": "예쁘-의 으를 빼고 앞 모음 ㅖ에 따라 어요를 골라 예뻐요가 됩니다. ㅖ는 ㅏ·ㅗ가 아니므로 예빠요가 아닙니다.",
              "ja": "예쁘-の으を取り、前の母音ㅖに合わせて어요を選び예뻐요にします。ㅖはㅏ・ㅗではないので예빠요ではありません。",
              "en": "Drop 으 from 예쁘-; the preceding ㅖ selects 어요, giving 예뻐요. ㅖ is not ㅏ or ㅗ, so 예빠요 is wrong.",
              "zh": "예쁘-脱落으，前一元音ㅖ决定用어요，成为예뻐요；ㅖ不是ㅏ或ㅗ，所以不是예빠요。"
            }
          },
          {
            "id": "distractor",
            "text": "아기가 예빠요.",
            "feedback": {
              "ko": "예쁘-의 으를 빼고 앞 모음 ㅖ에 따라 어요를 골라 예뻐요가 됩니다. ㅖ는 ㅏ·ㅗ가 아니므로 예빠요가 아닙니다.",
              "ja": "예쁘-の으を取り、前の母音ㅖに合わせて어요を選び예뻐요にします。ㅖはㅏ・ㅗではないので예빠요ではありません。",
              "en": "Drop 으 from 예쁘-; the preceding ㅖ selects 어요, giving 예뻐요. ㅖ is not ㅏ or ㅗ, so 예빠요 is wrong.",
              "zh": "예쁘-脱落으，前一元音ㅖ决定用어요，成为예뻐요；ㅖ不是ㅏ或ㅗ，所以不是예빠요。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "예쁘-의 으를 빼고 앞 모음 ㅖ에 따라 어요를 골라 예뻐요가 됩니다. ㅖ는 ㅏ·ㅗ가 아니므로 예빠요가 아닙니다.",
          "ja": "예쁘-の으を取り、前の母音ㅖに合わせて어요を選び예뻐요にします。ㅖはㅏ・ㅗではないので예빠요ではありません。",
          "en": "Drop 으 from 예쁘-; the preceding ㅖ selects 어요, giving 예뻐요. ㅖ is not ㅏ or ㅗ, so 예빠요 is wrong.",
          "zh": "예쁘-脱落으，前一元音ㅖ决定用어요，成为예뻐요；ㅖ不是ㅏ或ㅗ，所以不是예빠요。"
        }
      },
      {
        "id": "legacy-extra-eu-irregular-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "아프다 → 현재 해요체",
        "contextMeaning": {
          "ko": "아프다 → 현재 해요체",
          "ja": "아프다を現在ヘヨ体にしてください。",
          "en": "Conjugate 아프다 in present polite style.",
          "zh": "将아프다变为现在해요体。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "아파요",
          "아파요."
        ],
        "explanation": {
          "ko": "정답: 아파요\n아프-의 으를 빼고 앞 모음 ㅏ에 따라 아요를 붙여 아파요가 됩니다.",
          "ja": "正解：아파요\n아프-の으を取り、前の母音ㅏに合わせて아요を付け아파요にします。",
          "en": "Answer: 아파요\nDrop 으 from 아프-; preceding ㅏ selects 아요: 아파요.",
          "zh": "答案：아파요\n아프-脱落으，前一元音ㅏ决定接아요，成为아파요。"
        }
      }
    ]
  },
  {
    "id": "rieul-drop",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-rieul-drop-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "문을 열라고 공손히 부탁해요. 열다에 -(으)세요를 붙이세요.",
        "contextMeaning": {
          "ko": "문을 열라고 공손히 부탁해요. 열다에 -(으)세요를 붙이세요.",
          "ja": "ドアを開けるよう丁寧に頼みます。열다に-(으)세요を付けてください。",
          "en": "Politely ask someone to open the door. Attach -(으)세요 to 열다.",
          "zh": "请礼貌地让人开门，在열다后接-(으)세요。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "distractor",
            "text": "문을 열으세요.",
            "feedback": {
              "ko": "열-의 ㄹ은 ㅅ 앞에서 빠져 여세요가 됩니다. 열으세요처럼 으를 넣고 ㄹ을 남기지 않습니다.",
              "ja": "열-のㄹはㅅの前で落ち、여세요になります。열으세요のように으を入れてㄹを残しません。",
              "en": "The ㄹ of 열- drops before ㅅ: 여세요. Do not keep ㄹ and insert 으 as in 열으세요.",
              "zh": "열-的ㄹ在ㅅ前脱落，成为여세요；不能像열으세요一样保留ㄹ并加으。"
            }
          },
          {
            "id": "correct",
            "text": "문을 여세요.",
            "feedback": {
              "ko": "열-의 ㄹ은 ㅅ 앞에서 빠져 여세요가 됩니다. 열으세요처럼 으를 넣고 ㄹ을 남기지 않습니다.",
              "ja": "열-のㄹはㅅの前で落ち、여세요になります。열으세요のように으を入れてㄹを残しません。",
              "en": "The ㄹ of 열- drops before ㅅ: 여세요. Do not keep ㄹ and insert 으 as in 열으세요.",
              "zh": "열-的ㄹ在ㅅ前脱落，成为여세요；不能像열으세요一样保留ㄹ并加으。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "열-의 ㄹ은 ㅅ 앞에서 빠져 여세요가 됩니다. 열으세요처럼 으를 넣고 ㄹ을 남기지 않습니다.",
          "ja": "열-のㄹはㅅの前で落ち、여세요になります。열으세요のように으を入れてㄹを残しません。",
          "en": "The ㄹ of 열- drops before ㅅ: 여세요. Do not keep ㄹ and insert 으 as in 열으세요.",
          "zh": "열-的ㄹ在ㅅ前脱落，成为여세요；不能像열으세요一样保留ㄹ并加으。"
        }
      },
      {
        "id": "legacy-extra-rieul-drop-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "팔다 + -는 → 현재 동작 관형형",
        "contextMeaning": {
          "ko": "팔다 + -는 → 현재 동작 관형형",
          "ja": "팔다＋-는で現在動作の連体形を作ってください。",
          "en": "Make the present verb modifier of 팔다 + -는.",
          "zh": "用팔다加-는构成现在动作定语形。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "파는",
          "파는."
        ],
        "explanation": {
          "ko": "정답: 파는\n팔-의 ㄹ이 ㄴ 앞에서 빠져 파- + -는 → 파는이 됩니다.",
          "ja": "正解：파는\n팔-のㄹがㄴの前で落ち、파-＋-는→파는になります。",
          "en": "Answer: 파는\n팔- drops ㄹ before ㄴ: 파- + -는 → 파는.",
          "zh": "答案：파는\n팔-的ㄹ在ㄴ前脱落：파-＋-는→파는。"
        }
      }
    ]
  },
  {
    "id": "hada-doeda",
    "supplement": true,
    "activities": [
      {
        "id": "legacy-extra-hada-doeda-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "작년보다 한국어가 늘었어요. 향상되다의 과거 해요체 축약형을 고르세요.",
        "contextMeaning": {
          "ko": "작년보다 한국어가 늘었어요. 향상되다의 과거 해요체 축약형을 고르세요.",
          "ja": "去年より韓国語が上達しました。향상되다の過去ヘヨ体の縮約形を選んでください。",
          "en": "Your Korean improved compared with last year. Choose the contracted past polite form of 향상되다.",
          "zh": "你的韩语比去年进步了，请选择향상되다的过去해요体缩约形。"
        },
        "prompt": {
          "ko": "문맥과 형태에 맞는 표현을 고르세요.",
          "ja": "文脈と語形に合う表現を選んでください。",
          "en": "Choose the expression with the correct meaning and form.",
          "zh": "请选择符合语境且形式正确的表达。"
        },
        "options": [
          {
            "id": "correct",
            "text": "한국어가 향상됐어요.",
            "feedback": {
              "ko": "향상되- + -었어요 → 향상되었어요 → 향상됐어요입니다. 됬어요는 잘못된 표기입니다.",
              "ja": "향상되-＋-었어요→향상되었어요→향상됐어요です。됬어요は誤記です。",
              "en": "향상되- + -었어요 → 향상되었어요 → 향상됐어요. 됬어요 is misspelled.",
              "zh": "향상되-＋-었어요→향상되었어요→향상됐어요；됬어요是错误拼写。"
            }
          },
          {
            "id": "distractor",
            "text": "한국어가 향상됬어요.",
            "feedback": {
              "ko": "향상되- + -었어요 → 향상되었어요 → 향상됐어요입니다. 됬어요는 잘못된 표기입니다.",
              "ja": "향상되-＋-었어요→향상되었어요→향상됐어요です。됬어요は誤記です。",
              "en": "향상되- + -었어요 → 향상되었어요 → 향상됐어요. 됬어요 is misspelled.",
              "zh": "향상되-＋-었어요→향상되었어요→향상됐어요；됬어요是错误拼写。"
            }
          }
        ],
        "answer": "correct",
        "explanation": {
          "ko": "향상되- + -었어요 → 향상되었어요 → 향상됐어요입니다. 됬어요는 잘못된 표기입니다.",
          "ja": "향상되-＋-었어요→향상되었어요→향상됐어요です。됬어요は誤記です。",
          "en": "향상되- + -었어요 → 향상되었어요 → 향상됐어요. 됬어요 is misspelled.",
          "zh": "향상되-＋-었어요→향상되었어요→향상됐어요；됬어요是错误拼写。"
        }
      },
      {
        "id": "legacy-extra-hada-doeda-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "청소하다 → 과거 해요체",
        "contextMeaning": {
          "ko": "청소하다 → 과거 해요체",
          "ja": "청소하다を過去ヘヨ体にしてください。",
          "en": "Conjugate 청소하다 in past polite style.",
          "zh": "将청소하다变为过去해요体。"
        },
        "prompt": {
          "ko": "지정된 형태만 쓰세요.",
          "ja": "指定された形だけを書いてください。",
          "en": "Write only the specified form.",
          "zh": "只写指定形式。"
        },
        "accepted": [
          "청소했어요",
          "청소했어요.",
          "청소하였어요",
          "청소하였어요."
        ],
        "explanation": {
          "ko": "정답: 청소했어요\n청소하- + -였어요 → 청소하였어요 → 청소했어요. 두 형태 모두 맞습니다.",
          "ja": "正解：청소했어요\n청소하-＋-였어요→청소하였어요→청소했어요。どちらの形も正しいです。",
          "en": "Answer: 청소했어요\n청소하- + -였어요 → 청소하였어요 → 청소했어요. Both full and contracted forms are correct.",
          "zh": "答案：청소했어요\n청소하-＋-였어요→청소하였어요→청소했어요，完整形式和缩约形都正确。"
        }
      }
    ]
  }
];
