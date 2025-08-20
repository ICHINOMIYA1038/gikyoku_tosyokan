import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

interface TimingResult {
  step: string;
  duration: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const timings: TimingResult[] = [];
  const totalStart = Date.now();
  
  console.log("\n=== Performance Test Starting ===");
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database URL: ${process.env.POSTGRES_PRISMA_URL?.substring(0, 30)}...`);
  
  try {
    // 1. Simple connectivity test
    const connectStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const connectTime = Date.now() - connectStart;
    timings.push({ step: "simple_connection", duration: connectTime });
    console.log(`[1] Simple connection test: ${connectTime}ms`);
    
    // 2. Count query test
    const countStart = Date.now();
    const postCount = await prisma.post.count();
    const countTime = Date.now() - countStart;
    timings.push({ step: "count_posts", duration: countTime });
    console.log(`[2] Count posts (${postCount} records): ${countTime}ms`);
    
    // 3. Simple findFirst test
    const findFirstStart = Date.now();
    const firstPost = await prisma.post.findFirst();
    const findFirstTime = Date.now() - findFirstStart;
    timings.push({ step: "find_first_post", duration: findFirstTime });
    console.log(`[3] Find first post: ${findFirstTime}ms`);
    
    // 4. Complex query with relations
    const complexStart = Date.now();
    const complexPost = await prisma.post.findFirst({
      include: {
        author: true,
        categories: true,
      }
    });
    const complexTime = Date.now() - complexStart;
    timings.push({ step: "complex_query", duration: complexTime });
    console.log(`[4] Complex query with relations: ${complexTime}ms`);
    
    // 5. Multiple simple queries
    const multiStart = Date.now();
    await Promise.all([
      prisma.author.count(),
      prisma.category.count(),
      prisma.post.count(),
    ]);
    const multiTime = Date.now() - multiStart;
    timings.push({ step: "parallel_counts", duration: multiTime });
    console.log(`[5] Parallel count queries: ${multiTime}ms`);
    
    // 6. Test with select optimization
    const selectStart = Date.now();
    const optimizedPosts = await prisma.post.findMany({
      take: 10,
      select: {
        id: true,
        title: true,
        playtime: true,
      }
    });
    const selectTime = Date.now() - selectStart;
    timings.push({ step: "optimized_select", duration: selectTime });
    console.log(`[6] Optimized select (10 posts): ${selectTime}ms`);
    
    const totalTime = Date.now() - totalStart;
    console.log(`\nTotal execution time: ${totalTime}ms`);
    console.log("=== Performance Test Complete ===\n");
    
    res.status(200).json({
      status: "success",
      totalTime,
      timings,
      summary: {
        avgQueryTime: Math.round(timings.reduce((acc, t) => acc + t.duration, 0) / timings.length),
        slowestQuery: timings.reduce((max, t) => t.duration > max.duration ? t : max),
        fastestQuery: timings.reduce((min, t) => t.duration < min.duration ? t : min),
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelRegion: process.env.VERCEL_REGION || "unknown",
        functionRegion: process.env.AWS_REGION || "unknown",
      }
    });
  } catch (error) {
    console.error("Performance test error:", error);
    res.status(500).json({ 
      error: "Performance test failed",
      message: error instanceof Error ? error.message : "Unknown error",
      timings,
    });
  }
}