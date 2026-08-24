import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-100 via-white to-amber-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-xl">
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;