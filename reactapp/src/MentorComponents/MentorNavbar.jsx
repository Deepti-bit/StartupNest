import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X, Home, Briefcase, FilePlus2, ListChecks } from "lucide-react";
import "./MentorNavbar.css";

export default function MentorNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const links = [
    { name: "Dashboard", path: "/mentor/dashboard", icon: <Home size={16} /> },
    { name: "Add Profile", path: "/mentor/create-profile", icon: <FilePlus2 size={16} /> },
    { name: "My Profiles", path: "/mentor/profiles", icon: <Briefcase size={16} /> },
    { name: "Submissions", path: "/mentor/submissions", icon: <ListChecks size={16} /> },
  ];

  return (
    <>
      <header className={`mnav ${isScrolled ? "mnav--scrolled" : ""}`}>
        <div className="mnav__inner">
          <div className="mnav__logo" onClick={() => navigate("/mentor/dashboard")}>
            <div className="mnav__logoMark">S</div>
            <div className="mnav__logoText">
              Startup<span>Nest</span>
            </div>
          </div>

          <nav className="mnav__links">
            {links.map((l) => (
              <NavLink key={l.path} to={l.path} className="mnav__link">
                {l.icon}
                <span>{l.name}</span>
                {location.pathname === l.path && (
                  <motion.div layoutId="mentorActive" className="mnav__active" />
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mnav__actions">
            <button className="mnav__logoutBtn" onClick={() => setShowLogoutModal(true)}>
              <LogOut size={16} />
            </button>

            <button className="mnav__menuBtn" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="mnav__mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="mnav__mobileBox">
                {links.map((l) => (
                  <NavLink
                    key={l.path}
                    to={l.path}
                    className="mnav__mobileLink"
                    onClick={() => setIsOpen(false)}
                  >
                    {l.icon}
                    {l.name}
                  </NavLink>
                ))}
                <button className="mnav__mobileLogout" onClick={() => setShowLogoutModal(true)}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="mlogout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mlogout__backdrop" onClick={() => setShowLogoutModal(false)} />
            <motion.div
              className="mlogout__card"
              initial={{ y: 10, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 10, scale: 0.97 }}
            >
              <h3>Wait a second!</h3>
              <p>Are you sure you want to end your mentor session?</p>
              <div className="mlogout__actions">
                <button className="mlogout__stay" onClick={() => setShowLogoutModal(false)}>
                  Stay Here
                </button>
                <button className="mlogout__exit" onClick={logout}>
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}