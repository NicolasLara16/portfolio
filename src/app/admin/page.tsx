"use client";

import { TbLoader } from "react-icons/tb";
import { useAuth } from "@/hooks/useAuth";
import { isFirebaseConfigured } from "@/lib/firebase";
import Dashboard from "@/components/admin/Dashboard";
import LoginForm from "@/components/admin/LoginForm";
import SetupNotice from "@/components/admin/SetupNotice";

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (!isFirebaseConfigured) {
    return <SetupNotice />;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <TbLoader size={28} className="animate-spin text-accent" />
      </main>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <Dashboard userEmail={user.email ?? "admin"} />;
}
