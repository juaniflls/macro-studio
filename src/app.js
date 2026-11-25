/* Macro Studio 1.0 — standalone presentation and qualitative analysis editor. */
'use strict';
(function(){
  const KEY='macro-studio-visual-v50';
  const root=document.getElementById('app');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid=()=>('id-'+Math.random().toString(36).slice(2,9));
  const clone=x=>JSON.parse(JSON.stringify(x));
  const TITLES={goods:'Bienes y servicios',labor:'Mercado laboral',money:'Mercado monetario',fx:'Mercado cambiario'};
  const CODES={goods:'Y',labor:'W · L',money:'i',fx:'TC'};
  const CHARTS=['goods','labor','money','fx'];
  const BANK=[
    ['¿Qué sucede si el gobierno aumenta el gasto público?','gasto_publico',1,'Política fiscal expansiva · bienes y servicios'],
    ['¿Qué sucede si el gobierno disminuye el gasto público?','gasto_publico',-1,'Política fiscal restrictiva · bienes y servicios'],
    ['¿Qué sucede si el BCCR aplica una política monetaria restrictiva?','contraccion_monetaria',1,'Política monetaria restrictiva · mercado monetario'],
    ['¿Qué sucede si aumenta el gasto en infraestructura del sector público?','infra',1,'Mercado de bienes y servicios'],
    ['¿Qué sucede si disminuye el tipo de cambio?','tipo_cambio_exo',-1,'Mercado de bienes y servicios'],
    ['¿Qué sucede si disminuyen las tasas de interés?','tasas_nacionales',-1,'Situación económica de referencia'],
    ['¿Qué sucede si aumentan las importaciones?','importaciones',1,'Situación económica de referencia'],
    ['¿Qué sucede si las importaciones disminuyen?','importaciones',-1,'Situación económica de referencia'],
    ['¿Qué sucede si aumentan las tasas de interés?','tasas_nacionales',1,'Situación económica de referencia'],
    ['¿Qué sucede si aumenta el tipo de cambio?','tipo_cambio_exo',1,'Situación económica de referencia'],
    ['¿Qué sucede si disminuye el gasto público en infraestructura?','infra',-1,'Situación económica de referencia'],
    ['¿Qué sucede si aumentan los salarios?','salario_exo',1,'Situación económica de referencia'],
    ['¿Qué sucede si hay un proceso migratorio hacia Costa Rica?','migracion_entrada',1,'Caso laboral / migración'],
    ['¿Qué sucede si hay un proceso migratorio fuera de Costa Rica?','migracion_salida',1,'Caso laboral / migración'],
    ['¿Qué sucede si hay una mayor demanda por precaución a nivel nacional?','dinero_precaucion',1,'Mercado monetario'],
    ['¿Qué sucede si el gobierno disminuye la deuda interna?','deuda_interna',-1,'Mercado monetario'],
    ['¿Qué sucede si aumenta la deuda interna del gobierno?','deuda_interna',1,'Mercado monetario'],
    ['¿Qué sucede si aumentan los impuestos?','impuestos',1,'Mercado de bienes y servicios'],
    ['¿Qué sucede si disminuye la inversión extranjera directa?','ied',-1,'Mercado cambiario'],
    ['¿Qué pasa si disminuyen las tasas de interés internacionales?','tasas_externas',-1,'Mercado cambiario'],
    ['¿Qué pasa si aumentan las exportaciones como resultado de un TLC?','exportaciones',1,'Mercado cambiario'],
    ['¿Qué pasa si el BCCR aplica una política monetaria expansiva?','expansion_monetaria',1,'Mercado cambiario'],
        
    ['¿Qué sucede si la tecnología desplaza mano de obra a nivel nacional?','tecnologia_sust',1,'Mercado monetario'],
    
  ];
  const mkcase=(title='Nuevo caso',shockId='infra',direction=1)=>({id:uid(),title,shockId,direction:shockId==='tecnologia_sust'?1:direction,showSecond:true,showIS:true,showFX:true,showExplanation:true,showPolicyMap:false,balanceChoice:'consumption',routeMode:'cambiario',dualChoice:'exchange',tradeChoice:'autonomous',manualNumbers:{},overrides:{},note:''});
  const mkpres=(name='Nueva colección')=>({id:uid(),title:name,cases:[mkcase('Nuevo caso')],description:''});
  const seed=()=>({version:50,presentations:[
  {id:'p-start',title:'Mis casos',description:'Colección editable de escenarios económicos.',cases:[mkcase('¿Qué sucede si el gobierno disminuye la deuda interna?','deuda_interna',-1),mkcase('¿Qué sucede si la tecnología desplaza mano de obra a nivel nacional?','tecnologia_sust',1)]},
  {id:'p-clase',title:'Casos de referencia',description:'Colección de escenarios económicos para comparar rutas y supuestos.',cases:[
    mkcase('¿Qué sucede si disminuye la inversión extranjera directa?','ied',-1),
    {...mkcase('IED ↓: modelo con doble inicio en inversión nacional y oferta de dólares','ied',-1),routeMode:'dual',dualChoice:'investment'},
    mkcase('¿Qué sucede si aumenta la deuda interna del gobierno?','deuda_interna',1),
    mkcase('¿Qué sucede si aumenta la migración hacia Costa Rica?','migracion_entrada',1),
    mkcase('¿Qué sucede si hay una política monetaria expansiva del BCCR?','expansion_monetaria',1),
    mkcase('¿Qué sucede si las tasas de interés internacionales disminuyen?','tasas_externas',-1),
    mkcase('¿Qué sucede si aumentan las exportaciones como resultado de un TLC?','exportaciones',1)
  ]}
 ],activePres:'p-start',activeCase:null,customShocks:[]});
  let initial;try{initial=JSON.parse(document.getElementById('macro-snapshot')?.textContent||'null')}catch(_){initial=null}
  let formulaStageSelection='all';
  let formulaLibraryOpened=false;
  let state=initial; if(!state){try{state=JSON.parse(localStorage.getItem(KEY))}catch(_){state=null}}if(!state?.presentations?.length){try{const archived=JSON.parse(localStorage.getItem('macro-studio-visual-v32'));if(archived?.presentations?.length)state=archived;}catch(_){}}if(!state?.presentations?.length)state=seed(); state.version=51; for(const pr of state.presentations){for(const cs of pr.cases||[]){if(!['consumption','investment','exchange'].includes(cs.balanceChoice))cs.balanceChoice='consumption';cs.overrides??={};}}
  for(const p of state.presentations)for(const c of p.cases){if(c.shockId==='tecnologia_sust'){c.direction=1;if(/IA desplaza mano de obra/i.test(c.title))c.title='¿Qué sucede si la tecnología desplaza mano de obra a nivel nacional?';}c.showSecond??=true;c.showIS??=true;c.showFX??=true;c.showExplanation??=true;c.showPolicyMap??=false;c.manualNumbers??={};c.overrides??={};c.note??='';c.routeMode??='cambiario';c.dualChoice??='exchange';c.tradeChoice??='autonomous';}
  for(const savedPres of state.presentations){
    if(/^Ejercicios del grupo \d+ · IS–LM$/.test(savedPres.title)) savedPres.title='Mis casos';
    if(/^Ejercicio del grupo \d+ y casos para contrastar primero y segundo orden$/.test(savedPres.description)) savedPres.description='Colección editable de escenarios económicos.';
  }
  if(!Array.isArray(state.customShocks))state.customShocks=[];
  // Las colecciones eliminadas por el usuario no se restauran automáticamente.
  for(const col of state.presentations){
    if(col.id==='p-clase' && col.title==='Ejercicios de clase · 17 noviembre')col.title='Casos de referencia';
  }
  state.activePres ||=state.presentations[0].id;
  let mode='editor',slideIndex=0,help=false,toastT,diagnosticPoint={Y:42,i:77};
  const pres=()=>state.presentations.find(p=>p.id===state.activePres)||state.presentations[0];
  const selected=()=>pres().cases.find(c=>c.id===state.activeCase)||pres().cases[0];
  if(!state.activeCase)state.activeCase=selected().id;
  const allShocks=()=>[...MS.CATALOG,...state.customShocks];
  const shock=c=>allShocks().find(s=>s.id===c.shockId)||MS.CATALOG[0];
  const titleForCase=c=>BANK.find(b=>b[1]===c.shockId&&b[2]===c.direction)?.[0]||`Escenario: ${shock(c).label} ${c.direction>0?'↑':'↓'}`;
  const analyze=c=>MS.analyze(c,state.customShocks);
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){/* JSON export remains available */}};
  const btn=(t,a,cls='',extra='')=>`<button type="button" class="button ${cls}" data-act="${a}" ${extra}>${t}</button>`;
  const pill=(t,kind='')=>`<span class="pill ${kind}">${esc(t)}</span>`;
  function toast(msg){document.querySelector('.toast')?.remove();let div=document.createElement('div');div.className='toast';div.textContent=msg;document.body.append(div);clearTimeout(toastT);toastT=setTimeout(()=>div.remove(),3500)}
  const sign=v=>v>0?'↑':v<0?'↓':'↔';
  const SUFFIX={goods:'Ye',labor:'Le',money:'ie',fx:'TCe'};
  const QDIR=v=>v<0?'disminuye':'aumenta';
  // Colecciones y casos: selección, renombrado, duplicado y eliminación sin salir del panel.
  const railIcon=(action,id,glyph,title,extra='')=>`<button type="button" class="rail-tool ${extra}" data-act="${action}" data-id="${esc(id)}" title="${esc(title)}" aria-label="${esc(title)}">${glyph}</button>`;
  const panelList=()=>`<aside class="rail" aria-label="Espacio de trabajo">
    <div class="rail-heading"><div><div class="rail-label">ESPACIO DE TRABAJO</div><strong>Colecciones</strong></div>${btn('+','new-pres','rail-add','title="Nueva colección" aria-label="Nueva colección"')}</div>
    <div class="preslist">${state.presentations.map(p=>`<div class="pres-row ${p.id===pres().id?'on':''}">
      <button class="pres-entry ${p.id===pres().id?'on':''}" data-act="pick-pres" data-id="${esc(p.id)}" title="${esc(p.title)}" aria-label="Abrir colección ${esc(p.title)}"><span class="folder-icon">▤</span><span class="truncate">${esc(p.title)}</span><b>${p.cases.length}</b></button>
      <div class="rail-tools">${railIcon('rename-pres',p.id,'✎','Renombrar colección '+p.title)}${railIcon('duplicate-pres',p.id,'▢','Duplicar colección '+p.title)}${railIcon('delete-pres',p.id,'×','Eliminar colección '+p.title,'danger')}</div></div>`).join('')}</div>
    <div class="rail-row"><span>CASOS · ${esc(pres().title)}</span>${btn('+','new-case','rail-add','title="Nuevo caso" aria-label="Nuevo caso"')}</div>
    <div class="case-list">${pres().cases.map((c,i)=>`<div class="case-row ${c.id===selected().id?'on':''}">
      <button class="case-entry ${c.id===selected().id?'on':''}" data-act="pick-case" data-id="${esc(c.id)}" title="${esc(c.title)}" aria-label="Abrir caso ${esc(c.title)}"><span class="case-index">${String(i+1).padStart(2,'0')}</span><span class="truncate">${esc(c.title)}</span></button>
      <div class="rail-tools">${railIcon('rename-case',c.id,'✎','Renombrar caso '+c.title)}${railIcon('delete-case',c.id,'×','Eliminar caso '+c.title,'danger')}</div></div>`).join('')}</div>
    <div class="rail-actions">${btn('Nueva colección','new-pres','rail-wide')}${btn('Banco de ejercicios','bank','rail-wide soft')}${btn('Limpiar espacio','clear-workspace','rail-wide reset-workspace')}</div>
    <div class="rail-note">Los cambios quedan guardados en este navegador. Usá <b>Guardar JSON</b> para respaldar las colecciones antes de limpiarlas o cambiar de equipo.</div>
    </aside>`;
  const controls=c=>`<div class="controlpanel"><div class="control-main"><label>Enunciado / título<input id="title-input" value="${esc(c.title)}" spellcheck="true"/></label><label>Variable explicativa<select id="shock-input">${Object.entries(MS.MARKETS).map(([market,title])=>`<optgroup label="${esc(title)}">${allShocks().filter(s=>s.market===market).map(s=>`<option value="${esc(s.id)}" ${c.shockId===s.id?'selected':''}>${esc(s.label)}</option>`).join('')}</optgroup>`).join('')}</select></label><label>Variación inicial${c.shockId==='tecnologia_sust'?'<small class="source-direction">El enunciado ya establece la sustitución laboral: DL disminuye.</small>':''}<select id="direction-input" ${c.shockId==='tecnologia_sust'?'disabled':''}><option value="1" ${c.direction>0?'selected':''}>${c.shockId==='tecnologia_sust'?'Sustituye mano de obra → DL ↓':'Aumenta ↑'}</option>${c.shockId==='tecnologia_sust'?'':`<option value="-1" ${c.direction<0?'selected':''}>Disminuye ↓</option>`}</select></label>${['exportaciones','importaciones','ingreso_socios'].includes(c.shockId)?`<label>Predominio entre dos vías<select id="trade-input"><option value="autonomous" ${c.tradeChoice!=='exchange'?'selected':''}>Predomina cambio comercial inicial</option><option value="exchange" ${c.tradeChoice==='exchange'?'selected':''}>Predomina retorno cambiario</option></select></label>`:''}${c.shockId==='ied'?`<label>Ruta económica<select id="route-input"><option value="cambiario" ${c.routeMode!=='dual'?'selected':''}>Inicio cambiario · ruta presentada</option><option value="dual" ${c.routeMode==='dual'?'selected':''}>Dos inicios: inversión nacional y O$</option></select></label>${c.routeMode==='dual'?`<label>Supuesto del efecto neto<select id="dual-input"><option value="exchange" ${c.dualChoice!=='investment'?'selected':''}>Predomina retorno cambiario</option><option value="investment" ${c.dualChoice==='investment'?'selected':''}>Predomina I nacional</option></select></label>`:''}`:''}</div><div class="control-options"><label class="toggle"><input id="second-input" type="checkbox" ${c.showSecond?'checked':''}/> Segundo orden</label><label class="toggle"><input id="is-input" type="checkbox" ${c.showIS?'checked':''}/> Modelo IS–LM–BP</label><label class="toggle"><input id="explain-input" type="checkbox" ${c.showExplanation?'checked':''}/> Explicaciones completas</label><label class="toggle"><input id="policy-input" type="checkbox" ${c.showPolicyMap?'checked':''}/> Diagnóstico de política económica</label>${btn('+ Variable personalizada','custom-shock','outline small')}</div></div>`;
  function balanceSelector(c){const r=analyze(c);if(!c.showSecond||!r.balance?.applicable||c.shockId==='ied'&&c.routeMode==='dual'||['exportaciones','importaciones','ingreso_socios'].includes(c.shockId))return '';
    const b=r.balance;return `<section class="balance-choice" aria-label="Alternativa de segundo orden"><div class="balance-copy"><div class="eyebrow">DECISIÓN DEL EJERCICIO · SECUENCIA ${b.stage}</div><h3>¿Cuál efecto contrapuesto predomina?</h3><p><b>Consumo (C) ${sign(b.channels[0].sign)}</b> por salarios y <b>Inversión (I) ${sign(b.channels[1].sign)}</b> por tasa de interés. ${b.channels[2]?`Además, el tipo de cambio modifica X − M (${sign(b.channels[2].sign)}).`:''} Se desarrolla el canal que predomina en el resultado neto.</p></div><fieldset class="balance-radio"><legend>Resultado para continuar el segundo orden</legend><label class="balance-option ${c.balanceChoice==='consumption'?'chosen':''}"><input type="radio" name="balanceChoice" value="consumption" ${c.balanceChoice==='consumption'?'checked':''}/><span><b>Predomina consumo (C)</b><small>DA ${sign(b.channels[0].sign)} · recálculo de efectos posteriores</small></span></label><label class="balance-option ${c.balanceChoice==='investment'?'chosen':''}"><input type="radio" name="balanceChoice" value="investment" ${c.balanceChoice==='investment'?'checked':''}/><span><b>Predomina inversión (I)</b><small>DA ${sign(b.channels[1].sign)} · recálculo de efectos posteriores</small></span></label>${b.channels[2]?`<label class="balance-option ${c.balanceChoice==='exchange'?'chosen':''}"><input type="radio" name="balanceChoice" value="exchange" ${c.balanceChoice==='exchange'?'checked':''}/><span><b>Predominan exportaciones netas (X − M)</b><small>DA ${sign(b.channels[2].sign)} · se recalculan los efectos posteriores</small></span></label>`:''}</fieldset></section>`;}
  function topbar(){return `<header class="topbar"><div class="identity"><div class="logomark">M<span>Σ</span></div><div><strong>MACRO STUDIO</strong><small>Simulador gráfico · laboratorio de casos</small></div></div><div class="toptools">${btn('Banco de ejercicios','bank','outline')}${btn('Nueva colección','new-pres','outline')}${btn('Nuevo caso','new-case','outline')}${btn('Modo exposición','present','primary')}${btn('Guardar JSON','export-json','outline')}${btn('Importar JSON','import-json','outline')}${btn('Exportar HTML','export-html','outline')}</div></header>`}
  function editor(){const c=selected(),p=pres();return `${topbar()}<div class="workspace">${panelList()}<main class="main"><div class="case-heading"><div><div class="eyebrow">${esc(p.title)} <span>/</span> caso ${p.cases.indexOf(c)+1} de ${p.cases.length}</div><h1>${esc(c.title)}</h1><div class="subtitle">Modelo de transmisión entre mercados · ecuaciones, desplazamientos y secuencia causal</div></div><div class="caseactions">${btn('Duplicar','duplicate','outline small')}${btn('Borrar','delete','ghost small')}${btn('Editar párrafos','edit-paragraphs','outline small')}</div></div>${controls(c)}${balanceSelector(c)}${caseSheet(c,false)}${footer()}</main></div>`}
  function footer(){return `<p class="method-footer">Análisis cualitativo de primer y segundo orden, con números de secuencia, curvas y equilibrios de referencia.</p>`}
  function stageList(c,r,m){let events=r.changes[m];if(c.showSecond===false)events=events.filter(e=>e.round!=='segundo');let manual=c.manualNumbers?.[m];return manual?.trim()?manual.split(/[\s,;]+/).filter(x=>/^\d{1,2}$/.test(x)).map(Number):events.map(e=>e.stage)}
  function stepDots(c,r,m){const events=(c.showSecond?r.changes[m]:r.changes[m].filter(e=>e.round!=='segundo'));
    const manual=c.manualNumbers?.[m];if(manual?.trim())return manual.split(/[\s,;]+/).filter(x=>/^\d{1,2}$/.test(x)).map(x=>`<span class="stage-dot stage-first">${x}</span>`).join('');
    if(!events.length)return '<span class="stage-none">Sin desplazamiento</span>';
    return events.map(e=>`<span class="stage-dot ${e.round==='segundo'?'stage-second':'stage-first'}">${e.stage}</span>`).join('');}

  const exactKey=c=>`${c.shockId}:${c.direction}`;
  const refSection=(c,m)=>REFERENCE_CASES[exactKey(c)]?.[m];
  const SERIES={da:'DA',oa:'OA',dl:'DL',ol:'OL',ms:'Ms',md:'Md',os:'O$',ds:'D$'};
  const RANK_COLORS=['#24384b','#1879b9','#cc3889','#8550ba','#167d6c','#bd7513','#d64c47'];
  const STAGE_COLORS={1:'#172d41',2:'#1879b9',3:'#cc3889',4:'#8550ba'};
  const stageColor=n=>STAGE_COLORS[n]||RANK_COLORS[(n-1)%RANK_COLORS.length];
  const changedColor=(stage,revision,round)=>round==='segundo'?'#cc3889':'#1879b9';
  const movename=v=>v>0?'aumenta':'disminuye';
  const pastname=v=>v>0?'aumentó':'disminuyó';
  const specialRefFix=t=>String(t).replace(/\bdezplaza\b/gi,'desplaza').replace(/\bLos empresas\b/g,'Las empresas').replace(/\bdemandada de trabajo\b/g,'demanda de trabajo').replace(/\bse disminuye la demanda\b/g,'disminuye la demanda').replace(/\s+se\s+disminuye\s+la\s+demanda/gi,' disminuye la demanda');
  const variantIndex=(r,m,ev)=>1+r.changes[m].filter(x=>x.curve===ev.curve && x.stage<=ev.stage).length;
  const movingCurve=(r,m,ev)=>SERIES[ev.curve]+variantIndex(r,m,ev);
  const previousCurve=(r,m,ev)=>SERIES[ev.curve]+(variantIndex(r,m,ev)-1);
  const hasShock=(r,m)=>r.shock.market===m;
  function subjectPhrase(label){
    const t=String(label).toLowerCase();
    if(/^(compras|transferencias|exportaciones|importaciones|remesas|tasas|pensiones|restricciones)/.test(t))return 'las '+t;
    if(/^(impuestos|salarios|flujos|préstamos|obstáculos|desastres)/.test(t))return 'los '+t;
    if(/^(deuda|inversión|tasa|demanda|oferta|emisión|política|participación|inmigración|emigración|migración|tecnología|disponibilidad|propensión|inteligencia)/.test(t))return 'la '+t;
    if(/^(gasto|tipo|encaje|consumo|ingreso|crédito|acceso|turismo|atractivo|capital|desastre)/.test(t))return 'el '+t;
    return t;
  }
  function causalLead(c,r,m,e,prior,next,priorEq,nextEq){
    const inc=movename(e.sign),dec=movename(-e.sign),verb=(c?.direction??r.dir)>0?'aumenta':'disminuye';
    const yStart=r.shock.market==='goods'?1:r.shock.market==='labor'?1:r.shock.market==='money'?1:1;
    if(e.stage===1){
      if(m==='goods')return `Debido a que ${subjectPhrase(r.shock.label)} ${verb}, se modifica ${r.shock.channel} en la expresión DA = C + I + G + X − M. Por ello, la demanda agregada ${movename(e.sign)}: ${prior} se desplaza a ${next}.`;
      if(m==='labor')return r.shock.id==='tecnologia_sust'?`Debido a que la tecnología desplaza mano de obra a nivel nacional, las empresas necesitan menos trabajadores para una misma producción; por ello, la demanda laboral disminuye. Según DL = f(Y, tecnología), ${prior} se desplaza a la izquierda hasta ${next}, manteniéndose OL1 fija.`:`Debido a que ${subjectPhrase(r.shock.label)} ${verb}, la ${e.curve==='ol'?'oferta':'demanda'} de trabajo ${movename(e.sign)}. Según ${e.curve==='ol'?'OL = f(migración, educación y capacitación, desastres naturales)':'DL = f(Y, tecnología)'}, ${prior} se desplaza ${e.sign>0?'a la derecha':'a la izquierda'} hasta ${next}.`;
      if(m==='money')return `Debido a que ${subjectPhrase(r.shock.label)} ${verb}, la ${e.curve==='ms'?'oferta':'demanda'} de dinero ${movename(e.sign)} en el mercado monetario. Por ello, ${prior} se desplaza ${e.sign>0?'a la derecha':'a la izquierda'} hasta ${next}, de acuerdo con ${e.curve==='ms'?'Ms = f(EML, BEMs, TPM, emisión monetaria)':'Md = f(Y, transacciones, precaución, especulación, deuda interna)'}.`;
      return `Debido a que ${subjectPhrase(r.shock.label)} ${verb}, la ${e.curve==='os'?'oferta':'demanda'} de dólares ${movename(e.sign)} en el mercado cambiario: ${prior} se desplaza ${e.sign>0?'a la derecha':'a la izquierda'} hasta ${next}.`;
    }
    if(m==='goods'){
      if(e.stage===2 && r.shock.market==='money')return `Debido a que la tasa de interés ${movename(r.dominant.interest)} de ie1 a ie2 como resultado del efecto 1 monetario, se modifica la inversión (I), conforme a I = f(i, acceso al crédito y restricciones). Al aplicar DA = C + I + G + X − M, la curva ${prior} se desplaza hacia ${next}.`;
      if(e.stage===2 && r.shock.market==='labor')return `Debido a que en el mercado laboral los salarios ${r.dominant.wage>0?'aumentan':'disminuyen'} de We1 a We2 (efecto 1), se modifica el ingreso disponible y, por tanto, el consumo (C). Como C forma parte de DA = C + I + G + X − M, la curva ${prior} se desplaza hacia ${next}.`;
      if(e.stage===2 && r.shock.market==='fx')return `Debido a que el tipo de cambio ${movename(r.dominant.exchange)} de TCe1 a TCe2 en el mercado cambiario (efecto 1), se modifican las exportaciones (X) y las importaciones (M). En DA = C + I + G + X − M, el resultado desplaza ${prior} hacia ${next}.`;
      if(e.stage===3 && r.shock.market==='money')return `En la secuencia 2, la tasa de interés modificó la oferta de dólares y por tanto el tipo de cambio. Este nuevo tipo de cambio modifica las exportaciones (X) y las importaciones (M). Por ello, DA ${movename(e.sign)} de ${prior} a ${next} mediante X − M.`;
      if(e.stage===4 && r.shock.market==='labor')return `Debido al cambio en la demanda de trabajo de la secuencia 3, los salarios modifican el consumo (C); al mismo tiempo, el cambio de Md modifica la tasa de interés (i) y la inversión (I). Dentro de DA = C + I + G + X − M se escoge predominio de ${r.balance?.choice==='investment'?'inversión (I)':'consumo (C)'}, por lo que DA ${movename(e.sign)} y ${prior} pasa a ${next}.`;
      if(e.stage===4 && r.shock.market==='money')return `Debido a los dos efectos simultáneos de la secuencia 3, en el mercado laboral los salarios ${r.dominant.wage>0?'aumentan':'disminuyen'} de We1 a We2 y modifican el consumo (C); en el mercado monetario, la tasa de interés ${r.dominant.interest>0?'disminuye parcialmente desde ie2 hacia ie3':'aumenta parcialmente desde ie2 hacia ie3'} y modifica la inversión (I). Ambas variables participan en DA = C + I + G + X − M. Se escoge predominio de ${r.balance?.choice==='investment'?'inversión (I)':'consumo (C)'}, por lo que DA ${movename(e.sign)} y ${prior} pasa a ${next}.`;
      if(e.stage===4 && r.shock.market==='fx')return `En la secuencia 3 los salarios afectan el consumo, el cambio de la tasa de interés modifica la inversión y el tipo de cambio cambia X − M. En el efecto 4 predomina ${r.balance?.choice==='exchange'?'X − M':r.balance?.choice==='investment'?'la inversión (I)':'el consumo (C)'}. Por ello, DA ${movename(e.sign)} y ${prior} se desplaza a ${next}.`;
      if(e.stage===3)return `Debido a los efectos simultáneos de la secuencia 2, los salarios pasan de We1 a We2, el tipo de cambio de TCe1 a TCe2 y la tasa de interés de ie1 a ie2. Estos cambios afectan C, (X − M) e I, respectivamente, dentro de DA = C + I + G + X − M. Según la alternativa escogida, la demanda agregada ${movename(e.sign)} de ${prior} a ${next}.`;
      return `Debido a los cambios de salarios, tipo de cambio e interés derivados de la secuencia 3, se modifican C, (X − M) e I dentro de DA = C + I + G + X − M. La demanda agregada pasa de ${prior} a ${next} en la secuencia ${e.stage}.`;
    }
    if(m==='labor'){
      if(e.stage===1)return `Debido a que ${subjectPhrase(r.shock.label)} ${verb}, la curva ${prior} se desplaza a ${next} en DL = f(Y, tecnología) u OL = f(migración, educación, desastres).`;
      return `Debido a que la producción nacional ${movename(e.sign)} de Ye${e.stage>3?2:1} a Ye${e.stage>3?3:2} como resultado del efecto anterior en bienes y servicios, la demanda de trabajo también ${movename(e.sign)}. Conforme DL = f(Y, tecnología), ${prior} se desplaza hasta ${next}.`;
    }
    if(m==='money')return `Debido a que la producción nacional ${movename(e.sign)} de Ye${e.stage>3?2:1} a Ye${e.stage>3?3:2} en bienes y servicios, la demanda de dinero para transacciones también ${movename(e.sign)}. Según Md = f(Y, transacciones, precaución, especulación y deuda interna), ${prior} se desplaza ${e.sign>0?'a la derecha':'a la izquierda'} hasta ${next}.`;
    if(e.curve==='os')return `Debido al cambio de la tasa de interés nacional (ie1 a ie2) en el mercado monetario, cambian los flujos de capital y la oferta de dólares. La curva ${prior} se desplaza hacia ${next} en la secuencia ${e.stage}.`;
    return `Debido a que la producción nacional ${movename(e.sign)} de Ye1 a Ye2 en bienes y servicios, las importaciones (M) ${e.sign>0?'aumentan':'disminuyen'} y, por ello, la demanda de dólares (D$). La curva ${prior} se desplaza hacia ${next} en la secuencia ${e.stage}.`;
  }
  function numberedFour(c,r,m,e){
    const n=r.changes[m].indexOf(e),idx=n+2,prev=idx-1,eq0='E'+prev,eq1='E'+idx;
    const prior=previousCurve(r,m,e),next=movingCurve(r,m,e),down=e.sign<0;
    const lead=causalLead(c,r,m,e,prior,next,eq0,eq1);
    if(m==='goods')return [
      lead,
      `Al nivel de producción de equilibrio anterior (Ye${prev}), la ${next} es ${down?'menor':'mayor'} que la Oferta Agregada (OA), generándose un exceso de ${down?'oferta':'demanda'} agregada. La OA permanece en la misma posición.`,
      `Los inventarios de los productores se empiezan a ${down?'acumular':'agotar'}, hay presión para que ${down?'bajen':'suban'} los precios e incentivos para ${down?'disminuir':'aumentar'} la producción desde Ye${prev}.`,
      `Se alcanza un nuevo equilibrio (${eq1}) con un nivel de producción ${down?'menor':'mayor'} (Ye${idx}) ${down?'sin presión adicional para que haya inflación':'con presión para que haya inflación'}.`
    ];
    if(m==='labor'){
      const offer=e.curve==='ol', wsign=offer?-e.sign:e.sign,excess=offer?(e.sign>0?'oferta':'demanda'):(e.sign>0?'demanda':'oferta');
      return [lead,
        `Al salario de equilibrio anterior (We${prev}), la cantidad ${excess==='demanda'?'demandada':'ofrecida'} de trabajo es mayor a la ${excess==='demanda'?'ofrecida':'demandada'}; por tanto, existe un exceso de ${excess} de trabajo entre ${next} y la curva opuesta.`,
        `${excess==='demanda'?'Las empresas, con tal de conseguir trabajadores, están dispuestas a aumentar':'Los trabajadores, con tal de conseguir empleo, están dispuestos a reducir'} el salario, que pasa de We${prev} a We${idx}.`,
        `Nuevo equilibrio (${eq1}): la cantidad ofrecida y demandada de trabajo son iguales a un salario ${wsign>0?'mayor':'menor'} (We${idx}) y con un nivel de empleo ${e.sign>0?'mayor':'menor'} (Le${idx}).`
      ];
    }
    if(m==='money'){
      const ir=e.curve==='ms'?-e.sign:e.sign;
      return [lead,
        `A la tasa de interés de equilibrio anterior (ie${prev}), existe un exceso de ${ir>0?'demanda':'oferta'} de dinero, porque la ${e.curve==='ms'?'oferta monetaria':'demanda monetaria'} ha pasado de ${prior} a ${next} mientras la otra curva permanece fija.`,
        `Ese exceso genera presión para que la tasa de interés ${ir>0?'aumente':'disminuya'} de ie${prev} a ie${idx}.`,
        `Se establece el nuevo equilibrio monetario (${eq1}) con una tasa de interés ${ir>0?'mayor':'menor'} (ie${idx}).${e.round==='segundo'&&r.shock.market==='money'?` Se trata de un rebote parcial: ie${idx} permanece ${r.dominant.interest>0?'por encima':'por debajo'} de ie1, porque el efecto de segundo orden es menor que el inicial.`:''}`
      ];
    }
    const ts=e.curve==='os'?-e.sign:e.sign;
    const opposite=e.curve==='os'?'ds':'os';
    const oppositeAtPrev=SERIES[opposite]+(1+r.changes.fx.filter(ev=>ev.curve===opposite&&ev.stage<e.stage).length);
    return [lead,
      `Al tipo de cambio de equilibrio anterior (TCe${prev}), la ${e.curve==='os'?'oferta':'demanda'} de dólares ${next} es ${e.sign>0?'mayor':'menor'} que ${oppositeAtPrev}; se genera un exceso de ${ts>0?'demanda':'oferta'} de dólares.`,
      `Ese exceso genera presión para que el tipo de cambio ${ts>0?'aumente':'disminuya'} de TCe${prev} a TCe${idx}.`,
      `Finalmente, se alcanza el nuevo equilibrio cambiario (${eq1}) con un tipo de cambio ${ts>0?'mayor':'menor'} (TCe${idx}).`
    ];
  }
  function enrichOriginal(t,r,m,e,i){
    let x=specialRefFix(t), k=r.changes[m].indexOf(e), next=movingCurve(r,m,e),prev=previousCurve(r,m,e);
    if(i===0){
      const lead=causalLead(null,r,m,e,prev,next);
      if(m==='goods'&&e.stage===3){x=x.replace(/^Al aumentar los salarios|^Al disminuir los salarios/i,`Debido a que los salarios ${e.sign>0?'aumentan':'disminuyen'} de We1 a We2`);x+=` También intervienen el tipo de cambio (TCe1 a TCe2) y la tasa de interés (ie1 a ie2), que modifican X − M e I. La demanda agregada cambia de ${prev} a ${next}.`}
      else if(m==='labor'&&e.stage>1){x=x.replace(/\(DL\)/g,`(${prev} a ${next})`).replace(/\(DL2\)/g,`(${prev} a ${next})`);}
      else if(m==='money'&&e.curve==='md'){x=x.replace(/\(Md1\)/g,`(${prev} a ${next})`);}
      else if(m==='fx'&&e.curve==='ds'){x=x.replace(/\(D\$1 a D\$2\)/g,`(${prev} a ${next})`);}
      if(!x.includes(next))x+=` En términos de curvas, ${prev} se desplaza a ${next}.`; if(!new RegExp('\b(?:aumenta|disminuye|aumentan|disminuyen|sube|baja|mayor|menor)\b','i').test(x))x+=` El cambio es ${e.sign>0?'un aumento':'una disminución'} de la curva correspondiente.`;
      if(!x.includes('Debido') && !x.includes('debido') && e.stage>1){x=(m==='labor'||m==='money'||m==='fx')?lead:lead+' '+x;}
    }
    if(i===1 && m==='goods')x=x.replace(/\bDA2\b|\bDA3\b/g,next);
    return x;
  }
  function paragraphsFor(c,r,m){
    const evs=r.changes[m].filter(e=>c.showSecond||e.round!=='segundo');
    const vb=v=>v>0?'aumenta':v<0?'disminuye':'se mantiene';
    const pl=v=>v>0?'aumentan':v<0?'disminuyen':'se mantienen';
    const greater=v=>v>0?'mayor':v<0?'menor':'igual';
    return evs.map(e=>{
      const k=r.changes[m].indexOf(e),prev=previousCurve(r,m,e),next=movingCurve(r,m,e);
      const oldEq=k+1,newEq=k+2;
      let paras=[];
      if(m==='goods'){
        paras=[
          `${e.why} La curva de demanda agregada ${prev} pasa a ${next} (${vb(e.sign)}), según DA = C + I + G + X − M.`,
          `A la producción Ye${oldEq} del equilibrio anterior, ${e.sign>0?'DA es mayor que la OA':'OA es mayor que la DA'}: existe exceso de ${e.sign>0?'demanda':'oferta'} agregada.`,
          `Los inventarios ${e.sign>0?'comienzan a agotarse':'se acumulan'}; las empresas reciben incentivos para ${e.sign>0?'aumentar':'reducir'} la producción y los precios afrontan presión ${e.sign>0?'alcista':'bajista'}.`,
          `Se establece E${newEq} con una producción ${greater(e.sign)}: Y pasa de Ye${oldEq} a Ye${newEq} (${vb(e.sign)}).`
        ];
      }else if(m==='labor'){
        const w=e.curve==='ol'?-e.sign:e.sign;
        paras=[
          `${e.why} La curva ${prev} se desplaza a ${next}, conforme a ${e.curve==='ol'?'OL = f(migración, educación, desastres)':'DL = f(Y, tecnología)'}.`,
          `Al salario We${oldEq}, la cantidad de trabajo ${w>0?'demandada supera la ofrecida':'ofrecida supera la demandada'}; existe exceso de ${w>0?'demanda':'oferta'} laboral.`,
          `Los salarios ${pl(w)}: We${oldEq} pasa a We${newEq}. En respuesta se ajustan las cantidades ofrecidas y demandadas de trabajo.`,
          `En E${newEq}, el salario es ${greater(w)} (We${newEq}) y el empleo de equilibrio ${vb(e.sign)} de Le${oldEq} a Le${newEq}. En un shock migratorio, este cambio de empleo no permite deducir por sí solo la tasa de desempleo.`
        ];
      }else if(m==='money'){
        const i=e.curve==='ms'?-e.sign:e.sign;
        paras=[
          `${e.why} La curva ${prev} se desplaza a ${next}, mientras la otra curva monetaria permanece fija en este paso.`,
          `A la tasa ie${oldEq}, hay exceso de ${i>0?'demanda':'oferta'} de dinero, según las condiciones iniciales de Ms y Md.`,
          `La tasa de interés nacional ${vb(i)} desde ie${oldEq} hasta ie${newEq}; se reajusta la cantidad demandada de dinero para restablecer el equilibrio.`,
          `En el nuevo equilibrio E${newEq}, la tasa de interés es ${greater(i)} (ie${newEq}) y Ms = Md.`
        ];
      }else{
        const tc=e.curve==='os'?-e.sign:e.sign;
        paras=[
          `${e.why} La curva ${prev} pasa a ${next}.`,
          `Al tipo de cambio TCe${oldEq}, la cantidad ${tc>0?'demandada supera la ofrecida':'ofrecida supera la demandada'} de dólares, lo que produce un exceso de ${tc>0?'demanda':'oferta'} de divisas.`,
          `El tipo de cambio ${vb(tc)} desde TCe${oldEq} hasta TCe${newEq}; oferentes y demandantes ajustan cantidades.`,
          `El equilibrio cambiario E${newEq} se alcanza a un TC ${greater(tc)} (TCe${newEq}) con O$ = D$.`
        ];
      }
      return {event:e,paragraphs:paras.map((x,j)=>c.overrides?.[`${m}:${k}:${j}`]??x),source:'Causalidad verificada con la secuencia'};
    });
  }
  function varColorFor(r,token){
    const m=String(token).match(/^(DA|DL|OL|Ms|Md|O\$|D\$|We|Le|Ye|TCe|ie|IS|BP)(\d+)$/);
    if(!m)return '#1e3b50';let v=m[1],num=+m[2];if(num===1)return '#172d41';
    let mk={DA:'goods',DL:'labor',OL:'labor',Ms:'money',Md:'money','O$':'fx','D$':'fx'}[v];
    if(!mk)return num===2?'#1879b9':'#cc3889';
    let code={DA:'da',DL:'dl',OL:'ol',Ms:'ms',Md:'md','O$':'os','D$':'ds'}[v];
    let ev=r.changes[mk].filter(e=>e.curve===code)[num-2];return ev?changedColor(ev.stage,num,ev.round):num===2?'#1879b9':'#cc3889';
  }
  function markVars(src,r){const safe=esc(src);return safe.replace(/(?<![\w$])(?:TCe|DA|DL|OL|Ms|Md|O\$|D\$|We|Le|Ye|ie|IS|BP)\d+\b/g,(v)=>`<strong class="economic-token" style="--token:${varColorFor(r,v)}">${v}</strong>`);}
  function explanations(c,r,m){if(!c.showExplanation)return '';
    if(m==='is'){
      let t=refSection(c,'is')?.[0]||r.explanations.is||'La IS recoge las combinaciones de tasa de interés y producción.';
      t=c.overrides?.['is:0:0']??t;
      return `<div class="narrative"><div class="narrative-header"><strong>MODELO IS</strong><span>Interpretación</span></div><div class="paragraphs"><div class="paragraph"><span class="para-n">1</span><p>${markVars(t,r)}</p></div></div></div>`;
    }
    return paragraphsFor(c,r,m).map(sec=>`<div class="narrative ${sec.event.round==='segundo'?'narrative-second':''}"><div class="narrative-header"><strong>${sec.event.round==='segundo'?'EFECTO DE SEGUNDO ORDEN':'EFECTO DE PRIMER ORDEN'}</strong><div><span class="small-stage">SECUENCIA ${sec.event.stage}</span></div></div><div class="paragraphs">${sec.paragraphs.map((v,j)=>`<div class="paragraph"><span class="para-n">${j+1}</span><p>${markVars(v,r)}</p></div>`).join('')}</div>${formulaEffectReference(c,r,m,sec.event)}</div>`).join('');
  }
  const SVG={w:800,h:570,ox:155,oy:452,sx:4.65,sy:3.78};
  const px=x=>SVG.ox+SVG.sx*x,py=y=>SVG.oy-SVG.sy*y;
  const fmt=x=>Number(x).toFixed(1);
  const text=(x,y,content,cls='axislabel',extra='')=>`<text x="${fmt(x)}" y="${fmt(y)}" class="${cls}" ${extra}>${esc(content)}</text>`;
  const line=(x1,y1,x2,y2,cls,extra='')=>`<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" class="${cls}" ${extra}/>`;
  const circle=(x,y,r,cls)=>`<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${r}" class="${cls}"/>`;
  const mstate=m=>({da:20,ol:20,dl:85,ms:52,md:87,os:15,ds:86});
  function evolution(m,events){let b=mstate(m),states=[{...b,stage:0,change:'none',round:'base'}];for(const e of events){let amt=(e.round==='segundo'?6:11)*e.sign;let c=e.curve;if(['da','dl','md','ds'].includes(c))b[c]+=amt;else if(['ol','os'].includes(c))b[c]-=amt;else if(c==='ms')b[c]+=amt;states.push({...b,stage:e.stage,change:c,round:e.round})}return states}
  function point(m,s){if(m==='goods'){let x=s.da/.5;return {x,y:x}}
    if(m==='labor'){let x=(s.dl-s.ol)/1.4;return {x,y:s.ol+.65*x}}
    if(m==='money'){let x=s.ms;return {x,y:s.md-.72*x}}
    let x=(s.ds-s.os)/1.4;return{x,y:s.os+.67*x};}
  const formula=(m,curve,s,x)=>{if(curve==='oa')return x;if(curve==='da')return s.da+.5*x;if(curve==='ol')return s.ol+.65*x;if(curve==='dl')return s.dl-.75*x;if(curve==='md')return s.md-.72*x;if(curve==='os')return s.os+.67*x;if(curve==='ds')return s.ds-.73*x;return 0};
  const clabel={da:'DA',oa:'OA',ol:'OL',dl:'DL',ms:'Ms',md:'Md',os:'O$',ds:'D$'};
  const palette=['#172d41','#1879b9','#ce418d','#7e56c2','#0b8d76','#b66b11','#e05343','#6d5f9f','#22777a','#b35387','#578c20','#374cb1','#b76e59','#0f7a69'];
  function diagram(m,c,r){const ev=r.changes[m].filter(e=>c.showSecond||e.round!=='segundo'), states=evolution(m,ev), chart=[], seen={}, pointSet=states.map(s=>point(m,s));const suffix=SUFFIX[m];
    chart.push(`<svg class="economic-svg" viewBox="0 0 ${SVG.w} ${SVG.h}" role="img" aria-label="Gráfico del mercado ${esc(TITLES[m])}, con curvas y equilibrios" xmlns="http://www.w3.org/2000/svg"><defs><marker id="axis-${m}" markerWidth="7" markerHeight="7" refX="5.8" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="#24384b"/></marker></defs>`);
    for(let n=20;n<=80;n+=20){chart.push(line(px(n),py(0),px(n),py(100),'gridline'));chart.push(line(px(0),py(n),px(100),py(n),'gridline'))}
    chart.push(line(px(0),py(0),px(104),py(0),'plot-axis',`marker-end="url(#axis-${m})"`),line(px(0),py(0),px(0),py(104),'plot-axis',`marker-end="url(#axis-${m})"`));
    const ax={goods:['Y · Producción nacional','Colones'],labor:['L · Empleo','W · Salarios'],money:['Colones','i · Tasa de interés'],fx:['Dólares','TC · Tipo de cambio']}[m];
    chart.push(text(px(50),552,ax[0],'axis-title','text-anchor="middle"'),text(px(0)+3,32,ax[1],'axis-title','text-anchor="start"'));
    if(m==='goods'){
      chart.push(line(px(0),py(0),px(96),py(96),'fixed-line'));
      chart.push(text(px(85),py(89),'OA','curve-label fixed', 'text-anchor="start"'));
    }
    const changing=m==='goods'?['da']:m==='labor'?['ol','dl']:m==='money'?['ms','md']:['os','ds'];
    const drawnLabels=[];
    for(const key of changing){
      const variants=[];
      for(const st of states){if(!variants.some(z=>z[key]===st[key]))variants.push(st)}
      variants.forEach((st,i)=>{
        const col=i===0?'#24384b':changedColor(st.stage,i+1,st.round);
        let x0,x1,y0,y1;
        if(key==='ms'){x0=x1=st.ms;y0=4;y1=97}
        else{x0=0;x1=key==='da'?97:96;y0=formula(m,key,st,x0);y1=formula(m,key,st,x1)}
        chart.push(line(px(x0),py(y0),px(x1),py(y1),'curve-line',`stroke="${col}"`));
        const labelX=key==='da'?90:key==='ms'?st.ms:key==='os'?81:key==='ds'?60:69;const labelY=key==='ms'?88:formula(m,key,st,labelX);const a=key==='ms'?{x:px(labelX)+10,y:py(labelY)}:{x:px(labelX)+13,y:py(labelY)-5};
        // Ubicar cada rótulo a la altura REAL de su curva: el orden visual
        // de DA1/DA2/DA3 nunca puede invertirse para "evitar" un solapamiento.
        // La separación natural entre desplazamientos supera la altura del texto.
        let ly=Math.max(50,Math.min(a.y,443));
        drawnLabels.push({x:a.x,y:ly,yOriginal:a.y,label:clabel[key]+(i+1),col});
      });
    }
    // Proyecciones de equilibrio: se calculan desde la intersección, sin desplazar los valores económicos.
    pointSet.forEach((q,i)=>{
      const col=i===0?palette[0]:changedColor(states[i].stage,i+1,states[i].round),cx=px(q.x),cy=py(q.y);
      chart.push(line(px(0),cy,cx,cy,'guide',`stroke="${col}"`),line(cx,cy,cx,py(0),'guide',`stroke="${col}"`));
    });
    // Evitar que We1/We2, TCe1/TCe2 o Ye1/Ye2 se tapen cuando los equilibrios estén próximos.
    const rows=[],sides=[];
    pointSet.forEach((q,i)=>{
      const col=i===0?palette[0]:changedColor(states[i].stage,i+1,states[i].round),cx=px(q.x),cy=py(q.y);
      if(m==='goods'||m==='labor'){
        let track=0;
        while(rows.some(z=>z.track===track && Math.abs(z.x-cx)<65) && track<3)track++;
        rows.push({x:cx,track});
        const label=(m==='goods'?'Ye':'Le')+(i+1);
        chart.push(text(cx,py(0)+23+track*18,label,'projection-label',`fill="${col}" text-anchor="middle"`));
      }
      if(m!=='goods'){
        let labelY=cy+4;
        let attempts=0;
        while(sides.some(z=>Math.abs(z.y-labelY)<21) && attempts<8){labelY+=(attempts%2===0?-23:46);attempts++;}
        labelY=Math.max(47,Math.min(442,labelY));
        sides.push({y:labelY});
        const targetX=px(0)-15;
        if(Math.abs(labelY-(cy+4))>5)chart.push(line(px(0)-2,cy,targetX+5,labelY-4,'annotation-leader',`stroke="${col}"`));
        chart.push(text(targetX,labelY,(m==='labor'?'We':m==='money'?'ie':'TCe')+(i+1),'projection-label',`fill="${col}" text-anchor="end"`));
      }
    });
    // Equilibrios en intersección exacta; separar E1/E2/E3 por una leyenda de líderes solo si colisionan.
    const crowded=pointSet.some((q,i)=>pointSet.some((w,j)=>j>i && Math.hypot(px(w.x)-px(q.x),py(w.y)-py(q.y))<43));
    pointSet.forEach((q,i)=>{
      const col=i===0?palette[0]:changedColor(states[i].stage,i+1,states[i].round),cx=px(q.x),cy=py(q.y);
      if(crowded){
        chart.push(`<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="7.2" fill="#fff" stroke="${col}" stroke-width="3"/>`);
        const labelX=742,labelY=119+i*44;
        chart.push(line(cx+7,cy,labelX-26,labelY-5,'annotation-leader',`stroke="${col}"`));
        chart.push(`<circle cx="${fmt(labelX)}" cy="${fmt(labelY)}" r="16" fill="#fff" stroke="${col}" stroke-width="3"/>`);
        chart.push(text(labelX,labelY+5,'E'+(i+1),'equilibrium-text',`fill="${col}" text-anchor="middle"`));
      }else{
        chart.push(`<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="16" fill="#fff" stroke="${col}" stroke-width="3.2"/>`);
        chart.push(text(cx,cy+5,'E'+(i+1),'equilibrium-text',`fill="${col}" text-anchor="middle"`));
      }
    });
    drawnLabels.forEach(l=>{
      if(Math.abs(l.yOriginal-l.y)>8)chart.push(line(l.x-3,l.yOriginal,l.x+1,l.y-4,'annotation-leader',`stroke="${l.col}"`));
      chart.push(text(l.x,l.y,l.label,'curve-label',`fill="${l.col}" text-anchor="start"`));
    });
    // Los números de secuencia están arriba de cada tarjeta; la gráfica mantiene solo E, ejes y curvas.
    chart.push('</svg>');return chart.join('');
  }
  // El plano IS-LM es una representación ESQUEMÁTICA, no un modelo calibrado.
  // Un único cálculo alimenta E1/E2, las proyecciones ie/Ye y el resumen de la política.
  function equilibrioISLMDibujo(z){
    const a=85,b=11,kI=.66,kL=.66;
    const isShift=13*(z?.is||0),lmShift=18*(z?.lm||0);
    const punto=(iS,lS)=>{const u=(a-b+iS+lS)/(kI+kL);return {u,v:a+iS-kI*u};};
    const e1=punto(0,0),e2=punto(isShift,lmShift);
    const deltaY=e2.u-e1.u,deltaI=e2.v-e1.v;
    return {e1,e2,isShift,lmShift,deltaY,deltaI};
  }
  function sentidoDibujo(v){return Math.abs(v)<1e-6?'sin variación':v>0?'aumenta':'disminuye';}
  function indicadorDibujo(v){return Math.abs(v)<1e-6?'↔':v>0?'↑':'↓';}
  function modelISLM(c,r){
    const z=r.islm||{is:0,lm:0,bp:0};
    const w=900,h=565,x0=140,y0=455,sx=5.25,sy=3.9;
    const x=v=>x0+sx*v,y=v=>y0-sy*v;
    const out=[`<svg class="economic-svg combined-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Curvas IS–LM–BP iniciales y finales"><defs><marker id="v5-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0L9 4.5L0 9Z" fill="#263f50"/></marker></defs>`];
    const l=(a,b,c,d,stroke,width=3,dash='')=>`<line x1="${a.toFixed(1)}" y1="${b.toFixed(1)}" x2="${c.toFixed(1)}" y2="${d.toFixed(1)}" stroke="${stroke}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
    const label=(a,b,t,color,anch='start',size=20)=>`<text x="${a.toFixed(1)}" y="${b.toFixed(1)}" fill="${color}" font-size="${size}" font-weight="700" text-anchor="${anch}">${esc(t)}</text>`;
    for(let a=20;a<100;a+=20)out.push(l(x(a),y(0),x(a),y(100),'#e8edf2',1),l(x(0),y(a),x(104),y(a),'#e8edf2',1));
    out.push(l(x(0),y(0),x(112),y(0),'#263f50',3),l(x(0),y(0),x(0),y(105),'#263f50',3));
    out.push(label(x(48),548,'Y · Producción nacional','#24384b','middle',21),label(x(0),34,'i · Tasa de interés','#24384b','start',20));
    // The final equilibrium E2 follows IS and LM intersection; BP is drawn independently.
    const isB=85, lmB=11, kI=.66,kL=.66,kB=.82;
    const {e1,e2,isShift:iShift,lmShift:lShift}=equilibrioISLMDibujo(z);
    const bpShift=14*(z.bp||0),bpB=e1.v-kB*e1.u;
    // Geometría económica intacta; las etiquetas se posicionan fuera de las curvas
    // con líderes claros, evitando que BP1/BP2/LM1 se encimen.
    const curveLabels=[];
    const curve=(tag,kind,shift,color,labelOffset)=>{
      const a=15,b=100;let f;
      if(kind==='IS')f=t=>isB+shift-kI*t;
      else if(kind==='LM')f=t=>lmB-shift+kL*t;
      else f=t=>bpB-shift+kB*t;
      out.push(l(x(a),y(f(a)),x(b),y(f(b)),color,kind==='BP'?3.4:3.6,kind==='BP'?'9 5':''));
      const anchor=100;
      curveLabels.push({tag,color,kind,anchorX:x(anchor),anchorY:y(f(anchor)),desiredY:y(f(anchor))+labelOffset});
    };
    curve('IS1','IS',0,'#283f50',10);
    curve('LM1','LM',0,'#956b4c',-7);
    curve('BP1','BP',0,'#188a78',-6);
    if(z.is)curve('IS2','IS',iShift,'#1679be',-4);
    if(z.lm)curve('LM2','LM',lShift,'#d23f88',-13);
    if(z.bp)curve('BP2','BP',bpShift,'#784fbe',12);
    // Una sola columna de rótulos y separación mínima de 27 px.
    const ranked=curveLabels.slice().sort((a,b)=>a.desiredY-b.desiredY);
    let last=40;
    for(const lab of ranked){lab.outY=Math.max(42,Math.min(498,lab.desiredY),last+28);last=lab.outY;}
    const overflow=Math.max(0,last-492);
    if(overflow)for(const lab of ranked)lab.outY-=overflow;
    for(const lab of ranked){
      const tx=746,ty=lab.outY;
      out.push(l(lab.anchorX+2,lab.anchorY,tx-9,ty-6,lab.color,1.55,'4 4'));
      out.push(`<rect x="${tx-3}" y="${ty-19}" width="65" height="24" rx="5" fill="#fff" opacity=".97"/>`);
      out.push(label(tx,ty,lab.tag,lab.color,'start',18));
    }
    const dot=(t,name,col,n)=>{const cx=x(t.u),cy=y(t.v);out.push(l(cx,cy,cx,y(0),col,1.3,'5 5'),l(x(0),cy,cx,cy,col,1.3,'5 5'));out.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="15" fill="white" stroke="${col}" stroke-width="3"/>`);out.push(label(cx,cy+6,name,col,'middle',16));out.push(label(cx,y(0)+22+n*22,'Ye'+(n+1),col,'middle',15),label(x(0)-18,cy+4,'ie'+(n+1),col,'end',15));};
    dot(e1,'E1','#283f50',0);
    if(Math.hypot(e2.u-e1.u,e2.v-e1.v)>1){dot(e2,'E2','#cf398a',1);}
    out.push('</svg>');return out.join('');
  }
  function islmExplanation(c,r){
    const z=r.islm||{is:0,lm:0,bp:0,isDrivers:[]};
    const mv=v=>v>0?'aumenta':v<0?'disminuye':'se mantiene';
    const to=v=>v>0?'la derecha':v<0?'la izquierda':'la posición original';
    const active=(z.isDrivers||[]).filter(d=>c.showSecond||r.changes.goods.some(e=>e.stage===d.stage&&e.round!=='segundo'));
    const iOnly=r.changes.goods.some(e=>e.kind==='i-investment');
    const p1=z.is?`IS se desplaza hacia ${to(z.is)} desde IS1 a IS2. La causa concreta es: ${active.map(d=>'secuencia '+d.stage+': '+d.cause).join(' Además, ')}. ${iOnly?'La inversión modificada únicamente por i NO es causa del desplazamiento.':''}`:
      `IS1 mantiene su posición. ${iOnly?'Aunque I cambia por la tasa de interés, ese movimiento no desplaza IS.':'No se identifica un componente autónomo que la desplace.'}`;
    const p2=z.lm?`La oferta de dinero Ms ${mv(z.lm)} por actuación del BCCR; por ello LM pasa de LM1 a LM2 hacia ${to(z.lm)}.`:'El BCCR no ha modificado Ms. Por tanto, la curva LM1 permanece fija; variaciones de Md modifican la tasa de interés, no constituyen por sí solas un desplazamiento de LM.';
    const p3=z.bp?`BP se desplaza hacia ${to(z.bp)} de BP1 a BP2. ${z.bpReason}`:`BP1 mantiene su posición. ${z.bpReason||'No hay cambio autónomo identificado en el ingreso o salida de divisas.'}`;
    const d=equilibrioISLMDibujo(z),[generalY,generalI]=qualitativePolicyEffect(z);
    const p4=z.is||z.lm?`En la geometría esquemática dibujada, la intersección IS–LM pasa de E1 a E2: Ye2 ${sentidoDibujo(d.deltaY)} frente a Ye1 e ie2 ${sentidoDibujo(d.deltaI)} frente a ie1. Los signos del gráfico resultan de distancias convencionales, no de datos calibrados. Como conclusión cualitativa sin magnitudes observadas: ${generalY}; ${generalI}. La curva BP refleja por separado la condición externa; no se presupone su intersección con E2.`:
      'La intersección IS–LM continúa en E1 (Ye e ie se mantienen en el dibujo). Los cambios de equilibrio parcial de los cuatro mercados se estudian por separado; no deben confundirse movimientos sobre las curvas con desplazamientos de IS o LM.';
    return [p1,p2,p3,p4];
  }
  // Formulario articulado con los ejemplos originales de las presentaciones EC-500.
  // OA=DA solo en el equilibrio; f(...) representa una relación cualitativa,
  // NO una ecuación estimada con coeficientes del BCCR.
  function formulaFocus(c,r){
    const active=r.sequence.filter(e=>(c.showSecond||e.round!=='segundo')&&(formulaStageSelection==='all'||String(e.stage)===formulaStageSelection));
    const focus=new Map();
    function add(key,e){if(!key)return;const old=focus.get(key)||[];old.push(e);focus.set(key,old)}
    for(const e of active){
      if(e.market==='goods'){
        ['DA','Y','OA'].forEach(k=>add(k,e));
        if(e.kind==='i-investment'){['i','I'].forEach(k=>add(k,e));}
        else if(e.kind==='fx-net'){['TC','X','M','XM'].forEach(k=>add(k,e));}
        else if(e.kind==='net'){['C','I','X','M','XM','W','Yd','i','TC'].forEach(k=>add(k,e));}
        else if(e.parents?.some(p=>p.startsWith('labor:'))){['W','Yd','C'].forEach(k=>add(k,e));}
        else if(e.parents?.some(p=>p.startsWith('fx:'))){['TC','X','M','XM'].forEach(k=>add(k,e));}
        else if(e.parents?.some(p=>p.startsWith('money:'))){['i','I'].forEach(k=>add(k,e));}
        else {
          const q=String(r.shock.variable||r.shock.channel||'').toLowerCase(),id=r.shock.id;
          if(/\bg\b|gasto|compras|infraestructura|salarios públicos|pensione/.test(q)||['gasto_publico','infra','compras','salarios_publicos','pensiones'].includes(id))add('G',e);
          if(/consumo|\bc\b|impuestos|transferencias|salario|pmgc|riqueza/.test(q)||['impuestos','transferencias','consumo_aut','pmc','salario_exo'].includes(id))['C','Yd'].forEach(k=>add(k,e));
          if(id==='impuestos')add('T',e);
          if(id==='transferencias')add('TR',e);
          if(id==='consumo_aut')add('Co',e);
          if(id==='pmc')add('PmgC',e);
          if(/inversi|\bi\b|credito|crédito|ied|tramitolog/.test(q)||['inversion_aut','credito','tramitologia'].includes(id))add('I',e);
          if(['exportaciones','ingreso_socios'].includes(id)||/^x$/.test(q))add('X',e);
          if(id==='importaciones'||/^m$/.test(q))add('M',e);
          if(id==='tipo_cambio_exo') ['TC','X','M','XM'].forEach(k=>add(k,e));
        }
      }
      if(e.market==='labor'){['W','L',e.curve==='ol'?'OL':'DL'].forEach(k=>add(k,e));if(e.curve==='dl')add('Y',e)}
      if(e.market==='money'){[e.curve==='ms'?'Ms':'Md','i'].forEach(k=>add(k,e));if(e.curve==='md')add('Y',e)}
      if(e.market==='fx'){[e.curve==='os'?'O$':'D$','TC'].forEach(k=>add(k,e));if(e.curve==='ds'&&e.kind==='induced'){['Y','M'].forEach(k=>add(k,e));}if(e.curve==='os'&&e.kind==='i-capital') ['i','i*'].forEach(k=>add(k,e));if(e.curve==='os'&&r.shock.id==='ied')add('IED',e);}
    }
    return focus;
  }
  function formulas(c,r){
    const validStages=[...new Set(r.sequence.filter(e=>c.showSecond||e.round!=='segundo').map(e=>e.stage))];
    if(formulaStageSelection!=='all'&&!validStages.includes(Number(formulaStageSelection)))formulaStageSelection='all';
    const focus=formulaFocus(c,r);
    const tag=(key,label)=>{const ev=focus.get(key)||[],all=ev.map(e=>e.stage),unique=[...new Set(all)].sort((a,b)=>a-b),labelStr=unique.join(', ');
      const cls=!ev.length?'':ev.every(e=>e.round==='segundo')?' formula-hit second':' formula-hit first';
      const title=ev.length?` title="Afectado en la secuencia ${esc(labelStr)}"`:'';
      return `<strong class="formula-term${cls}"${title}>${esc(label)}</strong>`;};
    const row=(title,eq,body,sub='')=>`<div class="formula-row"><div class="formula-row-title">${title}</div><div class="formula-equation">${eq}</div>${body?`<p>${body}</p>`:''}${sub}</div>`;
    const sub=(title,content)=>`<details class="formula-nested" open><summary>${title}</summary><div class="formula-nested-content">${content}</div></details>`;
    const goods=`<section class="formula-block" data-formula-market="goods"><h4>Bienes y servicios <span>(Y)</span></h4>
      ${row('Identidad del producto / gasto',`${tag('Y','Y')} ≡ ${tag('C','C')} + ${tag('I','I')} + ${tag('G','G')} + ${tag('X','X')} − ${tag('M','M')}`,'El símbolo ≡ expresa una identidad contable de producción medida por el gasto.')}
      ${row('Demanda agregada',`${tag('DA','DA')} = ${tag('C','C')} + ${tag('I','I')} + ${tag('G','G')} + ${tag('X','X')} − ${tag('M','M')}`,'C: familias · I: empresas · G: Gobierno · X: exportaciones · M: importaciones.')}
      ${row('Oferta y condición de equilibrio',`${tag('OA','OA')}(${tag('Y','Y')}) = ${tag('DA','DA')}(${tag('Y','Y')}) <small>solo en el equilibrio</small>`,'OA es el valor de la producción ofrecida y Y representa la producción o ingreso nacional. A diferencia de la identidad del PIB, OA = DA es una condición de equilibrio: fuera de él existen excedentes, inventarios y ajustes.')}
      ${row('C · Consumo de las familias',`${tag('C','C')} = ${tag('Co','C₀')} + ${tag('PmgC','PmgC')} × ${tag('Yd','Yd')}`,'C₀: consumo autónomo; PmgC: propensión marginal a consumir; Yd: ingreso disponible.',
        sub('Descomposición de ingreso disponible (Yd)',`${tag('Yd','Yd')} = f(${tag('W','W')}, ${tag('T','impuestos')}, ${tag('TR','transferencias')}, ${tag('R','riqueza familiar')})<p>W: salarios del mercado laboral; impuestos: reducen el ingreso disponible ceteris paribus; transferencias: lo incrementan; riqueza: otro determinante indicado en las diapositivas. En las láminas Ronney lo presenta como función cualitativa, sin coeficientes numéricos ni una igualdad contable adicional para Yd. En un enfoque general, el ingreso disponible se entiende como ingreso después de impuestos netos de transferencias, pero esta formulación no sustituye la relación usada en clase.</p>`))}
      ${row('I · Inversión de las empresas',`${tag('I','I')} = f(${tag('i','i')}, acceso al crédito, tramitología, restricciones, acceso a IED)`,'i: tasa de interés nacional. En el ejercicio, i ↑ suele reducir I; i ↓ suele aumentar I. El acceso al crédito y las barreras de inversión también influyen. La IED solo afecta I nacional si se declara ese supuesto. El rótulo Pmi aparece en algunas láminas sin desarrollo algebraico adicional.')}
      ${row('G · Gasto del Gobierno (política fiscal)',`${tag('G','G')} : compras de bienes y servicios + obras de infraestructura + servicios públicos`,'En el lenguaje docente, G corresponde al gasto gubernamental. Sus presentaciones también enumeran salarios públicos, pensiones, transferencias e intereses. Para el cálculo contable del PIB se separan las compras finales del Gobierno de las transferencias y de los pagos de intereses, que no son nuevas compras finales.',sub('Desglose según las láminas del profesor',`Compras públicas · infraestructura · salarios de servicios públicos · pensiones · transferencias · intereses de deuda. <p>Las transferencias a los hogares afectan principalmente <b>Yd → C</b>; si se contabilizan directamente en G y también en C, se corre el riesgo de duplicar su efecto dentro del gasto agregado.</p>`))}
      ${row('Impuestos · instrumento de política fiscal',`${tag('T','T')} → ${tag('Yd','Yd')} → ${tag('C','C')}`,'Los impuestos son ingresos del Gobierno; una mayor recaudación por T no constituye automáticamente un aumento de G. En los ejercicios, T↑ reduce Yd y C ceteris paribus.')}
      ${row('X · Exportaciones',`${tag('X','X')} = f(${tag('TC','TC')}, ${tag('Y*','Y*')}, ${tag('P','P')}, ${tag('P*','P*')})`,'TC: tipo de cambio (colones/USD); Y*: ingreso de socios comerciales; P: precios nacionales; P*: precios internacionales. TC↓ tiende a reducir X, según el ejercicio docente.')}
      ${row('M · Importaciones',`${tag('M','M')} = f(${tag('TC','TC')}, ${tag('Y','Y')}, ${tag('P','P')}, ${tag('P*','P*')})`,'Y: producción o ingreso nacional. TC↓ abarata bienes externos y tiende a incrementar M; Y↑ puede aumentar M. Las importaciones elevan la demanda de dólares (D$).')}
      ${row('Exportaciones netas',`${tag('XM','X − M')} = ${tag('X','X')} − ${tag('M','M')}`,'Cuando M aumenta manteniéndose X constante, X−M disminuye y ejerce presión a la baja sobre DA.')}
    </section>`;
    const labor=`<section class="formula-block" data-formula-market="labor"><h4>Mercado laboral <span>(W, L)</span></h4>
      ${row('Condición de equilibrio',`${tag('OL','OL')} = ${tag('DL','DL')}`,'La igualdad ocurre en el salario y empleo de equilibrio; fuera de él existe exceso de oferta o demanda de trabajo.')}
      ${row('Oferta laboral',`${tag('OL','OL')} = f(migración, educación, capacitación, desastres naturales, PEA)`,'Desplazan OL la inmigración laboral, disponibilidad de trabajadores capacitados, desastres y participación de la fuerza laboral (PEA).')}
      ${row('Demanda laboral',`${tag('DL','DL')} = f(${tag('Y','Y')}, tecnología, tipo de trabajo)`,'La producción nacional Y es un determinante de la demanda de trabajo; la tecnología puede aumentar o disminuir DL según si complementa o sustituye mano de obra.')}
      ${row('Variables de resultado',`${tag('W','W')}: salario &nbsp; · &nbsp; ${tag('L','L')}: empleo`,'El salario W afecta el ingreso disponible de las familias (Yd) y, en una secuencia posterior, el consumo C.')}
    </section>`;
    const money=`<section class="formula-block" data-formula-market="money"><h4>Mercado monetario <span>(i)</span></h4>
      ${row('Condición de equilibrio',`${tag('Ms','Ms')} = ${tag('Md','Md')}`,'La igualdad corresponde a la tasa de interés de equilibrio (i). Un cambio en Md no implica automáticamente un cambio de Ms ni un desplazamiento LM.')}
      ${row('Oferta monetaria del BCCR',`${tag('Ms','Ms')} = f(EML, OMA, BEMs, redescuento / TPM, emisión monetaria)`,'Instrumentos: encaje mínimo legal (EML), operaciones de mercado abierto (OMA), compra/venta de BEMs, tasa de política monetaria (TPM) y emisión. En el ejemplo del curso, EML↓, compra de BEMs por el BCCR o mayor emisión elevan Ms.')}
      ${row('Demanda de dinero',`${tag('Md','Md')} = f(${tag('Y','Y')}, deuda interna, transacciones, precaución, especulación)`,'Y↑ eleva Md para transacciones; deuda interna es otro determinante destacado. La tasa i afecta la cantidad demandada y la preferencia especulativa: no se debe tratar cada variación de i como desplazamiento de Md.')}
      ${row('Resultado del mercado',`${tag('i','i')} = tasa de interés nacional`,'A Ms constante, Md↑ presiona i al alza; con Md constante, Ms↑ presiona i a la baja. Se distinguen movimientos de curvas y movimientos a lo largo de curvas.')}
    </section>`;
    const fx=`<section class="formula-block" data-formula-market="fx"><h4>Mercado cambiario <span>(TC)</span></h4>
      ${row('Equilibrio de divisas',`${tag('O$','O$')} = ${tag('D$','D$')}`,'El tipo de cambio TC expresa colones por dólar estadounidense. O$↑ con D$ fija suele bajar TC; D$↑ con O$ fija suele elevar TC.')}
      ${row('Oferta de dólares · entrada de divisas',`${tag('O$','O$')} = f(${tag('X','X')}, turismo hacia Costa Rica, ${tag('IED','IED')}, préstamos externos, deuda externa, ${tag('i','i')} − ${tag('i*','i*')})`,'Exportaciones, turismo receptor, inversión extranjera directa, préstamos desde el exterior y diferencial entre tasas nacional e internacional (i−i*) generan ingresos de dólares según los supuestos del curso.')}
      ${row('Demanda de dólares · salida de divisas',`${tag('D$','D$')} = f(${tag('M','M')}, turismo fuera del país, inversión de residentes en el exterior, préstamos al exterior)`,'Las importaciones y los pagos hacia el extranjero generan demanda de dólares. Y↑ puede elevar M y por ese canal D$.')}
      ${row('Tipo de cambio y exportaciones netas',`${tag('TC','TC')} → ${tag('X','X')}, ${tag('M','M')} → ${tag('XM','X − M')} → ${tag('DA','DA')}`,'TC↓ suele favorecer M y perjudicar X; TC↑ suele favorecer X y desincentivar M, manteniendo constantes otros factores.')}
    </section>`;
    const islm=`<section class="formula-block formula-combined" data-formula-market="is"><h4>Modelo IS–LM–BP <span>(i, Y)</span></h4>
      ${row('Condición del mercado de bienes · IS',`${tag('Y','Y')} = ${tag('C','C')}(${tag('Yd','Yd')}) + ${tag('I','I')}(${tag('i','i')}) + ${tag('G','G')} + ${tag('X','X')}(${tag('TC','TC')}, ${tag('Y*','Y*')}, ${tag('P','P')}, ${tag('P*','P*')}) − ${tag('M','M')}(${tag('TC','TC')}, ${tag('Y','Y')}, ${tag('P','P')}, ${tag('P*','P*')})`,'Forma funcional compuesta a partir de las relaciones de las láminas; no es una ecuación empírica estimada. En la convención del profesor, los cambios autónomos de DA desplazan IS. Un movimiento de i por sí solo no desplaza IS.')}
      ${row('Condición del mercado monetario · LM',`${tag('Ms','Ms')} = ${tag('Md','Md')}(${tag('Y','Y')}, ${tag('i','i')}, deuda interna)`,'LM cambia de posición cuando el BCCR modifica Ms; los cambios de demanda de dinero y de tasa de interés por sí solos no equivalen a desplazar LM.')}
      ${row('Balanza de pagos · BP',`SBP = XN(${tag('Y','Y')}, ${tag('Y*','Y*')}, ${tag('P','P')}, ${tag('P*','P*')}, ${tag('TC','TC')}) + FC(${tag('i','i')} − ${tag('i*','i*')})`,'Estructura presentada en las diapositivas cambiarias: exportaciones netas (XN) y flujos de capital (FC). El equilibrio externo se expresa como SBP = 0. Los ingresos autónomos de divisas desplazan BP a la izquierda y las salidas a la derecha según el convenio gráfico del profesor.')}
    </section>`;
    const stages=[...new Set(r.sequence.filter(e=>c.showSecond||e.round!=='segundo').map(e=>e.stage))].sort((a,b)=>a-b);
    const selector=`<label class="formula-step-label" for="formula-stage-input">Resaltar componentes por secuencia <select id="formula-stage-input"><option value="all"${formulaStageSelection==='all'?' selected':''}>Todas las secuencias</option>${stages.map(n=>`<option value="${n}"${formulaStageSelection===String(n)?' selected':''}>Secuencia ${n}</option>`).join('')}</select></label>`;
    return `<details class="formula-library"${formulaLibraryOpened?' open':''}><summary>Formulario económico completo · ecuaciones, componentes y variables afectadas</summary><div class="formula-intro">Fórmulas del curso EC-500 organizadas por mercado. <b>Las variables en azul o rosado son las que intervienen en la secuencia seleccionada:</b> azul = primer orden, rosado = segundo orden. Las expresiones con <b>f(…)</b> indican dependencia cualitativa; no se inventan parámetros. Y es la producción o el ingreso nacional; no es la tasa de interés. La identidad del gasto y la condición OA = DA no son la misma ecuación.</div><div class="formula-controls">${selector}<span class="formula-pill"><i class="dot first"></i> Primer orden</span><span class="formula-pill"><i class="dot second"></i> Segundo orden</span></div><div class="formula-grid">${goods}${labor}${money}${fx}${islm}</div><p class="formula-legend">Abre el detalle de ingreso disponible (Yd) para ver salarios, impuestos, transferencias y riqueza; las ecuaciones de las demás funciones incluyen también sus determinantes. Se preservan las convenciones de la asignatura y se indica la distinción contable cuando corresponde.</p></details>`;
  }
  // Relación económica específica del párrafo, sin introducir conexiones simultáneas 3→3.
  function formulaEffectReference(c,r,m,e){
    const sp=s=>`<strong class="formula-affect">${s}</strong>`;
    let phrase='';
    if(m==='goods'){
      if(e.kind==='i-investment')phrase=`${sp('i')} → ${sp('I')} = f(i, acceso al crédito, restricciones) → DA = C + ${sp('I')} + G + X − M`;
      else if(e.kind==='fx-net')phrase=`${sp('TC')} → ${sp('X')} = f(TC, Y*, P, P*) y ${sp('M')} = f(TC, Y, P, P*) → ${sp('X − M')} → DA`;
      else if(e.kind==='net')phrase=`C = C₀ + PmgC × ${sp('Yd')}; I = f(${sp('i')}, …); X/M = f(${sp('TC')}, …) → ${sp('DA')}. El resultado sigue el predominio seleccionado.`;
      else if(r.shock.id==='impuestos'&&e.stage===1)phrase=`${sp('Impuestos')} → ${sp('Yd')} = f(W, impuestos, transferencias, riqueza) → ${sp('C')} = C₀ + PmgC × Yd → DA`;
      else if(e.stage===1&&r.shock.market==='goods'){
        const variable=r.shock.variable||'';
        phrase=`Variable inicial: ${sp(esc(variable||r.shock.label))} → DA = C + I + G + X − M`;
      }else if(e.parents?.some(x=>x.startsWith('labor:')))phrase=`${sp('W')} → ${sp('Yd')} = f(W, impuestos, transferencias, riqueza) → ${sp('C')} = C₀ + PmgC × Yd → DA`;
      else phrase=`DA = C + I + G + X − M. Variable modificada: ${sp('DA')}`;
    }else if(m==='labor')phrase=e.curve==='ol'?`${sp('OL')} = f(migración, educación, capacitación, desastres, PEA) → ${sp('W')}, ${sp('L')}`:`${sp('Y')} → ${sp('DL')} = f(Y, tecnología) → ${sp('W')}, ${sp('L')}`;
    else if(m==='money')phrase=e.curve==='ms'?`${sp('Ms')} = f(EML, OMA, BEMs, TPM, emisión monetaria) → ${sp('i')}`:`${sp('Y')} → ${sp('Md')} = f(Y, deuda interna, transacciones, precaución, especulación) → ${sp('i')}`;
    else if(m==='fx')phrase=e.curve==='os'?`${sp('O$')} = f(X, turismo receptor, IED, crédito externo, i−i*) → ${sp('TC')}`:`${sp('D$')} = f(M, turismo emisor, inversión exterior, préstamos) → ${sp('TC')}`;
    if(!phrase)return '';
    return `<details class="formula-in-narrative"><summary>Consultar fundamento económico · secuencia ${e.stage}</summary><div class="formula-inline-body">${phrase}</div><small>La relación explica el mecanismo de este efecto; no agrega un paso a la secuencia ni desplaza curvas por sí sola.</small></details>`;
  }
  // Diagnóstico del plano IS–LM–BP. Separa condición inicial de política aplicada.
  // Las coordenadas son ilustrativas, sin calibración macroeconómica del país.
  const policySamples=[
    {id:'exceso-liquidez',number:'1',Y:42,i:77,policy:'expansion_monetaria',dir:1,title:'Bajar la tasa de interés',measure:'Política monetaria expansiva',body:'El BCCR incrementa Ms. La presión inicial es i ↓; luego se estudian I, O$, TC, C y X−M con sus secuencias.'},
    {id:'impulso-productivo',number:'2',Y:42,i:54,policy:'gasto_publico',dir:1,title:'Aumentar la producción',measure:'Política fiscal expansiva',body:'El Gobierno incrementa sus compras o inversión pública G. La DA aumenta y el análisis continúa por los demás mercados.'},
    {id:'presion-tasa',number:'3',Y:72,i:18,policy:'contraccion_monetaria',dir:1,title:'Elevar la tasa de interés',measure:'Política monetaria restrictiva',body:'El BCCR reduce Ms. La presión inicial es i ↑. Es necesario analizar el efecto sobre inversión, producción y divisas.'},
    {id:'reduccion-productiva',number:'4',Y:72,i:48,policy:'gasto_publico',dir:-1,title:'Reducir la producción',measure:'Política fiscal restrictiva',body:'Se ensaya una reducción de G para desplazar DA e IS a la izquierda. La reducción de G disminuye DA e IS; examiná también el mercado monetario y el sector externo antes de decidir.'}
  ];
  const policySlopes={is:y=>85-.66*y,lm:y=>11+.66*y,bp:y=>-10.8+1.05*y};
  function policyDiagnostic(p){
    const IS=policySlopes.is(p.Y),LM=policySlopes.lm(p.Y),BP=policySlopes.bp(p.Y);
    const goods=p.i<IS?'Exceso de demanda agregada (DA > OA)':'Exceso de oferta agregada (OA > DA)';
    const money=p.i<LM?'Exceso de demanda de dinero (Md > Ms)':'Exceso de oferta de dinero (Ms > Md)';
    const dollars=p.i<BP?'Exceso de demanda de dólares (D$ > O$)':'Exceso de oferta de dólares (O$ > D$)';
    const sample=policySamples.find(s=>Math.hypot(s.Y-p.Y,s.i-p.i)<.2);
    const zone=(p.i<IS?'da':'oa')+'-'+(p.i<LM?'md':'ms');
    return {goods,money,dollars,sample,zone};
  }
  function qualitativePolicyEffect(z){
    const is=z?.is||0,lm=z?.lm||0;
    if(is>0&&!lm)return ['Y ↑','i ↑','IS se desplaza a la derecha; LM conserva su lugar'];
    if(is<0&&!lm)return ['Y ↓','i ↓','IS se desplaza a la izquierda; LM conserva su lugar'];
    if(lm>0&&!is)return ['Y ↑','i ↓','LM se desplaza a la derecha; IS conserva su lugar'];
    if(lm<0&&!is)return ['Y ↓','i ↑','LM se desplaza a la izquierda; IS conserva su lugar'];
    if(!is&&!lm)return ['Y sin cambio por IS–LM','i sin cambio por IS–LM','IS y LM conservan sus posiciones'];
    if(is>0&&lm>0)return ['Y ↑','i indeterminada','IS y LM se desplazan a la derecha. Ambas impulsan Y, pero presionan i en sentidos opuestos'];
    if(is<0&&lm<0)return ['Y ↓','i indeterminada','IS y LM se desplazan a la izquierda. Ambas reducen Y, pero presionan i en sentidos opuestos'];
    if(is>0&&lm<0)return ['Y indeterminada','i ↑','IS a la derecha y LM a la izquierda elevan i, pero tienen efectos opuestos en Y'];
    if(is<0&&lm>0)return ['Y indeterminada','i ↓','IS a la izquierda y LM a la derecha reducen i, pero tienen efectos opuestos en Y'];
    return ['Y dependiente de magnitudes','i dependiente de magnitudes','Las curvas cambian de manera simultánea y requieren hipótesis de magnitud para concluir el saldo neto'];
  }
  function policyTransition(c,r){
    if(!c.showPolicyMap||!c.diagnosticPreset)return '';
    const d=policySamples.find(x=>x.id===c.diagnosticPreset);
    if(!d)return '';
    const z=r.islm||{},dir=v=>v>0?'derecha':v<0?'izquierda':'posición inicial';
    const [yGeneral,iGeneral,note]=qualitativePolicyEffect(z);
    const dib=equilibrioISLMDibujo(z);
    const y=`Y ${indicadorDibujo(dib.deltaY)} · ${sentidoDibujo(dib.deltaY)} en E2`;
    const i=`i ${indicadorDibujo(dib.deltaI)} · ${sentidoDibujo(dib.deltaI)} en E2`;
    const primerImpacto=d.policy==='gasto_publico'
      ?`Impacto inicial de la política: G ${d.dir>0?'↑':'↓'} → DA ${d.dir>0?'↑':'↓'} → Y ${d.dir>0?'↑':'↓'}.`
      :`Impacto inicial de la política: Ms ${d.policy==='expansion_monetaria'?'↑':'↓'} → i ${d.policy==='expansion_monetaria'?'↓':'↑'}.`;
    return `<section class="policy-outcome" aria-label="Conciliación del diagnóstico con el modelo del escenario"><div class="policy-outcome-kicker">DEL DIAGNÓSTICO AL ESCENARIO SIMULADO</div><h4>${esc(d.measure)}</h4><p>Se modifica <b>${esc(MS.CATALOG.find(x=>x.id===c.shockId)?.label||c.shockId)}</b> en dirección ${c.direction>0?'↑':'↓'}. <b>${esc(primerImpacto)}</b> La intersección E1 → E2 de IS–LM representa el resultado del dibujo del ejercicio; el punto inicial del diagnóstico es una ubicación ilustrativa independiente, no un dato observado.</p><div class="policy-outcome-grid"><div><span>Producción en el gráfico</span><b>${esc(y)}</b></div><div><span>Tasa de interés en el gráfico</span><b>${esc(i)}</b></div><div><span>Desplazamiento de curvas</span><b>IS ${esc(dir(z.is))} · LM ${esc(dir(z.lm))} · BP ${esc(dir(z.bp))}</b></div></div><p><b>Inferencia cualitativa sin magnitudes:</b> ${esc(yGeneral)}; ${esc(iGeneral)}. ${esc(note)}. Las distancias del gráfico son parámetros convencionales para ilustrar el mecanismo, no elasticidades estimadas. Los cambios laborales y cambiarios deben comprobarse en sus propias gráficas; BP no garantiza equilibrio externo automático.</p><small>El diagnóstico orienta una intervención posible, pero no garantiza eliminar simultáneamente los tres excesos iniciales.</small></section>`;
  }
  function policyMap(c,r){
    const p=diagnosticPoint,d=policyDiagnostic(p);
    const ox=98,oy=365,sx=5.7,sy=3.25;
    const X=v=>ox+sx*v,Y=v=>oy-sy*v;
    const line=(x1,y1,x2,y2,color)=>`<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
    const pins=policySamples.map(s=>`<g class="policy-pin ${d.sample?.id===s.id?'active':''}" data-act="diag-sample" data-id="${s.id}" tabindex="0" role="button" aria-label="Seleccionar escenario ilustrativo ${s.number}: ${esc(s.measure)}"><circle cx="${X(s.Y)}" cy="${Y(s.i)}" r="13"/><text x="${X(s.Y)}" y="${Y(s.i)+4}" text-anchor="middle">${s.number}</text></g>`).join('');
    const [currentY,currentI]=qualitativePolicyEffect(r.islm);
    const advice=d.sample?`<b>Dirección buscada:</b> ${esc(d.sample.title)}. <b>Instrumento:</b> ${esc(d.sample.measure)}.`:'Para este punto libre no hay una política única predeterminada: analizá las tres condiciones antes de escoger una intervención fiscal o monetaria.';
    const scenarios=policySamples.map(s=>`<button type="button" class="policy-preset ${d.sample?.id===s.id?'active':''}" data-act="diag-sample" data-id="${s.id}"><b>${s.number}</b><span>${esc(s.title)}<small>${esc(s.measure)}</small></span></button>`).join('');
    return `<section class="policy-panel"><div class="policy-heading"><div class="market-eyebrow">SITUACIÓN INICIAL · ANÁLISIS OPCIONAL</div><h3>Diagnóstico y selección de una política económica</h3><p>Primero identificá <b>la dirección necesaria en producción (Y) o tasa de interés (i)</b>. Después seleccioná un instrumento fiscal o monetario, analizá los cuatro mercados y conciliá IS, LM y BP. Las cuatro situaciones son puntos ilustrativos que permiten practicar intervenciones; no constituyen un conjunto exhaustivo ni soluciones únicas.</p></div>
      <div class="policy-overview"><div><b>1 · Ubicación</b><span>Identificar los excesos frente a IS, LM y BP.</span></div><div><b>2 · Objetivo</b><span>Definir si Y o i debe aumentar o disminuir.</span></div><div><b>3 · Intervención</b><span>Elegir G o Ms y recorrer los efectos.</span></div><div><b>4 · Evaluación</b><span>Verificar nuevos desplazamientos y equilibrios.</span></div></div>
      <div class="policy-layout"><div class="policy-graph"><svg class="policy-svg" viewBox="0 0 760 420" role="img" aria-label="Plano IS LM BP ilustrativo: seleccioná una de las cuatro situaciones o tocá cualquier punto" data-diag-plot="1"><line x1="${X(0)}" y1="${Y(0)}" x2="${X(105)}" y2="${Y(0)}" stroke="#30485b" stroke-width="2.5"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(105)}" stroke="#30485b" stroke-width="2.5"/>${line(10,policySlopes.is(10),100,policySlopes.is(100),'#1879b9')}${line(10,policySlopes.lm(10),100,policySlopes.lm(100),'#c93e85')}${line(10,policySlopes.bp(10),100,policySlopes.bp(100),'#0b8d76')}<text x="${X(100)}" y="${Y(policySlopes.is(100))-10}" class="policy-curve" fill="#1879b9">IS</text><text x="${X(102)}" y="${Y(policySlopes.lm(102))-10}" class="policy-curve" fill="#c93e85">LM</text><text x="${X(89)}" y="${Y(policySlopes.bp(89))-12}" class="policy-curve" fill="#0b8d76">BP</text><text x="${X(108)}" y="${Y(0)+20}" fill="#415e73" text-anchor="end" font-size="15">Y · Producción</text><text x="${X(0)}" y="${Y(107)}" font-size="15" fill="#415e73">i · Tasa de interés</text><circle cx="${X(56)}" cy="${Y(48)}" r="4" fill="#233b50"/><text x="${X(56)+12}" y="${Y(48)-9}" fill="#233b50" font-size="15">E</text>${pins}<circle cx="${X(p.Y)}" cy="${Y(p.i)}" r="18" fill="none" stroke="#efaa23" stroke-width="2.8" stroke-dasharray="5 3" pointer-events="none"/></svg><p class="policy-chart-note">IS y LM delimitan cuatro combinaciones básicas de desequilibrio en bienes y dinero; BP subdivide la interpretación del sector externo. <b>No son los cuatro únicos estados posibles de la economía.</b> Las posiciones no corresponden a datos observados.</p></div>
      <div class="policy-reading"><div class="policy-preset-grid">${scenarios}</div><div class="policy-diagnostics"><h4>Situación seleccionada</h4><dl><dt>Bienes y servicios</dt><dd>${esc(d.goods)}</dd><dt>Mercado monetario</dt><dd>${esc(d.money)}</dd><dt>Mercado cambiario</dt><dd>${esc(d.dollars)}</dd></dl></div><div class="policy-recommendation"><strong>${d.sample?esc(d.sample.measure):'Intervención por determinar'}</strong><p>${advice}</p>${d.sample?`<p>${esc(d.sample.body)}</p>`:''}</div>${d.sample?`<button type="button" class="button primary policy-apply" data-act="diag-apply" data-id="${d.sample.id}">Simular ${esc(d.sample.measure)}</button>`:''}<small class="policy-note">Una medida cambia los desplazamientos de IS, LM o BP según la variable afectada. La nueva intersección IS–LM debe compararse con el estado inicial, sin prometer equilibrio externo automático. Si aplicás un escenario, la conciliación aparece en el modelo final.</small></div></div></section>`;
  }
  function routeGraph(c,r){
    const all=r.sequence.filter(e=>c.showSecond||e.round!=='segundo');
    const nodes=new Set(all.map(e=>e.id));
    const edges=(r.edges||[]).filter(e=>nodes.has(e.from)&&nodes.has(e.to)&&Number(e.from.split(':')[1])<Number(e.to.split(':')[1]));
    const markets=['goods','labor','money','fx'],row={goods:87,labor:187,money:287,fx:387};
    const max=Math.max(3,...all.map(e=>e.stage)),width=1220,height=490,left=262;
    const dx=(width-left-88)/Math.max(1,max-1),x=n=>left+(n-1)*dx;
    const idTo=new Map(all.map(e=>[e.id,e]));
    const curve=e=>SERIES[e.curve]||e.curve;
    const nodeCenter=e=>({x:x(e.stage),y:row[e.market]});
    let svg=`<svg class="causal-svg" viewBox="0 0 ${width} ${height}" aria-label="Diagrama causal trazable de mercados y secuencias"><defs><marker id="c-arrow-blue" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#1879b9"/></marker><marker id="c-arrow-rose" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#cc3889"/></marker></defs>`;
    for(let n=1;n<=max;n++){svg+=`<line x1="${x(n)}" y1="57" x2="${x(n)}" y2="424" stroke="#e5eef4" stroke-width="1" stroke-dasharray="5 8"/><text x="${x(n)}" y="28" text-anchor="middle" class="causal-col-label">SECUENCIA ${n}</text>`;}
    for(const m of markets){svg+=`<text x="12" y="${row[m]+5}" class="causal-row-label">${esc(TITLES[m])}</text>`;}
    // Fan-in routes are explicit: in the IED case three different 3's converge on one 4.
    for(const e of edges){const a=nodeCenter(idTo.get(e.from)),b=nodeCenter(idTo.get(e.to));
      const ax=a.x+44,bx=b.x-45,offset=Math.abs(a.y-b.y)>5?10:0;
      const c1=ax+Math.max(18,(bx-ax)*.46),c2=bx-Math.max(18,(bx-ax)*.46);
      const endEvent=idTo.get(e.to),isSecond=endEvent.round==='segundo';
      const lineColor=isSecond?'#cc3889':'#1879b9', arrowId=isSecond?'c-arrow-rose':'c-arrow-blue';
      svg+=`<path class="causal-edge ${isSecond?'second':'first'}" data-from="${e.from}" data-to="${e.to}" d="M ${ax} ${a.y} C ${c1} ${a.y-offset}, ${c2} ${b.y+offset}, ${bx} ${b.y}" fill="none" stroke="${lineColor}" stroke-width="2.0" marker-end="url(#${arrowId})"/>`;
    }
    for(const e of all){const a=nodeCenter(e),color=e.round==='segundo'?'#fce8f2':'#e4f3fb',stroke=e.round==='segundo'?'#cc3889':'#1879b9';
      svg+=`<g class="causal-node" data-node-id="${e.id}" tabindex="0" role="button" aria-label="Secuencia ${e.stage}, ${esc(TITLES[e.market])}: ${esc(e.why)}"><rect x="${a.x-57}" y="${a.y-25}" width="114" height="50" rx="22" fill="${color}" stroke="${stroke}" stroke-width="2.2"/><text x="${a.x}" y="${a.y+5}" text-anchor="middle" fill="${e.round==='segundo'?'#a82c6b':'#126a9e'}" font-weight="850" font-size="17">${e.stage} · ${esc(curve(e))}${sign(e.sign)}</text><title>${esc(e.why)}</title></g>`;
    }
    svg+='</svg>';
    const tags=`<div class="causal-legend"><span><i class="legend-first"></i> Primer orden</span><span><i class="legend-second"></i> Segundo orden</span><span>Seleccioná un nodo para revisar su causa y sus conexiones</span></div>`;
    return `<section class="causal-panel"><div class="causal-title"><div><div class="market-eyebrow">MAPA DE CAUSALIDAD</div><h3>Diagrama de mercados y secuencias</h3><p>La misma ruta alimenta el gráfico, la redacción y las flechas. Cada número se traza hasta sus causas.</p></div><span class="causal-cases-label">${r.routeMode==='dual'?'DOS INICIOS':'RUTA SELECCIONADA'}</span></div><div class="causal-map">${svg}</div>${tags}<p class="causal-detail" aria-live="polite">Seleccioná cualquier nodo del diagrama para ver su antecedente económico.</p></section>`;
  }
  function graphCard(m,c,r){const macroEq={goods:'Demanda agregada: DA = C + I + G + X − M · Equilibrio: OA = DA',labor:'OL = f(migración, educación, PEA) · DL = f(Y, tecnología)',money:'Ms = f(instrumentos del BCCR) · Md = f(Y, transacciones, deuda interna)',fx:'O$ = f(ingreso de divisas) · D$ = f(salida de divisas)'};return `<article class="market-card" data-market="${m}"><div class="market-head"><div><div class="market-eyebrow">MERCADO</div><h3>${TITLES[m]} <small>(${CODES[m]})</small></h3></div><div class="market-numbers">${stepDots(c,r,m)}</div></div><p class="market-formula">${esc(macroEq[m])}</p><div class="chart-zone">${diagram(m,c,r)}</div>${explanations(c,r,m)}</article>`}
  function isCard(c,r){
    const z=r.islm||{is:0,lm:0};
    const ps=islmExplanation(c,r);
    return `<article class="market-card combined-card" data-market="is"><div class="market-head"><div><div class="market-eyebrow">EQUILIBRIO SIMULTÁNEO</div><h3>Modelo IS–LM–BP <small>(i, Y)</small></h3></div><div class="market-numbers"><span class="stage-none">${z.is?'IS1 → IS2':'IS1 fija'} · ${z.lm?'LM1 → LM2':'LM1 fija'} · ${z.bp?'BP1 → BP2':'BP1 fija'}</span></div></div><div class="chart-zone">${modelISLM(c,r)}</div>${c.showExplanation?`<div class="narrative"><div class="narrative-header"><strong>INTERPRETACIÓN DEL MODELO IS–LM–BP</strong><span class="origin-tag">4 párrafos</span></div><div class="paragraphs">${ps.map((v,i)=>`<div class="paragraph"><span class="para-n">${i+1}</span><p>${markVars(c.overrides?.['is:0:'+i]??v,r)}</p></div>`).join('')}</div></div>`:''}${policyTransition(c,r)}</article>`;
  }
  function caseSheet(c,expose){let r=analyze(c);const stages=r.sequence||[];
    return `<section class="paper ${expose?'paper-present':''}"><div class="paper-header"><div><div class="paper-overline">ANÁLISIS DEL ESCENARIO</div><h2>${esc(c.title)}</h2><p>Variable explicativa: <strong>${esc(shock(c).label)}</strong> · ${c.shockId==='tecnologia_sust'?'desplaza trabajadores → DL ↓':QDIR(c.direction)+' '+sign(c.direction)} · Origen: ${esc(MS.MARKETS[shock(c).market])}</p></div><div class="result-pills">${pill('Y '+sign(r.dominant.output),'blue')}${pill('Empleo '+sign(r.dominant.employment),'teal')}${pill('Salarios '+sign(r.dominant.wage),'pink')}${pill('i '+sign(r.dominant.interest),'amber')}</div></div>
      ${(c.showSecond&&r.balance?.applicable)?`<div class="balance-declaration"><strong>Alternativa seleccionada · segundo orden ${r.balance.stage}:</strong> ${c.shockId==='ied'&&c.routeMode==='dual'?`El modelo supone que predomina ${c.dualChoice==='investment'?'la caída de inversión nacional':'el canal de tipo de cambio'}`:`Predomina ${r.balance.choice==='investment'?'la inversión (I)':r.balance.choice==='exchange'?'el efecto cambiario (X − M)':'el consumo (C)'}`}; DA ${sign(r.balance.net)}.</div>`:''}
      ${formulas(c,r)}
      ${c.showPolicyMap?policyMap(c,r):''}
      ${routeGraph(c,r)}
      <div class="sequence-band"><div class="sequence-title">RUTA CAUSAL · RESUMEN TEXTUAL</div><div class="sequence-steps">${stages.filter(e=>c.showSecond||e.round!=='segundo').map(e=>`<span class="sequence-event ${e.round==='segundo'?'second':''}"><b>${e.stage}</b> ${esc(TITLES[e.market])}: ${esc(SERIES[e.curve])}${sign(e.sign)}</span>`).join('')}</div></div>
      <div class="chart-grid">${CHARTS.map(m=>graphCard(m,c,r)).join('')}${c.showIS?isCard(c,r):''}</div>
      
      </section>`;}
  function exposure(all=false){const p=pres(),list=all?p.cases:[p.cases[Math.max(0,Math.min(slideIndex,p.cases.length-1))]];return `<div class="expo"><div class="expo-toolbar"><div class="identity"><div class="logomark">M<span>Σ</span></div><div><strong>${esc(p.title)}</strong><small>Vista de exposición · ${all?'todos los casos':'caso '+(slideIndex+1)+' de '+p.cases.length}</small></div></div><div class="expo-buttons">${btn('Volver al editor','editor','outline')}${btn('Ver todos','expo-all','outline')}${btn('← Anterior','expo-prev','outline',slideIndex===0||all?'disabled':'')}${btn('Siguiente →','expo-next','outline',slideIndex>=p.cases.length-1||all?'disabled':'')}${btn('Imprimir / PDF','print','primary')}</div></div><div class="expo-pages">${list.map(c=>caseSheet(c,true)).join('')}</div></div>`}
  function bankView(){return `<div class="dialog-back"><div class="dialog large"><div class="dialog-head"><div><div class="eyebrow">BANCO DE CASOS</div><h2>Preguntas documentadas del profesor</h2><p>Seleccioná una pregunta para añadirla a la presentación activa. Los casos se añaden a la presentación actual.</p></div>${btn('✕','close-bank','icon')}</div><div class="bank-list">${BANK.map((b,i)=>`<div class="bank-row"><div class="bank-number">${String(i+1).padStart(2,'0')}</div><div><strong>${esc(b[0])}</strong><small>${esc(b[3])}</small></div>${btn('Añadir caso','insert-bank','outline small',`data-index="${i}"`)}</div>`).join('')}</div></div></div>`}
  function customShockDialog(){const pairs={goods:[['da','Demanda agregada (DA)']],labor:[['ol','Oferta laboral (OL)'],['dl','Demanda laboral (DL)']],money:[['ms','Oferta monetaria (Ms)'],['md','Demanda monetaria (Md)']],fx:[['os','Oferta de dólares (O$)'],['ds','Demanda de dólares (D$)']]};return `<div class="dialog-back"><div class="dialog"><div class="dialog-head"><div><div class="eyebrow">EDITOR DEL MOTOR</div><h2>Agregar variable explicativa</h2><p>Definí el efecto inicial de la variable para generar un nuevo caso.</p></div>${btn('✕','close-help','icon')}</div><form id="custom-shock-form" class="custom-form"><label>Nombre de la variable<input name="label" required placeholder="Ej. Cambios en ingreso extranjero"/></label><label>Mercado directamente afectado<select name="market" id="custom-market">${Object.entries(MS.MARKETS).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join('')}</select></label><label>Curva afectada<select name="curve" id="custom-curve">${pairs.goods.map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label>Si aumenta la variable, la curva<select name="effect"><option value="1">Se desplaza a la derecha / aumenta</option><option value="-1">Se desplaza a la izquierda / disminuye</option></select></label><label>Canal o ecuación<input name="channel" required placeholder="Ej. Impuestos → ingreso disponible → consumo"/></label><label>Descripción / supuesto<textarea name="description" rows="3" placeholder="Restricciones, ceteris paribus, contexto"></textarea></label><div class="dialog-footer">${btn('Cancelar','close-help','outline')}<button class="button primary" type="submit">Guardar y utilizar</button></div></form></div></div>`}
  function paragraphEditor(){let c=selected(),r=analyze(c);return `<div class="dialog-back"><div class="dialog editor-dialog"><div class="dialog-head"><div><div class="eyebrow">PERSONALIZAR REDACCIÓN</div><h2>Explicaciones del caso</h2><p>Se muestra el texto completo original cuando está disponible. Los cambios se conservan exclusivamente en este caso.</p></div>${btn('✕','close-help','icon')}</div><div class="text-editor-scroll">${CHARTS.map(m=>{let arr=paragraphsFor(c,r,m);return `<div class="edit-block"><h3>${esc(TITLES[m])}</h3>${arr.map((x,i)=>`<h4>${x.event.round==='segundo'?'Segundo':'Primer'} orden — secuencia ${x.event.stage}</h4>${x.paragraphs.map((v,j)=>`<label class="edit-label">Párrafo ${j+1}<textarea data-edit="${m}:${r.changes[m].indexOf(x.event)}:${j}">${esc(v)}</textarea></label>`).join('')}`).join('')}</div>`}).join('')}<div class="edit-block"><h3>Modelo IS–LM–BP</h3><label class="edit-label">Interpretación<textarea data-edit="is:0:0">${esc(c.overrides?.['is:0:0']??refSection(c,'is')?.[0]??r.explanations.is)}</textarea></label></div></div><div class="dialog-footer">${btn('Cerrar','close-help','primary')}</div></div></div>`}
  function screen(){const libraryBefore=root.querySelector('.formula-library');if(libraryBefore)formulaLibraryOpened=libraryBefore.open;root.innerHTML=mode==='present'?exposure(false):mode==='expo-all'?exposure(true):editor();if(help==='bank')root.insertAdjacentHTML('beforeend',bankView());else if(help==='paragraphs')root.insertAdjacentHTML('beforeend',paragraphEditor());else if(help==='custom')root.insertAdjacentHTML('beforeend',customShockDialog());}
  function update(fn){fn();save();screen()}
  function exportFile(name,content,mime){let b=new Blob([content],{type:mime}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500)}
  const filename=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]+/gi,'_').slice(0,55)||'Macro_Studio';
  function exportHtml(){const copy=document.documentElement.cloneNode(true);const snap=copy.querySelector('#macro-snapshot');if(snap)snap.textContent=JSON.stringify(state).replace(/</g,'\\u003c');exportFile(filename(pres().title)+'.html','<!DOCTYPE html>\n'+copy.outerHTML,'text/html;charset=utf-8');toast('HTML autónomo con casos guardados')}
  function exportJSON(){exportFile(filename(pres().title)+'.json',JSON.stringify(state,null,2),'application/json;charset=utf-8');toast('Respaldo JSON descargado')}
  function importJSON(){let input=document.createElement('input');input.type='file';input.accept='.json';input.onchange=()=>{let file=input.files?.[0];if(!file)return;file.text().then(t=>{let data=JSON.parse(t);if(!Array.isArray(data.presentations)||!data.presentations.length)throw Error('No hay presentaciones');data.customShocks??=[];state=data;state.activePres=data.presentations[0].id;state.activeCase=data.presentations[0].cases[0].id;update(()=>{mode='editor'});toast('Biblioteca restaurada')}).catch(e=>toast('No se pudo importar: '+e.message))};input.click()}
  function handle(action,button){let p=pres(),c=selected(),idx=p.cases.indexOf(c);
    if(action==='close-bank'||action==='close-help'){help=false;screen();return}
    if(action==='bank'){help='bank';screen();return}
    if(action==='diag-sample'){const p=policySamples.find(z=>z.id===button.dataset.id);if(p){diagnosticPoint={Y:p.Y,i:p.i};screen();}return}
    if(action==='diag-apply'){const target=policySamples.find(z=>z.id===button.dataset.id);if(!target)return;update(()=>{c.shockId=target.policy;c.direction=target.dir;c.diagnosticPreset=target.id;c.title=target.measure+' · '+target.title;c.overrides={};c.showPolicyMap=true;c.showIS=true;c.showSecond=true;});toast('Escenario aplicado: revisá los cuatro mercados y la conciliación IS–LM–BP.');return}
    if(action==='edit-paragraphs'){help='paragraphs';screen();return}
    if(action==='custom-shock'){help='custom';screen();return}
    if(action==='insert-bank'){let q=BANK[Number(button.dataset.index)];update(()=>{let x=mkcase(q[0],q[1],q[2]);p.cases.push(x);state.activeCase=x.id;mode='editor';help=false});return}
    if(action==='new-case'){update(()=>{let x=mkcase();p.cases.push(x);state.activeCase=x.id});return}
    if(action==='new-pres'){let name=prompt('Nombre de la nueva colección:','Nueva colección');if(!name)return;update(()=>{let next=mkpres(name.trim());state.presentations.push(next);state.activePres=next.id;state.activeCase=next.cases[0].id});return}
    if(action==='pick-pres'){update(()=>{state.activePres=button.dataset.id;state.activeCase=pres().cases[0].id});return}
    if(action==='rename-pres'){
      const target=state.presentations.find(x=>x.id===button.dataset.id);if(!target)return;
      let value=prompt('Nuevo nombre de la colección:',target.title);if(value===null||!value.trim())return;
      update(()=>target.title=value.trim().slice(0,120));return;
    }
    if(action==='delete-pres'){
      const target=state.presentations.find(x=>x.id===button.dataset.id);if(!target)return;
      if(state.presentations.length===1){toast('Para dejar el espacio vacío, utilizá Limpiar espacio.');return;}
      if(!confirm('¿Eliminar la colección «'+target.title+'» y sus '+target.cases.length+' casos? Esta acción no se puede deshacer.'))return;
      update(()=>{state.presentations=state.presentations.filter(x=>x.id!==target.id);state.activePres=state.presentations[0].id;state.activeCase=state.presentations[0].cases[0].id});return;
    }
    if(action==='duplicate-pres'){
      const target=state.presentations.find(x=>x.id===button.dataset.id);if(!target)return;
      update(()=>{const copy=clone(target);copy.id=uid();copy.title+=' — copia';for(const c of copy.cases)c.id=uid();state.presentations.push(copy);state.activePres=copy.id;state.activeCase=copy.cases[0].id});return;
    }
    if(action==='rename-case'){
      const target=p.cases.find(x=>x.id===button.dataset.id);if(!target)return;
      let value=prompt('Nuevo título del caso:',target.title);if(value===null||!value.trim())return;
      update(()=>target.title=value.trim().slice(0,200));return;
    }
    if(action==='delete-case'){
      const target=p.cases.find(x=>x.id===button.dataset.id);if(!target)return;
      if(!confirm('¿Eliminar el caso «'+target.title+'»?'))return;
      update(()=>{p.cases=p.cases.filter(x=>x.id!==target.id);if(!p.cases.length)p.cases.push(mkcase('Nuevo caso'));state.activeCase=p.cases[0].id});return;
    }
    if(action==='clear-workspace'){
      if(!confirm('¿Limpiar TODO el espacio de trabajo? Se eliminarán tus colecciones, casos y variables personalizadas de este navegador. Guardá JSON antes si querés conservarlos.'))return;
      update(()=>{const next=mkpres('Mis casos');state.presentations=[next];state.activePres=next.id;state.activeCase=next.cases[0].id;state.customShocks=[];mode='editor';help=false});
      toast('Espacio limpio. Podés crear nuevos casos o importar un respaldo JSON.');return;
    }
    if(action==='pick-case'){update(()=>state.activeCase=button.dataset.id);return}
    if(action==='duplicate'){update(()=>{let x=clone(c);x.id=uid();x.title+=' — copia';p.cases.splice(idx+1,0,x);state.activeCase=x.id});return}
    if(action==='delete'){if(confirm('¿Eliminar este caso?'))update(()=>{p.cases.splice(idx,1);if(!p.cases.length)p.cases.push(mkcase('Nuevo caso'));state.activeCase=p.cases[0].id});return}
    if(action==='present'){mode='present';slideIndex=Math.max(0,idx);help=false;screen();return}
    if(action==='expo-all'){mode='expo-all';screen();return}
    if(action==='expo-prev'){slideIndex=Math.max(0,slideIndex-1);screen();return}
    if(action==='expo-next'){slideIndex=Math.min(p.cases.length-1,slideIndex+1);screen();return}
    if(action==='editor'){mode='editor';state.activeCase=p.cases[slideIndex]?.id||state.activeCase;screen();return}
    if(action==='print'){window.print();return}
    if(action==='export-html'){exportHtml();return}
    if(action==='export-json'){exportJSON();return}
    if(action==='import-json'){importJSON();return}
  }
  document.addEventListener('click',e=>{
    const plot=e.target.closest('.policy-svg');
    if(plot && !e.target.closest('[data-act]')){const rect=plot.getBoundingClientRect(),mx=(e.clientX-rect.left)*760/rect.width,my=(e.clientY-rect.top)*420/rect.height;diagnosticPoint={Y:Math.max(5,Math.min(98,(mx-98)/5.7)),i:Math.max(5,Math.min(98,(365-my)/3.25))};screen();return;}
    const n=e.target.closest('.causal-node');
    if(n){
      const panel=n.closest('.causal-panel'),id=n.dataset.nodeId;
      const links=[...panel.querySelectorAll('.causal-edge')];
      const adjacent=links.filter(a=>a.dataset.from===id||a.dataset.to===id);
      const related=new Set([id,...adjacent.map(a=>a.dataset.from),...adjacent.map(a=>a.dataset.to)]);
      panel.querySelectorAll('.causal-node').forEach(a=>a.classList.toggle('is-related',related.has(a.dataset.nodeId)));
      panel.querySelectorAll('.causal-edge').forEach(a=>a.classList.toggle('is-related',adjacent.includes(a)));
      const c=selected(),r=analyze(c),ev=r.sequence.find(x=>x.id===id);
      if(ev){const names={goods:'Bienes y servicios',labor:'Mercado laboral',money:'Mercado monetario',fx:'Mercado cambiario'};const origin=ev.parents?.map(s=>{const [m,n]=s.split(':');return `${names[m]||m}, secuencia ${n}`}).join('; ');panel.querySelector('.causal-detail').textContent=`Secuencia ${ev.stage} · ${TITLES[ev.market]} · ${ev.round} orden. ${ev.why} Antecedentes: ${origin||'variable explicativa inicial'}.`}
      return;
    }
    const b=e.target.closest('[data-act]');if(b){e.preventDefault();handle(b.dataset.act,b)}});
  document.addEventListener('input',e=>{const id=e.target.id,c=selected();if(id==='title-input'){c.title=e.target.value;save();let h1=document.querySelector('.case-heading h1');if(h1)h1.textContent=c.title;let h2=document.querySelector('.paper-header h2');if(h2)h2.textContent=c.title}
    if(e.target.dataset.edit){c.overrides[e.target.dataset.edit]=e.target.value;save();}
  });
  document.addEventListener('change',e=>{if(e.target.classList.contains('zone-select')){const states={'ro-rm':'Exceso de Oferta Agregada (OA mayor que DA) y exceso de Demanda de Dinero (Md mayor que Ms).','ro-lm':'Exceso de Oferta Agregada (OA mayor que DA) y exceso de Oferta de Dinero (Ms mayor que Md).','lo-rm':'Exceso de Demanda Agregada (DA mayor que OA) y exceso de Demanda de Dinero (Md mayor que Ms).','lo-lm':'Exceso de Demanda Agregada (DA mayor que OA) y exceso de Oferta de Dinero (Ms mayor que Md).'};e.target.closest('.region-explorer').querySelector('.zone-reading').textContent=states[e.target.value];return;}if(e.target.id==='custom-market'){let opts={goods:[['da','Demanda agregada (DA)']],labor:[['ol','Oferta laboral (OL)'],['dl','Demanda laboral (DL)']],money:[['ms','Oferta monetaria (Ms)'],['md','Demanda monetaria (Md)']],fx:[['os','Oferta de dólares (O$)'],['ds','Demanda de dólares (D$)']]};document.querySelector('#custom-curve').innerHTML=opts[e.target.value].map(([a,b])=>`<option value="${a}">${b}</option>`).join('');return}let c=selected(),id=e.target.id;if(id==='formula-stage-input'){formulaStageSelection=e.target.value;screen();return;}if(id==='shock-input')update(()=>{delete c.diagnosticPreset;c.shockId=e.target.value;if(c.shockId==='tecnologia_sust')c.direction=1;c.title=titleForCase(c);c.overrides={};if(shock(c).market==='fx')c.showFX=true;});
    else if(id==='route-input')update(()=>{c.routeMode=e.target.value;c.overrides={}});
    else if(id==='dual-input')update(()=>{c.dualChoice=e.target.value;c.overrides={}});
    else if(id==='trade-input')update(()=>{c.tradeChoice=e.target.value;c.overrides={}});
    else if(id==='direction-input')update(()=>{delete c.diagnosticPreset;c.direction=c.shockId==='tecnologia_sust'?1:Number(e.target.value);c.title=titleForCase(c);c.overrides={}});
    else if(id==='second-input')update(()=>c.showSecond=e.target.checked);
    else if(id==='is-input')update(()=>c.showIS=e.target.checked);
    else if(id==='policy-input')update(()=>c.showPolicyMap=e.target.checked);
    else if(id==='fx-input')update(()=>c.showFX=true);
    else if(id==='explain-input')update(()=>c.showExplanation=e.target.checked);
    else if(e.target.name==='balanceChoice')update(()=>{c.balanceChoice=e.target.value;c.overrides={};});

  });
  document.addEventListener('submit',e=>{if(e.target.id!=='custom-shock-form')return;e.preventDefault();let d=Object.fromEntries(new FormData(e.target));let newShock={id:uid(),label:d.label,market:d.market,curve:d.curve,effect:Number(d.effect),channel:d.channel,variable:d.label,description:d.description};update(()=>{state.customShocks.push(newShock);selected().shockId=newShock.id;selected().title='¿Qué sucede si '+d.label.toLowerCase()+' aumenta?';selected().direction=1;selected().overrides={};if(newShock.market==='fx')selected().showFX=true;help=false});toast('Variable registrada en esta biblioteca');});
  document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('.causal-node')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));return}if(e.key==='Escape'&&help){help=false;screen()}if((mode==='present')&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){if(e.key==='ArrowRight'){slideIndex=Math.min(slideIndex+1,pres().cases.length-1);screen()}if(e.key==='ArrowLeft'){slideIndex=Math.max(0,slideIndex-1);screen()}}});
  window.MacroStudio={getState:()=>clone(state),analyze:c=>analyze(c||selected()),getReference:c=>REFERENCE_CASES[exactKey(c||selected())]||null,bank:()=>clone(BANK),debug:{evolution,point},addCase:(title,shockId,direction)=>{let p=pres(),c=mkcase(title,shockId,direction);update(()=>{p.cases.push(c);state.activeCase=c.id});return c.id},reset:()=>{state=seed();state.activeCase=state.presentations[0].cases[0].id;save();screen();}};
  screen();
})();
