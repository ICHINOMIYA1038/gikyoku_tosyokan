import { prisma } from "../lib/prisma";
import fs from "fs";
import { parse } from "csv-parse";

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

async function seedAuthor() {
  const csvFilePath = "./prisma/author.csv";
  const csvData = await fs.promises.readFile(csvFilePath, "utf-8");
  const rows = csvData.split(/\n/);

  rows.forEach(async function (elem, index) {
    const row = elem.split(",");
    if (index != 0) {
      authors[index] = await prisma.author.create({
        data: {
          name: row[1],
          website: row[2],
          group: row[3],
          profile: row[4],
          masterpiece: row[5],
        },
      });
    }
  });
}

async function seedCategory() {
  const csvFilePath = "./prisma/category.csv";
  const data = await fs.promises.readFile(csvFilePath, "utf-8");
  const rows = data.split(/\n/);

  rows.forEach(async function (elem, index) {
    const row = elem.split(",");
    if (index != 0) {
      const categories = await prisma.category.create({
        data: {
          name: row[1],
        },
      });
    }
  });
}

async function seedPost() {
  const postcsvFilePath = "./prisma/post.csv";
  const postData = await fs.promises.readFile(postcsvFilePath, "utf-8");
  const postRows = postData.split(/\n/);

  postRows.forEach(async function (elem, index) {
    const row = elem.split(",");
    if (index != 0) {
      const post = await prisma.post.create({
        data: {
          title: row[1],
          content: "",
          man: parseInt(row[4]) || -1,
          woman: parseInt(row[5]) || -1,
          others: parseInt(row[6]) || -1,
          totalNumber: parseInt(row[7]) || -1,
          playtime: parseInt(row[8]) || -1,
          author: { connect: { id: parseInt(row[3]) } },
          synopsis: row[9],
          image_url: row[10],
          website1: row[11],
          amazon_img_url: row[14],
          amazon_text_url: row[15],
        },
      });
    }
  });
}

async function seedNews() {
  const csvFilePath = "./prisma/news.csv";
  const data = await fs.promises.readFile(csvFilePath, "utf-8");
  const rows = data.split(/\n/);

  rows.forEach(async function (elem, index) {
    const row = elem.split(",");
    if (index != 0) {
      const news = await prisma.news.create({
        data: {
          url: row[2],
          category: row[3],
          title: row[4],
        },
      });
    }
  });
}
/*
seedAuthor()
  .catch((error) => {
    console.error("Seed error:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

seedNews()
  .catch((error) => {
    console.error("Seed error:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

seedCategory()
  .catch((error) => {
    console.error("Seed error:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

seedPost()
  .catch((error) => {
    console.error("Seed error:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
*/
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
