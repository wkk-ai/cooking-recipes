import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-20 bg-surface-container-low">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 py-10 gap-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="font-headline text-xl text-primary">
            Receitas Sawill
          </Link>
          <p className="font-body text-sm tracking-wide text-outline">
            © 2024 Receitas Sawill. Criado com intenção.
          </p>
        </div>
        <div className="flex gap-8 font-body text-sm tracking-wide">
          <a
            href="#"
            className="text-outline hover:text-secondary transition-opacity"
          >
            Sobre Nossa Cozinha
          </a>
          <a
            href="#"
            className="text-outline hover:text-secondary transition-opacity"
          >
            Política de Privacidade
          </a>
          <a
            href="#"
            className="text-outline hover:text-secondary transition-opacity"
          >
            Termos de Serviço
          </a>
          <a
            href="#"
            className="text-outline hover:text-secondary transition-opacity"
          >
            Contato
          </a>
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-outline">
            potted_plant
          </span>
          <span className="material-symbols-outlined text-outline">
            restaurant
          </span>
        </div>
      </div>
    </footer>
  );
}
