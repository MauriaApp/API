import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';

export const fetchLogs = async () => {
    const logsCollection = collection(db, 'logs');
    const logsSnapshot = await getDocs(logsCollection);
    const logs = logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return logs as Log[];
};
