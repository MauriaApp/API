// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

// console.log(process.env.APIKEY);


export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../server/public', // Sortie dans le dossier public du serveur
    emptyOutDir: true,
  },
  define: {
    'process.env': {
      VITE_APIKEY: process.env.APIKEY,
      VITE_AUTHDOMAIN: process.env.AUTHDOMAIN,
      VITE_PROJECTID: process.env.PROJECTID,
      VITE_STORAGEBUCKET: process.env.STORAGEBUCKET,
      VITE_MESSAGINGSENDERID: process.env.MESSAGINGSENDERID,
      VITE_APPID: process.env.APPID,
      VITE_MEASUREMENTID: process.env.MEASUREMENTID,
    },
  },
});