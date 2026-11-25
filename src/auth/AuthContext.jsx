import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  // Check whether a user is already logged in.
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        console.error(error);
      }

      setSession(data.session);
      setLoading(Boolean(data.session));
      setAuthReady(true);
    }).catch((error) => {
      if (!mounted) return;

      setProfileError(error.message);
      setAuthReady(true);
      setLoading(false);
    });

    // Listen for login and logout events.
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {

        // If a user is logged in, load their profile first.
        if (nextSession) {
          setLoading(true);
        } else {
          setProfile(null);
          setProfileError("");
          setLoading(false);
        }

        setSession(nextSession);
        setAuthReady(true);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load the profile belonging to the logged-in user.
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!authReady) return;

      if (!session) {
        setProfile(null);
        setProfileError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setProfileError("");

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email, role")
          .eq("id", session.user.id)
          .maybeSingle();

        console.log("LABTRACK PROFILE DEBUG:", {
        projectURL: import.meta.env.VITE_SUPABASE_URL,
        userID: session.user.id,
        profileData: data,
        profileError: error
        });


        if (error) throw error;

        if (!active) return;

        if (!data) {
          setProfile(null);
          setProfileError("No LabTrack profile was found.");
        } else {
          setProfile(data);
        }
      } catch (error) {
        if (!active) return;

        setProfile(null);
        setProfileError(error.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [session, authReady]);

  // Sign out function.
  async function signOut() {
    const { error } = await supabase.auth.signOut({
      scope: "local"
    });

    if (error) throw error;
  }

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    profileError,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}