import { Toaster } from "react-hot-toast";

import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/common/ScrollToTop";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#292524",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 4000,
          },
        }}
      />
    </>
  );
};

export default App;
