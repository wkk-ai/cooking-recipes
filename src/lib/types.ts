export interface Ingredient {
  quantity: string;
  name: string;
}

export interface Recipe {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url: string;
  ingredients: Ingredient[];
  instructions: string[];
}
