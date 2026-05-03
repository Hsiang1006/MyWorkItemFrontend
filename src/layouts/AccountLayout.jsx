import { Outlet } from "react-router-dom";

const AccountLayout = () => {
  return (
    <div className="account-layout">
      <header className="p-3 bg-light mb-4">
        <div className="container">
          <h4 className="mb-0">My Work Item</h4>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountLayout;
