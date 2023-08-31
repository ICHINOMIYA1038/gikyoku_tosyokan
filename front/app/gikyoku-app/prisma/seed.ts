import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { parse } from "csv-parse";
const prisma = new PrismaClient();
let authors: any[] = [];

async function resetData() {
  try {
    // Delete all posts
    await prisma.post.deleteMany({});

    // Delete all authors
    await prisma.author.deleteMany({});

    console.log("All data deleted successfully.");
  } catch (error) {
    console.error("Error deleting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function seed() {
  const csvFilePath = "./prisma/authorSeed.csv";
  const csvData = await fs.promises.readFile(csvFilePath, "utf-8");
  const rows = csvData.split(/\n/);

  rows.forEach(async function (elem, index) {
    const row = elem.split(",");
    if (index != 0) {
      authors[index] = await prisma.author.create({
        data: {
          id: index,
          name: row[0],
          website: row[1],
          group: row[2],
          profile: row[3],
          masterpiece: row[4],
        },
      });
    }
  });
}

async function seedPost() {
  const postcsvFilePath = "./prisma/post_seed.csv";
  const postData = await fs.promises.readFile(postcsvFilePath, "utf-8");
  const postRows = postData.split(/\n/);

  postRows.forEach(async function (elem, index) {
    const row = elem.split(",");
    if (index != 0) {
      const post = await prisma.post.create({
        data: {
          title: row[1],
          content: "",
          man: parseInt(row[2]) || -1,
          woman: parseInt(row[3]) || -1,
          others: 0,
          totalNumber: parseInt(row[4]) || -1,
          playtime: parseInt(row[5]) || -1,
          author: { connect: { id: parseInt(row[6]) } },
        },
      });
    }
  });
}
seed()
  .then(() => {
    seedPost()
      .catch((error) => {
        console.error("Seed error:", error);
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  })
  .catch((error) => {
    console.error("Seed error:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function playTimeConvertToOption(playtime: number) {
  if (playtime <= 30) {
    playtime = 0;
  } else if (playtime <= 60) {
    playtime = 1;
  } else if (playtime <= 90) {
    playtime = 1;
  } else if (playtime <= 100) {
  }
}
