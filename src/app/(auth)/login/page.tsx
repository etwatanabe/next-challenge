import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login | Seller Dashboard",
  description: "Login to your seller dashboard",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="card max-w-md w-full mx-auto my-8">
        <div className="card-content">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="text-muted text-sm mt-2">
              Acesse sua conta para gerenciar produtos e pedidos
            </p>
          </div>
          
          <LoginForm />
          
          <div className="text-center mt-4">
            <p className="text-sm text-muted">
              Não possui uma conta?{" "}
              <Link 
                href="/register" 
                className="text-[var(--primary)] hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}