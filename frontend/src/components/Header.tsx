import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { useAppContext } from "@/contexts/AppContext";

const Header = () => {
  const appContext = useAppContext();
  const isLoggedIn = appContext?.isLoggedIn ?? false;

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link href="/">Nawy.com</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                href="/my-apartments"
              >
                My Apartments
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;







/*import { Link } from "react-router-dom";
import SignOutButton from "./SignOutButton";
import { useAppContext } from "@/contexts/AppContext";


const Header = () => {
  const { isLoggedIn }: { isLoggedIn: boolean } = useAppContext();

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">Nawy.com</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>

              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/my-apartments"
              >
                My Apartments
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;*/

