declare module 'tesseract.js' {
    interface BBox {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    }
  
    interface Word {
      text: string;
      bbox: BBox;
      confidence: number;
    }
  
    interface OCRData {
      text: string;
      words: Word[];
    }
  
    export function createWorker(config?: {
      corePath?: string;
      langPath?: string;
      workerPath?: string;
      logger?: (m: any) => void;
    }): Promise<{
      load: () => Promise<void>;
      loadLanguage: (lang: string) => Promise<void>;
      initialize: (lang: string) => Promise<void>;
      recognize: (image: any) => Promise<{ data: OCRData }>;
      terminate: () => Promise<void>;
    }>;
  }
  