const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=jp`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'gikyoku-tosyokan/1.0 (theater venue geocoding cluster fix)' }
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

function isInJapan(lat, lng) {
  return lat >= 24.0 && lat <= 46.0 && lng >= 122.0 && lng <= 154.0;
}

async function main() {
  // Find all coordinate clusters with > 2 venues sharing exact same coords
  const clusters = await prisma.$queryRaw`
    SELECT latitude, longitude, COUNT(*) as cnt
    FROM "Venue"
    WHERE latitude IS NOT NULL AND address IS NOT NULL
    GROUP BY latitude, longitude
    HAVING COUNT(*) > 2
    ORDER BY cnt DESC
  `;

  console.log(`Found ${clusters.length} clusters to fix`);

  let totalImproved = 0;
  let totalUnchanged = 0;
  // Cache: avoid re-querying the same address prefix
  const queryCache = new Map();

  for (const cluster of clusters) {
    const venues = await prisma.venue.findMany({
      where: { latitude: cluster.latitude, longitude: cluster.longitude, address: { not: null } },
      select: { id: true, name: true, address: true, prefecture: true }
    });

    console.log(`\nCluster at ${cluster.latitude}, ${cluster.longitude} (${venues.length} venues):`);

    for (const v of venues) {
      // Extract town/street from address for more precise geocoding
      // Address format: "区名町名1-2-3" or "市名区名町名1-2-3"
      let townQuery = null;

      // Try to build prefecture + full address query
      const prefPrefix = v.prefecture.replace(/[都府県]$/, '');

      // Extract up to town level (before numbers)
      const townMatch = v.address.match(/^(.+?)[\d０-９]/);
      const town = townMatch ? townMatch[1].trim() : v.address;

      // Build the query: prefecture + town
      townQuery = `${v.prefecture}${town}`;

      // Check cache
      if (queryCache.has(townQuery)) {
        const cached = queryCache.get(townQuery);
        if (cached && (cached.lat !== cluster.latitude || cached.lng !== cluster.longitude)) {
          await prisma.venue.update({
            where: { id: v.id },
            data: { latitude: cached.lat, longitude: cached.lng }
          });
          totalImproved++;
          console.log(`  CACHED: ${v.name} -> ${cached.lat}, ${cached.lng}`);
        } else {
          totalUnchanged++;
          console.log(`  SKIP(cached): ${v.name}`);
        }
        continue;
      }

      await sleep(1100);
      const result = await geocode(townQuery);

      if (result && isInJapan(result.lat, result.lng) &&
          (result.lat !== cluster.latitude || result.lng !== cluster.longitude)) {
        queryCache.set(townQuery, result);
        await prisma.venue.update({
          where: { id: v.id },
          data: { latitude: result.lat, longitude: result.lng }
        });
        totalImproved++;
        console.log(`  IMPROVED: ${v.name} -> ${result.lat}, ${result.lng} (${townQuery})`);
      } else {
        queryCache.set(townQuery, null);
        totalUnchanged++;
        console.log(`  UNCHANGED: ${v.name} (${townQuery})`);
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Improved: ${totalImproved}`);
  console.log(`Unchanged: ${totalUnchanged}`);

  // Check remaining clusters
  const remainingClusters = await prisma.$queryRaw`
    SELECT latitude, longitude, COUNT(*) as cnt
    FROM "Venue"
    WHERE latitude IS NOT NULL
    GROUP BY latitude, longitude
    HAVING COUNT(*) > 3
    ORDER BY cnt DESC
    LIMIT 5
  `;
  console.log('\nRemaining large clusters:');
  for (const c of remainingClusters) {
    console.log(`  ${c.latitude}, ${c.longitude} - ${c.cnt} venues`);
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
