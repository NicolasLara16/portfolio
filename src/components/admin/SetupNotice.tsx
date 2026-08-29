import { TbAlertTriangle } from "react-icons/tb";

export default function SetupNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-lg rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
        <div className="flex items-center gap-3">
          <TbAlertTriangle size={22} className="text-amber-400" />
          <h1 className="font-semibold text-white">Firebase não configurado</h1>
        </div>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-400">
          <li>
            Crie um projeto no{" "}
            <a
              className="text-accent underline"
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Console do Firebase
            </a>
            ;
          </li>
          <li>
            Copie o arquivo{" "}
            <code className="font-mono text-slate-300">.env.example</code> para{" "}
            <code className="font-mono text-slate-300">.env.local</code> e
            preencha as credenciais do projeto;
          </li>
          <li>Reinicie o servidor de desenvolvimento.</li>
        </ol>
        <p className="mt-4 text-xs text-slate-500">
          O guia completo está no README do projeto.
        </p>
      </div>
    </main>
  );
}
