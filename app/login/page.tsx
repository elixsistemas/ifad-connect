import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
          Carregando...
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
