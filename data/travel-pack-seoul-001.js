// MALBIT Travel Mode · Seoul Route 001
(function(){
  'use strict';

  const text=(ko,ja,en,zh)=>Object.freeze({ko,ja,en,zh});

  const episode=Object.freeze({
    id:'case-001-missing-ticket',
    version:2,
    level:1,
    badge:'SEOUL 001',
    title:text('서울 첫 여행','ソウルはじめて旅','First Seoul Journey','首尔初次旅行'),
    subtitle:text('서울역에서 광화문까지, 한국어로 길을 열어 보세요.','ソウル駅から光化門まで、韓国語で道をひらこう。','Open the route from Seoul Station to Gwanghwamun in Korean.','从首尔站到光化门，用韩语开启路线。'),
    description:text('서울역·시청·광화문을 이동하며 6개의 여행 퀘스트와 무료 아바타 보상을 완료하세요.','ソウル駅・市庁・光化門を巡り、6つの旅クエストと無料アバター報酬を達成しよう。','Travel through Seoul Station, City Hall, and Gwanghwamun, clearing six quests and free avatar rewards.','游览首尔站、市厅和光化门，完成6个旅行任务并获得免费头像奖励。'),
    duration:text('약 8분','約8分','About 8 min','约8分钟'),
    questionCount:6,
    cover:Object.freeze({emoji:'🗺️',accent:'#43c9a8'}),
    map:Object.freeze({
      stops:Object.freeze([
        Object.freeze({id:'seoul-station',icon:'🚉',unlockAt:0,name:text('서울역','ソウル駅','Seoul Station','首尔站')}),
        Object.freeze({id:'city-hall',icon:'🏛️',unlockAt:2,name:text('시청','市庁','City Hall','市厅')}),
        Object.freeze({id:'gwanghwamun',icon:'🏯',unlockAt:4,name:text('광화문','光化門','Gwanghwamun','光化门')})
      ])
    }),
    skins:Object.freeze([
      Object.freeze({id:'traveler-blue',icon:'🧢',accent:'#4b8df8',unlock:'default',name:text('파란 여행자','青い旅人','Blue Traveler','蓝色旅人')}),
      Object.freeze({id:'seoul-sunset',icon:'🌇',accent:'#f17c5a',unlock:'clear',name:text('서울 노을','ソウル夕焼け','Seoul Sunset','首尔晚霞')}),
      Object.freeze({id:'hanbok-night',icon:'🌙',accent:'#8d70e8',unlock:'perfect',name:text('한복의 밤','韓服の夜','Hanbok Night','韩服之夜')})
    ]),
    rewardSkin:'seoul-sunset',
    perfectSkin:'hanbok-night',
    scenes:Object.freeze([
      Object.freeze({
        id:'briefing',type:'narrative',chapter:1,next:'approach',stop:'seoul-station',
        location:text('오전 10:00 · 서울역','午前10:00・ソウル駅','10:00 AM · Seoul Station','上午10:00 · 首尔站'),
        title:text('서울에 도착했다!','ソウルに着いた！','Welcome to Seoul!','到首尔了！'),
        korean:'“어서 와! 광화문에서 만나자. 천천히 와도 돼.”',
        support:text('친구 유나를 만나러 서울역에서 광화문까지 이동합니다. 한국어 미션을 풀면 다음 장소와 여행 스탬프가 열립니다.','友だちのユナに会うため、ソウル駅から光化門へ向かいます。韓国語ミッションを解くと次の場所と旅スタンプが開きます。','Travel from Seoul Station to Gwanghwamun to meet Yuna. Korean missions unlock the next place and a travel stamp.','从首尔站前往光化门见尤娜。完成韩语任务即可解锁下一地点和旅行印章。')
      }),
      Object.freeze({
        id:'approach',type:'choice',chapter:1,next:'q-topic',stop:'seoul-station',
        location:text('서울역 · 여행 안내판','ソウル駅・旅の案内板','Seoul Station · Travel board','首尔站 · 旅行指南'),
        title:text('먼저 무엇을 확인할까?','最初に何を確認する？','What will you check first?','先确认什么？'),
        korean:'서울역에서 첫 행동을 고르자.',
        support:text('선택한 순서대로 서울역의 듣기·읽기 미션을 진행합니다. 두 미션은 모두 완료합니다.','選んだ順番で、ソウル駅の聞く・読むミッションに挑戦します。2つとも完了します。','Choose the order of the Seoul Station listening and reading missions. You will complete both.','按选择的顺序完成首尔站的听力与阅读任务，两项都会完成。'),
        choices:Object.freeze([
          Object.freeze({id:'listener',next:'q-topic',icon:'🎧',label:text('안내 방송 먼저 듣기','案内放送を先に聞く','Listen to the announcement first','先听广播'),detail:text('듣기 미션부터 시작한 뒤 여행 메모를 읽습니다.','聞くミッションのあと、旅メモを読みます。','Start with listening, then read the travel note.','先完成听力任务，再阅读旅行便笺。'),title:text('소리 여행자','音の旅人','Sound Traveler','声音旅人')}),
          Object.freeze({id:'reader',next:'q-checklist',icon:'🗺️',label:text('여행 메모 먼저 읽기','旅メモを先に読む','Read the travel note first','先读旅行便笺'),detail:text('읽기 미션부터 시작한 뒤 안내 방송을 듣습니다.','読むミッションのあと、案内放送を聞きます。','Start with reading, then listen to the announcement.','先完成阅读任务，再听广播。'),title:text('지도 여행자','地図の旅人','Map Traveler','地图旅人')}),
          Object.freeze({id:'tracker',next:'q-topic',legacy:true,icon:'📷',label:text('풍경을 기록하기','景色を記録','Capture the sights','记录风景'),detail:text('이전 버전의 여행 방식입니다.','以前のバージョンの旅スタイルです。','Legacy travel style from an earlier version.','旧版本的旅行方式。'),title:text('기록 여행자','記録の旅人','Memory Traveler','记录旅人')})
        ])
      }),
      Object.freeze({
        id:'q-topic',type:'question',chapter:1,next:'q-checklist',bankId:'M01-I-L-11',stop:'seoul-station',
        location:text('서울역 미션 1 · 음성 메시지','ソウル駅ミッション1・音声メッセージ','Seoul Station Mission 1 · Voice message','首尔站任务1 · 语音消息'),
        title:text('유나의 오늘 계획','ユナの今日の予定','Yuna’s plan today','尤娜今天的计划'),
        context:text('유나가 보낸 대화를 듣고 무엇을 하려는지 확인하세요.','ユナから届いた会話を聞き、何をする予定か確かめよう。','Listen to Yuna’s conversation and identify what she plans to do.','听尤娜发来的对话，确认她打算做什么。'),
        clue:Object.freeze({icon:'📚',label:text('공부 약속','勉強の約束','Study plan','学习计划'),detail:text('유나는 시험 준비를 위해 도서관에 갈 계획입니다. 광화문에서 만나 함께 가기로 했습니다.','ユナは試験準備のため図書館へ行く予定。光化門で会って一緒に行きます。','Yuna plans to study at the library. You will meet at Gwanghwamun and go together.','尤娜打算去图书馆备考，你们约在光化门见面后一起去。')})
      }),
      Object.freeze({
        id:'q-checklist',type:'question',chapter:1,next:'hallway',bankId:'M01-I-R-51',stop:'seoul-station',
        location:text('서울역 미션 2 · 여행 메모','ソウル駅ミッション2・旅メモ','Seoul Station Mission 2 · Travel note','首尔站任务2 · 旅行便笺'),
        title:text('출발 전 체크리스트','出発前チェックリスト','Before-you-go checklist','出发前清单'),
        context:text('안내소에서 받은 여행 메모입니다. 중심 생각을 고르면 서울역 스탬프를 받을 수 있습니다.','案内所でもらった旅メモです。中心内容を選ぶとソウル駅スタンプを獲得できます。','Choose the main idea of this travel note to earn the Seoul Station stamp.','选择旅行便笺的中心思想，获得首尔站印章。'),
        clue:Object.freeze({icon:'✅',label:text('서울역 스탬프','ソウル駅スタンプ','Seoul Station stamp','首尔站印章'),detail:text('할 일을 적으면 빠뜨리지 않고 순서를 정하기 쉽습니다. 첫 지역을 완료했습니다.','やることを書けば忘れにくく、順番も決めやすくなります。最初のエリア完了です。','Writing a list prevents omissions and makes ordering easier. First area complete.','写下待办事项可以避免遗漏并方便排序。第一个区域完成。')})
      }),
      Object.freeze({
        id:'hallway',type:'narrative',chapter:2,next:'q-entrance',stop:'city-hall',
        location:text('오전 10:18 · 서울시청','午前10:18・ソウル市庁','10:18 AM · Seoul City Hall','上午10:18 · 首尔市厅'),
        title:text('시청에 도착했다','市庁に到着','Arriving at City Hall','抵达市厅'),
        korean:'정문 앞에 공사 안내문이 붙어 있다.',
        support:text('시청 광장을 지나려면 출입 안내를 정확히 읽어야 합니다. 이제 두 번째 지역이 열렸습니다.','市庁広場を通るには、入口案内を正しく読む必要があります。2つ目のエリアが開きました。','Read the entrance notice correctly to cross City Hall Plaza. The second area is now open.','要穿过市厅广场，需要准确读懂出入口告示。第二个区域已开启。')
      }),
      Object.freeze({
        id:'q-entrance',type:'question',chapter:2,next:'q-bag',bankId:'M01-I-R-39',stop:'city-hall',
        location:text('시청 미션 3 · 출입 안내','市庁ミッション3・入口案内','City Hall Mission 3 · Entrance notice','市厅任务3 · 出入口告示'),
        title:text('어느 쪽으로 갈까?','どちらへ進む？','Which way should you go?','应该往哪边走？'),
        context:text('광장 입구에 붙은 짧은 안내문입니다. 목적을 고르면 올바른 길이 열립니다.','広場入口の短い案内文です。目的を選ぶと正しい道が開きます。','Choose the purpose of the notice to open the correct route.','选择告示的目的，开启正确路线。'),
        clue:Object.freeze({icon:'➡️',label:text('오른쪽 길 열림','右側ルート開放','Right route opened','右侧路线开启'),detail:text('정문은 공사 중이므로 오른쪽 출입구를 이용해야 합니다.','正面入口は工事中なので、右側の入口を利用します。','The main entrance is under construction, so use the right-side entrance.','正门施工中，需要使用右侧入口。')})
      }),
      Object.freeze({
        id:'q-bag',type:'question',chapter:2,next:'q-desk',bankId:'M01-I-L-01',stop:'city-hall',
        location:text('시청 미션 4 · 광장 벤치','市庁ミッション4・広場のベンチ','City Hall Mission 4 · Plaza bench','市厅任务4 · 广场长椅'),
        title:text('이 가방은 누구 거예요?','このかばんは誰のですか？','Whose bag is this?','这个包是谁的？'),
        context:text('벤치에 놓인 가방의 주인을 묻습니다. 자연스러운 대답을 골라 분실물을 돌려주세요.','ベンチのかばんの持ち主を尋ねます。自然な返事を選び、落とし物を返そう。','Ask who owns the bag. Choose the natural reply and return the lost item.','询问长椅上包的主人。选择自然回答并归还失物。'),
        clue:Object.freeze({icon:'🏛️',label:text('시청 스탬프','市庁スタンプ','City Hall stamp','市厅印章'),detail:text('“제 동생 거예요”라고 대답해 가방을 주인에게 돌려주었습니다. 두 번째 지역 완료!','「弟／妹のです」と答えて持ち主に返しました。2つ目のエリア完了！','“It belongs to my younger sibling” returns the bag to its owner. Second area complete!','回答“是我弟弟/妹妹的”，把包还给了主人。第二个区域完成！')})
      }),
      Object.freeze({
        id:'q-desk',type:'question',chapter:2,next:'q-sequence',bankId:'M01-I-L-20',stop:'gwanghwamun',
        location:text('광화문 미션 5 · 안내 방송','光化門ミッション5・案内放送','Gwanghwamun Mission 5 · Announcement','光化门任务5 · 广播'),
        title:text('분실물 안내를 듣자','落とし物案内を聞こう','Listen to lost-and-found','听失物招领广播'),
        context:text('광화문 안내소에서 방송이 들립니다. 지갑을 찾으려면 무엇이 필요한지 확인하세요.','光化門の案内所で放送が流れます。財布を受け取るために必要な物を確認しよう。','An announcement plays at the Gwanghwamun desk. Identify what is needed to claim the wallet.','光化门服务台播放广播。确认领取钱包需要什么。'),
        clue:Object.freeze({icon:'🪪',label:text('신분증이 필요해요','身分証が必要です','Bring your ID','需要身份证'),detail:text('분실물을 찾으려면 신분증을 가지고 1층 안내실로 가야 합니다.','落とし物を受け取るには、身分証を持って1階案内所へ行きます。','Bring ID to the first-floor desk to claim a lost item.','领取失物需要携带身份证前往一楼服务台。')})
      }),
      Object.freeze({
        id:'q-sequence',type:'question',chapter:3,next:'ending',bankId:'M03-I-R-58',stop:'gwanghwamun',
        location:text('광화문 미션 6 · 마지막 메시지','光化門ミッション6・最後のメッセージ','Gwanghwamun Mission 6 · Final message','光化门任务6 · 最后一条消息'),
        title:text('메시지를 순서대로','メッセージを順番に','Put the message in order','按顺序排列消息'),
        context:text('유나가 휴대폰을 찾은 과정을 보냈습니다. 문장을 자연스럽게 배열하면 약속 장소가 열립니다.','ユナがスマホを見つけた流れを送りました。文を自然に並べると待ち合わせ場所が開きます。','Order the sentences about Yuna finding her phone to unlock the meeting place.','排列尤娜找到手机的句子，解锁见面地点。'),
        clue:Object.freeze({icon:'📱',label:text('광화문에서 만나요','光化門で会いましょう','Meet at Gwanghwamun','光化门见'),detail:text('휴대폰은 가방 안에 있었습니다. 이제 유나와 만날 수 있습니다.','スマホはかばんの中にありました。これでユナに会えます。','The phone was inside the bag. You can finally meet Yuna.','手机就在包里。现在终于可以见到尤娜了。')})
      }),
      Object.freeze({
        id:'ending',type:'ending',chapter:3,stop:'gwanghwamun',
        location:text('오전 10:42 · 광화문','午前10:42・光化門','10:42 AM · Gwanghwamun','上午10:42 · 光化门'),
        title:text('서울 첫 여행 완료!','ソウルはじめて旅クリア！','First Seoul journey complete!','首尔初次旅行完成！'),
        korean:'“찾았다! 여기야. 서울 여행 정말 잘했어!”',
        support:text('서울역에서 출발해 시청을 지나 광화문에 도착했습니다. 세 지역 스탬프와 무료 아바타 의상 ‘서울 노을’을 받았습니다.','ソウル駅を出発し、市庁を通って光化門に到着。3エリアのスタンプと無料アバター衣装「ソウル夕焼け」を獲得しました。','You traveled from Seoul Station through City Hall to Gwanghwamun. You earned three stamps and the free Seoul Sunset avatar look.','你从首尔站出发，经过市厅抵达光化门。获得三个区域印章和免费“首尔晚霞”头像外观。')
      })
    ]),
    endings:Object.freeze({
      perfect:Object.freeze({icon:'🏆',title:text('완벽한 서울 여행자','完璧なソウル旅人','Perfect Seoul Traveler','完美首尔旅人'),detail:text('6개 미션을 모두 맞혀 ‘한복의 밤’ 아바타도 열었습니다.','6問すべて正解し、「韓服の夜」アバターも開放しました。','All six missions were correct, unlocking the Hanbok Night avatar too.','六个任务全部答对，同时解锁“韩服之夜”头像。')}),
      clear:Object.freeze({icon:'🗺️',title:text('서울 코스 완주','ソウルコース完走','Seoul route complete','首尔路线完成'),detail:text('세 지역을 모두 여행하고 ‘서울 노을’ 아바타를 열었습니다.','3エリアを巡り、「ソウル夕焼け」アバターを開放しました。','You visited all three areas and unlocked the Seoul Sunset avatar.','你游览了三个区域并解锁“首尔晚霞”头像。')}),
      close:Object.freeze({icon:'✨',title:text('첫 여행 성공','はじめて旅成功','First journey cleared','初次旅行成功'),detail:text('도착은 성공했습니다. 놓친 표현은 오답 복습에서 다시 만나세요.','到着成功です。間違えた表現は復習でもう一度確認しましょう。','You made it. Revisit missed expressions in Review.','成功抵达。可在错题复习中重温遗漏表达。')})
    })
  });

  window.MALBIT_TRAVEL_PACKS=Object.freeze([episode]);
})();
