import { db } from '../firebase.config.js';
import { collection, addDoc } from 'firebase/firestore';

export const logRequests = async (req, res, next) => {
    const start = Date.now(); // Capture le temps de début de la requête

    // Collecte les informations initiales sur la requête
    const log = {
        method: req.method,
        url: req.originalUrl, // Utilisation de originalUrl pour inclure la query string
        timestamp: new Date().toISOString(),
        ip: req.ip, 
        userAgent: req.get('User-Agent'),
    };

    // Ajoute un listener pour la fin de la réponse
    res.on('finish', async () => {
        // Enrichit le log avec les informations disponibles après la réponse
        log.duration = Date.now() - start; // Durée de la requête en ms
        log.statusCode = res.statusCode;
        log.errorDetails = res.statusCode >= 400 ? res.locals.errorDetails : null;

        try {
            await addDoc(collection(db, 'logs'), log);
        } catch (error) {
            console.error('Error logging request:', error);
        }
    });

    // Passe à la prochaine middleware ou route
    next();
};
