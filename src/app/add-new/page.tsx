"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface IngredientRow {
  quantity: string;
  name: string;
}

const categoryOptions = [
  "Refeições Rápidas",
  "Vegetariano",
  "Confeitaria",
  "Cozimento Lento",
  "Pratos Principais",
  "Saladas",
  "Sobremesas",
  "Sopas",
];

const difficultyOptions = ["Fácil", "Intermediário", "Avançado"];

function AddRecipeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idValue = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [difficulty, setDifficulty] = useState(difficultyOptions[0]);
  const [prepTime, setPrepTime] = useState<number>(0);
  const [cookTime, setCookTime] = useState<number>(0);
  const [servings, setServings] = useState<number>(2);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { quantity: "", name: "" },
    { quantity: "", name: "" },
    { quantity: "", name: "" },
  ]);
  const [instructions, setInstructions] = useState<string[]>(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(!!idValue);

  useEffect(() => {
    if (idValue) {
      async function fetchRecipe() {
        const { data, error: fetchError } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", idValue)
          .single();

        if (fetchError) {
          setError(`Erro ao carregar receita: ${fetchError.message}`);
          setFetching(false);
          return;
        }

        if (data) {
          setTitle(data.title);
          setDescription(data.description || "");
          setCategory(data.category || categoryOptions[0]);
          setDifficulty(data.difficulty || difficultyOptions[0]);
          setPrepTime(data.prep_time || 0);
          setCookTime(data.cook_time || 0);
          setServings(data.servings || 2);
          setImagePreview(data.image_url);
          setIngredients(
            data.ingredients.length > 0
              ? data.ingredients
              : [{ quantity: "", name: "" }]
          );
          setInstructions(
            data.instructions.length > 0 ? data.instructions : [""]
          );
        }
        setFetching(false);
      }
      fetchRecipe();
    }
  }, [idValue]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function addIngredient() {
    setIngredients([...ingredients, { quantity: "", name: "" }]);
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function updateIngredient(
    index: number,
    field: "quantity" | "name",
    value: string
  ) {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  }

  function addInstruction() {
    setInstructions([...instructions, ""]);
  }

  function removeInstruction(index: number) {
    setInstructions(instructions.filter((_, i) => i !== index));
  }

  function updateInstruction(index: number, value: string) {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("O título da receita é obrigatório.");
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = "";

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("recipe-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          throw new Error(`Falha no upload da imagem: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("recipe-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      // Filter out empty ingredients and instructions
      const cleanIngredients = ingredients.filter(
        (i) => i.name.trim() || i.quantity.trim()
      );
      const cleanInstructions = instructions.filter((s) => s.trim());

      // Save recipe (insert or update)
      const recipeData = {
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        prep_time: prepTime,
        cook_time: cookTime,
        servings,
        image_url: imageUrl || imagePreview || "",
        ingredients: cleanIngredients,
        instructions: cleanInstructions,
      };

      let result;
      if (idValue) {
        result = await supabase
          .from("recipes")
          .update(recipeData)
          .eq("id", idValue)
          .select()
          .single();
      } else {
        result = await supabase
          .from("recipes")
          .insert(recipeData)
          .select()
          .single();
      }

      const { data, error: saveError } = result;

      if (saveError) {
        throw new Error(`Falha ao salvar a receita: ${saveError.message}`);
      }

      // Redirect to the new recipe
      router.push(`/recipes/view?id=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* ─── Header ─── */}
      <div className="mb-16">
        <h1 className="font-headline text-5xl md:text-6xl text-on-surface mb-4 leading-tight">
          {idValue ? "Refinar sua Narrativa" : "Curar uma Nova Entrada"}
        </h1>
        <p className="font-body text-secondary text-lg max-w-2xl italic">
          {idValue
            ? "Aperfeiçoe os detalhes da sua criação culinária."
            : "Compartilhe sua narrativa culinária. Foque na alma do prato e deixe os detalhes seguirem."}
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-error-container text-on-error-container rounded-xl font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* ─── Hero Grid: Image & Core Info ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Image Upload */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="group relative aspect-[4/5] bg-surface-container-highest rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-primary/40 transition-all duration-300 cursor-pointer">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <span className="material-symbols-outlined text-4xl text-outline mb-4">
                    add_a_photo
                  </span>
                  <p className="font-headline text-xl text-on-surface-variant">
                    A Alma Visual
                  </p>
                  <p className="font-label text-sm text-outline mt-2 tracking-wide uppercase">
                    Clique para fazer upload da foto do prato
                  </p>
                </div>
              )}
              <input
                className="absolute inset-0 opacity-0 cursor-pointer"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Primary Fields */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <label className="font-label text-xs font-bold tracking-[0.1em] text-secondary uppercase">
                Título da Receita
              </label>
              <input
                className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-headline text-3xl focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant/60"
                placeholder="e.g., Heirloom Tomato & Saffron Galette"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs font-bold tracking-[0.1em] text-secondary uppercase">
                Description
              </label>
              <textarea
                className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-body focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant/60 resize-none"
                placeholder="Uma breve narrativa sobre este prato..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label text-xs font-bold tracking-[0.1em] text-secondary uppercase">
                  Categoria
                </label>
                <select
                  className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-body focus:ring-2 focus:ring-primary/20"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-label text-xs font-bold tracking-[0.1em] text-secondary uppercase">
                  Dificuldade
                </label>
                <select
                  className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-body focus:ring-2 focus:ring-primary/20"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  {difficultyOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 p-6 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">
                  schedule
                </span>
                <div>
                  <p className="font-label text-[10px] font-bold tracking-widest text-outline uppercase">
                    Tempo de Preparo
                  </p>
                  <input
                    className="w-full bg-transparent border-none p-0 font-body text-on-surface focus:ring-0"
                    placeholder="20"
                    type="number"
                    min="0"
                    value={prepTime || ""}
                    onChange={(e) => setPrepTime(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">
                  restaurant
                </span>
                <div>
                  <p className="font-label text-[10px] font-bold tracking-widest text-outline uppercase">
                    Tempo de Cozimento
                  </p>
                  <input
                    className="w-full bg-transparent border-none p-0 font-body text-on-surface focus:ring-0"
                    placeholder="45"
                    type="number"
                    min="0"
                    value={cookTime || ""}
                    onChange={(e) => setCookTime(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">
                  group
                </span>
                <div>
                  <p className="font-label text-[10px] font-bold tracking-widest text-outline uppercase">
                    Porções
                  </p>
                  <input
                    className="w-full bg-transparent border-none p-0 font-body text-on-surface focus:ring-0"
                    placeholder="4"
                    type="number"
                    min="1"
                    value={servings || ""}
                    onChange={(e) => setServings(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Content Sections (Tonal Layering) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20">
          {/* Ingredients Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-baseline justify-between mb-8 border-b border-outline-variant/20 pb-4">
              <h2 className="font-headline text-3xl italic">Ingredientes</h2>
              <button
                type="button"
                onClick={addIngredient}
                className="font-label text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Adicionar Linha
              </button>
            </div>
            <div className="space-y-4">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-3 group">
                  <input
                    className="w-24 bg-surface-container-highest border-none rounded-lg p-3 font-body text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="Qtd"
                    type="text"
                    value={ing.quantity}
                    onChange={(e) =>
                      updateIngredient(i, "quantity", e.target.value)
                    }
                  />
                  <input
                    className="flex-1 bg-surface-container-highest border-none rounded-lg p-3 font-body text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="Ingrediente e Preparação"
                    type="text"
                    value={ing.name}
                    onChange={(e) =>
                      updateIngredient(i, "name", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-outline text-sm">
                      close
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Method Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-baseline justify-between mb-8 border-b border-outline-variant/20 pb-4">
              <h2 className="font-headline text-3xl italic">Modo de Preparo</h2>
              <button
                type="button"
                onClick={addInstruction}
                className="font-label text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Adicionar Passo
              </button>
            </div>
            <div className="space-y-10">
              {instructions.map((step, i) => (
                <div key={i} className="flex gap-6">
                  <span className="font-headline text-4xl text-primary/30 italic mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 space-y-2">
                    <textarea
                      className="w-full bg-transparent border-none p-0 font-body text-lg focus:ring-0 placeholder:text-outline-variant/40 resize-none"
                      placeholder={
                        i === 0
                          ? "Descreva o primeiro passo da receita..."
                          : "Continue com o próximo passo..."
                      }
                      rows={2}
                      value={step}
                      onChange={(e) => updateInstruction(i, e.target.value)}
                    />
                    <div className="h-[1px] bg-outline-variant/20 w-full" />
                  </div>
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(i)}
                      className="opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity self-start mt-2"
                    >
                      <span className="material-symbols-outlined text-outline text-sm">
                        close
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Final Actions ─── */}
        <div className="mt-24 pt-12 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/recipes")}
              className="px-8 py-3 rounded-full font-label text-xs font-bold tracking-widest text-outline uppercase border border-outline-variant/40 hover:bg-surface-container-low transition-all"
            >
              Descartar
            </button>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="group relative px-12 py-5 bg-primary text-on-primary rounded-full font-label text-sm font-bold tracking-[0.2em] uppercase overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/20 active:scale-95 disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center gap-3">
              {submitting
                ? idValue
                  ? "Atualizando..."
                  : "Publicando..."
                : idValue
                ? "Salvar Alterações"
                : "Publicar na Cozinha"}
              <span className="material-symbols-outlined text-lg">
                menu_book
              </span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddNewRecipePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <p className="text-xl font-headline animate-pulse">Carregando...</p>
        </div>
      }
    >
      <AddRecipeForm />
    </Suspense>
  );
}
