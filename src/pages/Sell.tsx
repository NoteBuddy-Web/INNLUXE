import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ChevronRight, ChevronLeft, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase, SellFormData, SellFormDraftData } from "@/lib/supabase";
import { CalendlyWidget } from "@/components/CalendlyWidget";

const Sell = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const isSavingRef = useRef(false);

  // Step 1: Contact & Location
  const [name, setName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [contactMethod, setContactMethod] = useState("phone");
  const [bestTime, setBestTime] = useState("");

  // Step 2: Property Details
  const [propertyType, setPropertyType] = useState("");
  const [surfaceArea, setSurfaceArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [condition, setCondition] = useState("");
  const [features, setFeatures] = useState("");
  const [urgency, setUrgency] = useState("");

  // Step 3: Financial Info
  const [desiredPrice, setDesiredPrice] = useState("");
  const [mortgage, setMortgage] = useState("");
  const [viewingAvailability, setViewingAvailability] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Fonction de sauvegarde automatique dans la table drafts
  const autoSave = async (step: number) => {
    // Éviter les sauvegardes multiples simultanées
    if (isSavingRef.current) {
      console.log('Auto-save already in progress, skipping...');
      return;
    }
    
    isSavingRef.current = true;
    console.log(`Auto-saving step ${step}...`);

    try {
      // Préparer les données disponibles - tous les champs peuvent être NULL
      const draftData: SellFormDraftData = {
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        address: address || undefined,
        city: city || undefined,
        contact_method: contactMethod || undefined,
        best_time: bestTime || undefined,
        property_type: propertyType || undefined,
        surface_area: surfaceArea || undefined,
        bedrooms: bedrooms || undefined,
        bathrooms: bathrooms || undefined,
        year_built: yearBuilt || undefined,
        condition: condition || undefined,
        features: features || undefined,
        urgency: urgency || undefined,
        desired_price: desiredPrice || undefined,
        mortgage: mortgage || undefined,
        viewing_availability: viewingAvailability || undefined,
        additional_info: additionalInfo || undefined,
        updated_at: new Date().toISOString(),
      };

      // Si on a déjà un ID, faire un UPDATE
      if (submissionId) {
        console.log('Updating existing draft:', submissionId);
        const { data, error } = await supabase
          .from('sell_form_drafts')
          .update(draftData)
          .eq('id', submissionId)
          .select()
          .single();

        if (error) {
          console.error('Error updating draft:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
        } else {
          console.log('Draft auto-saved successfully (UPDATE):', data?.id);
        }
      } else {
        // Sinon, créer un nouvel enregistrement dans la table drafts
        console.log('Inserting new draft with data:', draftData);
        const { data, error } = await supabase
          .from('sell_form_drafts')
          .insert([draftData])
          .select()
          .single();

        if (error) {
          console.error('Error auto-saving draft (INSERT):', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
        } else if (data) {
          console.log('Draft auto-saved successfully (INSERT):', data.id);
          setSubmissionId(data.id);
        }
      }
    } catch (error) {
      console.error('Unexpected error during auto-save:', error);
    } finally {
      isSavingRef.current = false;
    }
  };

  const handleNext = async (e?: React.MouseEvent) => {
    // Empêcher la soumission du formulaire
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (currentStep < totalSteps) {
      // Sauvegarder avant de passer à l'étape suivante
      console.log('handleNext called, currentStep:', currentStep);
      console.log('Current form data:', { name, email, phone, address, city });
      
      try {
        await autoSave(currentStep);
        console.log('Auto-save completed, moving to next step');
      } catch (error) {
        console.error('Error during auto-save in handleNext:', error);
        // Continuer quand même à l'étape suivante même si la sauvegarde échoue
      }
      
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData: SellFormData = {
        name,
        email,
        phone,
        address,
        city,
        contact_method: contactMethod,
        best_time: bestTime,
        property_type: propertyType,
        surface_area: surfaceArea,
        bedrooms,
        bathrooms,
        year_built: yearBuilt,
        condition,
        features,
        urgency,
        desired_price: desiredPrice,
        mortgage,
        viewing_availability: viewingAvailability,
        additional_info: additionalInfo
      };

      // Toujours insérer dans la table finale sell_form_submissions
      const { data, error } = await supabase
        .from('sell_form_submissions')
        .insert([formData])
        .select()
        .single();

      if (error) {
        console.error('Error submitting form:', error);
        toast.error("Échec de l'envoi du formulaire. Veuillez réessayer.");
        return;
      }

      // Set submitted state to show success page
      setIsSubmitted(true);
      toast.success("Demande envoyée avec succès !");
      
      // All async operations AFTER setting isSubmitted to true
      // Run in background without blocking the UI
      
      // Optionnel : Supprimer le draft après soumission réussie (non-blocking)
      if (submissionId) {
        supabase
          .from('sell_form_drafts')
          .delete()
          .eq('id', submissionId)
          .then(() => {
            console.log('Draft deleted after successful submission');
          })
          .catch((err) => {
            console.warn('Error deleting draft (non-critical):', err);
          });
      }

      // Appeler la fonction Edge pour envoyer l'email (completely non-blocking)
      // This runs in the background and won't affect the UI
      setTimeout(() => {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rqdhwrtkweeuiqjrvbrd.supabase.co';
          const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZGh3cnRrd2VldWlxanJ2YnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTgxNTYsImV4cCI6MjA3NzIzNDE1Nn0.R_84JD0cRrYjdTd6mU837bfwcBdw9s9a8EEYRHE70uE';
          
          const emailPayload = {
            table: 'sell_form_submissions',
            record: data
          };
          
          console.log('Calling Edge Function with payload (background):', emailPayload);
          
          fetch(`${supabaseUrl}/functions/v1/send-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseAnonKey}`
            },
          body: JSON.stringify(emailPayload)
        })
        .then((emailResponse) => {
          if (emailResponse.ok) {
            emailResponse.json().then(() => {
              // Email sent successfully (silent)
            });
          }
        })
        .catch(() => {
          // Email error (silent - non-critical)
        });
      } catch (emailError) {
        // Email error (silent - non-critical)
      }
    }, 100);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Une erreur inattendue s'est produite. Veuillez réessayer.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 px-6 pt-32 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-8">
              <CheckCircle2 className="mx-auto mb-6 text-primary" size={80} />
              <h1 className="mb-4">Merci</h1>
              <p className="text-xl text-muted-foreground mb-4">
                Les détails de votre bien ont été reçus. Un représentant INNLUXE vous contactera sous peu pour discuter de votre offre de rachat.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Délai de réponse typique : 24-48 heures
              </p>
            </div>

            {/* Calendly Section */}
            <div className="mt-24 mb-8 w-full">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                  Préférez-vous planifier une réunion plutôt que d'attendre?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Réservez un créneau pour discuter de votre bien directement avec notre équipe
                </p>
              </div>
              
              {/* Calendly Button - Opens Popup */}
              <CalendlyWidget url="https://calendly.com/mlecroc/30min" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="mb-4">Vendez votre bien</h1>
            <p className="text-muted-foreground text-lg">
              Complétez ce formulaire confidentiel pour recevoir votre offre de rachat
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-4 text-sm text-muted-foreground">
              <span className={currentStep === 1 ? "text-primary font-medium" : ""}>Contact & Localisation</span>
              <span className={currentStep === 2 ? "text-primary font-medium" : ""}>Détails du bien</span>
              <span className={currentStep === 3 ? "text-primary font-medium" : ""}>Informations financières</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Contact & Location */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Adresse e-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Numéro de téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adresse du bien *</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Adresse de rue"
                    required
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Méthode de contact préférée *</Label>
                  <RadioGroup value={contactMethod} onValueChange={setContactMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone-contact" />
                      <Label htmlFor="phone-contact" className="font-normal cursor-pointer">Téléphone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email-contact" />
                      <Label htmlFor="email-contact" className="font-normal cursor-pointer">E-mail</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="bestTime">Meilleur moment pour vous joindre</Label>
                  <Select value={bestTime} onValueChange={setBestTime}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Sélectionner l'heure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Matin (8h - 12h)</SelectItem>
                      <SelectItem value="afternoon">Après-midi (12h - 17h)</SelectItem>
                      <SelectItem value="evening">Soirée (17h - 20h)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Property Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <Label htmlFor="propertyType">Type de bien *</Label>
                  <Select value={propertyType} onValueChange={setPropertyType} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Appartement</SelectItem>
                      <SelectItem value="house">Maison</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="surfaceArea">Surface (m²) *</Label>
                    <Input
                      id="surfaceArea"
                      type="number"
                      value={surfaceArea}
                      onChange={(e) => setSurfaceArea(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bedrooms">Chambres</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Salles de bain</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="yearBuilt">Année de construction</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="condition">État du bien *</Label>
                    <Select value={condition} onValueChange={setCondition} required>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Sélectionner l'état" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Bon</SelectItem>
                        <SelectItem value="fair">Correct</SelectItem>
                        <SelectItem value="needs-work">Nécessite des travaux</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="features">Caractéristiques notables</Label>
                  <Textarea
                    id="features"
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="Piscine, garage, jardin, rénovations récentes, etc."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="urgency">Urgence de vente *</Label>
                  <Select value={urgency} onValueChange={setUrgency} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Sélectionner l'urgence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immédiate (ASAP)</SelectItem>
                      <SelectItem value="30-60">30-60 jours</SelectItem>
                      <SelectItem value="flexible">Délai flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Financial Info */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <Label htmlFor="desiredPrice">Prix souhaité ou fourchette *</Label>
                  <Input
                    id="desiredPrice"
                    value={desiredPrice}
                    onChange={(e) => setDesiredPrice(e.target.value)}
                    placeholder="ex: 500 000 € ou 450k-550k €"
                    required
                    className="h-12"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Prêt en cours ? *</Label>
                  <RadioGroup value={mortgage} onValueChange={setMortgage} required>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="mortgage-yes" />
                      <Label htmlFor="mortgage-yes" className="font-normal cursor-pointer">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="mortgage-no" />
                      <Label htmlFor="mortgage-no" className="font-normal cursor-pointer">Non</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="viewingAvailability">Disponibilité pour visite *</Label>
                  <Textarea
                    id="viewingAvailability"
                    value={viewingAvailability}
                    onChange={(e) => setViewingAvailability(e.target.value)}
                    placeholder="Veuillez préciser vos jours et heures disponibles"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="additionalInfo">Informations supplémentaires</Label>
                  <Textarea
                    id="additionalInfo"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Autre chose que nous devrions savoir ?"
                    rows={4}
                  />
                </div>

                <div className="border border-dashed border-primary p-8 text-center">
                  <Upload className="mx-auto mb-4 text-muted-foreground" size={40} />
                  <p className="text-sm text-muted-foreground mb-2">
                    Télécharger des photos, plans ou documents (optionnel)
                  </p>
                  <p className="text-xs text-muted-foreground">Max 25MB par fichier</p>
                  <Input type="file" multiple className="mt-4" accept="image/*,.pdf" />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="mr-2" size={18} />
                  Précédent
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button type="button" onClick={handleNext} className="ml-auto" variant="hero">
                  Suivant
                  <ChevronRight className="ml-2" size={18} />
                </Button>
              ) : (
                <Button type="submit" className="ml-auto" variant="hero">
                  Soumettre la demande
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;