const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = process.env.JOB_TEST_SOURCE || path.resolve(__dirname, '..');
async function execute(file, {args=[], existing=null, date='2026-10-24', dry=false}={}) {
  const calls={reads:[],writes:[],counts:[],errors:[],exitCode:0};
  let finish;
  const done=new Promise(resolve=>{finish=resolve;});
  const client={
    theaterNewsItem:{count:async q=>{calls.counts.push(q);return 3356;},findMany:async q=>{calls.reads.push(q);return []; }},
    blogPost:{findUnique:async()=>existing,upsert:async q=>{calls.writes.push(q);}},
    $disconnect:async()=>finish(),
  };
  const dependencies={
    '@prisma/client':{PrismaClient:function(){return client;}},
    fs:{readdirSync:()=>['post.md'],readFileSync:()=>''},path,
    'gray-matter':()=>({data:{title:'Title',date,tags:['news']},content:'Body'}),
  };
  const processMock={argv:['node',file,...args,...(dry?['--dry-run']:[])],cwd:()=>'/test',exitCode:0};
  const source=fs.readFileSync(path.join(root,file),'utf8');
  const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true},reportDiagnostics:true});
  assert.equal(code.diagnostics.length,0);
  vm.runInNewContext(code.outputText,{exports:{},require:n=>{if(!(n in dependencies))throw new Error(n);return dependencies[n];},process:processMock,console:{log(){},error:e=>calls.errors.push(String(e))},Date});
  await done;
  calls.exitCode=processMock.exitCode;
  return calls;
}
const record={title:'Title',description:null,content:'Body',tags:['news'],publishedAt:new Date('2026-10-24')};
test('RSS candidates limited to 40 and recent 14 days',async()=>{
 const c=await execute('scripts/openclaw/list-news.ts');assert.equal(c.reads[0].take,40);assert.equal(c.reads[0].where.used,false);
 assert.ok(Math.abs((Date.now()-c.reads[0].where.publishedAt.gte.getTime())/86400000-14)<0.01);
});
test('RSS invalid limits fail before querying',async()=>{const c=await execute('scripts/openclaw/list-news.ts',{args:['--limit','0']});assert.equal(c.exitCode,1);assert.equal(c.reads.length,0);});
test('RSS explicit wider window stays bounded',async()=>{const c=await execute('scripts/openclaw/list-news.ts',{args:['--days','60','--limit','100']});assert.equal(c.reads[0].take,100);});
test('unchanged articles perform no upsert',async()=>{const c=await execute('scripts/migrate-blog-to-db.ts',{existing:record});assert.equal(c.writes.length,0);});
test('changed content updates while preserving publication status',async()=>{const c=await execute('scripts/migrate-blog-to-db.ts',{existing:{...record,content:'Old'}});assert.equal(c.writes.length,1);assert.equal(c.writes[0].update.content,'Body');assert.ok(!('published' in c.writes[0].update));});
test('new articles still publish',async()=>{const c=await execute('scripts/migrate-blog-to-db.ts');assert.equal(c.writes[0].create.published,true);});
test('dry run never writes changed content',async()=>{const c=await execute('scripts/migrate-blog-to-db.ts',{dry:true});assert.equal(c.writes.length,0);});
test('missing date preserves stored timestamp',async()=>{const c=await execute('scripts/migrate-blog-to-db.ts',{existing:record,date:null});assert.equal(c.writes.length,0);});
test('invalid date fails without writing',async()=>{const c=await execute('scripts/migrate-blog-to-db.ts',{date:'invalid'});assert.equal(c.exitCode,1);assert.equal(c.writes.length,0);});
