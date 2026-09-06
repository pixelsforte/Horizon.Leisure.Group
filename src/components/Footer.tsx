import { Phone, Mail, Instagram, Facebook, MessageSquare, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const currentYear = 2026;

  return (
    <footer id="main-footer" className="bg-[#0a2e0a] text-white border-t border-[#c09f53]/10 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Logo and Slogan */}
        <div className="text-center mb-16 border-b border-[#c09f53]/10 pb-12">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-3 mb-4 cursor-pointer hover:opacity-85 transition-opacity"
            id="footer-logo-button"
          >
            <div className="w-3 h-3 bg-[#c09f53] rounded-full"></div>
            <h2 className="font-serif text-[#f4edd9] tracking-[0.25em] text-2xl uppercase">
              Horizon
            </h2>
          </button>
          <p className="font-sans text-[10px] tracking-[0.3em] text-[#c09f53] uppercase mb-4 font-semibold">
            Leisure Group
          </p>
          <p className="font-serif text-[#e5d7af]/70 italic text-base md:text-lg max-w-md mx-auto">
            Where Leisure Meets Excellence
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-16 text-left" id="footer-links-grid">
          {/* Column 1: COMPANY */}
          <div>
            <h4 className="font-mono text-[10px] text-[#c09f53] tracking-widest uppercase font-bold mb-6">
              COMPANY
            </h4>
            <ul className="space-y-4 text-xs md:text-sm text-[#e5d7af]/75">
              <li>
                <button onClick={() => scrollToId("about")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  About Horizon
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("challenge")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Our History & Challenge
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("directors")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Directors
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("team")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Our Team
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: SERVICES */}
          <div>
            <h4 className="font-mono text-[10px] text-[#c09f53] tracking-widest uppercase font-bold mb-6">
              SERVICES
            </h4>
            <ul className="space-y-4 text-xs md:text-sm text-[#e5d7af]/75">
              <li>
                <button onClick={() => scrollToId("services")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Sales Strategy
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("services")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Marketing & Leads
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("services")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Staff Training
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("services")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Financial Planning
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("services")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Full Management
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: PARTNERSHIP */}
          <div>
            <h4 className="font-mono text-[10px] text-[#c09f53] tracking-widest uppercase font-bold mb-6">
              PARTNERSHIP
            </h4>
            <ul className="space-y-4 text-xs md:text-sm text-[#e5d7af]/75">
              <li>
                <button onClick={() => scrollToId("partnership")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Sales Sharing Model
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("partnership")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Lease Model
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("partnership")} className="hover:text-[#c09f53] transition-colors pointer-events-auto cursor-pointer text-left">
                  Profit Share Model
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("contact")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Free Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: CONTACT */}
          <div>
            <h4 className="font-mono text-[10px] text-[#c09f53] tracking-widest uppercase font-bold mb-6">
              CONTACT
            </h4>
            <ul className="space-y-4 text-xs md:text-sm text-[#e5d7af]/75">
              <li>
                <button onClick={() => scrollToId("contact")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  WhatsApp Preferred
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("contact")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Direct Line
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("contact")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Email Address
                </button>
              </li>
              <li>
                <button onClick={() => scrollToId("contact")} className="hover:text-[#c09f53] transition-colors cursor-pointer text-left">
                  Office Location
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Social icons and Copyright */}
        <div className="border-t border-[#c09f53]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          
          {/* Copyright Info */}
          <p className="font-sans text-xs text-[#e5d7af]/45 tracking-wide">
            &copy; {currentYear} Horizon Leisure Group. All rights reserved.
          </p>

          {/* Social Row */}
          <div className="flex items-center gap-4" id="footer-social-icons">
            <a
              href="tel:+923001234567"
              className="w-9 h-9 border border-[#c09f53]/25 hover:border-[#c09f53] hover:bg-[#c09f53]/5 rounded-full flex items-center justify-center text-[#c09f53] transition-colors"
              aria-label="Phone"
            >
              <Phone size={14} />
            </a>
            <a
              href="mailto:contact@horizonleisure.pk"
              className="w-9 h-9 border border-[#c09f53]/25 hover:border-[#c09f53] hover:bg-[#c09f53]/5 rounded-full flex items-center justify-center text-[#c09f53] transition-colors"
              aria-label="Email"
            >
              <Mail size={14} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 border border-[#c09f53]/25 hover:border-[#c09f53] hover:bg-[#c09f53]/5 rounded-full flex items-center justify-center text-[#c09f53] transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={14} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 border border-[#c09f53]/25 hover:border-[#c09f53] hover:bg-[#c09f53]/5 rounded-full flex items-center justify-center text-[#c09f53] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={14} />
            </a>
          </div>

          {/* Back to top button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-2 border border-[#c09f53]/25 hover:border-[#c09f53] text-[#c09f53] rounded-sm transition-colors text-xs flex items-center gap-1.5 uppercase font-mono tracking-widest hover:bg-[#c09f53]/5 cursor-pointer"
            id="footer-back-to-top"
          >
            TOP <ArrowUp size={12} />
          </button>
        </div>

      </div>
    </footer>
  );
}
