import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-divider bg-background">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-light tracking-widest">INNLUXE</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Précision. Discrétion. Performance. Transformer les biens en liquidité, rapidement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 font-medium">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/sell" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Vendre un bien
                </Link>
              </li>
              <li>
                <Link to="/buy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Acheter un bien
                </Link>
              </li>
              <li>
                <Link to="/repairs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Services de réparation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 font-medium">Entreprise</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 font-medium">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>+33 6 16 52 50 89</li>
              <li>cedric@innluxe.fr</li>
              <li className="pt-4 flex gap-4">
                <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-divider text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} INNLUXE. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
