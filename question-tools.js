// Local issue drafts; an explicitly opened, verified Google Form handles submission.
(function(){
'use strict';
const KEY='harumalQuestionReportsV1',memory=new Map();
// Public viewform fields/options verified by a read-only GET on 2026-10-18.
const REPORT_FORM=Object.freeze({verified:true,url:'https://docs.google.com/forms/d/e/1FAIpQLSfAZIfYDJNrts7cYkMgn2Qs8olDuDiNoSD0Qm3fVcMqLh_N_A/viewform',fields:Object.freeze({id:'entry.311034735',kind:'entry.470693337',body:'entry.386287803',version:'entry.79010159',level:'entry.462473386',section:'entry.678302029'}),kindValues:Object.freeze({correct_answer:'정답 오류',explanation:'해설 오류',typo:'오탈자',translation:'번역 오류',audio:'음성 오류',visual:'그림·화면 오류',other:'기타',answer:'기타',content:'기타'})});
if(window.HARUMAL_REPORT_FORM_CONFIG===undefined)window.HARUMAL_REPORT_FORM_CONFIG=REPORT_FORM;
const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const language=()=>{const s=typeof S!=='undefined'?S:window.S;return ['ko','ja','en','zh'].includes(s?.lang)?s.lang:'ko'};
const L=(ko,ja,en,zh)=>({ko,ja,en,zh}[language()]);
const area=x=>({listen:'listening',read:'reading',write:'writing'}[x]||x||'practice');
const areaName=x=>({listening:L('듣기','聞き取り','Listening','听力'),reading:L('읽기','読解','Reading','阅读'),writing:L('쓰기','作文','Writing','写作'),vocabulary:L('어휘','語彙','Vocabulary','词汇')}[x]||L('연습','練習','Practice','练习'));
function fingerprint(value){let a=2166136261,b=2246822519;for(const c of String(value)){a=Math.imul(a^c.codePointAt(0),16777619);b=Math.imul(b^c.codePointAt(0),3266489917)}return (a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0')}
function identity(q={},context={}){
 const key=q.bankId||(typeof q.id==='string'&&window.MALBIT_BANK?.byId?.(q.id)?q.id:null),source=key&&window.MALBIT_BANK?.byId?.(key),level=Number(source?.level||q.level||q.examLevel||context.level)||(String(key||'').includes('-II-')?2:1),section=area(source?.section||q.section||context.section),number=source?.no??q.sourceId??q.no??q.id??null;
 // Session position is deliberately excluded: it is not a source question number.
 const set=source?.set??q.mockSet??null,id=key||`${context.namespace||'LEGACY'}-${level===2?'II':'I'}-${section.toUpperCase()}-${number??fingerprint(q.term||q.stem||q.prompt||'')}`;
 return {id:String(id),level,section,set:Number(set)>0?Number(set):null,number,version:String(window.__MALBIT_RUNTIME__?.version||'unknown')};
}
// Solving surfaces keep IDs internal; report metadata is disclosed inside details only.
function badge(){return ''}
function reportIdentity(x){return `<small class="hqReportIdentity"><button type="button" class="hqCopyId" data-copy-question-id="${h(x.id)}" aria-label="${L('문항 ID 복사','問題IDをコピー','Copy question ID','复制题目ID')}"><code>${h(x.id)}</code> ⧉</button> · v${h(x.version)} · ${h(areaName(x.section))}<span class="hqCopyStatus" role="status"></span></small>`}

function read(id){if(memory.has(id))return memory.get(id);try{const all=JSON.parse(localStorage.getItem(KEY)||'{}');return all&&typeof all==='object'?all[id]||{}:{}}catch{return {}}}
const types=(savedKind)=>{const rows=[['correct_answer',L('정답 오류','正解の誤り','Incorrect answer','答案错误')],['explanation',L('해설 오류','解説の誤り','Explanation error','解析错误')],['typo',L('오탈자','誤字・脱字','Typo','错别字')],['translation',L('번역 오류','翻訳の誤り','Translation error','翻译错误')],['audio',L('음성 오류','音声の問題','Audio error','音频错误')],['visual',L('그림·화면 오류','画像・画面の問題','Image / display error','图片或界面错误')],['other',L('기타','その他','Other','其他')]];
 if(savedKind==='answer')rows.unshift(['answer',L('정답·해설 (기존 초안)','正解・解説（以前の下書き）','Answer / explanation (existing draft)','答案或解析（已有草稿）')]);
 if(savedKind==='content')rows.unshift(['content',L('문제·보기 (기존 초안)','問題・選択肢（以前の下書き）','Question / options (existing draft)','题目或选项（已有草稿）')]);return rows};
function footer(q,context){const x=identity(q,context),d=read(x.id),formReady=!!reportFormConfig();return `<details class="hqReport" data-report-meta="${h(JSON.stringify(x))}"><summary>${L('이 문제 오류 신고 작성','この問題の不具合を記録','Report a problem with this question','填写本题错误报告')}</summary><p>${L('기기에 저장됩니다. 운영자에게 전송되지 않습니다. 저장 후 내용을 복사해 전달해 주세요.','端末に保存します。運営者には送信されません。保存後、コピーして共有してください。','Saved on this device only; not sent to the team. Save and copy the report to share it.','仅保存在此设备，不会发送给运营者。保存后请复制并分享。')}</p><p class="hqReportPrivacy">${L('신고 폼에는 문항 ID·앱 버전·급수·영역·작성 내용을 전달합니다. 이름, 이메일, 전화번호 등 개인정보는 쓰지 마세요. 외부 Google 폼에서 제출해야 접수됩니다.','問題ID・アプリ版・級・分野・入力内容をフォームへ渡します。氏名・メール・電話番号などの個人情報は書かないでください。外部の Google フォームで送信が必要です。','The form receives the question ID, app version, level, section and your report. Do not include names, email addresses, phone numbers or other personal information. Submit in the external Google Form to send it.','表单将预填题目ID、应用版本、级别、领域及报告内容。请勿填写姓名、邮箱、电话号码等个人信息，需在外部 Google 表单中提交。')}</p>${formReady?'':`<p>${L('신고 폼 연결 준비 중 — 초안 저장과 복사는 사용할 수 있습니다.','報告フォーム準備中 — 下書きの保存とコピーは利用できます。','Report form connection pending — drafts and copying remain available.','报告表单连接准备中，仍可保存和复制草稿。')}</p>`}${reportIdentity(x)}<label>${L('오류 종류','種類','Issue type','错误类型')}<select data-report-kind>${types(d.kind).map(([v,label])=>`<option value="${v}" ${d.kind===v?'selected':''}>${label}</option>`).join('')}</select></label><label>${L('오류 내용','内容','What went wrong?','错误内容')}<textarea data-report-body rows="4" maxlength="4000" placeholder="${L('어느 부분이 어떻게 잘못되었는지 적어 주세요.','どこがどのように間違っているか記入してください。','Describe the problem and where it occurs.','请描述错误所在及具体情况。')}">${h(d.body||'')}</textarea></label><div class="hqReportActions"><button type="button" data-report-action="open-form" ${formReady?'':'disabled'}>${L('신고 폼 열기','報告フォームを開く','Open report form','打开报告表单')}</button><button type="button" data-report-action="save">${L('기기에 저장','端末に保存','Save on device','保存到设备')}</button><button type="button" data-report-action="copy">${L('신고 내용 복사','内容をコピー','Copy report','复制报告')}</button></div><p class="hqReportStatus" role="status" aria-live="polite"></p><textarea data-report-export readonly hidden aria-label="${L('복사할 신고 내용','コピーする内容','Report text to copy','待复制的报告内容')}"></textarea></details>`}
function persist(meta,kind,body){const row={...meta,kind,body:String(body).slice(0,4000),updatedAt:new Date().toISOString(),delivery:'local-only'};memory.set(meta.id,row);try{const all=JSON.parse(localStorage.getItem(KEY)||'{}');if(!all||typeof all!=='object'||Array.isArray(all))throw Error('Invalid draft storage');all[meta.id]=row;localStorage.setItem(KEY,JSON.stringify(all));return {ok:true,row}}catch{return {ok:false,row}}}
function exportText(row){return JSON.stringify(row,null,2)}
// A verified prefill connection does not certify external submission or response access.
function reportFormConfig(){
 const config=window.HARUMAL_REPORT_FORM_CONFIG;if(config?.verified!==true)return null;
 try{const url=new URL(config.url),fields=config.fields,keys=['id','version','level','section','body'];
  if(url.protocol!=='https:'||url.hostname!=='docs.google.com'||url.port||url.username||url.password||!/^\/forms\/d\/(?:e\/)?[A-Za-z0-9_-]+\/viewform$/.test(url.pathname))return null;
  if(!fields||keys.some(key=>!/^entry\.\d+$/.test(fields[key])))return null;
  if(fields.kind!==undefined){if(!/^entry\.\d+$/.test(fields.kind))return null;keys.push('kind')}
  if(new Set(keys.map(key=>fields[key])).size!==keys.length)return null;
  url.search='';url.hash='';return {url,fields,keys,kindValues:config.kindValues};
 }catch{return null}
}
function reportFormUrl(row){
 const config=reportFormConfig();if(!config)return {ok:false,reason:'unconfigured'};
 const legacy={answer:'정답·해설',content:'문제·보기'}[row.kind];
 const body=(legacy?`[기존 초안 오류 유형: ${legacy}]\n`:'')+String(row.body??'');
 const values={id:String(row.id??''),version:String(row.version??''),level:row.level===2?'TOPIK II':'TOPIK I',section:String(row.section??''),body,kind:String(config.kindValues?.[row.kind]??config.kindValues?.other??row.kind??'other')};
 config.url.searchParams.set('usp','pp_url');
 for(const key of config.keys)config.url.searchParams.set(config.fields[key],values[key]);
 const url=config.url.href;return url.length>8000?{ok:false,reason:'too-long'}:{ok:true,url};
}
function openReportForm(el,result){
 const status=el.querySelector('.hqReportStatus'),link=reportFormUrl(result.row);
 if(!link.ok){status.textContent=link.reason==='too-long'?L('내용이 길어 폼 링크를 만들 수 없습니다. 초안을 유지한 채 내용을 줄이거나 신고 내용을 복사해 주세요.','内容が長すぎます。下書きは保持しています。短くするか、報告をコピーしてください。','The report is too long for a prefilled link. Your draft is retained; shorten it or copy the report.','内容过长，无法生成预填链接。草稿已保留，请缩短或复制报告。'):L('신고 폼 연결을 준비 중입니다. 초안 저장과 복사는 계속 사용할 수 있습니다.','報告フォームを準備中です。下書きの保存とコピーは利用できます。','The report form is not connected yet. You can still save and copy drafts.','报告表单尚未连接，仍可保存和复制草稿。');return}
 const anchor=document.createElement('a');anchor.href=link.url;anchor.target='_blank';anchor.rel='noopener noreferrer';anchor.referrerPolicy='no-referrer';document.body.appendChild(anchor);anchor.click();anchor.remove();
 const notice=L('Google 폼에서 내용을 확인하고 제출해야 접수됩니다. 이 앱에서는 접수 여부를 확인할 수 없습니다.','Google フォームで内容を確認して送信してください。このアプリでは受付状況を確認できません。','Review and submit in Google Forms to send the report. This app cannot confirm receipt.','请在 Google 表单中确认并提交。本应用无法确认是否已接收。');
 status.textContent=(result.ok?'':status.textContent+' ')+notice;
}
function formData(el){return {meta:JSON.parse(el.dataset.reportMeta),kind:el.querySelector('[data-report-kind]').value,body:el.querySelector('[data-report-body]').value}}
function saveForm(el){const {meta,kind,body}=formData(el),result=persist(meta,kind,body);el.querySelector('.hqReportStatus').textContent=result.ok?L('기기에 저장했습니다. 아직 전송되지 않았습니다.','端末に保存しました。未送信です。','Saved on this device. Not sent.','已保存到此设备，尚未发送。'):L('기기에 저장하지 못했습니다. 이 화면의 내용을 복사해 보관해 주세요.','端末に保存できません。画面の内容をコピーしてください。','Could not save on this device. Copy the text before leaving this page.','无法保存到设备，请在离开前复制内容。');return result}
document.addEventListener('input',e=>{if(e.target.matches?.('[data-report-body],[data-report-kind]'))saveForm(e.target.closest('.hqReport'))});
document.addEventListener('change',e=>{if(e.target.matches?.('[data-report-kind]'))saveForm(e.target.closest('.hqReport'))});
document.addEventListener('click',async e=>{const idButton=e.target.closest?.('[data-copy-question-id]');if(idButton){e.stopPropagation();const status=idButton.parentElement.querySelector('.hqCopyStatus');try{await navigator.clipboard.writeText(idButton.dataset.copyQuestionId);status.textContent=L('복사됨','コピー済み','Copied','已复制')}catch{status.textContent=L('ID를 길게 눌러 복사해 주세요.','IDを長押ししてコピーしてください。','Select the ID to copy it.','请选中ID进行复制。')}return}const button=e.target.closest?.('[data-report-action]');if(!button)return;const el=button.closest('.hqReport');e.stopPropagation();const result=saveForm(el);if(button.dataset.reportAction==='open-form'){openReportForm(el,result);return}if(button.dataset.reportAction!=='copy')return;const value=exportText(result.row),status=el.querySelector('.hqReportStatus');try{await navigator.clipboard.writeText(value);status.textContent=L('복사했습니다. 운영자에게 직접 전달해 주세요.','コピーしました。運営者に共有してください。','Copied. Share this text with the team.','已复制，请自行分享给运营者。')}catch{const output=el.querySelector('[data-report-export]');output.hidden=false;output.value=value;output.focus();output.select();status.textContent=L('자동 복사에 실패했습니다. 아래 내용을 직접 복사해 주세요.','自動コピーに失敗しました。下の内容をコピーしてください。','Automatic copy failed. Select and copy the text below.','自动复制失败，请手动复制下方内容。')}});
window.HARUMAL_QUESTION_TOOLS=Object.freeze({identity,badge,footer,persist,read,exportText,reportFormUrl,storageKey:KEY});
})();
