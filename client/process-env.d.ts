declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        APIKEY : string;
        AUTHDOMAIN : string;
        PROJECTID : string;
        STORAGEBUCKET : string;
        MESSAGINGSENDERID : string;
        APPID : string;
        MEASUREMENTID : string;
        
      }
    }
  }