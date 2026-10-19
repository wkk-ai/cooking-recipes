import type { Ingredient, Recipe } from "@/lib/types";
import recipes from "@/data/recipes.json";

const catalog = recipes as Recipe[];
const readOnly = "Este site só mostra as receitas.";

export async function listRecipes(): Promise<Recipe[]> {
  return catalog;
}

export async function searchRecipeTitles(
  query: string
): Promise<{ id: string; title: string }[]> {
  const needle = query.toLowerCase();
  return catalog
    .filter((recipe) => recipe.title.toLowerCase().includes(needle))
    .slice(0, 5)
    .map((recipe) => ({ id: recipe.id, title: recipe.title }));
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  return catalog.find((recipe) => recipe.id === id) ?? null;
}

export async function deleteRecipe(_id: string): Promise<void> {
  throw new Error(readOnly);
}

export async function saveRecipe(
  _input: {
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
  _id?: string,
  _image?: { name: string; base64: string }
): Promise<Recipe> {
  throw new Error(readOnly);
}
