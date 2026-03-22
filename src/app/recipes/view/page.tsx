"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Recipe } from "@/lib/types";
import DeleteModal from "@/components/DeleteModal";

function RecipeDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    async function fetchRecipe() {
      const { data } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setRecipe(data);
      setLoading(false);
    }
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (error) {
      alert("Erro ao excluir a receita: " + error.message);
    } else {
      router.push("/recipes");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-5 space-y-4">
            <div className="h-8 w-32 bg-surface-container-low rounded-full animate-pulse" />
            <div className="h-16 w-full bg-surface-container-low rounded animate-pulse" />
            <div className="h-24 w-3/4 bg-surface-container-low rounded animate-pulse" />
          </div>
          <div className="lg:col-span-7">
            <div className="h-[350px] bg-surface-container-low rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 text-center">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">
          error_outline
        </span>
        <h1 className="text-3xl font-headline mb-4">Receita Não Encontrada</h1>
        <p className="text-on-surface-variant mb-8">
          Esta receita pode ter sido removida ou o link está incorreto.
        </p>
        <Link
          href="/recipes"
          className="signature-gradient text-on-primary px-8 py-3 rounded-full font-label font-bold inline-block"
        >
          Voltar para a Biblioteca
        </Link>
      </div>
    );
  }

  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : [];
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : [];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      {/* ─── Hero Section: Asymmetric Layout ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-xs uppercase tracking-widest font-bold">
              {recipe.category || "Sem Categoria"}
            </span>
            <h1 className="font-headline text-5xl lg:text-7xl leading-tight text-on-surface">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-lg text-on-surface-variant max-w-md font-headline italic">
                {recipe.description}
              </p>
            )}
            <div className="flex flex-wrap gap-6 pt-4">
              {recipe.prep_time > 0 && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">
                    schedule
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-outline font-bold">
                      Tempo de Preparo
                    </p>
                    <p className="font-bold text-on-surface">
                      {recipe.prep_time} min
                    </p>
                  </div>
                </div>
              )}
              {recipe.cook_time > 0 && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">
                    oven_gen
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-outline font-bold">
                      Tempo de Cozimento
                    </p>
                    <p className="font-bold text-on-surface">
                      {recipe.cook_time} min
                    </p>
                  </div>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">
                    bar_chart
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-outline font-bold">
                      Dificuldade
                    </p>
                    <p className="font-bold text-on-surface">
                      {recipe.difficulty}
                    </p>
                  </div>
                </div>
              )}
              {recipe.servings > 0 && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">
                    group
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-outline font-bold">
                      Porções
                    </p>
                    <p className="font-bold text-on-surface">
                      {recipe.servings} Porções
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 flex flex-wrap gap-4">
              <Link
                href={`/add-new?id=${recipe.id}`}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-outline-variant/50 hover:bg-surface-container-low transition-colors font-label text-xs font-bold tracking-widest text-primary uppercase"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Editar Receita
              </Link>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-error/30 hover:bg-error/5 transition-colors font-label text-xs font-bold tracking-widest text-error uppercase"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Deletar Receita
              </button>
            </div>
            <DeleteModal
              isOpen={isDeleteModalOpen}
              title={recipe.title}
              onConfirm={handleDelete}
              onCancel={() => setIsDeleteModalOpen(false)}
            />
          </div>
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-full h-full bg-surface-container-highest rounded-xl -z-10 translate-x-4 translate-y-4" />
            {recipe.image_url ? (
              <img
                alt={recipe.title}
                className="w-full h-[350px] object-cover rounded-xl shadow-xl"
                src={recipe.image_url}
              />
            ) : (
              <div className="w-full h-[350px] bg-surface-container-high rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-outline">
                  restaurant
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Main Recipe Content ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar: Ingredients */}
        <aside className="lg:col-span-4">
          <div className="bg-surface-container-low p-8 rounded-xl sticky top-32">
            <h2 className="font-headline text-3xl mb-8 border-b border-outline-variant/20 pb-4">
              Ingredientes
            </h2>
            {ingredients.length > 0 ? (
              <ul className="space-y-6">
                {ingredients.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between group"
                  >
                    <span className="text-on-surface-variant group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                    <span className="font-bold text-secondary ml-4 shrink-0">
                      {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-on-surface-variant italic">
                Nenhum ingrediente listado.
              </p>
            )}
          </div>
        </aside>

        {/* Instructions */}
        <div className="lg:col-span-8 space-y-16">
          <section>
            <h2 className="font-headline text-4xl mb-12">Modo de Preparo</h2>
            {instructions.length > 0 ? (
              <div className="space-y-12">
                {instructions.map((step, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="flex-shrink-0">
                      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-on-primary font-headline text-xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <p className="text-on-surface-variant leading-relaxed text-lg">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant italic text-lg">
                Nenhuma instrução fornecida.
              </p>
            )}
          </section>

          {/* Back link */}
          <div className="border-t border-outline-variant/30 pt-12">
            <Link
              href="/recipes"
              className="text-primary font-bold flex items-center gap-2 hover:underline"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Voltar para a Biblioteca
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecipeViewPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="h-[500px] bg-surface-container-low rounded-xl animate-pulse" />
        </div>
      }
    >
      <RecipeDetailContent />
    </Suspense>
  );
}
