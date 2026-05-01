const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=jp`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'gikyoku-tosyokan/1.0 (theater venue geocoding)' }
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

// Validate coordinates are within Japan bounds
function isInJapan(lat, lng) {
  return lat >= 24.0 && lat <= 46.0 && lng >= 122.0 && lng <= 154.0;
}

async function main() {
  const venues = await prisma.venue.findMany({
    where: { latitude: null },
    select: { id: true, name: true, prefecture: true, address: true },
    orderBy: { id: 'asc' }
  });

  console.log(`Found ${venues.length} venues to geocode`);

  let success = 0;
  let failed = 0;
  let skipped = 0;
  const failedVenues = [];

  for (let i = 0; i < venues.length; i++) {
    const v = venues[i];
    const progress = `[${i + 1}/${venues.length}]`;

    // Try multiple search strategies
    const queries = [];

    if (v.address) {
      // Strategy 1: Full address
      queries.push(v.address);
      // Strategy 2: Address + venue name
      queries.push(`${v.name} ${v.address}`);
      // Strategy 3: Address without building details (remove after numbers)
      const simpleAddr = v.address.replace(/[\s　].*$/, '');
      if (simpleAddr !== v.address) {
        queries.push(simpleAddr);
      }
    }

    // Strategy 4: Venue name + prefecture
    queries.push(`${v.name} ${v.prefecture} 日本`);
    // Strategy 5: Just venue name + Japan
    queries.push(`${v.name} 日本`);

    let result = null;
    let usedQuery = '';

    for (const query of queries) {
      await sleep(1100); // Respect rate limit
      result = await geocode(query);

      if (result && isInJapan(result.lat, result.lng)) {
        usedQuery = query;
        break;
      }
      result = null;
    }

    if (result) {
      const updateData = {
        latitude: result.lat,
        longitude: result.lng
      };

      await prisma.venue.update({
        where: { id: v.id },
        data: updateData
      });

      success++;
      console.log(`${progress} OK: ${v.name} -> ${result.lat}, ${result.lng}`);
    } else {
      failed++;
      failedVenues.push({ id: v.id, name: v.name, prefecture: v.prefecture, address: v.address });
      console.log(`${progress} FAIL: ${v.name} (${v.prefecture})`);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped: ${skipped}`);

  if (failedVenues.length > 0) {
    console.log(`\n=== Failed Venues ===`);
    for (const v of failedVenues) {
      console.log(`  ID ${v.id}: ${v.name} (${v.prefecture}) addr: ${v.address || 'NONE'}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
