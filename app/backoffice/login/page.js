import LoginForm from "./LoginForm";

export const metadata = { title: "Connexion — Backoffice 2-LIMITED" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2 text-center">
          2-LIMITED
        </p>
        <h1 className="text-white text-xl font-black tracking-widest uppercase mb-8 text-center">
          Backoffice
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
