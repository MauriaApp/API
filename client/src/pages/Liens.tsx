
"use client";

import { collection, doc, setDoc, addDoc, getDocs } from 'firebase/firestore';
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { db } from "../../firebase.config";

export default function Liens() {
    const [liens, setMessages] = useState<Lien[]>([]);

    const [newTitre, setNewTitre] = useState<string>('');
    const [newDescription, setNewDescription] = useState<string>('');
    const [newURL, setNewURL] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            const liensRef = collection(db, 'liens');
            const snapshot = await getDocs(liensRef);
            const liensData = snapshot.docs.map(doc => doc.data() as Lien);
            setMessages(liensData);
        };
        fetchData();
    }, []);

    const addLien = async () => {
        try {
            const docRef = await addDoc(collection(db, 'liens'), {
                titre: newTitre,
                url: newURL,
                description : newDescription
            });

            await setDoc(doc(db, 'liens', docRef.id), {
                id: docRef.id,
                titre: newTitre,
                url: newURL,
                description : newDescription
            });

        } catch (error) {
            console.error("Erreur lors de la soumission :", error);
        }
    }


    return (
        <>
            {liens.map((lien) => (
                <Card key={lien.id} className="max-w-sm">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {lien.titre}
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        {lien.url}
                    </p>
                </Card>
            ))}



            <Card className="max-w-sm">
                <form className="flex flex-col gap-4">
                    <div>
                        <div className="block">
                            <Label htmlFor="titre" value="Titre" />
                        </div>
                        <TextInput id="titre" type="text" placeholder={"Nouveau titre"} required onChange={(e) => setNewTitre(e.target.value)} />
                    </div>

                    <div>
                        <div className=" block">
                            <Label htmlFor="description" value="Description" />
                        </div>
                        <TextInput id="description" type="text" placeholder={"Description du site"} required onChange={(e) => setNewDescription(e.target.value)} />
                    </div>


                    <div>
                        <div className=" block">
                            <Label htmlFor="lien" value="Lien" />
                        </div>
                        <TextInput id="lien" type="text" placeholder={"Lien du site"} required onChange={(e) => setNewURL(e.target.value)} />
                        <p className="text-sm text-red-600 dark:text-red-400">
                            Merci de vérifier le lien avant de le soumettre
                        </p>
                    </div>

                    <Button onClick={addLien}>Ajouter</Button>
                </form>
            </Card>
        </>
    );
}


