import { HStack, VStack, Button } from "@chakra-ui/react";
import { BsTwitterX } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const navigate = useNavigate();
  return (
    <VStack>
      <HStack
        className="text-3xl font-bold text-[#1DA1F2]"
        onClick={() => navigate("/")}
        cursor="pointer"
      >
        <span>my</span>
        <span className="inline-flex justify-center items-center">
          <span className="inline-flex justify-center items-center">
            <BsTwitterX />
            traordinary
          </span>
        </span>
        <span> year </span>
      </HStack>
      <Button
        as="a"
        variant="link"
        href="https://aivanzhang.com/"
        colorScheme="blue"
        target="_blank"
        rel="noopener noreferrer"
        size="md"
      >
        about me
      </Button>
      <Button
        as="a"
        variant="link"
        href="mailto:ivanzhangofficial@gmail.com"
        colorScheme="blue"
        size="md"
      >
        issues?
      </Button>
    </VStack>
  );
}
