
import { collection, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { query, where, getDocs, updateDoc } from 'firebase/firestore';
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
  };

import fs from 'fs';
import path from 'path';
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


const addLien = async ({ titre, newURL }) => {
    try {
        // Création de la référence à la collection
        const associationRef = collection(db, 'associations');

        // Création de la requête pour chercher le document avec le titre donné
        const q = query(associationRef, where('titre', '==', titre));
        
        // Exécution de la requête et récupération du snapshot
        const querySnapshot = await getDocs(q);
        
        // Vérification si le document existe
        if (!querySnapshot.empty) {
            // S'il existe, on met à jour le premier document trouvé
            const docToUpdate = querySnapshot.docs[0];
            await updateDoc(docToUpdate.ref, { lienContact: newURL });
            
            console.log(`Document with titre ${titre} updated successfully.`);
        } else {
            console.error(`No document found with titre ${titre}.`);
            // Gérer le cas où aucun document n'est trouvé
        }
    } catch (error) {
        console.error("Error updating document:", error);
    }
};


const data = fs.readFileSync(path.resolve('client/setupAssos/assos.json'), 'utf8');
const liens = JSON.parse(data);

for (const key in liens) {
    if (liens.hasOwnProperty(key)) {
        const assoc = liens[key];
        // console.log(`Nom: ${assoc.name}`);
        // console.log(`Description: ${assoc.desc}`);
        // console.log(`Contact: ${assoc.contact}`);
        // console.log(`Image ID: ${assoc.image}`);
        // console.log("\n");
        addLien({
            titre: assoc.name,
            newURL: assoc.contact,
        });
    }
}