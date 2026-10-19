// Original practice supplements; existing lesson IDs and records are preserved.
window.HARUMAL_GRAMMAR_PACK_LEGACY_FUNCTIONS = [
  {
    "id": "inability",
    "supplement": true,
    "activities": [
      {
        "id": "inability:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "문이 잠겨 있어요. 들어가고 싶지만 열쇠가 없어요. 상황 때문에 불가능함을 말하세요.",
        "contextMeaning": {
          "ko": "문이 잠겨 있어요. 들어가고 싶지만 열쇠가 없어요. 상황 때문에 불가능함을 말하세요.",
          "ja": "ドアに鍵がかかっています。入りたいのですが鍵がありません。状況上できないことを伝えます。",
          "en": "The door is locked. You want to enter but have no key. Express situational inability.",
          "zh": "门锁着，你想进去但没有钥匙。请表达情况导致的不可能。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "들어가지 못해요.",
            "feedback": {
              "ko": "맞아요. 못해요는 상황 때문에 못 들어감을 나타냅니다. 싶지 않아요는 들어갈 의향이 없다는 뜻이라 상황과 반대입니다.",
              "ja": "正解です。못해요は状況上入れないこと。싶지 않아요は入りたくない意味で、状況と逆です。",
              "en": "Correct. 못해요 expresses being unable to enter. 싶지 않아요 says you do not want to enter, contrary to the context.",
              "zh": "正确。못해요表示无法进入；싶지 않아요表示不想进入，与情境相反。"
            }
          },
          {
            "id": "b",
            "text": "들어가고 싶지 않아요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 못해요는 상황 때문에 못 들어감을 나타냅니다. 싶지 않아요는 들어갈 의향이 없다는 뜻이라 상황과 반대입니다.",
              "ja": "文脈に合いません。못해요は状況上入れないこと。싶지 않아요は入りたくない意味で、状況と逆です。",
              "en": "This does not fit the context. 못해요 expresses being unable to enter. 싶지 않아요 says you do not want to enter, contrary to the context.",
              "zh": "不符合语境。못해요表示无法进入；싶지 않아요表示不想进入，与情境相反。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "못해요는 상황 때문에 못 들어감을 나타냅니다. 싶지 않아요는 들어갈 의향이 없다는 뜻이라 상황과 반대입니다.",
          "ja": "못해요は状況上入れないこと。싶지 않아요は入りたくない意味で、状況と逆です。",
          "en": "못해요 expresses being unable to enter. 싶지 않아요 says you do not want to enter, contrary to the context.",
          "zh": "못해요表示无法进入；싶지 않아요表示不想进入，与情境相反。"
        }
      },
      {
        "id": "inability:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "전화하다 → 긴 불가능 -지 못하다, 현재 해요체",
        "contextMeaning": {
          "ko": "전화하다 → 긴 불가능 -지 못하다, 현재 해요체",
          "ja": "전화하다を長い不可能表現-지 못하다の現在ヘヨ体にしてください。",
          "en": "Convert 전화하다 to long inability -지 못하다, present polite style.",
          "zh": "将전화하다变为长形式不能表达-지 못하다，现在礼貌体。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "전화하지 못해요"
        ],
        "explanation": {
          "ko": "정답: 전화하지 못해요\n만드는 과정: 전화하다 → 전화하- + -지 못해요",
          "ja": "正解：전화하지 못해요\n作り方：전화하다 → 전화하- + -지 못해요",
          "en": "Answer: 전화하지 못해요\nFormation: 전화하다 → 전화하- + -지 못해요",
          "zh": "答案：전화하지 못해요\n构成：전화하다 → 전화하- + -지 못해요"
        }
      }
    ]
  },
  {
    "id": "ability",
    "supplement": true,
    "activities": [
      {
        "id": "ability:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "이제 혼자 자전거를 탈 능력이 생겼어요. 가능함을 말하세요.",
        "contextMeaning": {
          "ko": "이제 혼자 자전거를 탈 능력이 생겼어요. 가능함을 말하세요.",
          "ja": "今は一人で自転車に乗れるようになりました。能力上可能であることを伝えます。",
          "en": "You are now able to ride a bicycle alone. Express this ability.",
          "zh": "你现在能独自骑自行车了。请表达这种能力。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "혼자 자전거를 타야 해요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 탈 수 있어요는 능력을 말합니다. 타야 해요는 의무이며 탈 수 있는지는 설명하지 않습니다.",
              "ja": "文脈に合いません。탈 수 있어요は能力。타야 해요は義務で、できるかどうかは表しません。",
              "en": "This does not fit the context. 탈 수 있어요 states ability. 타야 해요 states an obligation, not whether you can do it.",
              "zh": "不符合语境。탈 수 있어요表示能力；타야 해요表示义务，不说明是否能做到。"
            }
          },
          {
            "id": "a",
            "text": "혼자 자전거를 탈 수 있어요.",
            "feedback": {
              "ko": "맞아요. 탈 수 있어요는 능력을 말합니다. 타야 해요는 의무이며 탈 수 있는지는 설명하지 않습니다.",
              "ja": "正解です。탈 수 있어요は能力。타야 해요は義務で、できるかどうかは表しません。",
              "en": "Correct. 탈 수 있어요 states ability. 타야 해요 states an obligation, not whether you can do it.",
              "zh": "正确。탈 수 있어요表示能力；타야 해요表示义务，不说明是否能做到。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "탈 수 있어요는 능력을 말합니다. 타야 해요는 의무이며 탈 수 있는지는 설명하지 않습니다.",
          "ja": "탈 수 있어요は能力。타야 해요は義務で、できるかどうかは表しません。",
          "en": "탈 수 있어요 states ability. 타야 해요 states an obligation, not whether you can do it.",
          "zh": "탈 수 있어요表示能力；타야 해요表示义务，不说明是否能做到。"
        }
      },
      {
        "id": "ability:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "열다 → -(으)ㄹ 수 있다, 현재 해요체",
        "contextMeaning": {
          "ko": "열다 → -(으)ㄹ 수 있다, 현재 해요체",
          "ja": "열다を可能表現-(으)ㄹ 수 있다の現在ヘヨ体にしてください。",
          "en": "Convert 열다 to ability -(으)ㄹ 수 있다, present polite style.",
          "zh": "将열다变为可能表达-(으)ㄹ 수 있다，现在礼貌体。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "열 수 있어요"
        ],
        "explanation": {
          "ko": "정답: 열 수 있어요\n만드는 과정: 열다 → 열- + 수 있어요 (ㄹ 유지)",
          "ja": "正解：열 수 있어요\n作り方：열다 → 열- + 수 있어요 (ㄹを保持)",
          "en": "Answer: 열 수 있어요\nFormation: 열다 → 열- + 수 있어요 (retain ㄹ)",
          "zh": "答案：열 수 있어요\n构成：열다 → 열- + 수 있어요 (保留ㄹ)"
        }
      }
    ]
  },
  {
    "id": "want",
    "supplement": true,
    "activities": [
      {
        "id": "want:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "지금 내 바람은 바다를 보는 거예요. 의무가 아니라 내 희망을 말하세요.",
        "contextMeaning": {
          "ko": "지금 내 바람은 바다를 보는 거예요. 의무가 아니라 내 희망을 말하세요.",
          "ja": "今の自分の願いは海を見ることです。義務でなく自分の希望を伝えます。",
          "en": "Your personal wish is to see the sea. Express a wish, not an obligation.",
          "zh": "你想看海。请表达自己的愿望，而非义务。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "바다를 보고 싶어요.",
            "feedback": {
              "ko": "맞아요. 보고 싶어요는 내 희망입니다. 봐야 해요는 봐야 할 필요나 의무를 덧붙입니다.",
              "ja": "正解です。보고 싶어요は自分の希望。봐야 해요は必要や義務を加えます。",
              "en": "Correct. 보고 싶어요 expresses your desire; 봐야 해요 adds necessity or obligation.",
              "zh": "正确。보고 싶어요表达自己的愿望；봐야 해요增加了必要或义务。"
            }
          },
          {
            "id": "b",
            "text": "바다를 봐야 해요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 보고 싶어요는 내 희망입니다. 봐야 해요는 봐야 할 필요나 의무를 덧붙입니다.",
              "ja": "文脈に合いません。보고 싶어요は自分の希望。봐야 해요は必要や義務を加えます。",
              "en": "This does not fit the context. 보고 싶어요 expresses your desire; 봐야 해요 adds necessity or obligation.",
              "zh": "不符合语境。보고 싶어요表达自己的愿望；봐야 해요增加了必要或义务。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "보고 싶어요는 내 희망입니다. 봐야 해요는 봐야 할 필요나 의무를 덧붙입니다.",
          "ja": "보고 싶어요は自分の希望。봐야 해요は必要や義務を加えます。",
          "en": "보고 싶어요 expresses your desire; 봐야 해요 adds necessity or obligation.",
          "zh": "보고 싶어요表达自己的愿望；봐야 해요增加了必要或义务。"
        }
      },
      {
        "id": "want:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "여행하다 → 내 희망 -고 싶다, 현재 해요체",
        "contextMeaning": {
          "ko": "여행하다 → 내 희망 -고 싶다, 현재 해요체",
          "ja": "여행하다を自分の希望-고 싶다の現在ヘヨ体にしてください。",
          "en": "Express your wish using 여행하다 + -고 싶다, present polite style.",
          "zh": "用여행하다和-고 싶다表达自己的愿望，现在礼貌体。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "여행하고 싶어요"
        ],
        "explanation": {
          "ko": "정답: 여행하고 싶어요\n만드는 과정: 여행하다 → 여행하- + -고 싶어요",
          "ja": "正解：여행하고 싶어요\n作り方：여행하다 → 여행하- + -고 싶어요",
          "en": "Answer: 여행하고 싶어요\nFormation: 여행하다 → 여행하- + -고 싶어요",
          "zh": "答案：여행하고 싶어요\n构成：여행하다 → 여행하- + -고 싶어요"
        }
      }
    ]
  },
  {
    "id": "request",
    "supplement": true,
    "activities": [
      {
        "id": "request:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "말이 너무 빨라 잘 못 들었어요. 상대에게 다시 말해 달라고 부탁하세요.",
        "contextMeaning": {
          "ko": "말이 너무 빨라 잘 못 들었어요. 상대에게 다시 말해 달라고 부탁하세요.",
          "ja": "話が速く聞き取れませんでした。相手にもう一度話すよう頼みます。",
          "en": "Speech was too fast to catch. Ask the other person to say it again.",
          "zh": "对方说得太快，你没听清。请对方再说一遍。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "다시 말하고 싶어요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 말해 주세요는 상대에게 행동을 부탁합니다. 말하고 싶어요는 내가 말하고 싶다는 뜻입니다.",
              "ja": "文脈に合いません。말해 주세요は相手への依頼。말하고 싶어요は自分が話したいという意味です。",
              "en": "This does not fit the context. 말해 주세요 asks the other person to act. 말하고 싶어요 expresses your own wish to speak.",
              "zh": "不符合语境。말해 주세요请求对方行动；말하고 싶어요表示自己想说话。"
            }
          },
          {
            "id": "a",
            "text": "다시 말해 주세요.",
            "feedback": {
              "ko": "맞아요. 말해 주세요는 상대에게 행동을 부탁합니다. 말하고 싶어요는 내가 말하고 싶다는 뜻입니다.",
              "ja": "正解です。말해 주세요は相手への依頼。말하고 싶어요は自分が話したいという意味です。",
              "en": "Correct. 말해 주세요 asks the other person to act. 말하고 싶어요 expresses your own wish to speak.",
              "zh": "正确。말해 주세요请求对方行动；말하고 싶어요表示自己想说话。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "말해 주세요는 상대에게 행동을 부탁합니다. 말하고 싶어요는 내가 말하고 싶다는 뜻입니다.",
          "ja": "말해 주세요は相手への依頼。말하고 싶어요は自分が話したいという意味です。",
          "en": "말해 주세요 asks the other person to act. 말하고 싶어요 expresses your own wish to speak.",
          "zh": "말해 주세요请求对方行动；말하고 싶어요表示自己想说话。"
        }
      },
      {
        "id": "request:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "돕다 → -아/어 주세요로 부탁",
        "contextMeaning": {
          "ko": "돕다 → -아/어 주세요로 부탁",
          "ja": "돕다に-아/어 주세요を付けて頼んでください。",
          "en": "Make a request from 돕다 using -아/어 주세요.",
          "zh": "用돕다加-아/어 주세요提出请求。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "도와 주세요",
          "도와주세요"
        ],
        "explanation": {
          "ko": "정답: 도와 주세요\n만드는 과정: 돕다 → 도와 + 주세요 (ㅂ 불규칙)",
          "ja": "正解：도와 주세요\n作り方：돕다 → 도와 + 주세요 (ㅂ変則)",
          "en": "Answer: 도와 주세요\nFormation: 돕다 → 도와 + 주세요 (ㅂ irregular)",
          "zh": "答案：도와 주세요\n构成：돕다 → 도와 + 주세요 (ㅂ不规则)"
        }
      }
    ]
  },
  {
    "id": "permission",
    "supplement": true,
    "activities": [
      {
        "id": "permission:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "선생님이 이 사전을 사용해도 괜찮다고 했어요. 허락을 전하세요.",
        "contextMeaning": {
          "ko": "선생님이 이 사전을 사용해도 괜찮다고 했어요. 허락을 전하세요.",
          "ja": "先生がこの辞書を使ってもよいと言いました。許可を伝えます。",
          "en": "The teacher permits using this dictionary. Express permission.",
          "zh": "老师允许使用这本词典。请表达许可。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "이 사전을 써도 돼요.",
            "feedback": {
              "ko": "맞아요. 써도 돼요는 사용 허락입니다. 쓰면 안 돼요는 금지라 뜻이 반대입니다.",
              "ja": "正解です。써도 돼요は使用許可。쓰면 안 돼요は禁止で逆の意味です。",
              "en": "Correct. 써도 돼요 permits use; 쓰면 안 돼요 forbids it, reversing the meaning.",
              "zh": "正确。써도 돼요表示允许使用；쓰면 안 돼요表示禁止，意思相反。"
            }
          },
          {
            "id": "b",
            "text": "이 사전을 쓰면 안 돼요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 써도 돼요는 사용 허락입니다. 쓰면 안 돼요는 금지라 뜻이 반대입니다.",
              "ja": "文脈に合いません。써도 돼요は使用許可。쓰면 안 돼요は禁止で逆の意味です。",
              "en": "This does not fit the context. 써도 돼요 permits use; 쓰면 안 돼요 forbids it, reversing the meaning.",
              "zh": "不符合语境。써도 돼요表示允许使用；쓰면 안 돼요表示禁止，意思相反。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "써도 돼요는 사용 허락입니다. 쓰면 안 돼요는 금지라 뜻이 반대입니다.",
          "ja": "써도 돼요は使用許可。쓰면 안 돼요は禁止で逆の意味です。",
          "en": "써도 돼요 permits use; 쓰면 안 돼요 forbids it, reversing the meaning.",
          "zh": "써도 돼요表示允许使用；쓰면 안 돼요表示禁止，意思相反。"
        }
      },
      {
        "id": "permission:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "앉다 → 허락 -아/어도 되다, 현재 해요체",
        "contextMeaning": {
          "ko": "앉다 → 허락 -아/어도 되다, 현재 해요체",
          "ja": "앉다を許可-아/어도 되다の現在ヘヨ体にしてください。",
          "en": "Convert 앉다 to permission -아/어도 되다, present polite style.",
          "zh": "将앉다变为许可-아/어도 되다，现在礼貌体。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "앉아도 돼요"
        ],
        "explanation": {
          "ko": "정답: 앉아도 돼요\n만드는 과정: 앉다 → 앉아 + 도 돼요",
          "ja": "正解：앉아도 돼요\n作り方：앉다 → 앉아 + 도 돼요",
          "en": "Answer: 앉아도 돼요\nFormation: 앉다 → 앉아 + 도 돼요",
          "zh": "答案：앉아도 돼요\n构成：앉다 → 앉아 + 도 돼요"
        }
      }
    ]
  },
  {
    "id": "prohibition",
    "supplement": true,
    "activities": [
      {
        "id": "prohibition:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "이 문은 비상구라 짐으로 막는 것이 금지되어 있어요. 금지를 말하세요.",
        "contextMeaning": {
          "ko": "이 문은 비상구라 짐으로 막는 것이 금지되어 있어요. 금지를 말하세요.",
          "ja": "このドアは非常口で、荷物でふさぐことは禁止です。禁止を伝えます。",
          "en": "This door is an emergency exit. Blocking it with bags is prohibited.",
          "zh": "这扇门是紧急出口，禁止用行李堵住。请表达禁止。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "이 문을 막아도 돼요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 막으면 안 돼요가 금지입니다. 막아도 돼요는 막는 것을 허락하여 안전 규칙과 반대입니다.",
              "ja": "文脈に合いません。막으면 안 돼요は禁止。막아도 돼요はふさいでもよいという許可で逆です。",
              "en": "This does not fit the context. 막으면 안 돼요 forbids blocking. 막아도 돼요 permits it and contradicts the rule.",
              "zh": "不符合语境。막으면 안 돼요禁止堵门；막아도 돼요却允许堵门，与规定相反。"
            }
          },
          {
            "id": "a",
            "text": "이 문을 막으면 안 돼요.",
            "feedback": {
              "ko": "맞아요. 막으면 안 돼요가 금지입니다. 막아도 돼요는 막는 것을 허락하여 안전 규칙과 반대입니다.",
              "ja": "正解です。막으면 안 돼요は禁止。막아도 돼요はふさいでもよいという許可で逆です。",
              "en": "Correct. 막으면 안 돼요 forbids blocking. 막아도 돼요 permits it and contradicts the rule.",
              "zh": "正确。막으면 안 돼요禁止堵门；막아도 돼요却允许堵门，与规定相反。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "막으면 안 돼요가 금지입니다. 막아도 돼요는 막는 것을 허락하여 안전 규칙과 반대입니다.",
          "ja": "막으면 안 돼요は禁止。막아도 돼요はふさいでもよいという許可で逆です。",
          "en": "막으면 안 돼요 forbids blocking. 막아도 돼요 permits it and contradicts the rule.",
          "zh": "막으면 안 돼요禁止堵门；막아도 돼요却允许堵门，与规定相反。"
        }
      },
      {
        "id": "prohibition:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "만지다 → 금지 -(으)면 안 되다, 현재 해요체",
        "contextMeaning": {
          "ko": "만지다 → 금지 -(으)면 안 되다, 현재 해요체",
          "ja": "만지다を禁止-(으)면 안 되다の現在ヘヨ体にしてください。",
          "en": "Convert 만지다 to prohibition -(으)면 안 되다, present polite style.",
          "zh": "将만지다变为禁止-(으)면 안 되다，现在礼貌体。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "만지면 안 돼요"
        ],
        "explanation": {
          "ko": "정답: 만지면 안 돼요\n만드는 과정: 만지다 → 만지- + -면 안 돼요",
          "ja": "正解：만지면 안 돼요\n作り方：만지다 → 만지- + -면 안 돼요",
          "en": "Answer: 만지면 안 돼요\nFormation: 만지다 → 만지- + -면 안 돼요",
          "zh": "答案：만지면 안 돼요\n构成：만지다 → 만지- + -면 안 돼요"
        }
      }
    ]
  },
  {
    "id": "obligation",
    "supplement": true,
    "activities": [
      {
        "id": "obligation:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "제출 마감이 오늘이에요. 오늘 제출할 필요가 있음을 말하세요.",
        "contextMeaning": {
          "ko": "제출 마감이 오늘이에요. 오늘 제출할 필요가 있음을 말하세요.",
          "ja": "提出締切は今日です。今日提出する必要があると伝えます。",
          "en": "The submission deadline is today. State the necessity to submit today.",
          "zh": "提交截止日期是今天。请表达今天必须提交。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "오늘 제출해야 해요.",
            "feedback": {
              "ko": "맞아요. 제출해야 해요는 필요·의무입니다. 제출해도 돼요는 허락일 뿐 마감 의무를 나타내지 않습니다.",
              "ja": "正解です。제출해야 해요は必要・義務。제출해도 돼요は許可だけで、締切の義務を伝えません。",
              "en": "Correct. 제출해야 해요 states necessity. 제출해도 돼요 only permits submitting and does not express the deadline obligation.",
              "zh": "正确。제출해야 해요表示必要或义务；제출해도 돼요只表示允许，不表达截止义务。"
            }
          },
          {
            "id": "b",
            "text": "오늘 제출해도 돼요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 제출해야 해요는 필요·의무입니다. 제출해도 돼요는 허락일 뿐 마감 의무를 나타내지 않습니다.",
              "ja": "文脈に合いません。제출해야 해요は必要・義務。제출해도 돼요は許可だけで、締切の義務を伝えません。",
              "en": "This does not fit the context. 제출해야 해요 states necessity. 제출해도 돼요 only permits submitting and does not express the deadline obligation.",
              "zh": "不符合语境。제출해야 해요表示必要或义务；제출해도 돼요只表示允许，不表达截止义务。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "제출해야 해요는 필요·의무입니다. 제출해도 돼요는 허락일 뿐 마감 의무를 나타내지 않습니다.",
          "ja": "제출해야 해요は必要・義務。제출해도 돼요は許可だけで、締切の義務を伝えません。",
          "en": "제출해야 해요 states necessity. 제출해도 돼요 only permits submitting and does not express the deadline obligation.",
          "zh": "제출해야 해요表示必要或义务；제출해도 돼요只表示允许，不表达截止义务。"
        }
      },
      {
        "id": "obligation:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "기다리다 → 의무 -아/어야 해요 또는 -아/어야 돼요",
        "contextMeaning": {
          "ko": "기다리다 → 의무 -아/어야 해요 또는 -아/어야 돼요",
          "ja": "기다리다を義務の-아/어야 해요または-아/어야 돼요にしてください。",
          "en": "Express obligation with 기다리다, using -아/어야 해요 or -아/어야 돼요.",
          "zh": "用기다리다表达义务，使用-아/어야 해요或-아/어야 돼요。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "기다려야 해요",
          "기다려야 돼요"
        ],
        "explanation": {
          "ko": "정답: 기다려야 해요\n만드는 과정: 기다리다 → 기다려 + 야 해요 / 야 돼요",
          "ja": "正解：기다려야 해요\n作り方：기다리다 → 기다려 + 야 해요 / 야 돼요",
          "en": "Answer: 기다려야 해요\nFormation: 기다리다 → 기다려 + 야 해요 / 야 돼요",
          "zh": "答案：기다려야 해요\n构成：기다리다 → 기다려 + 야 해요 / 야 돼요"
        }
      }
    ]
  },
  {
    "id": "polite-command",
    "supplement": true,
    "activities": [
      {
        "id": "polite-command:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "안내 직원이 손님에게 이름을 적으라고 공손하게 지시해요. 지시를 고르세요.",
        "contextMeaning": {
          "ko": "안내 직원이 손님에게 이름을 적으라고 공손하게 지시해요. 지시를 고르세요.",
          "ja": "案内係が客に名前を書くよう丁寧に指示します。指示を選びます。",
          "en": "A staff member politely instructs a visitor to write their name. Choose the instruction.",
          "zh": "工作人员礼貌地请客人写姓名。请选择指示。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "이름을 적었어요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 적으세요는 공손한 지시입니다. 적었어요는 이미 적었다는 과거 사실입니다.",
              "ja": "文脈に合いません。적으세요は丁寧な指示。적었어요は書いたという過去の事実です。",
              "en": "This does not fit the context. 적으세요 is a polite instruction; 적었어요 reports a past action.",
              "zh": "不符合语境。적으세요是礼貌指示；적었어요陈述过去已经写过。"
            }
          },
          {
            "id": "a",
            "text": "이름을 적으세요.",
            "feedback": {
              "ko": "맞아요. 적으세요는 공손한 지시입니다. 적었어요는 이미 적었다는 과거 사실입니다.",
              "ja": "正解です。적으세요は丁寧な指示。적었어요は書いたという過去の事実です。",
              "en": "Correct. 적으세요 is a polite instruction; 적었어요 reports a past action.",
              "zh": "正确。적으세요是礼貌指示；적었어요陈述过去已经写过。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "적으세요는 공손한 지시입니다. 적었어요는 이미 적었다는 과거 사실입니다.",
          "ja": "적으세요は丁寧な指示。적었어요は書いたという過去の事実です。",
          "en": "적으세요 is a polite instruction; 적었어요 reports a past action.",
          "zh": "적으세요是礼貌指示；적었어요陈述过去已经写过。"
        }
      },
      {
        "id": "polite-command:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "기다리다 → 공손한 지시 -(으)세요",
        "contextMeaning": {
          "ko": "기다리다 → 공손한 지시 -(으)세요",
          "ja": "기다리다を丁寧な指示-(으)세요にしてください。",
          "en": "Make a polite instruction using 기다리다 + -(으)세요.",
          "zh": "用기다리다加-(으)세요提出礼貌指示。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "기다리세요"
        ],
        "explanation": {
          "ko": "정답: 기다리세요\n만드는 과정: 기다리다 → 기다리- + -세요",
          "ja": "正解：기다리세요\n作り方：기다리다 → 기다리- + -세요",
          "en": "Answer: 기다리세요\nFormation: 기다리다 → 기다리- + -세요",
          "zh": "答案：기다리세요\n构成：기다리다 → 기다리- + -세요"
        }
      }
    ]
  },
  {
    "id": "do-not",
    "supplement": true,
    "activities": [
      {
        "id": "do-not:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "친구가 운전하는 중이에요. 휴대전화를 보지 말라고 공손하게 요청하세요.",
        "contextMeaning": {
          "ko": "친구가 운전하는 중이에요. 휴대전화를 보지 말라고 공손하게 요청하세요.",
          "ja": "友だちが運転中です。携帯を見ないよう丁寧に頼みます。",
          "en": "Your friend is driving. Politely ask them not to look at their phone.",
          "zh": "朋友正在开车，请礼貌地让他不要看手机。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "휴대전화를 보지 마세요.",
            "feedback": {
              "ko": "맞아요. 보지 마세요는 행동을 하지 말라는 요청입니다. 보세요는 보라는 긍정 지시라 반대입니다.",
              "ja": "正解です。보지 마세요は見ないでという依頼。보세요は見てという指示で逆です。",
              "en": "Correct. 보지 마세요 asks them not to look; 보세요 tells them to look instead.",
              "zh": "正确。보지 마세요请求不要看；보세요反而让对方看。"
            }
          },
          {
            "id": "b",
            "text": "휴대전화를 보세요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 보지 마세요는 행동을 하지 말라는 요청입니다. 보세요는 보라는 긍정 지시라 반대입니다.",
              "ja": "文脈に合いません。보지 마세요は見ないでという依頼。보세요は見てという指示で逆です。",
              "en": "This does not fit the context. 보지 마세요 asks them not to look; 보세요 tells them to look instead.",
              "zh": "不符合语境。보지 마세요请求不要看；보세요反而让对方看。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "보지 마세요는 행동을 하지 말라는 요청입니다. 보세요는 보라는 긍정 지시라 반대입니다.",
          "ja": "보지 마세요は見ないでという依頼。보세요は見てという指示で逆です。",
          "en": "보지 마세요 asks them not to look; 보세요 tells them to look instead.",
          "zh": "보지 마세요请求不要看；보세요反而让对方看。"
        }
      },
      {
        "id": "do-not:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "문을 닫다 → -지 마세요로 금지, 목적어 유지",
        "contextMeaning": {
          "ko": "문을 닫다 → -지 마세요로 금지, 목적어 유지",
          "ja": "문을 닫다を-지 마세요で禁止し、目的語も残してください。",
          "en": "Use -지 마세요 to prohibit 문을 닫다; retain the object.",
          "zh": "用-지 마세요禁止문을 닫다，保留宾语。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "문을 닫지 마세요"
        ],
        "explanation": {
          "ko": "정답: 문을 닫지 마세요\n만드는 과정: 문을 닫다 → 문을 닫- + -지 마세요",
          "ja": "正解：문을 닫지 마세요\n作り方：문을 닫다 → 문을 닫- + -지 마세요",
          "en": "Answer: 문을 닫지 마세요\nFormation: 문을 닫다 → 문을 닫- + -지 마세요",
          "zh": "答案：문을 닫지 마세요\n构成：문을 닫다 → 문을 닫- + -지 마세요"
        }
      }
    ]
  },
  {
    "id": "suggestion",
    "supplement": true,
    "activities": [
      {
        "id": "suggestion:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "둘이 함께 영화를 볼지 상대의 의견을 물으며 제안하세요.",
        "contextMeaning": {
          "ko": "둘이 함께 영화를 볼지 상대의 의견을 물으며 제안하세요.",
          "ja": "二人で映画を見るか、相手の意見を聞きながら提案します。",
          "en": "Propose watching a film together while asking the listener’s opinion.",
          "zh": "请一边询问对方意见，一边提议两人一起看电影。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "같이 영화를 봤어요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 볼까요?는 함께 할 행동에 대한 제안·질문입니다. 봤어요는 이미 본 과거를 말합니다.",
              "ja": "文脈に合いません。볼까요?は一緒にすることの提案・質問。봤어요はすでに見た過去です。",
              "en": "This does not fit the context. 볼까요? proposes a shared action; 봤어요 reports having already watched.",
              "zh": "不符合语境。볼까요?提议共同行动；봤어요陈述过去已经看过。"
            }
          },
          {
            "id": "a",
            "text": "같이 영화를 볼까요?",
            "feedback": {
              "ko": "맞아요. 볼까요?는 함께 할 행동에 대한 제안·질문입니다. 봤어요는 이미 본 과거를 말합니다.",
              "ja": "正解です。볼까요?は一緒にすることの提案・質問。봤어요はすでに見た過去です。",
              "en": "Correct. 볼까요? proposes a shared action; 봤어요 reports having already watched.",
              "zh": "正确。볼까요?提议共同行动；봤어요陈述过去已经看过。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "볼까요?는 함께 할 행동에 대한 제안·질문입니다. 봤어요는 이미 본 과거를 말합니다.",
          "ja": "볼까요?は一緒にすることの提案・質問。봤어요はすでに見た過去です。",
          "en": "볼까요? proposes a shared action; 봤어요 reports having already watched.",
          "zh": "볼까요?提议共同行动；봤어요陈述过去已经看过。"
        }
      },
      {
        "id": "suggestion:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "먹다 → 같이 + -(으)ㄹ까요?로 제안",
        "contextMeaning": {
          "ko": "먹다 → 같이 + -(으)ㄹ까요?로 제안",
          "ja": "먹다を같이と-(으)ㄹ까요?を使う提案にしてください。",
          "en": "Propose using 같이 + 먹다 + -(으)ㄹ까요?",
          "zh": "用같이、먹다和-(으)ㄹ까요?提出建议。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "같이 먹을까요?"
        ],
        "explanation": {
          "ko": "정답: 같이 먹을까요?\n만드는 과정: 먹다 → 먹- + -을까요? / 같이 + 먹을까요?",
          "ja": "正解：같이 먹을까요?\n作り方：먹다 → 먹- + -을까요? / 같이 + 먹을까요?",
          "en": "Answer: 같이 먹을까요?\nFormation: 먹다 → 먹- + -을까요? / 같이 + 먹을까요?",
          "zh": "答案：같이 먹을까요?\n构成：먹다 → 먹- + -을까요? / 같이 + 먹을까요?"
        }
      }
    ]
  },
  {
    "id": "intention",
    "supplement": true,
    "activities": [
      {
        "id": "intention:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "아직 출발하지 않았어요. 내일 박물관에 가려는 계획을 말하세요.",
        "contextMeaning": {
          "ko": "아직 출발하지 않았어요. 내일 박물관에 가려는 계획을 말하세요.",
          "ja": "まだ出発していません。明日博物館へ行くつもりだと伝えます。",
          "en": "You have not left yet. State your intention to go to the museum tomorrow.",
          "zh": "你还没出发。请表达明天打算去博物馆。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "내일 박물관에 가려고 해요.",
            "feedback": {
              "ko": "맞아요. 가려고 해요는 앞으로의 의도입니다. 어제 갔어요는 이미 일어난 과거라 계획과 다릅니다.",
              "ja": "正解です。가려고 해요は今後の意図。어제 갔어요はすでに起きた過去で、計画と違います。",
              "en": "Correct. 가려고 해요 expresses an intention. 어제 갔어요 describes a completed past visit instead.",
              "zh": "正确。가려고 해요表示意图；어제 갔어요描述已完成的过去访问。"
            }
          },
          {
            "id": "b",
            "text": "어제 박물관에 갔어요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 가려고 해요는 앞으로의 의도입니다. 어제 갔어요는 이미 일어난 과거라 계획과 다릅니다.",
              "ja": "文脈に合いません。가려고 해요は今後の意図。어제 갔어요はすでに起きた過去で、計画と違います。",
              "en": "This does not fit the context. 가려고 해요 expresses an intention. 어제 갔어요 describes a completed past visit instead.",
              "zh": "不符合语境。가려고 해요表示意图；어제 갔어요描述已完成的过去访问。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "가려고 해요는 앞으로의 의도입니다. 어제 갔어요는 이미 일어난 과거라 계획과 다릅니다.",
          "ja": "가려고 해요は今後の意図。어제 갔어요はすでに起きた過去で、計画と違います。",
          "en": "가려고 해요 expresses an intention. 어제 갔어요 describes a completed past visit instead.",
          "zh": "가려고 해요表示意图；어제 갔어요描述已完成的过去访问。"
        }
      },
      {
        "id": "intention:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "만들다 → 의도 -(으)려고 하다, 현재 해요체",
        "contextMeaning": {
          "ko": "만들다 → 의도 -(으)려고 하다, 현재 해요체",
          "ja": "만들다を意図-(으)려고 하다の現在ヘヨ体にしてください。",
          "en": "Express intention with 만들다 + -(으)려고 하다, present polite style.",
          "zh": "用만들다加-(으)려고 하다表达意图，现在礼貌体。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "만들려고 해요"
        ],
        "explanation": {
          "ko": "정답: 만들려고 해요\n만드는 과정: 만들다 → 만들- + -려고 해요 (ㄹ 유지)",
          "ja": "正解：만들려고 해요\n作り方：만들다 → 만들- + -려고 해요 (ㄹを保持)",
          "en": "Answer: 만들려고 해요\nFormation: 만들다 → 만들- + -려고 해요 (retain ㄹ)",
          "zh": "答案：만들려고 해요\n构成：만들다 → 만들- + -려고 해요 (保留ㄹ)"
        }
      }
    ]
  },
  {
    "id": "and-sequence",
    "supplement": true,
    "activities": [
      {
        "id": "and-sequence:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "이 숙소의 장점 두 가지는 조용함과 깨끗함이에요. 두 특성을 -고로 나열하세요.",
        "contextMeaning": {
          "ko": "이 숙소의 장점 두 가지는 조용함과 깨끗함이에요. 두 특성을 -고로 나열하세요.",
          "ja": "この宿の長所は静かなことと清潔なことです。二つの特徴を-고で並べます。",
          "en": "The accommodation is quiet and clean. List both qualities with -고.",
          "zh": "这家住处安静又干净。请用-고并列两个特点。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "조용하면 깨끗해요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 조용하고는 두 특성을 나열합니다. 조용하면은 조용한 경우라는 조건을 만들어 단순 나열과 다릅니다.",
              "ja": "文脈に合いません。조용하고は二つの特徴の列挙。조용하면は条件になり、単純な並列ではありません。",
              "en": "This does not fit the context. 조용하고 lists both qualities. 조용하면 makes quietness a condition rather than simply adding cleanliness.",
              "zh": "不符合语境。조용하고并列两项特点；조용하면把安静变成条件，不是单纯并列。"
            }
          },
          {
            "id": "a",
            "text": "조용하고 깨끗해요.",
            "feedback": {
              "ko": "맞아요. 조용하고는 두 특성을 나열합니다. 조용하면은 조용한 경우라는 조건을 만들어 단순 나열과 다릅니다.",
              "ja": "正解です。조용하고は二つの特徴の列挙。조용하면は条件になり、単純な並列ではありません。",
              "en": "Correct. 조용하고 lists both qualities. 조용하면 makes quietness a condition rather than simply adding cleanliness.",
              "zh": "正确。조용하고并列两项特点；조용하면把安静变成条件，不是单纯并列。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "조용하고는 두 특성을 나열합니다. 조용하면은 조용한 경우라는 조건을 만들어 단순 나열과 다릅니다.",
          "ja": "조용하고は二つの特徴の列挙。조용하면は条件になり、単純な並列ではありません。",
          "en": "조용하고 lists both qualities. 조용하면 makes quietness a condition rather than simply adding cleanliness.",
          "zh": "조용하고并列两项特点；조용하면把安静变成条件，不是单纯并列。"
        }
      },
      {
        "id": "and-sequence:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "예쁘다 / 튼튼해요 → 순서대로 -고로 연결",
        "contextMeaning": {
          "ko": "예쁘다 / 튼튼해요 → 순서대로 -고로 연결",
          "ja": "예쁘다と튼튼해요をこの順で-고でつないでください。",
          "en": "Join 예쁘다 and 튼튼해요 in that order with -고.",
          "zh": "将예쁘다和튼튼해요按此顺序用-고连接。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "예쁘고 튼튼해요"
        ],
        "explanation": {
          "ko": "정답: 예쁘고 튼튼해요\n만드는 과정: 예쁘다 → 예쁘- + -고 / + 튼튼해요",
          "ja": "正解：예쁘고 튼튼해요\n作り方：예쁘다 → 예쁘- + -고 / + 튼튼해요",
          "en": "Answer: 예쁘고 튼튼해요\nFormation: 예쁘다 → 예쁘- + -고 / + 튼튼해요",
          "zh": "答案：예쁘고 튼튼해요\n构成：예쁘다 → 예쁘- + -고 / + 튼튼해요"
        }
      }
    ]
  },
  {
    "id": "cause-sequence",
    "supplement": true,
    "activities": [
      {
        "id": "cause-sequence:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "다리가 아팠기 때문에 오래 걷지 못했어요. 원인과 결과를 -아/어서로 연결하세요.",
        "contextMeaning": {
          "ko": "다리가 아팠기 때문에 오래 걷지 못했어요. 원인과 결과를 -아/어서로 연결하세요.",
          "ja": "脚が痛かったので長く歩けませんでした。理由と結果を-아/어서でつなぎます。",
          "en": "Your leg hurt, so you could not walk for long. Connect cause and result with -아/어서.",
          "zh": "因为腿痛，你没能走很久。请用-아/어서连接原因和结果。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "다리가 아파서 오래 걷지 못했어요.",
            "feedback": {
              "ko": "맞아요. 아파서는 통증이 원인임을 표시합니다. 아파도는 양보 조건이므로 제시된 이유 관계를 명시하지 않습니다.",
              "ja": "正解です。아파서は痛みが原因。아파도は譲歩条件で、指定の理由関係を表しません。",
              "en": "Correct. 아파서 makes the pain the cause. 아파도 is concessive and does not express the requested causal link.",
              "zh": "正确。아파서表明疼痛是原因；아파도是让步，不能表达指定因果关系。"
            }
          },
          {
            "id": "b",
            "text": "다리가 아파도 오래 걷지 못했어요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 아파서는 통증이 원인임을 표시합니다. 아파도는 양보 조건이므로 제시된 이유 관계를 명시하지 않습니다.",
              "ja": "文脈に合いません。아파서は痛みが原因。아파도は譲歩条件で、指定の理由関係を表しません。",
              "en": "This does not fit the context. 아파서 makes the pain the cause. 아파도 is concessive and does not express the requested causal link.",
              "zh": "不符合语境。아파서表明疼痛是原因；아파도是让步，不能表达指定因果关系。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "아파서는 통증이 원인임을 표시합니다. 아파도는 양보 조건이므로 제시된 이유 관계를 명시하지 않습니다.",
          "ja": "아파서は痛みが原因。아파도は譲歩条件で、指定の理由関係を表しません。",
          "en": "아파서 makes the pain the cause. 아파도 is concessive and does not express the requested causal link.",
          "zh": "아파서表明疼痛是原因；아파도是让步，不能表达指定因果关系。"
        }
      },
      {
        "id": "cause-sequence:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "늦게 일어나다 / 아침을 못 먹었어요 → -아/어서, 순서 유지",
        "contextMeaning": {
          "ko": "늦게 일어나다 / 아침을 못 먹었어요 → -아/어서, 순서 유지",
          "ja": "늦게 일어나다と아침을 못 먹었어요をこの順で-아/어서でつないでください。",
          "en": "Join 늦게 일어나다 and 아침을 못 먹었어요 in order using -아/어서.",
          "zh": "将늦게 일어나다和아침을 못 먹었어요按此顺序用-아/어서连接。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "늦게 일어나서 아침을 못 먹었어요"
        ],
        "explanation": {
          "ko": "정답: 늦게 일어나서 아침을 못 먹었어요\n만드는 과정: 일어나다 → 일어나 + 서 / 늦게 일어나서 + 아침을 못 먹었어요",
          "ja": "正解：늦게 일어나서 아침을 못 먹었어요\n作り方：일어나다 → 일어나 + 서 / 늦게 일어나서 + 아침을 못 먹었어요",
          "en": "Answer: 늦게 일어나서 아침을 못 먹었어요\nFormation: 일어나다 → 일어나 + 서 / 늦게 일어나서 + 아침을 못 먹었어요",
          "zh": "答案：늦게 일어나서 아침을 못 먹었어요\n构成：일어나다 → 일어나 + 서 / 늦게 일어나서 + 아침을 못 먹었어요"
        }
      }
    ]
  },
  {
    "id": "contrast",
    "supplement": true,
    "activities": [
      {
        "id": "contrast:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "두 사실은 길이 멀다는 것과 매일 간다는 거예요. 예상과 다른 대조를 -지만으로 나타내세요.",
        "contextMeaning": {
          "ko": "두 사실은 길이 멀다는 것과 매일 간다는 거예요. 예상과 다른 대조를 -지만으로 나타내세요.",
          "ja": "遠いのに毎日通います。予想と違う対照を-지만で表します。",
          "en": "The place is far away, yet you go every day. Express the contrast with -지만.",
          "zh": "地方很远，但你每天都去。请用-지만表达转折。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "멀어서 매일 가요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 멀지만은 거리와 방문의 대조입니다. 멀어서는 멀기 때문에 간다는 이유가 되어 뜻이 달라집니다.",
              "ja": "文脈に合いません。멀지만は距離と通う行動の対照。멀어서では遠いから行くという理由になります。",
              "en": "This does not fit the context. 멀지만 contrasts distance with visiting. 멀어서 makes distance the reason for visiting instead.",
              "zh": "不符合语境。멀지만对比距离与每天去的行为；멀어서却把远作为去的原因。"
            }
          },
          {
            "id": "a",
            "text": "멀지만 매일 가요.",
            "feedback": {
              "ko": "맞아요. 멀지만은 거리와 방문의 대조입니다. 멀어서는 멀기 때문에 간다는 이유가 되어 뜻이 달라집니다.",
              "ja": "正解です。멀지만は距離と通う行動の対照。멀어서では遠いから行くという理由になります。",
              "en": "Correct. 멀지만 contrasts distance with visiting. 멀어서 makes distance the reason for visiting instead.",
              "zh": "正确。멀지만对比距离与每天去的行为；멀어서却把远作为去的原因。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "멀지만은 거리와 방문의 대조입니다. 멀어서는 멀기 때문에 간다는 이유가 되어 뜻이 달라집니다.",
          "ja": "멀지만は距離と通う行動の対照。멀어서では遠いから行くという理由になります。",
          "en": "멀지만 contrasts distance with visiting. 멀어서 makes distance the reason for visiting instead.",
          "zh": "멀지만对比距离与每天去的行为；멀어서却把远作为去的原因。"
        }
      },
      {
        "id": "contrast:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "비싸다 / 맛있어요 → -지만, 순서 유지",
        "contextMeaning": {
          "ko": "비싸다 / 맛있어요 → -지만, 순서 유지",
          "ja": "비싸다と맛있어요をこの順で-지만でつないでください。",
          "en": "Join 비싸다 and 맛있어요 in order with -지만.",
          "zh": "将비싸다和맛있어요按此顺序用-지만连接。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "비싸지만 맛있어요"
        ],
        "explanation": {
          "ko": "정답: 비싸지만 맛있어요\n만드는 과정: 비싸다 → 비싸- + -지만 / + 맛있어요",
          "ja": "正解：비싸지만 맛있어요\n作り方：비싸다 → 비싸- + -지만 / + 맛있어요",
          "en": "Answer: 비싸지만 맛있어요\nFormation: 비싸다 → 비싸- + -지만 / + 맛있어요",
          "zh": "答案：비싸지만 맛있어요\n构成：비싸다 → 비싸- + -지만 / + 맛있어요"
        }
      }
    ]
  },
  {
    "id": "reason-nikka",
    "supplement": true,
    "activities": [
      {
        "id": "reason-nikka:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "방이 어두워요. 이것을 근거로 불을 켜라고 제안하세요. -(으)니까를 쓰세요.",
        "contextMeaning": {
          "ko": "방이 어두워요. 이것을 근거로 불을 켜라고 제안하세요. -(으)니까를 쓰세요.",
          "ja": "部屋が暗いです。それを理由に電気をつけるよう勧めます。-(으)니까を使います。",
          "en": "The room is dark. Use -(으)니까 as the reason for advising someone to turn on the light.",
          "zh": "房间很暗。请用-(으)니까作为建议开灯的理由。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "어두우니까 불을 켜세요.",
            "feedback": {
              "ko": "맞아요. 어두우니까는 어둡다는 사실을 지시의 근거로 삼습니다. 어둡지만은 대조라 요청한 이유 연결이 아닙니다.",
              "ja": "正解です。어두우니까は暗さを指示の根拠にします。어둡지만は対照で、指定の理由ではありません。",
              "en": "Correct. 어두우니까 gives darkness as the reason for the advice. 어둡지만 expresses contrast instead.",
              "zh": "正确。어두우니까以暗为建议的理由；어둡지만表达转折。"
            }
          },
          {
            "id": "b",
            "text": "어둡지만 불을 켜세요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 어두우니까는 어둡다는 사실을 지시의 근거로 삼습니다. 어둡지만은 대조라 요청한 이유 연결이 아닙니다.",
              "ja": "文脈に合いません。어두우니까は暗さを指示の根拠にします。어둡지만は対照で、指定の理由ではありません。",
              "en": "This does not fit the context. 어두우니까 gives darkness as the reason for the advice. 어둡지만 expresses contrast instead.",
              "zh": "不符合语境。어두우니까以暗为建议的理由；어둡지만表达转折。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "어두우니까는 어둡다는 사실을 지시의 근거로 삼습니다. 어둡지만은 대조라 요청한 이유 연결이 아닙니다.",
          "ja": "어두우니까は暗さを指示の根拠にします。어둡지만は対照で、指定の理由ではありません。",
          "en": "어두우니까 gives darkness as the reason for the advice. 어둡지만 expresses contrast instead.",
          "zh": "어두우니까以暗为建议的理由；어둡지만表达转折。"
        }
      },
      {
        "id": "reason-nikka:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "춥다 / 코트를 입으세요 → 현재 이유 -(으)니까",
        "contextMeaning": {
          "ko": "춥다 / 코트를 입으세요 → 현재 이유 -(으)니까",
          "ja": "춥다と코트를 입으세요を現在の理由-(으)니까でつないでください。",
          "en": "Join 춥다 and 코트를 입으세요 using present reason -(으)니까.",
          "zh": "用现在时原因-(으)니까连接춥다和코트를 입으세요。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "추우니까 코트를 입으세요"
        ],
        "explanation": {
          "ko": "정답: 추우니까 코트를 입으세요\n만드는 과정: 춥다 → 추우- + -니까 (ㅂ 불규칙) / + 코트를 입으세요",
          "ja": "正解：추우니까 코트를 입으세요\n作り方：춥다 → 추우- + -니까 (ㅂ変則) / + 코트를 입으세요",
          "en": "Answer: 추우니까 코트를 입으세요\nFormation: 춥다 → 추우- + -니까 (ㅂ irregular) / + 코트를 입으세요",
          "zh": "答案：추우니까 코트를 입으세요\n构成：춥다 → 추우- + -니까 (ㅂ不规则) / + 코트를 입으세요"
        }
      }
    ]
  },
  {
    "id": "condition",
    "supplement": true,
    "activities": [
      {
        "id": "condition:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "날씨가 좋은 경우에는 산책해요. 조건을 -(으)면으로 말하세요.",
        "contextMeaning": {
          "ko": "날씨가 좋은 경우에는 산책해요. 조건을 -(으)면으로 말하세요.",
          "ja": "天気がよい場合に散歩します。条件を-(으)면で表します。",
          "en": "You go for a walk if the weather is good. Express the condition with -(으)면.",
          "zh": "天气好的时候就去散步。请用-(으)면表达条件。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "날씨가 좋았어요. 산책했어요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 좋으면은 조건을 설정합니다. 좋았어요·산책했어요는 특정 과거 사실 두 개로 일반 조건을 나타내지 않습니다.",
              "ja": "文脈に合いません。좋으면は条件。좋았어요・산책했어요は特定の過去の事実で、一般条件ではありません。",
              "en": "This does not fit the context. 좋으면 sets a condition. Two past statements about weather and walking do not express this general conditional rule.",
              "zh": "不符合语境。좋으면提出条件；两个过去陈述并不表达这一一般条件规则。"
            }
          },
          {
            "id": "a",
            "text": "날씨가 좋으면 산책해요.",
            "feedback": {
              "ko": "맞아요. 좋으면은 조건을 설정합니다. 좋았어요·산책했어요는 특정 과거 사실 두 개로 일반 조건을 나타내지 않습니다.",
              "ja": "正解です。좋으면は条件。좋았어요・산책했어요は特定の過去の事実で、一般条件ではありません。",
              "en": "Correct. 좋으면 sets a condition. Two past statements about weather and walking do not express this general conditional rule.",
              "zh": "正确。좋으면提出条件；两个过去陈述并不表达这一一般条件规则。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "좋으면은 조건을 설정합니다. 좋았어요·산책했어요는 특정 과거 사실 두 개로 일반 조건을 나타내지 않습니다.",
          "ja": "좋으면は条件。좋았어요・산책했어요は特定の過去の事実で、一般条件ではありません。",
          "en": "좋으면 sets a condition. Two past statements about weather and walking do not express this general conditional rule.",
          "zh": "좋으면提出条件；两个过去陈述并不表达这一一般条件规则。"
        }
      },
      {
        "id": "condition:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "필요하다 / 가져가세요 → -(으)면, 순서 유지",
        "contextMeaning": {
          "ko": "필요하다 / 가져가세요 → -(으)면, 순서 유지",
          "ja": "필요하다と가져가세요をこの順で-(으)면でつないでください。",
          "en": "Join 필요하다 and 가져가세요 in order with -(으)면.",
          "zh": "将필요하다和가져가세요按此顺序用-(으)면连接。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "필요하면 가져가세요"
        ],
        "explanation": {
          "ko": "정답: 필요하면 가져가세요\n만드는 과정: 필요하다 → 필요하- + -면 / + 가져가세요",
          "ja": "正解：필요하면 가져가세요\n作り方：필요하다 → 필요하- + -면 / + 가져가세요",
          "en": "Answer: 필요하면 가져가세요\nFormation: 필요하다 → 필요하- + -면 / + 가져가세요",
          "zh": "答案：필요하면 가져가세요\n构成：필요하다 → 필요하- + -면 / + 가져가세요"
        }
      }
    ]
  },
  {
    "id": "simultaneous",
    "supplement": true,
    "activities": [
      {
        "id": "simultaneous:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "나는 차를 마시는 바로 그 시간에 신문도 읽어요. 같은 사람의 동시 행동을 나타내세요.",
        "contextMeaning": {
          "ko": "나는 차를 마시는 바로 그 시간에 신문도 읽어요. 같은 사람의 동시 행동을 나타내세요.",
          "ja": "私はお茶を飲むのと同時に新聞を読みます。同じ人の同時動作を表します。",
          "en": "You read the newspaper while drinking tea. Express simultaneous actions by the same person.",
          "zh": "你一边喝茶一边看报。请表达同一人的同时动作。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "차를 마시면서 신문을 읽어요.",
            "feedback": {
              "ko": "맞아요. 마시면서는 두 행동의 시간이 겹칩니다. 마신 후에는 마시기가 끝난 다음이라 동시가 아닙니다.",
              "ja": "正解です。마시면서は時間が重なります。마신 후에는飲み終えた後なので同時ではありません。",
              "en": "Correct. 마시면서 overlaps the actions; 마신 후에 puts reading after finishing the drink.",
              "zh": "正确。마시면서表示同时；마신 후에表示喝完后再读，不是同时。"
            }
          },
          {
            "id": "b",
            "text": "차를 마신 후에 신문을 읽어요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 마시면서는 두 행동의 시간이 겹칩니다. 마신 후에는 마시기가 끝난 다음이라 동시가 아닙니다.",
              "ja": "文脈に合いません。마시면서は時間が重なります。마신 후에는飲み終えた後なので同時ではありません。",
              "en": "This does not fit the context. 마시면서 overlaps the actions; 마신 후에 puts reading after finishing the drink.",
              "zh": "不符合语境。마시면서表示同时；마신 후에表示喝完后再读，不是同时。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "마시면서는 두 행동의 시간이 겹칩니다. 마신 후에는 마시기가 끝난 다음이라 동시가 아닙니다.",
          "ja": "마시면서は時間が重なります。마신 후에는飲み終えた後なので同時ではありません。",
          "en": "마시면서 overlaps the actions; 마신 후에 puts reading after finishing the drink.",
          "zh": "마시면서表示同时；마신 후에表示喝完后再读，不是同时。"
        }
      },
      {
        "id": "simultaneous:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "웃다 / 이야기해요 → -(으)면서, 순서 유지",
        "contextMeaning": {
          "ko": "웃다 / 이야기해요 → -(으)면서, 순서 유지",
          "ja": "웃다と이야기해요をこの順で-(으)면서でつないでください。",
          "en": "Join 웃다 and 이야기해요 in order with -(으)면서.",
          "zh": "将웃다和이야기해요按此顺序用-(으)면서连接。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "웃으면서 이야기해요"
        ],
        "explanation": {
          "ko": "정답: 웃으면서 이야기해요\n만드는 과정: 웃다 → 웃- + -으면서 / + 이야기해요",
          "ja": "正解：웃으면서 이야기해요\n作り方：웃다 → 웃- + -으면서 / + 이야기해요",
          "en": "Answer: 웃으면서 이야기해요\nFormation: 웃다 → 웃- + -으면서 / + 이야기해요",
          "zh": "答案：웃으면서 이야기해요\n构成：웃다 → 웃- + -으면서 / + 이야기해요"
        }
      }
    ]
  },
  {
    "id": "before-after",
    "supplement": true,
    "activities": [
      {
        "id": "before-after:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "먼저 손을 씻고 그다음 밥을 먹어요. 먹기 이전의 행동을 -기 전에로 나타내세요.",
        "contextMeaning": {
          "ko": "먼저 손을 씻고 그다음 밥을 먹어요. 먹기 이전의 행동을 -기 전에로 나타내세요.",
          "ja": "先に手を洗い、その後ご飯を食べます。食べる前の行動を-기 전에で表します。",
          "en": "First wash your hands, then eat. Express the action before eating using -기 전에.",
          "zh": "先洗手，再吃饭。请用-기 전에表达吃饭之前的动作。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "밥을 먹은 후에 손을 씻어요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 먹기 전에는 식사보다 손 씻기가 먼저입니다. 먹은 후에는 순서가 반대입니다.",
              "ja": "文脈に合いません。먹기 전에は食事より手洗いが先。먹은 후에では順序が逆です。",
              "en": "This does not fit the context. 먹기 전에 places handwashing before the meal; 먹은 후에 reverses that order.",
              "zh": "不符合语境。먹기 전에表示先洗手再吃饭；먹은 후에顺序相反。"
            }
          },
          {
            "id": "a",
            "text": "밥을 먹기 전에 손을 씻어요.",
            "feedback": {
              "ko": "맞아요. 먹기 전에는 식사보다 손 씻기가 먼저입니다. 먹은 후에는 순서가 반대입니다.",
              "ja": "正解です。먹기 전에は食事より手洗いが先。먹은 후에では順序が逆です。",
              "en": "Correct. 먹기 전에 places handwashing before the meal; 먹은 후에 reverses that order.",
              "zh": "正确。먹기 전에表示先洗手再吃饭；먹은 후에顺序相反。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "먹기 전에는 식사보다 손 씻기가 먼저입니다. 먹은 후에는 순서가 반대입니다.",
          "ja": "먹기 전에は食事より手洗いが先。먹은 후에では順序が逆です。",
          "en": "먹기 전에 places handwashing before the meal; 먹은 후에 reverses that order.",
          "zh": "먹기 전에表示先洗手再吃饭；먹은 후에顺序相反。"
        }
      },
      {
        "id": "before-after:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "도착하다 / 연락해요 → -(으)ㄴ 후에, 순서 유지",
        "contextMeaning": {
          "ko": "도착하다 / 연락해요 → -(으)ㄴ 후에, 순서 유지",
          "ja": "도착하다と연락해요を-(으)ㄴ 후에でつなぎ、到着後の連絡にしてください。",
          "en": "Join 도착하다 and 연락해요 with -(으)ㄴ 후에, contacting after arrival.",
          "zh": "用-(으)ㄴ 후에连接도착하다和연락해요，表示到达后联系。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "도착한 후에 연락해요"
        ],
        "explanation": {
          "ko": "정답: 도착한 후에 연락해요\n만드는 과정: 도착하다 → 도착하- + -ㄴ 후에 / + 연락해요",
          "ja": "正解：도착한 후에 연락해요\n作り方：도착하다 → 도착하- + -ㄴ 후에 / + 연락해요",
          "en": "Answer: 도착한 후에 연락해요\nFormation: 도착하다 → 도착하- + -ㄴ 후에 / + 연락해요",
          "zh": "答案：도착한 후에 연락해요\n构成：도착하다 → 도착하- + -ㄴ 후에 / + 연락해요"
        }
      }
    ]
  },
  {
    "id": "purpose-motion",
    "supplement": true,
    "activities": [
      {
        "id": "purpose-motion:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "우체국으로 가는 목적은 편지를 보내는 거예요. 이동 목적을 -(으)러로 말하세요.",
        "contextMeaning": {
          "ko": "우체국으로 가는 목적은 편지를 보내는 거예요. 이동 목적을 -(으)러로 말하세요.",
          "ja": "郵便局へ行く目的は手紙を送ることです。移動の目的を-(으)러で表します。",
          "en": "You are going to the post office to send a letter. Express movement purpose with -(으)러.",
          "zh": "你去邮局的目的是寄信。请用-(으)러表达移动目的。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "편지를 보내러 우체국에 가요.",
            "feedback": {
              "ko": "맞아요. 보내러는 보내는 것이 방문 목적입니다. 보냈으니까는 이미 보낸 것이 원인이라고 말해 뜻이 다릅니다.",
              "ja": "正解です。보내러は送るための訪問。보냈으니까はすでに送ったことが理由になります。",
              "en": "Correct. 보내러 makes sending the purpose. 보냈으니까 makes already having sent it the cause instead.",
              "zh": "正确。보내러以寄信为目的；보냈으니까以已经寄过为原因。"
            }
          },
          {
            "id": "b",
            "text": "편지를 보냈으니까 우체국에 가요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 보내러는 보내는 것이 방문 목적입니다. 보냈으니까는 이미 보낸 것이 원인이라고 말해 뜻이 다릅니다.",
              "ja": "文脈に合いません。보내러は送るための訪問。보냈으니까はすでに送ったことが理由になります。",
              "en": "This does not fit the context. 보내러 makes sending the purpose. 보냈으니까 makes already having sent it the cause instead.",
              "zh": "不符合语境。보내러以寄信为目的；보냈으니까以已经寄过为原因。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "보내러는 보내는 것이 방문 목적입니다. 보냈으니까는 이미 보낸 것이 원인이라고 말해 뜻이 다릅니다.",
          "ja": "보내러は送るための訪問。보냈으니까はすでに送ったことが理由になります。",
          "en": "보내러 makes sending the purpose. 보냈으니까 makes already having sent it the cause instead.",
          "zh": "보내러以寄信为目的；보냈으니까以已经寄过为原因。"
        }
      },
      {
        "id": "purpose-motion:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "책을 빌리다 / 도서관에 가요 → -(으)러, 목적어 유지",
        "contextMeaning": {
          "ko": "책을 빌리다 / 도서관에 가요 → -(으)러, 목적어 유지",
          "ja": "책을 빌리다と도서관에 가요を-(으)러でつなぎ、目的語を残してください。",
          "en": "Join 책을 빌리다 and 도서관에 가요 with -(으)러, keeping the object.",
          "zh": "用-(으)러连接책을 빌리다和도서관에 가요，保留宾语。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "책을 빌리러 도서관에 가요"
        ],
        "explanation": {
          "ko": "정답: 책을 빌리러 도서관에 가요\n만드는 과정: 빌리다 → 빌리- + -러 / 책을 빌리러 + 도서관에 가요",
          "ja": "正解：책을 빌리러 도서관에 가요\n作り方：빌리다 → 빌리- + -러 / 책을 빌리러 + 도서관에 가요",
          "en": "Answer: 책을 빌리러 도서관에 가요\nFormation: 빌리다 → 빌리- + -러 / 책을 빌리러 + 도서관에 가요",
          "zh": "答案：책을 빌리러 도서관에 가요\n构成：빌리다 → 빌리- + -러 / 책을 빌리러 + 도서관에 가요"
        }
      }
    ]
  },
  {
    "id": "try-experience",
    "supplement": true,
    "activities": [
      {
        "id": "try-experience:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "처음 보는 옷이에요. 살지 결정하기 전에 한번 입어 보라고 권하세요.",
        "contextMeaning": {
          "ko": "처음 보는 옷이에요. 살지 결정하기 전에 한번 입어 보라고 권하세요.",
          "ja": "初めて見る服です。買うか決める前に試着するよう勧めます。",
          "en": "It is an unfamiliar garment. Suggest trying it on before deciding to buy it.",
          "zh": "这件衣服你第一次见。请建议决定购买前先试穿。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "이미 입었어요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 입어 보세요는 시험 삼아 입기를 권합니다. 이미 입었어요는 과거 사실이라 권유가 아닙니다.",
              "ja": "文脈に合いません。입어 보세요は試しに着る勧め。이미 입었어요は過去の事実で、勧めではありません。",
              "en": "This does not fit the context. 입어 보세요 suggests trying it on. 이미 입었어요 reports a past action, not a suggestion.",
              "zh": "不符合语境。입어 보세요建议试穿；이미 입었어요陈述过去事实，不是建议。"
            }
          },
          {
            "id": "a",
            "text": "한번 입어 보세요.",
            "feedback": {
              "ko": "맞아요. 입어 보세요는 시험 삼아 입기를 권합니다. 이미 입었어요는 과거 사실이라 권유가 아닙니다.",
              "ja": "正解です。입어 보세요は試しに着る勧め。이미 입었어요は過去の事実で、勧めではありません。",
              "en": "Correct. 입어 보세요 suggests trying it on. 이미 입었어요 reports a past action, not a suggestion.",
              "zh": "正确。입어 보세요建议试穿；이미 입었어요陈述过去事实，不是建议。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "입어 보세요는 시험 삼아 입기를 권합니다. 이미 입었어요는 과거 사실이라 권유가 아닙니다.",
          "ja": "입어 보세요は試しに着る勧め。이미 입었어요は過去の事実で、勧めではありません。",
          "en": "입어 보세요 suggests trying it on. 이미 입었어요 reports a past action, not a suggestion.",
          "zh": "입어 보세요建议试穿；이미 입었어요陈述过去事实，不是建议。"
        }
      },
      {
        "id": "try-experience:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "타다 → 과거 경험 -아/어 보다, 해요체",
        "contextMeaning": {
          "ko": "타다 → 과거 경험 -아/어 보다, 해요체",
          "ja": "타다を過去の経験-아/어 보다のヘヨ体にしてください。",
          "en": "Express a past experience with 타다 + -아/어 보다, polite style.",
          "zh": "用타다加-아/어 보다表达过去经历，礼貌体。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "타 봤어요",
          "타 보았어요",
          "타봤어요",
          "타보았어요"
        ],
        "explanation": {
          "ko": "정답: 타 봤어요\n만드는 과정: 타다 → 타 + 보았어요 → 타 봤어요",
          "ja": "正解：타 봤어요\n作り方：타다 → 타 + 보았어요 → 타 봤어요",
          "en": "Answer: 타 봤어요\nFormation: 타다 → 타 + 보았어요 → 타 봤어요",
          "zh": "答案：타 봤어요\n构成：타다 → 타 + 보았어요 → 타 봤어요"
        }
      }
    ]
  },
  {
    "id": "sentence-adverbs",
    "supplement": true,
    "activities": [
      {
        "id": "sentence-adverbs:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "휴대전화 배터리가 없었고 그 결과 전화하지 못했어요. 두 문장을 결과 접속어로 연결하세요.",
        "contextMeaning": {
          "ko": "휴대전화 배터리가 없었고 그 결과 전화하지 못했어요. 두 문장을 결과 접속어로 연결하세요.",
          "ja": "携帯の電池が切れ、その結果電話できませんでした。結果を示す接続語でつなぎます。",
          "en": "The phone battery was dead, so you could not call. Link the sentences with a result connector.",
          "zh": "手机没电，结果无法打电话。请用结果连接词连接两句。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "배터리가 없었어요. 그래서 전화하지 못했어요.",
            "feedback": {
              "ko": "맞아요. 그래서는 앞 내용의 결과를 잇습니다. 하지만은 반대 기대의 대조를 나타내 여기의 원인·결과에 맞지 않습니다.",
              "ja": "正解です。그래서は前の内容の結果。하지만は予想に反する対照で、ここでの因果関係と違います。",
              "en": "Correct. 그래서 links the consequence. 하지만 marks contrast against expectation, not the stated causal link.",
              "zh": "正确。그래서连接结果；하지만表示与预期相反的转折，不符合此因果关系。"
            }
          },
          {
            "id": "b",
            "text": "배터리가 없었어요. 하지만 전화하지 못했어요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 그래서는 앞 내용의 결과를 잇습니다. 하지만은 반대 기대의 대조를 나타내 여기의 원인·결과에 맞지 않습니다.",
              "ja": "文脈に合いません。그래서は前の内容の結果。하지만は予想に反する対照で、ここでの因果関係と違います。",
              "en": "This does not fit the context. 그래서 links the consequence. 하지만 marks contrast against expectation, not the stated causal link.",
              "zh": "不符合语境。그래서连接结果；하지만表示与预期相反的转折，不符合此因果关系。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "그래서는 앞 내용의 결과를 잇습니다. 하지만은 반대 기대의 대조를 나타내 여기의 원인·결과에 맞지 않습니다.",
          "ja": "그래서は前の内容の結果。하지만は予想に反する対照で、ここでの因果関係と違います。",
          "en": "그래서 links the consequence. 하지만 marks contrast against expectation, not the stated causal link.",
          "zh": "그래서连接结果；하지만表示与预期相反的转折，不符合此因果关系。"
        }
      },
      {
        "id": "sentence-adverbs:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "가격이 비싸요 / 품질이 좋아요 → 하지만으로 두 문장 연결",
        "contextMeaning": {
          "ko": "가격이 비싸요 / 품질이 좋아요 → 하지만으로 두 문장 연결",
          "ja": "가격이 비싸요と품질이 좋아요を하지만で二文としてつないでください。",
          "en": "Link 가격이 비싸요 and 품질이 좋아요 as two sentences using 하지만.",
          "zh": "用하지만将가격이 비싸요和품질이 좋아요连接为两句。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "가격이 비싸요. 하지만 품질이 좋아요"
        ],
        "explanation": {
          "ko": "정답: 가격이 비싸요. 하지만 품질이 좋아요\n만드는 과정: 첫 문장 + 하지만 + 둘째 문장",
          "ja": "正解：가격이 비싸요. 하지만 품질이 좋아요\n作り方：最初の文 + 하지만 + 次の文",
          "en": "Answer: 가격이 비싸요. 하지만 품질이 좋아요\nFormation: first sentence + 하지만 + second sentence",
          "zh": "答案：가격이 비싸요. 하지만 품질이 좋아요\n构成：第一句 + 하지만 + 第二句"
        }
      }
    ]
  },
  {
    "id": "verb-present-modifier",
    "supplement": true,
    "activities": [
      {
        "id": "verb-present-modifier:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "지금 사람이 운동장에서 달리고 있어요. 현재 행동으로 그 사람을 꾸미세요.",
        "contextMeaning": {
          "ko": "지금 사람이 운동장에서 달리고 있어요. 현재 행동으로 그 사람을 꾸미세요.",
          "ja": "今、ある人が運動場を走っています。現在の動作でその人を修飾します。",
          "en": "A person is running on the sports field now. Describe the person by this present action.",
          "zh": "有人现在正在操场上跑步。请用当前动作修饰这个人。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "내일 달릴 사람",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 달리는은 현재 행동을 꾸밉니다. 내일 달릴은 미래 예정으로 지금 달리는 모습과 다릅니다.",
              "ja": "文脈に合いません。달리는は現在の動作。내일 달릴は未来の予定で、今の様子と違います。",
              "en": "This does not fit the context. 달리는 modifies a present action. 내일 달릴 refers to a future plan, not the current running.",
              "zh": "不符合语境。달리는修饰当前动作；내일 달릴表示未来计划，不是当前正在跑。"
            }
          },
          {
            "id": "a",
            "text": "지금 달리는 사람",
            "feedback": {
              "ko": "맞아요. 달리는은 현재 행동을 꾸밉니다. 내일 달릴은 미래 예정으로 지금 달리는 모습과 다릅니다.",
              "ja": "正解です。달리는は現在の動作。내일 달릴は未来の予定で、今の様子と違います。",
              "en": "Correct. 달리는 modifies a present action. 내일 달릴 refers to a future plan, not the current running.",
              "zh": "正确。달리는修饰当前动作；내일 달릴表示未来计划，不是当前正在跑。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "달리는은 현재 행동을 꾸밉니다. 내일 달릴은 미래 예정으로 지금 달리는 모습과 다릅니다.",
          "ja": "달리는は現在の動作。내일 달릴は未来の予定で、今の様子と違います。",
          "en": "달리는 modifies a present action. 내일 달릴 refers to a future plan, not the current running.",
          "zh": "달리는修饰当前动作；내일 달릴表示未来计划，不是当前正在跑。"
        }
      },
      {
        "id": "verb-present-modifier:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "살다 + 동네 → 현재 동작의 -는 명사구",
        "contextMeaning": {
          "ko": "살다 + 동네 → 현재 동작의 -는 명사구",
          "ja": "살다と동네を現在の動詞連体形-는でつないでください。",
          "en": "Combine 살다 and 동네 using present verb modifier -는.",
          "zh": "用现在时动词定语-는连接살다和동네。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "사는 동네"
        ],
        "explanation": {
          "ko": "정답: 사는 동네\n만드는 과정: 살다 → 사- + -는 (ㄹ 탈락) / + 동네",
          "ja": "正解：사는 동네\n作り方：살다 → 사- + -는 (ㄹが脱落) / + 동네",
          "en": "Answer: 사는 동네\nFormation: 살다 → 사- + -는 (drop ㄹ) / + 동네",
          "zh": "答案：사는 동네\n构成：살다 → 사- + -는 (ㄹ脱落) / + 동네"
        }
      }
    ]
  },
  {
    "id": "verb-past-modifier",
    "supplement": true,
    "activities": [
      {
        "id": "verb-past-modifier:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "어제 사진을 찍었고 촬영은 끝났어요. 완료된 행동으로 사진을 꾸미세요.",
        "contextMeaning": {
          "ko": "어제 사진을 찍었고 촬영은 끝났어요. 완료된 행동으로 사진을 꾸미세요.",
          "ja": "昨日写真を撮り、撮影は終わりました。完了した動作で写真を修飾します。",
          "en": "You took a photo yesterday and finished. Modify the photo using that completed action.",
          "zh": "你昨天拍了照片，拍摄已经结束。请用完成的动作修饰照片。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "어제 찍은 사진",
            "feedback": {
              "ko": "맞아요. 찍은은 촬영이 완료된 사진입니다. 찍을은 앞으로 찍을 사진으로 과거 촬영과 다릅니다.",
              "ja": "正解です。찍은は撮影済み。찍을はこれから撮るもので、昨日の完了と違います。",
              "en": "Correct. 찍은 marks completed photography; 찍을 refers to a photo to be taken later.",
              "zh": "正确。찍은表示拍摄完成；찍을表示将要拍，与昨天完成不符。"
            }
          },
          {
            "id": "b",
            "text": "내일 찍을 사진",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 찍은은 촬영이 완료된 사진입니다. 찍을은 앞으로 찍을 사진으로 과거 촬영과 다릅니다.",
              "ja": "文脈に合いません。찍은は撮影済み。찍을はこれから撮るもので、昨日の完了と違います。",
              "en": "This does not fit the context. 찍은 marks completed photography; 찍을 refers to a photo to be taken later.",
              "zh": "不符合语境。찍은表示拍摄完成；찍을表示将要拍，与昨天完成不符。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "찍은은 촬영이 완료된 사진입니다. 찍을은 앞으로 찍을 사진으로 과거 촬영과 다릅니다.",
          "ja": "찍은は撮影済み。찍을はこれから撮るもので、昨日の完了と違います。",
          "en": "찍은 marks completed photography; 찍을 refers to a photo to be taken later.",
          "zh": "찍은表示拍摄完成；찍을表示将要拍，与昨天完成不符。"
        }
      },
      {
        "id": "verb-past-modifier:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "받다 + 편지 → 완료된 행동 -(으)ㄴ 명사구",
        "contextMeaning": {
          "ko": "받다 + 편지 → 완료된 행동 -(으)ㄴ 명사구",
          "ja": "받다と편지を完了した動作の-(으)ㄴでつないでください。",
          "en": "Combine 받다 and 편지 with completed-action modifier -(으)ㄴ.",
          "zh": "用表示动作完成的定语-(으)ㄴ连接받다和편지。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "받은 편지"
        ],
        "explanation": {
          "ko": "정답: 받은 편지\n만드는 과정: 받다 → 받- + -은 / + 편지",
          "ja": "正解：받은 편지\n作り方：받다 → 받- + -은 / + 편지",
          "en": "Answer: 받은 편지\nFormation: 받다 → 받- + -은 / + 편지",
          "zh": "答案：받은 편지\n构成：받다 → 받- + -은 / + 편지"
        }
      }
    ]
  },
  {
    "id": "verb-future-modifier",
    "supplement": true,
    "activities": [
      {
        "id": "verb-future-modifier:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "아직 약을 먹지 않았어요. 저녁에 먹을 예정인 약을 가리키세요.",
        "contextMeaning": {
          "ko": "아직 약을 먹지 않았어요. 저녁에 먹을 예정인 약을 가리키세요.",
          "ja": "まだ薬を飲んでいません。夕方に飲む予定の薬を指します。",
          "en": "You have not taken the medicine yet. Refer to the medicine planned for this evening.",
          "zh": "你还没吃药。请指称今晚打算吃的药。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "아침에 먹은 약",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 먹을은 아직 실행하지 않은 예정입니다. 먹은은 이미 먹은 약이라 현재 상황과 다릅니다.",
              "ja": "文脈に合いません。먹을は未実行の予定。먹은はすでに飲んだ薬で、状況と違います。",
              "en": "This does not fit the context. 먹을 describes a future intended action; 먹은 describes medicine already taken.",
              "zh": "不符合语境。먹을表示尚未执行的计划；먹은表示已经吃过的药。"
            }
          },
          {
            "id": "a",
            "text": "저녁에 먹을 약",
            "feedback": {
              "ko": "맞아요. 먹을은 아직 실행하지 않은 예정입니다. 먹은은 이미 먹은 약이라 현재 상황과 다릅니다.",
              "ja": "正解です。먹을は未実行の予定。먹은はすでに飲んだ薬で、状況と違います。",
              "en": "Correct. 먹을 describes a future intended action; 먹은 describes medicine already taken.",
              "zh": "正确。먹을表示尚未执行的计划；먹은表示已经吃过的药。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "먹을은 아직 실행하지 않은 예정입니다. 먹은은 이미 먹은 약이라 현재 상황과 다릅니다.",
          "ja": "먹을は未実行の予定。먹은はすでに飲んだ薬で、状況と違います。",
          "en": "먹을 describes a future intended action; 먹은 describes medicine already taken.",
          "zh": "먹을表示尚未执行的计划；먹은表示已经吃过的药。"
        }
      },
      {
        "id": "verb-future-modifier:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "읽다 + 신문 → 앞으로 할 행동 -(으)ㄹ 명사구",
        "contextMeaning": {
          "ko": "읽다 + 신문 → 앞으로 할 행동 -(으)ㄹ 명사구",
          "ja": "읽다と신문をこれからする動作の-(으)ㄹでつないでください。",
          "en": "Combine 읽다 and 신문 with prospective modifier -(으)ㄹ.",
          "zh": "用表示将来动作的定语-(으)ㄹ连接읽다和신문。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "읽을 신문"
        ],
        "explanation": {
          "ko": "정답: 읽을 신문\n만드는 과정: 읽다 → 읽- + -을 / + 신문",
          "ja": "正解：읽을 신문\n作り方：읽다 → 읽- + -을 / + 신문",
          "en": "Answer: 읽을 신문\nFormation: 읽다 → 읽- + -을 / + 신문",
          "zh": "答案：읽을 신문\n构成：읽다 → 읽- + -을 / + 신문"
        }
      }
    ]
  },
  {
    "id": "adjective-modifier",
    "supplement": true,
    "activities": [
      {
        "id": "adjective-modifier:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "물이 지금 차가워요. 현재 상태로 물을 꾸미는 명사구를 고르세요.",
        "contextMeaning": {
          "ko": "물이 지금 차가워요. 현재 상태로 물을 꾸미는 명사구를 고르세요.",
          "ja": "水は今冷たいです。現在の状態で水を修飾する名詞句を選びます。",
          "en": "The water is cold now. Choose a noun phrase describing that present state.",
          "zh": "水现在很凉。请选择修饰水当前状态的名词短语。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "차가운 물",
            "feedback": {
              "ko": "맞아요. 차갑다는 형용사라 현재 관형형은 차가운입니다. 차가우는처럼 동사의 -는을 붙이지 않습니다.",
              "ja": "正解です。차갑다は形容詞なので現在の連体形は차가운。動詞の-는を使った차가우는にはしません。",
              "en": "Correct. 차갑다 is an adjective, so its present modifier is 차가운, not the verb-like 차가우는.",
              "zh": "正确。차갑다是形容词，当前定语形是차가운，不能像动词一样接成차가우는。"
            }
          },
          {
            "id": "b",
            "text": "차가우는 물",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 차갑다는 형용사라 현재 관형형은 차가운입니다. 차가우는처럼 동사의 -는을 붙이지 않습니다.",
              "ja": "文脈に合いません。차갑다は形容詞なので現在の連体形は차가운。動詞の-는を使った차가우는にはしません。",
              "en": "This does not fit the context. 차갑다 is an adjective, so its present modifier is 차가운, not the verb-like 차가우는.",
              "zh": "不符合语境。차갑다是形容词，当前定语形是차가운，不能像动词一样接成차가우는。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "차갑다는 형용사라 현재 관형형은 차가운입니다. 차가우는처럼 동사의 -는을 붙이지 않습니다.",
          "ja": "차갑다は形容詞なので現在の連体形は차가운。動詞の-는を使った차가우는にはしません。",
          "en": "차갑다 is an adjective, so its present modifier is 차가운, not the verb-like 차가우는.",
          "zh": "차갑다是形容词，当前定语形是차가운，不能像动词一样接成차가우는。"
        }
      },
      {
        "id": "adjective-modifier:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "넓다 + 방 → 현재 형용사 -(으)ㄴ 명사구",
        "contextMeaning": {
          "ko": "넓다 + 방 → 현재 형용사 -(으)ㄴ 명사구",
          "ja": "넓다と방を現在の形容詞連体形-(으)ㄴでつないでください。",
          "en": "Combine 넓다 and 방 with present adjective modifier -(으)ㄴ.",
          "zh": "用当前形容词定语-(으)ㄴ连接넓다和방。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "넓은 방"
        ],
        "explanation": {
          "ko": "정답: 넓은 방\n만드는 과정: 넓다 → 넓- + -은 / + 방",
          "ja": "正解：넓은 방\n作り方：넓다 → 넓- + -은 / + 방",
          "en": "Answer: 넓은 방\nFormation: 넓다 → 넓- + -은 / + 방",
          "zh": "答案：넓은 방\n构成：넓다 → 넓- + -은 / + 방"
        }
      }
    ]
  },
  {
    "id": "noun-modifier",
    "supplement": true,
    "activities": [
      {
        "id": "noun-modifier:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "언니의 직업은 의사예요. 직업으로 언니를 꾸미는 명사구를 고르세요.",
        "contextMeaning": {
          "ko": "언니의 직업은 의사예요. 직업으로 언니를 꾸미는 명사구를 고르세요.",
          "ja": "姉の職業は医師です。職業で姉を修飾する名詞句を選びます。",
          "en": "Your older sister is a doctor. Choose a noun phrase identifying her by her profession.",
          "zh": "姐姐是医生。请选择用职业修饰姐姐的名词短语。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "b",
            "text": "의사하는 언니",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 명사 의사에는 인을 붙여 의사인으로 만듭니다. 의사하는은 명사문 관형형이 아닙니다.",
              "ja": "文脈に合いません。名詞의사には인を付けて의사인にします。의사하는は名詞文の連体形ではありません。",
              "en": "This does not fit the context. Attach 인 to noun 의사 to form 의사인. 의사하는 is not the modifier of this noun predicate.",
              "zh": "不符合语境。名词의사后接인成为의사인；의사하는不是该名词谓语的定语形。"
            }
          },
          {
            "id": "a",
            "text": "의사인 언니",
            "feedback": {
              "ko": "맞아요. 명사 의사에는 인을 붙여 의사인으로 만듭니다. 의사하는은 명사문 관형형이 아닙니다.",
              "ja": "正解です。名詞의사には인を付けて의사인にします。의사하는は名詞文の連体形ではありません。",
              "en": "Correct. Attach 인 to noun 의사 to form 의사인. 의사하는 is not the modifier of this noun predicate.",
              "zh": "正确。名词의사后接인成为의사인；의사하는不是该名词谓语的定语形。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "명사 의사에는 인을 붙여 의사인으로 만듭니다. 의사하는은 명사문 관형형이 아닙니다.",
          "ja": "名詞의사には인を付けて의사인にします。의사하는は名詞文の連体形ではありません。",
          "en": "Attach 인 to noun 의사 to form 의사인. 의사하는 is not the modifier of this noun predicate.",
          "zh": "名词의사后接인成为의사인；의사하는不是该名词谓语的定语形。"
        }
      },
      {
        "id": "noun-modifier:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "작가 + 친구 → 명사 + 인 + 명사",
        "contextMeaning": {
          "ko": "작가 + 친구 → 명사 + 인 + 명사",
          "ja": "작가と친구を名詞+인+名詞の形でつないでください。",
          "en": "Combine 작가 and 친구 using noun + 인 + noun.",
          "zh": "用名词+인+名词连接작가和친구。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "작가인 친구"
        ],
        "explanation": {
          "ko": "정답: 작가인 친구\n만드는 과정: 작가 + 인 / + 친구",
          "ja": "正解：작가인 친구\n作り方：작가 + 인 / + 친구",
          "en": "Answer: 작가인 친구\nFormation: 작가 + 인 / + 친구",
          "zh": "答案：작가인 친구\n构成：작가 + 인 / + 친구"
        }
      }
    ]
  },
  {
    "id": "nominalization",
    "supplement": true,
    "activities": [
      {
        "id": "nominalization:functions-transfer",
        "type": "choice",
        "phase": "transfer",
        "contextKorean": "나는 달리는 활동 자체를 좋아해요. 이 활동을 명사형 -기로 표현하세요.",
        "contextMeaning": {
          "ko": "나는 달리는 활동 자체를 좋아해요. 이 활동을 명사형 -기로 표현하세요.",
          "ja": "私は走るという活動自体が好きです。活動を名詞化する-기で表します。",
          "en": "You enjoy running as an activity. Use activity nominalizer -기.",
          "zh": "你喜欢跑步这一活动本身。请用活动名词化-기表达。"
        },
        "prompt": {
          "ko": "상황과 지시에 맞는 표현을 고르세요.",
          "ja": "状況と指示に合う表現を選んでください。",
          "en": "Choose the expression that fits the situation and instruction.",
          "zh": "请选择符合情境与要求的表达。"
        },
        "options": [
          {
            "id": "a",
            "text": "달리기를 좋아해요.",
            "feedback": {
              "ko": "맞아요. 달리기는 달리는 활동입니다. 달릴 사람은 달릴 예정인 사람으로 좋아하는 대상이 달라집니다.",
              "ja": "正解です。달리기는走る活動。달릴 사람は走る予定の人で、好きな対象が変わります。",
              "en": "Correct. 달리기 is the running activity; 달릴 사람 is a person who will run, changing what you like.",
              "zh": "正确。달리기是跑步活动；달릴 사람是将跑步的人，改变了喜欢的对象。"
            }
          },
          {
            "id": "b",
            "text": "달릴 사람을 좋아해요.",
            "feedback": {
              "ko": "문맥과 맞지 않아요. 달리기는 달리는 활동입니다. 달릴 사람은 달릴 예정인 사람으로 좋아하는 대상이 달라집니다.",
              "ja": "文脈に合いません。달리기는走る活動。달릴 사람は走る予定の人で、好きな対象が変わります。",
              "en": "This does not fit the context. 달리기 is the running activity; 달릴 사람 is a person who will run, changing what you like.",
              "zh": "不符合语境。달리기是跑步活动；달릴 사람是将跑步的人，改变了喜欢的对象。"
            }
          }
        ],
        "answer": "a",
        "explanation": {
          "ko": "달리기는 달리는 활동입니다. 달릴 사람은 달릴 예정인 사람으로 좋아하는 대상이 달라집니다.",
          "ja": "달리기는走る活動。달릴 사람は走る予定の人で、好きな対象が変わります。",
          "en": "달리기 is the running activity; 달릴 사람 is a person who will run, changing what you like.",
          "zh": "달리기是跑步活动；달릴 사람是将跑步的人，改变了喜欢的对象。"
        }
      },
      {
        "id": "nominalization:functions-review",
        "type": "text",
        "phase": "review",
        "contextKorean": "노래하다 → 활동 명사 -기",
        "contextMeaning": {
          "ko": "노래하다 → 활동 명사 -기",
          "ja": "노래하다を活動名詞-기にしてください。",
          "en": "Turn 노래하다 into an activity noun with -기.",
          "zh": "将노래하다用-기变为活动名词。"
        },
        "prompt": {
          "ko": "앞의 상황과 다른 예입니다. 지정된 형태로 답하세요.",
          "ja": "前の状況とは別の例です。指定された形で答えてください。",
          "en": "This is a different example. Answer in the specified form.",
          "zh": "这是与之前不同的例子。请使用指定形式回答。"
        },
        "accepted": [
          "노래하기"
        ],
        "explanation": {
          "ko": "정답: 노래하기\n만드는 과정: 노래하다 → 노래하- + -기",
          "ja": "正解：노래하기\n作り方：노래하다 → 노래하- + -기",
          "en": "Answer: 노래하기\nFormation: 노래하다 → 노래하- + -기",
          "zh": "答案：노래하기\n构成：노래하다 → 노래하- + -기"
        }
      }
    ]
  }
];
