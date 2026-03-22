"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Recipe } from "@/lib/types";
import DeleteModal from "@/components/DeleteModal";

const defaultCategories = [
  "Todas as Coleções",
];

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todas as Coleções");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
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
    const { id } = recipeToDelete;
    
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) {
      alert("Erro ao excluir: " + error.message);
    } else {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    }
    
    setIsDeleteModalOpen(false);
    setRecipeToDelete(null);
  };

  useEffect(() => {
    let result = recipes;

    if (activeCategory !== "Todas as Coleções") {
      result = result.filter((r) =>
        r.category?.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q)
      );
    }

    setFilteredRecipes(result);
  }, [activeCategory, searchQuery, recipes]);

  function formatTime(minutes: number): string {
    if (!minutes) return "—";
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h} HR ${m} MIN` : `${h} HR`;
    }
    return `${minutes} MIN`;
  }

  return (
    <div className="max-w-7xl mx-auto px-8 pt-12">
      {/* ─── Editorial Header ─── */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary mb-3 block">
              Coleção Pessoal
            </span>
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-on-surface leading-tight">
              Minhas Receitas
            </h1>
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
                    ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20"
                    : "bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recipe Bento Grid ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  i % 3 === 1 ? "lg:mt-12" : i % 3 === 2 ? "lg:-mt-6" : ""
                }`}
              >
                <div className="aspect-[4/5] rounded-xl bg-surface-container-high animate-pulse mb-4" />
                <div className="h-6 w-3/4 bg-surface-container-high rounded animate-pulse mb-2" />
                <div className="h-4 w-1/2 bg-surface-container-high rounded animate-pulse" />
              </div>
            ))
          : filteredRecipes.map((recipe, i) => (
              <div
                onClick={() => router.push(`/recipes/view?id=${recipe.id}`)}
                key={recipe.id}
                className={`group relative flex flex-col cursor-pointer ${
                  i % 3 === 1
                    ? "lg:mt-12"
                    : i % 3 === 2
                    ? "lg:-mt-6"
                    : ""
                }`}
              >
                <div className="aspect-[3/2] rounded-xl overflow-hidden mb-4 relative bg-surface-container-high">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    alt={recipe.title}
                    src={recipe.image_url || "/placeholder.jpg"}
                  />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-secondary text-on-secondary text-[10px] font-bold font-label uppercase tracking-widest rounded-full">
                      {formatTime(recipe.prep_time + recipe.cook_time)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline text-2xl font-bold group-hover:text-primary transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="font-label text-xs text-on-surface-variant mt-1 uppercase tracking-wider">
                      {recipe.category} • {recipe.difficulty}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === recipe.id ? null : recipe.id);
                      }}
                      className="text-outline hover:text-primary transition-colors p-1"
                    >
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>

                    {openMenuId === recipe.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-high border border-outline-variant rounded-xl shadow-2xl z-[70] overflow-hidden">
                        <Link
                          href={`/add-new?id=${recipe.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-surface-container-highest transition-colors text-sm font-label text-on-surface"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Editar
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(recipe.id, recipe.title);
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-error/5 transition-colors text-sm font-label text-error"
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
