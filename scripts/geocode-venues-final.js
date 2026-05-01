const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=jp`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'gikyoku-tosyokan/1.0 (theater venue geocoding final)' }
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

function isInJapan(lat, lng) {
  return lat >= 24.0 && lat <= 46.0 && lng >= 122.0 && lng <= 154.0;
}

// Manually researched venue data
const venueData = [
  { id: 189, name: 'スペースベン', address: '八戸市柏崎1-11-8', geocodeQuery: '青森県八戸市柏崎1-11-8' },
  { id: 191, name: '風のスタジオ', address: '盛岡市肴町4-20', geocodeQuery: '岩手県盛岡市肴町4-20' },
  { id: 193, name: '百景社アトリエ', address: '土浦市真鍋3-10-18', geocodeQuery: '茨城県土浦市真鍋3-10-18' },
  { id: 207, name: 'Théâtre de Belleville', address: '津市美里町三郷2104', geocodeQuery: '三重県津市美里町三郷2104' },
  { id: 215, name: 'アートマネージメントセンター福岡', address: '福岡市中央区天神4-1-18', geocodeQuery: '福岡県福岡市中央区天神4-1-18' },
  { id: 218, name: 'ひめゆりピースホール', address: '那覇市安里388-1', geocodeQuery: '沖縄県那覇市安里388-1' },
  { id: 505, name: 'STAGE+PLUS', address: '大阪市阿倍野区松崎町2-3-5', geocodeQuery: '大阪府大阪市阿倍野区松崎町2-3-5' },
  { id: 506, name: 'イロリムラ・プチホール', address: '大阪市北区中崎1-4-15', geocodeQuery: '大阪府大阪市北区中崎1-4-15' },
  { id: 507, name: 'シアターカフェNyan', address: '大阪市西区北堀江1-2-16', geocodeQuery: '大阪府大阪市西区北堀江' },
  { id: 513, name: 'Black Boxx', address: '大阪市淀川区十三東3-28-16', geocodeQuery: '大阪府大阪市淀川区十三東3-28-16' },
  { id: 518, name: 'KYOTO ART THEATRE URU', address: '京都市右京区太秦北路町26-2', geocodeQuery: '京都市右京区太秦北路町26-2' },
  { id: 526, name: 'キーノートシアター', address: '荒川区西日暮里1-1-1', geocodeQuery: '東京都荒川区西日暮里1-1-1' },
  { id: 547, name: 'Free Studio KONPIRA', address: '大阪市中央区難波千日前4-37', geocodeQuery: '大阪府大阪市中央区難波千日前4-37' },
  { id: 548, name: 'epok', address: null, geocodeQuery: '大阪市中央区 小劇場' },
  { id: 564, name: '紀伊國屋ホール（こどもの城）', address: '渋谷区神宮前5-53-1', geocodeQuery: '東京都渋谷区神宮前5-53-1' },
  { id: 568, name: '表現者工房', address: '大阪市生野区生野東2-1-27', geocodeQuery: '大阪府大阪市生野区生野東2-1-27' },
  { id: 569, name: 'Soap opera classics', address: '大阪市北区西天満4-4-18', geocodeQuery: '大阪府大阪市北区西天満4-4-18' },
  { id: 570, name: 'SPACE LFAN', address: null, geocodeQuery: '京都市 小劇場' },
];

async function main() {
  let success = 0;
  let failed = 0;

  for (const v of venueData) {
    await sleep(1100);

    let result = await geocode(v.geocodeQuery);

    // Fallback queries
    if (!result || !isInJapan(result.lat, result.lng)) {
      if (v.address) {
        await sleep(1100);
        // Try just the address
        result = await geocode(v.address);
      }
    }

    // Another fallback: prefecture + city
    if (!result || !isInJapan(result.lat, result.lng)) {
      const cityMatch = (v.address || '').match(/^(.+?[市区町村])/);
      if (cityMatch) {
        await sleep(1100);
        result = await geocode(cityMatch[1]);
      }
    }

    if (result && isInJapan(result.lat, result.lng)) {
      const updateData = {
        latitude: result.lat,
        longitude: result.lng,
      };
      if (v.address) {
        updateData.address = v.address;
      }

      await prisma.venue.update({
        where: { id: v.id },
        data: updateData
      });

      success++;
      console.log(`OK: ${v.name} (ID ${v.id}) -> ${result.lat}, ${result.lng}${v.address ? ' addr: ' + v.address : ''}`);
    } else {
      failed++;
      console.log(`FAIL: ${v.name} (ID ${v.id})`);
    }
  }

  console.log(`\n=== Final Summary ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);

  const totalWithCoords = await prisma.venue.count({ where: { NOT: { latitude: null } } });
  const totalVenues = await prisma.venue.count();
  const noAddr = await prisma.venue.count({ where: { address: null } });
  console.log(`\nTotal venues: ${totalVenues}`);
  console.log(`With coordinates: ${totalWithCoords} (${(totalWithCoords/totalVenues*100).toFixed(1)}%)`);
  console.log(`Without coordinates: ${totalVenues - totalWithCoords}`);
  console.log(`Without address: ${noAddr}`);

  // List remaining venues without coords
  const remaining = await prisma.venue.findMany({
    where: { latitude: null },
    select: { id: true, name: true, prefecture: true, address: true }
  });
  if (remaining.length > 0) {
    console.log(`\n=== Remaining venues without coordinates ===`);
    for (const r of remaining) {
      console.log(`  ID ${r.id}: ${r.name} (${r.prefecture}) addr: ${r.address || 'NONE'}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
