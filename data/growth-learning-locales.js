/* Authored instructional translations keyed by stable lesson/task IDs.
 * Korean learning material and answer keys remain in growth-learning.js.
 * Missing non-Korean guidance is reported explicitly, never replaced with Korean. */
(function(root){
'use strict';
const D=typeof module!=='undefined'&&module.exports?require('./growth-learning.js'):root.HARUMAL_GROWTH_DATA;
const languages=['ko','ja','en','zh'];
const recipes={
meaning:{
 title:['案内文の言葉と対象の限定','Words and limits in a notice','通知中的词语与范围限制'],
 goal:['言葉と助詞を手がかりに、誰が条件を満たすか判断します。','Use vocabulary and particles to decide who meets a condition.','根据词语和助词，判断谁符合条件。'],
 rule:['分からない言葉を確認 → 対象を探す →「만」が対象をどう限定するか考えます。','Check unfamiliar words, identify the people concerned, then see how 만 narrows the group.','先查清不懂的词，再找出对象，最后看“만”如何缩小范围。'],
 transferScope:['新しい文脈で「만」の限定の働きを確かめます。「이수자」を新しい文脈でも理解できると示すものではありません。','This checks the limiting function of 만 in a new context. It does not show that you understand 이수자 in a new context.','本题检验你能否在新情境中理解“만”的限制作用，不代表你能在新情境中理解“이수자”。']},
grammar:{
 title:['-지만 と -아서 を使い分ける','Contrast or cause','区分 -지만 与 -아서'],
 goal:['前後が対照的な内容なのか、理由と結果なのかを見分けます。','Distinguish a contrast from a cause-and-result relationship.','区分前后内容是转折关系，还是原因与结果。'],
 rule:['対照的な内容は「-지만」、原因と結果は「-아서/어서」でつなぎます。','Use -지만 for contrast and -아서/어서 for cause and result.','用“-지만”连接转折内容，用“-아서/어서”连接原因与结果。']},
listening:{
 title:['変更後の時刻を聞き取る','Listen for a changed time','听清更改后的时间'],
 goal:['最初に聞こえた数字と、最後に確定した案内を区別します。','Distinguish the first number you hear from the final announcement.','区分最先听到的数字和最后确认的信息。'],
 rule:['すべての時刻を覚えようとせず、「아니고 / 늦어져서」などの後にある最終情報を聞き取ります。','Listen for the final information after correction or delay cues such as 아니고 / 늦어져서, rather than trying to remember every time.','不用记住所有时间，重点听“아니고 / 늦어져서”等更正或延迟提示之后的最终信息。']},
conditions:{
 title:['二つの条件を合わせて確認','Check both conditions','同时核对两个条件'],
 goal:['一つだけ満たす人と、すべて満たす人を区別します。','Separate people who meet only one condition from those who meet all the conditions.','区分只满足一个条件和满足全部条件的人。'],
 rule:['条件を一つずつ確認し、すべて満たす人だけを同じグループに入れます。','Check each condition separately, then group only the people who meet all of them together.','先逐一核对条件，再把满足全部条件的人归为一组。']},
gist:{
 title:['中心となる考えと根拠をつなぐ','Main idea and evidence','连接中心思想与依据'],
 goal:['一つの例だけでなく、文章全体が伝える考えを見つけます。','Find what the whole passage says, rather than focusing on one example.','寻找全文要表达的意思，而不是只关注一个例子。'],
 rule:['何を勧めたり主張したりしているかを先に見つけ、その考えを支える文を選びます。','First identify the recommendation or claim, then choose the sentence that supports it.','先找出文章的建议或主张，再选择支持这个观点的句子。']},
inference:{
 title:['文章の手がかりに基づいて推論','Ground an inference','根据文章线索推断'],
 goal:['明言されていないことを手がかりから推測し、言い過ぎないようにします。','Infer what is not stated directly from clues, without overstating what they show.','根据线索推断未直接说明的内容，但不要过度推断。'],
 rule:['確かな手がかり → 最も自然な推論。文章にない理由や感情は付け加えません。','Start from a definite clue and choose the closest inference. Do not add reasons or emotions that the passage does not support.','从明确线索出发，选择最贴近线索的推断，不添加文章没有依据的原因或情绪。']},
order:{
 title:['順序の手がかりで文をつなぐ','Put the steps in order','根据顺序线索排列句子'],
 goal:['先に必要な行動とその結果を、時間の順に並べます。','Put prerequisite actions and their results in time order.','把必须先做的行动和其结果按时间顺序排列。'],
 rule:['最初の行動 → 次の行動 → 仕上げ。「그 뒤 / 마지막」などの順序を示す言葉を確認します。','First action, next action, then the final step. Check sequence markers such as 그 뒤 / 마지막.','按开始、接着、最后的顺序，注意“그 뒤 / 마지막”等连接词。']},
insertion:{
 title:['文を入れる位置を探す','Find the missing sentence’s place','寻找句子的插入位置'],
 goal:['前の内容を受ける表現と、その後の結果を合わせて確認します。','Check both the backward reference and the result that follows.','同时核对承接前文的表达和后文的结果。'],
 rule:['挿入する文の「그것 / 하지만」などが受ける前の内容を探し、後ろの文とも続けて読んでみます。','Identify the earlier material that expressions such as 그것 / 하지만 refer or respond to, then read on into the following sentence.','找到插入句中“그것 / 하지만”等表达所承接的前文，再连着后一句读一遍。']},
table:{
 title:['表の比較対象をそろえる','Compare the right table values','对齐表格中的比较对象'],
 goal:['行と単位を確認してから、差や条件を考えます。','Match the rows and units before calculating differences or checking conditions.','先对齐行和单位，再计算差值、核对条件。'],
 rule:['何の数値か → 単位 → どちらとどちらをどう比較するか、の順に確認します。','Check what each value measures, its unit, and the direction of the comparison.','依次确认数值所指、单位和比较方向。']},
writing:{
 title:['「-고 싶어요」で一文を書く','Build one constrained sentence','用“-고 싶어요”写一句话'],
 goal:['指定された意味と単語で、希望を表す文を作ります。','Use the supplied meaning and words to write a sentence expressing a wish.','根据给定的意思和词语，写出表达愿望的句子。'],
 rule:['動詞の語幹に「-고 싶어요」を付け、したいことを言います。目的地には「에」を使います。','Add -고 싶어요 to a verb stem to say what you want to do. Use 에 for the destination.','在动词词干后加“-고 싶어요”表达想做的事，目的地后用“에”。']},
travel:{
 title:['旅行で必要な情報を尋ねる','Ask and follow up on a trip','旅行中询问信息并继续追问'],
 goal:['目的に合う質問をし、相手の答えに応じて次の質問を続けます。','Ask a question that fits your goal, then follow up based on the answer.','根据目的提问，再根据对方的回答继续询问。'],
 rule:['必要な情報を一つ尋ねる → 得られた情報に合う追加の質問をします。','Ask for one piece of information, then ask a relevant follow-up question.','先询问一项需要的信息，再根据获得的信息追问。']}
};
const tasks={
'GL-MEAN-L':{
 prompt:['案内に従って入場できる人を選びましょう。','Choose who may enter under this notice.','根据通知，选择可以入场的人。'],
 hint:['二人の行動が「申込み」なのか「修了」なのかを比べましょう。','Compare whether each person has only applied or has completed the course.','比较两个人是仅报名，还是已经完成课程。'],
 retry:['申し込んだだけでは教育を修了したことにはなりません。案内の条件と実際の行動を結び付けましょう。','Applying does not mean completing the course. Match the condition in the notice to what each person has actually done.','报名不等于完成课程。把通知的条件与实际行动对应起来。'],
 explain:['민지 は教育を終えたので「이수자（修了者）」です。「만」が対象を限定するため、申込みだけの 준호 は入場できません。','민지 has completed the course, so she is an 이수자. The limiting particle 만 excludes 준호, who has only applied.','민지 已完成课程，因此属于“이수자”（修完课程的人）。“만”限制了范围，所以仅报名的 준호 不能入场。'],
 'tokens.isoo':['이수자 は、決められた教育課程を修了した人です。申込みだけの状態とは異なります。','An 이수자 is someone who has completed a specified course of education. Merely applying is different.','“이수자”指完成规定课程的人，与仅报名的状态不同。'],
 'tokens.man':['「만」は、その前の対象だけに範囲を限定します。その条件に当てはまらない人は含めません。','만 limits the scope to the people or things immediately before it. People outside that condition are excluded.','“만”把范围限定在它前面的对象，不包括不符合该条件的人。']},
'GL-MEAN-T':{
 prompt:['今回の展示に入場できるのは誰ですか。','Who can enter this exhibition?','谁可以进入这次展览？'],
 hint:['頭の中の予定と、完了した予約を区別しましょう。','Distinguish a plan to book from a completed reservation.','区分打算预约和已经完成预约。'],
 retry:['「할 생각」は、まだ予約を終えたことを意味しません。今日の入場条件を満たす人を探しましょう。','할 생각 describes an intention, not a completed reservation. Find who meets the condition for entering today.','“할 생각”只是打算，尚未完成预约。找出符合今天入场条件的人。'],
 explain:['소라 は予約が完了しています。「이수자」から「예약자」に語が変わっても、「만」の限定の働きは同じです。','소라 has a completed reservation. The noun changes from 이수자 to 예약자, but 만 still has the same limiting function.','소라 已完成预约。虽然名词从“이수자”变成了“예약자”，“만”仍发挥相同的限制作用。'],
 'tokens.yeyak':['예약자 は、事前に申し込み、予約が完了した人です。','A 예약자 is someone whose advance reservation has been completed.','“예약자”指事先申请并已完成预约的人。'],
 'tokens.man':['前の語に当てはまる人だけに範囲を限定します。','It narrows the group to people who match the preceding word.','把范围缩小为符合前面词语所指条件的人。']},
'GL-GRAM-L':{
 text:['つなぐ表現によって、二つの文の関係が変わります。','The connector changes the relationship between the two clauses.','连接表达不同，两个分句之间的关系也会不同。'],
 prompt:['それぞれの文に合う表現を選びましょう。','Choose the appropriate connector for each sentence.','为每个句子选择合适的表达。'],
 'rows.contrast.context':['雨で散歩に行けないと思っていましたが、予想とは違いました。','You expected the rain to stop you from going for a walk, but the outcome was different.','原以为下雨就不能散步，但结果与预期不同。'],
 'rows.cause.context':['道が混んでいたことが、遅れた理由です。','Traffic congestion is the reason for being late.','道路拥堵是迟到的原因。'],
 hint:['雨なのに散歩に行ったのは、予想に反する関係です。道が混んでいたのは、遅れた理由です。','Walking despite the rain contrasts with the expectation. Traffic congestion is the reason for being late.','下雨却去散步，与预期相反；道路拥堵则是迟到的原因。'],
 retry:['二つを同じ基準で選ばず、それぞれが「対照」か「理由」かを確認しましょう。','Do not choose both connectors by the same rule. Check which sentence expresses contrast and which gives a reason.','不要按同一种关系选择两个连接词，分别确认是转折还是原因。'],
 explain:['「비가 오지만」は対照を、「길이 막혀서」は遅れた原因を表します。','비가 오지만 expresses contrast; 길이 막혀서 gives the cause of being late.','“비가 오지만”表示转折，“길이 막혀서”说明迟到的原因。']},
'GL-GRAM-T':{
 text:['今度は授業と天気についての文です。','This time the sentences are about a class and the weather.','这次的句子与课程和天气有关。'],
 prompt:['新しい文の関係を読み取り、二つの空欄を埋めましょう。','Read the relationship in each new sentence and fill both gaps.','读懂新句子中的关系，填好两个空。'],
 'rows.contrast.context':['難しい授業は面白くないと思っていましたが、予想とは違いました。','You expected a difficult class to be uninteresting, but the outcome was different.','原以为难的课程会无趣，但结果与预期不同。'],
 'rows.cause.context':['窓を閉めた理由は、寒い天気です。','The cold weather is the reason for closing the window.','天气寒冷是关窗的原因。'],
 hint:['難しさと面白さは対照的に述べられ、寒さは窓を閉めた理由です。','Difficulty and enjoyment are presented as a contrast. The cold weather is the reason for closing the window.','难度与趣味在这里构成转折，寒冷的天气则是关窗的原因。'],
 retry:['「なぜ窓を閉めましたか」に答える前半部分を探しましょう。','Find the first clause that answers “Why did you close the window?”','找出能回答“为什么关窗？”的前半句。'],
 explain:['「어렵지만」は対照を表し、「추워서」は原因と結果をつなぎます。','어렵지만 expresses contrast, while 추워서 connects a cause to its result.','“어렵지만”表示转折，“추워서”连接原因与结果。']},
'GL-LIST-L':{
 prompt:['案内を聞き、授業の開始時刻を選びましょう。','Listen to the announcement and choose the class start time.','听通知，选择上课时间。'],
 hint:['「아니고」の前の情報は訂正されています。その後の時刻を聞きましょう。','The information before 아니고 is being corrected. Listen to the time after it.','“아니고”前面的信息被更正了，请听后面的时间。'],
 retry:['最初の数字をすぐ選ばず、変更後の時刻まで聞きましょう。','Do not select the first number immediately. Listen through to the corrected time.','不要马上选择最先听到的数字，要听到更正后的时间。'],
 explain:['「두 시가 아니고 세 시」と、2時から3時に訂正されました。「이 층」は教室の階です。','두 시가 아니고 세 시 corrects two o’clock to three o’clock. 이 층 is the classroom floor, not a time.','“두 시가 아니고 세 시”把两点更正为三点。“이 층”指教室所在的二楼，不是时间。']},
'GL-LIST-T':{
 prompt:['新しい案内から、実際の出発時刻を選びましょう。','Choose the actual departure time in the new announcement.','根据新通知，选择实际出发时间。'],
 hint:['当初の予定ではなく、最後に確認された出発時刻を聞きましょう。','Listen for the final confirmed departure time, rather than the original plan.','听最后确认的出发时间，而不是原定时间。'],
 retry:['「예정이었지만」の後の変更内容をもう一度聞きましょう。','Listen again to the change described after 예정이었지만.','再听一遍“예정이었지만”之后的变更内容。'],
 explain:['10時は以前の予定です。30分遅れた最終の出発時刻は10時30分です。','Ten o’clock was the original plan. The final time, delayed by thirty minutes, is ten thirty.','十点是原定时间。延迟三十分钟后，最终出发时间是十点半。']},
'GL-COND-L':{
 prompt:['三人を「参加できる／まだ参加できない」に分けましょう。','Sort the three people into “eligible” and “not yet eligible.”','把三个人分为“可参加”和“暂不可参加”。'],
 hint:['この学校の学生であることと、申込み済みであることの両方が必要です。','Both boxes must be checked: attending this school and having completed the application.','必须同时满足本校学生和已完成报名这两个条件。'],
 retry:['一つだけ条件を満たせば参加できるのか、もう一度確認しましょう。','Check again whether meeting just one condition is enough to participate.','再确认一下：只满足一个条件就能参加吗？'],
 explain:['学生であり、申込みも完了しているのは 민수 だけです。','Only 민수 meets both conditions: being a student at this school and having completed the application.','只有 민수 同时满足本校学生和已完成报名两个条件。']},
'GL-COND-T':{
 prompt:['新しい施設の二つの条件に照らして、利用できるか分けましょう。','Use both conditions for this new place to sort who may use it.','按照新场所的两个条件，判断谁可以使用。'],
 hint:['身につける物と、安全教育を受けたかどうかは別々の条件です。','The required footwear and completed safety training are two separate conditions.','所穿鞋子与是否完成安全教育，是两个不同的条件。'],
 retry:['どちらか一つの条件が欠けている人を探しましょう。','Find anyone who is missing either of the two conditions.','找出缺少任意一个条件的人。'],
 explain:['運動靴を履き、安全教育も修了しているのは 아라 だけです。','Only 아라 meets both conditions: wearing trainers and having completed safety training.','只有 아라 同时满足穿运动鞋和已完成安全教育两个条件。']},
'GL-GIST-L':{
 prompt:['中心となる考えと、それを最も直接支える根拠を一つずつ選びましょう。','Choose one main idea and the piece of evidence that most directly supports it.','分别选择中心思想和最直接支持它的依据。'],
 hint:['「도움이 됩니다」が、何の効果について述べているか見ましょう。','Look at what action 도움이 됩니다 describes as helpful.','看看“도움이 됩니다”说的是哪种做法带来的效果。'],
 retry:['文章にない「長時間」や「聞かなくてよい」を加えず、勧める内容と理由をつなげましょう。','Do not add “for a long time” or “no need to listen,” which the passage does not say. Connect the recommendation to its reason.','不要添加原文没有的“很久”或“不用听”，把建议与理由对应起来。'],
 explain:['中心となる考えは短い予習の価値です。説明を理解しやすくなるという文が、その効果を直接支えています。','The main idea is the value of brief preparation. The sentence about understanding explanations more easily directly supports that benefit.','中心思想是简短预习的价值。“更容易理解讲解”直接说明了预习的效果。']},
'GL-GIST-T':{
 prompt:['新しい文章の中心となる考えと、直接の根拠を選びましょう。','Choose the main idea of the new passage and its direct supporting evidence.','选择新文章的中心思想和直接依据。'],
 hint:['水筒を持ち歩くことの、具体的な効果を探しましょう。','Find the specific effect of carrying a reusable water bottle.','找出随身带水瓶的具体效果。'],
 retry:['関係のない生活上の助言を選ばないよう、文章の根拠に戻りましょう。','Return to the passage’s evidence instead of choosing unrelated lifestyle advice.','回到文章的依据，不要选择与主题无关的生活建议。'],
 explain:['自分の水筒を使うと、新しいプラスチックボトルの使用が減ります。これが、ごみを減らせるという中心の考えを支えます。','Using your own bottle reduces the use of new plastic bottles. This supports the main idea that carrying a bottle can reduce waste.','使用自己的水瓶能减少新塑料瓶的使用，这支持了“准备水瓶可以减少垃圾”的中心思想。']},
'GL-INFER-L':{
 prompt:['最も自然な推論と、それを支える手がかりを選びましょう。','Choose the most natural inference and the clue that supports it.','选择最自然的推断和支持它的线索。'],
 hint:['持って行った物の用途から、最も自然に考えられることを推測しましょう。','Make the closest reasonable inference from the purpose of the object she took.','根据带走物品的用途，作出最贴近线索的合理推断。'],
 retry:['嫌だという気持ちや台風は書かれていません。具体的な行動の手がかりを選びましょう。','The passage does not mention reluctance or a typhoon. Choose a clue based on the specific action.','文章没有提到不愿意的情绪或台风，请选择具体行动所提供的线索。'],
 explain:['傘を持った行動は、雨に備えたという推論を支えます。ただし、実際に雨が降ったとまでは断定できません。','Taking an umbrella supports the inference that she prepared for possible rain. It does not prove that it actually rained.','带伞支持“为可能下雨作准备”的推断，但不能据此确定实际下雨了。']},
'GL-INFER-T':{
 prompt:['新しい場面の推論と根拠を結び付けましょう。','Connect an inference about the new scene to its evidence.','把新情境中的推断与依据对应起来。'],
 hint:['音を減らす二つの行動に共通する目的を考えましょう。','Think of the shared purpose of the two actions that reduce noise.','想一想两个减少声音的行为有什么共同目的。'],
 retry:['故障や感情を示す手がかりはありません。行動から確かめられる範囲に絞りましょう。','There is no clue about a broken phone or emotions. Limit the inference to what the actions support.','没有线索说明手机故障或情绪变化，请把推断限制在行动所支持的范围内。'],
 explain:['消音と通話の終了は、静かに利用するという目的を支えます。준호 の感情までは分かりません。','Muting the phone and ending the call support the goal of using the library quietly. They do not tell us how 준호 felt.','静音和结束通话支持“安静使用图书馆”的目的，但无法据此知道 준호 的情绪。']},
'GL-ORDER-L':{
 text:['初めて利用する図書館で本を借りる手順です。','These are the steps for borrowing a book from a library for the first time.','这是首次在图书馆借书的步骤。'],
 prompt:['文を順に押して、最初から最後までの流れを作りましょう。','Tap the sentences to arrange the sequence from start to finish.','依次点击句子，排出从开始到结束的顺序。'],
 hint:['「먼저」で始まる文を探し、図書館カードがいつ必要か考えましょう。','Find the sentence starting with 먼저 and think about when the library card is needed.','找到以“먼저”开头的句子，再想想什么时候需要借书证。'],
 retry:['登録する前に、図書館カードで本を借りられるでしょうか。','Can you borrow a book with a library card before registering?','在注册之前，能使用借书证借书吗？'],
 explain:['登録 → 借りる → 返却日の確認、の順です。「먼저」「그다음」「마지막으로」が手がかりです。','The order is registration, borrowing, then checking the return date. 먼저, 그다음 and 마지막으로 are the sequence clues.','顺序是注册、借书、确认归还日期。“먼저”“그다음”“마지막으로”是顺序线索。']},
'GL-ORDER-T':{
 text:['アプリで列車の切符を買う手順です。','These are the steps for buying a train ticket in an app.','这是在应用中购买火车票的步骤。'],
 prompt:['必要な情報と行動を順番に並べましょう。','Arrange the required information and actions in order.','按顺序排列所需信息和行动。'],
 hint:['「결제가 끝나면」は、支払いの後に来ます。','결제가 끝나면 means “when payment is complete,” so it comes after paying.','“결제가 끝나면”表示付款完成后，因此必须放在付款之后。'],
 retry:['保存する乗車券は、どの行動が終わってから手に入りますか。','Which action must finish before you have a ticket to save?','要完成哪项行动后，才会有可以保存的车票？'],
 explain:['駅の入力と時刻の検索 → 支払い → 乗車券の保存、の順です。','The order is entering the stations and finding a departure time, paying, then saving the ticket.','顺序是输入车站并查询时间、付款、保存车票。']},
'GL-INSERT-L':{
 prompt:['挿入する文が自然につながる位置を選びましょう。','Choose the position where the inserted sentence fits naturally.','选择插入句衔接最自然的位置。'],
 hint:['「그래서」の前に、公園での予定が変わった理由が必要です。','The reason the park plan changed must come before 그래서.','“그래서”前需要先说明去公园的计划为何改变。'],
 retry:['「그래서 집에서」の理由が先に来るよう、続けて読んでみましょう。','Read through so that the reason comes before 그래서 집에서.','连起来读，让“그래서 집에서”的原因先出现。'],
 explain:['公園での約束の後、家で映画を見たという結果の前に入れます。雨で予定が変わったというつながりができます。','Insert it after the plan to meet at the park and before the result of watching a film at home. The rain explains the change of plan.','插在约好去公园之后、在家看电影的结果之前，雨就成为计划改变的原因。']},
'GL-INSERT-T':{
 prompt:['「이 책」が指すものと、その後の結果を考えて位置を選びましょう。','Choose a position by checking what 이 책 refers to and what result follows.','想清楚“이 책”指什么以及后文的结果，再选择位置。'],
 hint:['「이 책」は、前に紹介された特定の本を指す必要があります。','이 책 must refer back to a particular book already introduced.','“이 책”必须指向前文已介绍的某一本书。'],
 retry:['絵本を紹介する前に「이 책」と言うと、何の本か分かりません。','If 이 책 appears before the picture book is introduced, its reference is unclear.','在介绍绘本之前就说“이 책”，指代对象会不明确。'],
 explain:['絵本をもらった後に、読みやすかった理由が続き、そのおかげで自信を得たという結果につながります。','The picture book is introduced first, then its helpful feature is explained, followed by the result of gaining confidence.','先收到绘本，再说明它为什么容易读懂，最后衔接因此获得自信的结果。']},
'GL-TABLE-L':{
 prompt:['表を読んで、二つの比較を完成させましょう。','Read the table and complete both comparisons.','阅读表格，完成两个比较。'],
 'rows.greater.text':['土曜日は、どちらの時間帯の利用者が多いですか。','On Saturday, which time period has more visitors?','星期六哪个时段的使用人数更多？'],
 'rows.difference.text':['日曜日の午前は、土曜日の午前より何人多いですか。','How many more visitors are there on Sunday morning than on Saturday morning?','星期日上午比星期六上午多多少人？'],
 hint:['最初は土曜日の二つの欄、次は両日の午前の欄を比べます。','For the first comparison, use the two Saturday cells. For the second, compare the morning cells for both days.','第一个比较看星期六的两个单元格，第二个比较看两天的上午数据。'],
 retry:['曜日と時間帯が比較対象に合っているか、先に確認しましょう。','First check that the two cells match the intended days and time periods.','先确认两个单元格的日期和时段是否与比较要求一致。'],
 explain:['土曜日は午後35人で、午前20人より多くなっています。日曜午前30人は、土曜午前20人より10人多いです。','Saturday afternoon has 35 visitors, more than the morning’s 20. Sunday morning has 30, which is 10 more than Saturday morning’s 20.','星期六下午35人，比上午20人多。星期日上午30人，比星期六上午20人多10人。']},
'GL-TABLE-T':{
 prompt:['価格表で、新しい二つの比較を完成させましょう。','Complete the new comparisons using the price table.','根据价格表完成新的比较。'],
 'rows.cheaper.text':['ジュースが安いのは、どちらの店ですか。','Which café has the cheaper juice?','哪家咖啡店的果汁更便宜？'],
 'rows.difference.text':['나 カフェで、お茶はジュースよりいくら高いですか。','At 나 카페, how much more does tea cost than juice?','在 나 카페，茶比果汁贵多少？'],
 hint:['まずジュース同士を比べ、次に 나 カフェの一つの行で価格差を求めましょう。','Compare the juice prices first, then calculate the price difference within the 나 카페 row.','先比较两家的果汁价格，再在 나 카페 这一行内计算价差。'],
 retry:['単位がウォンであることと、比較する対象をもう一度確認しましょう。','Recheck the won unit and exactly which items you are comparing.','重新核对韩元单位，以及具体比较的是哪些对象。'],
 explain:['ジュースは 나 カフェの3,000ウォンが安いです。同店のお茶は3,500ウォンで、ジュースより500ウォン高いです。','Juice is cheaper at 나 카페 at 3,000 won. Its tea costs 3,500 won, which is 500 won more than its juice.','나 카페 的果汁为3,000韩元，更便宜。该店的茶为3,500韩元，比果汁贵500韩元。']},
'GL-WRITE-L':{
 prompt:['指定された意味で、一文を書きましょう。','Write one sentence with the supplied meaning.','按照给定的意思写一句话。'],
 hint:['「가다」から「다」を取り、「-고 싶어요」を付けます。場所には「에」を使います。','Remove 다 from 가다, then add -고 싶어요. Use 에 after the destination.','去掉“가다”的“다”，加上“-고 싶어요”，地点后用“에”。'],
 retry:['目的地の助詞「에」と「가고 싶어요」の形を確認しましょう。この練習では指定された文の限られた変形だけを確認します。','Check the destination particle 에 and the form 가고 싶어요. This exercise checks only a fixed set of sentence variants.','检查目的地助词“에”和“가고 싶어요”的形式。本练习只检查规定范围内的句子变形。'],
 explain:['例：공원에 가고 싶어요. 目的地「공원에」と、希望を表す「가고 싶어요」をつないでいます。','Example: 공원에 가고 싶어요. This joins the destination 공원에 to the wish expression 가고 싶어요.','例：공원에 가고 싶어요. 把目的地“공원에”和愿望表达“가고 싶어요”连接起来。']},
'GL-WRITE-T':{
 prompt:['目的地を変え、新しい文を自分で書きましょう。','Change the destination and write a new sentence yourself.','更换目的地，自己写出新句子。'],
 hint:['学んだ希望の表現を使い、目的地を変えましょう。','Keep the wish expression you learned and change the destination.','保留学过的愿望表达，更换目的地。'],
 retry:['도서관 の後の助詞と、希望の表現を確認しましょう。同じ意味の自由な回答をすべて採点する機能ではありません。','Check the particle after 도서관 and the wish expression. This does not grade every freely written answer with a similar meaning.','检查 도서관 后的助词和愿望表达。本功能不能为所有意思相近的自由回答评分。'],
 explain:['例：도서관에 가고 싶어요. 今回確認したのは、この条件付きの文の形です。自由作文の意味理解や習熟を判定したものではありません。','Example: 도서관에 가고 싶어요. This result checks the form of this constrained sentence; it does not assess semantic mastery in free writing.','例：도서관에 가고 싶어요. 本次结果只核对该限定句子的形式，不判定自由写作的语义掌握程度。']},
'GL-TRAVEL-L':{
 text:['ソウル駅に行くため、案内スタッフに道順を尋ねる場面です。','You want to get to Seoul Station and are asking an information-desk staff member for directions.','你想去首尔站，正在向咨询处工作人员问路。'],
 prompt:['最初の質問を選び、スタッフの答えに合わせて会話を続けましょう。','Choose your first question, then respond to the staff member’s answer.','选择第一个问题，再根据工作人员的回答继续说。'],
 'branches.route.prompt':['次に必要な情報を尋ねましょう。','Ask for the next piece of information you need.','询问接下来需要的信息。'],
 'branches.food.prompt':['元の目的に合うように、話を戻しましょう。','Bring the conversation back to your original goal.','把对话转回原来的目的。'],
 hint:['目的はソウル駅に行くことです。路線が分かったら、乗り場を確認しましょう。','The goal is to get to Seoul Station. Once you know the line, you need to know where to board.','目的是去首尔站。知道线路后，还需要确认乘车地点。'],
 retry:['話を戻すことはできますが、今回の目標は最初から移動の目的に合う質問をして、つなげることです。','You can recover the conversation, but this task’s goal is to ask about your travel goal from the start and follow up appropriately.','虽然可以把话题转回来，但本题目标是从一开始就围绕出行目的提问，并恰当地追问。'],
 explain:['目的地への路線を尋ね、「1호선」という答えを受けて乗り場を確認しました。','You asked which line goes to the destination, then used the answer 1호선 to ask where to board.','先询问去目的地的线路，再根据“1호선”的回答确认乘车地点。']},
'GL-TRAVEL-T':{
 text:['ホテルで明日の朝食を取るため、フロントで必要な情報を尋ねます。','You plan to have breakfast at the hotel tomorrow and are asking reception for the information you need.','你打算明天在酒店吃早餐，正在向前台询问需要的信息。'],
 prompt:['新しい場所でも、目的に合う最初の質問と追加の質問を選びましょう。','In the new setting, choose an initial question and a follow-up that both fit your goal.','在新场所中，选择符合目的的首个问题和后续问题。'],
 'branches.breakfast.prompt':['時間が分かりました。どこへ行くかも確認しましょう。','You know the time. Now check where to go.','已经知道时间了，再确认要去哪里。'],
 'branches.ticket.prompt':['朝食という元の目的に合わせて、聞き直しましょう。','Ask again about your original goal: breakfast.','围绕原来的早餐目的重新提问。'],
 hint:['朝食の時間が分かったら、ホテル内の食堂の場所を確認しましょう。','Once you know the breakfast time, check where the hotel restaurant is.','知道早餐时间后，确认酒店餐厅的位置。'],
 retry:['駅の切符とホテルの朝食情報は、別の目的です。最初の質問からつなぎ直しましょう。','Train tickets and hotel breakfast information serve different goals. Start again from the first question.','火车票和酒店早餐信息属于不同目的，请从第一个问题重新衔接。'],
 explain:['朝食の開始時刻を尋ね、次に食堂の場所を確認しました。実際の発音や自由な会話の能力を判定したものではありません。','You asked when breakfast starts, then followed up by asking where the restaurant is. This does not assess actual pronunciation or open-ended conversation ability.','先询问早餐开始时间，再追问餐厅位置。本题不判定实际发音或自由会话能力。']}
};
const meta={
 'difficulty.easy':['쉬움','やさしい','Easy','简单'],
 'difficulty.medium':['보통','ふつう','Medium','中等'],
 'difficulty.hard':['어려움','難しい','Hard','较难'],
 'difficulty.very_hard':['매우 어려움','とても難しい','Very hard','很难'],
 'label.meaning':['뜻','意味','Meaning','意思'],
 'label.words':['필수 낱말','必須の単語','Required words','必用词语'],
 'label.expression':['목표 표현','目標の表現','Target expression','目标表达'],
 'types.vocabulary-meaning':['낱말과 제한','言葉と限定','Words and limits','词语与限制'],
 'types.grammar-contrast':['대조와 원인','対照と原因','Contrast and cause','转折与原因'],
 'types.listening':['듣기','聞き取り','Listening','听力'],
 'types.condition-match':['조건 확인','条件の確認','Conditions','条件核对'],
 'types.gist-evidence':['중심 생각과 근거','中心の考えと根拠','Main idea and evidence','中心思想与依据'],
 'types.inference-evidence':['단서로 추론','手がかりから推論','Evidence-based inference','根据线索推断'],
 'types.sentence-order':['문장 순서','文の順序','Sentence order','句子排序'],
 'types.sentence-insertion':['문장 넣기','文の挿入','Sentence insertion','句子插入'],
 'types.table-comparison':['표 비교','表の比較','Table comparison','表格比较'],
 'types.constrained-writing':['조건 작문','条件付き作文','Constrained writing','限定写作'],
 'types.travel-dialogue':['여행 대화','旅行会話','Travel dialogue','旅行对话']
};
const entries={};
function add(id,field,ko,other){entries[`${id}.${field}`]=Object.freeze(Object.fromEntries(languages.map((lang,index)=>[lang,index===0?ko:other[index-1]])));}
if(D)for(const recipe of D.recipes){
 for(const field of ['title','goal','rule','transferScope'])if(recipe[field])add(recipe.id,field,recipe[field],recipes[recipe.id]?.[field]||[]);
 for(const phase of ['learn','transfer']){const q=recipe[phase],translated=tasks[q.id]||{};
  for(const field of ['prompt','hint','retry','explain'])add(q.id,field,q[field],translated[field]||[]);
  if(['pair','order','dialogue'].includes(q.kind))add(q.id,'text',q.text,translated.text||[]);
  for(const token of q.tokens||[])add(q.id,`tokens.${token.id}`,token.text,translated[`tokens.${token.id}`]||[]);
  for(const [id,branch] of Object.entries(q.branches||{}))add(q.id,`branches.${id}.prompt`,branch.prompt,translated[`branches.${id}.prompt`]||[]);
  if(q.kind==='table')for(const row of q.rows)add(q.id,`rows.${row.id}.text`,row.text,translated[`rows.${row.id}.text`]||[]);
  if(q.kind==='pair')for(const row of q.rows)add(q.id,`rows.${row.id}.context`,row.text.split('→')[0].trim(),translated[`rows.${row.id}.context`]||[]);
 }
}
for(const [field,values] of Object.entries(meta))add('meta',field,values[0],values.slice(1));
const missing=Object.freeze({ko:'이 안내의 번역을 준비하고 있어요.',ja:'この案内の翻訳は準備中です。',en:'The translation of this guidance is not available yet.',zh:'这条学习指导的翻译尚未提供。'});
function language(lang){return languages.includes(lang)?lang:'en';}
function get(id,field,lang='ko'){const selected=language(lang),value=entries[`${id}.${field}`]?.[selected];return typeof value==='string'&&value.trim()?value:missing[selected];}
const data=Object.freeze({version:1,languages:Object.freeze(languages),entries:Object.freeze(entries),missing,get});
if(typeof module!=='undefined'&&module.exports)module.exports=data;
root.HARUMAL_GROWTH_I18N=data;
})(typeof window!=='undefined'?window:globalThis);
