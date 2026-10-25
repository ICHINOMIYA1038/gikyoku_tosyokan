// Read-only consumer check. A saved row is not evidence of a page view or business impact.
// npx tsx scripts/openclaw/verify-performance-usage.ts <matches.json> <report.json>
import {PrismaClient} from '@prisma/client';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
const prisma=new PrismaClient();
async function main(){
  const [input,output]=process.argv.slice(2);
  if(!input||!output)throw Error('matches.json and output.json required');
  const candidates=JSON.parse(fs.readFileSync(input,'utf8'));
  if(!Array.isArray(candidates))throw Error('match array required');
  const selected=candidates.filter(m=>m.confidence==='high').slice(0,10);
  const checks=[];
  for(const m of selected){
    const row=await prisma.$transaction(async tx=>{
      await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');
      return tx.postTheaterGroup.findUnique({where:{postId_theaterGroupId:{postId:m.postId,theaterGroupId:m.theaterGroupId}},select:{sourceUrl:true,theaterGroup:{select:{slug:true}}}});
    });
    const url=`https://gikyokutosyokan.com/posts/${m.postId}`;
    let status:number|null=null,rendered=false,error:string|null=null;
    try{
      const response=await fetch(url,{signal:AbortSignal.timeout(15000)});status=response.status;
      if(response.ok&&row){
        const dom=new JSDOM(await response.text());
        const section=Array.from(dom.window.document.querySelectorAll('section')).find(s=>s.querySelector('h2')?.textContent?.trim()==='上演の記録');
        rendered=!!section&&Array.from(section.querySelectorAll('a')).some(a=>a.getAttribute('href')===`/theater-groups/${row.theaterGroup.slug}`);
        dom.window.close();
      }
    }catch(e){error=e instanceof Error?e.name:'fetch_error';}
    checks.push({postId:m.postId,theaterGroupId:m.theaterGroupId,db_present:!!row,source_matches:row?.sourceUrl===m.sourceUrl,url,http_status:status,rendered,error});
  }
  const report={
    summary:'収集候補のDB読戻しと作品詳細の上演欄を確認。表示は確認できても閲覧・利用価値は未計測。',
    metrics:{checked:checks.length,dbPresent:checks.filter(c=>c.db_present).length,sourceMatches:checks.filter(c=>c.source_matches).length,rendered:checks.filter(c=>c.rendered).length},
    usage:checks.some(c=>c.rendered&&c.source_matches)?'available':'unverified',
    evidence:[{kind:'db_readback',ref:output,observation:'READ ONLY transactionで作品・劇団の組合せと出典URLを確認。詳細はchecks。'},...checks.map(c=>({kind:'public_page',ref:c.url,observation:`HTTP ${c.http_status}; 上演欄の対象リンク ${c.rendered?'あり':'未確認'}。`} ))],
    checked_at:new Date().toISOString(),input,checks,limitations:['高信頼候補の先頭10件まで','上演主体そのものの正しさは別途出典で確認','表示と利用者の閲覧・行動は別の指標'],
  };
  fs.writeFileSync(output,JSON.stringify(report,null,2));
  console.log(JSON.stringify({output,metrics:report.metrics,usage:report.usage}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(()=>prisma.$disconnect());
