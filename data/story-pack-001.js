// MALBIT Story Mode · Case Pack 001
(function(){
  'use strict';

  const text=(ko,ja,en,zh)=>Object.freeze({ko,ja,en,zh});

  const episode=Object.freeze({
    id:'case-001-missing-ticket',
    version:1,
    level:1,
    badge:'CASE 001',
    title:text('사라진 수험표','消えた受験票','The Missing Admission Ticket','消失的准考证'),
    subtitle:text('시험 시작 50분 전, 친구의 다급한 메시지가 도착했다.','試験開始50分前、友だちから緊急メッセージが届いた。','Fifty minutes before the exam, an urgent message arrives.','考试开始前50分钟，朋友发来一条紧急消息。'),
    description:text('한국어 단서를 읽고 들으며 유나의 수험표를 찾으세요.','韓国語の手掛かりを読み、聞きながらユナの受験票を探そう。','Read and listen to Korean clues to find Yuna’s admission ticket.','阅读并聆听韩语线索，帮尤娜找到准考证。'),
    duration:text('약 8분','約8分','About 8 min','约8分钟'),
    questionCount:6,
    cover:Object.freeze({emoji:'🎫',accent:'#ff7a59'}),
    scenes:Object.freeze([
      Object.freeze({
        id:'briefing',type:'narrative',chapter:1,next:'approach',
        location:text('오전 9:10 · 한빛센터 앞','午前9:10・ハンビットセンター前','9:10 AM · Hanbit Center','上午9:10 · 韩光中心门口'),
        title:text('긴급 메시지','緊急メッセージ','Urgent message','紧急消息'),
        korean:'“수험표가 안 보여. 시험은 열 시인데… 같이 찾아 줄래?”',
        support:text('유나의 시험까지 50분 남았습니다. 마지막 동선을 따라가 단서를 모아야 합니다.','ユナの試験まであと50分。最後に通った場所をたどり、手掛かりを集めましょう。','Yuna’s exam starts in 50 minutes. Retrace her route and collect clues.','距离尤娜的考试还有50分钟。沿着她最后走过的路线收集线索。')
      }),
      Object.freeze({
        id:'approach',type:'choice',chapter:1,next:'q-topic',
        location:text('수사 노트','捜査ノート','Case notebook','调查笔记'),
        title:text('어떻게 시작할까?','どう始める？','How will you begin?','从哪里开始？'),
        korean:'먼저 조사 방법을 정하자.',
        support:text('선택은 이번 사건의 수사관 칭호를 정합니다. 문제 경로와 난이도는 같아서 부담 없이 고르면 됩니다.','選択によって今回の捜査官タイプが決まります。問題と難易度は同じなので、気軽に選べます。','Your choice sets your investigator title. The questions and difficulty stay the same.','你的选择会决定调查员称号；题目和难度保持不变。'),
        choices:Object.freeze([
          Object.freeze({id:'listener',icon:'🎧',label:text('음성부터 확인','音声から確認','Check the audio','先听语音'),detail:text('말 속의 작은 단서를 놓치지 않는다.','言葉の小さな手掛かりを逃さない。','Catch small clues in speech.','不放过话语中的小线索。'),title:text('귀 밝은 수사관','耳の鋭い捜査官','Sharp-eared Investigator','敏锐听觉调查员')}),
          Object.freeze({id:'reader',icon:'📝',label:text('기록부터 정리','記録から整理','Organize records','先整理记录'),detail:text('시간과 순서를 차분히 맞춘다.','時間と順序を落ち着いて整理する。','Piece together times and order.','冷静梳理时间与顺序。'),title:text('기록 수사관','記録捜査官','Record Investigator','记录调查员')}),
          Object.freeze({id:'tracker',icon:'🔎',label:text('현장부터 조사','現場から調査','Inspect the scene','先查现场'),detail:text('눈앞의 흔적을 빠르게 찾는다.','目の前の痕跡を素早く探す。','Spot physical clues quickly.','快速发现现场痕迹。'),title:text('현장 수사관','現場捜査官','Scene Investigator','现场调查员')})
        ])
      }),
      Object.freeze({
        id:'q-topic',type:'question',chapter:1,next:'q-checklist',bankId:'M01-I-L-11',
        location:text('단서 1 · 유나의 음성 기록','手掛かり1・ユナの音声記録','Clue 1 · Yuna’s voice note','线索1 · 尤娜的语音记录'),
        title:text('대화의 핵심은?','会話の中心は？','What is the conversation about?','对话的核心是什么？'),
        context:text('수험표를 잃기 전 유나가 나눈 대화입니다. 주제를 맞히면 그날의 목적을 확인할 수 있습니다.','受験票をなくす前の会話です。話題を当てて、その日の目的を確認しよう。','This conversation happened before the ticket went missing. Identify its topic to confirm the day’s purpose.','这是准考证丢失前的对话。判断主题，确认当天的目的。'),
        clue:Object.freeze({icon:'📚',label:text('시험 준비','試験準備','Exam prep','备考'),detail:text('유나는 다음 주 시험 준비 때문에 도서관에 가려고 했다.','ユナは来週の試験準備のため図書館へ行く予定だった。','Yuna planned to visit the library to prepare for an exam.','尤娜原计划去图书馆准备下周的考试。')})
      }),
      Object.freeze({
        id:'q-checklist',type:'question',chapter:1,next:'hallway',bankId:'M01-I-R-51',
        location:text('단서 2 · 접힌 메모','手掛かり2・折りたたまれたメモ','Clue 2 · Folded note','线索2 · 折叠便笺'),
        title:text('메모가 말하는 습관','メモが示す習慣','A habit hidden in the note','便笺透露的习惯'),
        context:text('가방 옆에서 짧은 글이 적힌 메모를 발견했습니다. 글쓴이의 중심 생각을 고르세요.','かばんのそばで短いメモを発見。書き手の中心的な考えを選ぼう。','You find a short note beside the bag. Choose its main idea.','你在包旁发现一张短便笺。请选择作者的中心思想。'),
        clue:Object.freeze({icon:'✅',label:text('준비물 목록','持ち物リスト','Packing checklist','物品清单'),detail:text('유나는 중요한 물건을 작은 노트에 적어 확인한다.','ユナは大切な持ち物を小さなノートに書いて確認する。','Yuna checks important items in a small notebook.','尤娜会把重要物品记在小本子里逐项确认。')})
      }),
      Object.freeze({
        id:'hallway',type:'narrative',chapter:2,next:'q-entrance',
        location:text('오전 9:24 · 센터 복도','午前9:24・センター廊下','9:24 AM · Center hallway','上午9:24 · 中心走廊'),
        title:text('막힌 정문','閉ざされた正面入口','The blocked main entrance','封闭的正门'),
        korean:'정문 앞에 공사 안내문이 붙어 있다.',
        support:text('유나는 어느 쪽으로 들어갔을까요? 안내문부터 정확히 읽어야 합니다.','ユナはどちらから入ったのでしょう。まず案内文を正確に読みましょう。','Which way did Yuna enter? Read the notice carefully first.','尤娜从哪边进入？先准确读懂告示。')
      }),
      Object.freeze({
        id:'q-entrance',type:'question',chapter:2,next:'q-bag',bankId:'M01-I-R-39',
        location:text('단서 3 · 공사 안내문','手掛かり3・工事案内','Clue 3 · Construction notice','线索3 · 施工告示'),
        title:text('안내문의 목적','案内文の目的','Purpose of the notice','告示的目的'),
        context:text('센터 입구에 붙은 짧은 안내문입니다. 어떤 안내인지 고르세요.','センター入口の短い案内文です。何の案内か選ぼう。','A short notice is posted at the entrance. Choose what it tells visitors.','入口贴着一张短告示。请选择它在告知什么。'),
        clue:Object.freeze({icon:'➡️',label:text('오른쪽 출입구','右側の入口','Right-side entrance','右侧入口'),detail:text('유나는 공사 중인 정문 대신 오른쪽 출입구를 이용했다.','ユナは工事中の正面入口ではなく右側の入口を使った。','Yuna used the right-side entrance instead of the blocked main door.','尤娜没有走施工中的正门，而是从右侧入口进入。')})
      }),
      Object.freeze({
        id:'q-bag',type:'question',chapter:2,next:'q-desk',bankId:'M01-I-L-01',
        location:text('단서 4 · 복도 의자 위 가방','手掛かり4・廊下のいすのかばん','Clue 4 · Bag on a hallway chair','线索4 · 走廊椅子上的包'),
        title:text('이 가방은 누구 거예요?','このかばんは誰のですか？','Whose bag is this?','这个包是谁的？'),
        context:text('수험표가 있을 것 같은 가방을 발견했지만 먼저 주인을 확인해야 합니다.','受験票がありそうなかばんを発見。まず持ち主を確認しよう。','You find a promising bag, but first you must identify its owner.','你发现一个可疑的包，但得先确认它的主人。'),
        clue:Object.freeze({icon:'👜',label:text('잘못된 가방','別人のかばん','Wrong bag','拿错的包'),detail:text('복도 가방은 유나의 것이 아니라 누군가의 동생 가방이었다.','廊下のかばんはユナの物ではなく、誰かの弟・妹の物だった。','The hallway bag belonged to someone’s younger sibling, not Yuna.','走廊里的包属于别人的弟弟或妹妹，不是尤娜的。')})
      }),
      Object.freeze({
        id:'q-desk',type:'question',chapter:2,next:'q-sequence',bankId:'M01-I-L-20',
        location:text('단서 5 · 1층 안내 방송','手掛かり5・1階案内放送','Clue 5 · First-floor announcement','线索5 · 一楼广播'),
        title:text('방송에서 확인할 사실','放送で確認する事実','Fact from the announcement','从广播中确认事实'),
        context:text('안내실 방송이 들립니다. 수험표와 함께 잃어버린 물건이 있는지 확인하세요.','案内所の放送です。受験票と一緒になくした物がないか確認しよう。','An information-desk announcement plays. Check whether another lost item is connected to the case.','服务台广播响起。确认是否有其他失物与案件有关。'),
        clue:Object.freeze({icon:'🪪',label:text('신분증은 유나에게','身分証はユナの手元','Yuna still has her ID','身份证仍在尤娜手中'),detail:text('안내실의 검은 지갑은 다른 사람의 물건이다. 유나는 신분증을 이미 손에 들고 있었다.','案内所の黒い財布は別人の物。ユナは身分証をすでに手に持っていた。','The black wallet belongs to someone else; Yuna already had her ID in hand.','服务台的黑色钱包属于别人；尤娜手里已经拿着身份证。')})
      }),
      Object.freeze({
        id:'q-sequence',type:'question',chapter:3,next:'ending',bankId:'M03-I-R-58',
        location:text('마지막 단서 · 기억의 순서','最後の手掛かり・記憶の順序','Final clue · Order of events','最后线索 · 记忆顺序'),
        title:text('무슨 일이 먼저였을까?','何が先だった？','What happened first?','事情的先后顺序'),
        context:text('유나가 아침 상황을 네 문장으로 적었습니다. 자연스러운 순서로 맞추면 마지막 장소가 드러납니다.','ユナが朝の出来事を4文で記録しました。自然な順に並べると最後の場所が分かります。','Yuna wrote four sentences about the morning. Put them in order to reveal the final location.','尤娜用四句话记下早晨的情况。排成自然顺序即可找出最后地点。'),
        clue:Object.freeze({icon:'📱',label:text('휴대폰은 가방 안','スマホはかばんの中','Phone inside the bag','手机在包里'),detail:text('유나는 방을 다시 찾은 뒤 가방 속 휴대폰을 발견했다. 마지막으로 펼친 것은 준비물 노트였다.','部屋を探し直した後、ユナはかばんの中のスマホを発見。最後に開いたのは持ち物ノートだった。','After searching the room again, Yuna found the phone in her bag. The last thing she opened was her checklist notebook.','重新寻找房间后，尤娜在包里找到了手机；她最后翻开的是物品清单本。')})
      }),
      Object.freeze({
        id:'ending',type:'ending',chapter:3,
        location:text('오전 9:42 · 사건 해결','午前9:42・事件解決','9:42 AM · Case solved','上午9:42 · 案件解决'),
        title:text('수험표는 노트 사이에 있었다','受験票はノートの間にあった','The ticket was inside the notebook','准考证夹在笔记本里'),
        korean:'“찾았다! 준비물 목록을 적은 종이 뒤에 붙어 있었어.”',
        support:text('신분증을 꺼낼 때 수험표가 작은 준비물 노트 사이로 밀려 들어갔습니다. 잘못된 가방과 지갑을 제외하고 기억의 순서를 맞춘 덕분에 시험 시작 18분 전에 사건을 해결했습니다.','身分証を出したとき、受験票が小さな持ち物ノートの間に入り込んでいました。別人のかばんと財布を除外し、記憶の順序を整理したことで、試験開始18分前に解決できました。','When Yuna took out her ID, the ticket slipped inside her small checklist notebook. By ruling out the wrong bag and wallet and reconstructing the sequence, you solved the case 18 minutes before the exam.','尤娜取出身份证时，准考证滑进了物品清单本。排除错误的包和钱包并还原顺序后，你在考试开始前18分钟破案。')
      })
    ]),
    endings:Object.freeze({
      perfect:Object.freeze({icon:'🏆',title:text('완벽한 명추리','完璧な名推理','Perfect deduction','完美推理'),detail:text('모든 한국어 단서를 정확히 해독했습니다.','すべての韓国語の手掛かりを正確に解読しました。','You decoded every Korean clue correctly.','你准确破解了全部韩语线索。')}),
      clear:Object.freeze({icon:'🔍',title:text('사건 해결','事件解決','Case closed','案件解决'),detail:text('몇 번의 우회는 있었지만 핵심 단서를 놓치지 않았습니다.','少し遠回りしたものの、重要な手掛かりは逃しませんでした。','There were a few detours, but you caught the crucial clues.','虽然绕了几次路，但没有错过关键线索。')}),
      close:Object.freeze({icon:'🧩',title:text('아슬아슬한 해결','ぎりぎりの解決','Close call','惊险破案'),detail:text('사건은 해결했습니다. 놓친 단서는 오답 복습에서 다시 확인할 수 있습니다.','事件は解決。見逃した手掛かりは復習で確認できます。','The case is solved. Review missed clues in Wrong Answer Review.','案件已经解决；可在错题复习中重新查看遗漏线索。')})
    })
  });

  window.MALBIT_STORY_PACKS=Object.freeze([episode]);
})();
