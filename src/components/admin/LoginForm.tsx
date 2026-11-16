"use client";
import { useActionState } from "react";
import { login, type FormState } from "@/app/actions/admin";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, { error: null });
  return (
    <form action={action} className="card mx-auto mt-16 flex max-w-sm flex-col gap-4 p-6">
      <h1 className="text-3xl font-extrabold">Back office</h1>
      <label>
        <span className="label">Email</span>
        <input name="email" type="email" required autoComplete="email" className="field" />
      </label>
      <label>
        <span className="label">Contraseña</span>
        <input name="password" type="password" required autoComplete="current-password" className="field" />
      </label>
      {state.error && <p role="alert" className="font-bold text-coral-deep">{state.error}</p>}
      <button disabled={pending} className="btn btn-primary">
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
