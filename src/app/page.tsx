"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Recipe } from "@/lib/types";
import DeleteModal from "@/components/DeleteModal";
import { getAssetPath } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todas as Coleções");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["Todas as Coleções"]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<{id: string, title: string} | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      const { data } = await supabase
        .from("recipes")
        .select("*")
        .order("title", { ascending: true });
        
      if (data) {
        setRecipes(data);
        setFilteredRecipes(data);

        // Generate dynamic categories
        const counts: Record<string, number> = {};
        data.forEach((r) => {
          if (r.category) {
            counts[r.category] = (counts[r.category] || 0) + 1;
          }
        });

        const sortedCats = Object.entries(counts)
          .filter(([_, count]) => count > 0)
          .sort((a, b) => b[1] - a[1])
          .map(([name]) => name);

        setCategories(["Todas as Coleções", ...sortedCats]);
        
        // Pick one featured recipe (e.g. random or latest)
        if (data.length > 0) {
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setFeaturedRecipes(shuffled.slice(0, 1));
        }
      }
      setLoading(false);
    }
    fetchRecipes();
  }, []);

  const handleDelete = (id: string, title: string) => {
    setRecipeToDelete({ id, title });
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!recipeToDelete) return;
    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeToDelete.id);
      
      if (error) {
        console.error("Error deleting recipe:", error);
        alert("Falha ao deletar receita.");
      } else {
        setRecipes(recipes.filter(r => r.id !== recipeToDelete.id));
        setFilteredRecipes(filteredRecipes.filter(r => r.id !== recipeToDelete.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleteModalOpen(false);
      setRecipeToDelete(null);
    }
  };

  useEffect(() => {
    let result = recipes;

    if (activeCategory !== "Todas as Coleções") {
      result = result.filter(
        (recipe) =>
          recipe.category &&
          recipe.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim() !== "") {
      result = result.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRecipes(result);
  }, [activeCategory, searchQuery, recipes]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const hero = featuredRecipes[0];

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12">
      {/* ─── Featured Recipe Hero ─── */}
      <section className="mt-12 mb-24">
        {loading ? (
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-3/5 order-2 lg:order-1">
              <div className="h-4 bg-outline-variant/30 rounded w-1/4 mb-4 animate-pulse"></div>
              <div className="h-12 bg-outline-variant/30 rounded w-3/4 mb-6 animate-pulse"></div>
              <div className="h-20 bg-outline-variant/30 rounded w-full mb-8 animate-pulse"></div>
            </div>
            <div className="w-full lg:w-2/5 order-1 lg:order-2">
              <div className="w-full h-[333px] bg-outline-variant/30 rounded-xl animate-pulse"></div>
            </div>
          </div>
        ) : hero ? (
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-3/5 order-2 lg:order-1 relative z-10">
              <span className="font-label text-sm uppercase tracking-[0.2em] text-secondary mb-4 block font-bold">
                Destaque da Estação
              </span>
              <h1 className="text-6xl sm:text-7xl font-headline text-on-background mb-6 leading-tight">
                {hero.title}
              </h1>
              <p className="text-on-surface-variant text-xl mb-10 leading-relaxed font-body max-w-2xl">
                {hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 hidden sm:flex">
                <Link
                  href={`/recipes/view?id=${hero.id}`}
                  className="bg-primary hover:bg-primary/90 text-on-primary px-8 py-4 rounded-full font-label font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-center"
                >
                  Ver Receita Completa
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-2/5 order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-secondary/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
              <img
                alt={hero.title}
                className="w-full h-[333px] object-cover rounded-xl shadow-sm transform lg:-rotate-2 relative z-10"
                src={getAssetPath(hero.image_url || "/placeholder.jpg")}
              />
            </div>
          </div>
        ) : null}
      </section>

      {/* ─── Editorial Header for Receitas ─── */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-headline text-5xl md:text-6xl font-bold text-on-surface leading-tight">
              Receitas
            </h2>
            <p className="mt-4 text-on-surface-variant text-lg max-w-lg leading-relaxed">
              Um arquivo curado de suas jornadas culinárias, desde segredos de família até experimentos modernos da despensa.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/add-new"
              className="flex items-center gap-2 px-8 py-3 signature-gradient text-on-primary rounded-full font-label text-sm font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Nova Receita
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Search & Category Ribbon ─── */}
      <section className="mb-12">
        <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative w-full lg:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
              placeholder="Pesquisar em sua biblioteca..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="h-8 w-px bg-outline-variant hidden lg:block mx-2" />
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-semibold font-label transition-colors ${
                  activeCategory === cat
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface hover:bg-surface-container-highest"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recipe Grid ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 mb-24">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[3/2] bg-surface-container-high rounded-xl mb-4"></div>
                <div className="h-6 bg-surface-container-high rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-surface-container-high rounded w-1/2"></div>
              </div>
            ))
          : filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="group relative">
                <Link href={`/recipes/view?id=${recipe.id}`}>
                  <div className="relative overflow-hidden rounded-xl aspect-[3/2] bg-surface-container-low mb-4">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      alt={recipe.title}
                      src={getAssetPath(recipe.image_url || "/placeholder.jpg")}
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-secondary text-on-secondary text-[10px] font-bold font-label uppercase tracking-widest rounded-full">
                        {(recipe.prep_time || 0) + (recipe.cook_time || 0)} Min
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/recipes/view?id=${recipe.id}`}>
                      <h3 className="font-headline text-xl text-on-surface mb-1 group-hover:text-primary transition-colors">
                        {recipe.title}
                      </h3>
                      {recipe.category && (
                        <p className="text-sm font-label text-outline uppercase tracking-wider">
                          {recipe.category}
                        </p>
                      )}
                    </Link>
                  </div>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === recipe.id ? null : recipe.id!);
                      }}
                      className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>

                    {openMenuId === recipe.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-surface-container-highest rounded-xl shadow-lg border border-outline-variant/30 py-2 z-20">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-outline-variant/20 flex items-center gap-2 text-on-surface font-label text-sm transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/add-new?edit=${recipe.id}`);
                          }}
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Editar
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-error/10 text-error flex items-center gap-2 font-label text-sm transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (recipe.id) {
                              handleDelete(recipe.id, recipe.title);
                            }
                          }}
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
      </section>

      {filteredRecipes.length === 0 && !loading && (
        <div className="text-center py-16 mb-12">
          <span className="material-symbols-outlined text-5xl text-outline mb-4">
            search_off
          </span>
          <p className="text-on-surface-variant font-body text-lg">
            Nenhuma receita corresponde à sua pesquisa. Tente ajustar os filtros.
          </p>
        </div>
      )}

      {recipeToDelete && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          title={recipeToDelete.title}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
