import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate("/");
      } else {
        navigate("/");
      }
    };

    handleAuth();
  }, []);

  return <div>Logging you in...</div>;
};

export default AuthCallback;
