"use server";

import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getSql } from "@/lib/db";
import type { Ingredient, Recipe } from "@/lib/types";

type RecipeRow = Record<string, unknown>;

function asRecipe(row: RecipeRow): Recipe {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    title: String(row.title),
    description: String(row.description ?? ""),
    category: String(row.category),
    difficulty: String(row.difficulty),
    prep_time: Number(row.prep_time),
    cook_time: Number(row.cook_time),
    servings: row.servings == null ? 0 : Number(row.servings),
    image_url: String(row.image_url ?? ""),
    ingredients: (row.ingredients as Ingredient[]) ?? [],
    instructions: (row.instructions as string[]) ?? [],
  };
}

export async function listRecipes(): Promise<Recipe[]> {
  const sql = getSql();
  const rows = await sql`select * from recipes order by title asc`;
  return rows.map((row) => asRecipe(row));
}

export async function searchRecipeTitles(
  query: string
): Promise<{ id: string; title: string }[]> {
  const sql = getSql();
  const rows = await sql`
    select id, title from recipes
    where title ilike ${"%" + query + "%"}
    order by title asc
    limit 5
  `;
  return rows.map((row) => ({ id: String(row.id), title: String(row.title) }));
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const sql = getSql();
  const rows = await sql`select * from recipes where id = ${id} limit 1`;
  const row = rows[0];
  return row ? asRecipe(row) : null;
}

export async function deleteRecipe(id: string): Promise<void> {
  const sql = getSql();
  await sql`delete from recipes where id = ${id}`;
}

export async function saveRecipe(
  input: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    prep_time: number;
    cook_time: number;
    servings: number | null;
    image_url: string;
    ingredients: Ingredient[];
    instructions: string[];
  },
  id?: string,
  image?: { name: string; base64: string }
): Promise<Recipe> {
  let imageUrl = input.image_url.startsWith("blob:") ? "" : input.image_url;

  if (image?.base64) {
    const ext = path.extname(image.name).toLowerCase();
    const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
    const safeExt = allowed.includes(ext) ? ext : ".jpg";
    const fileName = `${Date.now()}-${randomBytes(4).toString("hex")}${safeExt}`;
    const dir = path.join(process.cwd(), "public", "images", "recipes");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, fileName), Buffer.from(image.base64, "base64"));
    imageUrl = `/images/recipes/${fileName}`;
  }

  const sql = getSql();
  const ingredients = JSON.stringify(input.ingredients);
  const instructions = JSON.stringify(input.instructions);

  if (id) {
    const rows = await sql`
      update recipes set
        title = ${input.title},
        description = ${input.description},
        category = ${input.category},
        difficulty = ${input.difficulty},
        prep_time = ${input.prep_time},
        cook_time = ${input.cook_time},
        servings = ${input.servings},
        image_url = ${imageUrl},
        ingredients = ${ingredients}::jsonb,
        instructions = ${instructions}::jsonb
      where id = ${id}
      returning *
    `;
    if (!rows[0]) {
      throw new Error("Receita não encontrada");
    }
    return asRecipe(rows[0]);
  }

  const rows = await sql`
    insert into recipes (
      title, description, category, difficulty, prep_time, cook_time,
      servings, image_url, ingredients, instructions
    ) values (
      ${input.title}, ${input.description}, ${input.category}, ${input.difficulty},
      ${input.prep_time}, ${input.cook_time}, ${input.servings}, ${imageUrl},
      ${ingredients}::jsonb, ${instructions}::jsonb
    )
    returning *
  `;
  return asRecipe(rows[0]);
}
