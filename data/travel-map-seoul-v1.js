// MALBIT Travel RPG world data · scalable Seoul world, district, zone, POI, and scene anchors.
(function(){
  'use strict';

  const t=(ko,ja,en,zh)=>Object.freeze({ko,ja,en,zh});
  const scene=(sceneId,x,y,kind,label,action)=>Object.freeze({sceneId,x,y,kind,label,action});
  const poi=(id,x,y,kind,title,korean,detail,reward=0,visual=null)=>Object.freeze({id,x,y,kind,title,korean,detail,reward,visual});
  const prop=(asset,widthTiles,heightTiles,collision)=>Object.freeze({
    asset,widthTiles,heightTiles,
    collision:Object.freeze(collision.map(([x,y])=>Object.freeze({x,y})))
  });
  const foreground=(id,depthY,polygon,collision)=>Object.freeze({
    id,
    depthY,
    polygon:Object.freeze(polygon.map(([x,y])=>Object.freeze({x,y}))),
    collision:Object.freeze(collision.map(([x,y])=>Object.freeze({x,y})))
  });
  const light=(id,kind,x,y,width,height,color,strength)=>Object.freeze({
    id,kind,x,y,width,height,color,strength
  });
  const portal=(id,connectionId,x,y,targetZoneId,targetX,targetY,direction,label)=>Object.freeze({
    id,connectionId,x,y,targetZoneId,targetX,targetY,direction,label,
    action:t('이동','移動','Travel','移动')
  });

  // RPG Maker-style coordinate contract. Existing 12x9 art is treated as a migration atlas and each
  // legacy cell becomes a 4x4 group of independent 25px tiles. Every map cell references an explicit
  // catalog entry with atlas coordinates and terrain properties, so future districts can reuse tile IDs
  // without changing movement, collision, layering, or rendering.
  const TILE_SCALE=4;
  const tilePoint=value=>Number(value)*TILE_SCALE+Math.floor(TILE_SCALE/2);
  const tileGrid=rows=>Object.freeze(rows.flatMap(row=>{
    const expanded=Array.from(String(row),cell=>cell.repeat(TILE_SCALE)).join('');
    return Array.from({length:TILE_SCALE},()=>expanded);
  }));
  const tileCollision=points=>Object.freeze(points.flatMap(point=>Array.from({length:TILE_SCALE*TILE_SCALE},(_,index)=>Object.freeze({
    x:Number(point.x)*TILE_SCALE+(index%TILE_SCALE),
    y:Number(point.y)*TILE_SCALE+Math.floor(index/TILE_SCALE)
  }))));
  const tileAnchor=item=>Object.freeze({...item,x:tilePoint(item.x),y:tilePoint(item.y)});
  const tilePoi=item=>{
    const anchored=tileAnchor(item),visual=item.visual;
    if(!visual)return anchored;
    return Object.freeze({
      ...anchored,
      visual:Object.freeze({asset:visual.asset,widthTiles:visual.widthTiles,heightTiles:visual.heightTiles}),
      collision:Object.freeze(visual.collision.map(offset=>Object.freeze({x:anchored.x+offset.x,y:anchored.y+offset.y})))
    });
  };
  function scaleZone(base){
    const width=base.width*TILE_SCALE,height=base.height*TILE_SCALE,grid=tileGrid(base.grid);
    const scenes=Object.freeze(Object.fromEntries(Object.entries(base.scenes||{}).map(([id,item])=>[id,tileAnchor(item)])));
    const foregrounds=Object.freeze((base.foregrounds||[]).map(item=>Object.freeze({
      ...item,
      depthY:Number(item.depthY)*TILE_SCALE,
      polygon:Object.freeze(item.polygon.map(point=>Object.freeze({x:Number(point.x)*TILE_SCALE,y:Number(point.y)*TILE_SCALE}))),
      collision:tileCollision(item.collision)
    })));
    const lights=Object.freeze((base.lights||[]).map(item=>Object.freeze({
      ...item,x:Number(item.x)*TILE_SCALE,y:Number(item.y)*TILE_SCALE,
      width:Number(item.width)*TILE_SCALE,height:Number(item.height)*TILE_SCALE
    })));
    const palette=Object.freeze(Array.from({length:width*height},(_,index)=>{
      const x=index%width,y=Math.floor(index/width),blocked=String(grid[y]||'').charAt(x)==='#';
      return Object.freeze({
        id:`migration-${String(index).padStart(4,'0')}`,
        atlasX:x,
        atlasY:y,
        terrain:blocked?'blocked':'walkable',
        walkable:!blocked,
        layer:'ground'
      });
    }));
    const ground=Object.freeze(Array.from({length:height},(_,y)=>Object.freeze(Array.from({length:width},(_,x)=>y*width+x))));
    const tilemap=Object.freeze({
      version:1,
      coordinateScale:TILE_SCALE,
      tileSize:25,
      atlas:Object.freeze({image:base.background,width:1200,height:900,columns:width,rows:height}),
      palette,
      layers:Object.freeze({ground})
    });
    return Object.freeze({
      ...base,version:2,width,height,grid,tilemap,
      spawn:Object.freeze({...base.spawn,x:tilePoint(base.spawn.x),y:tilePoint(base.spawn.y)}),
      scenes,
      pois:Object.freeze((base.pois||[]).map(tilePoi)),
      foregrounds,
      lights,
      portals:Object.freeze((base.portals||[]).map(item=>Object.freeze({
        ...item,x:tilePoint(item.x),y:tilePoint(item.y),targetX:tilePoint(item.targetX),targetY:tilePoint(item.targetY)
      })))
    });
  }

  const airportArrivals=scaleZone({
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
      poi('terminal-window',7,1,'inspect',t('공항 전망창','空港の展望窓','Terminal window','航站楼观景窗'),'인천공항',t('창밖으로 인천공항의 활주로와 관제탑이 보입니다.','窓の外に仁川空港の滑走路と管制塔が見えます。','The runway and control tower of Incheon Airport are visible outside.','窗外可以看到仁川机场的跑道和管制塔。'),0),
      poi('cheongsachorong-welcome',7,5,'inspect',t('청사초롱 환영 장식','チョンサチョロンの歓迎飾り','Cheongsachorong welcome lanterns','青纱灯笼欢迎装饰'),'어서 오세요',t('“어서 오세요”는 가게나 시설에서 온 사람을 반갑게 맞을 때 쓰는 높임말입니다. 여기서 “어서”는 빨리 오라는 명령이 아니라 환영의 느낌을 더해요.','「어서 오세요」は、店や施設などで相手を歓迎するときの丁寧な表現です。ここでの「어서」は急いで来るよう命じる言葉ではなく、歓迎の気持ちを添えます。','어서 오세요 is a polite welcome used when receiving someone at a shop or facility. Here, 어서 adds a welcoming tone rather than ordering someone to hurry.','“어서 오세요”是在商店或设施迎接来客时使用的礼貌欢迎语。这里的“어서”增添欢迎的语气，并不是催促对方快点。'),200,prop('assets/art/travel/rpg/cheongsachorong-welcome-prop-v1.webp',3,4,[[-1,0],[0,0]]))
    ]),
    foregrounds:Object.freeze([
      foreground('information-desk',3.98,[[.46,2.5],[3.67,2.5],[3.67,3.98],[.46,3.98]],[[1,3],[2,3],[3,3]]),
      foreground('rail-wayfinding-sign',4.48,[[5.34,3.47],[7.09,3.47],[7.09,4.48],[5.34,4.48]],[[5,4],[6,4],[7,4]]),
      foreground('arrival-flower-planter',6.84,[[5.28,5.78],[6.72,5.78],[6.72,6.84],[5.28,6.84]],[[5,6],[6,6]])
    ]),
    lights:Object.freeze([
      light('west-pillar-lamp','lamp',4.32,.5,.34,.84,'#ffd36b',.42),
      light('east-pillar-lamp','lamp',9.38,.5,.34,.84,'#ffd36b',.42),
      light('rail-wayfinding-glow','screen',5.22,3.27,2.02,.7,'#72dfff',.24)
    ]),
    portals:Object.freeze([
      portal('arrivals-to-transport','icn-t1-arrivals-transport',10,7,'icn-t1-transport-center',5,7,'up',t('교통센터로','交通センターへ','To the transport center','前往交通中心'))
    ])
  });

  const airportTransportCenter=scaleZone({
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
    foregrounds:Object.freeze([
      foreground('center-map-kiosk',5.82,[[5.14,4.43],[6.86,4.43],[6.86,5.82],[5.14,5.82]],[[5,4],[6,4],[5,5],[6,5]]),
      foreground('south-left-planter',8.17,[[3.53,7.01],[4.59,7.01],[4.59,8.17],[3.53,8.17]],[[3,7],[4,7]]),
      foreground('south-right-planter',8.17,[[7.41,7.01],[8.48,7.01],[8.48,8.17],[7.41,8.17]],[[7,7],[8,7]])
    ]),
    lights:Object.freeze([
      light('center-map-glow','screen',5.08,4.34,1.84,1.42,'#6de7ff',.23),
      light('west-wayfinder-glow','screen',1.36,1.86,.92,1.36,'#73cfff',.2),
      light('east-wayfinder-glow','screen',9.72,1.86,.92,1.36,'#73cfff',.2)
    ]),
    portals:Object.freeze([
      portal('transport-to-arrivals','icn-t1-arrivals-transport',5,8,'icn-t1-arrivals',9,7,'left',t('입국장으로','到着ロビーへ','To Arrivals','前往到达大厅')),
      portal('transport-to-rail-concourse','icn-t1-transport-rail-concourse',5,1,'icn-t1-airport-rail-concourse',5,7,'up',t('공항철도 대합실로','空港鉄道コンコースへ','To the Airport Railroad concourse','前往机场铁路大厅'))
    ])
  });

  const airportRailConcourse=scaleZone({
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
    foregrounds:Object.freeze([
      foreground('left-ticket-gates',3.68,[[3.45,2.35],[5.55,2.35],[5.55,3.68],[3.45,3.68]],[[4,2],[5,2],[4,3],[5,3]]),
      foreground('right-ticket-gates',3.68,[[6.45,2.35],[8.55,2.35],[8.55,3.68],[6.45,3.68]],[[7,2],[8,2],[7,3],[8,3]]),
      foreground('left-ticket-machine',5.18,[[.47,3.68],[1.22,3.68],[1.22,5.18],[.47,5.18]],[[1,4]]),
      foreground('right-ticket-machine',5.18,[[10.78,3.68],[11.53,3.68],[11.53,5.18],[10.78,5.18]],[[10,4]]),
      foreground('south-left-planter',8.16,[[3.54,7.03],[4.6,7.03],[4.6,8.16],[3.54,8.16]],[[3,7],[4,7]]),
      foreground('south-right-planter',8.16,[[7.4,7.03],[8.46,7.03],[8.46,8.16],[7.4,8.16]],[[7,7],[8,7]])
    ]),
    lights:Object.freeze([
      light('west-ticket-map-glow','screen',1.43,2.23,.98,1.48,'#6cdcff',.22),
      light('east-ticket-map-glow','screen',9.59,2.23,.98,1.48,'#6cdcff',.22),
      light('gate-status-glow','screen',5.58,2.18,.84,1.2,'#76f0cf',.18)
    ]),
    portals:Object.freeze([
      portal('rail-concourse-to-transport','icn-t1-transport-rail-concourse',5,8,'icn-t1-transport-center',5,2,'down',t('교통센터로','交通センターへ','To the transport center','前往交通中心'))
    ])
  });

  const world=Object.freeze({
    id:'seoul-world-v1',
    version:1,
    title:t('서울 여행 월드','ソウル旅行ワールド','Seoul Travel World','首尔旅行世界'),
    performanceBudget:Object.freeze({
      version:1,
      maxGroundTilesPerZone:1728,
      maxUpperTilesPerZone:256,
      maxBoardDomNodes:2048,
      targetFrameMs:16.7,
      maxP95FrameMs:34,
      longFrameMs:50,
      maxLongFrameRatio:.15
    }),
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
