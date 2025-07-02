import {
    IonModal,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonText
  } from '@ionic/react';
  import { useEffect, useState } from 'react';
  
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };
  
  const DailyAdviceModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [advice, setAdvice] = useState('');
  
    useEffect(() => {
      const fetchAdvice = async () => {
        try {
          const res = await fetch('/data/health-tips.json');
          const tips: string[] = await res.json();
          const index = getDayOfYear() % tips.length;
          setAdvice(tips[index]);
          setIsOpen(true);
        } catch (e) {
          console.error("Erreur de chargement du conseil", e);
        }
      };
  
      fetchAdvice();
    }, []);
  
    return (
      <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} animated={true}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Conseil Santé du Jour</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" style={{ textAlign: 'center' }}>
          <IonText>
            <p style={{ fontSize: '1.2rem', marginTop: '1.5rem' }}>{advice}</p>
          </IonText>
          <IonButton expand="block" onClick={() => setIsOpen(false)} style={{ marginTop: '2rem' }}>
            J'ai compris
          </IonButton>
        </IonContent>
      </IonModal>
    );
  };
  
  export default DailyAdviceModal;
  