import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register | Seller Dashboard",
  description: "Create your seller account",
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="card max-w-md w-full mx-auto my-8">
        <div className="card-content">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Criar Conta</h2>
            <p className="text-muted text-sm mt-2">
              Crie sua conta para gerenciar seus produtos e vendas
            </p>
          </div>

          <RegisterForm />

          <div className="text-center mt-4">
            <p className="text-sm text-muted">
              Já possui uma conta?{" "}
              <Link
                href="/login"
                className="text-[var(--primary)] hover:underline"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
