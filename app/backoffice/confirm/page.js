import ConfirmForm from "./ConfirmForm";

export const metadata = { title: "Confirmer — Backoffice 2-LIMITED" };

// Deliberately requires a click (see ConfirmForm) instead of verifying the
// token the moment this page loads — email clients/security gateways often
// pre-fetch links to scan them, which would silently burn the one-time
// token before a human ever sees it. A GET request alone must be harmless.
export default async function ConfirmPage({ searchParams }) {
  const { token_hash, type } = await searchParams;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">2-LIMITED</p>
        <h1 className="text-white text-xl font-black tracking-widest uppercase mb-8">Backoffice</h1>
        <ConfirmForm tokenHash={token_hash} type={type} />
      </div>
    </div>
  );
}
