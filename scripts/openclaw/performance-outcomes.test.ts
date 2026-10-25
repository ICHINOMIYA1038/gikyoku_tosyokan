import {test} from 'node:test';
import assert from 'node:assert/strict';
import {summarizeFetches, classifyPerformanceContext} from './performance-outcomes';
test('policy refusals and unknown policy are distinct from operational errors',()=>{
  const s=summarizeFetches([
    {url:'a',outcome:'ok'}, {url:'b',outcome:'robots_denied'}, {url:'c',outcome:'robots_unavailable'},
    {url:'d',outcome:'http_error',status:403}, {url:'e',outcome:'timeout'}, {url:'f',outcome:'unsupported_content'},
  ]);
  assert.equal(s.fetched,1);assert.equal(s.errors,2);assert.equal(s.robotsDenied,1);assert.equal(s.robotsUnavailable,1);assert.equal(s.unsupported,1);assert.deepEqual(s.httpStatuses,{'403':1});
});
test('member appearances and long titles alone do not establish a company performance',()=>{
  assert.equal(classifyPerformanceContext('石原正一ショーpresents 仮面夫婦の鑑 出演'),'medium');
  assert.equal(classifyPerformanceContext('長橋遼也 ジャガーの眼 出演'),'medium');
  assert.equal(classifyPerformanceContext('長い作品タイトルの紹介'),'medium');
  assert.equal(classifyPerformanceContext('名大祭公演 幸福な夢 第63回公演'),'high');
});
