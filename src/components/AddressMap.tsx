import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressMapProps {
  address: string;
  city: string;
}

const AddressMap = ({ address, city }: AddressMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [tokenSubmitted, setTokenSubmitted] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !tokenSubmitted || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [2.3522, 48.8566], // Default to Paris
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    marker.current = new mapboxgl.Marker({ color: "#000000" })
      .setLngLat([2.3522, 48.8566])
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, tokenSubmitted]);

  useEffect(() => {
    if (!map.current || !tokenSubmitted || !mapboxToken) return;
    
    const fullAddress = `${address}, ${city}`;
    if (!address || !city) return;

    // Geocode the address
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        fullAddress
      )}.json?access_token=${mapboxToken}&limit=1`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          map.current?.flyTo({ center: [lng, lat], zoom: 15 });
          marker.current?.setLngLat([lng, lat]);
        }
      })
      .catch((error) => {
        console.error("Geocoding error:", error);
      });
  }, [address, city, tokenSubmitted, mapboxToken]);

  if (!tokenSubmitted) {
    return (
      <div className="space-y-4 border border-border p-6 rounded-lg bg-secondary/20">
        <div>
          <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Enter your Mapbox public token to enable the map preview.{" "}
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Get your token here
            </a>
          </p>
          <Input
            id="mapbox-token"
            type="text"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            placeholder="pk.eyJ1..."
            className="h-12"
          />
        </div>
        <button
          type="button"
          onClick={() => setTokenSubmitted(true)}
          disabled={!mapboxToken}
          className="w-full bg-primary text-primary-foreground h-12 rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          Enable Map Preview
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Property Location Preview</Label>
      <div
        ref={mapContainer}
        className="w-full h-[300px] rounded-lg border border-border overflow-hidden"
        style={{ filter: "grayscale(100%)" }}
      />
      <p className="text-xs text-muted-foreground">
        Pin shows approximate location based on your address
      </p>
    </div>
  );
};

export default AddressMap;
