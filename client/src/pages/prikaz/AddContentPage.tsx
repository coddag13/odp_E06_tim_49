import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { IContentAPIService } from "../../api_services/content/IContentAPIService";
import { AddContentForm } from "../../components/addContentComponents/addContentForm";

interface AddContentPageProps {
  contentApi: IContentAPIService; 
}

export default function AddContentPage({ contentApi }: AddContentPageProps) {
  const { user, token, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const isAdmin = user?.uloga === "admin";

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6">
        Učitavanje…
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6">
        Dozvoljeno samo adminu.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold">Dodaj sadržaj</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 transition"
          >
            Nazad
          </button>
        </div>

        <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-700 p-5 shadow-xl">
          <AddContentForm
            contentApi={contentApi}
            token={token ?? null}
            isAdmin={isAdmin}
            onSuccess={() => navigate(-1)}
          />
        </div>
      </div>
    </main>
  );
}
