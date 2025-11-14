import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CalendlyWidgetProps {
  url?: string;
}

export const CalendlyWidget = ({ 
  url = "https://calendly.com/mlecroc/30min"
}: CalendlyWidgetProps) => {
  
  // Add Calendly parameters for black and white theme
  const calendlyUrl = `${url}?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&text_color=000000&primary_color=000000`;
  
  useEffect(() => {
    // Load Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Load Calendly JS
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: calendlyUrl });
    } else {
      console.error('Calendly not loaded yet');
    }
  };

  return (
    <div className="flex justify-center">
      <Button 
        onClick={openCalendly}
        size="lg"
        variant="hero"
        className="text-lg px-8 py-6"
      >
        Planifier une réunion
      </Button>
    </div>
  );
};

// Extend Window interface for Calendly
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}
