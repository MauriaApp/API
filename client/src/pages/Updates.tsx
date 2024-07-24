
"use client";

import { collection, doc, setDoc, addDoc, getDocs } from 'firebase/firestore';
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { db } from "../../firebase.config";

export default function Updates() {
    const [update, setUpdate] = useState<Update[]>([]);

    const [newVersion, setNewVersion] = useState<string>('');
    const [newDate, setNewDate] = useState<string>('');
    const [newAjouts, setNewAjouts] = useState<string>('');
    const [newChangements, setNewChangements] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            const updatesRef = collection(db, 'changelogs');
            const snapshot = await getDocs(updatesRef);
            const updatesData = snapshot.docs.map(doc => doc.data() as Update);
            setUpdate(updatesData);
        };
        fetchData();
    }, []);

    const addUpdate = async () => {

        try {
            const docRef = await addDoc(collection(db, 'changelogs'), {
                version: newVersion,
                date: newDate,
                ajouts: newAjouts,
                changements: newChangements
            });

            await setDoc(doc(db, 'changelogs', docRef.id), {
                id: docRef.id,
                version: newVersion,
                date: newDate,
                ajouts: newAjouts,
                changements: newChangements
            });

        } catch (error) {
            console.error("Erreur lors de la soumission :", error);
        }
    }


    return (
        <>
            {update.map((update) => (
                <Card key={update.id} className="max-w-sm">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {update.version}
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        {update.date}
                    </p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        {update.ajouts}
                    </p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        {update.changements}
                    </p>
                </Card>
            ))}



            <Card className="max-w-sm">
                <form className="flex flex-col gap-4">
                    <div>
                        <div className="block">
                            <Label htmlFor="version" value="Version" />
                        </div>
                        <TextInput id="version" value={newVersion} onChange={(e) => setNewVersion(e.target.value)} />
                    </div>

                    <div>
                        <div className=" block">
                            <Label htmlFor="date" value="Date" />
                        </div>
                        <TextInput id="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    </div>

                    <div>
                        <div className=" block">
                            <Label htmlFor="ajouts" value="Ajouts" />
                        </div>
                        <TextInput id="ajouts" value={newAjouts} onChange={(e) => setNewAjouts(e.target.value)} />
                    </div>

                    <div>
                        <div className=" block">
                            <Label htmlFor="changements" value="Changements" />
                        </div>
                        <TextInput id="changements" value={newChangements} onChange={(e) => setNewChangements(e.target.value)} />
                    </div>

                    <Button onClick={addUpdate}>Ajouter</Button>
                </form>
            </Card>
        </>
    );
}


