import { db } from '../firebase.config.js';
import { collection, getDocs } from 'firebase/firestore';

// Récupérer les updates depuis Firebase
export const getUpdate = async () => {
    try {
        const updatesRef = collection(db, 'changelogs');
        const snapshot = await getDocs(updatesRef);
        const updatesData = snapshot.docs.map(doc => doc.data());

        // tri des updates par ordre alphabétique
        updatesData.sort((a, b) => {
            return a.titre.localeCompare(b.titre);
        });

        // formatage des données pour les envoyer au client
        return updatesData.map(update => {
            return {
                version : update.version,
                date : update.date,
                titleVisu: "Ajouts",
                titleContent: update.ajouts,
                titleDev: "Changements",
                contentDev: update.changements,
            };
        });
    } catch (error) {
        console.error('Error getting updates:', error);
        throw error;
    }
}


// getUpdate().then((updates) => {
//     console.log(updates);
// }).catch((error) => {
//     console.error('Error fetching updates:', error);
// });