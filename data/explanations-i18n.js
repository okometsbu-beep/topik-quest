// MALBIT · reviewed inline explanations for Korean, Japanese, English, and Chinese.
(function(){
'use strict';

const T1_LISTENING={
1:{ja:'挨拶の「안녕하세요?」には、同じ挨拶を返すのが最も自然です。',en:'The most natural reply to the greeting “안녕하세요?” is the same greeting.',zh:'对“안녕하세요?”这一问候，最自然的回答是同样的问候。'},
2:{ja:'感謝された時は、「아니에요」のように「どういたしまして」の意味で答えるのが自然です。',en:'When someone thanks you, “아니에요” is a natural reply meaning that it was no trouble.',zh:'别人表示感谢时，用“아니에요”表示“不客气”最自然。'},
3:{ja:'週末に何をしたかを尋ねているので、過去の行動で答える必要があります。',en:'The question asks what the person did over the weekend, so the answer must describe a past action.',zh:'问题问周末做了什么，因此要用过去的行为来回答。'},
4:{ja:'飲み物を勧める質問には、「주세요」を使って受け取る意思を示せます。',en:'When someone offers a drink, “주세요” naturally accepts the offer.',zh:'对方提出要不要饮料时，可以用“주세요”自然地表示接受。'},
5:{ja:'通帳を作る場所は銀行です。',en:'A bank is the place where you open a bankbook or account.',zh:'办理存折的地方是银行。'},
6:{ja:'料理を注文する場所は食堂・レストランです。',en:'A restaurant is the place where people order food.',zh:'点餐的地方是餐厅。'},
7:{ja:'本を借りたり返したりする場所は図書館です。',en:'A library is where people borrow and return books.',zh:'借书和还书的地方是图书馆。'},
8:{ja:'髪を切る場所は美容院です。',en:'A hair salon is the place where people get their hair cut.',zh:'剪头发的地方是理发店。'},
9:{ja:'会話の最後に、二人は4時に会うことに決めました。',en:'At the end of the conversation, they agree to meet at four o’clock.',zh:'对话最后，两人约定四点见面。'},
10:{ja:'女性は朝、道が混むので地下鉄に乗ると言っています。',en:'The woman says she takes the subway in the morning because the roads are congested.',zh:'女方说早上堵车，所以乘地铁。'},
11:{ja:'今日は朝食にパンを食べ、牛乳を飲んだと言っています。',en:'She says that today she had bread and milk for breakfast.',zh:'她说今天早上吃了面包并喝了牛奶。'},
12:{ja:'男性は先週、新しい家に引っ越したと言っています。',en:'The man says he moved to a new home last week.',zh:'男方说自己上周搬到了新家。'},
13:{ja:'運動靴が小さいので、明日大きいサイズに交換する予定です。',en:'The sneakers are too small, so she plans to exchange them for a larger pair tomorrow.',zh:'运动鞋太小，所以她打算明天换成大一号的。'},
14:{ja:'男性は昨日から喉が痛いと言っています。',en:'The man says his throat has hurt since yesterday.',zh:'男方说从昨天开始嗓子疼。'},
15:{ja:'図書館の開館日と本の返却方法を案内しています。',en:'The announcement explains the library’s opening days and how to return books.',zh:'这段通知说明了图书馆的开放日和还书方法。'},
16:{ja:'道路工事のため21番バスが遅れているという案内です。',en:'The announcement says bus 21 is delayed because of road construction.',zh:'通知说由于道路施工，21路公交车晚点。'},
17:{ja:'土曜日の誕生日パーティーに来るよう招待しています。',en:'The speaker is inviting the listener to a birthday party on Saturday.',zh:'说话人邀请对方参加周六的生日聚会。'},
18:{ja:'置いておいた黒い傘がなくなったので探しています。',en:'The speaker is looking for a black umbrella that was left by the chair and is now missing.',zh:'说话人放在椅子旁的黑色雨伞不见了，正在寻找。'},
19:{ja:'釜山旅行でやりたいことと、列車の切符を予約する予定について話しています。',en:'She talks about what she wants to do in Busan and her plan to book a train ticket.',zh:'她谈到去釜山旅行想做的事，以及预订火车票的计划。'},
20:{ja:'規則的に歩くようになって、体調と睡眠がよくなったという内容です。',en:'The man says regular walking has made his body feel better and improved his sleep.',zh:'内容说明规律步行后，身体状态和睡眠都变好了。'},
21:{ja:'サンドイッチ1つと温かいアメリカーノ1杯を注文しました。',en:'She orders one sandwich and one hot Americano.',zh:'她点了一个三明治和一杯热美式咖啡。'},
22:{ja:'一人では学びにくいため、ほかの人と一緒に学びたいと言っています。',en:'He wants to learn with other people because learning alone is difficult.',zh:'因为一个人很难学好，所以他想和其他人一起学习。'},
23:{ja:'引っ越し日を金曜日から土曜日の朝に変更しました。',en:'The moving date was changed from Friday to Saturday morning.',zh:'搬家日期从周五改到了周六早上。'},
24:{ja:'午後2時の列車の片道切符を1枚買います。',en:'He buys one one-way ticket for the 2 p.m. train.',zh:'他买一张下午两点列车的单程票。'},
25:{ja:'市場では現金とカードの両方が使えると言っています。',en:'The announcement says both cash and cards can be used at the market.',zh:'通知说集市上现金和银行卡都可以使用。'},
26:{ja:'水曜日の午後6時以降は入場料が無料だと言っています。',en:'The museum does not charge admission after 6 p.m. on Wednesdays.',zh:'通知说周三下午六点以后免收门票。'},
27:{ja:'プラスチックは黄色い容器に入れると言っています。',en:'The announcement says plastic goes in the yellow bin.',zh:'通知说塑料要放进黄色桶里。'},
28:{ja:'申し込みの締め切りは今週の金曜日です。',en:'The application deadline is this Friday.',zh:'报名截止日期是本周五。'},
29:{ja:'会議時間は午前10時から11時に変更されました。',en:'The meeting time was changed from 10 a.m. to 11 a.m.',zh:'会议时间从上午十点改到了十一点。'},
30:{ja:'午前中に雨が降った後、午後は晴れると言っています。',en:'It will rain in the morning and clear up in the afternoon.',zh:'预报说上午下雨，下午会转晴。'}
};

const T1_READING={
31:{ja:'牛乳には動詞「마시다（飲む）」を使います。',en:'The noun “우유” (milk) is used with the verb “마시다” (to drink).',zh:'“우유（牛奶）”要和动词“마시다（喝）”搭配。'},
32:{ja:'雨が降る時、韓国語では傘を「쓰다」と言います。',en:'“우산을 쓰다” means to hold an open umbrella over yourself, as protection from rain. It does not simply mean carrying an umbrella.',zh:'韩语中，下雨时“打伞”使用动词“쓰다”。'},
33:{ja:'名詞の後ろで「～です」と述べる時は「입니다」を使います。',en:'Use “입니다” after a noun to make the formal statement “is/am/are.”',zh:'名词后作正式判断时使用“입니다”。'},
34:{ja:'「만나서 영화를 봤습니다」は、会った後に映画を見たという連続する行動を表します。',en:'“만나서 영화를 봤습니다” shows one action—meeting—followed by another—watching a movie.',zh:'“만나서 영화를 봤습니다”表示先见面，随后看电影的连续动作。'},
35:{ja:'エアコンを使用中なので、ドアを閉めてほしいという案内です。',en:'Because the air conditioner is running, the notice asks people to keep the door closed.',zh:'因为正在使用空调，通知要求关门。'},
36:{ja:'「오늘은 쉽니다」は、今日は営業しないという意味です。',en:'“오늘은 쉽니다” means the business is closed today.',zh:'“오늘은 쉽니다”表示今天不营业。'},
37:{ja:'エレベーターが故障しているため、階段を利用する必要があります。',en:'The elevator is out of order, so people must use the stairs.',zh:'电梯发生故障，因此需要走楼梯。'},
38:{ja:'図書館内での飲食を禁止する案内です。',en:'The notice prohibits eating food inside the library.',zh:'这是禁止在图书馆内吃东西的通知。'},
39:{ja:'1+1は、1つ買うと同じ商品をもう1つもらえる販促です。',en:'A 1+1 promotion gives one additional identical item when you buy one.',zh:'“1+1”表示买一件同样商品再送一件。'},
40:{ja:'火曜日と木曜日なので、授業は週に2回あります。',en:'The class meets twice a week, on Tuesday and Thursday.',zh:'课程在周二和周四进行，所以每周两次。'},
41:{ja:'茶色い犬「ボリ」を昨日、中央公園で見失ったという内容です。',en:'The notice says a brown dog named Bori was lost yesterday at Central Park.',zh:'内容说一只名叫“보리”的棕色小狗昨天在中央公园走失。'},
42:{ja:'13時から16時までの3時間、断水します。',en:'The water will be shut off for three hours, from 1 p.m. to 4 p.m.',zh:'从13点到16点停水，共三个小时。'},
43:{ja:'夕食は家族と一緒に食べると書かれています。',en:'The passage says the writer will have dinner with the family.',zh:'文章说晚上会和家人一起吃饭。'},
44:{ja:'月曜日の朝は道が混むため、地下鉄に乗ると書かれています。',en:'The writer takes the subway on Monday mornings because the roads are congested.',zh:'文章说周一早上堵车，因此乘地铁。'},
45:{ja:'書き手はビビンバが好きだと述べています。',en:'The writer explicitly says that they like bibimbap.',zh:'作者明确说自己喜欢拌饭。'},
46:{ja:'天気のよい週末には自転車に乗ると書かれています。',en:'The writer rides a bicycle on weekends when the weather is good.',zh:'文章说天气好的周末会骑自行车。'},
47:{ja:'友人と一緒にソウルから列車で慶州へ行きます。',en:'The writer goes to Gyeongju from Seoul by train with a friend.',zh:'作者和朋友一起从首尔乘火车去庆州。'},
48:{ja:'必要なら貸出期間を1回延長できます。',en:'The loan period can be extended once if needed.',zh:'如有需要，借阅期限可以延长一次。'},
49:{ja:'料理が得意で、新しい料理を作るという流れが自然です。',en:'Because Minsu cooks well, “makes new dishes” is the natural continuation.',zh:'前文说民洙擅长做饭，因此“制作新菜”最符合语境。'},
50:{ko:'추운 날 밖에 나갈 때 목에 두르는 동작이므로 “목도리를 매다”를 씁니다. “푸세요”는 맨 목도리를 풀라는 뜻으로, 따뜻하게 입으라는 문맥과 반대입니다.',ja:'寒い日に外へ出るので、「목도리를 매다（マフラーを巻く）」を使います。「푸세요」は巻いたマフラーをほどく指示で、暖かくして出かける文脈に合いません。',en:'The sentence tells you to dress warmly before going out, so 매세요 means to put on or tie the scarf. 푸세요 means to undo it, which conflicts with this context.',zh:'句子要求天冷出门时注意保暖，因此用“매세요”表示系上围巾。“푸세요”是解开已系好的围巾，与这里的语境相反。'},
51:{ja:'毎日勉強した結果、韓国語が少し分かるようになったという流れが自然です。',en:'After studying every day, becoming able to understand some Korean is the logical result.',zh:'每天学习的结果是现在能听懂一些韩语，这一语境最自然。'},
52:{ja:'目覚ましが鳴らず寝坊したことが、遅刻の原因です。',en:'The alarm did not ring, so waking up late is the cause of being late to work.',zh:'闹钟没响导致起晚了，这是上班迟到的原因。'},
53:{ja:'友人は辛い物が苦手なので、辛くない料理もある店を探すのが自然です。',en:'Because the friend cannot eat spicy food, it is natural to find a restaurant with non-spicy options.',zh:'朋友不能吃辣，所以找一家也有不辣菜品的餐厅最自然。'},
54:{ja:'雨の予報があるため、登山を来週に延期するのが自然です。',en:'Because heavy rain is forecast, postponing the hike until next week is the logical choice.',zh:'因为预报有大雨，把登山推迟到下周最合理。'},
55:{ja:'店へ行く → シャツを試着して買う → 会計して店を出る、という順序です。',en:'The logical order is: go to the store → try on and buy a shirt → pay and leave.',zh:'正确顺序是：去商店→试穿并买衬衫→结账后离开。'},
56:{ja:'雨が降る → 傘がない → 傘を買って帰る、という順序が自然です。',en:'The logical order is: it rains → there is no umbrella → buy an umbrella and go home.',zh:'自然顺序是：下雨→没有伞→买伞回家。'},
57:{ja:'映画を見る約束 → 時間を確認 → チケットとポップコーンを買う、という順序です。',en:'The order is: plan to see a movie → check the time → buy tickets and popcorn.',zh:'顺序是：约好看电影→确认场次→购买电影票和爆米花。'},
58:{ja:'腹痛 → 病院へ行く → 薬をもらって帰宅、という順序です。',en:'The order is: have a stomachache → go to a clinic → receive medicine and return home.',zh:'顺序是：肚子疼→去医院→拿药回家。'},
59:{ja:'自転車通勤は時間を節約でき、運動にもなることが中心内容です。',en:'The main point is that cycling to work saves time and also provides exercise.',zh:'中心内容是骑自行车上班既节省时间，也能锻炼身体。'},
60:{ja:'毎朝パンを手作りし、店主も親切なのでよく通うパン屋の話です。よく訪れるという行動から、書き手がこの店を気に入っていると分かります。',en:'The passage is about a favorite bakery visited often for its freshly made bread and kind owner.',zh:'文章介绍作者喜欢的一家面包店，因为面包现做、店主亲切，所以经常光顾。'},
61:{ja:'寝る前のスマートフォン使用を減らした後、睡眠が改善したという内容です。',en:'The passage says sleep improved after the writer reduced phone use before bed.',zh:'内容说明减少睡前使用手机后，睡眠变好了。'},
62:{ja:'暑い日に水を飲み、日差しを避ける健康管理法についての文章です。',en:'The passage explains staying healthy on hot days by drinking water and avoiding direct sun.',zh:'文章介绍炎热天气里多喝水、避开阳光的健康管理方法。'},
63:{ja:'待つ必要がなく、好きな物を食べられるので弁当が便利だという内容です。',en:'The lunchbox is convenient because there is no need to wait and the writer can eat preferred food.',zh:'中心内容是带饭无需等待，也能吃自己想吃的东西，所以很方便。'},
64:{ja:'ドラマ・字幕・メモを活用する韓国語学習法を説明しています。',en:'The passage explains a Korean study method using dramas, subtitles, and notes.',zh:'文章说明了利用电视剧、字幕和笔记学习韩语的方法。'},
65:{ja:'ジヨンさんは毎朝、自分で育てている野菜に水をやります。',en:'Jiyoung waters the vegetables she grows every morning.',zh:'智英每天早上给自己种的蔬菜浇水。'},
66:{ja:'自分で野菜を育てて料理する楽しさが中心内容です。',en:'The main idea is the enjoyment of growing vegetables and cooking with them.',zh:'中心内容是亲自种菜并用其做饭的乐趣。'},
67:{ja:'新しい会社の始業が今より30分早いため、早起きの練習をしています。',en:'Because the new job starts 30 minutes earlier, Junho is practicing waking up early.',zh:'新公司的上班时间比现在早30分钟，所以俊浩提前练习早起。'},
68:{ja:'地下鉄一本で新しい会社まで行けると書かれています。',en:'The passage says the new office can be reached with a single subway ride.',zh:'文章说乘一次地铁就能到新公司。'},
69:{ja:'イベント時間中、大通りでは自動車を運転できません。',en:'Cars cannot be driven on the main street during the event.',zh:'活动期间，大路上不能行驶汽车。'},
70:{ja:'毎月開かれる「車のない通り」イベントの時間と活動を紹介しています。',en:'The passage introduces the schedule and activities of the monthly car-free street event.',zh:'文章介绍每月举行的“无车街道”活动时间和内容。'}
};

const TOPIK2_READING={
1:{"ko":"“효율적으로 업무를 처리하려면”은 일을 잘하기 위해 필요한 조건을 묻습니다. “정리해 놓아야 한다”는 할 일을 미리 정리해야 한다는 필요성을 나타냅니다. 경향·경험·진행을 말하는 다른 보기와 구별하세요.","ja":"「効率よく仕事をするには」という条件に、必要な準備を続けます。「정리해 놓아야 한다」は「整理しておかなければならない」という意味です。ほかの選択肢は傾向・経験・進行を表します。","en":"The clause asks what is necessary to work efficiently. 정리해 놓아야 한다 means the tasks must be organized in advance; the other choices describe a tendency, experience, or ongoing action.","zh":"前半句问要高效处理工作需要什么条件。“정리해 놓아야 한다”表示必须事先整理好任务；其他选项表示倾向、经历或正在进行。"},
2:{"ko":"계속 사용하면 새로운 기술에도 자연스럽게 익숙해진다는 일반적인 경향입니다. “-기 마련이다”는 으레 그렇게 된다는 뜻이므로 “익숙해지기 마련이다”가 맞습니다.","ja":"使い続ければ新しい技術にも自然と慣れる、という一般的な傾向です。「-기 마련이다」は「普通はそうなるものだ」を表すので、「익숙해지기 마련이다」が合います。","en":"Continued use normally makes an unfamiliar technology familiar. -기 마련이다 expresses that expected tendency, so 익숙해지기 마련이다 fits.","zh":"持续使用后自然会熟悉新技术，这是一般趋势。“-기 마련이다”表示通常会如此，因此应填“마련이다”。"},
3:{"ko":"회의가 길어진 것이 약속에 늦은 원인이고, 지각은 바람직하지 않은 결과입니다. “-는 바람에”와 “-ㄴ 탓에”는 이 문맥에서 모두 “그 원인 때문에”라는 뜻으로 연결됩니다.","ja":"会議が長引いたことが原因で、約束に遅れるという望ましくない結果になっています。この文では「-는 바람에」と「-ㄴ 탓에」が、ともに「～のせいで」を表します。","en":"The meeting running long caused the unwanted result of being late. In this context, -는 바람에 and -ㄴ 탓에 both express that negative cause-and-result link.","zh":"会议延长导致约会迟到这一不好的结果。因此，“-는 바람에”和“-ㄴ 탓에”在这里都表示“由于……的缘故”。"},
4:{"ko":"자료를 이해하기 쉬운지는 설명하는 방법에 달려 있습니다. “어떻게 설명하느냐에 따라”와 “설명하기 나름이라서”는 모두 설명 방법에 따라 결과가 달라진다는 뜻입니다.","ja":"同じ資料でも、分かりやすさは説明の仕方によって変わります。「어떻게 설명하느냐에 따라」と「설명하기 나름이라서」は、どちらも「説明の仕方次第で」という意味です。","en":"How easy the material is to understand depends on how it is explained. Both expressions mean the result varies with the method of explanation.","zh":"同样的资料是否容易理解，取决于说明方式。这两个表达都表示结果会随解释的方法而改变。"},
5:{ko:'‘책을 골라 함께 읽는다’는 내용이므로 독서 모임이 가장 알맞습니다.',en:'Because participants choose a book and read it together, a book club is the best answer.',zh:'内容是“挑选书籍并一起阅读”，因此最符合“读书会”。'},
6:{ko:'옷을 맡겨 세탁하는 서비스이므로 세탁소 광고입니다.',ja:'衣類を預かって洗濯するサービスなので、クリーニング店の広告です。',en:'It advertises a service that takes in and cleans clothes, so it is a dry cleaner.',zh:'这是收取衣物并清洗的服务，因此是洗衣店广告。'},
7:{ko:'채소를 정기적으로 배송하는 서비스를 설명하고 있습니다.',en:'The notice describes a recurring vegetable delivery service.',zh:'这则内容说明的是定期配送蔬菜的服务。'},
8:{ko:'고장 난 우산을 무료로 수리해 주는 행사 안내입니다.',en:'It is a notice for an event that repairs broken umbrellas for free.',zh:'这是免费修理坏雨伞的活动通知。'},
9:{ko:'본문에 ‘열람실은 정상 운영합니다’라고 분명히 적혀 있습니다.',en:'The passage explicitly states that the reading room operates normally.',zh:'原文明示“阅览室正常开放”。'},
10:{ko:'④가 본문과 일치합니다. ②는 2시간 안에 반납하면 추가 요금이 없다는 뜻이지, 2시간만 빌릴 수 있다는 뜻이 아닙니다.',en:'Option 4 matches the passage. The two-hour rule means no extra fee if returned within two hours, not that rental is limited to two hours.',zh:'④与原文一致。两小时内归还“不收额外费用”，并不表示只能借两小时。'},
11:{ko:'‘4명 이하의 팀’이라고 했으므로 네 명으로 된 팀도 참가할 수 있습니다.',en:'“A team of four or fewer” includes a four-person team.',zh:'原文说“四人以下的团队”，因此四人团队可以参加。'},
12:{ko:'나이, 시간, 사전 예약이라는 세 조건을 모두 만족하는 ③이 정답입니다.',en:'Option 3 is the only choice that satisfies all three conditions: age, time, and advance booking.',zh:'③同时满足年龄、时间和提前预约三个条件。'},
13:{"ko":"(다)는 도시 농업이 주목받는다는 화제를 제시하고 (가)는 참여자가 늘어나는 결과를 말합니다. (나)의 “이처럼 … 늘어나는”은 (가)의 증가를 받아 이유를 설명하므로 그 뒤에 와야 합니다. 마지막은 지자체의 지원을 말하는 (라)입니다.","ja":"（ダ）で都市農業への注目を紹介し、（カ）で参加者の増加を述べます。（ナ）の「このように増える」はその増加を受けるため（カ）の後です。最後に（ラ）で自治体の支援へつなげます。","en":"(다) introduces growing interest in urban farming, and (가) states that more people are taking part. The phrase “people increasing in this way” in (나) refers back to that increase, so (나) follows (가). (라) closes with municipal support.","zh":"(다)先提出城市农业受到关注，(가)再说明参与人数增加。(나)的“人数像这样增加”承接(가)的增加现象并解释原因，因此必须在其后；最后由(라)说明地方政府的支持。"},
14:{ko:'‘그러나 → 특히 → 따라서’의 연결 관계가 장점, 한계, 결론의 순서를 만듭니다.',ja:'まずリモート勤務の長所を述べ、「しかし」で限界へ転じ、「特に」で具体例を示した後、「したがって」で結論を導く②が自然です。',en:'The connectors “however → especially → therefore” form the logical order: advantage, limitation, conclusion.',zh:'“但是→尤其→因此”构成“优点—局限—结论”的逻辑顺序。'},
15:{ko:'‘조사 결과’ 앞에는 조사가 먼저 나와야 하고, ‘그래야’는 앞의 복원 방법 전체를 받아 결론을 냅니다.',ja:'「調査結果」と述べる前に調査の説明が必要です。また「そうしてこそ」は、それまでの復元方法全体を受けて結論を導きます。',en:'“The survey results” must follow the survey, and “only then” draws a conclusion from the restoration method described before it.',zh:'“调查结果”前必须先出现调查过程，而“只有这样”承接前面的修复方法并得出结论。'},
16:{ko:'㉡에 넣으면 ‘소비자 변화 → 선택 기준의 변화 → 기업의 대응’이 자연스럽게 이어집니다.',en:'At ㉡, the flow becomes natural: changing consumers → changing selection criteria → companies’ response.',zh:'放在㉡后形成“消费者变化→选择标准变化→企业应对”的自然衔接。'},
17:{ko:'‘하지만’이 앞의 긍정적 내용을 뒤집고 다음 문제점으로 연결하므로 ㉡이 알맞습니다.',ja:'「しかし」が直前の肯定的な内容から次の問題点へ転換するため、㉡に入れるのが適切です。',en:'“However” reverses the preceding positive point and introduces the following problem, so ㉡ is correct.',zh:'“但是”转折前面的积极内容，并引出后续问题，因此应放在㉡。'},
18:{"ko":"“이러한 온도 조절 효과”는 식물이 온도 상승을 막는 앞 문장을 받습니다. “다음과 같은 빗물 관리 효과”는 뒤에 올 빗물 저장 설명을 예고하므로 두 설명 사이인 ㉢에 넣습니다.","ja":"「この温度調節の効果」は、植物が温度上昇を抑える前の説明を受けます。「次のような雨水管理の効果」は後の雨水をためる説明を予告するため、両者の間の㉢に入ります。","en":"“These temperature-regulating effects” refers back to the plants preventing heat buildup. “The following rainwater-management benefit” points forward to storing rainwater. Only ㉢ connects both references.","zh":"“这种温度调节效果”承接前文植物抑制升温的说明，“如下雨水管理效果”预告后文储存雨水的说明。因此应放在两者之间的㉢。"},
19:{"ko":"선택지가 너무 많으면 비교에 힘이 들고 결정을 미루거나 후회하기 쉽다고 했습니다. 이 결과를 묶으면 “결정의 부담이 커질 수 있다”입니다. 모든 선택 기준이 사라진다고 단정하지는 않습니다.","ja":"選択肢が多すぎると比較に労力がかかり、決断を先延ばしにしたり後悔したりしやすくなります。これをまとめた「決める負担が大きくなり得る」が空欄に合います。","en":"Too many options make comparison tiring and can lead to delay or regret. These consequences support “the burden of deciding can increase,” not the claim that every criterion disappears.","zh":"选项过多会增加比较的负担，使人拖延或后悔。概括这些结果就是“决定的负担可能增大”，而不是断言选择标准必然消失。"},
20:{ko:'③만 본문의 주장과 일치합니다. ①과 ④의 ‘반드시’, ‘모든’은 본문보다 지나치게 일반화한 표현입니다.',en:'Only option 3 matches the passage; “must” in 1 and “all” in 4 overgeneralize the claim.',zh:'只有③符合原文；①的“必须”和④的“所有”都属于过度概括。'},
21:{"ko":"“빛 좋은 개살구”는 겉보기는 좋지만 실속이 없다는 뜻입니다. 기능이 많아 좋아 보이더라도 사용법이 복잡해 실제로 쓰기 어렵다는 제품 평가와 연결됩니다.","ja":"「빛 좋은 개살구」は「見た目はよいが、実質的な価値が乏しいもの」です。機能が多くてよさそうでも、操作が複雑で使いにくい製品に重ねています。","en":"The idiom means something that looks good but lacks practical value. Here, many features appear attractive, but complicated operation makes the product hard to use.","zh":"“빛 좋은 개살구”指外表好看却不实用的东西。文中用它形容功能看似很多、操作却过于复杂而难用的产品。"},
22:{"ko":"사용자는 기능의 수보다 자주 쓰는 기능을 빠르고 쉽게 이용하기를 원한다고 했습니다. 따라서 제품을 개발할 때 사용 편의성을 고려해야 한다는 것이 중심 생각입니다.","ja":"利用者が求めているのは、よく使う機能を素早く簡単に使えることです。したがって、機能の数より使いやすさを重視して開発すべきだ、というのが中心的な考えです。","en":"Users want quick, easy access to the functions they actually use. The central claim is therefore that product development should prioritize usability over the number of features.","zh":"用户希望能快速、方便地使用常用功能。因此，中心观点是产品开发应重视使用便利性，而不是单纯增加功能数量。"},
23:{ko:'처음의 반복 확인은 긴장을, 마지막의 성공과 자신감은 뿌듯함과 만족을 나타냅니다.',en:'Repeated checking at first shows nervousness, while success and confidence at the end show pride and satisfaction.',zh:'开头反复确认表现紧张，结尾的成功和自信表现出自豪与满足。'},
24:{"ko":"첫 손님을 맞았을 때 잔돈이 부족했지만 옆 가게 주인이 잔돈을 바꿔 주어 해결했습니다. 따라서 옆 가게 주인이 글쓴이를 도왔다는 내용이 본문과 일치합니다.","ja":"最初の客へのおつりが足りなくなった時、隣の店主が小銭に両替してくれました。この出来事が「隣の店主に助けてもらった」という選択肢の根拠です。","en":"The writer lacked change for the first customer, and the neighboring shopkeeper exchanged money to solve the problem. This directly supports the statement that the shopkeeper helped the writer.","zh":"作者接待第一位顾客时零钱不足，邻店店主帮忙换了零钱。因此，“邻店店主帮助了作者”与原文一致。"},
25:{ko:'‘반납 장소 확대 → 편리함’이라는 제목의 인과 관계를 그대로 풀어 쓴 ②가 알맞습니다.',ja:'②は、見出しの「返却場所の拡大によって利便性が高まる」という因果関係をそのまま言い換えています。',en:'Option 2 restates the headline’s causal link: more return locations lead to greater convenience.',zh:'②完整改述了标题的因果关系：“扩大归还地点→更加便利”。'},
26:{"ko":"제목은 “주말 운영을 늘리자 가족 이용이 두 배가 되었다”는 변화입니다. 원인은 주말 운영 확대, 결과는 가족 단위 이용 증가이므로 이 방향을 유지한 보기를 고릅니다.","ja":"見出しは、週末の開館を増やした結果、家族での利用が2倍になったと述べています。「週末の運営拡大→家族利用の増加」という因果関係を保つ選択肢を選びます。","en":"The headline says expanding weekend opening led to twice as much family use. The correct paraphrase preserves that direction: expanded opening first, increased family use as the result.","zh":"标题说扩大周末开放后，家庭使用量增至两倍。正确改述应保留“扩大周末开放→家庭使用增加”的因果方向。"},
27:{"ko":"“무엇을 아는가보다 무엇을 해 봤나”는 지식보다 실제 경험을 중시한다는 비교입니다. 경험의 중요성을 말한 보기가 가장 가깝고, 지식을 전혀 평가하지 않는다는 뜻은 아닙니다.","ja":"「何を知っているかより、何を経験したか」は、知識より実際の経験を重視する比較です。経験の重要性を述べた選択肢が最も近く、知識を全く評価しないとは言っていません。","en":"The headline contrasts what applicants know with what they have actually done, emphasizing experience. It does not say knowledge is never assessed.","zh":"标题把“知道什么”与“做过什么”相比，强调实际经验的重要性，并没有说完全不评价知识。"},
28:{"ko":"처음부터 목표가 너무 크면 몇 번 실천하지 못했을 때 쉽게 포기한다고 했습니다. 그 문제를 줄이는 방법은 실천 가능한 작은 목표부터 세우는 것입니다.","ja":"最初から目標が大きすぎると、何度か実行できなかっただけで諦めやすくなります。その問題への対策として、実行できる小さな目標から始めるのが自然です。","en":"Overambitious goals make people give up after missing a few sessions. Starting with small, achievable goals directly addresses that problem.","zh":"一开始目标过大，几次没做到就容易放弃。因此，从可以实现的小目标开始，才是针对这一问题的办法。"},
29:{"ko":"요약은 빠르지만 계약서나 규정의 중요한 조건이 빠질 수 있습니다. 그래서 중요한 판단을 할 때는 원문 확인이 필요합니다. 요약 기능 자체를 전면 금지하자는 주장은 아닙니다.","ja":"要約は便利ですが、契約書や規則の重要な条件が抜けることがあります。そのため重要な判断では原文の確認が必要です。要約機能を全面禁止すべきだとは述べていません。","en":"Summaries are useful but may omit important contractual or regulatory conditions. Checking the original before an important decision addresses that limitation without banning summaries altogether.","zh":"摘要虽然方便，却可能漏掉合同或规定中的重要条件。因此，作重要决定时要核对原文，而不是全面禁止摘要功能。"},
30:{"ko":"평일과 주말의 기상 시간 차이가 크면 생체 리듬이 흐트러질 수 있다고 했습니다. 취침·기상 시간을 가능한 일정하게 유지하면 본문이 지적한 시간 차이를 줄일 수 있습니다.","ja":"平日と週末で起床時刻が大きく違うと、体内リズムが乱れ得ると述べています。就寝・起床時刻をなるべく一定に保つ選択肢なら、この時刻のずれを減らせます。","en":"The passage identifies a large weekday–weekend wake-time gap as a problem for body rhythms. Keeping sleep and wake times as consistent as possible addresses that stated gap.","zh":"原文指出平日与周末起床时间差距过大会扰乱生物节律。尽量保持就寝和起床时间规律，正好能减少这一差距。"},
31:{"ko":"체험 전시는 흥미를 높이지만 장치만 화려하면 전시 내용을 놓칠 수 있습니다. 따라서 장치 체험이 전시 내용의 이해로 이어지도록 설계해야 합니다.","ja":"体験型展示は興味を引けますが、装置が派手すぎると展示内容から注意がそれます。体験が内容の理解につながるよう設計する、という結論が自然です。","en":"Interactive exhibits engage visitors, but flashy devices can distract from the content. Designing the activity to support understanding preserves the benefit while addressing the drawback.","zh":"体验式展览能引起兴趣，但装置过于花哨会让人忽略展览内容。因此，应让体验有助于理解内容。"},
32:{"ko":"나무는 그늘과 수분 증발로 더위를 줄이지만 뿌리나 채광 문제가 생길 수도 있습니다. 그래서 마지막 문장은 공간에 맞는 나무 종류와 위치를 계획해야 한다고 결론짓습니다.","ja":"木は日陰や水分の蒸発で暑さを和らげる一方、根や採光の問題も起こし得ます。そのため結論は、その場所に合う樹種と植える位置を考える必要がある、となっています。","en":"Trees cool streets but may damage paving or block light if poorly chosen or placed. The conclusion therefore calls for planning the species and location to suit the space.","zh":"树木能遮阴降温，但种类和位置不当也可能顶起地砖或遮挡采光。因此，结论是应按空间特点规划树种与位置。"},
33:{"ko":"손글씨는 내용을 골라 정리하는 데, 키보드는 빠르게 기록하는 데 각각 장점이 있습니다. 글은 한 방식이 항상 우수하다고 단정하지 않고 학습 목적에 따라 선택하라고 결론짓습니다.","ja":"手書きには内容を選んで整理する面、入力には素早く記録する面があります。本文はどちらかが常に優れるとはせず、学習目的に合わせて選ぶと結論づけています。","en":"Handwriting can encourage selecting and rethinking information, while typing supports rapid recording. The passage concludes that the learning purpose should guide the choice, rather than declaring one method always better.","zh":"手写有助于筛选、整理并重新思考内容，键盘输入便于快速记录。原文主张按学习目的选择，而非认定某一种方式总是更好。"},
34:{"ko":"참가자는 자원봉사자에게 수리 방법을 배우고 직접 물건을 고칩니다. 본문은 쓰레기 감소에 더해 기술과 경험을 나누는 기회도 생긴다고 명시합니다.","ja":"参加者はボランティアから修理方法を学び、自分で修理します。ごみを減らすだけでなく、技術や経験を分かち合う機会も生まれると明記されています。","en":"Participants learn repair methods from volunteers and repair items themselves. The passage explicitly identifies sharing skills and experience as a benefit alongside reducing waste.","zh":"参与者向志愿者学习修理方法并自己动手。原文明说，这不仅减少垃圾，也提供了分享技能和经验的机会。"},
35:{"ko":"세로축 범위나 선택한 기간이 달라지면 같은 자료도 다르게 보일 수 있습니다. 따라서 수치만 보지 말고 그래프의 표현 방식과 자료 범위를 함께 확인해야 한다는 것이 주제입니다.","ja":"縦軸の範囲や取り上げる期間によって、同じデータでも印象が変わります。そのため数値だけでなく、表現方法とデータの範囲も確かめる必要がある、というのが主題です。","en":"The same data can look different when the vertical scale or selected period changes. The main point is to check the presentation and data range as well as the numbers.","zh":"纵轴范围或所选时间段不同，同样的数据也会给人不同印象。因此，主题是除了数字，还要核对表现方式与数据范围。"},
36:{"ko":"관광객이 많아도 소음·쓰레기로 주민이 불편하면 축제의 지지를 잃을 수 있습니다. 주민 참여와 지역에 남는 경험·수익까지 고려해야 한다는 결론이므로 방문객 수만으로 평가할 수 없습니다.","ja":"来場者が多くても、騒音やごみで住民の負担が増えれば支持を失いかねません。住民参加や地域に残る経験・収益も考えるべきで、来場者数だけでは評価できないと述べています。","en":"High attendance alone is insufficient if noise and waste undermine residents’ support. The conclusion also considers resident participation and the lasting experience and income left in the community.","zh":"游客多并不足以说明成功，噪声和垃圾可能使居民不再支持。结论还要求考虑居民参与及留在当地的经验和收益。"},
37:{"ko":"온라인 학습은 시간·장소와 반복 학습에 장점이 있지만 공부를 미루거나 질문을 해결하지 못할 수 있습니다. 그래서 자기 관리로 계획을 지키고 피드백을 받을 환경을 마련해야 합니다.","ja":"オンライン学習には時間・場所や反復の利点がありますが、先延ばしや疑問の解消の難しさもあります。そのため自己管理と、フィードバックを受けられる環境が必要です。","en":"Online study offers flexibility and repetition but can lead to procrastination and unanswered questions. Self-management and access to feedback address those two weaknesses.","zh":"在线学习便于安排时间地点和重复学习，但也容易拖延或难以及时解答疑问。因此，需要自我管理和获得反馈的环境。"},
38:{"ko":"성격을 평가하면 방어적인 반응이 나오지만 지각한 제출 행동과 그 영향을 설명하면 개선할 점이 분명해집니다. 따라서 피드백은 구체적인 행동과 개선 방향에 초점을 맞춰야 합니다.","ja":"性格を評価すると相手が身構えやすい一方、提出の遅れとその影響を具体的に伝えれば改善点が明確になります。行動と改善の方向に焦点を当てる、という結論です。","en":"Judging character can provoke defensiveness, while describing late submissions and their effects makes the needed change clear. Feedback should therefore focus on observable behavior and improvement.","zh":"评价性格容易引起防御反应，而具体说明迟交报告及其影响能让改进点清晰。因此，反馈应聚焦行为与改进方向。"},
39:{ko:'‘그다음’ 앞에는 첫 공정이 와야 하고, ‘이렇게’는 바로 앞의 분리 과정을 가리킵니다.',ja:'「その次」の前には最初の工程が必要で、「このように」は直前の分離工程を指します。',en:'The first process must come before “next,” and “in this way” refers to the separation step immediately before it.',zh:'“接下来”前应先出现第一道工序，而“这样”指代紧接其前的分离过程。'},
40:{ko:'(나)가 개념을 제시하고, (가)가 효과를 설명한 뒤, (다)가 사회적 결과를 말합니다.',ja:'（ナ）が概念を提示し、（カ）がその効果を説明した後、（タ）が社会的な結果を述べる順序です。',en:'(나) introduces the concept, (가) explains its effect, and (다) gives the social result.',zh:'(나)提出概念，(가)说明效果，(다)说明社会结果。'},
41:{"ko":"(나)는 새말이 곧바로 사전에 오르지 않는다는 원칙을 제시합니다. (다)의 오랜 사용 조사 뒤에야 (가)의 “이후”와 사전 등재가 이어지므로 (나)-(다)-(가) 순서입니다.","ja":"（ナ）で新語はすぐ辞書に載るわけではないと述べ、（タ）で長期間の用例調査を説明します。その後に（カ）の「이후（その後）」と辞書への掲載が続く順序です。","en":"(나) states that new words are not immediately entered in dictionaries. (다) explains the long-term review of usage, and only then can (가), beginning “afterward,” describe possible inclusion.","zh":"(나)先说明新词不会立即收入词典，(다)说明长期调查实际用法，之后才接(가)的“此后”及收录过程，故顺序为(나)-(다)-(가)。"},
42:{"ko":"처음에는 재봉틀을 먼지만 쌓이는 물건으로 여겼습니다. 가족의 옷을 만들었다는 이야기를 듣고 함께 손질한 뒤에는 단순히 낡은 물건으로 볼 수 없게 되어, 무관심에서 의미를 느끼는 태도로 바뀝니다.","ja":"最初はミシンをほこりの積もる物としか見ていませんでした。家族の服を作った話を聞いて一緒に手入れをした後、大切な意味のある物と捉えるようになります。","en":"At first the narrator sees only a dusty object. Learning that it made family clothing and helping restore it changes that indifference into an appreciation of its meaning.","zh":"起初作者只把缝纫机看作积灰的旧物。听到它曾制作家人的衣服并一起保养后，作者开始觉得它有意义，态度由漠不关心转为珍视。"},
43:{"ko":"할머니는 그 재봉틀로 아버지의 교복과 이모의 결혼식 옷을 만들었다고 했습니다. 이 두 예가 가족의 옷을 만든 적이 있다는 선택지를 뒷받침합니다.","ja":"祖母はそのミシンで父の制服やおばの結婚式の服を作ったと話しています。この2つが「家族の服を作ったことがある」という選択肢の根拠です。","en":"The grandmother says she made the father’s school uniform and the aunt’s wedding clothes with that machine. Both details support its use for family clothing.","zh":"奶奶说曾用那台缝纫机制作父亲的校服和姨妈的婚礼服装。这两项事实支持“曾做过家人的衣服”。"},
44:{"ko":"디지털화는 시간과 비용을 줄이지만 기기 사용이 어려운 사람에게 장벽이 될 수 있습니다. “효율성과 접근성”을 함께 고려한다는 문장이 두 측면을 연결하고 뒤의 오프라인 지원 방안으로 이어집니다.","ja":"デジタル化は時間や費用を減らす一方、機器を使いにくい人には壁となり得ます。「効率と利用しやすさの両方」を考える文がこの対比をまとめ、次の窓口支援につながります。","en":"Digitalization saves time and money but can create barriers for people who struggle with devices. Considering both efficiency and accessibility connects these points to the following proposal for offline help.","zh":"数字化能节省时间和成本，却也可能给不擅长使用设备的人造成障碍。因此，“同时考虑效率与可及性”衔接两面，并引出后面的线下帮助。"},
45:{"ko":"온라인 신청만 남기면 고령자 등 일부 시민이 이용하기 어려워질 수 있다고 했습니다. 따라서 디지털화를 하더라도 도움을 받을 수 있는 다른 접근 방법을 함께 마련해야 한다는 것이 중심 생각입니다.","ja":"申請をオンラインだけにすると、高齢者など一部の市民が利用しづらくなります。そのためデジタル化と合わせて、支援を受けられる利用方法も残すべきだ、というのが中心的な考えです。","en":"Online-only applications may exclude some citizens. The main claim is to provide ways for people who need help to access public services alongside digitalization.","zh":"只保留在线申请会让部分市民难以使用。因此，中心观点是推进数字化时，也应为需要帮助的人提供其他使用途径。"},
46:{"ko":"(나)가 씨앗 은행을 소개한 뒤 (가)가 종류별 온도·습도 조절을 설명합니다. (다)의 “이처럼 종류별로 온도와 습도를 조절해”는 (가)의 방법을 받으므로 (나)-(가)-(다) 순서입니다.","ja":"（ナ）がシードバンクを紹介し、（カ）が種類別の温度・湿度調整を説明します。（タ）の「このように種類別に温度と湿度を調整して」は（カ）の方法を受けるため、（ナ）→（カ）→（タ）の順です。","en":"(나) introduces seed banks, and (가) explains adjusting temperature and humidity for each type. The phrase “stored with temperature and humidity adjusted by type in this way” in (다) refers to that method, so the order is (나)–(가)–(다).","zh":"(나)介绍种子库，(가)说明按种类调节温度和湿度。(다)的“像这样按种类调节温湿度保存的种子”承接(가)的方法，因此顺序是(나)-(가)-(다)。"},
47:{ko:'주장 → 이유 → 장기적 효과의 순서로 이어지는 ②가 알맞습니다.',en:'Option 2 follows the logical order of claim → reason → long-term effect.',zh:'②符合“主张→理由→长期效果”的逻辑顺序。'},
48:{ko:'‘선택의 폭을 넓히는 기술이 오히려 선택을 좁힌다’는 역설을 나타내므로 ①이 알맞습니다.',en:'It presents the paradox that technology intended to broaden choice can instead narrow it, so option 1 is correct.',zh:'这里表达“本应扩大选择的技术反而缩小选择”的悖论，因此选①。'},
49:{"ko":"추천 기능이 검색 시간을 줄이는 편리함은 인정합니다. 다만 비슷한 정보만 보게 될 수 있어 추천 목록 밖의 자료와 다른 관점도 찾아보라고 하므로, 장점을 인정하면서 한계를 경계하는 태도입니다.","ja":"検索時間を減らせる便利さは認めています。一方、似た情報に偏るおそれがあるため、推薦一覧の外や異なる観点も見るよう勧めており、利点を認めつつ限界に注意を促す態度です。","en":"The writer acknowledges faster searching but warns that similar recommendations can narrow exposure. Advising readers to explore outside the list shows acceptance of the benefit with caution about the limitation.","zh":"作者肯定推荐能节省搜索时间，但提醒相似推荐可能限制视野，并建议主动接触列表外的信息与不同观点。这是认可优点、警惕局限的态度。"},
50:{"ko":"글은 추천이 정보를 빨리 찾게 해 주는 장점과, 비슷한 정보만 접해 선택이 좁아질 수 있는 문제를 함께 다룹니다. “추천의 편리함 뒤에 숨은 선택의 편향”은 이 두 내용을 모두 담은 제목입니다.","ja":"本文は情報を素早く探せる利点と、似た情報ばかりに触れて選択肢が狭まる問題を扱っています。「推薦の便利さの裏にある選択の偏り」は、この両面を含む題名です。","en":"The passage discusses both faster discovery and the risk that repeated similar recommendations narrow choice. The title about bias behind recommendation convenience captures both sides.","zh":"文章既谈推荐便于快速查找信息，也谈反复接触相似信息可能缩小选择范围。因此，标题应同时包含推荐的便利与选择偏向。"}
};

const TOPIK2_LISTENING={
1:{ko:'상자 안에 유리컵이 있어 깨지지 않게 조심해서 옮겨야 한다고 했으므로 1번 그림이 맞습니다.',ja:'箱の中にガラスのコップがあり、割れないよう注意して運ぶと言っているため、1番の絵が正解です。',en:'They say the box contains glass cups and must be carried carefully so they do not break, so picture 1 is correct.',zh:'对话说箱内有玻璃杯，搬运时要小心避免打碎，因此第1幅图正确。'},
2:{ko:'창가의 햇빛 때문에 화면이 잘 보이지 않아 커튼을 닫고 책상 조명만 켠다고 했으므로 3번 그림이 맞습니다.',ja:'窓際の日差しで画面が見えないため、カーテンを閉めて机の照明をつけると言っているので、3番の絵が正解です。',en:'The sunlight by the window makes the screen hard to see, so they will close the curtain and use the desk light; picture 3 is correct.',zh:'窗边阳光太强导致看不清屏幕，因此要拉上窗帘并只开桌灯，第3幅图正确。'},
3:{"ko":"출퇴근 40%, 운동 30%, 여가 20%, 장보기 10%라고 했습니다. 이 네 비율을 순서대로 나타낸 그림을 고릅니다.","ja":"「通勤40％、運動30％、余暇20％、買い物10％」と述べています。この4つの割合に合う図を選びます。","en":"The recording gives commuting to work as 40%, exercise as 30%, leisure as 20%, and shopping as 10%. Choose the chart that matches all four figures.","zh":"录音说上下班占40%、运动占30%、休闲占20%、购物占10%。应选择四项比例都一致的图。"},
4:{"ko":"남자는 발표 내용은 다 정리했지만 표를 아직 넣지 못했다고 했습니다. 남은 작업을 도와주겠다는 “그럼 표는 제가 만들어 드릴게요”가 자연스럽게 이어집니다.","ja":"男性は発表内容をまとめ終えましたが、表はまだ入れていません。残った作業を手伝う「では、表は私が作ります」が自然につながります。","en":"The man has finished organizing the content but has not added the table. Offering to make the table directly helps with the unfinished task.","zh":"男方已整理好内容，但还没加入表格。因此，接着表示“那表格由我来做”是在帮忙完成剩下的工作。"},
5:{"ko":"여자는 주말마다 사람이 너무 많다는 말을 듣고 수영장에 가지 않았습니다. “평일 저녁에는 좀 한가하대요”는 그 걱정에 맞춰 덜 붐비는 시간을 알려 주는 응답입니다.","ja":"女性は週末の混雑を気にして、まだ泳ぎに行っていません。「平日の夕方は比較的空いているそうです」と、混雑を避けられる時間を伝える返答が自然です。","en":"The woman has avoided the pool because she heard it is crowded on weekends. Suggesting the quieter weekday evenings responds to that concern.","zh":"女方因为听说周末很拥挤而还没去游泳馆。告诉她工作日晚上比较空，正好回应了她对人多的顾虑。"},
6:{"ko":"택배 기사가 주소를 찾지 못해 배송이 늦어지고 있습니다. “위치를 자세히 알려 드려야겠어”는 주소를 찾도록 도와 이 문제를 해결하려는 응답입니다.","ja":"配達員が住所を見つけられず、荷物が届いていません。「場所を詳しく伝えないと」と答えれば、遅れている原因に直接対応できます。","en":"The driver cannot find the address, which explains the delay. Offering to give detailed location information directly addresses that problem.","zh":"快递员找不到地址，所以包裹还没送到。接着表示要详细说明位置，才能直接解决这一问题。"},
7:{"ko":"남자는 예약하지 않으면 오래 기다릴까 봐 걱정했지만, 여자는 어제 미리 예약했다고 했습니다. 그래서 “다행이네요”라고 안도하며 바로 들어갈 수 있겠다고 예상하는 응답이 자연스럽습니다.","ja":"男性は予約なしでは待たされることを心配していますが、女性は昨日予約を済ませています。そのため「よかったです」と安心し、すぐ入れそうだと見込む返答が自然です。","en":"The man worries about a long wait without a reservation, but the woman booked yesterday. Expressing relief and expecting to get in promptly follows naturally; immediate entry was not explicitly promised.","zh":"男方担心没预约要等很久，但女方昨天已经预约。因此，表示放心并推测能较快入内很自然；录音并没有保证马上入场。"},
8:{"ko":"보고서에 같은 내용이 두 번 들어갔고 수정할 때 확인하지 못했다고 했습니다. 따라서 다시 읽고 중복된 부분을 지우겠다는 응답이 지적된 문제를 해결합니다.","ja":"報告書に同じ内容が2回入り、修正時に確認できていなかったという状況です。読み直して重複部分を削除するという返答なら、指摘された問題を解決できます。","en":"The report repeats the same content, and the speaker missed it during revision. Reading it again and removing the duplicate directly fixes the stated problem.","zh":"报告出现重复内容，修改时又没检查出来。因此，接着表示重读并删除重复部分，才是在解决对话指出的问题。"},
9:{ko:'우유 대신 두유로 음료를 만들어 달라고 요청하는 행동이므로 해당 선택지가 정답입니다.',ja:'牛乳の代わりに豆乳で飲み物を作ってもらうよう頼む行動なので、この選択肢が正解です。',en:'Ask to have the drink made with soy milk instead of milk.',zh:'请店员把饮品中的牛奶换成豆浆。'},
10:{ko:'인쇄 문제를 해결하기 위해 용지함이 제대로 닫혔는지 확인해야 한다고 했으므로 해당 선택지가 정답입니다.',ja:'印刷の問題を解決するため、用紙トレイがきちんと閉まっているか確認すると言っているので、この選択肢が正解です。',en:'Check whether the paper tray is properly closed.',zh:'检查纸盒是否关好。'},
11:{ko:'표를 바꾸려면 승차권 변경 창구로 가야 한다고 했으므로 해당 선택지가 정답입니다.',ja:'切符を変更するには変更窓口へ行く必要があるため、この選択肢が正解です。',en:'Go to the ticket-change counter.',zh:'去车票变更窗口。'},
12:{ko:'발표자를 대기실로 안내하는 행동이 이어져야 하므로 해당 선택지가 정답입니다.',ja:'講演者を控室へ案内する行動が続くため、この選択肢が正解です。',en:'Escort the speaker to the waiting room.',zh:'把演讲者带到休息室。'},
13:{ko:'시장이 수요일에도 문을 연다고 분명히 말했으므로 해당 내용이 정답입니다.',ja:'市場は水曜日も開いていると明確に述べているため、この内容が正解です。',en:'The market is also open on Wednesdays.',zh:'市场周三也营业。'},
14:{ko:'점검 기간에도 1층 열람실은 이용할 수 있다고 했으므로 해당 내용이 정답입니다.',ja:'点検期間中も1階の閲覧室は利用できると言っているため、この内容が正解です。',en:'The first-floor reading room is available during the inspection.',zh:'检查期间可以使用一楼阅览室。'},
15:{ko:'구청이 무너진 산책로를 복구할 계획이라고 했으므로 해당 내용이 정답입니다.',ja:'区役所が崩れた遊歩道を復旧する予定だと述べているため、この内容が正解です。',en:'The district office plans to restore the collapsed walking trail.',zh:'区政府计划修复坍塌的散步道。'},
16:{ko:'여자는 반려동물 주인의 집에서 동물의 행동을 관찰한다고 했으므로 해당 내용이 정답입니다.',ja:'女性は飼い主の家で動物の行動を観察すると述べているため、この内容が正解です。',en:'The woman observes the animal’s behavior at the owner’s home.',zh:'女方在宠物主人的家中观察动物行为。'},
17:{ko:'먹을 만큼만 음식을 준비하는 것이 좋다는 주장이므로 해당 선택지가 정답입니다.',ja:'食べ切れる分だけ料理を用意するのがよい、という主張なので、この選択肢が正解です。',en:'It is best to prepare only as much food as will be eaten.',zh:'饭菜最好只准备够吃的量。'},
18:{ko:'팀원들이 자신의 생각을 말할 기회를 가져야 한다는 주장이므로 해당 선택지가 정답입니다.',ja:'チームのメンバーに自分の意見を述べる機会を与えるべきだ、という主張なので、この選択肢が正解です。',en:'Team members should be given a chance to express their ideas.',zh:'应该给团队成员表达自己想法的机会。'},
19:{ko:'여행 일정은 여유 있게 계획하는 것이 좋다는 내용이므로 해당 선택지가 정답입니다.',ja:'旅行日程は余裕をもって組むのがよい、という内容なので、この選択肢が正解です。',en:'It is best to plan a relaxed travel itinerary.',zh:'旅行日程最好安排得宽松一些。'},
20:{ko:'상품 후기는 내용뿐 아니라 작성 날짜도 함께 확인해야 한다고 했으므로 해당 선택지가 정답입니다.',ja:'商品レビューは内容だけでなく投稿日も確認すべきだと述べているため、この選択肢が正解です。',en:'Product reviews should be checked for both content and posting date.',zh:'查看商品评价时，应同时确认内容和发布时间。'},
21:{ko:'인쇄물은 필요한 사람을 중심으로 제공하는 것이 좋다고 했으므로 해당 선택지가 정답입니다.',ja:'印刷物は必要とする人を中心に提供するのがよいと述べているため、この選択肢が正解です。',en:'Printed materials should mainly be provided to people who need them.',zh:'印刷资料最好重点提供给有需要的人。'},
22:{ko:'발표 자료의 내용이 바뀔 수 있다고 했으므로 해당 내용이 정답입니다.',ja:'発表資料の内容が変わる可能性があると述べているため、この内容が正解です。',en:'The content of the presentation materials may change.',zh:'演示资料的内容可能会改变。'},
23:{ko:'말하는 사람은 원하는 조건을 충족하는 상품이 있는지 확인하고 있으므로 해당 선택지가 정답입니다.',ja:'話し手は希望する条件を満たす商品があるか確認しているため、この選択肢が正解です。',en:'The speaker is checking whether a product meets the desired conditions.',zh:'说话人正在查看是否有符合所需条件的产品。'},
24:{ko:'제품의 화면 불빛을 끌 수 있다고 설명했으므로 해당 내용이 정답입니다.',ja:'製品の画面のライトは消せると説明しているため、この内容が正解です。',en:'The product’s display light can be turned off.',zh:'产品的屏幕灯可以关闭。'},
25:{ko:'그 지역에서만 할 수 있는 체험을 만드는 것이 중요하다는 주장이므로 해당 선택지가 정답입니다.',ja:'その地域でしかできない体験を作ることが重要だ、という主張なので、この選択肢が正解です。',en:'It is important to create experiences available only in the local area.',zh:'创造只有当地才能体验的项目很重要。'},
26:{ko:'주민들이 축제 프로그램에 직접 참여했다고 했으므로 해당 내용이 정답입니다.',ja:'住民が祭りのプログラムに直接参加したと述べているため、この内容が正解です。',en:'Residents participated directly in the festival program.',zh:'居民直接参与了庆典节目。'},
27:{ko:'포장을 바꾼 이유와 그 결과를 설명하려는 말이므로 해당 선택지가 정답입니다.',ja:'包装を変更した理由と、その変更による結果を説明する話なので、この選択肢が正解です。',en:'To explain why the packaging was changed and what resulted from the change.',zh:'为了说明更换包装的原因及其结果。'},
28:{ko:'재활용하기 쉽다는 사실이 알려진 뒤 제품을 찾는 사람이 늘었다고 했으므로 해당 내용이 정답입니다.',ja:'リサイクルしやすいことが知られた後、その商品を求める人が増えたと述べているため、この内容が正解です。',en:'After people learned that it was easy to recycle, more people sought out the product.',zh:'人们得知该产品易于回收后，购买者增加了。'},
29:{ko:'지하철 유실물 센터에서 일하는 사람의 이야기이므로 해당 선택지가 정답입니다.',ja:'地下鉄の遺失物センターで働く人の話なので、この選択肢が正解です。',en:'A person who works at a subway lost-and-found center.',zh:'在地铁失物招领中心工作的人。'},
30:{ko:'연락처가 없는 물건은 사진을 찍어 홈페이지에 올린다고 했으므로 해당 내용이 정답입니다.',ja:'連絡先のない品物は写真を撮ってウェブサイトに掲載すると述べているため、この内容が正解です。',en:'Items without contact information are photographed and posted on the website.',zh:'没有联系方式的物品会拍照并上传到网站。'},
31:{ko:'시설을 전면 도입하기 전에 효과를 충분히 검증해야 한다는 주장이므로 해당 선택지가 정답입니다.',ja:'施設を全面導入する前に効果を十分検証すべきだ、という主張なので、この選択肢が正解です。',en:'The effect should be thoroughly verified before the facility is adopted in full.',zh:'全面引进该设施前，应充分验证其效果。'},
32:{ko:'말하는 사람은 정책 판단에 필요한 객관적인 자료를 요구하고 있으므로 해당 선택지가 정답입니다.',ja:'話し手は政策判断に必要な客観的資料を求めているため、この選択肢が正解です。',en:'The speaker is requesting objective data needed for a policy decision.',zh:'说话人要求提供政策决策所需的客观资料。'},
33:{ko:'짧은 낮잠이 학습과 기억에 미치는 영향을 다룬 내용이므로 해당 선택지가 정답입니다.',ja:'短い昼寝が学習と記憶に与える影響を扱った内容なので、この選択肢が正解です。',en:'The effect of short naps on learning and memory.',zh:'短暂午睡对学习和记忆的影响。'},
34:{ko:'낮잠을 잔 집단이 더 많은 내용을 기억했다고 했으므로 해당 내용이 정답입니다.',ja:'昼寝をしたグループのほうが多くの内容を覚えていたと述べているため、この内容が正解です。',en:'The group that took a nap remembered more content.',zh:'午睡组记住了更多内容。'},
35:{ko:'새로 발견된 지도의 가치와 의미를 설명하는 내용이므로 해당 선택지가 정답입니다.',ja:'新たに発見された地図の価値と意義を説明する内容なので、この選択肢が正解です。',en:'It explains the value and significance of a newly discovered map.',zh:'内容说明了新发现地图的价值和意义。'},
36:{ko:'그 지도는 다음 달부터 박물관에서 전시된다고 했으므로 해당 내용이 정답입니다.',ja:'その地図は来月から博物館で展示されると述べているため、この内容が正解です。',en:'The map will be exhibited at the museum starting next month.',zh:'该地图将从下个月起在博物馆展出。'},
37:{ko:'도시 녹화는 위치와 관리 조건을 함께 고려해 설계해야 한다는 주장이므로 해당 선택지가 정답입니다.',ja:'都市緑化は場所と維持管理の両方を考えて設計すべきだ、という主張なので、この選択肢が正解です。',en:'Urban greening should be designed with both location and maintenance in mind.',zh:'城市绿化设计应同时考虑位置和维护。'},
38:{ko:'보행로 주변에 그늘을 만들면 체감 온도를 낮출 수 있다고 했으므로 해당 내용이 정답입니다.',ja:'歩道の周辺に日陰を作ると体感温度を下げられると述べているため、この内容が正解です。',en:'Creating shade around walkways can lower the perceived temperature.',zh:'在步行道周围营造阴凉可以降低体感温度。'},
39:{"ko":"대화는 인공지능이 앞뒤 장면을 분석해 손상된 영상을 복원하는 방법과 전문가의 확인이 필요한 이유를 설명합니다. 따라서 선택지 중 손상된 영상 복원 기술을 다룬 항목이 중심 내용에 가장 가깝습니다.","ja":"会話では、AIが前後の場面を分析して損傷した映像を復元する仕組みと、専門家の確認が必要な理由を説明しています。選択肢では、この映像復元技術を扱ったものが中心内容に最も合います。","en":"The speakers explain how AI analyzes neighboring frames to restore damaged footage and why experts must check the result. Of the choices, the one about this restoration technology best captures the topic.","zh":"对话说明AI如何分析前后画面来修复受损影像，以及为何还需专家核查。选项中，关于受损影像修复技术的一项最符合主题。"},
40:{ko:'인공지능이 만든 결과는 전문가가 확인하고 수정해야 한다고 했으므로 해당 내용이 정답입니다.',ja:'AIが生成した結果は専門家が確認し、修正する必要があると述べているため、この内容が正解です。',en:'AI-generated results must be checked and corrected by experts.',zh:'人工智能生成的结果必须由专家确认并修正。'},
41:{ko:'제조업은 제품과 서비스를 결합해 새로운 성장을 만들 수 있다는 주장이므로 해당 선택지가 정답입니다.',ja:'製造業は製品とサービスを組み合わせることで新たな成長を生み出せる、という主張なので、この選択肢が正解です。',en:'Manufacturing can create new growth by combining products and services.',zh:'制造业可以通过结合产品与服务创造新的增长。'},
42:{ko:'엘리베이터 회사가 고장 전에 부품을 교체하는 서비스를 제공한다고 했으므로 해당 내용이 정답입니다.',ja:'エレベーター会社は故障する前に部品を交換するサービスを提供していると述べているため、この内容が正解です。',en:'The elevator company provides a service that replaces parts before a breakdown.',zh:'电梯公司提供在故障前更换零件的服务。'},
43:{ko:'제주 돌담이 강한 바람을 견디는 구조적 원리를 설명한 내용이므로 해당 선택지가 정답입니다.',ja:'済州の石垣が強風に耐える構造上の原理を説明した内容なので、この選択肢が正解です。',en:'The structural principle that lets Jeju stone walls withstand strong winds.',zh:'济州石墙抵御强风的结构原理。'},
44:{ko:'바람이 돌 사이의 틈으로 나뉘어 지나간다고 했으므로 해당 내용이 정답입니다.',ja:'風が石の間の隙間を分かれて通り抜けると述べているため、この内容が正解です。',en:'Wind divides and passes through the gaps between the stones.',zh:'风从石头之间的缝隙分流穿过。'},
45:{ko:'균사망을 통해 영양분이 주변 나무로 이동할 수 있다고 했으므로 해당 내용이 정답입니다.',ja:'菌糸ネットワークを通じて栄養分が周囲の木へ移動することがあると述べているため、この内容が正解です。',en:'Nutrients can move to nearby trees through the fungal network.',zh:'营养物质可以通过菌丝网络转移到周围的树木。'},
46:{ko:'연구 결과를 근거로 균사망의 역할을 설명하고 있으므로 해당 선택지가 정답입니다.',ja:'研究結果に基づいて菌糸ネットワークの役割を説明しているため、この選択肢が正解です。',en:'It explains the role of fungal networks based on research findings.',zh:'内容根据研究结果说明菌丝网络的作用。'},
47:{ko:'거점 도서관을 먼저 시범 운영한 뒤 확대 여부를 결정해야 한다고 했으므로 해당 내용이 정답입니다.',ja:'拠点図書館を先に試験運用し、その後で拡大するか決めるべきだと述べているため、この内容が正解です。',en:'Hub libraries should be selected for a pilot, after which expansion can be decided.',zh:'应先选定中心图书馆试点运行，再决定是否扩大。'},
48:{ko:'조건을 검토한 뒤 단계적으로 시행하자는 방안을 제안하고 있으므로 해당 선택지가 정답입니다.',ja:'条件を検討した上で段階的に実施する案を提案しているため、この選択肢が正解です。',en:'It proposes a phased implementation plan after reviewing the conditions.',zh:'内容提出在审查条件后分阶段实施的方案。'},
49:{ko:'개인정보를 제외해도 과거 선택 기록에는 사회적 차이가 반영될 수 있다고 했으므로 해당 내용이 정답입니다.',ja:'個人情報を除いても、過去の選択記録に社会的な差が反映される場合があると述べているため、この内容が正解です。',en:'Even without personal information, past choices may reflect social differences.',zh:'即使去除个人信息，过去的选择记录也可能反映社会差异。'},
50:{ko:'공정성을 단순한 기준 하나로 판단하는 태도를 경계하고 있으므로 해당 선택지가 정답입니다.',ja:'公平性を単純な基準だけで判断することに警鐘を鳴らしているため、この選択肢が正解です。',en:'It warns against judging fairness by a simplistic standard.',zh:'内容警示不要用简单标准判断公平性。'}
};

const TOPIK2_WRITING={
51:{
  ko:'㉠에는 토요일 수업을 오후 2시에 진행할 계획을 쓰고, ㉡에는 그 시간에 참석하기 어려운 사람에게 미리 연락해 달라는 요청을 씁니다. 본문에는 연락 기한이 없으므로 모범답안의 “금요일까지”는 필수 조건이 아닙니다. 안내문이므로 ‘진행할 예정입니다’, ‘연락해 주시기 바랍니다’처럼 높임말과 문장 종결을 완전하게 쓰세요.',
  ja:'㉠には土曜の授業を午後2時に行う予定を、㉡にはその時間に参加できない人へ事前の連絡を求める文を書きます。本文に締め切りはなく、解答例の「金曜まで」は必須条件ではありません。案内文なので「진행할 예정입니다」「연락해 주시기 바랍니다」のような丁寧体で文を完成させます。',
  en:'Blank ㉠ must state the plan to hold Saturday’s class at 2 p.m.; ㉡ should politely ask anyone unable to attend then to contact the organizer in advance. The prompt gives no deadline, so “by Friday” in one model answer is not required. Complete both as full, formal notice sentences, such as “진행할 예정입니다” and “연락해 주시기 바랍니다.”',
  zh:'㉠应写明本周六课程改在下午2点进行的计划；㉡应礼貌地要求届时无法参加的人提前联系。题目没有给出截止日，因此示范答案中的“周五前”不是必要条件。通知文要使用完整敬语句式，如“진행할 예정입니다”“연락해 주시기 바랍니다”。'
},
52:{
  ko:'앞부분은 잦은 알림이 집중을 끊는 문제를 제시합니다. 따라서 ㉠에는 ‘알림을 꺼 두는 것이 좋다’라는 해결책을, ㉡에는 확인 시간을 따로 정하면 집중력을 유지하거나 일에 더 집중할 수 있다는 효과를 써야 합니다.',
  ja:'前半は、頻繁な通知が集中を途切れさせる問題を示しています。したがって㉠には「通知を切っておく」という対策を、㉡には確認時間を別に決めれば集中を保てるという効果を書きます。',
  en:'The first part identifies frequent notifications as the cause of broken concentration. Therefore, ㉠ should propose turning notifications off, and ㉡ should state that checking them only at set times helps maintain concentration or focus better on work.',
  zh:'前文指出频繁通知会打断专注，因此㉠应提出“关闭通知”的办法；㉡应写明另定查看时间有助于保持专注或更集中地工作。'
},
53:{
  ko:'200~300자 안에서 2023년 120만 건과 2025년 185만 건을 비교하고, 출퇴근 비율은 38%에서 52%로 증가한 반면 여가는 45%에서 31%로 감소했다는 변화를 써야 합니다. 이어 대여소 확대와 앱의 실시간 정보 제공을 원인으로 연결하고, 제목은 쓰지 마세요.',
  ja:'200～300字で、利用件数が2023年の120万件から2025年の185万件へ増えたことを比較します。通勤の割合は38％から52％へ増え、余暇は45％から31％へ減った変化を書き、貸出所の増設とアプリのリアルタイム情報を原因として結びます。題名は書きません。',
  en:'In 200–300 Korean characters, compare 1.2 million uses in 2023 with 1.85 million in 2025. State that commuting rose from 38% to 52% while leisure fell from 45% to 31%, then link the change to more rental stations and live availability in the app. Do not add a title.',
  zh:'请在200～300个韩文字内比较2023年的120万次与2025年的185万次；说明通勤用途从38%升至52%，休闲用途从45%降至31%，再把变化与租赁点增加及应用提供实时车辆信息联系起来。不要写标题。'
},
54:{
  ko:'600~700자 안에서 세 과제를 모두 다뤄야 합니다. 짧고 요약된 정보의 이용이 늘어난 이유, 장점과 문제점, 깊이 이해하기 위한 노력을 자신의 생각과 근거로 설명하세요. 시간 절약·접근성과 맥락 누락·오정보 위험은 논의할 수 있는 예시이며 정해진 정답은 아닙니다. 마지막에는 원문 확인, 여러 출처 비교, 다른 관점 읽기처럼 깊이 이해하기 위한 구체적 태도를 제시하세요.',
  ja:'600～700字で三つの課題をすべて扱います。短い情報の利用が増えた理由、長所と問題点、深く理解するための努力を、自分の考えと根拠で説明します。時間の節約や文脈の欠落などは論点の例であり、必ず書くべき唯一の答えではありません。最後に、原文の確認、複数資料の比較、異なる観点を読むことなど、深く理解するための具体策を示します。',
  en:'Cover all three prompts in 600–700 Korean characters. Explain why use of short-form information has grown, discuss benefits and problems, and propose efforts toward deeper understanding using your own supported views. Speed, access, lost context, and misinformation are possible examples, not mandatory positions. Suggest concrete habits, such as checking the original source, comparing reliable sources, and reading opposing views.',
  zh:'请在600～700个韩文字内完整回答三项要求：说明短内容使用增加的原因、优点与问题，并用自己的观点和依据提出深化理解的方法。节省时间、获取方便、语境缺失、误信息都只是可选论点，不是唯一标准答案。最后可提出核对原文、比较多个可靠来源、阅读不同观点等深化理解的具体做法。'
}
};

// Reviewed coaching for immutable generated-bank items. Keys use the stable bank ID so
// answer shuffling can change the displayed position without changing the teaching source.
const MEETING_HOME_COACH={
  shortsFastReview:true,
  ko:{
    short:'“끝난 후에 바로”와 “마치고 곧”은 모두 회의 뒤 즉시 귀가했다는 뜻입니다.',
    reason:'원문의 “회의가 끝난 후에 바로 집에 갔습니다”는 회의가 끝난 뒤 곧바로 귀가했다는 뜻입니다. “회의를 마치고 곧 집으로 갔습니다”도 사건의 순서와 행동이 같습니다.',
    trap:'핵심 함정은 “후에(뒤에)”를 “전에(앞에)”로 뒤집는 것입니다. 운동과 과일 판매 보기는 회의·귀가와 관계없는 내용입니다.',
    strategy:'같은 뜻 고르기에서는 주체, 행동, 시간 순서를 짧게 표시합니다. 이 문장은 ‘회의 종료 → 즉시 귀가’가 모두 유지되는 보기만 남깁니다.',
    choices:{
      '회의 전에 집에 들렀습니다.':'“전에”는 회의 앞을 뜻해 원문의 “끝난 후에”와 시간 순서가 반대이고, “들렀습니다”도 곧장 귀가했다는 행동과 다릅니다.',
      '저는 평일마다 혼자 운동합니다.':'평일 운동 습관은 회의가 끝난 뒤 귀가한 사건과 주제·행동이 모두 다릅니다.',
      '이 가게는 과일을 팔지 않습니다.':'가게의 과일 판매 여부는 회의가 끝난 뒤 귀가한 사건과 아무 관련이 없습니다.'
    }
  },
  ja:{
    short:'「끝난 후에 바로」と「마치고 곧」は、どちらも「会議後すぐ帰宅した」という意味です。',
    reason:'原文の「회의가 끝난 후에 바로 집에 갔습니다」は「会議が終わった後、すぐ家に帰りました」という意味です。「회의를 마치고 곧 집으로 갔습니다」も出来事の順序と行動が同じです。',
    trap:'中心となるひっかけは、「후에（後に）」を「전에（前に）」へ逆転させることです。運動と果物販売の選択肢は、会議後の帰宅とは無関係です。',
    strategy:'言い換え問題では、主体・行動・時間順序を短く確認します。この文では「会議終了 → すぐ帰宅」がすべて保たれる選択肢だけを残します。',
    choices:{
      '회의 전에 집에 들렀습니다.':'「전에」は会議の前を表し、原文の「끝난 후에（終わった後）」と時間順序が逆です。「들렀습니다（立ち寄りました）」も、すぐ帰宅したという行動とは異なります。',
      '저는 평일마다 혼자 운동합니다.':'「平日はいつも一人で運動します」という習慣で、会議後に帰宅した出来事とは話題も行動も異なります。',
      '이 가게는 과일을 팔지 않습니다.':'「この店は果物を売っていません」という内容で、会議後に帰宅した出来事とは無関係です。'
    }
  },
  en:{
    short:'Both “끝난 후에 바로” and “마치고 곧” mean that the speaker went home immediately after the meeting.',
    reason:'The source says the speaker went home immediately after the meeting ended. “회의를 마치고 곧 집으로 갔습니다” preserves both the event order and the action.',
    trap:'The key trap reverses “after” (후에) to “before” (전에). The exercise and fruit-selling choices are unrelated to the meeting and the trip home.',
    strategy:'For a paraphrase, quickly match the subject, action, and time order. Keep only the choice that preserves “meeting ends → immediately goes home.”',
    choices:{
      '회의 전에 집에 들렀습니다.':'“전에” means before the meeting, reversing “끝난 후에” (after it ended). “들렀습니다” also means stopped by, not went straight home.',
      '저는 평일마다 혼자 운동합니다.':'A weekday exercise habit changes both the topic and action from going home after a meeting.',
      '이 가게는 과일을 팔지 않습니다.':'Whether a store sells fruit is unrelated to going home after a meeting.'
    }
  },
  zh:{
    short:'“끝난 후에 바로”和“마치고 곧”都表示“会议结束后马上回家”。',
    reason:'原句表示会议结束后马上回家。“회의를 마치고 곧 집으로 갔습니다”保留了相同的事件顺序和行为。',
    trap:'核心陷阱是把“후에（之后）”改成“전에（之前）”。运动和水果销售两个选项与会后回家无关。',
    strategy:'同义改写题要快速核对主体、行为和时间顺序。本题只保留完整对应“会议结束 → 马上回家”的选项。',
    choices:{
      '회의 전에 집에 들렀습니다.':'“전에”表示会议之前，与原句“끝난 후에（结束之后）”的时间顺序相反；“들렀습니다”表示顺路停留，也不同于直接回家。',
      '저는 평일마다 혼자 운동합니다.':'工作日独自运动的习惯，与会议结束后回家的事件在主题和行为上都不同。',
      '이 가게는 과일을 팔지 않습니다.':'商店是否出售水果，与会议结束后回家的事件无关。'
    }
  }
};
const MEETING_HOME_IDS=['M01-I-R-44','M02-I-R-43','M04-I-R-45','M05-I-R-44','M06-I-R-43','M08-I-R-45','M09-I-R-44','M10-I-R-43','M12-I-R-45'];
const BANK_COACH={
...Object.fromEntries(['M04-II-R-02','M05-II-R-01','M10-II-R-02','M11-II-R-01'].map(id=>[id,{
  ko:{
    reason:'“길어질”은 앞으로 일어날 가능성이고, “미리 … 준비해 두었다”는 그 가능성에 대한 사전 준비입니다. 예상 상황에 준비한다는 “것에 대비해”가 연결됩니다.',
    trap:'“듯이”는 비유·유사성으로 사전 준비의 이유를 나타내지 않습니다. “뿐더러”는 사실에 다른 사실을 더합니다. 여기서는 정보의 추가가 아니라 예상 상황에 미리 대비한 관계가 필요합니다. “바람에”는 “길어지는 바람에”처럼 원인과 결과를 연결하므로, 아직 일어나지 않은 일에 대비하는 이 문맥과 다릅니다.',
    strategy:'“미리·준비하다”를 찾고 앞절이 이미 일어난 원인인지 앞으로 예상하는 상황인지 구분하세요. 예상 상황에 대한 사전 준비라면 “-(으)ㄹ 것에 대비해”를 검토합니다.',
    choices:{'듯이':'비유·유사성을 나타냅니다. 여기서는 회의가 길어질 가능성에 대비해 준비한 이유가 필요합니다.','뿐더러':'사실에 다른 사실을 추가하는 표현입니다. 이 문장에서 필요한 예상 상황과 사전 준비의 관계를 나타내지 못합니다.','바람에':'“길어지는 바람에”처럼 원인과 결과를 연결합니다. 이 문장은 앞으로의 가능성에 대한 사전 준비입니다.'}
  },
  ja:{
    translation:{sentenceLabel:'正解を入れた文の意味',sentence:'会議が長引くことに備えて、必要な資料をすべて前もって用意しておいた。',choiceLabel:'選択肢の意味（表示順）',glosses:{'듯이':'〜のように','것에 대비해':'〜ことに備えて','뿐더러':'〜だけでなく','바람에':'〜ことが原因で'}},
    reason:'「길어질」は今後の可能性、「미리 … 준비해 두었다」はその可能性への事前準備です。予想される状況に備える「것에 대비해」がつながります。',
    trap:'「듯이」はたとえ・類似で、事前準備の理由を表しません。「뿐더러」は事実の追加です。ここでは情報を加える関係ではなく、予想される状況への事前準備を結ぶ必要があります。「바람에」は「길어지는 바람에」のように原因と結果を結び、まだ起きていないことへの備えとは異なります。',
    strategy:'「미리・준비하다」を手掛かりに、前半がすでに起きた原因か、今後予想される状況かを区別します。予想される状況への事前準備なら「-(으)ㄹ 것에 대비해」を検討します。',
    choices:{'듯이':'たとえ・類似を表します。ここでは会議が長引く可能性に備えて準備した理由が必要です。','뿐더러':'ある事実に別の事実を加える表現です。この文で必要な、予想される状況と事前準備の関係を表しません。','바람에':'「길어지는 바람에」のように原因と結果を表します。この文は今後の可能性への事前準備です。'}
  },
  en:{
    translation:{sentenceLabel:'Meaning with the correct answer inserted',sentence:'In anticipation of the meeting running long, I had prepared all the necessary materials in advance.',choiceLabel:'Option meanings (in display order)',glosses:{'듯이':'as if / like','것에 대비해':'in preparation for','뿐더러':'not only / in addition','바람에':'because of / as a result of'}},
    reason:'길어질 describes a future possibility; 미리 … 준비해 두었다 describes advance preparation. 것에 대비해 connects the anticipated situation to preparing for it.',
    trap:'듯이 expresses likeness, not the reason for preparation. 뿐더러 adds another fact. This sentence needs preparation for an anticipated situation, not an additional fact. 바람에 links cause and result, as in 길어지는 바람에; this sentence instead prepares for a future possibility.',
    strategy:'Find 미리 and 준비하다. Distinguish an existing cause from a future possibility. For preparation for an anticipated situation, consider -(으)ㄹ 것에 대비해.',
    choices:{'듯이':'This expresses likeness, not the reason for preparing for a possible long meeting.','뿐더러':'This adds another fact. It does not express the relation between the anticipated situation and the advance preparation required here.','바람에':'A form such as 길어지는 바람에 links cause and result. Here the preparation precedes a possible future event.'}
  },
  zh:{
    translation:{sentenceLabel:'填入正确答案后的句意',sentence:'为应对会议可能延长的情况，我提前准备好了所有需要的资料。',choiceLabel:'选项含义（按显示顺序）',glosses:{'듯이':'好像／像……一样','것에 대비해':'为应对……做准备','뿐더러':'不仅……而且','바람에':'由于……／因……而'}},
    reason:'“길어질”表示将来的可能性，“미리 … 준비해 두었다”表示提前准备。因此应使用表示为预期情况做准备的“것에 대비해”。',
    trap:'“듯이”表示比喻或相似，不能说明提前准备的原因。“뿐더러”表示追加另一事实，而此处需要表达为预期情况提前准备的关系。“바람에”以“길어지는 바람에”等形式连接原因与结果，与为尚未发生的情况提前准备不同。',
    strategy:'找出“미리、준비하다”，区分已经发生的原因与将来可能发生的情况。为预期情况提前准备时，考虑“-(으)ㄹ 것에 대비해”。',
    choices:{'듯이':'表示比喻或相似，不能说明为会议可能延长而提前准备的原因。','뿐더러':'表示在一个事实之外追加另一个事实，不能表达此句所需的预期情况与提前准备之间的关系。','바람에':'以“길어지는 바람에”等形式连接原因与结果。此句表达为将来的可能情况提前准备。'}
  }
}])),
...Object.fromEntries(MEETING_HOME_IDS.map(id=>[id,MEETING_HOME_COACH])),
'M09-I-R-34':{
  ko:{
    reason:'“친구를 만나기”는 카페에 간 목적입니다. 동사 뒤의 “-기 위해서”는 어떤 행동을 하는 목적을 나타내므로 “친구를 만나기 위해서 카페에 갔습니다”가 자연스럽습니다.',
    trap:'“부터”는 시작점을, “처럼”은 유사·비교를 나타냅니다. “때문에만”은 원인에 “오직”이라는 제한까지 더하므로, 만나려는 목적을 말하는 이 문장과 맞지 않습니다.',
    strategy:'뒤 절의 행동으로 무엇을 이루려는지 보세요. 목표를 나타내면 “V-기 위해서”, 그 행동을 하게 된 이유를 나타내면 “-기 때문에”처럼 목적과 원인을 구분합니다.',
    choices:{
      '부터':'시간·장소의 시작점을 나타냅니다. 여기서는 카페에 간 시작점이 아니라 목적이 필요합니다.',
      '처럼':'대상과 비슷함을 나타냅니다. “친구를 만나기”와 “카페에 가기” 사이의 목적 관계를 만들지 못합니다.',
      '때문에만':'원인 표현 “때문에”에 제한의 “만”을 더해 “오직 그것 때문”이라는 뜻입니다. 친구를 만나려는 목적을 나타내지 못합니다.'
    }
  },
  ja:{
    translation:{sentenceLabel:'正解を入れた文の意味',sentence:'友達に会うためにカフェへ行きました。',choiceLabel:'選択肢の意味（表示順）',glosses:{'부터':'〜から','위해서':'〜するために','처럼':'〜のように','때문에만':'〜のせいだけで／〜だけが理由で'}},
    reason:'「친구를 만나기」はカフェへ行った目的です。動詞の後ろの「-기 위해서」は行動の目的を表すため、「친구를 만나기 위해서 카페에 갔습니다」が自然です。',
    trap:'「부터」は始点、「처럼」は類似・比較を表します。「때문에만」は原因に「それだけ」という限定まで加えるため、友達に会うという目的を表すこの文には合いません。',
    strategy:'後半の行動で何を実現したいのかを確認します。目標を表す「V-기 위해서」と、その行動をする理由を表す「-기 때문에」の違いを見ます。',
    choices:{
      '부터':'時間・場所の始点を表します。ここではカフェへ行った始点ではなく、目的が必要です。',
      '처럼':'対象との類似を表します。「友達に会うこと」と「カフェへ行くこと」の間に目的関係を作れません。',
      '때문에만':'原因の「때문에」に限定の「만」を加え、「それだけが理由で」という意味になります。友達に会おうとする目的は表せません。'
    }
  },
  en:{
    translation:{sentenceLabel:'Meaning with the correct answer inserted',sentence:'I went to a cafe in order to meet a friend.',choiceLabel:'Option meanings (in display order)',glosses:{'부터':'from / starting at','위해서':'in order to','처럼':'like / as','때문에만':'only because of'}},
    reason:'친구를 만나기 is the purpose of going to the cafe. V-기 위해서 marks the purpose of an action, so 친구를 만나기 위해서 카페에 갔습니다 is natural.',
    trap:'부터 marks a starting point, while 처럼 marks similarity. 때문에만 adds the restriction “only” to a cause, so it does not express the intended purpose of meeting a friend.',
    strategy:'Ask what the action in the second clause is intended to achieve. Distinguish the intended goal expressed by V-기 위해서 from the reason for an action expressed by -기 때문에.',
    choices:{
      '부터':'This marks a starting point in time or place. The sentence needs the purpose of going to the cafe, not a starting point.',
      '처럼':'This marks similarity. It cannot connect meeting a friend to going to the cafe as purpose and action.',
      '때문에만':'This adds the restrictive 만 to the cause marker 때문에, meaning “only because of that.” It does not express the goal of meeting a friend.'
    }
  },
  zh:{
    translation:{sentenceLabel:'填入正确答案后的句意',sentence:'为了见朋友，我去了咖啡馆。',choiceLabel:'选项含义（按显示顺序）',glosses:{'부터':'从……开始','위해서':'为了……','처럼':'像……一样','때문에만':'只是因为……'}},
    reason:'“친구를 만나기”是去咖啡馆的目的。动词后的“-기 위해서”表示做某事的目的，因此“친구를 만나기 위해서 카페에 갔습니다”最自然。',
    trap:'“부터”表示起点，“처럼”表示相似或比较。“때문에만”在原因表达上又加了“仅仅”的限制，不能表示为了见朋友这一目的。',
    strategy:'先看后半句的动作要实现什么目标。用“V-기 위해서”表示意图实现的目标，用“-기 때문에”表示采取该行动的理由，区分目的与原因。',
    choices:{
      '부터':'表示时间或地点的起点。这里需要的是去咖啡馆的目的，而不是起点。',
      '처럼':'表示与某对象相似，不能把“见朋友”和“去咖啡馆”连接成目的与行动的关系。',
      '때문에만':'在原因表达“때문에”后加限制助词“만”，意为“只是因为这个”。它不能表示想见朋友这一目的。'
    }
  }
},
'M11-I-R-37':{
  ko:{
    reason:'“오른쪽 출입구를 이용해 주세요”가 사용할 출입구를 직접 지시하므로 글의 목적은 출입 안내입니다. “공사 중입니다”는 그 안내가 필요한 배경입니다.',
    trap:'가격 안내에는 금액·할인, 예약 안내에는 신청·일시, 분실물 안내에는 잃어버린 물건·연락처가 필요하지만 본문에는 모두 없습니다.',
    strategy:'상황 설명과 행동 지시를 나누고, “-아/어 주세요·-(으)세요·-지 마세요” 같은 마지막 요청·명령을 목적의 핵심으로 잡습니다.',
    choices:{
      '가격 안내':'금액, 가격표, 할인율이 전혀 없으므로 가격 안내가 아닙니다.',
      '예약 안내':'예약 방법, 신청 기한, 예약 일시가 전혀 없으므로 예약 안내가 아닙니다.',
      '분실물 안내':'잃어버린 물건, 보관 장소, 문의 연락처가 전혀 없으므로 분실물 안내가 아닙니다.'
    }
  },
  ja:{
    reason:'「오른쪽 출입구를 이용해 주세요（右側の出入口をご利用ください）」と利用する入口を直接指示しているため、目的は「출입 안내（出入口の案内）」です。「공사 중입니다（工事中です）」は、その案内が必要な背景です。',
    trap:'「가격 안내」なら金額・割引、「예약 안내」なら申請・日時、「분실물 안내」なら紛失物・連絡先が必要ですが、本文にはどれもありません。',
    strategy:'状況説明と行動指示を分け、「-아/어 주세요」「-(으)세요」「-지 마세요」のような最後の依頼・命令を目的の中心として捉えます。',
    choices:{
      '가격 안내':'金額・価格表・割引率が一つもないため、「가격 안내（価格案内）」ではありません。',
      '예약 안내':'予約方法・申込期限・予約日時が一つもないため、「예약 안내（予約案内）」ではありません。',
      '분실물 안내':'紛失物・保管場所・問い合わせ先が一つもないため、「분실물 안내（遺失物案内）」ではありません。'
    }
  },
  en:{
    reason:'“오른쪽 출입구를 이용해 주세요” directly tells readers to use the right-hand entrance, so the purpose is entrance guidance. “공사 중입니다” only gives the reason that guidance is needed.',
    trap:'Price guidance needs an amount or discount, reservation guidance needs an application or time, and lost-property guidance needs a missing item or contact. None appears here.',
    strategy:'Separate the situation from the requested action. In notices, treat the final request or command, such as “-아/어 주세요,” “-(으)세요,” or “-지 마세요,” as the core purpose.',
    choices:{
      '가격 안내':'There is no amount, price list, or discount, so this is not price guidance.',
      '예약 안내':'There is no booking method, application deadline, or reservation time, so this is not reservation guidance.',
      '분실물 안내':'There is no missing item, storage location, or contact information, so this is not lost-property guidance.'
    }
  },
  zh:{
    reason:'“오른쪽 출입구를 이용해 주세요（请使用右侧出入口）”直接指示应使用哪个出入口，因此文章目的是出入指引。“공사 중입니다（正在施工）”只是需要该指引的背景。',
    trap:'价格通知应有金额或折扣，预约通知应有申请方式或时间，失物通知应有遗失物或联系方式；原文均未出现。',
    strategy:'先区分情况说明和行动指示，再把“-아/어 주세요”“-(으)세요”“-지 마세요”等结尾的请求或命令作为通知的核心目的。',
    choices:{
      '가격 안내':'没有金额、价目表或折扣率，因此不是价格通知。',
      '예약 안내':'没有预约方式、申请期限或预约时间，因此不是预约通知。',
      '분실물 안내':'没有遗失物、保管地点或联系方式，因此不是失物通知。'
    }
  }
}
};

for(const q of window.TOPIK1_LISTENING_DATA||[]){T1_LISTENING[q.id]={ko:q.explanation,...T1_LISTENING[q.id]};q.explanationI18n=T1_LISTENING[q.id]}
for(const q of window.TOPIK1_READING_DATA||[]){T1_READING[q.id]={ko:q.explanation,...T1_READING[q.id]};q.explanationI18n=T1_READING[q.id]}
// TOPIK II reading data already contains individually authored Japanese rationale in `why`.
// Copy it into the shared pack so every explanation route uses the same reviewed source.
if(typeof RW!=='undefined')for(const q of RW){if(Number(q.id)<=50&&TOPIK2_READING[q.id]&&!TOPIK2_READING[q.id].ja)TOPIK2_READING[q.id].ja=q.why||''}
window.MALBIT_EXPLANATIONS={reviewVersion:3,topik1Listening:T1_LISTENING,topik1Reading:T1_READING,topik2Reading:TOPIK2_READING,topik2Listening:TOPIK2_LISTENING,topik2Writing:TOPIK2_WRITING,bankCoach:BANK_COACH};
})();
