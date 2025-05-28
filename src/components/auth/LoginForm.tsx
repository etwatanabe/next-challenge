"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciais inválidas");
      } else {
        router.push("/dashboard/products");
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocorreu um erro ao fazer login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="alert alert-error">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="seu@email.com"
        />
      </div>
      
      <div className="form-group">
        <div className="flex justify-between mb-2">
          <label htmlFor="password" className="label">
            Senha
          </label>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="••••••••"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full mt-2"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}