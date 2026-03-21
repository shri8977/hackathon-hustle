import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // 🔥 IMPORTANT: wait for session to be set
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        navigate("/");
      } else {
        // fallback retry (very important)
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            navigate("/");
          } else {
            navigate("/auth");
          }
        }, 1000); // wait 1 second
      }
    };

    handleAuth();
  }, []);

  return <div>Logging you in...</div>;
};

export default AuthCallback;
