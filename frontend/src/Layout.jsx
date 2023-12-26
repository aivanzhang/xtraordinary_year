import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <header></header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}

export default Layout;
