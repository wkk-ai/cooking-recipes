import { mkdir, writeFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is missing");
  process.exit(1);
}

const sql = neon(url);

try {
  const rows = await sql`select * from recipes order by title asc`;
  const recipes = rows.map((row) => ({
    id: String(row.id),
    created_at:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
    title: String(row.title),
    description: String(row.description ?? ""),
    category: String(row.category),
    difficulty: String(row.difficulty),
    prep_time: Number(row.prep_time),
    cook_time: Number(row.cook_time),
    servings: row.servings == null ? 0 : Number(row.servings),
    image_url: String(row.image_url ?? ""),
    ingredients: row.ingredients ?? [],
    instructions: row.instructions ?? [],
  }));
  const target = new URL("../src/data/recipes.json", import.meta.url);
  await mkdir(new URL("../src/data/", import.meta.url), { recursive: true });
  await writeFile(target, JSON.stringify(recipes, null, 2) + "\n");
  console.log(`exported ${recipes.length} recipes`);
} catch {
  console.error("Could not export recipes");
  process.exit(1);
}
