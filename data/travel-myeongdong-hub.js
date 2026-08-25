// MALBIT Travel Adventure · Myeongdong post-arrival hub
(function(){
  'use strict';
  const t=(ko,ja,en,zh)=>Object.freeze({ko,ja,en,zh});
  const item=(id,asset,cost,name,detail,unlock='always')=>Object.freeze({id,asset,cost,name,detail,unlock});

  const hub=Object.freeze({
    id:'myeongdong-hub',version:1,routeId:'route-001-airport-myeongdong',
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
      })
    }),
    exchange:Object.freeze([
      item('hangulStampPostcard','hangulStampPostcard',2000,t('한글 스탬프 엽서','ハングルスタンプ葉書','Hangul stamp postcard','韩文印章明信片'),t('명동의 건축과 남산 풍경을 담은 여행 기록','明洞の建築と南山の景色を残す旅の記録','A travel record of Myeongdong architecture and Namsan','记录明洞建筑与南山风景的旅行纪念')),
      item('hotteokMemory','hotteokMemory',3000,t('따뜻한 호떡 추억','あつあつホットクの思い出','Warm hotteok memory','热乎乎的糖饼回忆'),t('저녁 이벤트에서 만나는 명동 거리 간식','夜イベントで出会う明洞の屋台グルメ','A Myeongdong street snack from the evening event','夜间活动中的明洞街头小吃'),'evening'),
      item('namsanCharm','namsanCharm',5000,t('남산 야경 참','南山夜景チャーム','Namsan night-view charm','南山夜景挂饰'),t('NPC 한국어 퀘스트를 끝낸 여행자에게 열리는 수집품','NPC韓国語クエストを終えると開くコレクション','A collectible unlocked after the NPC Korean quest','完成NPC韩语任务后解锁的收藏品'),'quest')
    ])
  });
  window.MALBIT_TRAVEL_HUBS=Object.freeze([hub]);
})();
