import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function SignUp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Error al obtener sesión:", error);
      else setUser(data.session?.user || null);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user || null);
      }
    );

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error:", error.message);
      alert("Error al iniciar sesión con Google");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error al cerrar sesión:", error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {user ? "Welcome Back" : "Get Started"}
          </h1>
          <p className="text-gray-500">
            {user
              ? "You're successfully logged in"
              : "Sign up with your Google account"}
          </p>
        </div>

        {user ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <img
                  src={user.user_metadata?.avatar_url}
                  alt="User avatar"
                  className="h-12 w-12 rounded-full"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.email}</p>
                <p className="text-sm text-gray-500">
                  {user.user_metadata?.full_name}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Sign Out"}
            </button>
          </div>
        ) : (
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Sign Up with Google"}
          </button>
        )}
      </div>
    </div>
  );
}
