import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverDarkHero, setIsOverDarkHero] = useState(true);

  // Pages with white backgrounds where text should be dark (excluding pages with dark hero sections)
  const whiteBackgroundPages = ['/sell', '/buy', '/about'];
  const isOnWhiteBackgroundPage = whiteBackgroundPages.includes(location.pathname);
  
  // Pages with dark hero sections where text should be white
  const darkHeroPages = ['/', '/repairs'];
  const isOnDarkHeroPage = darkHeroPages.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const hero = document.getElementById("hero");
    const renovationHero = document.getElementById("renovation-hero");
    const currentHero = hero || renovationHero;
    
    if (currentHero) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsOverDarkHero(entry.isIntersecting && entry.intersectionRatio > 0.2);
        },
        { root: null, threshold: [0, 0.2, 0.5, 1] }
      );
      observer.observe(currentHero);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        observer.disconnect();
      };
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Vendre", path: "/sell" },
    { name: "Acheter", path: "/buy" },
    { name: "Rénovation", path: "/repairs" },
    { name: "À propos", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-divider" : "bg-transparent"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className={`text-2xl font-light tracking-widest hover:opacity-70 transition-all duration-400 ${
              !isScrolled && isOverDarkHero && isOnDarkHeroPage ? "text-white" : "text-foreground"
            }`}
          >
            INNLUXE
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-wider transition-all duration-300 hover:text-primary ${
                  isActive(link.path)
                    ? !isScrolled && isOverDarkHero && isOnDarkHeroPage
                      ? "text-gray-300 font-medium"
                      : "text-primary font-medium"
                    : !isScrolled && isOverDarkHero && isOnDarkHeroPage
                      ? "text-white/90"
                      : "text-foreground/70"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              !isScrolled && isOverDarkHero && isOnDarkHeroPage ? "text-white" : "text-foreground"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-divider">
          <div className="px-6 py-8 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-lg uppercase tracking-wider transition-colors ${
                  isActive(link.path)
                    ? "text-primary font-medium"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
