import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CheckCircle2, Upload, Wrench, Hammer, PaintBucket } from "lucide-react";
import repairsHero from "@/assets/repairs-hero.jpg";
import { toast } from "sonner";
import { supabase, RenovationFormData } from "@/lib/supabase";

const Renovation = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [repairType, setRepairType] = useState("");
  const [urgency, setUrgency] = useState("");
  const [description, setDescription] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData: RenovationFormData = {
        name,
        email,
        phone,
        address,
        city,
        repair_type: repairType,
        urgency,
        description
      };

      const { data, error } = await supabase
        .from('renovation_form_submissions')
        .insert([formData])
        .select()
        .single();

      if (error) {
        console.error('Error submitting form:', error);
        toast.error("Échec de l'envoi du formulaire. Veuillez réessayer.");
        return;
      }

      console.log('Form submitted successfully:', data);
      
      // Appeler la fonction Edge pour envoyer l'email
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rqdhwrtkweeuiqjrvbrd.supabase.co';
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZGh3cnRrd2VldWlxanJ2YnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTgxNTYsImV4cCI6MjA3NzIzNDE1Nn0.R_84JD0cRrYjdTd6mU837bfwcBdw9s9a8EEYRHE70uE';
        
        const emailPayload = {
          table: 'renovation_form_submissions',
          record: data
        };
        
        console.log('Calling Edge Function with payload:', emailPayload);
        
        const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify(emailPayload)
        });

        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          console.log('Email notification sent successfully:', emailResult);
        } else {
          const errorText = await emailResponse.text();
          console.error('Error sending email notification:', {
            status: emailResponse.status,
            statusText: emailResponse.statusText,
            error: errorText
          });
        }
      } catch (emailError) {
        console.error('Error calling email function:', emailError);
      }
      
      setIsSubmitted(true);
      toast.success("Demande envoyée avec succès !");
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Une erreur inattendue s'est produite. Veuillez réessayer.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
          <div className="max-w-2xl text-center">
            <CheckCircle2 className="mx-auto mb-6 text-primary" size={80} />
            <h1 className="mb-6">Demande reçue</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Votre demande de rénovation a été envoyée. Un spécialiste INNLUXE vous contactera pour planifier une consultation.
            </p>
            <p className="text-lg text-muted-foreground">
              Délai de réponse typique : 24 heures
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Cursor gradient effect */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          width: "35px",
          height: "35px",
          background: "radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.8) 50%, transparent 80%)",
          borderRadius: "50%",
          filter: "blur(20px)",
          opacity: 0.5,
        }}
      />

      <Navigation />

      {/* Hero */}
      <section id="renovation-hero" className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={repairsHero}
            alt="Artisanat expert"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-white mb-6">INNLUXE Rénovation</h1>
          <p className="text-white/90 text-xl md:text-2xl font-light">
            Précision. Discrétion. Artisanat expert.
          </p>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-center mb-16">Niveaux de service</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-divider p-8 space-y-5 hover:border-primary transition-colors">
              <Wrench className="text-primary mb-4" size={40} />
              <h3 className="text-2xl font-light">Réparation rapide</h3>
              <p className="text-muted-foreground leading-relaxed">
                Réparations d'urgence et corrections rapides. Réponse 24-48h pour les problèmes urgents.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Urgences plomberie</li>
                <li>• Problèmes électriques</li>
                <li>• Remplacement de serrures</li>
                <li>• Vitrage d'urgence</li>
              </ul>
            </div>

            <div className="border border-divider p-8 space-y-4 hover:border-primary transition-colors">
              <Hammer className="text-primary mb-4" size={40} />
              <h3 className="text-2xl font-light">Finition Premium</h3>
              <p className="text-muted-foreground leading-relaxed">
                High-quality repairs and improvements. Attention to detail and finish.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Kitchen upgrades</li>
                <li>• Bathroom renovations</li>
                <li>• Flooring installation</li>
                <li>• Custom carpentry</li>
              </ul>
            </div>

            <div className="border border-divider p-8 space-y-4 hover:border-primary transition-colors">
              <PaintBucket className="text-primary mb-4" size={40} />
              <h3 className="text-2xl font-light">Rénovation complète</h3>
              <p className="text-muted-foreground leading-relaxed">
                Complete property transformation. Design consultation and project management.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Architectural design</li>
                <li>• Full property remodel</li>
                <li>• Luxury finishes</li>
                <li>• Project coordination</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-24 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Demander un service</h2>
            <p className="text-muted-foreground text-lg">
              Partagez les détails de votre projet de rénovation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-background p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="renovation-name">Nom complet *</Label>
                <Input
                  id="renovation-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div>
                <Label htmlFor="renovation-email">Email *</Label>
                <Input
                  id="renovation-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
            </div>

            <div>
                <Label htmlFor="renovation-phone">Numéro de téléphone *</Label>
              <Input
                id="renovation-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="renovation-address">Adresse du bien *</Label>
              <Input
                id="renovation-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="renovation-city">City *</Label>
              <Input
                id="renovation-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="renovation-type">Type of Service *</Label>
              <Select value={repairType} onValueChange={setRepairType} required>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rapid">Rapid Fix</SelectItem>
                  <SelectItem value="premium">Premium Finish</SelectItem>
                  <SelectItem value="renovation">Full Renovation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="urgency">Urgency *</Label>
              <Select value={urgency} onValueChange={setUrgency} required>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency (24h)</SelectItem>
                  <SelectItem value="urgent">Urgent (This Week)</SelectItem>
                  <SelectItem value="planned">Planned (Flexible)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Veuillez décrire les travaux requis"
                rows={6}
                required
              />
            </div>

            <div className="border border-dashed border-primary p-6 text-center">
              <Upload className="mx-auto mb-3 text-muted-foreground" size={32} />
              <p className="text-sm text-muted-foreground mb-2">
                Upload photos of the area (optional)
              </p>
              <Input type="file" multiple className="mt-3" accept="image/*" />
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full">
              Envoyer la demande
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Renovation;
