"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Recipe } from "@/lib/types";
import { getAssetPath } from "@/lib/utils";

const categories = ["Refeições Rápidas", "Vegetariano", "Confeitaria"];

export default function HomePage() {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [categoryRecipes, setCategoryRecipes] = useState<Recipe[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch random featured recipes (up to 3)
      const { data: allRecipes } = await supabase
        .from("recipes")
        .select("*")
        .limit(20);

      if (allRecipes && allRecipes.length > 0) {
        // Shuffle and pick up to 3
        const shuffled = [...allRecipes].sort(() => Math.random() - 0.5);
        setFeaturedRecipes(shuffled.slice(0, 1));
        setCategoryRecipes(shuffled.slice(0, 6));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  async function filterByCategory(category: string) {
    setActiveCategory(category);
    const { data } = await supabase
      .from("recipes")
      .select("*")
      .ilike("category", `%${category}%`)
      .limit(6);
    if (data) setCategoryRecipes(data);
  }

  async function clearFilter() {
    setActiveCategory(null);
    const { data } = await supabase.from("recipes").select("*").limit(6);
    if (data) setCategoryRecipes(data);
  }

  const hero = featuredRecipes[0];

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12">
      {/* ─── Featured Recipe Hero (Asymmetric Layout) ─── */}
      <section className="mt-12 mb-24">
        {loading ? (
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-3/5 order-2 lg:order-1">
              <div className="w-full h-[333px] bg-surface-container-low rounded-xl animate-pulse" />
            </div>
            <div className="w-full lg:w-2/5 order-1 lg:order-2 space-y-4">
              <div className="h-4 w-32 bg-surface-container-low rounded animate-pulse" />
              <div className="h-16 w-full bg-surface-container-low rounded animate-pulse" />
              <div className="h-20 w-3/4 bg-surface-container-low rounded animate-pulse" />
            </div>
          </div>
        ) : hero ? (
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-3/5 order-2 lg:order-1 relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary-container rounded-full -z-10 opacity-40" />
              <img
                alt={hero.title}
                className="w-full h-[333px] object-cover rounded-xl shadow-sm transform lg:-rotate-2"
                src={getAssetPath(hero.image_url || "/placeholder.jpg")}
              />
              <div className="absolute bottom-6 right-6 backdrop-blur-md bg-surface/80 p-6 rounded-xl border border-outline-variant/20 hidden sm:block">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary text-sm">
                    timer
                  </span>
                  <span className="font-label text-xs uppercase tracking-widest text-secondary font-bold">
                    Preparo: {hero.prep_time} Min
                  </span>
                </div>
                <p className="font-headline text-lg italic text-on-surface">
                  &ldquo;{hero.description?.slice(0, 60)}...&rdquo;
                </p>
              </div>
            </div>
            <div className="w-full lg:w-2/5 order-1 lg:order-2">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-primary font-extrabold mb-4 block">
                Destaque da Estação
              </span>
              <h1 className="text-5xl md:text-7xl font-headline text-on-background leading-[1.1] mb-6">
                {hero.title}
              </h1>
              <p className="text-on-surface-variant font-body text-lg leading-relaxed mb-8">
                {hero.description}
              </p>
              <Link
                href={`/recipes/view?id=${hero.id}`}
                className="signature-gradient text-on-primary px-10 py-4 rounded-full font-label font-bold tracking-wide shadow-lg shadow-primary/20 hover:scale-95 transition-transform duration-150 inline-block"
              >
                Ver Receita Completa
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">
              menu_book
            </span>
            <h1 className="text-4xl font-headline text-on-background mb-4">
              Sua Cozinha te Espera
            </h1>
            <p className="text-on-surface-variant text-lg mb-8 max-w-md mx-auto">
              Comece seu arquivo culinário adicionando sua primeira receita.
            </p>
            <Link
              href="/add-new"
              className="signature-gradient text-on-primary px-10 py-4 rounded-full font-label font-bold tracking-wide shadow-lg shadow-primary/20 hover:scale-95 transition-transform duration-150 inline-block"
            >
              Adicionar Sua Primeira Receita
            </Link>
          </div>
        )}
      </section>

      {/* ─── Category Bento Tabs ─── */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-headline text-on-background mb-2">
              Capítulos da Despensa
            </h2>
            <p className="text-outline font-body">
              Navegue por intenção e preferência alimentar.
            </p>
          </div>
          <div className="flex gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  activeCategory === cat ? clearFilter() : filterByCategory(cat)
                }
                className={`px-6 py-2 rounded-full font-label text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-secondary-container text-on-secondary-container font-bold"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-secondary-container"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categoryRecipes.map((recipe, i) => (
            <Link
              href={`/recipes/view?id=${recipe.id}`}
              key={recipe.id}
              className={`group ${i === 1 ? "translate-y-8" : ""}`}
            >
              <div className="relative overflow-hidden rounded-xl mb-6 aspect-[3/2] bg-surface-container-low">
                <img
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={getAssetPath(recipe.image_url || "/placeholder.jpg")}
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-secondary-fixed/90 backdrop-blur-sm text-on-secondary-fixed px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-sm">
                      timer
                    </span>
                    <span className="font-label text-[10px] font-bold uppercase tracking-tighter">
                      {recipe.prep_time} Min
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-headline text-on-surface">
                    {recipe.title}
                  </h3>
                </div>
                <p className="text-on-surface-variant font-body text-sm line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {categoryRecipes.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-on-surface-variant font-body text-lg">
              Nenhuma receita encontrada. Comece adicionando algumas!
            </p>
          </div>
        )}
      </section>

      {/* ─── Newsletter Section ─── */}
      <section className="bg-surface-container-low rounded-xl p-12 mb-24 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="material-symbols-outlined text-primary text-4xl mb-4">
            auto_stories
          </span>
          <h2 className="text-4xl font-headline text-on-background mb-4">
            Cartas da Cozinha
          </h2>
          <p className="text-on-surface-variant font-body mb-8">
            Sua coleção pessoal de receitas, curada com cuidado e intenção.
          </p>
          <Link
            href="/add-new"
            className="bg-tertiary text-on-tertiary px-8 py-4 rounded-lg font-label font-bold hover:opacity-90 transition-opacity inline-block"
          >
            Começar Curadoria
          </Link>
        </div>
      </section>
    </div>
  );
}
