from pathlib import Path
import json,re,hashlib
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')
report_dir=root/'tests'/'out'
report_dir.mkdir(parents=True,exist_ok=True)
errors=[];checks={};examples={};count=0
expected={
 'ied':{'goods':[2,4],'labor':[3,5],'money':[3,5],'fx':[1,3]},
 'ied_dual':{'goods':[1,2],'labor':[2,3],'money':[2,3],'fx':[1,2]},
 'tasas_externas':{'goods':[2,4],'labor':[3,5],'money':[3,5],'fx':[1,3]},
 'expansion_monetaria':{'goods':[2,3],'labor':[3,4],'money':[1,3],'fx':[2,3]},
 'exportaciones':{'goods':[1,2],'labor':[2,3],'money':[2,3],'fx':[1,2]},
 'deuda_interna':{'goods':[2,3],'labor':[3,4],'money':[1,3],'fx':[2,3]},
 'migracion_entrada':{'goods':[2,4],'labor':[1,3],'money':[3,5],'fx':[3,5]},
}
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1560,'height':970},accept_downloads=True)
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html)
 checks['four_markets_and_IS_LM_BP']=page.locator('.market-card').count()==5
 checks['causal_map_exists']=page.locator('.causal-panel .causal-node').count()>=4
 checks['fx_not_optional']=page.locator('#fx-input').count()==0
 checks['legacy_examples_kept']=page.locator('.case-entry').count()>=2
 checks['class_library_exists']=page.locator('.pres-entry').count()>=2
 total=page.evaluate('MS.CATALOG.length')
 for case in page.evaluate('MS.CATALOG.map(x=>({id:x.id,market:x.market,curve:x.curve,effect:x.effect}))'):
  for d in ([1] if case['id']=='tecnologia_sust' else [-1,1]):
   for choice in ['consumption','investment','exchange']:
    for mode in (['cambiario','dual'] if case['id']=='ied' else ['cambiario']):
     count+=1
     try:
      res=page.evaluate('''([id,d,choice,routeMode])=>{
       let a=MS.analyze({shockId:id,direction:d,balanceChoice:choice,routeMode});return {
         changes:Object.fromEntries(Object.entries(a.changes).map(([m,es])=>[m,es.map(e=>e.stage)])),
         eventCount:a.sequence.length, edgeCount:a.edges.length, maxRound:a.sequence.some(e=>e.round==='segundo'),
         lm:a.islm.lm,is:a.islm.is,bp:a.islm.bp,eligible:a.islm.isDrivers.length,
         invalid:a.sequence.some(e=>e.why.includes('undefined')||!e.why||e.stage>5),
         missingParent:a.edges.some(e=>!a.sequence.some(n=>n.id===e.from)||!a.sequence.some(n=>n.id===e.to)),
         over3:Object.values(a.changes).some(es=>es.length>2)
       };
       }''',[case['id'],d,choice,mode])
      if res['invalid'] or res['missingParent'] or res['over3']:errors.append(f'{case["id"]}:{d}:{choice}:{mode} graph malformed: {res}')
      if case['curve']!='ms' and res['lm']!=0:errors.append(f'{case["id"]} LM moved without Ms')
      if case['curve']=='ms' and res['lm']==0:errors.append(f'{case["id"]} LM failed to shift on Ms')
      if case['id'] in expected and choice=='consumption' and mode=='cambiario' and d==(-1 if case['id'] in ['ied','tasas_externas'] else 1):
       examples[case['id']]=res
       if res['changes']!=expected[case['id']]:errors.append(f'{case["id"]} stage mismatch {res["changes"]}')
      if case['id']=='ied' and choice=='consumption' and mode=='dual' and d==-1:
       examples['ied_dual']=res
       if res['changes']!=expected['ied_dual']:errors.append('IED dual pattern mismatch')
     except Exception as e:errors.append(f'exception {case["id"]} {d} {choice} {mode}: {e}')
 checks['no_engine_errors']=len(errors)==0
 # select class cases from rail and test story
 page.locator('.pres-entry').nth(1).click()
 checks['class_cases']=page.locator('.case-entry').count()>=7
 for i in range(page.locator('.case-entry').count()):
  page.locator('.case-entry').nth(i).click()
  title=page.locator('.case-heading h1').inner_text()
  cards=page.locator('.market-card').count()
  node_ct=page.locator('.causal-node').count()
  line_ct=page.locator('.causal-edge').count()
  text=page.locator('.paper').inner_text()
  if cards!=5 or node_ct==0 or line_ct==0 or any(x in text for x in ['undefined','NaN','[object Object]']):errors.append(f'Class case UI {title} {cards} {node_ct} {line_ct}')
  if 'IED' in title or 'inversión extranjera' in title.lower() or 'deuda interna' in title.lower():
   slug='IED_Dual' if 'doble' in title.lower() else 'IED' if 'extranjera' in title.lower() else 'Deuda'
   page.locator('.causal-panel').screenshot(path=str(report_dir/f'Mapa_{slug}.png'))
 # IED route interaction test
 page.locator('.case-entry').nth(0).click()
 checks['ied_route_control']=page.locator('#route-input').count()==1
 page.locator('#route-input').select_option('dual')
 checks['ied_dual_two_initial_nodes']=page.evaluate('''()=>{const x=MacroStudio.analyze();return x.changes.goods[0].stage===1 && x.changes.fx[0].stage===1 && x.routeMode==='dual'}''')
 page.locator('#dual-input').select_option('investment')
 checks['ied_dual_assumption_changed']=page.evaluate('MacroStudio.analyze().dualChoice')=='investment'
 page.locator('#route-input').select_option('cambiario')
 checks['ied_fx_only_one_start']=page.evaluate('''()=>{const a=MacroStudio.analyze();return a.changes.fx[0].stage===1 && a.changes.goods[0].stage===2}''')
 # Click causal node and see details
 node=page.locator('.causal-node').first
 node.click()
 checks['causal_node_click']=page.locator('.causal-detail').inner_text().startswith('Secuencia')
 checks['causal_edge_highlight']=page.locator('.causal-edge.is-related').count()>0
 # opposing channels choose money investment etc, should be editable
 opts=page.locator('input[name="balanceChoice"]')
 checks['opposing_selector']=opts.count()>=3
 if opts.count()>=3:
  first=page.locator('[data-market="goods"] .narrative-second').inner_text()
  page.locator('input[name="balanceChoice"][value="investment"]').check()
  later=page.locator('[data-market="goods"] .narrative-second').inner_text()
  checks['predominance_recalculates']=first!=later
 # first order toggle
 page.locator('#second-input').uncheck()
 checks['first_only']=page.locator('.market-card .narrative-second').count()==0
 page.locator('#second-input').check()
 checks['second_restored']=page.locator('.market-card .narrative-second').count()>0
 # export
 with page.expect_download(timeout=9000) as dl: page.locator('button[data-act="export-json"]').click()
 f=dl.value;f.save_as(report_dir/'backup_validation.json')
 checks['JSON_export']=bool(json.loads((report_dir/'backup_validation.json').read_text())['presentations'])
 with page.expect_download(timeout=9000) as dl: page.locator('button[data-act="export-html"]').click()
 f=dl.value;f.save_as(report_dir/'html_export_validation.html')
 checks['HTML_export']=len((report_dir/'html_export_validation.html').read_text())>100000
 # reglas nuevas de Macro Studio 5.1 (sin retirar ninguna prueba previa)
 checks['money_no_same_sequence_edges']=page.evaluate("""()=>{let a=MS.analyze({shockId:'expansion_monetaria',direction:1,balanceChoice:'consumption',routeMode:'cambiario'});return a.edges.every(e=>Number(e.from.split(':')[1])<Number(e.to.split(':')[1]))&&a.changes.goods.length===2&&a.changes.goods[1].parents.join(',')==='fx:2'}""")
 checks['fiscal_expansion_starts_goods']=page.evaluate("""()=>{let a=MS.analyze({shockId:'gasto_publico',direction:1,routeMode:'cambiario'});return a.changes.goods[0].stage===1&&a.changes.goods[0].sign===1&&a.islm.lm===0&&a.islm.is>0}""")
 checks['formulario_cuatro_mercados']=page.locator('.formula-library').count()>=1
 # exposure
 page.locator('button[data-act="present"]').click()
 checks['exposure_contains_diagram']=page.locator('.expo .causal-panel').count()==1
 checks['exposure_chart_count']=page.locator('.expo .market-card').count()==5
 checks['exposure_no_audit_note']='No se ha validado' not in page.locator('.expo').inner_text()
 page.screenshot(path=str(report_dir/'vista_exposicion.png'),full_page=False)
 browser.close()
report={'scenarios_tested':count,'catalog':total,'passed':sum(1 for v in checks.values() if v),'checks':checks,'errors':errors,'examples':examples}
(report_dir/'QA.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
print(json.dumps({k:v for k,v in report.items() if k not in ('examples',)},ensure_ascii=False,indent=2)[:7000])

if errors or not all(checks.values()):
    raise SystemExit("Regression checks failed; inspect tests/out/QA.json")
