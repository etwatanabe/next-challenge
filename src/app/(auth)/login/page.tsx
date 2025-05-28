import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | Seller Dashboard",
  description: "Login to your seller dashboard",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Fazer login
          </h2>
        </div>
        <LoginForm />
          <p className="mt-2 text-center text-sm text-gray-600">
            Não possui uma conta? {" "}
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Cadastre-se
            </a>
          </p>
      </div>
    </div>
  );
}
