// MALBIT Travel Adventure · Myeongdong post-arrival hub
(function(){
  'use strict';
  const t=(ko,ja,en,zh)=>Object.freeze({ko,ja,en,zh});
  const item=(id,asset,cost,name,detail,unlock='always')=>Object.freeze({id,asset,cost,name,detail,unlock});

  const hub=Object.freeze({
    id:'myeongdong-hub',version:2,routeId:'route-001-airport-myeongdong',
    title:t('명동 여행 허브','明洞トラベルハブ','Myeongdong Travel Hub','明洞旅行中心'),
    subtitle:t('현지인과 말하고, 여행 원으로 추억을 모으세요.','現地の人と話し、旅ウォンで思い出を集めよう。','Talk with locals and collect memories with travel won.','与当地人交谈，用旅行韩元收集回忆。'),
    location:t('서울 지하철 4호선 · 명동역','ソウル地下鉄4号線・明洞駅','Seoul Subway Line 4 · Myeongdong Station','首尔地铁4号线 · 明洞站'),
    assets:Object.freeze({
      backgrounds:Object.freeze({myeongdongMarket:'assets/art/travel/layers/bg-myeongdong-market.webp'}),
      npcs:Object.freeze({
        myeongdongGuide:'assets/art/travel/layers/npc-myeongdong-guide.webp',
        myeongdongVendor:'assets/art/travel/layers/npc-myeongdong-vendor.webp'
      }),
      props:Object.freeze({
        myeongdongExchange:'assets/art/travel/layers/prop-myeongdong-exchange.webp',
        hangulStampPostcard:'assets/art/travel/layers/item-hangul-stamp-postcard.webp',
        hotteokMemory:'assets/art/travel/layers/item-hotteok-memory.webp',
        myeongdongExitBadge:'assets/art/travel/layers/item-myeongdong-exit-badge.webp',
        namsanCharm:'assets/art/travel/layers/item-namsan-charm.webp'
      })
    }),
    sources:Object.freeze([
      Object.freeze({label:'Visit Seoul · Myeong-dong',url:'https://english.visitseoul.net/area/Myeong-dong/ENP000067'}),
      Object.freeze({label:'Visit Korea · Tourist Information Center',url:'https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=351&vcontsId=63293'}),
      Object.freeze({label:'Visit Seoul · Myeongdong Cathedral',url:'https://english.visitseoul.net/attractions/Myeongdong%20Cathedral/ENP004036'}),
      Object.freeze({label:'2026 Myeongdong street-food price guide · prices vary by stall',url:'https://knowaboutkorea.com/places/guide/myeongdong-shopping-street-food-guide'})
    ]),
    world:Object.freeze({background:'myeongdongMarket',props:Object.freeze(['myeongdongExchange'])}),
    events:Object.freeze({
      daytime:Object.freeze({
        id:'guide-directions',interaction:'free-compose',from:540,to:1080,npc:'myeongdongGuide',reward:2500,partialReward:300,maxPartialRewards:3,itemReward:'hangulStampPostcard',
        badge:t('09:00–18:00 · 안내소 운영 시간','09:00–18:00・案内所の時間','09:00–18:00 · visitor information hours','09:00–18:00 · 咨询中心开放时间'),
        title:t('여행안내원에게 길을 묻자','案内スタッフに道を聞こう','Ask the guide for directions','向旅游咨询员问路'),
        speaker:t('명동 여행안내원','明洞の観光案内スタッフ','Myeongdong travel guide','明洞旅游咨询员'),
        dialogue:t('안녕하세요! 어디를 찾고 있어요?','「안녕하세요! 어디를 찾고 있어요?」どこを探していますか？','“안녕하세요! 어디를 찾고 있어요?” What are you looking for?','“안녕하세요! 어디를 찾고 있어요?” 你在找哪里？'),
        conversation:Object.freeze([
          Object.freeze({role:'npc',korean:'안녕하세요! 여행 오셨어요?',support:t('안녕하세요! 여행 오셨어요?','こんにちは！旅行で来ましたか？','Hello! Are you traveling?','你好！你是来旅行的吗？')}),
          Object.freeze({role:'player',korean:'네, 처음 왔어요.',support:t('네, 처음 왔어요.','はい、初めて来ました。','Yes, it is my first time here.','是的，我第一次来。')}),
          Object.freeze({role:'npc',korean:'반가워요. 어디에서 왔어요?',support:t('반가워요. 어디에서 왔어요?','はじめまして。どこから来ましたか？','Nice to meet you. Where are you from?','很高兴见到你。你从哪里来？')}),
          Object.freeze({role:'player',korean:'일본에서 왔어요.',support:t('일본에서 왔어요.','日本から来ました。','I came from Japan.','我从日本来。')}),
          Object.freeze({role:'npc',korean:'어서 오세요! 이제 어디를 찾고 있어요?',support:t('어서 오세요! 이제 어디를 찾고 있어요?','ようこそ！今はどこを探していますか？','Welcome! What are you looking for now?','欢迎！你现在在找哪里？')})
        ]),
        instruction:t('단어·조사를 골라 원하는 말을 직접 만드세요. 모범 문장이 아니어도 뜻이 통하면 창의 보상을 받습니다.','単語・助詞を選んで自分の文を作ろう。模範文と違っても、意味が通じれば創作報酬を獲得できます。','Choose words and particles to build your own sentence. A meaningful alternative earns a creative reward.','选择单词和助词自由造句；即使不是标准答案，只要意思通顺也能获得创意奖励。'),
        prompt:t('안내소의 위치를 물으면 큰 보상. 자기소개나 다른 자연스러운 질문도 작은 보상!','案内所の場所を尋ねると大きな報酬。自己紹介や自然な別の質問でも小さな報酬！','Ask for the information center for the main reward; a natural introduction or another question still earns a small reward.','询问咨询中心位置可获大奖；自然的自我介绍或其他问题也有小奖励。'),
        tokens:Object.freeze(['안녕하세요!','저','는','일본','에서','왔어요.','명동','관광안내소','화장실','지하철역','카페','이','가','은','어디','에','있어요?','가고','싶어요.','감사합니다.']),
        answer:Object.freeze(['명동','관광안내소','가','어디','에','있어요?']),
        accepted:Object.freeze([
          Object.freeze({pattern:'^(?:안녕하세요!\\s*)?(?:명동\\s*)?(?:관광안내소|화장실|지하철역|카페)(?:이|가|은|는)?\\s*어디(?:에)?\\s*있어요\\?$',response:t('네, 저쪽 큰길을 따라가면 있어요.','はい、あちらの大通りに沿って行くとあります。','Yes. Follow the main street over there.','有的，沿着那边的大路走就到了。')}),
          Object.freeze({pattern:'^(?:안녕하세요!\\s*)?(?:저는\\s*)?일본에서\\s*왔어요\\.$',response:t('반가워요! 명동 여행을 환영해요.','はじめまして！明洞旅行へようこそ。','Nice to meet you! Welcome to Myeongdong.','很高兴见到你！欢迎来到明洞。')}),
          Object.freeze({pattern:'^(?:명동\\s*)?(?:관광안내소|화장실|지하철역|카페)(?:에)?\\s*가고\\s*싶어요\\.$',response:t('좋아요. 제가 가는 길을 알려 드릴게요.','いいですね。行き方を案内します。','Great. I will show you how to get there.','好的，我来告诉你怎么走。')}),
          Object.freeze({pattern:'^(?:안녕하세요!|감사합니다\\.)$',response:t('네, 반가워요! 천천히 말해도 괜찮아요.','はい、はじめまして！ゆっくり話して大丈夫です。','Nice to meet you! It is okay to speak slowly.','很高兴见到你！慢慢说也没关系。')})
        ]),
        success:t('안내원이 을지로 쪽 안내소 방향을 가리키며 한글 스탬프 엽서를 건넸어요.','案内スタッフが乙支路側の案内所を示し、ハングルスタンプのポストカードをくれました。','The guide points toward the Eulji-ro information center and gives you a Hangul-stamp postcard.','咨询员指向乙支路一带的咨询中心，并送你一张韩文印章明信片。'),
        explanation:t('“명동 관광안내소가 어디예요?”는 장소를 정중하게 묻는 초급 표현입니다.','「명동 관광안내소가 어디예요?」は場所を丁寧に尋ねる初級表現です。','“명동 관광안내소가 어디예요?” politely asks where a place is.','“명동 관광안내소가 어디예요?” 是礼貌询问地点的初级表达。')
      }),
      evening:Object.freeze({
        id:'vendor-order',interaction:'free-compose',from:1080,to:1980,npc:'myeongdongVendor',reward:2500,partialReward:300,maxPartialRewards:3,itemReward:'hotteokMemory',
        badge:t('저녁 이벤트 · 거리 간식','夜イベント・屋台グルメ','Evening event · street snack','夜间活动 · 街头小吃'),
        title:t('거리 상인에게 주문하자','屋台で注文しよう','Order from the street vendor','向街头摊主点单'),
        speaker:t('명동 거리 상인','明洞の屋台スタッフ','Myeongdong street vendor','明洞街头摊主'),
        dialogue:t('어서 오세요! 무엇을 드릴까요?','「어서 오세요! 무엇을 드릴까요?」何にしますか？','“어서 오세요! 무엇을 드릴까요?” What would you like?','“어서 오세요! 무엇을 드릴까요?” 想要什么？'),
        conversation:Object.freeze([
          Object.freeze({role:'npc',korean:'어서 오세요! 처음 오셨어요?',support:t('어서 오세요! 처음 오셨어요?','いらっしゃいませ！初めてですか？','Welcome! Is this your first visit?','欢迎！第一次来吗？')}),
          Object.freeze({role:'player',korean:'네, 처음 왔어요.',support:t('네, 처음 왔어요.','はい、初めて来ました。','Yes, it is my first visit.','是的，第一次来。')}),
          Object.freeze({role:'npc',korean:'호떡은 달고 따뜻해요. 괜찮아요?',support:t('호떡은 달고 따뜻해요. 괜찮아요?','ホットクは甘くて温かいです。大丈夫ですか？','Hotteok is sweet and warm. Is that okay?','糖饼又甜又热，可以吗？')}),
          Object.freeze({role:'player',korean:'네, 좋아요!',support:t('네, 좋아요!','はい、いいです！','Yes, sounds good!','好，我喜欢！')}),
          Object.freeze({role:'npc',korean:'몇 개 드릴까요?',support:t('몇 개 드릴까요?','いくつ差し上げましょうか？','How many would you like?','要几个？')})
        ]),
        instruction:t('음식·수량·조사를 자유롭게 골라 주문하세요. 다른 자연스러운 말도 작은 보상을 받습니다.','食べ物・数量・助詞を自由に選んで注文しよう。自然な別の表現にも小さな報酬があります。','Freely combine food, quantity, and particles. Other natural phrases earn a small reward too.','自由组合食物、数量和助词；其他自然表达也能获得小奖励。'),
        prompt:t('호떡 한 개를 주문하면 큰 보상. 인사하거나 다른 음식을 자연스럽게 주문해도 작은 보상!','ホットクを1つ注文すると大きな報酬。あいさつや別の自然な注文でも小さな報酬！','Order one hotteok for the main reward; a greeting or another natural order still earns a small reward.','点一个糖饼可获大奖；问候或自然点其他食物也有小奖励。'),
        tokens:Object.freeze(['안녕하세요!','호떡','떡볶이','물','을','를','한','두','개','주세요.','먹고','싶어요.','감사합니다.','괜찮아요.','매워요?']),
        answer:Object.freeze(['호떡','한','개','주세요.']),
        accepted:Object.freeze([
          Object.freeze({pattern:'^(?:안녕하세요!\\s*)?(?:호떡|떡볶이)(?:을|를)?\\s*(?:한|두)\\s*개\\s*주세요\\.$',response:t('네, 바로 만들어 드릴게요!','はい、すぐにお作りします！','Sure, I will make it right away!','好的，马上给你做！')}),
          Object.freeze({pattern:'^(?:호떡|떡볶이|물)(?:을|를)?\\s*주세요\\.$',response:t('네, 여기 있습니다.','はい、どうぞ。','Of course. Here you are.','好的，给你。')}),
          Object.freeze({pattern:'^(?:호떡|떡볶이)(?:을|를)?\\s*먹고\\s*싶어요\\.$',response:t('좋아요! 따뜻하게 준비해 드릴게요.','いいですね！温かく用意します。','Great! I will prepare it warm.','好的！给你准备热乎的。')}),
          Object.freeze({pattern:'^(?:안녕하세요!|감사합니다\\.|괜찮아요\\.|매워요\\?)$',response:t('천천히 말씀하세요. 제가 도와드릴게요.','ゆっくり話してください。お手伝いします。','Take your time. I will help you.','慢慢说，我会帮你的。')})
        ]),
        success:t('상인이 따뜻한 호떡을 건네고, 명동의 저녁 추억이 여행 가방에 저장됐어요.','店員が温かいホットクを渡し、明洞の夜の思い出が旅バッグに入りました。','The vendor hands you a warm hotteok, saving an evening Myeongdong memory in your bag.','摊主递给你热乎乎的糖饼，明洞夜晚回忆已存入旅行包。'),
        explanation:t('“물건 + 수량 + 주세요” 순서로 말하면 원하는 것을 정중하게 주문할 수 있습니다.','「品物＋数量＋주세요」の順で、欲しいものを丁寧に注文できます。','Use “item + quantity + 주세요” to order politely.','按“物品＋数量＋주세요”的顺序可以礼貌点单。')
      }),
      stationSign:Object.freeze({
        id:'myeongdong-station-sign',interaction:'sign-build',followup:true,npc:'myeongdongGuide',reward:1800,itemReward:'myeongdongExitBadge',
        badge:t('후속 미션 · 표지판 읽기','追加ミッション・標識を読む','Follow-up mission · read a sign','追加任务 · 阅读标牌'),
        title:t('명동역 표지판을 완성하자','明洞駅の標識を完成させよう','Complete the Myeongdong Station sign','完成明洞站标牌'),
        speaker:t('명동 여행안내원','明洞の観光案内スタッフ','Myeongdong travel guide','明洞旅游咨询员'),
        dialogue:t('표지판의 한글이 흩어졌어요! 명동역을 완성해 볼까요?','標識のハングルがばらばらになりました！「明洞駅」を完成させてみましょう。','The Hangul on the sign is scattered! Shall we complete “Myeongdong Station”?','标牌上的韩文字散开了！来完成“明洞站”吧。'),
        conversation:Object.freeze([
          Object.freeze({role:'npc',korean:'표지판을 읽을 수 있어요?',support:t('표지판을 읽을 수 있어요?','標識を読めますか？','Can you read the sign?','你能读这个标牌吗？')}),
          Object.freeze({role:'player',korean:'조금 읽을 수 있어요.',support:t('조금 읽을 수 있어요.','少し読めます。','I can read a little.','我能读一点。')}),
          Object.freeze({role:'npc',korean:'좋아요! 명동역 세 글자를 찾아볼까요?',support:t('좋아요! 명동역 세 글자를 찾아볼까요?','いいですね！「명동역」の3文字を探してみましょう。','Great! Shall we find the three syllables in 명동역?','很好！来找出“명동역”这三个字吧。')})
        ]),
        instruction:t('필요한 세 글자만 골라 “명동역” 순서로 놓으세요. 헷갈리는 글자는 남겨도 됩니다.','必要な3文字だけを選び、「명동역」の順に並べよう。まぎらわしい文字は残してかまいません。','Choose only the three needed syllables and arrange them as “명동역”. Leave the decoys behind.','只选出需要的三个字，按“명동역”的顺序排列；干扰字可以留下。'),
        prompt:t('“명동역”을 완성해 6번 출구 표지를 켜세요.','「명동역」を完成させ、6番出口の標識を点灯させよう。','Complete “명동역” and light the Exit 6 sign.','完成“명동역”，点亮6号出口标牌。'),
        signLabel:t('명동역 · 6번 출구','明洞駅・6番出口','Myeongdong Station · Exit 6','明洞站 · 6号出口'),
        tokens:Object.freeze(['동','몽','명','역','면']),
        answer:Object.freeze(['명','동','역']),
        success:t('명동역 6번 출구 표지가 환하게 켜졌어요. 안내원이 명동 길찾기 배지를 여행 가방에 달아 줬어요.','明洞駅6番出口の標識が明るく点灯しました。案内スタッフが明洞道案内バッジを旅バッグにつけてくれました。','The Myeongdong Station Exit 6 sign lights up, and the guide pins a wayfinding badge to your travel bag.','明洞站6号出口的标牌亮了起来，咨询员把明洞导览徽章别在了旅行包上。'),
        explanation:t('명 + 동 + 역을 이어 “명동역”이라고 읽습니다. “역”은 지하철이나 기차를 타는 station입니다.','「명＋동＋역」で「명동역」と読みます。「역」は地下鉄や電車に乗る駅（station）です。','Read 명 + 동 + 역 together as “명동역”. 역 means a subway or train station.','把“명＋동＋역”连起来读作“명동역”；“역”表示地铁站或火车站。')
      }),
      menuBudget:Object.freeze({
        id:'myeongdong-menu-budget',interaction:'price-budget',followup:true,npc:'myeongdongVendor',reward:0,
        badge:t('후속 미션 · 가격표 읽기','追加ミッション・値札を読む','Follow-up mission · read a price board','追加任务 · 阅读价目表'),
        title:t('여행 원으로 호떡을 주문하자','旅ウォンでホットクを注文しよう','Order hotteok with travel won','用旅行韩元点糖饼'),
        speaker:t('명동 거리 상인','明洞の屋台スタッフ','Myeongdong street vendor','明洞街头摊主'),
        dialogue:t('가격표를 읽고 오늘 쓸 여행 원을 정해 볼까요?','値札を読んで、今日使う旅ウォンを決めてみましょう。','Read the price board and plan today’s travel-won spending.','阅读价目表，决定今天要花多少旅行韩元。'),
        conversation:Object.freeze([
          Object.freeze({role:'npc',korean:'어서 오세요! 가격표를 먼저 봐 주세요.',support:t('어서 오세요! 가격표를 먼저 봐 주세요.','いらっしゃいませ！まず値札を見てください。','Welcome! Please check the price board first.','欢迎！请先看价目表。')}),
          Object.freeze({role:'player',korean:'호떡은 이천 원이에요?',support:t('호떡은 이천 원이에요?','ホットクは2,000ウォンですか？','Is hotteok 2,000 won?','糖饼是2,000韩元吗？')}),
          Object.freeze({role:'npc',korean:'네, 한 개에 이천 원이에요.',support:t('네, 한 개에 이천 원이에요.','はい、1個2,000ウォンです。','Yes, it is 2,000 won each.','对，一个2,000韩元。')}),
          Object.freeze({role:'player',korean:'오늘 예산은 오천 원이에요.',support:t('오늘 예산은 오천 원이에요.','今日の予算は5,000ウォンです。','My budget today is 5,000 won.','今天的预算是5,000韩元。')}),
          Object.freeze({role:'npc',korean:'좋아요. 예산 안에서 최대 몇 개 드릴까요?',support:t('좋아요. 예산 안에서 최대 몇 개 드릴까요?','では、予算内で最大何個にしますか？','Great. What is the maximum quantity within your budget?','好。在预算内最多要几个？')})
        ]),
        instruction:t('한국어 가격표를 읽고 수량을 조절하세요. 합계가 5,000 여행 원을 넘지 않으면서 가장 많은 수량을 찾습니다.','韓国語の値札を読み、数量を調整しよう。合計が5,000旅ウォン以内になる最大数を探します。','Read the Korean price board and adjust the quantity. Find the most you can buy without exceeding 5,000 travel won.','阅读韩文价目表并调整数量，找出不超过5,000旅行韩元的最大数量。'),
        prompt:t('호떡은 한 개 2,000원입니다. 5,000 여행 원 안에서 최대 몇 개를 살 수 있을까요?','ホットクは1個2,000ウォン。5,000旅ウォン以内で最大何個買えますか？','Hotteok costs 2,000 won each. What is the maximum quantity within 5,000 travel won?','糖饼一个2,000韩元。5,000旅行韩元内最多能买几个？'),
        menu:Object.freeze([
          Object.freeze({id:'hotteok',name:'호떡',price:2000}),
          Object.freeze({id:'eggBread',name:'계란빵',price:2000}),
          Object.freeze({id:'tteokbokki',name:'떡볶이',price:4000})
        ]),
        budget:5000,targetItem:'hotteok',targetQuantity:2,maxQuantity:3,
        success:t('“호떡 두 개 주세요.”라고 주문하고 4,000 여행 원을 냈어요. 1,000 여행 원을 남기며 예산 안에서 주문했습니다.','「호떡 두 개 주세요」と注文し、4,000旅ウォンを使いました。1,000旅ウォンを残して予算内で注文できました。','You ordered “호떡 두 개 주세요,” spent 4,000 travel won, and kept 1,000 within the practice budget.','你说“请给我两个糖饼”，花了4,000旅行韩元，并在练习预算内留下1,000。'),
        explanation:t('가격 × 수량으로 합계를 계산합니다. 2,000×2=4,000은 예산 안이고, 2,000×3=6,000은 5,000을 넘습니다. 주문할 때는 “음식 + 수량 + 주세요”를 씁니다.','値段×数量で合計を計算します。2,000×2=4,000は予算内、2,000×3=6,000は5,000を超えます。注文は「食べ物＋数量＋주세요」の順です。','Multiply price by quantity. 2,000×2=4,000 fits; 2,000×3=6,000 exceeds 5,000. Order with “food + quantity + 주세요.”','用价格×数量计算总额。2,000×2=4,000在预算内，2,000×3=6,000超过5,000。点单用“食物＋数量＋주세요”。')
      })
    }),
    exchange:Object.freeze([
      item('hangulStampPostcard','hangulStampPostcard',2000,t('한글 스탬프 엽서','ハングルスタンプ葉書','Hangul stamp postcard','韩文印章明信片'),t('명동의 건축과 남산 풍경을 담은 여행 기록','明洞の建築と南山の景色を残す旅の記録','A travel record of Myeongdong architecture and Namsan','记录明洞建筑与南山风景的旅行纪念')),
      item('hotteokMemory','hotteokMemory',3000,t('따뜻한 호떡 추억','あつあつホットクの思い出','Warm hotteok memory','热乎乎的糖饼回忆'),t('저녁 이벤트에서 만나는 명동 거리 간식','夜イベントで出会う明洞の屋台グルメ','A Myeongdong street snack from the evening event','夜间活动中的明洞街头小吃'),'evening'),
      item('myeongdongExitBadge','myeongdongExitBadge',3500,t('명동 길찾기 배지','明洞道案内バッジ','Myeongdong wayfinding badge','明洞导览徽章'),t('명동역 표지판을 직접 완성한 여행자의 수집품','明洞駅の標識を自分で完成させた旅人のコレクション','A collectible for travelers who complete the station sign','亲手完成明洞站标牌的旅行者收藏品'),'sign'),
      item('namsanCharm','namsanCharm',5000,t('남산 야경 참','南山夜景チャーム','Namsan night-view charm','南山夜景挂饰'),t('NPC 한국어 퀘스트를 끝낸 여행자에게 열리는 수집품','NPC韓国語クエストを終えると開くコレクション','A collectible unlocked after the NPC Korean quest','完成NPC韩语任务后解锁的收藏品'),'quest')
    ])
  });
  window.MALBIT_TRAVEL_HUBS=Object.freeze([hub]);
})();
