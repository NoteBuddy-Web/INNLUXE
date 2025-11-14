import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Award, Shield, Zap, MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase, ContactFormData } from "@/lib/supabase";

const About = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted - starting...");
    
    try {
      const formData: ContactFormData = {
        name,
        email,
        phone,
        message
      };

      console.log("Form data:", formData);

      const { data, error } = await supabase
        .from('contact_form_submissions')
        .insert([formData]);

      if (error) {
        console.error('Error submitting contact form:', error);
        toast.error(`Erreur: ${error.message}`);
        return;
      }

      console.log('Contact form submitted successfully:', data);
      toast.success("Message envoyé avec succès !");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Une erreur inattendue s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-32 pb-20">
        {/* Hero */}
        <section className="px-6 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-8">À propos d'INNLUXE</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Nous transformons les biens en liquidité. Avec précision, rapidité et discrétion absolue, INNLUXE a redéfini les transactions immobilières pour des clients exigeants qui valorisent leur temps et leur vie privée.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="px-6 mb-8">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-center mb-16">Nos valeurs</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <Zap className="mx-auto text-primary" size={48} />
                <h3 className="text-2xl font-light">Rapidité</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Offres en 24-48 heures. Pas d'attente. Pas d'incertitude. Nous comprenons que le temps est votre bien le plus précieux.
                </p>
              </div>
              <div className="text-center space-y-4">
                <Shield className="mx-auto text-primary" size={48} />
                <h3 className="text-2xl font-light">Confidentialité</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Discrétion absolue dans chaque transaction. Votre vie privée est protégée tout au long du processus.
                </p>
              </div>
              <div className="text-center space-y-4">
                <Award className="mx-auto text-primary" size={48} />
                <h3 className="text-2xl font-light">Précision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Évaluation experte. Offres équitables. Exécution professionnelle. Nous apportons la rigueur institutionnelle à chaque transaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="px-6 mb-0 bg-secondary py-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-12">Notre histoire</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Fondée par des vétérans de l'immobilier qui ont vu la nécessité d'une meilleure approche, INNLUXE a été construite sur un principe simple : les transactions immobilières doivent être rapides, équitables et privées.
              </p>
              <p>
                L'immobilier traditionnel signifie souvent des mois d'incertitude, des visites publiques et une vie privée compromise. Nous avons éliminé tout cela. Notre processus rationalisé et notre capital institutionnel nous permettent de faire des offres en espèces rapidement et de finaliser selon votre calendrier.
              </p>
              <p>
                Aujourd'hui, INNLUXE sert les propriétaires de biens dans les principaux marchés, gérant tout, des appartements de luxe aux actifs commerciaux. Notre réputation est basée sur la rapidité, la discrétion et le respect de nos promesses.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-6 bg-secondary py-24">
          <div className="max-w-screen-xl mx-auto">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="mb-6">Contactez-nous</h2>
              <p className="text-xl text-muted-foreground">
                Prêt à discuter de votre bien ? Notre équipe est disponible pour répondre à vos questions.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div className="space-y-12">
                <div>
                  <h3 className="text-2xl font-light mb-8">Entrer en contact</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <MapPin className="text-primary flex-shrink-0" size={24} />
                      <div>
                        <p className="font-medium mb-1">Adresse du bureau</p>
                        <p className="text-muted-foreground">
                          18 Place Dauphine<br />
                          Paris 75001, France
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Phone className="text-primary flex-shrink-0" size={24} />
                      <div>
                        <p className="font-medium mb-1">Téléphone</p>
                        <p className="text-muted-foreground">+33 6 16 52 50 89</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Mail className="text-primary flex-shrink-0" size={24} />
                      <div>
                        <p className="font-medium mb-1">E-mail</p>
                        <p className="text-muted-foreground">cedric@innluxe.fr</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Clock className="text-primary flex-shrink-0" size={24} />
                      <div>
                        <p className="font-medium mb-1">Heures d'ouverture</p>
                        <p className="text-muted-foreground">
                          Lundi - Vendredi : 9h00 - 18h00<br />
                          Samedi : 10h00 - 16h00<br />
                          Dimanche : Fermé
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="aspect-video bg-background overflow-hidden rounded-xl border border-border/30 shadow-xl hover:shadow-2xl transition-all duration-300 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 pointer-events-none z-10 rounded-xl" />
                  <div className="absolute inset-[1px] rounded-xl overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps?q=18+Place+Dauphine,+75001+Paris,+France&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                      title="Office Location - 18 Place Dauphine, Paris"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h3 className="text-2xl font-light mb-8">Envoyer un message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="contact-name">Nom *</Label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-email">E-mail *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-phone">Téléphone</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-message">Message *</Label>
                    <Textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Comment pouvons-nous vous aider ?"
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    Envoyer le message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
