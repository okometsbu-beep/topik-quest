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
      Object.freeze({label:'Visit Seoul · Myeongdong Cathedral',url:'https://english.visitseoul.net/attractions/Myeongdong%20Cathedral/ENP004036'})
    ]),
    world:Object.freeze({background:'myeongdongMarket',props:Object.freeze(['myeongdongExchange'])}),
    events:Object.freeze({
      daytime:Object.freeze({
        id:'guide-directions',from:540,to:1080,npc:'myeongdongGuide',reward:2500,itemReward:'hangulStampPostcard',
        badge:t('09:00–18:00 · 안내소 운영 시간','09:00–18:00・案内所の時間','09:00–18:00 · visitor information hours','09:00–18:00 · 咨询中心开放时间'),
        title:t('여행안내원에게 길을 묻자','案内スタッフに道を聞こう','Ask the guide for directions','向旅游咨询员问路'),
        speaker:t('명동 여행안내원','明洞の観光案内スタッフ','Myeongdong travel guide','明洞旅游咨询员'),
        dialogue:t('안녕하세요! 어디를 찾고 있어요?','「안녕하세요! 어디를 찾고 있어요?」どこを探していますか？','“안녕하세요! 어디를 찾고 있어요?” What are you looking for?','“안녕하세요! 어디를 찾고 있어요?” 你在找哪里？'),
        instruction:t('단어 카드를 올바른 순서로 눌러 길을 물어보세요.','単語カードを正しい順番でタップして道を聞こう。','Tap the word cards in the right order to ask for directions.','按正确顺序点击词卡来问路。'),
        prompt:t('“명동 관광안내소가 어디예요?”라는 문장을 만드세요.','「明洞観光案内所はどこですか？」という文を作ろう。','Build: “Where is the Myeongdong tourist information center?”','请排列出“明洞旅游咨询中心在哪里？”'),
        tokens:Object.freeze(['어디예요?','명동','관광안내소가']),
        answer:Object.freeze(['명동','관광안내소가','어디예요?']),
        success:t('안내원이 을지로 쪽 안내소 방향을 가리키며 한글 스탬프 엽서를 건넸어요.','案内スタッフが乙支路側の案内所を示し、ハングルスタンプのポストカードをくれました。','The guide points toward the Eulji-ro information center and gives you a Hangul-stamp postcard.','咨询员指向乙支路一带的咨询中心，并送你一张韩文印章明信片。'),
        explanation:t('“명동 관광안내소가 어디예요?”는 장소를 정중하게 묻는 초급 표현입니다.','「명동 관광안내소가 어디예요?」は場所を丁寧に尋ねる初級表現です。','“명동 관광안내소가 어디예요?” politely asks where a place is.','“명동 관광안내소가 어디예요?” 是礼貌询问地点的初级表达。')
      }),
      evening:Object.freeze({
        id:'vendor-order',from:1080,to:1980,npc:'myeongdongVendor',reward:2500,itemReward:'hotteokMemory',
        badge:t('저녁 이벤트 · 거리 간식','夜イベント・屋台グルメ','Evening event · street snack','夜间活动 · 街头小吃'),
        title:t('거리 상인에게 주문하자','屋台で注文しよう','Order from the street vendor','向街头摊主点单'),
        speaker:t('명동 거리 상인','明洞の屋台スタッフ','Myeongdong street vendor','明洞街头摊主'),
        dialogue:t('어서 오세요! 무엇을 드릴까요?','「어서 오세요! 무엇을 드릴까요?」何にしますか？','“어서 오세요! 무엇을 드릴까요?” What would you like?','“어서 오세요! 무엇을 드릴까요?” 想要什么？'),
        instruction:t('단어 카드를 올바른 순서로 눌러 주문하세요.','単語カードを正しい順番でタップして注文しよう。','Tap the word cards in the right order to order.','按正确顺序点击词卡来点单。'),
        prompt:t('“호떡 한 개 주세요.”라는 문장을 만드세요.','「ホットクを1つください。」という文を作ろう。','Build: “One hotteok, please.”','请排列出“请给我一个糖饼。”'),
        tokens:Object.freeze(['주세요.','호떡','한 개']),
        answer:Object.freeze(['호떡','한 개','주세요.']),
        success:t('상인이 따뜻한 호떡을 건네고, 명동의 저녁 추억이 여행 가방에 저장됐어요.','店員が温かいホットクを渡し、明洞の夜の思い出が旅バッグに入りました。','The vendor hands you a warm hotteok, saving an evening Myeongdong memory in your bag.','摊主递给你热乎乎的糖饼，明洞夜晚回忆已存入旅行包。'),
        explanation:t('“물건 + 수량 + 주세요” 순서로 말하면 원하는 것을 정중하게 주문할 수 있습니다.','「品物＋数量＋주세요」の順で、欲しいものを丁寧に注文できます。','Use “item + quantity + 주세요” to order politely.','按“物品＋数量＋주세요”的顺序可以礼貌点单。')
      }),
      stationSign:Object.freeze({
        id:'myeongdong-station-sign',interaction:'sign-build',followup:true,npc:'myeongdongGuide',reward:1800,itemReward:'myeongdongExitBadge',
        badge:t('후속 미션 · 표지판 읽기','追加ミッション・標識を読む','Follow-up mission · read a sign','追加任务 · 阅读标牌'),
        title:t('명동역 표지판을 완성하자','明洞駅の標識を完成させよう','Complete the Myeongdong Station sign','完成明洞站标牌'),
        speaker:t('명동 여행안내원','明洞の観光案内スタッフ','Myeongdong travel guide','明洞旅游咨询员'),
        dialogue:t('표지판의 한글이 흩어졌어요! 명동역을 완성해 볼까요?','標識のハングルがばらばらになりました！「明洞駅」を完成させてみましょう。','The Hangul on the sign is scattered! Shall we complete “Myeongdong Station”?','标牌上的韩文字散开了！来完成“明洞站”吧。'),
        instruction:t('필요한 세 글자만 골라 “명동역” 순서로 놓으세요. 헷갈리는 글자는 남겨도 됩니다.','必要な3文字だけを選び、「명동역」の順に並べよう。まぎらわしい文字は残してかまいません。','Choose only the three needed syllables and arrange them as “명동역”. Leave the decoys behind.','只选出需要的三个字，按“명동역”的顺序排列；干扰字可以留下。'),
        prompt:t('“명동역”을 완성해 6번 출구 표지를 켜세요.','「명동역」を完成させ、6番出口の標識を点灯させよう。','Complete “명동역” and light the Exit 6 sign.','完成“명동역”，点亮6号出口标牌。'),
        signLabel:t('명동역 · 6번 출구','明洞駅・6番出口','Myeongdong Station · Exit 6','明洞站 · 6号出口'),
        tokens:Object.freeze(['동','몽','명','역','면']),
        answer:Object.freeze(['명','동','역']),
        success:t('명동역 6번 출구 표지가 환하게 켜졌어요. 안내원이 명동 길찾기 배지를 여행 가방에 달아 줬어요.','明洞駅6番出口の標識が明るく点灯しました。案内スタッフが明洞道案内バッジを旅バッグにつけてくれました。','The Myeongdong Station Exit 6 sign lights up, and the guide pins a wayfinding badge to your travel bag.','明洞站6号出口的标牌亮了起来，咨询员把明洞导览徽章别在了旅行包上。'),
        explanation:t('명 + 동 + 역을 이어 “명동역”이라고 읽습니다. “역”은 지하철이나 기차를 타는 station입니다.','「명＋동＋역」で「명동역」と読みます。「역」は地下鉄や電車に乗る駅（station）です。','Read 명 + 동 + 역 together as “명동역”. 역 means a subway or train station.','把“명＋동＋역”连起来读作“명동역”；“역”表示地铁站或火车站。')
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
