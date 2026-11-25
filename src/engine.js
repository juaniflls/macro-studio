/* Macro Studio · engine 0.1 · pure deterministic rules, no external libraries.
 * Signs are qualitative, not empirical elasticities. All functions can be tested without the UI.
 */
'use strict';
const MS = (()=>{
 const MARKETS={goods:'Bienes y servicios (Y)',labor:'Mercado laboral (W, L)',money:'Mercado monetario (i)',fx:'Mercado cambiario (TC)'};
 const CURVES={goods:['da'],labor:['ol','dl'],money:['ms','md'],fx:['os','ds']};
 const CATALOG=[
 // Goods market: effect is change in planned aggregate expenditure.
 ['infra','Inversión pública en infraestructura','goods','da',1,'G: infraestructura','G','Gasto público destinado a infraestructura.'],
 ['compras','Compras del sector público','goods','da',1,'G: compras','G','Adquisiciones públicas de bienes y servicios.'],
 ['salarios_publicos','Gasto del gobierno en salarios','goods','da',1,'G: salarios públicos','G','Componente directo del gasto gubernamental.'],
 ['pensiones','Gasto público en pensiones','goods','da',1,'G: pensiones/transferencias','G','Simplificación del curso: aumento del gasto/ingreso disponible.'],
 ['transferencias','Transferencias a hogares','goods','da',1,'Yd → C','C','Transferencias que modifican ingreso disponible y consumo.'],
 ['impuestos','Impuestos a los hogares','goods','da',-1,'T → Yd → C','C','Más impuestos reducen ingreso disponible, ceteris paribus.'],
 ['consumo_aut','Consumo autónomo','goods','da',1,'C₀','C','Cambio del consumo autónomo.'],
 ['pmc','Propensión marginal a consumir','goods','da',1,'PmgC → C','C','Mayor propensión marginal a consumir, para ingreso disponible positivo.'],
 ['inversion_aut','Inversión privada autónoma','goods','da',1,'I autónoma','I','Cambio de inversión no atribuido a la tasa de interés.'],
 ['credito','Acceso de empresas al crédito','goods','da',1,'Crédito → I','I','Facilidad de crédito que aumenta inversión.'],
 ['tramitologia','Obstáculos administrativos a inversión','goods','da',-1,'Trámites → I','I','Tramitología o barreras reducen inversión.'],
 ['tasas_nacionales','Tasa de interés nacional (cambio exógeno)','goods','da',-1,'i → I','I','Cambio de i tomado como shock externo al gráfico IS, como en los ejercicios.'],
 ['exportaciones','Exportaciones autónomas','goods','da',1,'X','X','Más exportaciones elevan demanda agregada (efecto cambiario paralelo no cuantificado).'],
 ['importaciones','Importaciones autónomas','goods','da',-1,'M','M','Más importaciones reducen exportaciones netas; también implican dólares.'],
 ['ingreso_socios','Ingreso de socios comerciales','goods','da',1,'Y* → X','X','Más ingreso externo tiende a elevar exportaciones.'],
 ['tipo_cambio_exo','Tipo de cambio (cambio exógeno)','goods','da',1,'TC → X−M','X−M','TC definido como colones por dólar: TC↑ implica depreciación y X−M↑ bajo el supuesto del curso.'],
 ['salario_exo','Salarios exógenos de hogares','goods','da',1,'W → Yd → C','C','Shock sobre salarios ya dado, sin postular una curva laboral inicial.'],
 // Labor supply and labor demand.
 ['migracion_entrada','Inmigración laboral','labor','ol',1,'Migración → OL','OL','Entrada de trabajadores eleva la oferta laboral.'],
 ['migracion_salida','Emigración laboral','labor','ol',-1,'Migración → OL','OL','Salida de trabajadores reduce la oferta laboral.'],
 ['pea','Participación en la fuerza laboral','labor','ol',1,'PEA → OL','OL','Más participación incrementa oferta de trabajo.'],
 ['educacion','Disponibilidad de trabajadores capacitados','labor','ol',1,'Educación → OL','OL','Aumento de oferta de trabajo capacitado.'],
 ['desastre_laboral','Desastre que afecta disponibilidad laboral','labor','ol',-1,'Desastre → OL','OL','Reducción de la oferta de trabajo.'],
 ['tecnologia_sust','Tecnología que desplaza mano de obra a nivel nacional','labor','dl',-1,'Tecnología sustitutiva → DL','DL','El enunciado docente ya describe sustitución laboral; no se interpreta como tecnología complementaria.'],
 ['tecnologia_comp','Tecnología complementaria de mano de obra','labor','dl',1,'Tecnología → DL','DL','Tecnología complementaria eleva la demanda de ciertas ocupaciones.'],
 ['demanda_trabajo','Demanda autónoma de trabajo','labor','dl',1,'DL autónoma','DL','Cambio exógeno de demanda laboral.'],
 // Money market.
 ['expansion_monetaria','Inyección de liquidez del BCCR','money','ms',1,'BCCR → Ms','Ms','Aumento de oferta monetaria.'],
 ['contraccion_monetaria','Retiro de liquidez del BCCR','money','ms',-1,'BCCR → Ms','Ms','Reducción de oferta monetaria.'],
 ['encaje','Encaje mínimo legal','money','ms',-1,'EML → Ms','Ms','Un encaje mayor reduce oferta de dinero.'],
 ['bems_compra','Compra de bonos por el banco central','money','ms',1,'OMA compra → Ms','Ms','Compra de BEMs expande liquidez.'],
 ['bems_venta','Venta de bonos por el banco central','money','ms',-1,'OMA venta → Ms','Ms','Venta de BEMs contrae liquidez.'],
 ['tpm','Tasa de política monetaria / redescuento','money','ms',-1,'TPM → Ms','Ms','Convención simplificada usada en la materia.'],
 ['dinero_precaucion','Demanda de dinero por precaución','money','md',1,'Precaución → Md','Md','Mayor preferencia de liquidez.'],
 ['deuda_interna','deuda interna del gobierno','money','md',1,'Deuda interna → Md','Md','Relación pedagógica presentada en macro I.'],
 // FX: exchange rate quoted in local units per USD.
 ['ied','Inversión extranjera directa entrante','fx','os',1,'IED → O$','O$','Entrada de divisas eleva su oferta.'],
 ['turismo_entrada','Turismo extranjero receptor','fx','os',1,'Turismo receptor → O$','O$','Turistas traen divisas.'],
 ['remesas','Ingresos de remesas del exterior','fx','os',1,'Remesas → O$','O$','Más divisas entrantes.'],
 ['prestamos_externos','Préstamos provenientes del exterior','fx','os',1,'Crédito exterior → O$','O$','Préstamos desde afuera aumentan oferta de dólares.'],
 ['tasas_externas','Tasa de interés internacional','fx','os',-1,'i* → O$','O$','Tasas externas menores pueden aumentar el atractivo de invertir localmente.'],
 ['flujos_portafolio','Atractivo de activos locales','fx','os',1,'Capitales → O$','O$','Afluencia financiera de dólares.'],
 ['viajes_salida','Turismo de residentes en el exterior','fx','ds',1,'Turismo emisor → D$','D$','Mayor gasto de residentes fuera incrementa demanda de dólares.'],
 ['capital_salida','Inversión de residentes en el exterior','fx','ds',1,'Salida de capital → D$','D$','Más inversiones externas aumentan demanda de divisas.'],
 ['prestamos_al_exterior','Préstamos nacionales hacia el exterior','fx','ds',1,'Crédito saliente → D$','D$','Egreso de dólares.']
 ].map(x=>({id:x[0],label:x[1],market:x[2],curve:x[3],effect:x[4],channel:x[5],variable:x[6],description:x[7]}));
 const DEFAULT_SHOCKS=CATALOG;
 const S=v=>v>0?1:v<0?-1:0;
 const arrow=v=>v>0?'↑':v<0?'↓':'↔';
 const direction=v=>v>0?'aumenta':v<0?'disminuye':'no cambia de manera determinada';
 const curveNames={da:'DA',ol:'OL',dl:'DL',ms:'Ms',md:'Md',os:'O$',ds:'D$'};
 function describe(sign,name){return `${name} ${arrow(sign)}`;}
 function opposingChoice(channels){return channels.some(c=>c.sign>0)&&channels.some(c=>c.sign<0);}
 function choiceOf(spec){return spec.balanceChoice==='investment'?'investment':'consumption';}
 function balanceDirection(channels,choice,fallback){return opposingChoice(channels)?S((choice==='investment'?channels[1]:channels[0]).sign):fallback;}
 function rule(markets,stage,market,curve,sign,why,round='primer orden'){
  if(!sign) return;
  const ev={stage,market,curve,sign,why,round};
  markets[market].push(ev);return ev;
 }
 function analyze(spec,extra=[]){
  const shock=[...DEFAULT_SHOCKS,...extra].find(s=>s.id===spec.shockId)||DEFAULT_SHOCKS[0];
  const dir=shock.id==='tecnologia_sust'?1:(spec.direction===-1?-1:1);const initial=S(shock.effect*dir);
  const dom=choiceOf(spec); // El docente permite escoger qué canal predomina al existir efectos contrapuestos.
  const changes={goods:[],labor:[],money:[],fx:[]};const steps=[];
  let y=0,w=0,ie=0,tc=0,emp=0,stageD=0,base=0;
  const stage=(n,title,text,market,round)=>steps.push({n,title,text,market,round});
  const insert=(n,m,curve,sign,why,round)=>rule(changes,n,m,curve,sign,why,round);
  const origin=shock.id==='tecnologia_sust'?'La tecnología desplaza mano de obra a nivel nacional':`${shock.label} ${arrow(dir)}`;
  stage(1,`Shock inicial · ${MARKETS[shock.market]}`,`${origin}. Canal explicativo: ${shock.channel}.`,shock.market,'primero');
  insert(1,shock.market,shock.curve,initial,`Variable exógena: ${origin}`,'primero');
  const inspect=[];
  let channels=[];let stageFeedback=0;let opposedAt=null;
  if(shock.market==='goods'){
    y=initial; w=y; emp=y; ie=y; tc=y;
    insert(2,'labor','dl',y,'Producción Y → demanda laboral DL','primero');
    insert(2,'money','md',y,'Producción Y → demanda de dinero para transacciones Md','primero');
    insert(2,'fx','ds',y,'Y modifica importaciones y demanda de dólares D$','primero');
    stage(2,'La producción modifica los mercados',`Y ${arrow(y)} → DL ${arrow(y)}, Md ${arrow(y)} y D$ ${arrow(y)} simultáneamente.`, 'goods','primero');
    channels=[{name:'Salarios → consumo',sign:y},{name:'Tasa de interés → inversión',sign:-ie}];
    stageD=balanceDirection(channels,dom,y); opposedAt=3;
    insert(3,'goods','da',stageD,`Retorno C/I: se desarrolla ${dom==='investment'?'inversión predominante':'consumo predominante'}`,'segundo');
    stage(3,'Retorno a bienes y servicios',`W ${arrow(w)} → C ${arrow(w)}; i ${arrow(ie)} → I ${arrow(-ie)}; predomina el efecto de ${dom==='investment'?'inversión (I)':'consumo (C)'}; DA ${arrow(stageD)}.`, 'goods','segundo');
    insert(4,'labor','dl',stageD,'Segundo cambio en producción → demanda laboral DL','segundo');
    insert(4,'money','md',stageD,'Segundo cambio en producción → demanda monetaria Md','segundo');
    stage(4,'Segunda reacción de laboral y monetario',`La nueva Y ${arrow(stageD)} vuelve a modificar DL y Md. Se detiene la propagación antes de tercer orden.`, 'labor','segundo');
    inspect.push(`Efectos contrapuestos en etapa 3: se escogió predominio de ${dom==='investment'?'inversión (I)':'consumo (C)'}. Este es un supuesto declarado, no una magnitud estimada.`);
  } else if(shock.market==='labor'){
    w=shock.curve==='ol'?-initial:initial;emp=initial;y=w;ie=y;tc=y;
    insert(2,'goods','da',y,'Salarios W → ingreso disponible Yd → consumo C → DA','primero');
    stage(2,'Salarios modifican consumo y producción',`W ${arrow(w)} → C ${arrow(w)} → DA y Y ${arrow(y)}.`, 'goods','primero');
    insert(3,'labor','dl',y,'Y modifica demanda laboral DL (segundo desplazamiento laboral)','segundo');
    insert(3,'money','md',y,'Y modifica Md por motivo transacciones','primero');
    insert(3,'fx','ds',y,'Y modifica demanda de dólares por importaciones','primero');
    stage(3,'Respuesta simultánea de mercados',`Y ${arrow(y)} → DL ${arrow(y)}, Md ${arrow(y)} y D$ ${arrow(y)}. DL es de segundo orden; Md es de primero.`, 'labor','mixto');
    channels=[{name:'Salarios → consumo',sign:w},{name:'Interés → inversión',sign:-ie}];
    stageD=balanceDirection(channels,dom,y); opposedAt=4;
    insert(4,'goods','da',stageD,`Retorno desde W e i: predomina ${dom==='investment'?'inversión':'consumo'}`,'segundo');
    stage(4,'Segundo desplazamiento de demanda agregada',`W ${arrow(w)} → C ${arrow(w)}; i ${arrow(ie)} → I ${arrow(-ie)}. Predomina ${dom==='investment'?'I':'C'}; Y ${arrow(stageD)}.`, 'goods','segundo');
    insert(5,'money','md',stageD,'Nueva variación Y → nuevo cambio en Md','segundo');
    stage(5,'Se completa el segundo orden monetario',`El cambio de Y derivado del efecto 4 produce Md ${arrow(stageD)} (efecto 5). No se siguen efectos de tercer orden.`, 'money','segundo');
    inspect.push(`En la etapa 4 se eligió ${dom==='investment'?'inversión':'consumo'} predominante al comparar C e I; la propagación posterior utiliza el signo elegido.`);
  } else if(shock.market==='money'){
    ie=shock.curve==='ms'?-initial:initial;y=-ie;tc=-ie;w=y;emp=y;
    insert(2,'goods','da',y,'Tasa de interés de equilibrio ie → inversión I → demanda agregada DA','primero');
    insert(2,'fx','os',ie,'Interés nacional altera oferta de dólares (opcional, no evaluado aún)','primero');
    stage(2,'Tasa de interés cambia inversión y producción',`i ${arrow(ie)} → I ${arrow(y)} → DA y Y ${arrow(y)}. El cambiario se conserva como complemento opcional.`, 'goods','primero');
    insert(3,'labor','dl',y,'Producción Y → demanda laboral DL','primero');
    insert(3,'money','md',y,'Producción Y → demanda monetaria transaccional Md; efecto menor que el shock inicial','segundo');
    insert(3,'fx','ds',y,'Producción Y → importaciones y demanda de dólares (opcional)','segundo');
    stage(3,'Dos efectos simultáneos de distinta orden',`Y ${arrow(y)} → DL ${arrow(y)} (primer orden) y Md ${arrow(y)} (segundo orden). Los salarios y la tasa de interés reaccionan simultáneamente.`, 'money','mixto');
    channels=[{name:'Salarios → consumo',sign:w},{name:'Tasa de interés de rebote → inversión',sign:-y}];
    stageD=balanceDirection(channels,dom,y); opposedAt=4;
    insert(4,'goods','da',stageD,`Salarios modifican C y rebote de interés modifica I; predomina ${dom==='investment'?'inversión':'consumo'}`,'segundo');
    stage(4,'Consumo e inversión afectan DA simultáneamente',`W ${arrow(w)} → C ${arrow(w)}; rebote de i ${arrow(y)} → I ${arrow(-y)}. Se elige predominio de ${dom==='investment'?'I':'C'} y Y ${arrow(stageD)}.`, 'goods','segundo');
    insert(5,'labor','dl',stageD,'Y resultante del paso 4 → DL y salarios','segundo');
    stage(5,'Se completa el segundo orden laboral',`Nuevo cambio de Y ${arrow(stageD)} → DL ${arrow(stageD)}. Se detiene antes de efectos de tercer orden.`, 'labor','segundo');
    inspect.push('Caso monetario contrastado con la clase del 20 de octubre: secuencia 1,2,3 y 3,4,5. El efecto monetario de etapa 3 es un rebote MENOR que el shock inicial.');
    inspect.push(`C e I producen signos opuestos: la alternativa elegida es ${dom==='investment'?'inversión':'consumo'} predominante; no se trata de un resultado estimado.`);
  } else if(shock.market==='fx'){
    tc=shock.curve==='os'?-initial:initial;y=tc;w=y;emp=y;ie=y;
    insert(2,'goods','da',tc,'TC altera X−M y la DA','primero');
    stage(2,'Cambio de exportaciones netas',`TC ${arrow(tc)} → X−M ${arrow(tc)} → Y ${arrow(y)}.`, 'goods','primero');
    insert(3,'labor','dl',y,'Y → DL','primero');
    insert(3,'money','md',y,'Y → Md','primero');
    insert(3,'fx','ds',y,'Y → importaciones → D$','segundo');
    stage(3,'Efectos simultáneos por Y',`Y ${arrow(y)} afecta DL, Md y D$.`, 'fx','mixto');
    stageD=y;
    insert(4,'goods','da',stageD,'Retroalimentación de salarios, interés y TC; supuesto cualitativo','segundo');
    stage(4,'Segundo desplazamiento de DA',`W ${arrow(w)}, i ${arrow(ie)} y TC ${arrow(tc)} regresan a DA.`, 'goods','segundo');
    inspect.push('Mercado cambiario conservado como complemento opcional. Su ruta de segundo orden aún no forma parte de la secuencia de tres mercados confirmada en esta clase.');
  }
  // In qualitative accounting, the sign of an induced variable only refers to its immediate equilibrium.
  if(channels.some(v=>v.sign>0) && channels.some(v=>v.sign<0)){
   inspect.unshift(`Elección docente explícita de efectos contrapuestos: se ha desarrollado ${dom==='investment'?'predominio de inversión':'predominio de consumo'}. Las magnitudes reales no se conocen.`);
  }
  // Aplicación uniforme para TODOS los casos: DA modifica IS; Ms modifica LM.
  // El efecto de segundo orden se representa con una amplitud menor al primero.
  const goodsEvents=changes.goods;
  const daNet=goodsEvents.reduce((acc,e)=>acc+(e.round==='segundo'?0.34:1)*e.sign,0);
  // Regla explícita de Ronney 1:56:17: IS por C/G/X/M/I autónoma;
  // la inversión inducida únicamente por i NO desplaza IS.
  // Registrar C vía salarios en cada etapa pertinente, inclusive si C e I
  // tienen signos contrapuestos. Una caída de DA por I(i) no es shock IS.
  const isDrivers=[];
  const eligible=(stage,sign,cause,weight)=>{if(sign && (spec.showSecond!==false || weight===1))isDrivers.push({stage,sign,cause,weight});};
  if(shock.market==='goods'){
    if(shock.id!=='tasas_nacionales')eligible(1,initial,shock.variable==='I'?'inversión autónoma':shock.variable||'demanda autónoma',1);
    eligible(3,w,'salarios → ingreso disponible → consumo',0.34);
  }else if(shock.market==='labor'){
    eligible(2,w,'primer cambio salarial → consumo',1);
    eligible(4,y,'segundo cambio salarial tras DL → consumo',0.34);
  }else if(shock.market==='money'){
    eligible(4,w,'salarios después del cambio laboral → consumo',0.34);
  }else if(shock.market==='fx'){
    eligible(2,tc,'tipo de cambio → exportaciones netas',1);
    eligible(4,w,'salarios → consumo',0.34);
  }
  const isSign=S(isDrivers.reduce((sum,d)=>sum+d.sign*d.weight,0));
  const laborStart=changes.labor[0]?.sign||0;
  const dominant={employment:emp,wage:w,interest:ie,exchange:tc,output:y,inflation:y>0?'presión alcista':y<0?'sin presión inflacionaria adicional':'indeterminada'};
  const hasOpposing=opposingChoice(channels)&&shock.market!=='fx';
  const balance={applicable:hasOpposing,choice:dom,stage:hasOpposing?opposedAt:null,channels,net:hasOpposing?stageD:0,
    note:hasOpposing?`En la etapa ${opposedAt}, C ${arrow(channels[0].sign)} e I ${arrow(channels[1].sign)} tienen signos contrarios. Se eligió predominio de ${dom==='investment'?'inversión (I)':'consumo (C)'}, por lo que DA ${arrow(stageD)}. Los demás efectos se recalculan a partir de este resultado.`:'No hay una elección docente C/I pertinente en esta ruta.'};
  // Numbered case explanatory paragraphs use author's course style but never invent empirical numbers.
  const explanations=generateExplanations({shock,dir,changes,y,w,ie,tc,emp,stageD,dom,channels,steps,isSign});
  const audit=[{n:1,rule:'Shock exógeno',source:shock.channel,detail:`${shock.label} ${arrow(dir)} → ${curveNames[shock.curve]} ${arrow(initial)}`},
    ...changes.goods.map(c=>({n:c.stage,rule:'Bienes/servicios',source:'Y = C + I + G + X − M',detail:`DA ${arrow(c.sign)} · ${c.why}`})),
    ...changes.labor.map(c=>({n:c.stage,rule:'Laboral',source:'DL = f(Y, tecnología); OL = f(migración, educación…)',detail:`${curveNames[c.curve]} ${arrow(c.sign)} · ${c.why}`})),
    ...changes.money.map(c=>({n:c.stage,rule:'Monetario',source:'Ms = f(BCCR); Md = f(Y, precaución…)',detail:`${curveNames[c.curve]} ${arrow(c.sign)} · ${c.why}`})),
    ...changes.fx.map(c=>({n:c.stage,rule:'Cambiario',source:'O$ = f(IED, i−i*…); D$ = f(M, turismo…)',detail:`${curveNames[c.curve]} ${arrow(c.sign)} · ${c.why}`})),
    {n:'IS',rule:'IS por demanda agregada',source:'DA = C + I + G + X − M',detail:`${isSign>0?'IS a la derecha':isSign<0?'IS a la izquierda':'IS sin desplazamiento'}; el equilibrio conjunto IS–LM se determina en el diagrama combinado, cuando el shock está identificado.`}
  ].sort((a,b)=>Number(a.n)-Number(b.n));
  // Regla operativa documentada de la clase: únicamente los cambios de Ms
  // desplazan LM en estos ejercicios. Los cambios inducidos de Md por Y
  // son movimientos sobre LM. No atribuir un cambio de Ms al shock de deuda.
  // La diapositiva 26 también comenta saldos reales Ms/P; no hay un shock P
  // parametrizado en el catálogo actual.
  const mdInitial=shock.market==='money'&&shock.curve==='md';
  const interestGiven=shock.id==='tasas_nacionales';
  const islm={is:isSign,isDrivers,lm:(shock.market==='money'&&shock.curve==='ms')?initial:0,
    evidence:mdInitial?'money-demand-course-rule':interestGiven?'interest-origin-unspecified':'course-rule',
    note:''};
  const sequence=Object.entries(changes).flatMap(([market,evs])=>evs.map(e=>({...e,market}))).filter(e=>e.market!=='fx').sort((a,b)=>a.stage-b.stage);
  return {shock,dir,initial,changes,steps,sequence,islm,channels,inspect,dominant,stageD,isSign,explanations,audit,origin,balance};
 }
 function generateExplanations(c){
  const {shock,dir,changes,y,w,ie,tc,stageD,dom}=c;
  let out={};
  for(const [market,evs] of Object.entries(changes)){
   const arr=[];
   for(let k=0;k<evs.length;k++){
    const e=evs[k],sign=e.sign,seq=k+1;let texts=[];
    if(market==='goods'){
      const isStart=e.stage===1 && shock.market==='goods';
      const causal=isStart?`Al ${dir===1?'aumentar':'disminuir'} ${shock.label.toLowerCase()}, la Demanda Agregada ${direction(sign)} porque afecta ${shock.channel} en DA = C + I + G + X − M.`:
        `Debido a los resultados simultáneos de los mercados anteriores, los salarios modifican C y la tasa de interés modifica I dentro de DA = C + I + G + X − M. Se eligió predominio de ${dom==='investment'?'inversión':'consumo'}, por lo que la demanda agregada ${direction(sign)} (${e.why}).`;
      texts=[causal,`Al nivel de producción de equilibrio anterior, la ${sign>0?'DA es mayor que la OA y se genera exceso de demanda agregada':'OA es mayor que la DA y se genera exceso de oferta agregada'}.`,`Los inventarios de los productores se ${sign>0?'empiezan a agotar, hay presión para que suban los precios e incentivos para aumentar':'empiezan a acumular, hay presión para que bajen los precios e incentivos para disminuir'} la producción.`,`Se alcanza un nuevo equilibrio con un nivel de producción ${sign>0?'mayor y presión inflacionaria':'menor y sin presión inflacionaria adicional'}.`];
    }else if(market==='labor'){
      const ctype=e.curve==='ol'?'oferta':'demanda';const wl=e.curve==='ol'?-sign:sign,employment=e.curve==='ol'?sign:sign;
      texts=[`La ${ctype} de trabajo (${curveNames[e.curve]}) ${direction(sign)}. ${e.why}.`,`Al salario de equilibrio anterior la ${ctype==='demanda'?(sign>0?'cantidad demandada excede la ofrecida':'cantidad ofrecida excede la demandada'):(sign>0?'cantidad ofrecida excede la demandada':'cantidad demandada excede la ofrecida')} de trabajo.`,`Se presenta presión para que el salario ${direction(wl)}; los agentes ajustan las cantidades ofrecidas y demandadas de trabajo.`,`Hay un nuevo equilibrio con salario ${wl>0?'mayor':'menor'} y nivel de empleo ${employment>0?'mayor':'menor'}.`];
    }else if(market==='money'){
      const i=e.curve==='ms'?-sign:sign;
      texts=[`La ${e.curve==='ms'?'oferta':'demanda'} de dinero (${curveNames[e.curve]}) ${direction(sign)}. ${e.why}.`,`A la tasa de interés anterior hay exceso de ${i>0?'demanda':'oferta'} de dinero.`,`Hay presión para que la tasa de interés ${direction(i)}.`,`Se establece un equilibrio monetario de referencia con tasa de interés ${i>0?'mayor':'menor'}, manteniendo los otros determinantes constantes.`];
    }else{
      const t=e.curve==='os'?-sign:sign;
      texts=[`La ${e.curve==='os'?'oferta':'demanda'} de dólares (${curveNames[e.curve]}) ${direction(sign)}. ${e.why}.`,`Al tipo de cambio anterior hay exceso de ${t>0?'demanda':'oferta'} de dólares.`,`Hay presión para que el tipo de cambio ${direction(t)}.`,`Se obtiene un nuevo equilibrio cambiario de referencia con tipo de cambio ${t>0?'mayor':'menor'}, ceteris paribus.`];
    }
    arr.push({event:e,paragraphs:texts});
   }
   out[market]=arr;
  }
  out.is=`IS ${c.isSign>0?'se desplaza a la derecha':c.isSign<0?'se desplaza a la izquierda':'permanece fija'} por los componentes de DA distintos de la inversión inducida por i. LM solo cambia por Ms del Banco Central.`;
  return out;
 }
 return {MARKETS,CURVES,CATALOG,curveNames,analyze,arrow,direction,S};
})();


/* Macro Studio 5.0 · Rutas docentes trazables. Sin dependencias externas.
   No se suman elasticidades inexistentes: signo neto cuando coexisten efectos
   contrapuestos responde a un supuesto explícito del ejercicio. */
(function(){
'use strict';
const mName={goods:'Bienes y servicios',labor:'Laboral',money:'Monetario',fx:'Cambiario'};
const N={goods:'Y',labor:'W',money:'i',fx:'TC'};
const sign=x=>x>0?1:x<0?-1:0;
const arrow=x=>x>0?'↑':x<0?'↓':'↔';
const verb=x=>x>0?'aumenta':x<0?'disminuye':'permanece constante';
const plural=x=>x>0?'aumentan':x<0?'disminuyen':'no varían';
const clean=s=>String(s||'').trim();
const fmt=(m,s)=>m+':'+s;
const seen=(xs,id)=>xs.some(x=>x.id===id);
function analyze(spec={},extra=[]){
  const sh=[...MS.CATALOG,...extra].find(s=>s.id===spec.shockId)||MS.CATALOG[0];
  const dir=sh.id==='tecnologia_sust'?1:(spec.direction===-1?-1:1), inc=sign(dir*sh.effect);
  const choice=['consumption','investment','exchange'].includes(spec.balanceChoice)?spec.balanceChoice:'consumption';
  const routeMode=(sh.id==='ied'&&spec.routeMode==='dual')?'dual':'cambiario';
  const dualChoice=spec.dualChoice==='investment'?'investment':'exchange';
  const changes={goods:[],labor:[],money:[],fx:[]}, edges=[], stages=[];
  let balance=null, isOverride=null, bp=0, bpWhy='', wage=0, interest=0, tc=0, y=0;
  function add(m,stage,curve,v,why,deps=[],kind='induced',eligible=false){
    v=sign(v);if(!v)return null;
    const id=fmt(m,stage);if(changes[m].some(e=>e.id===id))throw new Error('Secuencia duplicada '+id+' '+sh.id);
    const round=changes[m].length?'segundo':'primero';
    const ev={id,stage,market:m,curve,sign:v,why:clean(why),round,kind,eligible,parents:deps};
    changes[m].push(ev);
    for(const parent of deps)edges.push({from:parent,to:id,variable:parent.split(':')[0],why:ev.why});
    return ev;
  }
  const step=(n,msg)=>stages.push({n,title:'Secuencia '+n,text:msg,round:n<3?'primero':'segundo'});
  const moneyI=x=>x; // aumento de Md sube i; aumento de Ms baja i
  function balanceFor(stage,sources,parents){
    const signs=sources.filter(s=>s.sign).map(s=>s.sign),opposing=signs.some(x=>x>0)&&signs.some(x=>x<0);
    const candidate=sources.find(x=>x.key===choice)||sources[0];
    const net=opposing?candidate.sign:(signs[0]||0);
    balance={applicable:opposing,stage,channels:sources.map(x=>({...x})),choice,net,selected:candidate.key,
      note:sources.map(x=>`${x.label}: ${verb(x.sign)} (${arrow(x.sign)})`).join('; ')+'; '+(opposing?'por el supuesto elegido, ':'')+'DA '+arrow(net),parents};
    return net;
  }
  function goodsShock(){
    const cause={
      infra:'La inversión pública en infraestructura modifica G',compras:'Las compras gubernamentales modifican G',
      salarios_publicos:'Los salarios del sector público forman parte de G',pensiones:'Las pensiones y transferencias modifican el ingreso disponible y el consumo',
      transferencias:'Las transferencias cambian el ingreso disponible Yd y C',impuestos:'Los impuestos cambian inversamente Yd y el consumo C',
      consumo_aut:'El consumo autónomo modifica C',pmc:'La propensión marginal a consumir modifica C',
      inversion_aut:'La inversión autónoma modifica I sin un cambio previo de i',credito:'El acceso al crédito modifica I autónomamente',
      tramitologia:'Las trabas administrativas modifican la inversión autónoma',
      tipo_cambio_exo:'El tipo de cambio dado exógenamente modifica X−M',salario_exo:'Los salarios exógenos modifican el ingreso disponible y C',
    }[sh.id]||`${sh.label} modifica ${sh.channel} de DA`;
    add('goods',1,'da',inc,`${cause}. DA ${verb(inc)} (DA1→DA2) dentro de DA=C+I+G+X−M.`,[],'autonomous',sh.id!=='tasas_nacionales');
    add('labor',2,'dl',inc,`Debido a que la producción nacional Y ${verb(inc)} en bienes y servicios (secuencia 1), la demanda laboral DL ${verb(inc)}, por lo que los salarios ${plural(inc)}.`,['goods:1']);
    add('money',2,'md',inc,`Debido a que Y ${verb(inc)} en bienes y servicios (secuencia 1), las transacciones y la demanda de dinero Md ${plural(inc)}, por lo que la tasa de interés ${verb(inc)}.`,['goods:1']);
    add('fx',2,'ds',inc,`Debido a que Y ${verb(inc)} en bienes y servicios (secuencia 1), las importaciones y la demanda de dólares D$ ${plural(inc)}; el tipo de cambio ${verb(inc)}.`,['goods:1']);
    const opts=[{key:'consumption',label:'Salarios → consumo C',sign:inc},{key:'investment',label:'Tasa de interés → inversión I',sign:-inc},{key:'exchange',label:'Tipo de cambio → X−M',sign:inc}];
    const net=balanceFor(3,opts,['labor:2','money:2','fx:2']);
    add('goods',3,'da',net,`En la secuencia 2 los salarios ${plural(inc)} y C ${verb(inc)}; la tasa de interés ${verb(inc)} y la inversión I ${verb(-inc)}; el tipo de cambio ${verb(inc)} y X−M ${verb(inc)}. ${balance.note}.`,['labor:2','money:2','fx:2'],'net',choice!=='investment');
    add('labor',4,'dl',net,`Como la producción nacional volvió a ${verb(net)} por el efecto 3 de bienes y servicios, DL ${verb(net)} y los salarios ${plural(net)}.`,['goods:3']);
    add('money',4,'md',net,`Como la producción nacional volvió a ${verb(net)} por el efecto 3 de bienes y servicios, la demanda de dinero Md ${verb(net)} y la tasa de interés ${verb(net)}.`,['goods:3']);
    add('fx',4,'ds',net,`Como la producción nacional volvió a ${verb(net)} por el efecto 3 de bienes y servicios, las importaciones y D$ ${plural(net)}.`,['goods:3']);
    step(1,`Cambio autónomo de DA (${arrow(inc)}).`);step(2,`La producción Y ${arrow(inc)} afecta simultáneamente DL, Md y D$.`);
    step(3,`Retorno único a DA mediante C, I y X−M: ${balance.note}.`);step(4,`Nueva Y ${arrow(net)} produce el segundo efecto en DL, Md y D$.`);
  }
  function laborShock(){
    const w=sh.curve==='ol'?-inc:inc;
    add('labor',1,sh.curve,inc,`${sh.label}: ${sh.curve==='ol'?'la oferta de trabajo OL':'la demanda laboral DL'} ${verb(inc)}, por lo que el salario W ${verb(w)}.`,[],'autonomous');
    add('goods',2,'da',w,`Debido a que los salarios W ${plural(w)} en el mercado laboral (secuencia 1), el ingreso disponible Yd y el consumo C ${plural(w)}, y la demanda agregada DA ${verb(w)}.`,['labor:1'],'autonomous',true);
    add('labor',3,'dl',w,`La producción nacional Y ${verb(w)} en bienes y servicios (secuencia 2), por lo que DL ${verb(w)} y los salarios ${plural(w)}.`,['goods:2']);
    add('money',3,'md',w,`La producción Y ${verb(w)} en bienes y servicios (secuencia 2), por lo que la demanda de dinero Md ${verb(w)} y la tasa de interés ${verb(w)}.`,['goods:2']);
    add('fx',3,'ds',w,`La producción Y ${verb(w)} en bienes y servicios (secuencia 2), por lo que importaciones y D$ ${plural(w)} y TC ${verb(w)}.`,['goods:2']);
    const opts=[{key:'consumption',label:'Salarios → C',sign:w},{key:'investment',label:'i → I',sign:-w},{key:'exchange',label:'TC → X−M',sign:w}];
    const net=balanceFor(4,opts,['labor:3','money:3','fx:3']);
    add('goods',4,'da',net,`En la secuencia 3 los salarios ${plural(w)} y C ${verb(w)}; la tasa de interés ${verb(w)} e I ${verb(-w)}; el tipo de cambio ${verb(w)} y X−M ${verb(w)}. ${balance.note}.`,['labor:3','money:3','fx:3'],'net',choice!=='investment');
    add('money',5,'md',net,`Y ${verb(net)} por el efecto 4 en bienes y servicios, por lo que Md ${verb(net)} y la tasa de interés ${verb(net)} en segundo orden.`,['goods:4']);
    add('fx',5,'ds',net,`Y ${verb(net)} por el efecto 4 en bienes y servicios, por lo que importaciones y D$ ${plural(net)} en segundo orden.`,['goods:4']);
    step(1,`Oferta o demanda de trabajo ${arrow(inc)}, W ${arrow(w)}.`);step(2,`W ${arrow(w)} modifica consumo y Y ${arrow(w)}.`);
    step(3,`Y ${arrow(w)} cambia DL, Md y D$ simultáneamente.`);step(4,`Los tres mecanismos afectan una sola DA: ${balance.note}.`);
    step(5,`La respuesta final de Y ${arrow(net)} llega a Md y D$.`);
  }
  function fxShock(){
    const tc0=sh.curve==='os'?-inc:inc, Y=tc0;
    add('fx',1,sh.curve,inc,`${sh.label} ${arrow(dir)}: la ${sh.curve==='os'?'oferta de dólares O$':'demanda de dólares D$'} ${verb(inc)} y el tipo de cambio TC ${verb(tc0)}.`,[],'autonomous');
    add('goods',2,'da',Y,`Debido a que TC ${verb(tc0)} en el mercado cambiario (secuencia 1), las exportaciones netas X−M ${plural(Y)}: las exportaciones ${plural(Y)} y las importaciones ${plural(-Y)}. Por ello DA ${verb(Y)}.`,['fx:1'],'autonomous',true);
    add('labor',3,'dl',Y,`La producción Y ${verb(Y)} en bienes y servicios (secuencia 2), por lo que DL ${verb(Y)} y los salarios ${plural(Y)}.`,['goods:2']);
    add('money',3,'md',Y,`La producción Y ${verb(Y)} en bienes y servicios (secuencia 2), por lo que Md ${verb(Y)} y la tasa de interés ${verb(Y)}.`,['goods:2']);
    add('fx',3,'ds',Y,`La producción Y ${verb(Y)} en bienes y servicios (secuencia 2), por lo que las importaciones y la demanda de dólares D$ ${plural(Y)} y el TC recibe una segunda presión ${Y>0?'alcista':'bajista'}.`,['goods:2']);
    const opts=[{key:'consumption',label:'W → C',sign:Y},{key:'investment',label:'i → I',sign:-Y},{key:'exchange',label:'TC → X−M',sign:Y}];
    const net=balanceFor(4,opts,['labor:3','money:3','fx:3']);
    add('goods',4,'da',net,`Los salarios ${plural(Y)} y el consumo C ${verb(Y)}; la tasa de interés ${verb(Y)} y la inversión I ${verb(-Y)}; el tipo de cambio ${verb(Y)} y X−M ${verb(Y)}. Los tres efectos 3 llegan al único efecto 4. ${balance.note}.`,['labor:3','money:3','fx:3'],'net',choice!=='investment');
    add('labor',5,'dl',net,`Como Y ${verb(net)} tras el efecto 4 de bienes y servicios, DL ${verb(net)} y los salarios ${plural(net)}.`,['goods:4']);
    add('money',5,'md',net,`Como Y ${verb(net)} tras el efecto 4 de bienes y servicios, la demanda de dinero Md ${verb(net)} y la tasa de interés ${verb(net)}.`,['goods:4']);
    step(1,`Shock cambiario ${arrow(inc)}; TC ${arrow(tc0)}.`);step(2,`TC ${arrow(tc0)} modifica X−M, DA y Y ${arrow(Y)}.`);
    step(3,`Y ${arrow(Y)} modifica DL, Md y D$; W, i y TC quedan definidos.`);
    step(4,`Los tres efectos 3 apuntan al mismo efecto 4: ${balance.note}.`);step(5,`La segunda Y modifica DL y Md: ${arrow(net)}.`);
    if(sh.curve==='os' && ['ied','tasas_externas','turismo_entrada','remesas','prestamos_externos','flujos_portafolio'].includes(sh.id)){
      bp=-inc;bpWhy=`El shock inicial de ${sh.label} cambia directamente los ingresos de dólares (O$ ${arrow(inc)}).`;
    } else if(sh.curve==='ds') {bp=inc;bpWhy='El shock inicial modifica directamente la salida de dólares.';}
  }
  function iedDual(){
    // Dos entradas independientes válidas según la clase del 17/11.
    // El neto global NO puede inferirse sin decidir qué canal domina.
    const da0=inc,fx0=inc,tc0=-fx0;
    add('goods',1,'da',da0,`En este modelo se SUPONE que la IED se incorpora a la inversión nacional I. Al disminuir la IED, la inversión autónoma I ${verb(da0)}, por lo que DA ${verb(da0)}.`,[],'autonomous',true);
    add('fx',1,'os',fx0,`En paralelo, la IED disminuye la entrada de dólares: O$ ${verb(fx0)}, por lo que TC ${verb(tc0)}.`,[],'autonomous');
    add('labor',2,'dl',da0,`El primer Y, derivado del canal inversión nacional de la secuencia 1, ${verb(da0)}; por eso DL y los salarios ${plural(da0)}.`,['goods:1']);
    add('money',2,'md',da0,`El primer Y, derivado de la inversión nacional en la secuencia 1, ${verb(da0)}; Md y la tasa de interés ${plural(da0)}.`,['goods:1']);
    add('fx',2,'ds',da0,`El primer Y del canal inversión nacional ${verb(da0)}; importaciones y D$ ${plural(da0)}.`,['goods:1']);
    add('goods',2,'da',tc0,`Simultáneamente, O$ ${verb(fx0)} en el mercado cambiario (efecto 1), TC ${verb(tc0)} y X−M ${verb(tc0)}, por lo que DA recibe una presión ${tc0>0?'alcista':'bajista'}.`,['fx:1'],'autonomous',true);
    add('labor',3,'dl',tc0,`La nueva Y del retorno cambiario (secuencia 2) ${verb(tc0)}; DL y salarios reciben una presión ${tc0>0?'alcista':'bajista'}.`,['goods:2']);
    add('money',3,'md',tc0,`La nueva Y del retorno cambiario (secuencia 2) ${verb(tc0)}; Md y la tasa de interés reciben una presión ${tc0>0?'alcista':'bajista'}.`,['goods:2']);
    bp=-fx0;bpWhy='IED cae: ingreso autónomo de dólares disminuye.';
    isOverride=dualChoice==='investment'?da0:tc0;
    balance={applicable:true,stage:2,channels:[{key:'consumption',label:'Canal inversión nacional',sign:da0},{key:'investment',label:'Canal cambiario X−M',sign:tc0},{key:'exchange',label:'Canal cambiario X−M',sign:tc0}],choice:dualChoice==='investment'?'consumption':'exchange',net:isOverride,
      note:`Las presiones iniciales sobre DA son contrapuestas (I ${arrow(da0)}, X−M ${arrow(tc0)}). Se supone que domina el ${dualChoice==='investment'?'canal de inversión nacional':'canal cambiario'}; el signo neto no es una magnitud estimada.`};
    step(1,`Doble inicio explícito: I nacional ${arrow(da0)} y O$ ${arrow(fx0)}.`);step(2,`Y por inversión ${arrow(da0)} llega a DL/Md/D$; TC ${arrow(tc0)} llega a DA.`);
    step(3,`La Y del canal cambiario ${arrow(tc0)} vuelve a DL y Md; la comparación neta queda supuesta.`);
  }
  function moneyShock(){
    if(sh.curve==='ms'){
      const i=-inc,Y=-i,fxOS=i,tc0=-fxOS;
      add('money',1,'ms',inc,`El Banco Central modifica Ms ${arrow(inc)}; la tasa de interés nacional ${verb(i)}.`,[],'autonomous');
      add('goods',2,'da',Y,`La tasa de interés nacional ${verb(i)} por Ms de la secuencia 1; la inversión I ${verb(Y)}, y DA ${verb(Y)}. El movimiento de I por i NO desplaza IS.`,['money:1'],'i-investment',false);
      add('fx',2,'os',fxOS,`La tasa de interés nacional ${verb(i)} por el efecto monetario 1; entran ${fxOS>0?'más':'menos'} dólares de inversión y O$ ${verb(fxOS)}; TC ${verb(tc0)}.`,['money:1'],'i-capital');
      add('labor',3,'dl',Y,`Y ${verb(Y)} por bienes y servicios (efecto 2); DL y los salarios ${plural(Y)}.`,['goods:2']);
      add('money',3,'md',Y,`Y ${verb(Y)} por bienes y servicios (efecto 2); las transacciones y Md ${plural(Y)}.`,['goods:2']);
      add('fx',3,'ds',Y,`Y ${verb(Y)} por bienes y servicios (efecto 2); las importaciones y D$ ${plural(Y)}.`,['goods:2']);
      const opts=[{key:'consumption',label:'W → C',sign:Y},{key:'investment',label:'i → I',sign:-Y},{key:'exchange',label:'TC → X−M',sign:tc0}];
      const net=balanceFor(3,opts,['fx:2','labor:3','money:3']);
      // Stage 3 goods is a convergence of the TC from FX2 and wage/money feedback from stage 3.
      add('goods',3,'da',net,`El tipo de cambio ${verb(tc0)} por O$ de la secuencia 2, modifica X−M ${verb(tc0)}. Además, en la secuencia 3 los salarios ${plural(Y)} y C ${verb(Y)}; la tasa de interés recibe retorno y la inversión I ${verb(-Y)}. ${balance.note}.`,['fx:2','labor:3','money:3'],'net',choice!=='investment');
      add('labor',4,'dl',net,`Y ${verb(net)} por el retorno de DA en la secuencia 3; DL y los salarios ${plural(net)}.`,['goods:3']);
      step(1,`BCCR Ms ${arrow(inc)} → i ${arrow(i)}.`);step(2,`i ${arrow(i)} provoca I ${arrow(Y)} y O$ ${arrow(fxOS)}.`);
      step(3,`Y ${arrow(Y)} provoca DL, Md, D$; tipo de cambio y salarios determinan un único DA3: ${balance.note}.`);
      step(4,`La nueva Y modifica DL ${arrow(net)}; no se crea un efecto 5.`);
      // BP por política monetaria se interpreta desde el canal externo observado en la presentación, no por i aislada.
      bp=inc;bpWhy=`La política del BCCR induce salida/entrada de capitales representada por O$ ${arrow(fxOS)}.`;
    }else{
      const i=inc,Y=-i,os=i,tc0=-os;
      add('money',1,'md',inc,`La ${sh.label} ${arrow(dir)} genera una demanda de dinero Md ${verb(inc)}, y la tasa de interés nacional ${verb(i)}. La oferta Ms permanece fija.`,[],'autonomous');
      add('goods',2,'da',Y,`El interés nacional ${verb(i)} a raíz del efecto monetario 1; la inversión nacional I ${verb(Y)}, y DA ${verb(Y)}. Este cambio de inversión inducido por i NO desplaza IS.`,['money:1'],'i-investment',false);
      add('fx',2,'os',os,`La tasa de interés nacional ${verb(i)} en el mercado monetario 1 cambia el atractivo financiero; O$ ${verb(os)} y el tipo de cambio ${verb(tc0)}.`,['money:1'],'i-capital');
      add('labor',3,'dl',Y,`Y ${verb(Y)} en bienes y servicios 2; DL y los salarios ${plural(Y)}.`,['goods:2']);
      add('money',3,'md',Y,`Y ${verb(Y)} en bienes y servicios 2; las transacciones y Md ${plural(Y)}.`,['goods:2']);
      add('fx',3,'ds',Y,`Y ${verb(Y)} en bienes y servicios 2; las importaciones y D$ ${plural(Y)}.`,['goods:2']);
      const net=tc0; // El segundo efecto bienes y servicios viene de FX2 (no del gasto público).
      add('goods',3,'da',net,`El TC ${verb(tc0)} tras O$ ${verb(os)} de la secuencia 2, por lo que X−M ${verb(tc0)} y DA ${verb(tc0)}. No se supone ningún cambio autónomo de gasto público G.`,['fx:2'],'fx-net',true);
      add('labor',4,'dl',net,`La nueva Y por X−M ${verb(net)} en bienes y servicios 3; DL y salarios ${plural(net)}.`,['goods:3']);
      step(1,`Md ${arrow(inc)} por ${sh.label}; i ${arrow(i)} y Ms fija.`);step(2,`i ${arrow(i)} → I ${arrow(Y)} y O$ ${arrow(os)}.`);
      step(3,`Y ${arrow(Y)} modifica DL, Md, D$ y TC ${arrow(tc0)} produce DA3 por X−M.`);
      step(4,`Y del retorno cambiario ${arrow(net)} produce DL4. No hay DA4 ni DL5.`);
      bp=0;bpWhy='Un cambio aislado de la tasa de interés causado por Md no constituye un shock autónomo de BP en la regla docente.';
    }
  }
  function doubleTrade(){
    const goods0=inc,fx0=sh.id==='importaciones'?-inc:inc,fxCurve=sh.id==='importaciones'?'ds':'os';
    const tradeChoice=spec.tradeChoice==='exchange'?'exchange':'autonomous';
    const tc0=fxCurve==='os'?-fx0:fx0;
    add('goods',1,'da',goods0,`La variable exógena modifica directamente ${sh.id==='importaciones'?'las importaciones M':'las exportaciones X'}: DA ${verb(goods0)}.`,[],'autonomous',true);
    add('fx',1,fxCurve,fx0,`La misma variable inicia una segunda ruta independiente: ${fxCurve==='os'?'O$':'D$'} ${verb(fx0)}, por lo que TC ${verb(tc0)}.`,[],'autonomous');
    add('labor',2,'dl',goods0,`Y ${verb(goods0)} por DA1 de bienes y servicios; DL y W ${verb(goods0)}.`,['goods:1']);
    add('money',2,'md',goods0,`Y ${verb(goods0)} por DA1 de bienes y servicios; Md e i ${verb(goods0)}.`,['goods:1']);
    add('fx',2,'ds',goods0,`Y ${verb(goods0)} por el inicio de DA; importaciones y D$ reciben presión ${goods0>0?'alcista':'bajista'}.`,['goods:1']);
    add('goods',2,'da',tc0,`El TC ${verb(tc0)} desde el shock cambiario 1; X−M ${verb(tc0)} y DA ${verb(tc0)}. No se crea un tercer desplazamiento de DA.`,['fx:1'],'fx-net',true);
    add('labor',3,'dl',tc0,`El nuevo Y del canal cambiario (bienes y servicios 2) ${verb(tc0)}; DL y salarios ${plural(tc0)}.`,['goods:2']);
    add('money',3,'md',tc0,`El nuevo Y del canal cambiario (bienes y servicios 2) ${verb(tc0)}; Md y tasa de interés ${verb(tc0)}.`,['goods:2']);
    balance={applicable:goods0!==tc0,stage:2,channels:[{key:'consumption',label:'Cambio exportaciones/importaciones autónomas',sign:goods0},{key:'investment',label:'Retorno del tipo de cambio',sign:tc0},{key:'exchange',label:'Retorno del tipo de cambio',sign:tc0}],choice:tradeChoice==='autonomous'?'consumption':'exchange',net:tradeChoice==='autonomous'?goods0:tc0,
      note:`DA inicial ${arrow(goods0)} y reacción cambiaria ${arrow(tc0)}. El resultado final depende de cuál predomina; no se infiere la magnitud de la diferencia.`};
    isOverride=balance.net;
    bp=fxCurve==='os'?-fx0:fx0;bpWhy='La variación comercial altera directamente el ingreso o salida autónoma de dólares.';
    step(1,`Dos inicios simultáneos: DA ${arrow(goods0)} y ${fxCurve==='os'?'O$':'D$'} ${arrow(fx0)}.`);
    step(2,`El primer Y ${arrow(goods0)} modifica DL, Md y D$; el primer TC ${arrow(tc0)} modifica DA.`);
    step(3,`La respuesta cambiaria de DA produce DL y Md ${arrow(tc0)}; la ruta termina.`);
  }
  if(sh.id==='ied'&&routeMode==='dual')iedDual();
  else if(['exportaciones','importaciones','ingreso_socios'].includes(sh.id))doubleTrade();
  else if(sh.id==='tasas_nacionales'){
    // Shock exógeno en i: para IS–LM–BP es un movimiento a lo largo de curvas.
    // No inventar desplazamiento autónomo de IS / LM / BP.
    const i=dir,Y=-i,os=i,tc0=-os;
    add('goods',1,'da',Y,`i nacional ${verb(i)} como variable explicativa; I ${verb(Y)} y DA ${verb(Y)}. El cambio de I por i no desplaza la IS.`,[],'i-investment',false);
    add('fx',1,'os',os,`i nacional ${verb(i)} exógenamente; O$ ${verb(os)} y TC ${verb(tc0)}. No se postula desplazamiento autónomo de BP solo por i.`,[],'i-capital');
    add('labor',2,'dl',Y,`Y ${verb(Y)} en bienes y servicios 1; DL y W ${verb(Y)}.`,['goods:1']);
    add('money',2,'md',Y,`Y ${verb(Y)} en bienes y servicios 1; Md responde ${arrow(Y)} sin cambio de Ms.`,['goods:1']);
    add('fx',2,'ds',Y,`Y ${verb(Y)} en bienes y servicios 1; importaciones y D$ ${verb(Y)}.`,['goods:1']);
    add('goods',2,'da',tc0,`TC ${verb(tc0)} por O$ en el mercado cambiario 1; X−M ${verb(tc0)} y DA ${verb(tc0)}.`,['fx:1'],'fx-net',true);
    add('labor',3,'dl',tc0,`Y ${verb(tc0)} por el segundo efecto de DA; DL ${verb(tc0)}.`,['goods:2']);
    add('money',3,'md',tc0,`Y ${verb(tc0)} por el segundo efecto de DA; Md ${verb(tc0)}.`,['goods:2']);
    isOverride=tc0;bp=0;
    step(1,'Cambio dado de i: I y O$ responden; no es por sí mismo un cambio de IS, LM o BP.');step(2,'Y inicial afecta DL/Md/D$; TC afecta X−M y DA.');step(3,'El cambio de Y por X−M retorna a DL y Md.');
  }
  else if(sh.market==='goods')goodsShock();
  else if(sh.market==='labor')laborShock();
  else if(sh.market==='money')moneyShock();
  else fxShock();
  for(const m of ['goods','labor','money','fx']){
    if(changes[m].length>2)throw new Error('Más de segundo orden en '+m+' '+sh.id);
  }
  const seq=Object.values(changes).flat().sort((a,b)=>a.stage-b.stage||(['goods','labor','money','fx'].indexOf(a.market)-['goods','labor','money','fx'].indexOf(b.market)));
  const eligible=changes.goods.filter(e=>e.eligible).map(e=>({stage:e.stage,sign:e.sign,cause:e.why,weight:1}));
  const is=isOverride===null?sign(eligible.reduce((a,e)=>a+e.sign,0)):isOverride;
  const lm=sh.market==='money'&&sh.curve==='ms'?inc:0;
  const g=changes.goods,lab=changes.labor,money=changes.money,fx=changes.fx;
  const net=balance?.net??(g.at(-1)?.sign||0);
  const w=lab.length?(lab.at(-1).curve==='ol'?-lab.at(-1).sign:lab.at(-1).sign):0;
  const ie=money.length?(money.at(-1).curve==='ms'?-money.at(-1).sign:money.at(-1).sign):0;
  const exch=fx.length?(fx.at(-1).curve==='os'?-fx.at(-1).sign:fx.at(-1).sign):0;
  // Resultado cualitativo sujeto a las magnitudes no observadas; evitar atribuir un número a inflación/desempleo.
  const result={shock:sh,dir,initial:inc,changes,steps:stages,sequence:seq,edges,routeMode,dualChoice,
    balance:balance||{applicable:false,stage:0,channels:[],net,choice,note:''},stageD:net,
    dominant:{output:net,wage:w,interest:ie,exchange:exch,employment:lab.at(-1)?.sign||0,inflation:net?'presión '+(net>0?'alcista':'bajista'):'no determinada'},
    isSign:is,islm:{is,lm,bp,isDrivers:eligible,bpReason:bpWhy},explanations:{},inspect:[],audit:[]};
  result.explanations.is=`IS ${is>0?'se desplaza a la derecha':is<0?'se desplaza a la izquierda':'permanece fija'}. ${eligible.length?eligible.map(e=>'Secuencia '+e.stage+': '+e.cause).join(' '):'No hay variación autónoma que desplace IS.'} LM ${lm?'se desplaza por Ms del BCCR':'permanece fija porque Ms no cambió por intervención del BCCR'}. BP ${bp?'se desplaza por el flujo de dólares definido':'mantiene su posición'}. ${bpWhy}`;
  result.audit=seq.map(e=>({n:e.stage,market:e.market,origin:e.parents,why:e.why}));
  return result;
}
MS.analyze=analyze;
})();
