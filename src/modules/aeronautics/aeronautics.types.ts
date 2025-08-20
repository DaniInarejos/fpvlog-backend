export interface AeronauticsFeatureProperties {
  // Propiedades principales solicitadas
  Name: string | null;
  Type: string;
  Reasons: string;
  Message: string;
  Lower: number | null;
  LowerReference: string;
  Upper: number | null;
  UpperReference: string;
  Email: string;
  Phone: string;
  UpdateDateTime: string;
  
  // Propiedades adicionales útiles identificadas
  Identifier: string;  // ID único de la zona
  Country: string;     // País (ESP)
  UOM: string | null;  // Unidad de medida para altitudes
  Day: string;         // Días aplicables (ANY, etc.)
}

export interface AeronauticsFeature {
  type: "Feature";
  id: number;
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
  properties: AeronauticsFeatureProperties;
}

export interface AeronauticsApiResponse {
  type: "FeatureCollection";
  features: AeronauticsFeature[];
}

export interface AeronauticsResponse {
  data: AeronauticsApiResponse;
  cachedAt: string;
  source: 'cache' | 'api';
}

// Nuevo tipo para el resultado comprimido
export interface CompressedDataResult {
  data: Buffer;
  size: number;
  isFromCache: boolean;
}