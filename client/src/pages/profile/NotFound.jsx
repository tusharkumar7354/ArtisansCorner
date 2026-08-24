import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button";

const NotFound = () => {
  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-8xl font-black text-amber-700">404</h1>
        <h2 className="mt-6 text-4xl font-bold text-stone-900">
          Oops! Page Not Found
        </h2>
        <p className="mt-4 text-lg leading-7 text-stone-600">
          The page you are looking for doesn't exist or may have been moved.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/">
            <Button>
              <Home size={18} />
              Home
            </Button>
          </Link>
          <Button variant="secondary" onClick={() => window.history.back()}>
            <ArrowLeft size={18} />
            Go Back
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;