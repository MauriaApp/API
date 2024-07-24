"use client";

import { Button, FileInput, Label, Modal, TextInput, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";

import { db, storage } from '../../firebase.config.ts';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { FaCloudArrowUp } from "react-icons/fa6";

export function ModalNewAsso({ association, open, onClose }: { association?: Association; open: boolean, onClose?: () => void }) {
    const [openModal, setOpenModal] = useState(false);

    const [nom, setNom] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [lienContact, setLienContact] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setOpenModal(open);
        }
        if (association) {
            setNom(association.titre);
            setDescription(association.description);
            setLienContact(association.lienContact);
            setImageUrl(association.image);
        }
    }, [association, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nom || !description) {
            setError('Tous les champs sont requis.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            let newImageUrl = imageUrl; // Utiliser l'état actuel comme point de départ

            if (image !== null) {
                const getNewUrl = async () => {
                    // Compress the image
                    const compressedImage = await compressImage(image);

                    // generate a new name for the image
                    const randomId = Math.random().toString(36).substring(2);

                    // Upload the image
                    const imageRef = ref(storage, `associations/${randomId}`);
                    await uploadBytes(imageRef, compressedImage);

                    // Get the image URL
                    const url = await getDownloadURL(imageRef);
                    return url;
                }

                newImageUrl = await getNewUrl();
            }

            const associationData = {
                titre: nom,
                description: description,
                lienContact: lienContact,
                image: newImageUrl
            };

            if (!association) {
                console.log("Ajout d'une nouvelle association");
                // Save association data
                const associationsRef = collection(db, 'associations');
                const docRef = await addDoc(associationsRef, associationData);

                // Optionnel : Ajouter l'ID au document
                await setDoc(doc(db, 'associations', docRef.id), {
                    ...associationData,
                    id: docRef.id
                });
            } else {
                console.log("Mise à jour de l'association");

                // Update association data
                await setDoc(doc(db, 'associations', association.id), {
                    ...associationData,
                    id: association.id
                });
            }

            // Reset form
            setNom('');
            setDescription('');
            setLienContact('');
            setImage(null);
            setImageUrl(null); // Réinitialiser l'URL de l'image
            onClose;
        } catch (error) {
            console.error("Erreur lors de la soumission :", error);
        }
    };

    const compressImage = async (file: File) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        };
        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error("Erreur lors de la compression de l'image :", error);
            return file;
        }
    };

    return (
        <>
            <Modal show={openModal} size="md" onClose={() => onClose && setOpenModal(false)}>
                <Modal.Header>Ajouter une Association</Modal.Header>
                <Modal.Body className="space-y-6">
                    {error && <p className="text-red-500">{error}</p>}
                    <form onSubmit={handleSubmit} className=" flex flex-col gap-4">
                        <div>
                            <div className="block">
                                <Label htmlFor="nom" value="Nom de l'association" />
                            </div>
                            <TextInput
                                id="nom"
                                type="text"
                                required
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="block">
                                <Label htmlFor="lienContact" value="Lien" />
                            </div>
                            <TextInput
                                id="lienContact"
                                type="link"
                                required
                                value={lienContact}
                                onChange={(e) => setLienContact(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="block">
                                <Label htmlFor="description" value="Description" />
                            </div>
                            <Textarea
                                id="description"
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="block">
                                <Label htmlFor="image" value="Image / Logo" />
                            </div>
                            <div className="flex w-full items-center justify-center">
                                <Label
                                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <FileInput
                                        id="image"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const file = e.target.files[0];
                                                if (file && file.type.startsWith('image/')) {
                                                    setImage(file);
                                                } else {
                                                    setError("Veuillez sélectionner une image valide.");
                                                }
                                            }
                                        }}
                                    />
                                    {!image ? (
                                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                            <FaCloudArrowUp className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Cliquez</span> ou "Glissez-déposez"
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG ou JPG
                                            </p>
                                        </div>
                                    ) : (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Preview"
                                            className="h-64 w-full object-cover rounded-lg"
                                        />
                                    )}
                                </Label>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Chargement...' : 'Ajouter !'}
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}
