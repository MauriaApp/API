import { AssociationCard } from "../components/AssociationCard";
import { useEffect, useState } from 'react';
import { db } from '../../firebase.config.ts';
import { collection, getDocs } from 'firebase/firestore';
import { Button, TextInput } from "flowbite-react";
import { ModalNewAsso } from "../components/ModalNewAsso.tsx";

import { FaPlus, FaMagnifyingGlass } from "react-icons/fa6";



export default function Associations() {
    const [associations, setAssociations] = useState<Association[]>([]);
    const [seach, setSearch] = useState<string>('');

    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const associationsRef = collection(db, 'associations');
            const snapshot = await getDocs(associationsRef);
            const associationsData = snapshot.docs.map(doc => doc.data() as Association);
            setAssociations(associationsData);
        };
        fetchData();
    }, [openModal]);

    return (
        <>
            <Button size="xl" className="drop-shadow-xl rounded-full w-16 h-16 fixed right-10 bottom-10 z-10 flex items-center justify-center" onClick={() => setOpenModal(true)}>
                <FaPlus className="w-6 h-6" />
            </Button>
            <div className="transition ease-in-out delay-35 fixed top-8 w-80 p-1 drop-shadow-xl backdrop-blur-3xl rounded-lg opacity-70 hover:opacity-95 z-10">
                <TextInput placeholder="Chercher par nom" rightIcon={FaMagnifyingGlass} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
                {/* <Button onClick={() => setOpenModal(true)}>Ajouter une association</Button> */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {associations
                        .filter(association => association.titre.toLowerCase().includes(seach.toLowerCase()))
                        .sort((a, b) => a.titre.localeCompare(b.titre)) // Sort associations by title
                        .map((association, index) => (
                            <AssociationCard
                                key={index}
                                {...association}
                            />
                        ))}
                </div>
            </div>
            <ModalNewAsso open={openModal} onClose={() => setOpenModal(false)} />
        </>
    );
}