import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonIcon
} from '@ionic/react';
import { documentTextOutline, openOutline } from 'ionicons/icons';

const PDFS = [
  { name: 'Définitions (sédentarité & activité physique)', path: '/assets/pdfs/3.pdf' },
  { name: 'Recommandations OMS', path: '/assets/pdfs/7.pdf' },
  { name: 'Impacts sanitaires (sédentarité)', path: '/assets/pdfs/2.pdf' },
  { name: 'Impacts sanitaires (AP)', path: '/assets/pdfs/5.pdf' },
  { name: 'État des lieux', path: '/assets/pdfs/4.pdf' },
  { name: 'Profils', path: '/assets/pdfs/6.pdf' },
  { name: 'Synthèse', path: '/assets/pdfs/9.pdf' },
  { name: '12 défis de 2025', path: '/assets/pdfs/1.pdf' },
];

console.log ("Hello")

const PdfListPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          <IonIcon icon={documentTextOutline} style={{ marginRight: 8 }} />
          Documents PDF
        </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        {PDFS.map((pdf, i) => (
          <IonItem key={i}>
            <IonLabel>{pdf.name}</IonLabel>
            <IonButton
              slot="end"
              fill="outline"
              href={pdf.path}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IonIcon icon={openOutline} slot="end" />
              Voir
            </IonButton>
          </IonItem>
        ))}
      </IonList>
    </IonContent>
  </IonPage>
);

export default PdfListPage;
