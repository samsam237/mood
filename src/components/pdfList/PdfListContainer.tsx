import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonCardContent,
  IonCard
} from '@ionic/react';
import { documentTextOutline, eyeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

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
                onClick={() => history.push(`/main/pdfs/view/${encodeURIComponent(pdf.file)}`)}
              >
                <IonIcon icon={eyeOutline} slot="start" />
                Ouvrir
              </IonButton>
            </IonCardContent>
          </IonCard>
        ))}
      </IonList>
    </div>
  );
};

export default PdfListContainer;
