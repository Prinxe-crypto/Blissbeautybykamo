
export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'hair' | 'skin' | 'nails' | 'spa';
  imageUrl: string;
}

export interface ConsultationMessage {
  role: 'user' | 'ai';
  text: string;
  image?: string;
}

export interface BookingData {
  serviceId: string;
  date: string;
  time: string;
  name: string;
  notes?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;      
    accent: string;       
    bgMain: string;       
    bgSurface: string;    
    textMain: string;     
    textMuted: string;    
    border: string;       
  };
}

export interface FileItem {
  id: string;
  name: string;
  content: string;
}
