import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminApi } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const me = await requireAdminApi(req, res);
  if (!me) return;

  if (req.method === "POST") {
    const body = req.body || {};
    const {
      kind, // "menu" | "category"
      id,
      slug,
      name,
      description,
      icon,
      order,
      categoryId,
      title,
      summary,
      content,
      imageUrl,
      images,
      tags,
      duration,
      minPeople,
      maxPeople,
      difficulty,
      published,
      aliases,
      learningObjectives,
      ageGroup,
      materials,
      spaceRequirement,
      hasPhysicalContact,
      sideCoaching,
      reflectionQuestions,
      videoUrl,
      credit,
      sourceUrl,
      relatedSlugs,
    } = body;

    if (kind === "category") {
      if (!slug || !name) return res.status(400).json({ error: "slug/name必須" });
      const cat = await prisma.theaterMenuCategory.upsert({
        where: id ? { id: Number(id) } : { slug },
        create: {
          slug,
          name,
          description: description || null,
          icon: icon || null,
          order: Number(order) || 0,
        },
        update: {
          slug,
          name,
          description: description || null,
          icon: icon || null,
          order: Number(order) || 0,
        },
      });
      return res.status(200).json({ category: cat });
    }

    if (kind === "menu") {
      if (!slug || !title || !categoryId) {
        return res.status(400).json({ error: "slug/title/categoryId必須" });
      }
      const menu = await prisma.theaterMenu.upsert({
        where: id ? { id: Number(id) } : { slug },
        create: {
          slug,
          categoryId: Number(categoryId),
          title,
          summary: summary || "",
          content: content || "",
          imageUrl: imageUrl || null,
          images: Array.isArray(images) ? images : [],
          tags: Array.isArray(tags) ? tags : [],
          duration: duration ? Number(duration) : null,
          minPeople: minPeople ? Number(minPeople) : null,
          maxPeople: maxPeople ? Number(maxPeople) : null,
          difficulty: difficulty ? Number(difficulty) : null,
          published: published !== false,
          order: Number(order) || 0,
          aliases: Array.isArray(aliases) ? aliases : [],
          learningObjectives: Array.isArray(learningObjectives) ? learningObjectives : [],
          ageGroup: ageGroup || null,
          materials: Array.isArray(materials) ? materials : [],
          spaceRequirement: spaceRequirement || null,
          hasPhysicalContact: typeof hasPhysicalContact === "boolean" ? hasPhysicalContact : null,
          sideCoaching: sideCoaching || null,
          reflectionQuestions: Array.isArray(reflectionQuestions) ? reflectionQuestions : [],
          videoUrl: videoUrl || null,
          credit: credit || null,
          sourceUrl: sourceUrl || null,
          relatedSlugs: Array.isArray(relatedSlugs) ? relatedSlugs : [],
        },
        update: {
          slug,
          categoryId: Number(categoryId),
          title,
          summary: summary || "",
          content: content || "",
          imageUrl: imageUrl || null,
          images: Array.isArray(images) ? images : [],
          tags: Array.isArray(tags) ? tags : [],
          duration: duration ? Number(duration) : null,
          minPeople: minPeople ? Number(minPeople) : null,
          maxPeople: maxPeople ? Number(maxPeople) : null,
          difficulty: difficulty ? Number(difficulty) : null,
          published: published !== false,
          order: Number(order) || 0,
          aliases: Array.isArray(aliases) ? aliases : [],
          learningObjectives: Array.isArray(learningObjectives) ? learningObjectives : [],
          ageGroup: ageGroup || null,
          materials: Array.isArray(materials) ? materials : [],
          spaceRequirement: spaceRequirement || null,
          hasPhysicalContact: typeof hasPhysicalContact === "boolean" ? hasPhysicalContact : null,
          sideCoaching: sideCoaching || null,
          reflectionQuestions: Array.isArray(reflectionQuestions) ? reflectionQuestions : [],
          videoUrl: videoUrl || null,
          credit: credit || null,
          sourceUrl: sourceUrl || null,
          relatedSlugs: Array.isArray(relatedSlugs) ? relatedSlugs : [],
        },
      });
      return res.status(200).json({ menu });
    }

    return res.status(400).json({ error: "kindが必要" });
  }

  if (req.method === "DELETE") {
    const { kind, id } = req.query;
    if (!id) return res.status(400).json({ error: "id必須" });
    if (kind === "menu") {
      await prisma.theaterMenu.delete({ where: { id: Number(id) } });
      return res.status(200).json({ ok: true });
    }
    if (kind === "category") {
      await prisma.theaterMenuCategory.delete({ where: { id: Number(id) } });
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: "kind不正" });
  }

  return res.status(405).end();
}
