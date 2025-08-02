import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="swiss-container py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-lg">Financia</span>
          </Link>

          {/* Legal Links */}
          <div className="flex items-center space-x-6 text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>© {currentYear} Financia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;