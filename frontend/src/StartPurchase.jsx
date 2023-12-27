import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const StartPurchase = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const navigate = useNavigate();
  useEffect(() => {
    window.location.replace(
      `${axios.defaults.baseURL}/create-checkout-session/${username}`,
    );
  }, [navigate, username]);

  return <h1>Redirecting...</h1>;
};

export default StartPurchase;
