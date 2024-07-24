import { db } from '../firebase.config.js';
import { collection, getDocs } from 'firebase/firestore';

// Récupérer les messages depuis Firebase
export const getMsg = async () => {
    try {
        const messagesRef = collection(db, 'messages');
        const snapshot = await getDocs(messagesRef);
        const messagesData = snapshot.docs.map(doc => doc.data());

        // tri des messages par ordre alphabétique
        messagesData.sort((a, b) => {
            return a.titre.localeCompare(b.titre);
        });

        // formatage des données pour les envoyer au client
        return {
                title: messagesData[0].titre,
                message: messagesData[0].description,
        };
    } catch (error) {
        console.error('Error getting messages:', error);
        throw error;
    }
}


// getMsg().then((messages) => {
//     console.log(messages);
// }).catch((error) => {
//     console.error('Error fetching messages:', error);
// });