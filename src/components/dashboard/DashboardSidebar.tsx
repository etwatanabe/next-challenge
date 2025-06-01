"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function DashboardSidebar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Verifica se o link está ativo
  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  return (
    <>
      {/* Overlay para dispositivos móveis */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Botão mobile para abrir sidebar */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 md:hidden z-30 btn btn-primary btn-sm"
        aria-label="Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-[var(--card)] border-r border-[var(--border)]
          transition-all duration-300 ease-in-out w-64
          ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 w-64"
        `}
      >
        {/* Cabeçalho da sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border)]">
          <div className="flex items-center overflow-hidden">
            <span className="font-bold truncate text-xl">Seller Dashboard</span>
          </div>

          {/* Botão para fechar sidebar (apenas mobile) */}
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden btn btn-ghost btn-sm p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Conteúdo da sidebar */}
        <div className="flex flex-col h-[calc(100vh-64px)] justify-between">
          {/* Links de navegação */}
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard/products"
                  className={`
                    flex items-center px-3 py-2 rounded-md transition-colors
                    ${
                      isActive("/dashboard/products")
                        ? "bg-[var(--primary)] text-white"
                        : "hover:bg-[rgba(0,0,0,0.05)]"
                    }
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                    <path d="M7 7h.01" />
                  </svg>
                  <span className="ml-3">Produtos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/orders"
                  className={`
                    flex items-center px-3 py-2 rounded-md transition-colors
                    ${
                      isActive("/dashboard/orders")
                        ? "bg-[var(--primary)] text-white"
                        : "hover:bg-[rgba(0,0,0,0.05)]"
                    }
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                    <path d="M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z" />
                  </svg>
                  <span className="ml-3">Pedidos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/payments"
                  className={`
                    flex items-center px-3 py-2 rounded-md transition-colors
                    ${
                      isActive("/dashboard/payments")
                        ? "bg-[var(--primary)] text-white"
                        : "hover:bg-[rgba(0,0,0,0.05)]"
                    }
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="1"
                      y="4"
                      width="22"
                      height="16"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <span className="ml-3">Pagamentos</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Perfil do usuário e logout */}
          <div className="p-4 border-t border-[var(--border)]">
            <div className="mb-2 px-3 py-2">
              <p className="text-sm text-muted truncate">
                Olá, {session?.user?.name || "Usuário"}
              </p>
              <p className="text-xs text-muted truncate">
                {session?.user?.email}
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={`
                flex items-center px-3 py-2 w-full rounded-md
                text-[var(--error)] hover:bg-[rgba(239,68,68,0.1)] transition-colors
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="ml-3">Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
