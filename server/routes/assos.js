import { db } from '../firebase.config.js';
import { collection, getDocs } from 'firebase/firestore';

// Récupérer les associations depuis Firebase
export const getAssos = async () => {
    try {
        const associationsRef = collection(db, 'associations');
        const snapshot = await getDocs(associationsRef);
        const associationsData = snapshot.docs.map(doc => doc.data());

        // tri des associations par ordre alphabétique
        associationsData.sort((a, b) => {
            return a.titre.localeCompare(b.titre);
        });

        // formatage des données pour les envoyer au client
        return associationsData.map(assoc => {
            return {
                name: assoc.titre,
                desc: assoc.description,
                contact: assoc.lienContact,
                image: assoc.image
            };
        });
    } catch (error) {
        console.error('Error getting associations:', error);
        throw error;
    }
}


// getAssos().then((associations) => {
//     console.log(associations);
// }).catch((error) => {
//     console.error('Error fetching associations:', error);
// });