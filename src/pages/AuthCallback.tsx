import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      await supabase.auth.getSession();
      navigate("/");
    };

    handleAuth();
  }, []);

  return <div>Loading...</div>;
};

export default AuthCallback;
