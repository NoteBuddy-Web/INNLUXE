import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, SlidersHorizontal, X } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";

const Buy = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [minSurface, setMinSurface] = useState([0]);
  const [maxSurface, setMaxSurface] = useState([1000]);
  const [sortBy, setSortBy] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Handle sheet close
  const handleCloseMoreFilters = useCallback(() => {
    setShowMoreFilters(false);
  }, []);

  // Mock property data with numeric values for filtering
  const allProperties = [
    {
      id: 1,
      title: "Résidence avec vue sur montagne",
      description: "Villa contemporaine avec vues panoramiques sur les montagnes et fenêtres du sol au plafond",
      price: "2 850 000 €",
      priceValue: 2850000,
      location: "Paris, France",
      bedrooms: 4,
      bathrooms: 3,
      surface: "320 m²",
      surfaceValue: 320,
      type: "villa",
      image: property1,
    },
    {
      id: 2,
      title: "Chef-d'œuvre architectural",
      description: "Excellence du design moderne avec luxe côté piscine et jardins paysagers",
      price: "3 200 000 €",
      priceValue: 3200000,
      location: "Paris, France",
      bedrooms: 5,
      bathrooms: 4,
      surface: "450 m²",
      surfaceValue: 450,
      type: "house",
      image: property2,
    },
    {
      id: 3,
      title: "Penthouse urbain",
      description: "Vie citadine sophistiquée avec vues panoramiques sur la ville et finitions de designer",
      price: "1 950 000 €",
      priceValue: 1950000,
      location: "Paris, France",
      bedrooms: 3,
      bathrooms: 2,
      surface: "220 m²",
      surfaceValue: 220,
      type: "penthouse",
      image: property1,
    },
    {
      id: 4,
      title: "Domaine côtier",
      description: "Propriété en bord de mer avec accès privé et terrasse coucher de soleil",
      price: "4 500 000 €",
      priceValue: 4500000,
      location: "Nice, France",
      bedrooms: 6,
      bathrooms: 5,
      surface: "550 m²",
      surfaceValue: 550,
      type: "villa",
      image: property2,
    },
    {
      id: 5,
      title: "Appartement de luxe",
      description: "Appartement haut de gamme avec vues sur la ville et équipements premium",
      price: "1 200 000 €",
      priceValue: 1200000,
      location: "Lyon, France",
      bedrooms: 2,
      bathrooms: 2,
      surface: "180 m²",
      surfaceValue: 180,
      type: "apartment",
      image: property1,
    },
    {
      id: 6,
      title: "Maison de ville moderne",
      description: "Maison de ville contemporaine avec jardin privé et garage",
      price: "2 300 000 €",
      priceValue: 2300000,
      location: "Bordeaux, France",
      bedrooms: 4,
      bathrooms: 3,
      surface: "350 m²",
      surfaceValue: 350,
      type: "house",
      image: property2,
    },
  ];

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = [...allProperties];

    // Search by location or title
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.location.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Price range filter
    if (priceRange) {
      filtered = filtered.filter((p) => {
        switch (priceRange) {
          case "0-1m":
            return p.priceValue < 1000000;
          case "1m-2m":
            return p.priceValue >= 1000000 && p.priceValue < 2000000;
          case "2m-3m":
            return p.priceValue >= 2000000 && p.priceValue < 3000000;
          case "3m+":
            return p.priceValue >= 3000000;
          default:
            return true;
        }
      });
    }

    // Property type filter
    if (propertyType) {
      filtered = filtered.filter((p) => p.type === propertyType);
    }

    // Bedrooms filter
    if (bedrooms) {
      const minBedrooms = parseInt(bedrooms);
      filtered = filtered.filter((p) => p.bedrooms >= minBedrooms);
    }

    // Bathrooms filter
    if (bathrooms) {
      const minBathrooms = parseInt(bathrooms);
      filtered = filtered.filter((p) => p.bathrooms >= minBathrooms);
    }

    // Surface area filter
    filtered = filtered.filter(
      (p) =>
        p.surfaceValue >= minSurface[0] && p.surfaceValue <= maxSurface[0]
    );

    // Sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.priceValue - b.priceValue;
          case "price-desc":
            return b.priceValue - a.priceValue;
          case "surface-asc":
            return a.surfaceValue - b.surfaceValue;
          case "surface-desc":
            return b.surfaceValue - a.surfaceValue;
          case "bedrooms-asc":
            return a.bedrooms - b.bedrooms;
          case "bedrooms-desc":
            return b.bedrooms - a.bedrooms;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [searchQuery, priceRange, propertyType, bedrooms, bathrooms, minSurface, maxSurface, sortBy]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange("");
    setPropertyType("");
    setBedrooms("");
    setBathrooms("");
    setMinSurface([0]);
    setMaxSurface([1000]);
    setSortBy("");
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (priceRange) count++;
    if (propertyType) count++;
    if (bedrooms) count++;
    if (bathrooms) count++;
    if (minSurface[0] > 0 || maxSurface[0] < 1000) count++;
    if (sortBy) count++;
    return count;
  }, [searchQuery, priceRange, propertyType, bedrooms, bathrooms, minSurface, maxSurface, sortBy]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-32 pb-20">
        {/* Header */}
        <section className="px-6 mb-16">
          <div className="max-w-screen-xl mx-auto text-center">
            <h1 className="mb-6">Parcourir les biens</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Collection soigneusement sélectionnée de biens exceptionnels. Chacun représente une distinction architecturale et une excellence d'investissement.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="px-6 mb-12">
          <div className="max-w-screen-xl mx-auto">
            <div className="bg-secondary p-6 md:p-8">
              <div className="grid md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                      placeholder="Rechercher par localisation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
                
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Fourchette de prix" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1m">Moins de 1M €</SelectItem>
                    <SelectItem value="1m-2m">1M € - 2M €</SelectItem>
                    <SelectItem value="2m-3m">2M € - 3M €</SelectItem>
                    <SelectItem value="3m+">3M € et plus</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Type de bien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="house">Maison</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Chambres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    {filteredProperties.length} {filteredProperties.length === 1 ? "bien" : "biens"} {activeFilterCount > 0 ? `(${allProperties.length} au total)` : ""}
                  </p>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-xs"
                    >
                      <X size={14} className="mr-1" />
                      Effacer les filtres ({activeFilterCount})
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-10 w-40">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Prix : Croissant</SelectItem>
                      <SelectItem value="price-desc">Prix : Décroissant</SelectItem>
                      <SelectItem value="surface-asc">Surface : Petite à grande</SelectItem>
                      <SelectItem value="surface-desc">Surface : Grande à petite</SelectItem>
                      <SelectItem value="bedrooms-asc">Chambres : Peu à beaucoup</SelectItem>
                      <SelectItem value="bedrooms-desc">Chambres : Beaucoup à peu</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm"
                    type="button"
                    onClick={() => {
                      if (!showMoreFilters) {
                        setShowMoreFilters(true);
                      }
                    }}
                  >
                    <SlidersHorizontal size={18} className="mr-2" />
                    Plus de filtres
                    {activeFilterCount > 4 && (
                      <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        {activeFilterCount - 4}
                      </span>
                    )}
                  </Button>
                  <Sheet 
                    open={showMoreFilters} 
                    onOpenChange={(open) => {
                      setShowMoreFilters(open);
                    }}
                  >
                    <SheetContent 
                      side="right" 
                      className="w-full sm:max-w-lg overflow-y-auto"
                    >
                      <SheetHeader>
                        <SheetTitle>Filtres avancés</SheetTitle>
                        <SheetDescription>
                          Affinez votre recherche avec des filtres supplémentaires
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                          <Label>Salles de bain</Label>
                          <Select value={bathrooms || undefined} onValueChange={(value) => setBathrooms(value === "any" ? "" : value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Tous" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Tous</SelectItem>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                              <SelectItem value="4">4+</SelectItem>
                              <SelectItem value="5">5+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Label>Surface (m²)</Label>
                            <span className="text-sm text-muted-foreground">
                              {minSurface[0]} - {maxSurface[0]} m²
                            </span>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-sm">Minimum</Label>
                              <Slider
                                value={minSurface}
                                onValueChange={setMinSurface}
                                max={maxSurface[0]}
                                step={10}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Maximum</Label>
                              <Slider
                                value={maxSurface}
                                onValueChange={setMaxSurface}
                                min={minSurface[0]}
                                max={1000}
                                step={10}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={resetFilters}
                        >
                          Réinitialiser
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={handleCloseMoreFilters}
                        >
                          Appliquer les filtres
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Property Grid */}
        <section className="px-6">
          <div className="max-w-screen-xl mx-auto">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg mb-4">
                  Aucun bien ne correspond à vos filtres
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  Effacer tous les filtres
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {filteredProperties.map((property) => (
                <article key={property.id} className="group cursor-pointer">
                  <div className="overflow-hidden mb-6 aspect-[4/3]">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-light">{property.title}</h3>
                      <p className="text-xl font-light">{property.price}</p>
                    </div>
                    <p className="text-muted-foreground">{property.description}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{property.bedrooms} Chambre{property.bedrooms > 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>{property.bathrooms} Salle{property.bathrooms > 1 ? 's' : ''} de bain</span>
                      <span>•</span>
                      <span>{property.surface}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                    <Button variant="outline" className="w-full mt-4">
                      Demander une visite
                    </Button>
                  </div>
                </article>
              ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Buy;
