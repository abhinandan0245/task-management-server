import { Link } from "react-router-dom";
import { GithubIcon, LogOutIcon, Menu, X } from "lucide-react";
import { Container } from "./ui/container";
import { NavbarSocialLinks } from "../constants";
import { Button, buttonVariants } from "./ui/button";
import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHomeScreen, setIsHomeScreen] = useState(true);
  const [userDetails, setUserdetails] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Check login state
  const handleIsLoggedIn = () => {
    const token = localStorage.getItem("__tmutoken");
    const id = localStorage.getItem("__tmuid");
    setIsLoggedIn(!!(token && id));
  };

  useEffect(() => {
    handleIsLoggedIn();
  }, []);

  // ✅ Fetch user details
  const handleFetchUserDetails = async () => {
    const token = localStorage.getItem("__tmutoken");

    if (token) {
      try {
        const response = await axios.get("/api/user/details", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response?.data?.user) {
          localStorage.clear();
          window.location.reload();
          return;
        }
        setUserdetails(response?.data?.user);
      } catch (error) {
        alert(error?.response?.data?.message || error?.message);
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    handleFetchUserDetails();
  }, []);

  // ✅ Detect if on Home screen
  const handleIsHomeScreen = () => {
    const isHome = window.location.pathname === "/";
    setIsHomeScreen(isHome);
  };

  useEffect(() => {
    handleIsHomeScreen();
    window.addEventListener("popstate", handleIsHomeScreen);
    return () => window.removeEventListener("popstate", handleIsHomeScreen);
  }, []);

  // ✅ Logout handler
  const handleSignOut = () => {
    if (isLoggedIn) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const drawerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);


  // ✅ Navbar markup
  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-md border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70">
      <Container>
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xl font-bold leading-none dark:font-medium"
            >
              Task Management.
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="items-center hidden gap-6 md:flex">
            {isLoggedIn && (
              <>
                <Link
                  to="/tasks/"
                  className="font-medium transition-colors hover:text-primary"
                >
                  My Tasks
                </Link>
                <Link
                  to="/tasks/create/"
                  className="font-medium transition-colors hover:text-primary"
                >
                  Create Task
                </Link>
                <Link
                  to="/profile/"
                  className="font-medium transition-colors hover:text-primary"
                >
                  My Profile
                </Link>
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Desktop Buttons */}
            <div className="items-center hidden gap-2 md:flex">
              {isLoggedIn ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleSignOut}
                >
                  <LogOutIcon className="w-4 h-4" />
                </Button>
              ) : isHomeScreen ? (
                <>
                  <Link to="/tasks/" className={buttonVariants("outline")}>
                    Dashboard
                  </Link>
                  <Link to="/sign-up/" className={buttonVariants()}>
                    Get Started
                  </Link>
                </>
              ) : null}
            </div>

            {/* Social Links */}
            <div className="items-center hidden md:flex">
              {NavbarSocialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants("ghost", "icon")}
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 transition rounded-md md:hidden hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay background */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)} // click outside to close
            />

            {/* Slide-down drawer */}
            <motion.div
              ref={drawerRef}
              key="drawer"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top-[60px] left-0 right-0 z-50 md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg rounded-b-2xl px-5 py-6"
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex flex-col space-y-4">
                {isLoggedIn && (
                  <>
                    <Link
                      to="/tasks/"
                      className="font-medium transition-colors hover:text-primary"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Tasks
                    </Link>
                    <Link
                      to="/tasks/create/"
                      className="font-medium transition-colors hover:text-primary"
                      onClick={() => setMenuOpen(false)}
                    >
                      Create Task
                    </Link>
                    <Link
                      to="/profile/"
                      className="font-medium transition-colors hover:text-primary"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                  </>
                )}

                {isLoggedIn ? (
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOutIcon className="w-4 h-4 mr-2" /> Logout
                  </Button>
                ) : isHomeScreen ? (
                  <>
                    <Link
                      to="/tasks/"
                      className={buttonVariants("outline")}
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/sign-up/"
                      className={buttonVariants()}
                      onClick={() => setMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                ) : null}

                <div className="flex gap-2 pt-2">
                  {NavbarSocialLinks.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants("ghost", "icon")}
                    >
                      <item.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
