// MALBIT Travel RPG world data · scalable Seoul world, district, zone, POI, and scene anchors.
(function(){
  'use strict';

  const t=(ko,ja,en,zh)=>Object.freeze({ko,ja,en,zh});
  const scene=(sceneId,x,y,kind,label,action)=>Object.freeze({sceneId,x,y,kind,label,action});
  const poi=(id,x,y,kind,title,korean,detail,reward=0)=>Object.freeze({id,x,y,kind,title,korean,detail,reward});
  const portal=(id,connectionId,x,y,targetZoneId,targetX,targetY,direction,label)=>Object.freeze({
    id,connectionId,x,y,targetZoneId,targetX,targetY,direction,label,
    action:t('이동','移動','Travel','移动')
  });

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
    portals:Object.freeze([
      portal('arrivals-to-transport','icn-t1-arrivals-transport',10,7,'icn-t1-transport-center',5,7,'up',t('교통센터로','交通センターへ','To the transport center','前往交通中心'))
    ])
  });

  const airportTransportCenter=Object.freeze({
    id:'icn-t1-transport-center',
    districtId:'incheon-airport',
    version:1,
    title:t('인천공항 T1 교통센터','仁川空港T1 交通センター','Incheon Airport T1 Transport Center','仁川机场T1交通中心'),
    subtitle:t('교통 표지를 조사하고 입국장으로 돌아가는 길을 확인해 보세요.','交通表示を調べ、到着ロビーへ戻る道を確認しよう。','Inspect the transport sign and find the way back to Arrivals.','调查交通标志并确认返回到达大厅的路线。'),
    background:'assets/art/travel/rpg/airport-transport-center-map-v1.webp',
    width:12,
    height:9,
    grid:Object.freeze([
      '############',
      '#..........#',
      '#..........#',
      '#.###..###.#',
      '#.###.####.#',
      '#.###..###.#',
      '#..........#',
      '#..........#',
      '#####..#####'
    ]),
    spawn:Object.freeze({x:5,y:7,direction:'up'}),
    scenes:Object.freeze({}),
    pois:Object.freeze([
      poi('transport-center-sign',5,4,'inspect',t('교통센터 표지','交通センター表示','Transport center sign','交通中心标志'),'교통센터',t('“교통”은 transportation, “센터”는 center라는 뜻입니다. 두 단어를 붙이면 여러 교통수단을 이용하는 곳을 가리켜요.','「교통」は交通・移動手段、「센터」はセンターという意味です。二つを合わせると、さまざまな交通手段を利用する場所を表します。','교통 means transportation and 센터 means center. Together they name a place for connecting to different transport options.','“교통”表示交通，“센터”表示中心，组合起来指连接多种交通方式的场所。'),200)
    ]),
    portals:Object.freeze([
      portal('transport-to-arrivals','icn-t1-arrivals-transport',5,8,'icn-t1-arrivals',9,7,'left',t('입국장으로','到着ロビーへ','To Arrivals','前往到达大厅')),
      portal('transport-to-rail-concourse','icn-t1-transport-rail-concourse',5,1,'icn-t1-airport-rail-concourse',5,7,'up',t('공항철도 대합실로','空港鉄道コンコースへ','To the Airport Railroad concourse','前往机场铁路大厅'))
    ])
  });

  const airportRailConcourse=Object.freeze({
    id:'icn-t1-airport-rail-concourse',
    districtId:'incheon-airport',
    version:1,
    title:t('T1 공항철도 대합실','T1 空港鉄道コンコース','T1 Airport Railroad Concourse','T1机场铁路大厅'),
    subtitle:t('승차 방향 표지를 조사하고 교통센터로 돌아가는 길을 확인해 보세요.','乗車方向の表示を調べ、交通センターへ戻る道を確認しよう。','Inspect the boarding-direction sign and find the way back to the transport center.','调查乘车方向标志并确认返回交通中心的路线。'),
    background:'assets/art/travel/rpg/airport-rail-concourse-map-v1.webp',
    width:12,
    height:9,
    grid:Object.freeze([
      '############',
      '#..........#',
      '#.###..###.#',
      '#..........#',
      '#..........#',
      '#..........#',
      '#..........#',
      '#..........#',
      '#####..#####'
    ]),
    spawn:Object.freeze({x:5,y:7,direction:'up'}),
    scenes:Object.freeze({}),
    pois:Object.freeze([
      poi('boarding-direction-sign',8,3,'inspect',t('승차 방향 표지','乗車方向の表示','Boarding-direction sign','乘车方向标志'),'승차 방향',t('“승차”는 차나 열차에 타는 것, “방향”은 가야 할 쪽을 뜻합니다. 역에서는 이 표지로 열차를 타러 가는 길을 확인해요.','「승차」は乗車、「방향」は方向という意味です。駅ではこの表示で、列車に乗るために進む方向を確認します。','승차 means boarding a vehicle or train, and 방향 means direction. At a station, this sign shows which way to go to board the train.','“승차”表示乘车，“방향”表示方向。在车站可通过这个标志确认前往乘车处的方向。'),200)
    ]),
    portals:Object.freeze([
      portal('rail-concourse-to-transport','icn-t1-transport-rail-concourse',5,8,'icn-t1-transport-center',5,2,'down',t('교통센터로','交通センターへ','To the transport center','前往交通中心'))
    ])
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
        zoneIds:Object.freeze(['icn-t1-arrivals','icn-t1-transport-center','icn-t1-airport-rail-concourse'])
      })
    ]),
    zones:Object.freeze([airportArrivals,airportTransportCenter,airportRailConcourse])
  });

  window.MALBIT_TRAVEL_WORLDS=Object.freeze([world]);
})();
