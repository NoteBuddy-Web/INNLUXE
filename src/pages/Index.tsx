import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroCity from "@/assets/hero-city.jpg";
import pontNeuf from "@/assets/Pont-neuf.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import { useState, useEffect, useRef } from "react";

const Index = () => {
  console.log("Index page is rendering");
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const howItWorksRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hero images carousel
  const heroImages = [heroCity, pontNeuf];

  const steps = [
    {
      step: "01",
      title: "Découverte de votre bien",
      description: "En présentiel ou en visioconférence, selon votre disponibilité. Nous sommes joignables 7j/7 pour comprendre votre projet et analyser les caractéristiques essentielles du bien.",
    },
    {
      step: "02",
      title: "Estimation sous 24 h",
      description: "Nous réalisons une estimation précise basée sur nos dernières ventes, les références du quartier, les données de la Chambre des Notaires de Paris et celles de la Direction Générale des Finances Publiques.",
    },
    {
      step: "03",
      title: "Offre d'achat",
      description: "Si vous optez pour un rachat immédiat, vous recevez une offre ferme et claire. En cas d'acceptation, nous vous mettons directement en relation avec les notaires. Nous pouvons également vous recommander notre notaire partenaire, capable de signer une promesse de vente en une dizaine de jours.",
    },
    {
      step: "04",
      title: "Accompagnement complet",
      description: "Nous suivons l'ensemble du processus notarial entre la promesse de vente et l'acte authentique. Notre équipe reste disponible à chaque étape pour garantir une transaction fluide et sécurisée.",
    },
    {
      step: "05",
      title: "Signature définitive",
      description: "L'acte authentique est signé chez le notaire. La vente est finalisée et les fonds sont versés sur votre compte dans les délais légaux.",
    },
  ];

  // Set window height on mount and resize
  useEffect(() => {
    const updateWindowHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    
    updateWindowHeight();
    window.addEventListener("resize", updateWindowHeight);
    
    return () => window.removeEventListener("resize", updateWindowHeight);
  }, []);

  // Auto-rotate hero images every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (!howItWorksRef.current || !containerRef.current) return;

      const section = howItWorksRef.current;
      const container = containerRef.current;
      const sectionTop = section.offsetTop;
      const currentWindowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Gradient transition zone is ~384px (h-96)
      const gradientHeight = 384;
      // Section starts when top enters viewport
      const sectionStart = sectionTop - currentWindowHeight;
      // Lock starts after gradient transition (when gradient ends)
      const lockStart = sectionTop - currentWindowHeight + gradientHeight;
      const scrollProgress = Math.max(0, scrollY - lockStart);
      
      // Each step takes 400px, last step takes longer (800px) to stay visible longer
      const scrollPerStep = 400;
      const lastStepScroll = 800;
      const totalScrollSpace = scrollPerStep * (steps.length - 1) + lastStepScroll;
      const sectionEnd = lockStart + totalScrollSpace;
      
      // Add transition zone at the end where last step fades out
      const fadeOutZone = 600;
      const fadeOutStart = sectionEnd - fadeOutZone;

      if (scrollY >= lockStart && scrollY < sectionEnd) {
        const progress = Math.min(scrollProgress / totalScrollSpace, 1);
        
        // Calculate which step to show based on scroll progress
        let currentStep = 0;
        let cumulativeScroll = 0;
        
        for (let i = 0; i < steps.length; i++) {
          const stepScroll = (i === steps.length - 1) ? lastStepScroll : scrollPerStep;
          const stepProgress = (cumulativeScroll + stepScroll) / totalScrollSpace;
          
          if (progress >= stepProgress && i < steps.length - 1) {
            currentStep = i + 1;
          }
          
          cumulativeScroll += stepScroll;
        }
        
        // Ensure currentStep is within valid range
        currentStep = Math.max(0, Math.min(currentStep, steps.length - 1));
        
        setActiveStep(currentStep);
        
        if (!isLocked) {
          setIsLocked(true);
        }

        // Pin the container content - lock it in place
        // Fade out as we approach sectionEnd - longer fade for smoother transition
        let containerOpacity = 1;
        if (scrollY >= fadeOutStart && scrollY < sectionEnd) {
          // Fade out gradually in the last 500px to prevent blank space
          const fadeOutProgress = (scrollY - fadeOutStart) / fadeOutZone;
          // Use easing function for smoother fade - slower at start, faster at end
          const easedProgress = fadeOutProgress * fadeOutProgress; // Quadratic easing
          containerOpacity = 1 - easedProgress;
        }
        
        container.style.position = "fixed";
        container.style.top = "50%";
        container.style.left = "50%";
        container.style.transform = "translate(-50%, -50%)";
        container.style.width = "100%";
        container.style.maxWidth = "1280px";
        // Reduce z-index as we approach sectionEnd so it goes behind next section
        let zIndexValue = 5;
        if (scrollY >= fadeOutStart && scrollY < sectionEnd) {
          // Gradually reduce z-index as we fade out
          const fadeOutProgress = (scrollY - fadeOutStart) / fadeOutZone;
          zIndexValue = 5 - (fadeOutProgress * 4); // From 5 to 1
        }
        container.style.zIndex = String(Math.max(1, zIndexValue));
        container.style.backgroundColor = "transparent";
        container.style.opacity = String(containerOpacity);
        
        // Title fades out as we approach the last step (step 3, index 2) - longer fade
        const titleElement = document.getElementById('comment-title');
        if (titleElement) {
          const titleH2 = titleElement.querySelector('h2');
          if (titleH2) {
            // Fade out later and more gradually to prevent blank space
            const titleFadeStart = 0.5; // Start fading at 60% progress (sooner)
            const titleFadeEnd = 0.95; // Fully hidden at 95% progress (later)
            if (progress >= titleFadeEnd) {
              titleH2.style.opacity = "0";
              titleH2.style.transform = "translateY(-10px)";
            } else if (progress >= titleFadeStart) {
              // Fade out gradually between 60% and 95% - longer fade zone
              const fadeProgress = (progress - titleFadeStart) / (titleFadeEnd - titleFadeStart);
              // Use easing for smoother transition
              const easedProgress = fadeProgress * fadeProgress;
              titleH2.style.opacity = String(1 - easedProgress);
              titleH2.style.transform = `translateY(${-10 * easedProgress}px)`;
            } else {
              titleH2.style.opacity = "1";
              titleH2.style.transform = "translateY(0)";
            }
          }
        }
      } else if (scrollY >= sectionStart && scrollY < lockStart) {
        // During gradient transition - section stays in place, content fades in
        setActiveStep(0);
        setIsLocked(false);
        // Keep section fixed in place - don't change position
        container.style.position = "relative";
        container.style.top = "auto";
        container.style.left = "auto";
        container.style.transform = "none";
        container.style.zIndex = "auto";
        container.style.backgroundColor = "transparent";
        // Fade in during gradient transition - section stays fixed
        const fadeProgress = (scrollY - sectionStart) / gradientHeight;
        container.style.opacity = String(Math.min(fadeProgress, 1));
        
        // Animate title appearing from behind
        const titleElement = document.getElementById('comment-title');
        if (titleElement) {
          const titleH2 = titleElement.querySelector('h2');
          if (titleH2) {
            // Title fades in and slides up as we scroll
            const titleProgress = Math.min(fadeProgress * 1.5, 1); // Faster appearance
            titleH2.style.opacity = String(titleProgress);
            titleH2.style.transform = `translateY(${-20 + 20 * titleProgress}px)`;
          }
        }
      } else if (scrollY < sectionStart) {
        // Before section - hidden but in place
        setActiveStep(0);
        setIsLocked(false);
        container.style.position = "relative";
        container.style.top = "auto";
        container.style.left = "auto";
        container.style.transform = "none";
        container.style.zIndex = "auto";
        container.style.backgroundColor = "transparent";
        container.style.opacity = "0";
        
        // Hide title behind hero
        const titleElement = document.getElementById('comment-title');
        if (titleElement) {
          const titleH2 = titleElement.querySelector('h2');
          if (titleH2) {
            titleH2.style.opacity = "0";
            titleH2.style.transform = "translateY(-20px)";
          }
        }
      } else if (scrollY >= sectionEnd) {
        // After section - step 3 has faded out, release lock and transition to next section
        setActiveStep(steps.length - 1);
        setIsLocked(false);
        container.style.position = "relative";
        container.style.top = "auto";
        container.style.left = "auto";
        container.style.transform = "none";
        container.style.zIndex = "1"; // Behind the next section
        container.style.backgroundColor = "transparent";
        container.style.opacity = "0"; // Fully hidden after section
        
        // Hide title completely after section
        const titleElement = document.getElementById('comment-title');
        if (titleElement) {
          const titleH2 = titleElement.querySelector('h2');
          if (titleH2) {
            titleH2.style.opacity = "0";
            titleH2.style.transform = "translateY(-10px)";
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps.length]);

  const handleQuickForm = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to sell page with pre-filled data
    window.location.href = `/sell?email=${email}&phone=${phone}&city=${city}`;
  };

  // Property data with more items
  const featuredProperties = [
    {
      id: 1,
      title: "Résidence avec vue sur montagne",
      description: "Villa contemporaine avec vues panoramiques",
      price: "2 850 000 €",
      image: property1,
    },
    {
      id: 2,
      title: "Chef-d'œuvre architectural",
      description: "Design moderne avec luxe côté piscine",
      price: "3 200 000 €",
      image: property2,
    },
    {
      id: 3,
      title: "Penthouse urbain",
      description: "Vue panoramique sur la ville avec finitions de luxe",
      price: "1 950 000 €",
      image: property1,
    },
    {
      id: 4,
      title: "Domaine côtier",
      description: "Propriété en bord de mer avec accès privé",
      price: "4 500 000 €",
      image: property2,
    },
    {
      id: 5,
      title: "Villa contemporaine",
      description: "Architecture moderne avec jardin paysager",
      price: "2 400 000 €",
      image: property1,
    },
    {
      id: 6,
      title: "Appartement de luxe",
      description: "Intérieur raffiné au cœur de la ville",
      price: "1 750 000 €",
      image: property2,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden" style={{ zIndex: 20 }}>
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          {/* Image Carousel */}
          <div className="relative w-full h-full">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image}
                  alt={index === 0 ? "Paysage urbain de luxe" : "Pont Neuf"}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
          {/* Extended gradient at bottom for smooth transition */}
          <div 
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: '200px',
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
              zIndex: 2
            }}
          />
        </div>

        <div className="relative text-center px-6 max-w-5xl mx-auto" style={{ zIndex: 10 }}>
          <style>{`
            @keyframes heroLogoFadeIn {
              0% {
                opacity: 0;
                transform: translateY(20px) scale(0.97);
                filter: blur(5px);
              }
              40% {
                opacity: 0.6;
                filter: blur(2px);
              }
              70% {
                opacity: 0.9;
                filter: blur(0.5px);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
              }
            }
            @keyframes heroFadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .hero-logo {
              animation: heroLogoFadeIn 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s backwards;
            }
            .hero-subtitle {
              animation: heroFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards;
            }
            .hero-buttons {
              animation: heroFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.9s backwards;
            }
          `}</style>
          <div 
            className="text-white text-7xl md:text-9xl font-light mb-8 tracking-widest hero-logo"
          >
            INNLUXE
          </div>
          <p 
            className="text-white/90 text-xl md:text-2xl mb-12 font-light max-w-3xl mx-auto hero-subtitle"
          >
            Estimation gratuite sans engagements en quelques clics.<br />
            Offres en 24-48 heures.
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center hero-buttons"
          >
            <Link to="/sell">
              <Button variant="hero" size="lg">
                Obtenir une offre de rachat
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Link to="/buy">
              <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
                Parcourir les biens
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Scroll Animation Section */}
      <section 
        ref={howItWorksRef} 
        className="relative overflow-hidden"
        style={{ 
          // Height = gradient zone + scroll space for steps (step 3 takes much longer)
          height: `${384 + 400 * (steps.length - 1) + 800 + 50}px`,
          backgroundColor: 'transparent',
          zIndex: 2
        }}
      >
        {/* Extended gradient overlay at top for smooth transition from hero */}
        <div className="absolute top-0 left-0 right-0 h-96 pointer-events-none z-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.05) 60%, transparent 80%, hsl(var(--background) / 0.5) 90%, hsl(var(--background)))'
          }}
        />
        {/* Title that appears from behind hero image */}
        <div 
          className="fixed top-0 left-0 right-0 flex justify-center items-center px-6 pointer-events-none"
          style={{
            height: '100px',
            zIndex: 18, // Behind hero (20) but above section content
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            marginTop: '180px' // Moved down so gradient is not visible
          }}
          id="comment-title"
        >
          <h2 className="text-center text-4xl font-light" style={{ 
            opacity: 0,
            transform: 'translateY(-20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
          }}>
            Comment ça marche
          </h2>
        </div>
        
        {/* Scroll space container - provides scroll distance for animation */}
        <div className="relative h-full z-10">
          <div 
            ref={containerRef} 
            className="max-w-screen-xl mx-auto px-6 py-20"
            style={{
              // Faster transition - only transition opacity, section stays fixed, no transform animation
              transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <h2 className="text-center mb-16 opacity-0 pointer-events-none">Comment ça marche</h2>
            
            <div className="relative" style={{ minHeight: "400px" }}>
              {steps.map((item, idx) => {
                // Step 0 (first step) should just appear, steps 1+ slide in from right
                const isCurrent = idx === activeStep;
                const isBefore = idx < activeStep;
                const isAfter = idx > activeStep;
                const isFirstStep = idx === 0;
                
                // First step is always at translateX(0) when visible (no slide animation)
                // Subsequent steps slide in from right when they become current
                let transformValue = "translateX(0)";
                if (!isCurrent) {
                  if (isBefore) {
                    transformValue = "translateX(-100%)"; // Slide out to left
                  } else if (isFirstStep) {
                    // First step when not current should still be at 0 (hidden by opacity)
                    transformValue = "translateX(0)";
                  } else {
                    transformValue = "translateX(100%)"; // Waiting on right
                  }
                }
                
                // First step should not animate transform - it just fades in/out
                const shouldAnimateTransform = !isFirstStep && (isCurrent || isBefore);
                
                return (
                  <div
                    key={idx}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      zIndex: isCurrent ? steps.length + 1 : (isBefore ? idx + 1 : 0),
                      opacity: isCurrent ? 1 : 0,
                      pointerEvents: isCurrent ? "auto" : "none",
                      transform: transformValue,
                      filter: isCurrent ? 'blur(0)' : 'blur(3px)',
                      // Faster transitions - first step only animates opacity, steps 1+ animate transform and opacity
                      transition: isFirstStep
                        ? "opacity 0.6s ease-out, filter 0.6s ease-out"
                        : "opacity 0.7s ease-out, transform 0.7s ease-out, filter 0.7s ease-out",
                    }}
                  >
                    <div className={`text-center space-y-4 w-full max-w-2xl mx-auto transition-all duration-700 ${
                      isCurrent ? "scale-100" : "scale-97"
                    }`}>
                      <div className="text-6xl font-light text-primary/20 mb-4">{item.step}</div>
                      <h3 className="text-4xl md:text-5xl font-light mb-6">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">{item.description}</p>
                      <CheckCircle2 
                        className="mx-auto text-primary transition-all duration-700 scale-125 mt-6" 
                        size={36} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Gradient overlay at bottom for smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-0"
          style={{
            background: 'linear-gradient(to top, hsl(var(--secondary) / 0.5), hsl(var(--secondary) / 0.2), transparent)'
          }}
        />
      </section>

      {/* Quick Lead Capture */}
      <section className="py-20 px-6 bg-secondary relative" style={{ zIndex: 10 }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="mb-6">Prêt à vendre ?</h2>
          <p className="text-muted-foreground mb-12 text-lg">
            Commencez avec une consultation rapide. Sans engagement.
          </p>
          <form onSubmit={handleQuickForm} className="space-y-4">
            <Input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-14 text-base"
            />
            <Input
              type="tel"
              placeholder="Numéro de téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="h-14 text-base"
            />
            <Input
              type="text"
              placeholder="Ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="h-14 text-base"
            />
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Obtenir mon offre de rachat
            </Button>
          </form>
        </div>
        {/* Gradient overlay at bottom for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, hsl(var(--background) / 0.6), hsl(var(--background) / 0.3), transparent)'
          }}
        />
      </section>

      {/* Featured Properties Teaser */}
      <section 
        className="py-20 px-6 overflow-hidden bg-background relative"
      >
        {/* Gradient overlay at top for smooth transition */}
        <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, hsl(var(--secondary) / 0.3), transparent)'
          }}
        />
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2>Biens en vedette</h2>
            <Link to="/buy" className="text-sm uppercase tracking-wider hover:text-primary transition-colors">
              Voir tout <ArrowRight className="inline ml-1" size={16} />
            </Link>
          </div>
          <div 
            className="flex gap-6 slideLeft"
          >
            {featuredProperties.map((property) => (
              <div 
                key={property.id} 
                className="group cursor-pointer flex-shrink-0 w-[400px]"
              >
                <div className="overflow-hidden mb-4 aspect-[4/3]">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl mb-2">{property.title}</h3>
                <p className="text-muted-foreground mb-2">{property.description}</p>
                <p className="text-2xl font-light">{property.price}</p>
              </div>
            ))}
            {/* Separator */}
            <div className="flex-shrink-0 w-px bg-divider mx-4" />
            {/* Duplicate items for seamless loop */}
            {featuredProperties.map((property) => (
              <div 
                key={`duplicate-${property.id}`} 
                className="group cursor-pointer flex-shrink-0 w-[400px]"
              >
                <div className="overflow-hidden mb-4 aspect-[4/3]">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl mb-2">{property.title}</h3>
                <p className="text-muted-foreground mb-2">{property.description}</p>
                <p className="text-2xl font-light">{property.price}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Gradient overlay at bottom for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, hsl(var(--primary) / 0.5), hsl(var(--primary) / 0.2), transparent)'
          }}
        />
      </section>

      {/* Repairs Teaser */}
      <section className="py-20 px-6 bg-primary text-primary-foreground relative">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-white mb-6">INNLUXE Rénovation</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Artisanat de précision pour propriétaires exigeants. Des réparations rapides aux rénovations complètes.
          </p>
          <Link to="/repairs">
            <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
              Explorer les services
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
