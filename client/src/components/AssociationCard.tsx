import { doc, deleteDoc } from "firebase/firestore";
import { Card, Modal, Avatar, Button } from "flowbite-react";
import { useState } from "react";
import { db } from "../../firebase.config";
import { ModalNewAsso } from "./ModalNewAsso";

export function AssociationCard(association: Association) {
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [changeModal, setChangeModal] = useState(false);
  const [editAssociation, setEditAssociation] = useState<Association | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      // Utilisation de l'ID pour référencer le document à supprimer
      const associationDocRef = doc(db, 'associations', association.id);
      await deleteDoc(associationDocRef);

      setDeleteModal(false);
      setOpenModal(false);

      // Optionnel : Réactualise l'interface utilisateur ici si nécessaire
    } catch (error) {
      console.error("Erreur lors de la suppression de l'association :", error);
      setError("Une erreur s'est produite lors de la suppression. Veuillez réessayer.");
      setDeleteModal(false);
      setOpenModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        className="max-w-32 hover:drop-shadow-lg hover:scale-105 transition delay-15"
        imgSrc={association.image}
        onClick={() => setOpenModal(true)}
      >
        <h5 className="font-bold tracking-tight text-gray-900 dark:text-white">
          {association.titre}
        </h5>
      </Card>

      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)}>
        <Modal.Body className="flex flex-col gap-10 items-center justify-center">
          <Avatar
            rounded
            img={association.image ? association.image : undefined}
            size="lg"
          >
            <div className="font-bold tracking-tight text-gray-900 dark:text-white">
              {association.titre}
            </div>
          </Avatar>

          <div className='text-center w-full text-gray-500 dark:text-gray-400 px-4'>
            <p>{association.description}</p>
          </div>

          <div className="flex justify-center gap-4">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              {"Fermer"}
            </Button>
            <Button
              color="blue"
              onClick={() => {
                setEditAssociation(association);
                setChangeModal(true);
              }}
            >
              {"Modifier"}
            </Button>
            <Button color="failure" onClick={() => setDeleteModal(true)}>
              {"Supprimer"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={deleteModal} size="md" onClose={() => setDeleteModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Voulez-vous vraiment supprimer {association.titre} ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="gray" onClick={() => setDeleteModal(false)}>
                Non, j'annule
              </Button>
              <Button color="failure" onClick={() => handleDelete()} disabled={loading}>
                {loading ? 'Suppression en cours...' : 'Oui, supprimer'}
              </Button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </Modal.Body>
      </Modal>

      {changeModal && (
        <ModalNewAsso
          association={editAssociation}
          open={changeModal}
          // Ajouter une fonction de rappel pour fermer le modal
          onClose={() => {setChangeModal(false); setOpenModal(false);}}
        />
      )}
    </>
  );
}
