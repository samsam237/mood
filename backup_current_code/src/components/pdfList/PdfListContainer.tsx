import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonCardContent, IonCard, IonModal, IonButtons
} from '@ionic/react';
import { documentTextOutline, eyeOutline, closeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PdfViewerContainer from '../pdfViewer/PdfViewerContainer';

const PDFS = [
  { name: 'Définitions (sédentarité & activité physique)', file: '3.pdf' },
  { name: 'Recommandations OMS', file: '7.pdf' },
  { name: 'Impacts sanitaires (sédentarité)', file: '2.pdf' },
  { name: 'Impacts sanitaires (AP)', file: '5.pdf' },
  { name: 'État des lieux', file: '4.pdf' },
  { name: 'Profils', file: '6.pdf' },
  { name: 'Synthèse', file: '9.pdf' },
  { name: '12 défis de 2025', file: '1.pdf' },
];

const PdfListContainer: React.FC = () => {
  const history = useHistory();
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <IonList>
        {PDFS.map((pdf, i) => (
          <IonCard  key={i}>
            <IonCardContent >

              <IonLabel>{pdf.name}</IonLabel>

              {/* Voir dans l'app */}
              <IonButton
                slot="end"
                onClick={() => {
                  setSelectedPdf(pdf.file);
                  setIsModalOpen(true);
                }}
              >
                <IonIcon icon={eyeOutline} slot="start" />
                Ouvrir
              </IonButton>
            </IonCardContent>
          </IonCard>
        ))}
      </IonList>

      {/* Modal pour afficher le PDF */}
      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Visualisation PDF</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsModalOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {selectedPdf && (
            <PdfViewerContainer 
              file={selectedPdf} 
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </IonContent>
      </IonModal>
    </div>
  );
};

export default PdfListContainer;
