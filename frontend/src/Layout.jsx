import { Center, HStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { BsTwitterX } from "react-icons/bs";

function Layout() {
  return (
    <>
      <header></header>
      <main>
        <Center p="4">
          <HStack className="text-xl font-bold text-[#1DA1F2]">
            <span>my</span>
            <span className="inline-flex justify-center items-center">
              <BsTwitterX />
              traordinary
            </span>
            <span> year </span>
          </HStack>
          <Outlet />
        </Center>
      </main>
      <footer></footer>
    </>
  );
}

export default Layout;
