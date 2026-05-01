const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=jp`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'gikyoku-tosyokan/1.0 (theater venue geocoding fix)' }
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

function isInJapan(lat, lng) {
  return lat >= 24.0 && lat <= 46.0 && lng >= 122.0 && lng <= 154.0;
}

// Generic Osaka coords to fix
const GENERIC_LAT = 34.6937569;
const GENERIC_LNG = 135.5014539;

async function main() {
  const venues = await prisma.venue.findMany({
    where: { latitude: GENERIC_LAT, longitude: GENERIC_LNG },
    select: { id: true, name: true, prefecture: true, address: true }
  });

  console.log(`Found ${venues.length} venues with generic Osaka coordinates to fix`);

  let improved = 0;
  let unchanged = 0;

  for (const v of venues) {
    if (!v.address) {
      console.log(`SKIP: ${v.name} (ID ${v.id}) - no address`);
      unchanged++;
      continue;
    }

    const queries = [];

    // Try specific address queries
    // Extract ward (区)
    const wardMatch = v.address.match(/大阪市(.+?区)/);
    const ward = wardMatch ? wardMatch[1] : null;

    // Extract town/street
    const townMatch = v.address.match(/区(.+?)[\d０-９]/);
    const town = townMatch ? townMatch[1] : null;

    if (ward && town) {
      queries.push(`大阪市${ward}${town}`);
    }
    if (ward) {
      queries.push(`大阪市${ward}`);
    }

    let result = null;
    let usedQuery = '';

    for (const query of queries) {
      await sleep(1100);
      result = await geocode(query);
      if (result && isInJapan(result.lat, result.lng) &&
          (result.lat !== GENERIC_LAT || result.lng !== GENERIC_LNG)) {
        usedQuery = query;
        break;
      }
      result = null;
    }

    if (result) {
      await prisma.venue.update({
        where: { id: v.id },
        data: { latitude: result.lat, longitude: result.lng }
      });
      improved++;
      console.log(`IMPROVED: ${v.name} (ID ${v.id}) -> ${result.lat}, ${result.lng} (query: "${usedQuery}")`);
    } else {
      unchanged++;
      console.log(`UNCHANGED: ${v.name} (ID ${v.id}) - addr: ${v.address}`);
    }
  }

  console.log(`\nImproved: ${improved}, Unchanged: ${unchanged}`);

  // Final stats
  const totalWithCoords = await prisma.venue.count({ where: { NOT: { latitude: null } } });
  const totalVenues = await prisma.venue.count();
  const genericRemaining = await prisma.venue.count({ where: { latitude: GENERIC_LAT, longitude: GENERIC_LNG } });
  console.log(`\nTotal: ${totalVenues}, With coords: ${totalWithCoords}, Generic Osaka remaining: ${genericRemaining}`);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
