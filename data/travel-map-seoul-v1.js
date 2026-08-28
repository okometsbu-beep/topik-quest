// MALBIT Travel RPG world data · scalable Seoul world, district, zone, POI, and scene anchors.
(function(){
  'use strict';

  const t=(ko,ja,en,zh)=>Object.freeze({ko,ja,en,zh});
  const scene=(sceneId,x,y,kind,label,action)=>Object.freeze({sceneId,x,y,kind,label,action});
  const poi=(id,x,y,kind,title,korean,detail,reward=0)=>Object.freeze({id,x,y,kind,title,korean,detail,reward});

  const airportArrivals=Object.freeze({
    id:'icn-t1-arrivals',
    districtId:'incheon-airport',
    version:1,
    title:t('인천공항 T1 입국장','仁川空港T1 到着ロビー','Incheon Airport T1 Arrivals','仁川机场T1到达大厅'),
    subtitle:t('직원을 만나고 공항 안을 조사해 보세요.','スタッフに会い、空港内を調べてみよう。','Meet the airport staff and investigate the terminal.','与机场工作人员见面并调查航站楼。'),
    background:'assets/art/travel/rpg/airport-arrivals-map-v1.webp',
    width:12,
    height:9,
    grid:Object.freeze([
      '############',
      '####....####',
      '####.....###',
      '####......##',
      '###.....##.#',
      '###..##.####',
      '###..##.####',
      '#..........#',
      '############'
    ]),
    spawn:Object.freeze({x:5,y:7,direction:'up'}),
    scenes:Object.freeze({
      arrival:scene('arrival',4,4,'npc',t('공항 직원','空港スタッフ','Airport staff','机场工作人员'),t('대화','話す','Talk','对话')),
      'q-hello':scene('q-hello',4,4,'npc',t('인사 이벤트','あいさつイベント','Greeting event','问候事件'),t('대화','話す','Talk','对话')),
      'q-station':scene('q-station',6,3,'sign',t('공항철도 표지','空港鉄道の標識','Airport railroad sign','机场铁路标志'),t('조사','調べる','Inspect','调查')),
      'q-myeongdong':scene('q-myeongdong',9,3,'kiosk',t('교통 안내 키오스크','交通案内キオスク','Transport kiosk','交通信息自助机'),t('조사','調べる','Inspect','调查')),
      transport:scene('transport',9,2,'exit',t('교통센터 출구','交通センター出口','Transport Center exit','交通中心出口'),t('이동','移動','Travel','移动'))
    }),
    pois:Object.freeze([
      poi('baggage-carousel',2,5,'inspect',t('수하물 벨트','手荷物受取レーン','Baggage carousel','行李转盘'),'수하물 찾는 곳',t('짐을 찾는 곳입니다. 한국어 표지에서 “수하물”을 기억해 두세요.','荷物を受け取る場所です。韓国語表示の「수하물」を覚えておこう。','This is where passengers collect luggage. Remember 수하물 on Korean signs.','这是领取行李的地方。记住韩文标牌上的“수하물”。'),200),
      poi('information-board',3,3,'inspect',t('공항 안내판','空港案内板','Airport information board','机场信息牌'),'안내',t('“안내”는 information 또는 guidance라는 뜻입니다.','「안내」は information や guidance という意味です。','안내 means information or guidance.','“안내”表示信息或指引。'),200),
      poi('terminal-window',7,1,'inspect',t('공항 전망창','空港の展望窓','Terminal window','航站楼观景窗'),'인천공항',t('창밖으로 인천공항의 활주로와 관제탑이 보입니다.','窓の外に仁川空港の滑走路と管制塔が見えます。','The runway and control tower of Incheon Airport are visible outside.','窗外可以看到仁川机场的跑道和管制塔。'),0)
    ]),
    portals:Object.freeze([])
  });

  const world=Object.freeze({
    id:'seoul-world-v1',
    version:1,
    title:t('서울 여행 월드','ソウル旅行ワールド','Seoul Travel World','首尔旅行世界'),
    routeIds:Object.freeze(['route-001-airport-myeongdong']),
    districts:Object.freeze([
      Object.freeze({
        id:'incheon-airport',
        title:t('인천공항','仁川空港','Incheon Airport','仁川机场'),
        zoneIds:Object.freeze(['icn-t1-arrivals'])
      })
    ]),
    zones:Object.freeze([airportArrivals])
  });

  window.MALBIT_TRAVEL_WORLDS=Object.freeze([world]);
})();
