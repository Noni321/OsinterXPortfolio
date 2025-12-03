import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Menu, 
  X, 
  Search, 
  MapPin, 
  Users, 
  Globe, 
  Shield, 
  Database, 
  Eye,
  Terminal,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Methodology", href: "#methodology" },
  { name: "Tools", href: "#tools" },
  { name: "Contact", href: "#contact" },
];

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = new Array(columns).fill(1);
    const chars = "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF<>{}[]/*-+";

    const draw = () => {
      ctx.fillStyle = "rgba(5, 5, 5, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#39ff14";
      ctx.font = "15px 'Fira Code', monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = `rgba(57, 255, 20, ${Math.random() * 0.5 + 0.1})`;
        ctx.fillText(char, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20 z-0"
    />
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-cyber-black/90 backdrop-blur-md border-b border-neon/20"
          : "bg-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.a
            href="#home"
            className="font-mono text-xl md:text-2xl font-bold text-neon text-glow tracking-wider"
            whileHover={{ scale: 1.05 }}
            data-testid="link-logo"
          >
            Osinter <span className="text-foreground">x</span>
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="font-mono text-sm text-muted-foreground hover:text-neon transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                data-testid={`link-nav-${link.name.toLowerCase()}`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon group-hover:w-full transition-all duration-300 shadow-neon-sm" />
              </motion.a>
            ))}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-neon p-2"
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-cyber-black/95 border-b border-neon/20 backdrop-blur-md"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-mono text-sm text-muted-foreground hover:text-neon transition-colors py-2"
                data-testid={`link-mobile-nav-${link.name.toLowerCase()}`}
              >
                {">"} {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

function TypewriterText({ texts }: { texts: string[] }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentFullText.length) {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex, texts]);

  return (
    <span className="font-mono text-neon text-glow-sm" data-testid="text-typewriter">
      {displayText}
      <span className="animate-blink text-neon">|</span>
    </span>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 grid-overlay" />
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block font-mono text-xs md:text-sm text-neon/70 tracking-[0.3em] uppercase mb-4">
            [ OSINT Expert ]
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold mb-6 leading-tight"
          data-testid="text-hero-title"
        >
          <span 
            className="glitch-text text-foreground block"
            data-text="Uncovering the"
          >
            Uncovering the
          </span>
          <span 
            className="glitch-text text-neon text-glow block mt-2"
            data-text="Hidden Truths"
          >
            Hidden Truths
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground mb-8 h-8"
        >
          <span className="font-mono text-foreground/80">{">"} </span>
          <TypewriterText 
            texts={[
              "Digital Forensics",
              "Data Analysis", 
              "Cyber Investigation",
              "Intelligence Gathering"
            ]} 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="font-mono border-neon text-neon bg-transparent shadow-neon animate-pulse-neon group relative overflow-visible"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            data-testid="button-initiate-search"
          >
            <Search className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            Initiate Search
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex items-center justify-center gap-2 text-muted-foreground/50 font-mono text-xs"
        >
          <Terminal className="w-3 h-3" />
          <span>System Online • Secure Connection Established</span>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-neon/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-neon rounded-full mt-2"
          />
        </motion.div>
      </div>
    </section>
  );
}

const skills = [
  {
    icon: MapPin,
    title: "Geolocation",
    description: "Precise location tracking and geographic analysis using advanced mapping techniques and metadata extraction.",
  },
  {
    icon: Users,
    title: "Social Media Analysis",
    description: "Deep investigation of social networks, user behavior patterns, and digital footprint analysis.",
  },
  {
    icon: Globe,
    title: "IP Tracing",
    description: "Network forensics and IP address investigation to uncover digital trails and connection origins.",
  },
  {
    icon: Shield,
    title: "Threat Intelligence",
    description: "Proactive identification and analysis of potential security threats and vulnerabilities.",
  },
  {
    icon: Database,
    title: "Data Mining",
    description: "Advanced data extraction and correlation from multiple open sources for comprehensive intelligence.",
  },
  {
    icon: Eye,
    title: "Surveillance Detection",
    description: "Counter-surveillance techniques and identification of monitoring activities.",
  },
];

function SkillCard({ skill, index }: { skill: typeof skills[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
      data-testid={`card-skill-${index}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md" />
      
      <div className="relative bg-cyber-gray/50 border border-neon/20 rounded-md p-6 transition-all duration-300 group-hover:border-neon group-hover:shadow-neon-sm backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-cyber-dark rounded-md border border-neon/30 group-hover:border-neon group-hover:shadow-neon-sm transition-all duration-300">
            <skill.icon className="w-6 h-6 text-neon" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-mono text-lg font-semibold text-foreground mb-2 group-hover:text-neon transition-colors">
              {skill.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {skill.description}
            </p>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 font-mono text-xs text-neon/30 group-hover:text-neon/60 transition-colors">
          [{String(index + 1).padStart(2, "0")}]
        </div>
      </div>
    </motion.div>
  );
}

function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="methodology"
      className="relative py-24 px-4"
      data-testid="section-skills"
    >
      <div className="absolute inset-0 grid-overlay opacity-50" />
      
      <div className="relative z-10 max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs text-neon/70 tracking-[0.3em] uppercase">
            [ Capabilities ]
          </span>
          <h2 className="text-3xl md:text-4xl font-mono font-bold mt-4 mb-4">
            <span className="text-foreground">OSINT </span>
            <span className="text-neon text-glow">Methodology</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive intelligence gathering through systematic analysis of publicly available information
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <SkillCard key={skill.title} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const tools = [
    { name: "Maltego", category: "Link Analysis" },
    { name: "Shodan", category: "Network Intel" },
    { name: "theHarvester", category: "Email/Domain" },
    { name: "SpiderFoot", category: "Automation" },
    { name: "Recon-ng", category: "Framework" },
    { name: "Metagoofil", category: "Metadata" },
  ];

  return (
    <section
      id="tools"
      className="relative py-24 px-4 bg-cyber-dark/50"
      data-testid="section-tools"
    >
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      <div className="relative z-10 max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs text-neon/70 tracking-[0.3em] uppercase">
            [ Arsenal ]
          </span>
          <h2 className="text-3xl md:text-4xl font-mono font-bold mt-4 mb-4">
            <span className="text-foreground">Investigation </span>
            <span className="text-neon text-glow">Tools</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-cyber-gray/30 border border-neon/20 rounded-md p-4 text-center group hover:border-neon hover:shadow-neon-sm transition-all duration-300"
              data-testid={`card-tool-${index}`}
            >
              <div className="font-mono text-sm text-neon mb-1">{tool.name}</div>
              <div className="font-mono text-xs text-muted-foreground">{tool.category}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      className="relative py-24 px-4"
      data-testid="section-contact"
    >
      <div className="absolute inset-0 grid-overlay opacity-50" />
      
      <div className="relative z-10 max-w-2xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs text-neon/70 tracking-[0.3em] uppercase">
            [ Communication ]
          </span>
          <h2 className="text-3xl md:text-4xl font-mono font-bold mt-4">
            <span className="text-foreground">Establish </span>
            <span className="text-neon text-glow">Contact</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-cyber-gray/50 border border-neon/30 rounded-md overflow-hidden backdrop-blur-sm shadow-neon-sm">
            <div className="bg-cyber-dark/80 border-b border-neon/20 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-neon/80" />
              </div>
              <span className="font-mono text-xs text-muted-foreground ml-2">
                secure_channel.sh
              </span>
            </div>

            <div className="p-6 md:p-8 font-mono">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-neon">$</span>
                  <span className="text-muted-foreground">establishing connection...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neon">$</span>
                  <span className="text-muted-foreground">encrypting channel...</span>
                </div>
                <div className="flex items-center gap-2 text-neon animate-flicker">
                  <Terminal className="w-4 h-4" />
                  <span className="text-glow-sm" data-testid="text-secure-line">
                    Secure Line Established
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neon/20">
                <p className="text-muted-foreground text-sm mb-6 text-center">
                  For confidential inquiries and intelligence requests, 
                  connect via secure messaging platform.
                </p>

                <a
                  href="https://t.me/SC0FiiElD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  data-testid="link-telegram"
                >
                  <Button
                    className="w-full font-mono bg-transparent border-2 border-neon text-neon shadow-neon group relative overflow-visible"
                    size="lg"
                    variant="outline"
                    data-testid="button-telegram"
                  >
                    <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                    Contact via Telegram
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-neon rounded-full animate-pulse" />
                  </Button>
                </a>

                <div className="mt-6 text-center">
                  <span className="font-mono text-xs text-muted-foreground/50">
                    @SC0FiiElD
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon/20 via-transparent to-neon/20 rounded-md blur-sm -z-10 opacity-50" />
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative py-8 px-4 border-t border-neon/10" data-testid="footer">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-mono text-sm text-muted-foreground">
          <span className="text-neon">{">"}</span> Osinter x © {new Date().getFullYear()}
        </div>
        
        <div className="font-mono text-xs text-muted-foreground/50 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
          <span>System Status: Online</span>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-cyber-black text-foreground relative overflow-x-hidden">
      <MatrixRain />
      <div className="relative z-10 scanline">
        <Navbar />
        <HeroSection />
        <SkillsSection />
        <ToolsSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}
