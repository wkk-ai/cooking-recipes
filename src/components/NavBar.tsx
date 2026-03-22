"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface RecipeSuggestion {
  id: string;
  title: string;
}

const navLinks = [
  { href: "/", label: "Receitas" },
  { href: "/add-new", label: "Adicionar Receita" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const fetchSuggestions = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("id, title")
        .ilike("title", `%${searchQuery}%`)
        .limit(5);

      if (!error && data) {
        setSuggestions(data);
        setIsDropdownOpen(data.length > 0);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (id: string) => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    router.push(`/recipes/view?id=${id}`);
  };

  return (
    <header className="w-full top-0 sticky z-50 bg-background">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-headline italic text-primary"
        >
          Receitas Sawill
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-headline text-lg">
          {navLinks.map((link) => {
            const normalizedPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
            const isActive = normalizedPath === link.href || (link.href === "/" && normalizedPath.startsWith("/recipes"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-on-surface-variant font-medium hover:text-primary transition-colors duration-300"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <div className="flex items-center bg-surface-container-highest px-4 py-2 rounded-full min-w-[200px] md:min-w-[300px]">
            <span className="material-symbols-outlined text-outline text-sm">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm font-body px-2 w-full text-on-surface placeholder:text-outline"
              placeholder="Pesquisar receitas..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setIsDropdownOpen(true)}
            />
          </div>

          {/* Search Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant rounded-xl shadow-2xl overflow-hidden z-[60]">
              {suggestions.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => handleSuggestionClick(recipe.id)}
                  className="w-full text-left px-6 py-4 hover:bg-surface-container-highest transition-colors flex items-center gap-3 group"
                >
                  <span className="material-symbols-outlined text-outline group-hover:text-primary text-sm">
                    restaurant
                  </span>
                  <span className="text-on-surface font-body text-sm">
                    {recipe.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
