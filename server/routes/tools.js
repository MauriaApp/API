import { db } from '../firebase.config.js';
import { collection, getDocs } from 'firebase/firestore';

// Récupérer les liens depuis Firebase
export const getTools = async () => {
    try {
        const liensRef = collection(db, 'liens');
        const snapshot = await getDocs(liensRef);
        const liensData = snapshot.docs.map(doc => doc.data());

        // tri des liens par ordre alphabétique
        liensData.sort((a, b) => {
            return a.titre.localeCompare(b.titre);
        });

        // formatage des données pour les envoyer au client
        return liensData.map(lien => {
            return {
                button: lien.titre,
                desc: lien.description,
                url : lien.url
            };
        });
    } catch (error) {
        console.error('Error getting liens:', error);
        throw error;
    }
}

// getTools().then((liens) => {
//     console.log(liens);
// }).catch((error) => {
//     console.error('Error fetching liens:', error);
// });