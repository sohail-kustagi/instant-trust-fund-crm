import React, { useEffect, useRef, useState } from "react";

export interface PropertyData {
  _id?: string;
  propertyId?: string;
  latitude?: number;
  longitude?: number;
  surveyNumber?: string;
  district?: string;
  taluk?: string;
  village?: string;
  ownerName?: string;
}

export interface PropertyMapProps {
  properties?: PropertyData[];
  onSelectProperty?: (prop: PropertyData) => void;
}

/**
 * PropertyMap component dynamically loading Leaflet JS/CSS from CDN
 * to ensure SSR-safety and zero React 19 package version conflicts.
 */
export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties = [],
  onSelectProperty,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // 1. Inject Leaflet CSS stylesheet if not already injected
    const cssId = "leaflet-cdn-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    // 2. Inject Leaflet JS script if not already injected
    const jsId = "leaflet-cdn-js";
    if (!document.getElementById(jsId)) {
      const script = document.createElement("script");
      script.id = jsId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = () => setLeafletLoaded(true);
      script.onerror = () => setLoadError(true);
      document.body.appendChild(script);
    } else {
      if ((window as any).L) {
        setLeafletLoaded(true);
      } else {
        const interval = setInterval(() => {
          if ((window as any).L) {
            setLeafletLoaded(true);
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Coordinates for Karnataka center
    const karnatakaCenter: [number, number] = [15.3173, 75.7139];

    const map = L.map(mapContainerRef.current).setView(karnatakaCenter, 7);
    mapInstanceRef.current = map;

    // Add base OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add KGIS WMS layer for Karnataka cadastral survey boundaries
    const kgisWmsUrl = "https://kgis.ksrsac.in/geoserver/wms";
    L.tileLayer
      .wms(kgisWmsUrl, {
        layers: "kgis:cadastral_survey_boundaries,kgis:revenue_boundary",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        attribution: "© Karnataka GIS (KGIS) Land Survey",
      })
      .addTo(map);

    // Add pins for land parcel verification
    const pins =
      properties && properties.length > 0
        ? properties.map((prop) => ({
            lat: prop.latitude || 12.9716,
            lng: prop.longitude || 77.5946,
            label:
              `Survey No: ${prop.surveyNumber || "N/A"}<br/>` +
              `District: ${prop.district || "N/A"}<br/>` +
              `Taluk: ${prop.taluk || "N/A"}<br/>` +
              `Village: ${prop.village || "N/A"}<br/>` +
              `Owner: ${prop.ownerName || "•••••••• (Restricted)"}`,
            data: prop,
          }))
        : [
            {
              lat: 12.9716,
              lng: 77.5946,
              label: "Survey No 23/1A - Bengaluru Urban (Verified)",
              data: undefined,
            },
            {
              lat: 15.3647,
              lng: 75.1240,
              label: "Survey No 142/C - Hubballi Rural (Pending Audit)",
              data: undefined,
            },
            {
              lat: 12.2958,
              lng: 76.6394,
              label: "Survey No 88 - Mysuru Taluk (Verified)",
              data: undefined,
            },
          ];

    pins.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng]).addTo(map);
      marker.bindPopup(`<strong>Cadastral Record</strong><br/>${pin.label}`);
      if (pin.data && onSelectProperty) {
        marker.on("click", () => onSelectProperty(pin.data!));
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, properties, onSelectProperty]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center p-8 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 text-xs font-semibold">
        Failed to load interactive Leaflet GIS components from CDN. Check your network connection.
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[260px] sm:min-h-[350px] relative rounded-xl overflow-hidden border shadow-inner bg-slate-900">
      {!leafletLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-400 bg-slate-900/90 z-20">
          Mounting OpenStreetMap & KGIS WMS Layers...
        </div>
      )}
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%", minHeight: "260px" }}
        className="z-10"
      />
    </div>
  );
};

export default PropertyMap;
