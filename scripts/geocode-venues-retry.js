const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=jp`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'gikyoku-tosyokan/1.0 (theater venue geocoding retry)' }
  });
  if (!res.ok) {
    console.error(`  HTTP ${res.status} for query: ${query}`);
    return null;
  }
  const data = await res.json();
  if (data.length === 0) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name
  };
}

function isInJapan(lat, lng) {
  return lat >= 24.0 && lat <= 46.0 && lng >= 122.0 && lng <= 154.0;
}

// Prefecture to major city mapping for fallback
const prefectureCenter = {
  '北海道': { lat: 43.0621, lng: 141.3544 },
  '青森県': { lat: 40.8244, lng: 140.7400 },
  '岩手県': { lat: 39.7036, lng: 141.1527 },
  '宮城県': { lat: 38.2688, lng: 140.8721 },
  '秋田県': { lat: 39.7186, lng: 140.1024 },
  '山形県': { lat: 38.2404, lng: 140.3634 },
  '福島県': { lat: 37.7503, lng: 140.4676 },
  '茨城県': { lat: 36.3418, lng: 140.4468 },
  '栃木県': { lat: 36.5657, lng: 139.8836 },
  '群馬県': { lat: 36.3911, lng: 139.0609 },
  '埼玉県': { lat: 35.8569, lng: 139.6489 },
  '千葉県': { lat: 35.6047, lng: 140.1233 },
  '東京都': { lat: 35.6894, lng: 139.6917 },
  '神奈川県': { lat: 35.4478, lng: 139.6425 },
  '新潟県': { lat: 37.9026, lng: 139.0236 },
  '富山県': { lat: 36.6953, lng: 137.2114 },
  '石川県': { lat: 36.5947, lng: 136.6256 },
  '福井県': { lat: 36.0652, lng: 136.2218 },
  '山梨県': { lat: 35.6642, lng: 138.5684 },
  '長野県': { lat: 36.2332, lng: 138.1813 },
  '岐阜県': { lat: 35.3912, lng: 136.7223 },
  '静岡県': { lat: 34.9769, lng: 138.3831 },
  '愛知県': { lat: 35.1802, lng: 136.9066 },
  '三重県': { lat: 34.7303, lng: 136.5086 },
  '滋賀県': { lat: 35.0045, lng: 135.8686 },
  '京都府': { lat: 35.0214, lng: 135.7556 },
  '大阪府': { lat: 34.6863, lng: 135.5200 },
  '兵庫県': { lat: 34.6913, lng: 135.1830 },
  '奈良県': { lat: 34.6851, lng: 135.8049 },
  '和歌山県': { lat: 34.2260, lng: 135.1675 },
  '鳥取県': { lat: 35.5039, lng: 134.2378 },
  '島根県': { lat: 35.4723, lng: 133.0505 },
  '岡山県': { lat: 34.6618, lng: 133.9344 },
  '広島県': { lat: 34.3963, lng: 132.4596 },
  '山口県': { lat: 34.1861, lng: 131.4706 },
  '徳島県': { lat: 34.0658, lng: 134.5593 },
  '香川県': { lat: 34.3401, lng: 134.0434 },
  '愛媛県': { lat: 33.8416, lng: 132.7657 },
  '高知県': { lat: 33.5597, lng: 133.5311 },
  '福岡県': { lat: 33.6064, lng: 130.4183 },
  '佐賀県': { lat: 33.2494, lng: 130.2988 },
  '長崎県': { lat: 32.7448, lng: 129.8737 },
  '熊本県': { lat: 32.7898, lng: 130.7417 },
  '大分県': { lat: 33.2382, lng: 131.6126 },
  '宮崎県': { lat: 31.9111, lng: 131.4239 },
  '鹿児島県': { lat: 31.5602, lng: 130.5581 },
  '沖縄県': { lat: 26.2124, lng: 127.6809 },
};

// Clean venue name for better search
function cleanName(name) {
  // Remove parenthetical aliases
  let clean = name.replace(/（[^）]*）/g, '').replace(/\([^)]*\)/g, '').trim();
  // Remove room/hall suffixes that confuse search
  clean = clean.replace(/\s*(小ホール|大ホール|中ホール|小劇場|大劇場)$/, '').trim();
  return clean;
}

// Extract city name from address
function extractCity(address) {
  if (!address) return null;
  // Match city/ward/town patterns
  const match = address.match(/^(.+?[市区町村郡])/);
  return match ? match[1] : null;
}

async function main() {
  const venues = await prisma.venue.findMany({
    where: { latitude: null },
    select: { id: true, name: true, prefecture: true, address: true },
    orderBy: { id: 'asc' }
  });

  console.log(`Found ${venues.length} venues to retry`);

  let success = 0;
  let failed = 0;
  const failedVenues = [];

  for (let i = 0; i < venues.length; i++) {
    const v = venues[i];
    const progress = `[${i + 1}/${venues.length}]`;
    const cleanedName = cleanName(v.name);

    const queries = [];

    if (v.address) {
      // Strategy 1: Prefecture + address (structured)
      queries.push(`${v.prefecture}${v.address}`);
      // Strategy 2: Just the address with Japan
      queries.push(`${v.address} 日本`);
      // Strategy 3: City from address + venue name
      const city = extractCity(v.address);
      if (city) {
        queries.push(`${city} ${cleanedName}`);
        // Strategy 4: Just city + prefecture (fallback to area)
        queries.push(`${v.prefecture} ${city}`);
      }
    }

    // Strategy 5: Cleaned name + prefecture
    if (cleanedName !== v.name) {
      queries.push(`${cleanedName} ${v.prefecture} 日本`);
    }

    // Strategy 6: Remove English/special chars, search Japanese only
    const japaneseOnly = v.name.replace(/[a-zA-Z0-9&・\-\s]/g, '').trim();
    if (japaneseOnly && japaneseOnly !== v.name && japaneseOnly.length >= 2) {
      queries.push(`${japaneseOnly} ${v.prefecture}`);
    }

    let result = null;
    let usedQuery = '';

    for (const query of queries) {
      await sleep(1100);
      result = await geocode(query);

      if (result && isInJapan(result.lat, result.lng)) {
        usedQuery = query;
        break;
      }
      result = null;
    }

    if (result) {
      await prisma.venue.update({
        where: { id: v.id },
        data: {
          latitude: result.lat,
          longitude: result.lng
        }
      });

      success++;
      console.log(`${progress} OK: ${v.name} -> ${result.lat}, ${result.lng} (query: "${usedQuery}")`);
    } else {
      // Use prefecture center as last resort? No - wrong coords are worse than none
      failed++;
      failedVenues.push({ id: v.id, name: v.name, prefecture: v.prefecture, address: v.address });
      console.log(`${progress} FAIL: ${v.name} (${v.prefecture})`);
    }
  }

  console.log(`\n=== Retry Summary ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);

  if (failedVenues.length > 0) {
    console.log(`\n=== Still Failed Venues ===`);
    for (const v of failedVenues) {
      console.log(`  ID ${v.id}: ${v.name} (${v.prefecture}) addr: ${v.address || 'NONE'}`);
    }
  }

  // Final stats
  const totalWithCoords = await prisma.venue.count({ where: { NOT: { latitude: null } } });
  const totalVenues = await prisma.venue.count();
  console.log(`\n=== Overall Stats ===`);
  console.log(`Total venues: ${totalVenues}`);
  console.log(`With coordinates: ${totalWithCoords} (${(totalWithCoords/totalVenues*100).toFixed(1)}%)`);
  console.log(`Without coordinates: ${totalVenues - totalWithCoords}`);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
