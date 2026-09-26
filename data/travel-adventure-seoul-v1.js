// Original learning fiction. Timetables, prices and bookings are scenario data, not travel advice.
(function(){
'use strict';
const t=(ko,ja,en,zh)=>({ko,ja,en,zh});
const scene=(id,place,title,dialogue,clue,prompt,choices,answer,evidence,traps,method,recall)=>({id,place,title,dialogue,clue,prompt,choices,answer,evidence,traps,method,recall});
const d=(speaker,ko,ja,en,zh)=>({speaker,text:t(ko,ja,en,zh)});
window.HARUMAL_ADVENTURE_DATA={id:'seoul-arrival-v1',levels:{
1:[
scene('ADV-I-01','airport',t('출발 시간을 고르다','出発時刻を選ぶ','Choose a departure','选择出发时间'),[
d('traveler','서울역에 두 시까지 가야 해요.','2時までにソウル駅に行かなければなりません。','I need to reach Seoul Station by two.','我需要在两点前到首尔站。'),
d('guide','지금은 한 시예요. 표를 산 후에 지하로 내려가세요.','今は1時です。切符を買ってから地下に降りてください。','It is one now. Buy a ticket, then go downstairs.','现在是一点。买票后请下到地下。'),
d('traveler','어느 기차를 타면 좋을까요?','どの列車に乗ればいいでしょうか。','Which train should I take?','坐哪班车比较好呢？')],
t('A열차 13:10 출발 → 13:55 도착\nB열차 13:30 출발 → 14:15 도착','A列車 13:10発 → 13:55着\nB列車 13:30発 → 14:15着','Train A 13:10 → 13:55\nTrain B 13:30 → 14:15','A列车 13:10出发 → 13:55到达\nB列车 13:30出发 → 14:15到达'),
t('목적에 맞게 직원에게 말해 보세요.','目的に合う返事を選びましょう。','Choose a reply that meets your goal.','请选择符合目的的回答。'),
[t('두 시에 출발하는 표 주세요.','2時に出発する切符をください。','A ticket departing at two, please.','请给我两点出发的票。'),t('한 시 반 기차를 탈게요.','1時半の列車に乗ります。','I will take the one-thirty train.','我坐一点半的车。'),t('한 시 십 분 기차표 주세요.','1時10分の列車の切符をください。','A ticket for one-ten, please.','请给我一点十分的车票。'),t('세 시까지 기다릴게요.','3時まで待ちます。','I will wait until three.','我等到三点。')],2,
t('“두 시까지”는 도착의 마감입니다. A는 13:55에 도착하므로 14:00 전에 갈 수 있습니다.','「두 시까지」は到着の期限です。Aは13:55着なので14:00に間に合います。','“By two” is the arrival deadline. A arrives at 13:55, before 14:00.','“两点前”是到达期限。A车13:55到达，早于14:00。'),
[t('출발 시간을 도착 마감과 혼동했습니다.','出発時刻と到着期限を取り違えています。','Departure time is confused with the arrival deadline.','把出发时间和到达期限混淆了。'),t('B는 14:15 도착이라 15분 늦습니다.','Bは14:15着で、15分遅れます。','B arrives at 14:15, fifteen minutes late.','B车14:15到达，晚了15分钟。'),null,t('세 시는 도착해야 하는 두 시보다 늦습니다.','3時は到着期限の2時より後です。','Three is already after the two o’clock deadline.','三点已经晚于两点的到达期限。')],
t('“까지”의 기준이 출발인지 도착인지 먼저 정하고 시간표를 비교하세요.','「까지」が出発と到着のどちらを指すか確かめて時刻表を比べましょう。','Identify what “by” limits, then compare arrival times.','先确定“之前”限制的是出发还是到达，再比较时刻表。'),
{prompt:t('두 시 전에 서울역에 도착해야 합니다. 직원에게 목적을 말해 보세요.','2時までにソウル駅へ着く必要があります。係員に目的を伝えてください。','Tell the clerk you need to reach Seoul Station by two.','请告诉工作人员你需要在两点前到首尔站。'),model:'서울역에 두 시까지 가야 해요.'}),
scene('ADV-I-02','arex',t('잃어버린 가방','忘れたかばん','The missing bag','遗失的包'),[
d('traveler','기차에 가방을 두고 내렸어요.','列車にかばんを置いて降りてしまいました。','I left my bag on the train.','我把包落在车上就下车了。'),
d('guide','어떤 가방이에요? 안에 무엇이 있어요?','どんなかばんですか。中に何が入っていますか。','What does it look like? What is inside?','是什么样的包？里面有什么？'),
d('traveler','파란 가방이고 책 두 권이 있어요. 우산은 없어요.','青いかばんで、本が2冊あります。傘はありません。','It is blue, with two books. There is no umbrella.','是蓝色的包，里面有两本书，没有伞。')],
t('보관 물품\n가: 파란 가방 / 책 2권\n나: 파란 가방 / 우산 1개\n다: 검은 가방 / 책 2권','預かり品\n가：青いかばん／本2冊\n나：青いかばん／傘1本\n다：黒いかばん／本2冊','Found items\n가: blue bag / 2 books\n나: blue bag / 1 umbrella\n다: black bag / 2 books','保管物品\n가：蓝包／两本书\n나：蓝包／一把伞\n다：黑包／两本书'),
t('내 가방을 찾아 말해 보세요.','自分のかばんを伝えましょう。','Identify your bag to the clerk.','请指出自己的包。'),
[t('‘가’ 가방이 제 거예요.','「가」のかばんが私のです。','Bag 가 is mine.','“가”的包是我的。'),t('‘나’ 가방이 제 거예요.','「나」のかばんが私のです。','Bag 나 is mine.','“나”的包是我的。'),t('‘다’ 가방이 제 거예요.','「다」のかばんが私のです。','Bag 다 is mine.','“다”的包是我的。'),t('파란 가방 두 개가 다 제 거예요.','青いかばん2つとも私のです。','Both blue bags are mine.','两个蓝包都是我的。')],0,
t('“파란 가방”과 “책 두 권”을 모두 만족하는 물품은 ‘가’뿐입니다.','「青いかばん」と「本2冊」の両方が合うのは「가」だけです。','Only 가 matches both the blue bag and the two books.','只有“가”同时符合蓝包和两本书。'),
[null,t('색은 같지만 내용물이 우산입니다.','色は同じですが、中身は傘です。','The color matches, but it contains an umbrella.','颜色相同，但里面是伞。'),t('책은 맞지만 가방 색이 검정입니다.','本は合いますが、かばんは黒です。','The books match, but the bag is black.','书符合，但包是黑色的。'),t('‘나’에는 없다고 한 우산이 있어 두 개 모두 내 것은 아닙니다.','「나」には入っていないはずの傘があるため、両方ではありません。','나 has the umbrella you said was absent, so both cannot be yours.','“나”里有你说没有的伞，因此不可能两个都是你的。')],
t('색·수량·내용물처럼 여러 조건을 하나씩 대조하세요.','色・数・中身など、条件を一つずつ照合しましょう。','Check each condition: color, quantity and contents.','逐一核对颜色、数量和内容物。'),
{prompt:t('기차에서 내린 뒤 가방을 두고 온 것을 알았습니다. 직원에게 말해 보세요.','降車後、かばんを列車に忘れたと気づきました。係員に伝えてください。','Tell the clerk that you left your bag on the train.','请告诉工作人员你把包落在车上了。'),model:'기차에 가방을 두고 내렸어요.'}),
scene('ADV-I-03','seoulStation',t('출구가 바뀌었다','出口が変わった','A different exit','出口变了'),[
d('traveler','호텔에 가려면 어디로 나가야 해요?','ホテルへ行くにはどこから出ればいいですか。','Which exit leads to the hotel?','去酒店应该从哪里出去？'),
d('guide','원래는 2번 출구가 가까워요. 그런데 오늘은 공사 중이에요.','普段は2番出口が近いです。でも今日は工事中です。','Exit 2 is normally closest, but it is under construction today.','平时2号出口最近，但今天在施工。'),
d('traveler','그럼 다른 출구로 가야겠네요.','それなら別の出口へ行く必要がありますね。','Then I need to use another exit.','那我得走别的出口了。')],
t('오늘 2번 출구 이용 불가\n호텔 방면: 3번 출구 → 오른쪽으로 100m','本日2番出口は利用不可\nホテル方面：3番出口 → 右へ100m','Exit 2 closed today\nHotel: Exit 3 → 100 m to the right','今天2号出口无法使用\n酒店方向：3号出口 → 向右100米'),
t('안내에 맞는 이동 계획을 말해 보세요.','案内に合う行き方を選びましょう。','Choose the plan that follows the notice.','请选择符合指示的路线。'),
[t('2번 출구에서 오른쪽으로 갈게요.','2番出口から右へ行きます。','I will turn right from Exit 2.','我从2号出口向右走。'),t('3번 출구에서 왼쪽으로 갈게요.','3番出口から左へ行きます。','I will turn left from Exit 3.','我从3号出口向左走。'),t('2번 출구 앞에서 기다릴게요.','2番出口の前で待ちます。','I will wait at Exit 2.','我在2号出口前等。'),t('3번 출구로 나가서 오른쪽으로 갈게요.','3番出口を出て右へ行きます。','I will leave through Exit 3 and turn right.','我从3号出口出去后向右走。')],3,
t('오늘은 2번 출구를 쓸 수 없습니다. 안내문의 “3번 출구”와 “오른쪽”을 함께 따라야 합니다.','今日は2番出口が使えません。「3番出口」と「右」の両方に従います。','Exit 2 is unavailable today. Follow both “Exit 3” and “right.”','今天不能用2号出口，必须同时遵循“3号出口”和“右侧”。'),
[t('방향은 맞지만 오늘 닫힌 출구입니다.','方向は合っていますが、今日は閉鎖中の出口です。','The direction is right, but the exit is closed today.','方向正确，但出口今天关闭。'),t('출구는 맞지만 방향이 반대입니다.','出口は合っていますが、方向が逆です。','The exit is right, but the direction is reversed.','出口正确，但方向相反。'),t('공사 중인 곳에서 기다리라는 안내는 없습니다.','工事中の場所で待つという案内はありません。','The notice does not tell you to wait at the construction area.','指示没有让你在施工处等待。'),null],
t('“원래”와 “오늘”을 구분하고 현재 가능한 경로를 고르세요.','「普段」と「今日」を区別し、今使える経路を選びましょう。','Separate the usual route from today’s available route.','区分平时和今天，选择现在能走的路线。'),
{prompt:t('호텔로 가는 출구를 모릅니다. 직원에게 물어보세요.','ホテルへ行く出口が分かりません。係員に尋ねてください。','Ask a staff member which way to leave for the hotel.','请向工作人员询问去酒店该从哪里出去。'),model:'호텔에 가려면 어디로 나가야 해요?'}),
scene('ADV-I-04','myeongdong',t('체크인 전의 부탁','チェックイン前のお願い','Before check-in','入住前的请求'),[
d('traveler','예약했는데 지금 방에 들어갈 수 있어요?','予約しましたが、今部屋に入れますか。','I have a reservation. Can I enter my room now?','我预订了，现在可以进房间吗？'),
d('guide','지금 두 시예요. 방 청소가 세 시에 끝나요.','今は2時です。部屋の掃除は3時に終わります。','It is two now. Room cleaning finishes at three.','现在是两点，房间三点打扫完。'),
d('traveler','그동안 점심을 먹고 올게요. 가방이 좀 무거워요.','その間に昼食を食べてきます。かばんが少し重いです。','I will get lunch meanwhile. My bag is rather heavy.','我先去吃午饭。包有点重。')],
t('체크인 15:00부터\n체크인 전 가방 무료 보관 가능','チェックインは15:00から\nチェックイン前のかばん預かり無料','Check-in from 15:00\nFree bag storage before check-in','15:00起办理入住\n入住前可免费寄存行李'),
t('점심을 먹으러 가기 전에 무엇을 부탁하면 좋을까요?','昼食に出かける前に、何を頼みますか。','What should you ask before going to lunch?','去吃午饭前应该提出什么请求？'),
[t('방 청소를 내일 해 주세요.','部屋の掃除は明日にしてください。','Please clean the room tomorrow.','请明天打扫房间。'),t('세 시까지 가방을 맡아 주시겠어요?','3時までかばんを預かっていただけますか。','Could you keep my bag until three?','能帮我保管包到三点吗？'),t('가방을 새로 사 주세요.','かばんを新しく買ってください。','Please buy me a new bag.','请给我买一个新包。'),t('지금 체크아웃하고 싶어요.','今チェックアウトしたいです。','I want to check out now.','我现在想退房。')],1,
t('방은 세 시부터 이용할 수 있고 가방 보관은 가능합니다. 무거운 가방을 맡기면 점심을 먹으러 갈 수 있습니다.','部屋は3時からですが、かばんは預けられます。預ければ身軽に昼食へ行けます。','The room is available from three, but storage is available now. Leaving the heavy bag lets you go to lunch.','三点才能用房间，但现在可以寄存。寄存重包后就可以去吃午饭。'),
[t('청소 일정 변경은 가방이 무겁다는 문제를 해결하지 않습니다.','掃除の日を変えても、重いかばんの問題は解決しません。','Moving the cleaning date does not solve the heavy bag problem.','更改打扫日期不能解决包重的问题。'),null,t('가방 구매가 아니라 잠시 보관이 필요한 상황입니다.','購入ではなく、一時的な預かりが必要な場面です。','You need temporary storage, not a new bag.','这里需要临时寄存，不是买新包。'),t('체크아웃은 숙박을 마치고 나가는 절차입니다. 아직 체크인 전입니다.','チェックアウトは宿泊を終える手続きです。まだチェックイン前です。','Check-out ends a stay; you have not checked in yet.','退房是结束住宿的手续，现在还没有入住。')],
t('불편한 점과 이용 가능한 서비스를 연결해 부탁을 고르세요.','困っていることと利用できるサービスを結びつけましょう。','Match the problem with an available service.','把遇到的问题和可用服务联系起来。'),
{prompt:t('방에 들어가기 전까지 가방 보관을 정중하게 부탁해 보세요.','部屋に入るまでかばんを預かってもらうよう、丁寧に頼んでください。','Politely ask the clerk to keep your bag until three.','请礼貌地请求工作人员保管包到三点。'),model:'세 시까지 가방을 맡아 주시겠어요?'})
],
2:[
scene('ADV-II-01','airport',t('변경된 승차 안내','変更された乗車案内','A changed boarding notice','变更的乘车通知'),[
d('guide','예약하신 열차는 선로 점검으로 운행이 취소되었습니다.','ご予約の列車は線路点検のため運休になりました。','Your reserved train has been cancelled for a track inspection.','您预订的列车因线路检查而取消。'),
d('traveler','서울역에서 약속이 있어서 늦어도 세 시까지는 도착해야 해요.','ソウル駅で約束があり、遅くとも3時には着かなければなりません。','I have an appointment at Seoul Station and must arrive by three at the latest.','我在首尔站有约，最晚必须在三点前到达。'),
d('guide','추가 요금 없이 다음 직통열차로 바꾸시거나, 환불 후 일반열차 표를 구매하실 수 있습니다.','追加料金なしで次の直通列車に変更するか、払い戻し後に一般列車の切符を購入できます。','You can change to the next express at no extra charge, or get a refund and buy an all-stop ticket.','您可免费改签下一班直达车，或退款后购买普通列车票。')],
t('다음 직통열차 도착 15:20\n일반열차 도착 14:50\n기존 예약표는 일반열차에서 사용할 수 없음','次の直通列車：15:20着\n一般列車：14:50着\n予約済みの切符では一般列車に乗車不可','Next express arrives 15:20\nAll-stop arrives 14:50\nYour existing ticket is not valid on the all-stop train','下一班直达车15:20到达\n普通列车14:50到达\n现有预订票不能用于普通列车'),
t('약속과 이용 조건을 모두 고려한 응답을 고르세요.','約束と利用条件の両方に合う返答を選びましょう。','Choose a reply that satisfies the deadline and ticket conditions.','请选择同时符合约定时间和乘车条件的回答。'),
[t('추가 요금이 없으니 다음 직통열차로 바꿔 주세요.','追加料金がないので次の直通列車に変更してください。','Please change it to the next express since there is no extra charge.','既然不加钱，请改签下一班直达车。'),t('예약표를 그대로 가지고 일반열차에 타겠습니다.','予約済みの切符のまま一般列車に乗ります。','I will use my existing ticket on the all-stop train.','我就拿原预订票坐普通列车。'),t('예약표를 환불한 뒤 일반열차 표를 사겠습니다.','払い戻しを受けてから一般列車の切符を買います。','I will get a refund, then buy an all-stop ticket.','我先退掉预订票，再买普通列车票。'),t('점검이 끝날 때까지 취소된 열차를 기다리겠습니다.','点検が終わるまで運休になった列車を待ちます。','I will wait for the cancelled train until the inspection ends.','我会等检查结束，再坐已取消的车。')],2,
t('“늦어도 세 시”가 우선 조건입니다. 14:50 도착편을 이용하되 예약표가 호환되지 않으므로 환불과 새 표 구매가 필요합니다.','「遅くとも3時」が優先条件です。14:50着の列車を選び、切符が共通ではないため払い戻しと買い直しをします。','“By three at the latest” is the constraint. Choose the 14:50 arrival and replace the ticket because the existing one is not valid.','“最晚三点”是优先条件。选择14:50到达的车，因原票不通用，需要退款后另买。'),
[t('무료 변경은 가능하지만 15:20 도착은 약속 조건을 어깁니다.','無料変更はできますが、15:20着では期限を過ぎます。','The free change is allowed, but 15:20 misses the deadline.','免费改签是可以的，但15:20到达超时。'),t('도착 시간은 맞아도 기존 예약표를 쓸 수 없다는 제한에 어긋납니다.','到着時刻は合っても、予約済みの切符が使えない条件に反します。','The time fits, but the existing ticket is explicitly invalid.','时间符合，但违反了原票不能使用的限制。'),null,t('취소된 열차의 재운행 시각은 제시되지 않았습니다.','運休列車の再開時刻は示されていません。','No restart time is given for the cancelled train.','没有给出取消列车恢复运行的时间。')],
t('선호 조건(추가 요금 없음)과 필수 조건(도착 마감)을 나누고 예외·제한도 확인하세요.','希望条件（追加料金なし）と必須条件（到着期限）を分け、制限も確認しましょう。','Separate preferences from hard constraints, then check exceptions.','区分偏好（不加钱）和必要条件（到达期限），再核对限制。'),
{prompt:t('기존 표를 환불하고 다른 열차 표를 사겠다는 계획을 말해 보세요.','予約済みの切符を払い戻し、一般列車の切符を買う予定を伝えてください。','Say that you will refund the reservation and buy an all-stop ticket.','请说明先退预订票、再买普通列车票的计划。'),model:'예약표를 환불한 뒤 일반열차 표를 사겠습니다.'}),
scene('ADV-II-02','arex',t('방송 뒤의 요청','放送に込められたお願い','What the announcement asks','广播中的请求'),[
d('traveler','짐이 무거워서 문 옆에 잠깐 놓았어요.','荷物が重くて、ドアの横に少し置きました。','My luggage was heavy, so I put it beside the door.','行李太重，我暂时放在门旁边了。'),
d('guide','다음 역에서는 내리시는 분이 많습니다. 출입문 주변에 두신 짐을 확인해 주시기 바랍니다.','次の駅では降りる方が多くいます。ドア付近に置いたお荷物をご確認ください。','Many passengers leave at the next station. Please check any luggage placed around the doors.','下一站下车的乘客较多，请检查放在车门附近的行李。'),
d('traveler','저는 두 정거장 더 가야 하는데, 어떻게 하는 게 좋을까요?','私はあと2駅先まで行くのですが、どうすればいいでしょうか。','I still have two stops to go. What should I do?','我还要坐两站，该怎么办呢？')],
t('통로와 출입문은 비워 주세요.\n큰 짐은 객실 안쪽 짐칸을 이용해 주세요.','通路とドア付近は空けてください。\n大きな荷物は車内奥の荷物置き場へ。','Keep aisles and doors clear.\nUse the luggage area inside the carriage for large bags.','请保持通道和车门附近畅通。\n大件行李请放在车厢里面的行李架。'),
t('방송의 의도에 맞게 응답하세요.','放送の意図に合う行動を選びましょう。','Respond to the purpose of the announcement.','请选择符合广播意图的回应。'),
[t('내리는 분들에게 방해되지 않도록 짐을 안쪽으로 옮기겠습니다.','降りる方の邪魔にならないよう、荷物を奥へ移します。','I will move my luggage inside so it does not block people leaving.','我会把行李移到里面，避免妨碍下车的乘客。'),t('제 짐이 맞는지 확인했으니 그대로 두겠습니다.','自分の荷物だと確認したので、そのまま置きます。','I have checked that it is mine, so I will leave it there.','确认是我的行李后，我就原样放着。'),t('방송이 나왔으니 다음 역에서 무조건 내리겠습니다.','放送があったので、必ず次の駅で降ります。','Since there was an announcement, I must leave at the next stop.','既然广播说了，我一定要在下一站下车。'),t('짐이 무거우니 내리는 분들이 돌아가면 됩니다.','荷物が重いので、降りる方が回り道をすればいいです。','My bag is heavy, so passengers can go around it.','行李很重，让下车的人绕过去就行。')],0,
t('“내리시는 분이 많다”가 요청의 이유입니다. “짐을 확인”은 소유 확인에 그치지 않고 통행을 막는 짐을 옮겨 달라는 문맥입니다.','「降りる人が多い」が依頼の理由です。「荷物の確認」は持ち主の確認だけでなく、通行を妨げる荷物を動かす意図です。','The reason is that many people will exit. “Check your luggage” calls for clearing the doorway, not merely identifying ownership.','“下车的人多”是提出请求的原因。“检查行李”在此意为移走挡路的行李，而不只是确认归属。'),
[null,t('“확인”만 문자 그대로 읽고 통행을 확보하려는 목적을 놓쳤습니다.','「確認」を字面だけで捉え、通行を確保する目的を見落としています。','This reads “check” literally and misses the aim of clearing passage.','只按字面理解“检查”，忽略了保持通行的目的。'),t('짐을 옮기라는 요청이지 모든 승객에게 하차를 요구한 것이 아닙니다.','荷物を移す依頼であり、全員への降車指示ではありません。','The request concerns luggage, not making every passenger leave.','这是移动行李的请求，不是让所有人下车。'),t('다른 사람이 우회하게 하면 통로를 비우라는 안내를 따르지 않습니다.','人に迂回させても、通路を空ける案内には従っていません。','Making others detour does not keep the aisle clear.','让别人绕路并没有遵守保持通道畅通的要求。')],
t('정중한 요청은 앞에 나온 이유와 함께 읽고 상대가 원하는 실제 행동을 찾으세요.','丁寧な依頼は直前の理由と合わせ、求められる行動を考えましょう。','Read polite requests with their reason to infer the intended action.','结合前面的理由理解礼貌请求，找出对方希望采取的实际行动。'),
{prompt:t('다른 승객이 내릴 수 있도록 짐을 옮기겠다고 말해 보세요.','降りる人の邪魔にならないよう荷物を移すと伝えてください。','Say you will move the luggage so others can get off.','请说明会移动行李，以免妨碍其他乘客下车。'),model:'내리는 분들에게 방해되지 않도록 짐을 안쪽으로 옮기겠습니다.'}),
scene('ADV-II-03','seoulStation',t('안내문에서 예외 찾기','案内の例外を見つける','Find the exception','找出通知中的例外'),[
d('traveler','유모차가 있어서 계단을 이용하기 어려워요.','ベビーカーがあるので階段は使いにくいです。','I have a stroller, so stairs are difficult.','我带着婴儿车，不方便走楼梯。'),
d('guide','1번 출구 승강기는 점검 중입니다. 4번 출구에도 승강기가 있습니다.','1番出口のエレベーターは点検中です。4番出口にもあります。','The Exit 1 lift is under inspection. There is also one at Exit 4.','1号出口电梯正在检修，4号出口也有电梯。'),
d('traveler','4번 출구는 폐쇄라는 안내를 봤는데 이용할 수 있나요?','4番出口は閉鎖という案内を見ましたが、使えますか。','I saw a notice saying Exit 4 is closed. Can I use it?','我看到4号出口关闭的通知，还能使用吗？')],
t('4번 출구 계단은 공사로 폐쇄합니다.\n단, 승강기는 정상 운영하니 교통약자는 승강기 통로를 이용해 주십시오.','4番出口の階段は工事で閉鎖します。\nただしエレベーターは通常運転しています。移動に配慮が必要な方はエレベーター通路をご利用ください。','Exit 4 stairs are closed for construction.\nHowever, the lift operates normally. Passengers needing step-free access should use the lift passage.','4号出口楼梯因施工关闭。\n但电梯正常运行，行动不便的乘客请走电梯通道。'),
t('안내문의 적용 범위를 정확히 이해한 응답을 고르세요.','案内の適用範囲を正しく理解した返答を選びましょう。','Choose the reply that correctly interprets what is closed.','请选择正确理解关闭范围的回答。'),
[t('4번 출구는 모든 시설이 폐쇄되었군요.','4番出口はすべての設備が閉鎖されたのですね。','So every facility at Exit 4 is closed.','原来4号出口的所有设施都关闭了。'),t('승강기가 정상 운영되니 계단도 이용할 수 있겠네요.','エレベーターが動いているので、階段も使えますね。','Since the lift works, the stairs must be usable too.','既然电梯正常，那楼梯也能用了吧。'),t('1번 출구 승강기 점검이 끝났다는 뜻이군요.','1番出口の点検が終わったという意味ですね。','That means the Exit 1 lift inspection is finished.','意思是1号出口电梯检修结束了。'),t('4번 출구의 계단만 닫혔으니 승강기 통로로 가겠습니다.','4番出口は階段だけ閉鎖なので、エレベーター通路へ行きます。','Only the stairs at Exit 4 are closed, so I will take the lift passage.','4号出口只是楼梯关闭，我走电梯通道。')],3,
t('폐쇄 대상은 “계단”입니다. “단” 뒤의 예외에서 승강기는 정상 운영한다고 명시했습니다.','閉鎖対象は「階段」です。「ただし」以降でエレベーターの通常運転を明示しています。','“Stairs” defines the closure. The exception after “however” explicitly keeps the lift open.','关闭对象是楼梯。“但”后面的例外明确说明电梯正常运行。'),
[t('계단에만 적용되는 폐쇄를 모든 시설로 확대했습니다.','階段だけの閉鎖を、全設備に広げています。','This expands a stairs-only closure to all facilities.','把只针对楼梯的关闭扩大到了全部设施。'),t('승강기 예외를 계단에도 적용했습니다. 계단 폐쇄는 그대로입니다.','エレベーターの例外を階段にも当てはめています。階段は閉鎖中です。','The lift exception does not reopen the stairs.','把电梯的例外套到了楼梯上，楼梯仍然关闭。'),t('4번 출구 안내로 1번 출구 점검 종료를 추론할 수 없습니다.','4番出口の案内から1番出口の点検終了は判断できません。','An Exit 4 notice says nothing about the Exit 1 inspection ending.','不能从4号出口的通知推断1号出口检修结束。'),null],
t('“단·다만·제외” 뒤의 예외가 어느 대상에만 적용되는지 확인하세요.','「ただし・除く」などの例外がどの対象に適用されるか確認しましょう。','Check exactly which item an exception applies to.','确认“但、除外”等例外具体适用于哪个对象。'),
{prompt:t('계단은 닫혔지만 승강기는 열려 있음을 이해하고 이동 계획을 말해 보세요.','階段のみ閉鎖と分かりました。エレベーターへ向かう予定を伝えてください。','State your plan after learning that only the Exit 4 stairs are closed.','得知4号出口仅楼梯关闭后，请说明你的行动计划。'),model:'4번 출구의 계단만 닫혔으니 승강기 통로로 가겠습니다.'}),
scene('ADV-II-04','myeongdong',t('예약 조건을 확인하다','予約条件を確かめる','Check the booking conditions','确认预订条件'),[
d('traveler','일정이 바뀌어서 내일 하루 더 묵고 싶습니다.','予定が変わったので、明日もう1泊したいです。','My plans changed, so I would like to stay one more night tomorrow.','行程有变，我想明天再住一晚。'),
d('guide','같은 종류의 방은 남아 있지만, 지금 방은 내일 다른 예약이 있습니다.','同じタイプの部屋はありますが、今のお部屋には明日別の予約が入っています。','The same room type is available, but your current room is booked tomorrow.','同类型的房间还有，但您现在的房间明天已有其他预订。'),
d('traveler','방을 옮겨도 괜찮습니다. 연장하면 조식도 포함되나요?','部屋が変わっても大丈夫です。延泊にも朝食は含まれますか。','I do not mind moving rooms. Is breakfast included in the extension?','换房间也可以，续住也包含早餐吗？')],
t('추가 숙박: 동일 객실 유형, 다른 방으로 이동\n추가 1박 요금에는 조식 불포함\n기존 예약의 조식 혜택은 기존 숙박일에만 적용','延泊：同タイプの別室へ移動\n追加1泊料金には朝食なし\n元の予約の朝食特典は元の宿泊日に限る','Extra night: same room type, different room\nBreakfast not included in the extra-night rate\nOriginal breakfast benefit applies only to original stay dates','续住：换到同类型的其他房间\n增加一晚的费用不含早餐\n原预订的早餐优惠仅适用于原住宿日期'),
t('연장 조건을 모두 정확히 확인하는 응답을 고르세요.','延泊条件をすべて正しく確認する返答を選びましょう。','Confirm all the extension conditions accurately.','请选择准确确认全部续住条件的回答。'),
[t('같은 방에 계속 머물고 조식도 포함되는 거죠?','同じ部屋に泊まり続け、朝食も付くのですね。','I stay in the same room and breakfast is included, right?','继续住原房间，也含早餐，对吧？'),t('방은 옮겨야 하고, 추가 숙박일의 조식은 별도라는 말씀이시죠?','部屋は移動し、延泊日の朝食は別ということですね。','I need to change rooms, and breakfast for the extra night is separate, correct?','也就是说要换房，续住那天的早餐另算，对吗？'),t('방만 옮기면 기존 조식 혜택도 자동으로 연장되는군요.','部屋を移れば、元の朝食特典も自動延長ですね。','Moving rooms automatically extends my breakfast benefit.','只要换房，原来的早餐优惠就自动延长了。'),t('조식이 없으니 추가 숙박도 불가능하다는 뜻이군요.','朝食が付かないので延泊もできないという意味ですね。','No breakfast means I cannot extend the stay.','不含早餐就意味着不能续住。')],1,
t('“같은 종류”는 같은 방 번호라는 뜻이 아닙니다. 방 이동이 필요하고 “기존 숙박일에만”이라는 범위 제한 때문에 추가 날짜에는 조식이 포함되지 않습니다.','「同じタイプ」は同じ部屋番号ではありません。部屋移動が必要で、朝食特典は「元の宿泊日のみ」なので延泊日には付きません。','The same room type is not the same room. You must move, and the “original dates only” restriction excludes breakfast for the extra night.','同类型并非同一房间。需要换房，且“仅限原住宿日”的限制排除了续住日期的早餐。'),
[t('방 이동과 조식 불포함이라는 두 조건을 모두 뒤집었습니다.','部屋移動と朝食なしの両条件を逆に捉えています。','This reverses both the room-change and breakfast conditions.','把换房和不含早餐两个条件都理解反了。'),null,t('기존 날짜에만 적용되는 혜택을 추가 날짜까지 확장했습니다.','元の日付だけの特典を延泊日まで広げています。','This extends a date-limited benefit to an extra day.','把仅限原日期的优惠扩展到了新增日期。'),t('조식 불포함과 숙박 불가능은 다른 조건입니다. 남은 방은 있습니다.','朝食が付かないことと延泊不可は別です。空室はあります。','Excluding breakfast does not forbid the stay; a room is available.','不含早餐不等于不能住宿，还有空房。')],
t('비슷한 명사(방·방 종류)를 구분하고 “만”이 제한하는 날짜·대상을 표시하세요.','似た名詞（部屋・部屋タイプ）を区別し、「のみ」が限定する日付や対象を確認しましょう。','Distinguish room from room type, and mark what “only” limits.','区分房间与房型，找出“仅”限制的日期和对象。'),
{prompt:t('연장 숙박 때 방 이동과 조식 별도 조건을 정중하게 재확인해 보세요.','延泊の部屋移動と朝食別の条件を、丁寧に確認してください。','Politely confirm the room change and separate breakfast for the extra night.','请礼貌地再次确认续住要换房、早餐另算的条件。'),model:'방은 옮겨야 하고, 추가 숙박일의 조식은 별도라는 말씀이시죠?'})
]}};
})();
