import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { VStack, Spinner } from "@chakra-ui/react";
import TopBar from "./TopBar";

export default function Pending() {
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.get(`/check/${username}`);
        const status = res.data.status;
        if (status === "success") {
          navigate(`/year/${username}`);
        } else if (status === "not_found") {
          navigate("/");
        }
      } catch (e) {
        toast.error("Error checking username");
      }
    };
    check();
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <VStack p="4" className="w-full">
      <TopBar />
      <div className="h-10" />
      <Spinner size="xl" thickness="5px" speed="0.65s" emptyColor="gray.200" />
    </VStack>
  );
}
