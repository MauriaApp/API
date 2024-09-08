
"use client";

import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { db } from "../../firebase.config";

export default function HomeMessages() {
    const [messages, setMessages] = useState<Message[]>([]);

    const [newTitre, setNewTitre] = useState<string>('');
    const [newDescription, setNewDescription] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            const messagesRef = collection(db, 'messages');
            const snapshot = await getDocs(messagesRef);
            const messagesData = snapshot.docs.map(doc => doc.data() as Message);
            setMessages(messagesData);
        };
        fetchData();
    }, []);

    const updateMessage = async () => {
        try {
            await setDoc(doc(db, 'messages', "0"), {
                id: "0",
                titre: newTitre,
                description: newDescription
            });
            setMessages([
                {
                    id: "0",
                    titre: newTitre,
                    description: newDescription
                }
            ]);
        } catch (error) {
            console.error("Erreur lors de la soumission :", error);
        }
    }


    return (
        <>
            <Card href="#" className="max-w-sm">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {messages[0]?.titre}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    {messages[0]?.description}
                </p>
            </Card>



            <Card className="max-w-sm">
                <form className="flex flex-col gap-4">
                    <div>
                        <div className="block">
                            <Label htmlFor="titre" value="Titre" />
                        </div>
                        <TextInput value={messages[0].titre} id="titre" type="text" placeholder={"Nouveau titre"} required onChange={(e) => setNewTitre(e.target.value)} />
                    </div>

                    <div>
                        <div className=" block">
                            <Label htmlFor="description" value="Description" />
                        </div>
                        <TextInput value={messages[0].description} id="description" type="text" placeholder={"Nouvelle description"} required onChange={(e) => setNewDescription(e.target.value)} />
                    </div>

                    <Button type="submit" onClick={updateMessage}>Mettre à jour</Button>
                </form>
            </Card>
        </>
    );
}


