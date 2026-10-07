// Learner-facing writing metadata and optional meaning support in four languages.
// Keys remain the original source strings. Never apply this catalog to Korean
// task facts, drafts, model answers, or evaluation patterns. Translations of facts
// and vocabulary belong only in the optional meaning panel. P05 choices remain
// Korean; P04 uses its neutral Japanese source key to avoid giving away the answer.
(function () {
  'use strict';
  const catalog = {
  "하나의 사실을 완결된 문장으로": {
    "ko": "사실 하나를 문장으로 쓰기",
    "ja": "1つの事実を文にする",
    "en": "Write one fact as a sentence",
    "zh": "把一个事实写成句子"
  },
  "문장에 필요한 성분을 채우고 중심 사실을 분명하게 써요.": {
    "ko": "누가 무엇을 하는지 빠짐없이 써요. 전하려는 사실이 분명하게 보여야 해요.",
    "ja": "誰が何をするかを、抜けなく書きます。伝えたい事実がはっきり分かるようにします。",
    "en": "Include who does what. Make the fact you want to share clear.",
    "zh": "写清楚谁做什么，不遗漏必要内容。让要表达的事实清楚明了。"
  },
  "한글 읽기·입력과 이번 과제의 핵심 어휘가 필요해요.": {
    "ko": "한글을 읽고 입력할 수 있어야 해요. 이번 문제에 나오는 중요한 단어도 먼저 확인해요.",
    "ja": "ハングルを読んで入力できることが必要です。今回の問題で使う大切な単語も先に確認します。",
    "en": "You need to be able to read and type Hangul. Check the important words for this task first.",
    "zh": "需要能阅读和输入韩文。先确认本题的重要词语。"
  },
  "조사로 역할과 관계 표시하기": {
    "ko": "누가·무엇을·어디서 하는지 표시하기",
    "ja": "誰が・何を・どこでするかを示す",
    "en": "Show who does what and where",
    "zh": "标明谁做什么、在哪里做"
  },
  "주체·대상·장소·수단처럼 말의 역할을 구분해요.": {
    "ko": "조사는 단어 뒤에 붙어 역할을 알려 줘요. 누가 하는지, 무엇을 하는지, 어디서 하는지 구별해요.",
    "ja": "助詞は語の後ろに付いて役割を示します。誰が、何を、どこでするのかを区別します。",
    "en": "Particles follow words and show their roles. Use them to tell who does what and where.",
    "zh": "助词放在词语后面，表示它的作用。用助词区分谁做、做什么、在哪里做。"
  },
  "사용할 동사의 뜻과 해당 조사 기능만 먼저 확인해요.": {
    "ko": "이번에 쓸 동사의 뜻부터 확인해요. 그 동사와 함께 쓰는 조사도 살펴봐요.",
    "ja": "今回使う動詞の意味から確認します。その動詞と一緒に使う助詞も確かめます。",
    "en": "First check the meaning of the verb you will use. Then check the particles used with it.",
    "zh": "先确认要用的动词含义。再看它搭配什么助词。"
  },
  "서술어의 형태와 호응 유지하기": {
    "ko": "문장 끝을 바꾸고 뜻 맞추기",
    "ja": "文末の形を変え、意味を合わせる",
    "en": "Change sentence endings and keep the meaning clear",
    "zh": "变化句尾，让意思搭配恰当"
  },
  "어간과 어미를 결합하고 주체와 서술어의 뜻을 맞춰요.": {
    "ko": "동사·형용사의 끝을 문장에 맞게 바꿔요. 누가 무엇을 하는지 뜻도 자연스러운지 확인해요.",
    "ja": "動詞・形容詞の語尾を文に合わせて変えます。誰が何をするか、意味が自然につながるかも確認します。",
    "en": "Change verb and adjective endings to fit the sentence. Check that who does what also makes sense.",
    "zh": "根据句子变化动词和形容词的词尾。也确认谁做什么在意思上是否自然。"
  },
  "피동·사동까지 전부 끝낼 필요는 없어요. 새 과제에 쓰는 활용을 따로 확인해요.": {
    "ko": "지금 문장에 쓸 형태부터 익혀요. 당하는 일이나 남에게 시키는 일을 나타내는 표현까지 모두 끝낼 필요는 없어요.",
    "ja": "今の文で使う形から覚えます。「される」「させる」を表す形まで、すべて終える必要はありません。",
    "en": "Start with the forms needed for this sentence. You do not have to learn every form for having something done to you or making someone do something first.",
    "zh": "先学本句需要的形式。不必先学完表示“被做”或“让别人做”的所有表达。"
  },
  "시점·부정·판단 강도 조절하기": {
    "ko": "언제인지·부정하는지·얼마나 확실한지 쓰기",
    "ja": "いつのことか・否定・確かさを書く",
    "en": "Show when, what did not happen, and how certain it is",
    "zh": "写清时间、否定和确定程度"
  },
  "언제의 사실인지, 무엇이 일어나지 않았는지, 얼마나 확실한지 구분해요.": {
    "ko": "언제 일어난 일인지 써요. 일어나지 않은 일과 얼마나 확실한지도 구별해요.",
    "ja": "いつ起きたことかを書きます。起きなかったことや、どのくらい確かなのかも区別します。",
    "en": "Show when something happened. Distinguish what did not happen and how certain something is.",
    "zh": "写清事情发生的时间。区分没有发生的事和确定程度。"
  },
  "현재·과거·가능·필요 등의 표현을 한 번에 하나씩 확인해요.": {
    "ko": "지금 일과 지난 일을 나타내는 말부터 하나씩 확인해요. 할 수 있는 일과 해야 하는 일도 따로 연습해요.",
    "ja": "今のこと、過去のことを表す言い方から、1つずつ確認します。できること、必要なことも別に練習します。",
    "en": "Check expressions for now and the past one at a time. Practice what is possible and what is necessary separately.",
    "zh": "逐一确认现在和过去的表达。分别练习表示能做和需要做的表达。"
  },
  "필요한 정보를 한 문장에 더하기": {
    "ko": "한 문장에 필요한 정보 더하기",
    "ja": "必要な情報を1文に加える",
    "en": "Add useful information to a sentence",
    "zh": "在一个句子中补充必要信息"
  },
  "독자가 새로 알게 될 정보를 하나씩 더해요.": {
    "ko": "읽는 사람이 새로 알게 될 정보를 하나씩 더해요.",
    "ja": "読み手にとって新しい情報を、1つずつ加えます。",
    "en": "Add new information for the reader one piece at a time.",
    "zh": "逐一补充读者尚不知道的信息。"
  },
  "이번 문장에 실제로 들어가는 기능만 확인해요.": {
    "ko": "이번 문장에 꼭 필요한 표현만 먼저 확인해요.",
    "ja": "今回の文に必要な表現だけを先に確認します。",
    "en": "First check only the expressions this sentence needs.",
    "zh": "先确认本句所需的表达。"
  },
  "절로 대상을 한정하고 내용 묶기": {
    "ko": "대상을 설명하고 긴 내용을 묶기",
    "ja": "何を指すか説明し、長い内容をまとめる",
    "en": "Explain which thing you mean and group longer ideas",
    "zh": "说明具体对象，整合较长内容"
  },
  "수식하는 대상과 주절의 관계를 분명하게 유지해요.": {
    "ko": "어떤 사람이나 물건인지 자세히 써요. 그 설명이 문장 나머지 부분과 잘 이어지는지 확인해요.",
    "ja": "どんな人や物かを詳しく書きます。その説明が文の残りの部分とつながるか確認します。",
    "en": "Describe which person or thing you mean. Check that this description connects clearly to the rest of the sentence.",
    "zh": "详细说明指的是哪种人或物。确认这段说明与句子其余部分衔接清楚。"
  },
  "관형절·명사화·인용의 형태는 각각 따로 도입해요.": {
    "ko": "대상을 꾸미는 말, 내용을 명사처럼 묶는 말, 남의 말을 옮기는 표현을 따로 배워요.",
    "ja": "人や物を詳しく説明する形、内容を名詞のようにまとめる形、人の言葉を伝える形を別々に学びます。",
    "en": "Learn three things separately: describing a person or thing, grouping an idea like a noun, and reporting someone's words.",
    "zh": "分别学习三种表达：修饰人或物，把内容组合成类似名词的形式，以及转述别人的话。"
  },
  "원인·이유·판단 근거 설명하기": {
    "ko": "왜 그런지 이유 설명하기",
    "ja": "なぜそうなのか、理由を説明する",
    "en": "Explain why something happened or why you think so",
    "zh": "说明为什么发生、为什么这样想"
  },
  "왜 그런 결과가 생겼는지, 왜 그렇게 생각하는지 설명해요.": {
    "ko": "왜 그런 결과가 나왔는지 설명해요. 왜 그렇게 생각하는지도 써요.",
    "ja": "なぜその結果になったのか、なぜそう考えるのかを説明します。",
    "en": "Explain why a result occurred or why you think something.",
    "zh": "说明某个结果为何发生，或为何这样认为。"
  },
  "첫 이유 연결에는 짧은 단문과 두 사실의 뜻이면 충분해요. 확장에 필요한 기능은 나중에 추가해요.": {
    "ko": "처음에는 짧은 문장을 쓰고 두 사실의 뜻을 알면 충분해요. 문장을 더 길게 만드는 표현은 나중에 배워요.",
    "ja": "最初は、短い文が書けて2つの事実の意味が分かれば十分です。文を詳しくする表現は後で学びます。",
    "en": "For now, short sentences and the meanings of the two facts are enough. Learn expressions for adding detail later.",
    "zh": "开始时，会写短句并理解两个事实就够了。补充细节的表达可以以后再学。"
  },
  "대조·양보·비교 대상 구별하기": {
    "ko": "다른 점과 예상 밖의 결과 비교하기",
    "ja": "違いや、予想と違う結果を比べる",
    "en": "Compare differences and unexpected results",
    "zh": "比较差异和意料之外的结果"
  },
  "공통 기준과 예상되는 결과를 살펴 관계를 선택해요.": {
    "ko": "같은 기준으로 차이를 살펴봐요. 예상과 다른 결과인지도 확인하고 알맞게 이어 써요.",
    "ja": "同じ基準で違いを比べます。予想と違う結果かどうかも確かめ、合う表現でつなぎます。",
    "en": "Compare differences using the same basis. Check whether the result is unexpected, then choose how to connect the ideas.",
    "zh": "按同一标准比较差异。看看结果是否出乎意料，再选择合适的连接表达。"
  },
  "단순 대조 뒤에 양보와 반론을 따로 연습해요.": {
    "ko": "먼저 단순한 차이를 써요. 그다음 다른 생각을 인정하거나 그 생각에 반대하는 글을 따로 연습해요.",
    "ja": "まず単純な違いを書きます。その後、別の考えを認める書き方や、それに反対する書き方を別々に練習します。",
    "en": "Start by writing simple differences. Then practice acknowledging another view and arguing against it separately.",
    "zh": "先写简单的差异。然后分别练习认可另一种观点，以及反对它的写法。"
  },
  "시간·조건·목적에 맞게 연결하기": {
    "ko": "순서·조건·목적에 맞게 이어 쓰기",
    "ja": "時間・条件・目的に合わせてつなぐ",
    "en": "Connect ideas by time, condition, and purpose",
    "zh": "按时间、条件和目的连接"
  },
  "실제 이유와 목표, 사건 순서와 조건을 구별해요.": {
    "ko": "실제로 일어난 이유와 이루려는 목표를 구별해요. 일의 순서와 필요한 조건도 따로 생각해요.",
    "ja": "実際の理由と目標、出来事の順序と条件を区別します。",
    "en": "Distinguish actual reasons from goals, and event sequences from conditions.",
    "zh": "区分实际理由与目标，以及事件顺序与条件。"
  },
  "사용할 하위 표현의 형태와 뜻만 먼저 확인해요.": {
    "ko": "이번에 쓸 표현의 모양과 뜻부터 확인해요.",
    "ja": "今回使う表現の形と意味から確認します。",
    "en": "First check the form and meaning of the expression you will use.",
    "zh": "先确认本次要用的表达形式和含义。"
  },
  "수량·비교·변화 정확히 서술하기": {
    "ko": "숫자·차이·변화 설명하기",
    "ja": "数字・違い・変化を説明する",
    "en": "Explain numbers, differences, and changes",
    "zh": "说明数字、差异和变化"
  },
  "수치의 대상·단위·기준을 유지하며 설명해요.": {
    "ko": "무엇을 센 숫자인지, 단위가 무엇인지 밝혀요. 비교하는 기준도 바꾸지 않아요.",
    "ja": "何を数えた数字か、単位は何かを示します。比べる基準も変えません。",
    "en": "Show what the numbers count and what units they use. Keep the basis for comparison the same.",
    "zh": "说明数字统计的对象和单位。保持比较标准一致。"
  },
  "이번 자료의 수 표현과 단위를 먼저 확인해요.": {
    "ko": "이번 자료의 숫자 읽는 법과 단위부터 확인해요.",
    "ja": "まず、今回の資料で使う数の表現と単位を確認します。",
    "en": "First check the number expressions and units used in this material.",
    "zh": "先确认本次资料中的数字表达和单位。"
  },
  "문장 사이 정보 흐름 유지하기": {
    "ko": "문장끼리 자연스럽게 이어 쓰기",
    "ja": "文と文を自然につなぐ",
    "en": "Connect sentences clearly",
    "zh": "让句子自然衔接"
  },
  "지시어의 대상, 주체 전환, 설명 순서를 분명하게 해요.": {
    "ko": "가리키는 대상이 무엇인지 밝혀요. 행동하는 사람이 바뀌는 부분과 설명 순서도 분명하게 써요.",
    "ja": "何を指しているのかをはっきり書きます。行動する人が変わる部分と、説明の順序も分かるようにします。",
    "en": "Make it clear what each reference means. Show where the person doing the action changes. Keep the order of explanation clear.",
    "zh": "写清每处指的是什么。说明行动者在哪里发生了变化，并明确说明顺序。"
  },
  "목록의 모든 관계를 끝낼 필요 없이 해당 문단이 사용하는 관계를 확인해요.": {
    "ko": "모든 연결 표현을 다 배울 필요는 없어요. 이번 문단에서 쓰는 표현부터 확인해요.",
    "ja": "すべてのつなぎ方を先に学ぶ必要はありません。今回の段落で使う表現から確認します。",
    "en": "You do not need to learn every way to connect ideas first. Check the expressions this paragraph uses.",
    "zh": "不必先学完所有连接表达。先确认本段会用到的表达。"
  },
  "글의 목적에 맞게 표현 다듬기": {
    "ko": "읽는 사람과 목적에 맞게 다듬기",
    "ja": "読む人と目的に合わせて言葉を選ぶ",
    "en": "Choose words for your reader and purpose",
    "zh": "按读者和目的调整表达"
  },
  "독자와 목적에 맞는 자연스럽고 정확한 표현을 골라요.": {
    "ko": "누가 읽을 글인지 생각해요. 글의 목적에 맞는 자연스럽고 정확한 말을 골라요.",
    "ja": "読み手と目的に合った、自然で正確な表現を選びます。",
    "en": "Choose natural, precise expressions for your reader and purpose.",
    "zh": "选择符合读者和目的的自然、准确的表达。"
  },
  "이번에 적용할 기능과 새 표현을 확인하며 과정 내내 쌓아 가요.": {
    "ko": "글을 쓸 때마다 필요한 표현을 확인해요. 새 표현을 하나씩 쌓아 가요.",
    "ja": "書くたびに必要な表現を確認します。新しい言い方を少しずつ増やします。",
    "en": "Check the expressions you need each time you write. Build up new expressions one at a time.",
    "zh": "每次写作时确认所需的表达。逐一积累新的说法。"
  },
  "문단의 중심과 뒷받침 조직하기": {
    "ko": "문단의 중심 생각과 이유 묶기",
    "ja": "段落の中心の考えと理由をまとめる",
    "en": "Build a paragraph around one main idea",
    "zh": "围绕中心观点组织段落"
  },
  "중심 생각, 관련 이유, 설명과 사례를 하나의 흐름으로 써요.": {
    "ko": "중심 생각을 먼저 써요. 관련된 이유와 설명, 예를 자연스럽게 이어 써요.",
    "ja": "中心となる考えを先に書きます。関連する理由、説明、例を自然につなぎます。",
    "en": "Write the main idea first. Connect relevant reasons, explanations, and examples clearly.",
    "zh": "先写中心观点。自然地衔接相关理由、说明和例子。"
  },
  "이 문단에 필요한 문장 기능을 독립적으로 사용한 경험을 확인해요. 모든 노드의 완벽한 완료를 요구하지 않아요.": {
    "ko": "이번 문단에 필요한 표현을 도움 없이 써 본 적이 있는지 확인해요. 지도에 있는 모든 능력을 완벽하게 끝낼 필요는 없어요.",
    "ja": "今回の段落に必要な表現を、助けなしで使ったことがあるか確認します。マップのすべての力を完璧に身に付ける必要はありません。",
    "en": "Check whether you have used the expressions this paragraph needs without help. You do not need to perfect every skill on the map.",
    "zh": "确认自己是否曾在没有帮助的情况下用过本段所需的表达。不必把图中的所有能力都练到完美。"
  },
  "여러 문단으로 완수하고 수정하기": {
    "ko": "여러 문단으로 쓰고 고치기",
    "ja": "いくつかの段落で書き、直す",
    "en": "Write and revise several paragraphs",
    "zh": "分几个段落写作并修改"
  },
  "요구 사항별 내용을 배분하고 글 전체의 누락과 비약을 고쳐요.": {
    "ko": "문제에서 요구한 내용을 문단마다 나눠 써요. 빠진 내용과 설명이 갑자기 건너뛴 부분을 고쳐요.",
    "ja": "問題で求められた内容を段落に分けて書きます。抜けた内容や、説明が急に飛ぶ部分を直します。",
    "en": "Divide the required content into paragraphs. Fix missing points and places where the explanation jumps ahead.",
    "zh": "把题目要求的内容分成几个段落。补全遗漏，修改说明突然跳跃的地方。"
  },
  "문단 쓰기와 함께 지시문을 읽고 요구를 나누는 독해를 확인해요.": {
    "ko": "문단 쓰기와 함께 문제의 요구를 읽는 연습도 해요. 무엇을 써야 하는지 하나씩 나눠 봐요.",
    "ja": "段落を書く練習と一緒に、問題の指示を読む練習もします。何を書く必要があるか、1つずつ分けます。",
    "en": "Alongside paragraph writing, practice reading the instructions. Separate out each thing you need to write about.",
    "zh": "练习段落写作时，也练习读懂题目。逐一分清需要写什么。"
  },
  "필요한 것부터 확인": {
    "ko": "필요한 것부터 확인",
    "ja": "必要なことから確認",
    "en": "Check what you need first",
    "zh": "先确认需要的基础"
  },
  "모두 통과하는 시험이 아니에요. 다음 문제에 필요한 확인만 골라 해요.": {
    "ko": "모두 통과해야 하는 시험은 아니에요. 다음 문제에 필요한 것만 골라 확인해요.",
    "ja": "全問合格を目指す試験ではありません。次の問題に必要な確認だけ選びましょう。",
    "en": "This is not a test you must pass in full. Choose only the checks needed for your next task.",
    "zh": "这不是必须全部通过的考试。只选择下一题所需的基础检查。"
  },
  "형태 하나씩 · 아서": {
    "ko": "하나씩 익히기 · 아서",
    "ja": "1つずつ練習 · 아서",
    "en": "Practice one form · 아서",
    "zh": "逐一练习 · 아서"
  },
  "많다·좋다는 많아서·좋아서로 연결해요. 완성된 해요체에 서를 붙이지 않아요. 먼저 한 가지 형태에 집중해요.": {
    "ko": "많다·좋다는 많아서·좋아서로 이어요. 완성된 해요체 뒤에 서를 붙이지 않아요. 먼저 한 가지 형태를 익혀요.",
    "ja": "「많다・좋다」は「많아서・좋아서」でつなぎます。完成したヘヨ体にそのまま「서」を付けません。まず1つの形に集中しましょう。",
    "en": "Connect 많다 and 좋다 as 많아서 and 좋아서. Do not add 서 to a completed 해요-style form. Focus on one form first.",
    "zh": "많다、좋다分别用많아서、좋아서连接。不要在完整的해요体后直接加서。先集中练习一种形式。"
  },
  "형태 하나씩 · 어서": {
    "ko": "하나씩 익히기 · 어서",
    "ja": "1つずつ練習 · 어서",
    "en": "Practice one form · 어서",
    "zh": "逐一练习 · 어서"
  },
  "없다·멀다는 없어서·멀어서로 연결해요. 앞의 사실이 뒤의 행동을 선택한 이유인지 함께 확인해요.": {
    "ko": "없다·멀다는 없어서·멀어서로 이어요. 앞의 사실이 뒤의 행동을 선택한 이유인지도 확인해요.",
    "ja": "「없다・멀다」は「없어서・멀어서」でつなぎます。前の事実が、後の行動を選んだ理由になっているかも確認しましょう。",
    "en": "Connect 없다 and 멀다 as 없어서 and 멀어서. Also check that the first fact is the reason for choosing the action that follows.",
    "zh": "없다、멀다分别用없어서、멀어서连接。同时确认前面的事实是否是选择后面行动的理由。"
  },
  "형태 하나씩 · 해서": {
    "ko": "하나씩 익히기 · 해서",
    "ja": "1つずつ練習 · 해서",
    "en": "Practice one form · 해서",
    "zh": "逐一练习 · 해서"
  },
  "하다로 끝나는 말은 하여서 또는 줄인 해서로 연결해요. 여기서는 조용하다·복잡하다·깨끗하다를 연습해요.": {
    "ko": "하다로 끝나는 말은 하여서나 줄인 말 해서로 이어요. 여기서는 조용하다·복잡하다·깨끗하다를 연습해요.",
    "ja": "「하다」で終わる語は「하여서」、または短縮形の「해서」でつなぎます。ここでは「조용하다・복잡하다・깨끗하다」を練習します。",
    "en": "Words ending in 하다 connect with 하여서 or the shorter 해서. Here you will practice 조용하다, 복잡하다, and 깨끗하다.",
    "zh": "以하다结尾的词用하여서或缩略形式해서连接。本组练习조용하다、복잡하다、깨끗하다。"
  },
  "새 내용으로 섞어 쓰기": {
    "ko": "새 내용으로 섞어 쓰기",
    "ja": "新しい内容で組み合わせる",
    "en": "Mix the forms with new content",
    "zh": "用新内容混合练习"
  },
  "시점만 바꾸기": {
    "ko": "언제 일어난 일인지 바꾸기",
    "ja": "いつのことかを変える",
    "en": "Change when it happened",
    "zh": "改变事情发生的时间"
  },
  "행동하는 사람 바꾸기": {
    "ko": "행동하는 사람 바꾸기",
    "ja": "行動する人を変える",
    "en": "Change who performs the action",
    "zh": "改变行动者"
  },
  "불가능했던 뜻 유지하기": {
    "ko": "할 수 없었다는 뜻 지키기",
    "ja": "できなかった意味を保つ",
    "en": "Keep the meaning of being unable",
    "zh": "保留“没能做到”的含义"
  },
  "형태와 뜻을 나누어 고치기": {
    "ko": "말의 모양과 뜻을 따로 고치기",
    "ja": "言葉の形と意味を別々に直す",
    "en": "Fix the word forms and meaning separately",
    "zh": "分别修改词语形式和意思"
  },
  "필요한 정보 하나 더하기": {
    "ko": "필요한 정보 하나 더하기",
    "ja": "必要な情報を1つ加える",
    "en": "Add one useful detail",
    "zh": "补充一条必要信息"
  },
  "오늘의 새 상황": {
    "ko": "오늘 처음 보는 상황",
    "ja": "今日初めて見る場面",
    "en": "A situation new to you today",
    "zh": "今天第一次见到的情境"
  },
  "다른 날의 새 상황": {
    "ko": "다른 날 처음 보는 상황",
    "ja": "別の日に初めて見る場面",
    "en": "A new situation on another day",
    "zh": "另一天第一次见到的情境"
  },
  "짧은 해요체 문장": {
    "ko": "짧은 해요체 문장 쓰기",
    "ja": "短い丁寧な文を書く（ヘヨ体）",
    "en": "Short polite sentences (해요 style)",
    "zh": "简短的礼貌句子（해요体）"
  },
  "누가 무엇을 하는지 또는 무엇이 어떤지 짧은 문장으로 쓸 수 있는지 확인해요.": {
    "ko": "누가 무엇을 하는지 짧게 써요. 무엇이 어떤 상태인지도 쓸 수 있는지 확인해요.",
    "ja": "誰が何をするか、何がどんな状態かを短い文で書けるか確認します。",
    "en": "Check whether you can write a short sentence about who does what or what something is like.",
    "zh": "确认能否用短句写出谁做什么，或事物是什么状态。"
  },
  "이번 문제의 어휘": {
    "ko": "이번 문제의 단어",
    "ja": "今回の問題の単語",
    "en": "Words for this task",
    "zh": "本题的单词"
  },
  "현재 문제에 나온 낱말만 확인해요. 낱말 뜻을 본 기록은 이유 문장을 본 기록과 구분해요.": {
    "ko": "지금 문제에 나온 단어만 확인해요. 단어 뜻을 본 기록과 이유 문장을 본 기록은 따로 남겨요.",
    "ja": "今の問題に必要な単語だけ確認します。単語の意味を見た記録と、理由の文を見た記録は区別します。",
    "en": "Check only the words in the current task. Viewing word meanings is recorded separately from viewing a sentence that gives a reason.",
    "zh": "只确认当前题目中的词语。查看词义和查看理由句的记录会分开保存。"
  },
  "원인과 결과의 뜻": {
    "ko": "무엇이 이유이고 결과인지 구별하기",
    "ja": "何が理由で、何が結果かを見分ける",
    "en": "Tell the reason from the result",
    "zh": "分清理由和结果"
  },
  "한국어 연결형을 몰라도 두 사실 중 무엇이 이유인지 확인할 수 있어요.": {
    "ko": "한국어로 문장을 잇는 방법을 아직 몰라도 괜찮아요. 두 사실 중 무엇이 이유인지 먼저 확인해요.",
    "ja": "韓国語のつなぎ方をまだ知らなくても大丈夫です。2つの事実のうち、どちらが理由かを先に確認します。",
    "en": "It is okay if you do not know how to link them in Korean yet. First identify which fact is the reason.",
    "zh": "还不知道怎么用韩语连接也没关系。先确认两个事实中哪个是理由。"
  },
  "이번에 배운 이유 연결형": {
    "ko": "이번에 배운 이유 잇는 말",
    "ja": "今回学んだ、理由をつなぐ言い方",
    "en": "The way to link a reason you just learned",
    "zh": "本次学过的理由连接表达"
  },
  "형태 연습 뒤 새 문장에서 연결 형태를 확인해요. 연습한 기록과 독립 사용 기록은 달라요.": {
    "ko": "말의 모양을 연습한 뒤 새 문장에 써 봐요. 도움받아 연습한 기록과 도움 없이 쓴 기록은 따로 남겨요.",
    "ja": "形を練習したら、新しい文で使います。助けを使った練習と、助けなしで書いた記録は別に残します。",
    "en": "After practicing the form, use it in a new sentence. Practice with help and writing without help are recorded separately.",
    "zh": "练习形式后，把它用在新句子里。有帮助的练习和没有帮助的写作会分开记录。"
  },
  "어제의 일을 나타내기": {
    "ko": "어제의 일 쓰기",
    "ja": "昨日のことを書く",
    "en": "Write about yesterday",
    "zh": "写昨天的事"
  },
  "과거 해요체를 먼저 확인해요. 아직 낯설면 시점 변형만 나중에 해도 괜찮아요.": {
    "ko": "먼저 지난 일을 해요체로 써 봐요. 아직 어렵다면 시간을 바꾸는 연습은 나중에 해도 괜찮아요.",
    "ja": "過去のヘヨ体を先に確認します。まだ難しければ、時点を変える練習だけ後にできます。",
    "en": "Check past-tense 해요-style forms first. If they are still unfamiliar, you can leave the time-change practice until later.",
    "zh": "先确认过去时的해요体形式。如果还不熟悉，可以稍后再做时间变化练习。"
  },
  "누가 하는 일인지 표시하기": {
    "ko": "누가 하는 일인지 밝히기",
    "ja": "誰の行動かを示す",
    "en": "Show who performs the action",
    "zh": "标明谁在行动"
  },
  "동료가, 팀원들이처럼 행동하는 사람을 표시할 수 있는지 확인해요.": {
    "ko": "동료가, 팀원들이처럼 누가 행동하는지 쓸 수 있는지 확인해요.",
    "ja": "「동료가」「팀원들이」のように、行動する人を示せるか確認します。",
    "en": "Check whether you can mark who performs the action, as in 동료가 or 팀원들이.",
    "zh": "确认能否像동료가、팀원들이这样标明行动者。"
  },
  "없음과 불가능의 뜻": {
    "ko": "없다는 뜻과 할 수 없다는 뜻",
    "ja": "ないこと・できないこと",
    "en": "Not having something and being unable to do something",
    "zh": "没有东西与不能做某事"
  },
  "없다의 뜻과 못의 불가능 의미를 확인해요. 안을 언제나 자발적인 선택으로 해석하지 않아요.": {
    "ko": "없다는 뜻과 못으로 나타내는 불가능을 확인해요. 안이 언제나 일부러 하지 않았다는 뜻은 아니에요.",
    "ja": "「없다」の意味と、「못」が表す「できない」を確認します。「안」は、いつも自分でしないと決めた意味になるわけではありません。",
    "en": "Check the meaning of 없다 and how 못 expresses being unable. 안 does not always mean someone chose not to do something.",
    "zh": "确认없다的意思，以及못表示的“做不到”。안不一定表示主动选择不做。"
  },
  "필요한 시간 정보": {
    "ko": "언제인지 알려 주는 말",
    "ja": "いつのことかを表す言葉",
    "en": "Words that tell when",
    "zh": "表示时间的词语"
  },
  "오늘, 어제처럼 새로 넣을 시간 표현을 먼저 확인해요.": {
    "ko": "오늘, 어제처럼 새로 넣을 시간 표현부터 확인해요.",
    "ja": "「오늘」「어제」など、追加する時間表現を先に確認します。",
    "en": "First check the time expressions you will add, such as 오늘 and 어제.",
    "zh": "先确认要补充的时间表达，如오늘、어제。"
  },
  "지금 내가 하는 일을 해요체 한 문장으로 써 보세요. 행동을 하는 장소도 넣으세요.": {
    "ko": "지금 내가 하는 일을 한 문장으로 써요. 해요체(~아요·어요·해요)로 끝내고, 어디서 하는지도 넣어요.",
    "ja": "今していることを1文で書きます。丁寧な形（아요・어요・해요）で終え、どこでするかも入れましょう。",
    "en": "Write one sentence about what you are doing now. Include where, and use a polite ending (아요, 어요, or 해요).",
    "zh": "用一句话写出现在正在做的事。加上地点，并用礼貌句尾（아요、어요、해요）。"
  },
  "공부하는 장소를 나타내 보세요.": {
    "ko": "어디서 공부하는지 써 보세요.",
    "ja": "勉強する場所を示してみましょう。",
    "en": "Show where you study.",
    "zh": "写出学习的地点。"
  },
  "장소: 도서관": {
    "ko": "장소: 도서관",
    "ja": "場所：図書館",
    "en": "Place: library",
    "zh": "地点：图书馆"
  },
  "행동: 공부": {
    "ko": "행동: 공부",
    "ja": "行動：勉強",
    "en": "Action: studying",
    "zh": "行动：学习"
  },
  "도서관": {
    "ko": "도서관",
    "ja": "図書館",
    "en": "library",
    "zh": "图书馆"
  },
  "공부하다": {
    "ko": "공부하다",
    "ja": "勉強する",
    "en": "to study",
    "zh": "学习"
  },
  "自分が図書館で勉強している場面です。まだ理由は書きません。": {
    "ko": "도서관에서 내가 공부하는 상황이에요. 아직 이유는 쓰지 않아요.",
    "ja": "自分が図書館で勉強している場面です。まだ理由は書きません。",
    "en": "You are studying at the library. Do not write the reason yet.",
    "zh": "这是你在图书馆学习的场景。先不写原因。"
  },
  "두 사실을 각각 해요체 한 문장으로 써 보세요. 아직 두 문장을 연결하지 마세요.": {
    "ko": "두 사실을 한 문장씩 따로 써요. 해요체(~아요·어요·해요)로 끝내고, 아직 두 문장을 잇지 마세요.",
    "ja": "2つの事実を1文ずつ書きます。丁寧な形（아요・어요・해요）で終え、まだ文はつなぎません。",
    "en": "Write the two facts as separate sentences. Use polite endings (아요, 어요, or 해요). Do not join them yet.",
    "zh": "把两个事实分别写成一句话。用礼貌句尾（아요、어요、해요），暂时不要连接两句。"
  },
  "일의 양을 완결된 문장으로 써 보세요.": {
    "ko": "일이 얼마나 많은지 문장으로 써 보세요.",
    "ja": "仕事の量を、完結した文で書いてみましょう。",
    "en": "Write a complete sentence about how much work there is.",
    "zh": "用完整的句子写出工作量。"
  },
  "퇴근하는 일을 별도 문장으로 써 보세요.": {
    "ko": "퇴근하는 일은 다른 문장으로 써 보세요.",
    "ja": "退勤することを別の文で書いてみましょう。",
    "en": "Write a separate sentence about leaving work.",
    "zh": "把下班的事另写成一句话。"
  },
  "일: 많다": {
    "ko": "일: 많다",
    "ja": "仕事：多い",
    "en": "Work: a lot",
    "zh": "工作：多"
  },
  "퇴근: 늦게": {
    "ko": "퇴근: 늦게",
    "ja": "退勤：遅い時間に",
    "en": "Leaving work: late",
    "zh": "下班：晚"
  },
  "일": {
    "ko": "일",
    "ja": "仕事",
    "en": "work",
    "zh": "工作"
  },
  "많다": {
    "ko": "많다",
    "ja": "多い",
    "en": "to be many; to be a lot",
    "zh": "多"
  },
  "늦게": {
    "ko": "늦게",
    "ja": "遅く",
    "en": "late",
    "zh": "晚"
  },
  "퇴근하다": {
    "ko": "퇴근하다",
    "ja": "退勤する",
    "en": "to leave work",
    "zh": "下班"
  },
  "仕事が多いことと、遅く退勤することを、別々の文で書きます。": {
    "ko": "일의 양이 많다는 사실과 퇴근 시간이 늦다는 사실을 각각 다른 문장으로 써요.",
    "ja": "仕事が多いことと、遅く退勤することを、別々の文で書きます。",
    "en": "Write separate sentences about having a lot of work and leaving work late.",
    "zh": "把工作量大和下班晚这两件事分别写成句子。"
  },
  "이 장면에서 늦게 퇴근하는 이유를 고르세요.": {
    "ko": "이 상황에서 왜 늦게 퇴근하는지 골라 보세요.",
    "ja": "この場面で、なぜ遅く退勤するのか選びましょう。",
    "en": "Choose why you leave work late in this situation.",
    "zh": "选择这个情境中为什么晚下班。"
  },
  "일이 많아요.": {
    "ko": "일이 많아요.",
    "ja": "仕事が多いです。",
    "en": "There is a lot of work.",
    "zh": "工作很多。"
  },
  "늦게 퇴근해요.": {
    "ko": "늦게 퇴근해요.",
    "ja": "遅く退勤します。",
    "en": "I leave work late.",
    "zh": "我很晚下班。"
  },
  "仕事の量が多く、帰る時間が遅くなった場面です。": {
    "ko": "일의 양이 많고 퇴근 시간이 늦어진 상황이에요.",
    "ja": "仕事の量が多く、帰る時間が遅くなった場面です。",
    "en": "In this situation, there is a lot of work and it is late by the time you leave.",
    "zh": "这个场景中，工作量很大，下班时间也晚了。"
  },
  "이 문장의 뜻과 맞는 쪽을 고르세요.": {
    "ko": "이 문장과 뜻이 같은 쪽을 골라 보세요.",
    "ja": "文の意味に合うものを選びましょう。",
    "en": "Choose the meaning that matches this sentence.",
    "zh": "选择符合这句话意思的一项。"
  },
  "시간이 없어요.": {
    "ko": "시간이 없어요.",
    "ja": "時間がありません。",
    "en": "I have no time.",
    "zh": "我没有时间。"
  },
  "시간": {
    "ko": "시간",
    "ja": "時間",
    "en": "time",
    "zh": "时间"
  },
  "「있다」と「없다」の違いを確認します。": {
    "ko": "「있다」와 「없다」의 차이를 확인해요.",
    "ja": "「있다」と「없다」の違いを確認します。",
    "en": "Check the difference between 「있다」 and 「없다」.",
    "zh": "确认「있다」和「없다」的区别。"
  },
  "영화를 볼 수 없었다는 뜻을 더 분명하게 나타내는 문장을 고르세요.": {
    "ko": "영화를 볼 수 없었다는 뜻이 더 분명한 문장을 골라 보세요.",
    "ja": "映画を「見ることができなかった」と、よりはっきり表す文を選びましょう。",
    "en": "Choose the sentence that more clearly says you were unable to watch the movie.",
    "zh": "选择更明确地表达“没能看电影”的句子。"
  },
  "영화": {
    "ko": "영화",
    "ja": "映画",
    "en": "movie",
    "zh": "电影"
  },
  "보다": {
    "ko": "보다",
    "ja": "見る",
    "en": "to see; to watch",
    "zh": "看"
  },
  "どちらも「見ていない」場面で使えます。できなかったことを明確にする表現を選びます。": {
    "ko": "두 표현 모두 영화를 보지 않은 상황에서 쓸 수 있어요. 볼 수 없었다는 뜻을 분명하게 나타내는 표현을 골라요.",
    "ja": "どちらも「見ていない」場面で使えます。できなかったことを明確にする表現を選びます。",
    "en": "Both expressions can describe not watching the movie. Choose the one that makes it clear that watching it was not possible.",
    "zh": "两种表达都可以用于没有看电影的情况。请选择能明确表达“没能看”的说法。"
  },
  "어제의 일을 해요체 한 문장으로 써 보세요. 아직 이유는 넣지 마세요.": {
    "ko": "어제의 일을 한 문장으로 써요. 해요체(~아요·어요·해요)로 끝내고, 이유는 아직 넣지 마세요.",
    "ja": "昨日のことを1文で書きます。丁寧な形（아요・어요・해요）で終え、まだ理由は入れません。",
    "en": "Write one sentence about yesterday. Use a polite ending (아요, 어요, or 해요). Do not add a reason yet.",
    "zh": "用一句话写昨天的事。用礼貌句尾（아요、어요、해요），暂时不要加理由。"
  },
  "어제의 일이라는 정보를 넣어 보세요.": {
    "ko": "어제의 일이라는 정보도 넣어 보세요.",
    "ja": "昨日のことだと分かる情報を入れましょう。",
    "en": "Include the information that it happened yesterday.",
    "zh": "加上事情发生在昨天的信息。"
  },
  "퇴근한 일을 과거 해요체로 써 보세요.": {
    "ko": "퇴근한 일을 과거 해요체로 써 보세요. 이미 끝난 일이라는 점을 나타내요.",
    "ja": "退勤したことを、丁寧な過去の形で書きます。すでに終わったことだと分かるようにしましょう。",
    "en": "Write about leaving work in a polite past-tense form. Show that it has already happened.",
    "zh": "用礼貌的过去时写出下班的事。说明这是已经发生的事。"
  },
  "언제: 어제": {
    "ko": "언제: 어제",
    "ja": "いつ：昨日",
    "en": "When: yesterday",
    "zh": "时间：昨天"
  },
  "행동: 늦게 퇴근하다": {
    "ko": "행동: 늦게 퇴근하다",
    "ja": "行動：遅く退勤する",
    "en": "Action: leaving work late",
    "zh": "行动：很晚下班"
  },
  "어제": {
    "ko": "어제",
    "ja": "昨日",
    "en": "yesterday",
    "zh": "昨天"
  },
  "昨日、遅く退勤しました。時点だけを確認します。": {
    "ko": "어제의 늦은 퇴근을 나타내는 상황이에요. 언제 일어난 일인지만 확인해요.",
    "ja": "昨日、遅く退勤しました。時点だけを確認します。",
    "en": "You left work late yesterday. Focus only on when it happened.",
    "zh": "昨天下班很晚。这里只确认事情发生的时间。"
  },
  "두 사실을 이유와 결과로 연결해 해요체 한 문장으로 써 보세요. 주어진 뜻을 유지하세요.": {
    "ko": "이유와 결과를 이어 한 문장으로 써요. 해요체(~아요·어요·해요)로 끝내고, 주어진 뜻을 지켜요.",
    "ja": "理由と結果をつないで1文にします。丁寧な形（아요・어요・해요）で終え、元の意味を保ちましょう。",
    "en": "Join the reason and result in one sentence. Use a polite ending (아요, 어요, or 해요) and keep the given meaning.",
    "zh": "把理由和结果连成一句话。用礼貌句尾（아요、어요、해요），保留原意。"
  },
  "주어진 이유의 핵심 내용이 문장에 있는지 확인해 보세요.": {
    "ko": "주어진 이유가 문장에 들어 있는지 확인해 보세요.",
    "ja": "示された理由の中心となる内容が文にあるか確認しましょう。",
    "en": "Check that your sentence includes the main point of the given reason.",
    "zh": "确认句中有没有写出题目所给理由的重点。"
  },
  "주어진 행동이나 결과를 해요체로 끝까지 써 보세요.": {
    "ko": "주어진 행동이나 결과를 끝까지 써 보세요. 해요체(~아요·어요·해요)로 끝내요.",
    "ja": "示された行動や結果を最後まで書きましょう。丁寧な形（아요・어요・해요）で終えます。",
    "en": "Write the given action or result in full. Use a polite ending (아요, 어요, or 해요).",
    "zh": "完整写出题目给出的行动或结果。用礼貌句尾（아요、어요、해요）。"
  },
  "완성된 해요체 뒤에 서를 바로 붙였는지 확인해 보세요.": {
    "ko": "완성된 해요체 뒤에 서를 바로 붙이지 않았는지 살펴보세요.",
    "ja": "完成したヘヨ体の後に、そのまま「서」を付けていないか確認しましょう。",
    "en": "Check whether you added 서 directly after a completed 해요-style form.",
    "zh": "看看有没有在完整的해요体后直接加서。"
  },
  "완성된 해요체 뒤에 서를 붙이지 않아요. 연결한 뒤 문장 전체를 직접 써 보세요.": {
    "ko": "완성된 해요체 뒤에 서를 붙이지 않아요. 두 내용을 이은 뒤 문장 전체를 직접 써요.",
    "ja": "完成したヘヨ体の後にそのまま「서」を付けません。つないだら、全文を自分で書きましょう。",
    "en": "Do not add 서 directly after a completed 해요-style form. Join the ideas, then write the whole sentence yourself.",
    "zh": "不要在完整的해요体后直接加서。连接后，自己写出整个句子。"
  },
  "この場面では、仕事が多いことが退勤の遅い理由です。": {
    "ko": "이 상황에서는 일의 양이 많다는 것이 늦게 퇴근하는 이유예요.",
    "ja": "この場面では、仕事が多いことが退勤の遅い理由です。",
    "en": "In this situation, having a lot of work is the reason for leaving work late.",
    "zh": "在这个场景中，工作量大是下班晚的原因。"
  },
  "多い → 理由につなぐ形": {
    "ko": "많다 → 이유를 말할 때 쓰는 형태",
    "ja": "多い → 理由を伝える形",
    "en": "Many / a lot → change the word to give a reason",
    "zh": "多 → 说明原因时的说法"
  },
  "날씨가 좋아요.": {
    "ko": "날씨가 좋아요.",
    "ja": "天気がいいです。",
    "en": "The weather is nice.",
    "zh": "天气很好。"
  },
  "공원에 가요.": {
    "ko": "공원에 가요.",
    "ja": "公園に行きます。",
    "en": "I go to the park.",
    "zh": "我去公园。"
  },
  "날씨": {
    "ko": "날씨",
    "ja": "天気",
    "en": "weather",
    "zh": "天气"
  },
  "공원": {
    "ko": "공원",
    "ja": "公園",
    "en": "park",
    "zh": "公园"
  },
  "天気がいいことが、公園へ行く理由です。": {
    "ko": "날씨가 좋다는 것이 공원에 가는 이유예요.",
    "ja": "天気がいいことが、公園へ行く理由です。",
    "en": "The weather is good. That is the reason for going to the park.",
    "zh": "天气好是去公园的原因。"
  },
  "よい → 理由につなぐ形": {
    "ko": "좋다 → 이유를 말할 때 쓰는 형태",
    "ja": "よい → 理由を伝える形",
    "en": "Good → change the word to give a reason",
    "zh": "好 → 说明原因时的说法"
  },
  "숙제가 많아요.": {
    "ko": "숙제가 많아요.",
    "ja": "宿題が多いです。",
    "en": "There is a lot of homework.",
    "zh": "作业很多。"
  },
  "집에서 공부해요.": {
    "ko": "집에서 공부해요.",
    "ja": "家で勉強します。",
    "en": "I study at home.",
    "zh": "我在家学习。"
  },
  "숙제": {
    "ko": "숙제",
    "ja": "宿題",
    "en": "homework",
    "zh": "作业"
  },
  "집": {
    "ko": "집",
    "ja": "家",
    "en": "home",
    "zh": "家"
  },
  "この場面では、宿題が多いことが家で勉強する理由です。": {
    "ko": "이 상황에서는 숙제의 양이 많다는 것이 집에서 공부하는 이유예요.",
    "ja": "この場面では、宿題が多いことが家で勉強する理由です。",
    "en": "In this situation, having a lot of homework is the reason for studying at home.",
    "zh": "在这个场景中，作业多是在家学习的原因。"
  },
  "택시를 타요.": {
    "ko": "택시를 타요.",
    "ja": "タクシーに乗ります。",
    "en": "I take a taxi.",
    "zh": "我坐出租车。"
  },
  "택시": {
    "ko": "택시",
    "ja": "タクシー",
    "en": "taxi",
    "zh": "出租车"
  },
  "타다": {
    "ko": "타다",
    "ja": "乗る",
    "en": "to ride; to take a vehicle",
    "zh": "乘坐"
  },
  "この場面では、時間が足りずタクシーを選びます。どんな場合でもタクシーが速いという意味ではありません。": {
    "ko": "이 상황에서는 시간 부족이 택시를 선택하는 이유예요. 택시가 언제나 더 빠르다는 뜻은 아니에요.",
    "ja": "この場面では時間が足りません。それがタクシーを選ぶ理由です。タクシーがいつも速いという意味ではありません。",
    "en": "In this situation, there is not enough time. That is the reason for choosing a taxi. A taxi is not always faster.",
    "zh": "这个场景中，时间不够。这是选择出租车的原因。出租车并不总是更快。"
  },
  "ない → 理由につなぐ形": {
    "ko": "없다 → 이유를 말할 때 쓰는 형태",
    "ja": "ない → 理由を伝える形",
    "en": "Not have / not exist → change the word to give a reason",
    "zh": "没有 → 说明原因时的说法"
  },
  "길이 멀어요.": {
    "ko": "길이 멀어요.",
    "ja": "道のりが遠いです。",
    "en": "It is a long way.",
    "zh": "路程很远。"
  },
  "버스를 타요.": {
    "ko": "버스를 타요.",
    "ja": "バスに乗ります。",
    "en": "I take the bus.",
    "zh": "我坐公交车。"
  },
  "길": {
    "ko": "길",
    "ja": "道のり",
    "en": "road; distance to travel",
    "zh": "路；路程"
  },
  "멀다": {
    "ko": "멀다",
    "ja": "遠い",
    "en": "to be far",
    "zh": "远"
  },
  "버스": {
    "ko": "버스",
    "ja": "バス",
    "en": "bus",
    "zh": "公交车"
  },
  "目的地までの道のりが遠いことが、バスに乗る理由です。": {
    "ko": "목적지까지의 거리가 멀다는 것이 버스를 타는 이유예요.",
    "ja": "目的地までの道のりが遠いことが、バスに乗る理由です。",
    "en": "The destination is far away. That is the reason for taking the bus.",
    "zh": "目的地距离远是乘坐公交车的原因。"
  },
  "遠い → 理由につなぐ形": {
    "ko": "멀다 → 이유를 말할 때 쓰는 형태",
    "ja": "遠い → 理由を伝える形",
    "en": "Far → change the word to give a reason",
    "zh": "远 → 说明原因时的说法"
  },
  "집에 책이 없어요.": {
    "ko": "집에 책이 없어요.",
    "ja": "家に本がありません。",
    "en": "There are no books at home.",
    "zh": "家里没有书。"
  },
  "도서관에 가요.": {
    "ko": "도서관에 가요.",
    "ja": "図書館に行きます。",
    "en": "I go to the library.",
    "zh": "我去图书馆。"
  },
  "책": {
    "ko": "책",
    "ja": "本",
    "en": "book",
    "zh": "书"
  },
  "本を読む場面です。家に本がないことが、図書館へ行く理由です。": {
    "ko": "책을 읽으려는 상황이에요. 집에 책이 없다는 것이 도서관에 가는 이유예요.",
    "ja": "本を読む場面です。家に本がないことが、図書館へ行く理由です。",
    "en": "This situation is about reading. There are no books at home. That is the reason for going to the library.",
    "zh": "这是要读书的场景。家里没有书是去图书馆的原因。"
  },
  "길이 복잡해요.": {
    "ko": "길이 복잡해요.",
    "ja": "道が混雑しています。",
    "en": "The road is busy.",
    "zh": "道路很拥堵。"
  },
  "지하철을 타요.": {
    "ko": "지하철을 타요.",
    "ja": "地下鉄に乗ります。",
    "en": "I take the subway.",
    "zh": "我坐地铁。"
  },
  "복잡하다": {
    "ko": "복잡하다",
    "ja": "混雑している",
    "en": "to be crowded; to be complicated",
    "zh": "拥挤；复杂"
  },
  "지하철": {
    "ko": "지하철",
    "ja": "地下鉄",
    "en": "subway",
    "zh": "地铁"
  },
  "道が混雑していることが、地下鉄を選ぶ理由です。": {
    "ko": "길이 혼잡하다는 것이 지하철을 선택하는 이유예요.",
    "ja": "道が混雑していることが、地下鉄を選ぶ理由です。",
    "en": "Heavy traffic is the reason for choosing the subway.",
    "zh": "道路拥堵是选择地铁的原因。"
  },
  "混雑している → 理由につなぐ形": {
    "ko": "복잡하다 → 이유를 말할 때 쓰는 형태",
    "ja": "混雑している → 理由を伝える形",
    "en": "Congested → change the word to give a reason",
    "zh": "拥堵 → 说明原因时的说法"
  },
  "도서관이 조용해요.": {
    "ko": "도서관이 조용해요.",
    "ja": "図書館は静かです。",
    "en": "The library is quiet.",
    "zh": "图书馆很安静。"
  },
  "여기에서 공부해요.": {
    "ko": "여기에서 공부해요.",
    "ja": "ここで勉強します。",
    "en": "I study here.",
    "zh": "我在这里学习。"
  },
  "조용하다": {
    "ko": "조용하다",
    "ja": "静かだ",
    "en": "to be quiet",
    "zh": "安静"
  },
  "여기": {
    "ko": "여기",
    "ja": "ここ（この図書館）",
    "en": "here (this library)",
    "zh": "这里（这座图书馆）"
  },
  "「ここ」は図書館です。静かなことが、そこで勉強する理由です。": {
    "ko": "여기서 말하는 장소는 도서관이에요. 조용하다는 것이 그곳에서 공부하는 이유예요.",
    "ja": "「ここ」は図書館です。静かなことが、そこで勉強する理由です。",
    "en": "“Here” means the library. It is quiet. That is the reason for studying there.",
    "zh": "“这里”指图书馆。安静是在那里学习的原因。"
  },
  "静かだ → 理由につなぐ形": {
    "ko": "조용하다 → 이유를 말할 때 쓰는 형태",
    "ja": "静かだ → 理由を伝える形",
    "en": "Quiet → change the word to give a reason",
    "zh": "安静 → 说明原因时的说法"
  },
  "방이 깨끗해요.": {
    "ko": "방이 깨끗해요.",
    "ja": "部屋がきれいです。",
    "en": "The room is clean.",
    "zh": "房间很干净。"
  },
  "기분이 좋아요.": {
    "ko": "기분이 좋아요.",
    "ja": "気分がいいです。",
    "en": "I feel good.",
    "zh": "我心情很好。"
  },
  "방": {
    "ko": "방",
    "ja": "部屋",
    "en": "room",
    "zh": "房间"
  },
  "깨끗하다": {
    "ko": "깨끗하다",
    "ja": "きれいだ",
    "en": "to be clean",
    "zh": "干净"
  },
  "기분": {
    "ko": "기분",
    "ja": "気分",
    "en": "mood; feeling",
    "zh": "心情"
  },
  "部屋がきれいなことが、気分のいい理由です。": {
    "ko": "방이 깨끗하다는 것이 기분이 좋은 이유예요.",
    "ja": "部屋がきれいなことが、気分のいい理由です。",
    "en": "The clean room is the reason for feeling good.",
    "zh": "房间干净是心情好的原因。"
  },
  "きれいだ → 理由につなぐ形": {
    "ko": "깨끗하다 → 이유를 말할 때 쓰는 형태",
    "ja": "きれいだ → 理由を伝える形",
    "en": "Clean → change the word to give a reason",
    "zh": "干净 → 说明原因时的说法"
  },
  "행사가 있어요.": {
    "ko": "행사가 있어요.",
    "ja": "イベントがあります。",
    "en": "There is an event.",
    "zh": "有活动。"
  },
  "사람이 많아요.": {
    "ko": "사람이 많아요.",
    "ja": "人が多いです。",
    "en": "There are many people.",
    "zh": "人很多。"
  },
  "행사": {
    "ko": "행사",
    "ja": "イベント",
    "en": "event",
    "zh": "活动"
  },
  "イベントがあることが、その場所に人の多い理由です。": {
    "ko": "행사가 있다는 것이 그 장소에 사람이 많은 이유예요.",
    "ja": "イベントがあることが、その場所に人の多い理由です。",
    "en": "An event is the reason there are many people at that location.",
    "zh": "有活动是那个地方人多的原因。"
  },
  "돈이 없어요.": {
    "ko": "돈이 없어요.",
    "ja": "お金がありません。",
    "en": "I have no money.",
    "zh": "我没有钱。"
  },
  "집에서 쉬어요.": {
    "ko": "집에서 쉬어요.",
    "ja": "家で休みます。",
    "en": "I rest at home.",
    "zh": "我在家休息。"
  },
  "돈": {
    "ko": "돈",
    "ja": "お金",
    "en": "money",
    "zh": "钱"
  },
  "쉬다": {
    "ko": "쉬다",
    "ja": "休む",
    "en": "to rest",
    "zh": "休息"
  },
  "この場面では、お金がないことが家で休む理由です。": {
    "ko": "이 상황에서는 돈이 없다는 것이 집에서 쉬는 이유예요.",
    "ja": "この場面では、お金がないことが家で休む理由です。",
    "en": "In this situation, having no money is the reason for resting at home.",
    "zh": "在这个场景中，没有钱是在家休息的原因。"
  },
  "공부를 많이 해요.": {
    "ko": "공부를 많이 해요.",
    "ja": "たくさん勉強します。",
    "en": "I study a lot.",
    "zh": "我学习很多。"
  },
  "답을 알아요.": {
    "ko": "답을 알아요.",
    "ja": "答えが分かります。",
    "en": "I know the answer.",
    "zh": "我知道答案。"
  },
  "많이": {
    "ko": "많이",
    "ja": "たくさん",
    "en": "a lot",
    "zh": "很多"
  },
  "답": {
    "ko": "답",
    "ja": "答え",
    "en": "answer",
    "zh": "答案"
  },
  "알다": {
    "ko": "알다",
    "ja": "知っている",
    "en": "to know",
    "zh": "知道"
  },
  "よく勉強していることが、答えを知っている理由です。": {
    "ko": "공부를 많이 한다는 것이 답을 아는 이유예요.",
    "ja": "よく勉強していることが、答えを知っている理由です。",
    "en": "Studying a lot is the reason for knowing the answer.",
    "zh": "学习得多是知道答案的原因。"
  },
  "피곤해요.": {
    "ko": "피곤해요.",
    "ja": "疲れています。",
    "en": "I am tired.",
    "zh": "我很累。"
  },
  "일찍 자요.": {
    "ko": "일찍 자요.",
    "ja": "早く寝ます。",
    "en": "I go to bed early.",
    "zh": "我很早睡觉。"
  },
  "피곤하다": {
    "ko": "피곤하다",
    "ja": "疲れている",
    "en": "to be tired",
    "zh": "疲倦"
  },
  "일찍": {
    "ko": "일찍",
    "ja": "早く",
    "en": "early",
    "zh": "早"
  },
  "疲れていることが、早く寝る理由です。": {
    "ko": "피곤하다는 것이 일찍 자는 이유예요.",
    "ja": "疲れていることが、早く寝る理由です。",
    "en": "Feeling tired is the reason for going to bed early.",
    "zh": "疲惫是早睡的原因。"
  },
  "식당이 유명해요.": {
    "ko": "식당이 유명해요.",
    "ja": "食堂が有名です。",
    "en": "The restaurant is famous.",
    "zh": "这家餐馆很有名。"
  },
  "손님이 많아요.": {
    "ko": "손님이 많아요.",
    "ja": "お客さんが多いです。",
    "en": "There are many customers.",
    "zh": "顾客很多。"
  },
  "식당": {
    "ko": "식당",
    "ja": "食堂",
    "en": "restaurant",
    "zh": "餐馆"
  },
  "유명하다": {
    "ko": "유명하다",
    "ja": "有名だ",
    "en": "to be famous",
    "zh": "有名"
  },
  "손님": {
    "ko": "손님",
    "ja": "お客さん",
    "en": "customer; guest",
    "zh": "顾客；客人"
  },
  "この場面では、食堂が有名なことが客の多い理由です。": {
    "ko": "이 상황에서는 식당이 유명하다는 것이 손님이 많은 이유예요.",
    "ja": "この場面では、食堂が有名なことが客の多い理由です。",
    "en": "In this situation, the restaurant is well known. That is the reason it has many customers.",
    "zh": "在这个场景中，餐厅有名是顾客多的原因。"
  },
  "회의실이 작아요.": {
    "ko": "회의실이 작아요.",
    "ja": "会議室が小さいです。",
    "en": "The meeting room is small.",
    "zh": "会议室很小。"
  },
  "다른 방을 사용해요.": {
    "ko": "다른 방을 사용해요.",
    "ja": "別の部屋を使います。",
    "en": "We use another room.",
    "zh": "我们用另一个房间。"
  },
  "회의실": {
    "ko": "회의실",
    "ja": "会議室",
    "en": "meeting room",
    "zh": "会议室"
  },
  "작다": {
    "ko": "작다",
    "ja": "小さい",
    "en": "to be small",
    "zh": "小"
  },
  "다른": {
    "ko": "다른",
    "ja": "別の",
    "en": "another; different",
    "zh": "别的；不同的"
  },
  "사용하다": {
    "ko": "사용하다",
    "ja": "使う",
    "en": "to use",
    "zh": "使用"
  },
  "会議室が小さいことが、別の部屋を使う理由です。": {
    "ko": "회의실이 작다는 것이 다른 방을 사용하는 이유예요.",
    "ja": "会議室が小さいことが、別の部屋を使う理由です。",
    "en": "The small meeting room is the reason for using a different room.",
    "zh": "会议室小是使用另一个房间的原因。"
  },
  "어제의 일이라는 정보를 유지해 보세요.": {
    "ko": "어제의 일이라는 정보는 그대로 남겨 주세요.",
    "ja": "昨日の出来事だと分かる情報を保ちましょう。",
    "en": "Keep the information that it happened yesterday.",
    "zh": "保留事情发生在昨天的信息。"
  },
  "어제 일이 많았어요.": {
    "ko": "어제 일이 많았어요.",
    "ja": "昨日は仕事が多かったです。",
    "en": "There was a lot of work yesterday.",
    "zh": "昨天工作很多。"
  },
  "어제 늦게 퇴근했어요.": {
    "ko": "어제 늦게 퇴근했어요.",
    "ja": "昨日は遅く退勤しました。",
    "en": "I left work late yesterday.",
    "zh": "我昨天很晚下班。"
  },
  "昨日の出来事です。仕事の量が退勤の遅かった理由です。": {
    "ko": "어제 일어난 일이에요. 일의 양이 많았다는 것이 퇴근 시간이 늦었던 이유예요.",
    "ja": "昨日の出来事です。仕事の量が多かったことが、退勤が遅くなった理由です。",
    "en": "This happened yesterday. The amount of work was the reason for leaving work late.",
    "zh": "这是昨天发生的事。工作量大是下班晚的原因。"
  },
  "어제 방이 깨끗했어요.": {
    "ko": "어제 방이 깨끗했어요.",
    "ja": "昨日は部屋がきれいでした。",
    "en": "The room was clean yesterday.",
    "zh": "昨天房间很干净。"
  },
  "어제 기분이 좋았어요.": {
    "ko": "어제 기분이 좋았어요.",
    "ja": "昨日は気分がよかったです。",
    "en": "I felt good yesterday.",
    "zh": "我昨天心情很好。"
  },
  "昨日の出来事です。部屋がきれいだったことが、気分のよかった理由です。": {
    "ko": "어제 일어난 일이에요. 방이 깨끗했다는 것이 기분이 좋았던 이유예요.",
    "ja": "昨日の出来事です。部屋がきれいだったことが、気分のよかった理由です。",
    "en": "This happened yesterday. The clean room was the reason for feeling good.",
    "zh": "这是昨天发生的事。房间干净是当时心情好的原因。"
  },
  "공부하는 사람이 동료라는 점을 밝혀 보세요.": {
    "ko": "공부하는 사람이 동료라는 점을 써 보세요.",
    "ja": "勉強する人が同僚だと示しましょう。",
    "en": "Make it clear that the colleague is the person studying.",
    "zh": "写清楚学习的人是同事。"
  },
  "동료가 여기에서 공부해요.": {
    "ko": "동료가 여기에서 공부해요.",
    "ja": "同僚がここで勉強します。",
    "en": "My colleague studies here.",
    "zh": "同事在这里学习。"
  },
  "동료": {
    "ko": "동료",
    "ja": "同僚",
    "en": "colleague",
    "zh": "同事"
  },
  "「ここ」は図書館です。静かなことが同僚の勉強する理由です。勉強する人をはっきり示します。": {
    "ko": "여기서 말하는 장소는 도서관이에요. 조용하다는 것이 동료가 그곳에서 공부하는 이유예요. 공부하는 사람이 누구인지 분명하게 나타내요.",
    "ja": "「ここ」は図書館です。静かなことが、同僚がそこで勉強する理由です。勉強する人をはっきり示します。",
    "en": "“Here” means the library. It is quiet. That is the reason your coworker studies there. Make it clear who is studying.",
    "zh": "“这里”指图书馆。安静是同事在那里学习的原因。请明确指出学习的人是谁。"
  },
  "늦게 퇴근하는 사람들이 팀원들이라는 점을 밝혀 보세요.": {
    "ko": "늦게 퇴근하는 사람들이 팀원들이라는 점을 써 보세요.",
    "ja": "遅く退勤するのがチームのメンバーだと示しましょう。",
    "en": "Make it clear that the team members are the people leaving work late.",
    "zh": "写清楚晚下班的人是团队成员。"
  },
  "팀원들이 늦게 퇴근해요.": {
    "ko": "팀원들이 늦게 퇴근해요.",
    "ja": "チームのメンバーが遅く退勤します。",
    "en": "The team members leave work late.",
    "zh": "团队成员很晚下班。"
  },
  "팀원들": {
    "ko": "팀원들",
    "ja": "チームのメンバーたち",
    "en": "team members",
    "zh": "团队成员"
  },
  "仕事の多さが、チームのメンバーの退勤が遅い理由です。": {
    "ko": "일의 양이 많다는 것이 팀원들의 퇴근 시간이 늦은 이유예요.",
    "ja": "仕事の多さが、チームのメンバーの退勤が遅い理由です。",
    "en": "A large amount of work is the reason the team members leave work late.",
    "zh": "工作量大是团队成员下班晚的原因。"
  },
  "보지 않았다는 사실과 볼 수 없었다는 뜻을 구분해요. 이번에는 못으로 불가능을 더 분명하게 써 보세요.": {
    "ko": "보지 않은 것과 볼 수 없었던 것은 뜻이 달라요. 이번에는 못을 써서 볼 수 없었다는 뜻을 더 분명하게 해요.",
    "ja": "見なかった事実と、見られなかったことを区別します。今回は「못」で不可能を明確にしましょう。",
    "en": "Not watching and being unable to watch are different meanings. Use 못 here to make the inability clearer.",
    "zh": "“没看”和“没能看”的意思不同。这次用못更明确地表达“做不到”。"
  },
  "어제 시간이 없었어요.": {
    "ko": "어제 시간이 없었어요.",
    "ja": "昨日は時間がありませんでした。",
    "en": "I had no time yesterday.",
    "zh": "我昨天没有时间。"
  },
  "어제 영화를 보지 못했어요.": {
    "ko": "어제 영화를 보지 못했어요.",
    "ja": "昨日は映画を見ることができませんでした。",
    "en": "I could not watch the movie yesterday.",
    "zh": "我昨天没能看电影。"
  },
  "時間が足りず、映画を見られませんでした。「できなかった」ことを明確に書きます。": {
    "ko": "시간 부족 때문에 영화를 볼 수 없었던 상황이에요. 볼 수 없었다는 뜻을 분명하게 써요.",
    "ja": "時間が足りず、映画を見られませんでした。「できなかった」ことを明確に書きます。",
    "en": "There was not enough time to watch the movie. Make it clear that watching it was not possible.",
    "zh": "因为时间不够，没能看电影。请明确表达“没能看”的意思。"
  },
  "이번에는 책을 살 수 없었다는 뜻을 못으로 더 분명하게 써 보세요.": {
    "ko": "이번에는 못을 써서 책을 살 수 없었다는 뜻을 더 분명하게 해요.",
    "ja": "今回は「못」を使い、本を買えなかったことを明確にしましょう。",
    "en": "Use 못 here to make it clearer that you could not buy the book.",
    "zh": "这次用못更明确地表达“没能买书”。"
  },
  "어제 돈이 없었어요.": {
    "ko": "어제 돈이 없었어요.",
    "ja": "昨日はお金がありませんでした。",
    "en": "I had no money yesterday.",
    "zh": "我昨天没有钱。"
  },
  "어제 책을 사지 못했어요.": {
    "ko": "어제 책을 사지 못했어요.",
    "ja": "昨日は本を買うことができませんでした。",
    "en": "I could not buy the book yesterday.",
    "zh": "我昨天没能买书。"
  },
  "お金がなくて、本を買えませんでした。「できなかった」ことを明確に書きます。": {
    "ko": "돈 부족 때문에 책을 살 수 없었던 상황이에요. 살 수 없었다는 뜻을 분명하게 써요.",
    "ja": "お金がなくて、本を買えませんでした。「できなかった」ことを明確に書きます。",
    "en": "There was no money to buy the book. Make it clear that buying it was not possible.",
    "zh": "因为没有钱，没能买书。请明确表达“没能买”的意思。"
  },
  "초고의 뜻은 유지하고 연결 형태를 고쳐 전체 문장을 다시 써 보세요.": {
    "ko": "초고의 뜻은 그대로 둬요. 두 내용을 잇는 부분을 고쳐 문장 전체를 다시 써요.",
    "ja": "下書きの意味は変えません。2つの内容をつなぐ部分を直し、文全体を書き直しましょう。",
    "en": "Keep the draft's meaning. Fix the part that joins the two ideas and rewrite the whole sentence.",
    "zh": "保留初稿的意思。修改连接两个内容的部分，重写整个句子。"
  },
  "意味を保ち、理由をつなぐ形を直します。": {
    "ko": "뜻은 그대로 두어요. 이유를 이어 말하는 부분의 형태를 고쳐요.",
    "ja": "意味は変えません。理由をつなぐ部分の形を直します。",
    "en": "Keep the meaning. Correct the word ending used to give the reason.",
    "zh": "不要改变原意。改正连接原因那部分的词形。"
  },
  "이 장면의 이유와 결과에 맞게 초고를 고쳐 전체 문장을 써 보세요.": {
    "ko": "이 상황의 이유와 결과에 맞게 초고를 고쳐요. 문장 전체를 다시 써 보세요.",
    "ja": "この場面の理由と結果に合うように、下書きの全文を書き直しましょう。",
    "en": "Rewrite the whole draft sentence to match the reason and result in this situation.",
    "zh": "根据这个情境中的理由和结果，修改并重写整个句子。"
  },
  "この場面では、仕事が多いことが退勤の遅い理由です。下書きはこの関係が逆です。": {
    "ko": "이 상황에서는 일의 양이 많다는 것이 퇴근 시간이 늦은 이유예요. 초고에서는 이 관계가 뒤바뀌어 있어요.",
    "ja": "この場面では、仕事が多いことが退勤の遅い理由です。下書きはこの関係が逆です。",
    "en": "In this situation, having a lot of work is the reason for leaving work late. The draft has the reason and result the wrong way around.",
    "zh": "在这个场景中，工作量大是下班晚的原因。草稿把这个关系写反了。"
  },
  "초고는 영화를 보지 않았다는 사실을 말해요. 이번에는 시간이 부족해 볼 수 없었다는 뜻이 더 분명하도록 전체 문장을 고쳐 보세요.": {
    "ko": "초고는 영화를 보지 않았다는 뜻이에요. 시간이 부족해서 볼 수 없었다는 뜻이 더 분명해지도록 문장 전체를 고쳐요.",
    "ja": "下書きは映画を見なかった事実を表します。時間が足りず、見ることができなかったとより明確に伝わる全文に直しましょう。",
    "en": "The draft says you did not watch the movie. Rewrite the whole sentence to make it clearer that you could not watch it because you lacked time.",
    "zh": "初稿表达了“没看电影”。请修改整个句子，更清楚地表达“因为时间不够，没能看电影”。"
  },
  "시간이 없었어요.": {
    "ko": "시간이 없었어요.",
    "ja": "時間がありませんでした。",
    "en": "I had no time.",
    "zh": "我没有时间。"
  },
  "영화를 볼 수 없었어요.": {
    "ko": "영화를 볼 수 없었어요.",
    "ja": "映画を見ることができませんでした。",
    "en": "I could not watch the movie.",
    "zh": "我没能看电影。"
  },
  "下書きは映画を見なかった事実を表します。今回は時間が足りず見られなかったことを、もっと明確にします。": {
    "ko": "초고는 영화를 보지 않았다는 사실을 나타내요. 이번에는 시간 부족 때문에 볼 수 없었다는 뜻을 더 분명하게 나타내요.",
    "ja": "下書きは映画を見なかった事実を表します。今回は時間が足りず見られなかったことを、もっと明確にします。",
    "en": "The draft says the movie was not watched. Make it clear that watching it was not possible because there was not enough time.",
    "zh": "草稿表达的是没有看电影这一事实。这次要更明确地表达：时间不够，所以没能看。"
  },
  "주어진 사실과 이유를 바꾸지 않도록 초고를 고쳐 전체 문장을 써 보세요.": {
    "ko": "주어진 사실과 이유는 그대로 둬요. 초고를 고쳐 문장 전체를 다시 써요.",
    "ja": "示された事実と理由を変えないように、下書きの全文を書き直しましょう。",
    "en": "Rewrite the whole draft sentence without changing the given facts or reason.",
    "zh": "修改并重写整个句子，不要改变给出的事实和理由。"
  },
  "도서관에서 공부해요.": {
    "ko": "도서관에서 공부해요.",
    "ja": "図書館で勉強します。",
    "en": "I study at the library.",
    "zh": "我在图书馆学习。"
  },
  "この場面で示された理由は、図書館が静かなことです。部屋がきれいかどうかは示されていません。": {
    "ko": "이 상황에서 주어진 이유는 도서관이 조용하다는 것이에요. 방이 깨끗한지는 나와 있지 않아요.",
    "ja": "この場面で示された理由は、図書館が静かなことです。部屋がきれいかどうかは示されていません。",
    "en": "The reason given in this situation is that the library is quiet. Whether the room is clean is not stated.",
    "zh": "这个场景中给出的原因是图书馆安静。并没有提到房间是否干净。"
  },
  "이유와 결과를 유지하며 오늘이라는 시간 정보 하나를 더해 한 문장으로 써 보세요.": {
    "ko": "이유와 결과는 그대로 두고 오늘이라는 정보만 더해요. 한 문장으로 써 보세요.",
    "ja": "理由と結果を保ち、「今日」という時間の情報を1つ加えて1文で書きましょう。",
    "en": "Keep the reason and result. Add one time detail, today, and write one sentence.",
    "zh": "保留理由和结果，加上“今天”这一条时间信息，写成一句话。"
  },
  "오늘이라는 새 정보가 문장에 있는지 확인해 보세요.": {
    "ko": "새 정보인 오늘이 문장에 들어 있는지 확인해 보세요.",
    "ja": "「今日」という新しい情報が文にあるか確認しましょう。",
    "en": "Check that your sentence includes the new information, today.",
    "zh": "确认句中有没有加上“今天”这条新信息。"
  },
  "언제: 오늘": {
    "ko": "언제: 오늘",
    "ja": "いつ：今日",
    "en": "When: today",
    "zh": "时间：今天"
  },
  "오늘": {
    "ko": "오늘",
    "ja": "今日",
    "en": "today",
    "zh": "今天"
  },
  "会議室が小さいことが別の部屋を使う理由です。「今日」という情報を1つ加えてください。": {
    "ko": "회의실이 작다는 것이 다른 방을 사용하는 이유예요. 오늘이라는 시간 정보 하나를 더해 주세요.",
    "ja": "会議室が小さいことが別の部屋を使う理由です。「今日」という情報を1つ加えてください。",
    "en": "The small meeting room is the reason for using a different room. Add one piece of information: “today.”",
    "zh": "会议室小是使用另一个房间的原因。请补充“今天”这一条时间信息。"
  },
  "새 상황이에요. 예문 없이, 두 사실을 이번에 연습한 이유 연결 형태로 한 문장에 담아 보세요.": {
    "ko": "처음 보는 상황이에요. 예문 없이 두 사실을 한 문장으로 써요. 이번에 연습한 이유 잇는 말을 써 보세요.",
    "ja": "初めて見る場面です。例文を見ずに、2つの事実を1文にします。今回練習した、理由をつなぐ言い方を使いましょう。",
    "en": "This is a new situation. Write the two facts as one sentence without an example. Use the way of linking a reason that you practiced.",
    "zh": "这是第一次见到的情境。不看例句，把两个事实写成一句话。用这次练习过的理由连接表达。"
  },
  "공원이 넓어요.": {
    "ko": "공원이 넓어요.",
    "ja": "公園が広いです。",
    "en": "The park is spacious.",
    "zh": "公园很宽敞。"
  },
  "여기에서 산책해요.": {
    "ko": "여기에서 산책해요.",
    "ja": "ここで散歩します。",
    "en": "I take a walk here.",
    "zh": "我在这里散步。"
  },
  "넓다": {
    "ko": "넓다",
    "ja": "広い",
    "en": "to be wide; to be spacious",
    "zh": "宽；宽敞"
  },
  "산책하다": {
    "ko": "산책하다",
    "ja": "散歩する",
    "en": "to take a walk",
    "zh": "散步"
  },
  "「ここ」はこの公園です。広いことが、ここで散歩する理由です。": {
    "ko": "여기서 말하는 장소는 이 공원이에요. 넓다는 것이 그곳에서 산책하는 이유예요.",
    "ja": "「ここ」はこの公園です。広いことが、ここで散歩する理由です。",
    "en": "“Here” means this park. The park is spacious. That is the reason for walking here.",
    "zh": "“这里”指这个公园。宽敞是在这里散步的原因。"
  },
  "의자가 편해요.": {
    "ko": "의자가 편해요.",
    "ja": "いすは座り心地がいいです。",
    "en": "The chair is comfortable.",
    "zh": "椅子很舒服。"
  },
  "여기에 앉아요.": {
    "ko": "여기에 앉아요.",
    "ja": "ここに座ります。",
    "en": "I sit here.",
    "zh": "我坐在这里。"
  },
  "의자": {
    "ko": "의자",
    "ja": "いす",
    "en": "chair",
    "zh": "椅子"
  },
  "편하다": {
    "ko": "편하다",
    "ja": "快適だ",
    "en": "to be comfortable",
    "zh": "舒服"
  },
  "앉다": {
    "ko": "앉다",
    "ja": "座る",
    "en": "to sit",
    "zh": "坐"
  },
  "「ここ」はそのいすです。いすが快適なことが、ここに座る理由です。": {
    "ko": "여기서 말하는 자리는 그 의자예요. 편안하다는 것이 그 자리에 앉는 이유예요.",
    "ja": "「ここ」はそのいすです。いすが快適なことが、ここに座る理由です。",
    "en": "“Here” means that chair. The chair is comfortable. That is the reason for sitting here.",
    "zh": "“这里”指那把椅子。椅子舒适是坐在这里的原因。"
  },
  "최근에 장소나 행동을 선택한 이유 하나를 이번에 연습한 형태로 한 문장에 써 보세요. 개인 이야기를 쓰고 싶지 않으면 아래 가상 상황을 써도 좋아요.": {
    "ko": "최근에 왜 그 장소나 행동을 골랐는지 한 문장으로 써요. 이번에 배운 이유 잇는 말을 써 보세요. 개인 이야기를 쓰기 싫으면 아래 가상 상황을 써도 좋아요.",
    "ja": "最近、なぜその場所や行動を選んだのか、1文で書きます。今回学んだ、理由をつなぐ言い方を使いましょう。自分の話を書きたくなければ、下の架空の場面でもかまいません。",
    "en": "Write one sentence about why you recently chose a place or action. Use the way of linking a reason that you learned. If you prefer not to share a personal story, use the fictional situation below.",
    "zh": "用一句话写最近为什么选择某个地点或行动。用这次学过的理由连接表达。如果不想分享个人经历，可以用下面的虚构情境。"
  },
  "가상 상황: 카페가 조용해요.": {
    "ko": "가상 상황: 카페가 조용해요.",
    "ja": "架空の場面：カフェは静かです。",
    "en": "Fictional situation: the café is quiet.",
    "zh": "虚构情境：咖啡馆很安静。"
  },
  "그곳에서 책을 읽어요.": {
    "ko": "그곳에서 책을 읽어요.",
    "ja": "そこで本を読みます。",
    "en": "I read a book there.",
    "zh": "我在那里看书。"
  },
  "카페": {
    "ko": "카페",
    "ja": "カフェ",
    "en": "café",
    "zh": "咖啡馆"
  },
  "읽다": {
    "ko": "읽다",
    "ja": "読む",
    "en": "to read",
    "zh": "读"
  },
  "架空の場面では、静かなことがそのカフェで本を読む理由です。別の自分の場面でもかまいません。": {
    "ko": "가상 상황에서는 조용하다는 것이 그 카페에서 책을 읽는 이유예요. 다른 본인만의 상황을 써도 괜찮아요.",
    "ja": "架空の場面では、そのカフェが静かなことが本を読む理由です。自分の別の場面を使ってもかまいません。",
    "en": "In the made-up situation, the café is quiet. That is the reason for reading there. You can use a different situation from your own life.",
    "zh": "在虚构场景中，安静是在那家咖啡馆读书的原因。也可以使用你自己的其他场景。"
  },
  "다른 날의 새 상황이에요. 예문을 열기 전에, 두 사실을 이번에 연습한 이유 연결 형태로 한 문장에 써 보세요.": {
    "ko": "다른 날 처음 보는 상황이에요. 예문을 열기 전에 두 사실을 한 문장으로 써요. 이번에 연습한 이유 잇는 말을 써 보세요.",
    "ja": "別の日に初めて見る場面です。例文を開く前に、2つの事実を1文にします。今回練習した、理由をつなぐ言い方を使いましょう。",
    "en": "This is a new situation on another day. Before opening any examples, write the two facts as one sentence. Use the way of linking a reason that you practiced.",
    "zh": "这是另一天第一次见到的情境。打开例句前，把两个事实写成一句话。用这次练习过的理由连接表达。"
  },
  "영화가 재미있어요.": {
    "ko": "영화가 재미있어요.",
    "ja": "映画がおもしろいです。",
    "en": "The movie is interesting.",
    "zh": "电影很有趣。"
  },
  "다시 봐요.": {
    "ko": "다시 봐요.",
    "ja": "もう一度見ます。",
    "en": "I watch it again.",
    "zh": "我再看一遍。"
  },
  "재미있다": {
    "ko": "재미있다",
    "ja": "おもしろい",
    "en": "to be interesting; to be fun",
    "zh": "有趣"
  },
  "다시": {
    "ko": "다시",
    "ja": "もう一度",
    "en": "again",
    "zh": "再次"
  },
  "映画がおもしろいことが、もう一度見る理由です。": {
    "ko": "영화가 재미있다는 것이 다시 보는 이유예요.",
    "ja": "映画がおもしろいことが、もう一度見る理由です。",
    "en": "The movie is enjoyable. That is the reason for watching it again.",
    "zh": "电影有趣是再看一次的原因。"
  },
  "날씨가 맑아요.": {
    "ko": "날씨가 맑아요.",
    "ja": "よく晴れています。",
    "en": "The weather is clear.",
    "zh": "天气晴朗。"
  },
  "밖에서 운동해요.": {
    "ko": "밖에서 운동해요.",
    "ja": "外で運動します。",
    "en": "I exercise outside.",
    "zh": "我在外面运动。"
  },
  "맑다": {
    "ko": "맑다",
    "ja": "晴れている",
    "en": "to be clear (weather)",
    "zh": "晴朗"
  },
  "밖": {
    "ko": "밖",
    "ja": "外",
    "en": "outside",
    "zh": "外面"
  },
  "운동하다": {
    "ko": "운동하다",
    "ja": "運動する",
    "en": "to exercise",
    "zh": "运动"
  },
  "晴れていることが、外で運動する理由です。": {
    "ko": "맑은 날씨가 밖에서 운동하는 이유예요.",
    "ja": "晴れていることが、外で運動する理由です。",
    "en": "Clear weather is the reason for exercising outside.",
    "zh": "晴朗的天气是在户外运动的原因。"
  },
  "쓸 시간이 있어요.": {
    "ko": "쓸 시간이 있어요.",
    "ja": "使える時間があります。",
    "en": "I have time available.",
    "zh": "我有可用的时间。"
  },
  "쓸 시간이 없어요.": {
    "ko": "쓸 시간이 없어요.",
    "ja": "使える時間がありません。",
    "en": "I have no time available.",
    "zh": "我没有可用的时间。"
  },
  "영화를 보지 않았어요.": {
    "ko": "영화를 보지 않았어요.",
    "ja": "映画を見ませんでした。",
    "en": "I did not watch the movie.",
    "zh": "我没有看电影。"
  },
  "영화를 보지 못했어요.": {
    "ko": "영화를 보지 못했어요.",
    "ja": "映画を見ることができませんでした。",
    "en": "I could not watch the movie.",
    "zh": "我没能看电影。"
  },
  "文を読んで意味を選びましょう。": {
    "ko": "문장을 읽고 뜻을 골라 보세요.",
    "ja": "文を読んで意味を選びましょう。",
    "en": "Read the sentence and choose its meaning.",
    "zh": "读句子，选择它的意思。"
  },
  "사실의 원인과 결과를 한 문장으로": {
    "ko": "이유와 결과를 한 문장으로 쓰기",
    "ja": "理由と結果を1文にする",
    "en": "Write the reason and result in one sentence",
    "zh": "把理由和结果写成一句话"
  },
  "자동 확인 범위에서 ‘지금 도서관에서 공부하는 일’을 나타내는 문장을 찾지 못했어요. 문장 전체를 다시 읽어 보세요. 다른 자연스러운 표현일 수도 있어요.": {
    "ko": "자동 확인 범위에서 ‘지금 도서관에서 공부하는 일’을 나타내는 문장을 찾지 못했어요. 문장 전체를 다시 읽어 보세요. 다른 자연스러운 표현일 수도 있어요.",
    "ja": "自動確認の範囲では、「今、図書館で勉強していること」を表す文を確認できませんでした。文全体を読み直してみましょう。別の自然な表現である可能性もあります。",
    "en": "The automatic check could not match a sentence about studying at the library now. Reread the whole sentence. Another natural expression may also work.",
    "zh": "自动检查未能识别出“现在在图书馆学习”的句子。请再读一遍完整句子，也可能是另一种自然的表达。"
  },
  "공부하다를 해요체로 써 보세요.": {
    "ko": "이전 자동 확인은 일부 표현만 찾았어요. 다른 자연스러운 표현도 있을 수 있어요.",
    "ja": "以前の自動確認では、一部の表現だけを確認していました。別の自然な表現もありえます。",
    "en": "The earlier automatic check recognized only a limited set of expressions. Other natural expressions may also work.",
    "zh": "之前的自动检查只识别部分表达，也可能存在其他自然的表达。"
  }
};
  Object.values(catalog).forEach(Object.freeze);
  window.HARUMAL_WRITING_CONTENT_I18N = Object.freeze(catalog);
}());
