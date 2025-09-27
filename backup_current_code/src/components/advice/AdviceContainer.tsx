import React, { useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { bulbOutline } from 'ionicons/icons';
import './AdviceContainer.css'; 
// import myImage from '../../assets/images/favicon.png'; // Importez l'image


/* const AdviceContainer: React.FC = () => {
  const [advice, setAdvice] = useState<string>("");

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const res = await fetch('/data/health-tips.json');
        const tips: string[] = await res.json();

        // Utiliser le jour de l’année (ex: 0 à 364) pour varier tous les jours
        const today = new Date();
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
          (1000 * 60 * 60 * 24)
        );

        const adviceOfDay = tips[dayOfYear % tips.length];
        setAdvice(adviceOfDay);
      } catch (err) {
        const res = await fetch('http://localhost:5173/data/health-tips.json');

        const tips: string[] = await res.json();

        // Utiliser le jour de l’année (ex: 0 à 364) pour varier tous les jours
        const today = new Date();
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
          (1000 * 60 * 60 * 24)
        );

        const adviceOfDay = tips[dayOfYear % tips.length];
        setAdvice(adviceOfDay);

        console.error("Erreur lors du chargement des conseils : ", err);
        //setAdvice("Buvez de l’eau et prenez soin de vous !");
      }
    };

    fetchAdvice();
  }, []); */
  
  {/* <div className="advice-container">
    <div className="advice-title">Conseil du jour</div>
    <div className="advice-content">
      <div className="advice-content-img">
        <img src="images/advice.png" alt="advice-img" />
      </div>
      <div className="advice-content-text">
        {advice}
      </div>
    </div>
  </div> */}
 /*  return (
    <div>
      <Card className="bg-yellow-100 border-yellow-400 rounded-2xl shadow-md p-4 flex items-start gap-3">
        <Lightbulb className="text-yellow-600 w-6 h-6 mt-1 animate-pulse" />
        <CardContent>
          <p className="font-semibold text-gray-900">Conseil du jour</p>
          <p className="text-gray-700">{advice}</p>
        </CardContent>
      </Card>
    </div>
  );
}; */

/* type AdviceContainerProps = {
  advice: string; // texte du conseil du jour
}; */

const AdviceContainer: React.FC = () => {
  const [advice, setAdvice] = useState<string>("");

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const res = await fetch('/data/health-tips.json');
        const tips: string[] = await res.json();

        // Utiliser le jour de l’année (ex: 0 à 364) pour varier tous les jours
        const today = new Date();
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
          (1000 * 60 * 60 * 24)
        );

        const adviceOfDay = tips[dayOfYear % tips.length];
        setAdvice(adviceOfDay);
      } catch (err) {
        const res = await fetch('http://localhost:5173/data/health-tips.json');

        const tips: string[] = await res.json();

        // Utiliser le jour de l’année (ex: 0 à 364) pour varier tous les jours
        const today = new Date();
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
          (1000 * 60 * 60 * 24)
        );

        const adviceOfDay = tips[dayOfYear % tips.length];
        setAdvice(adviceOfDay);

        console.error("Erreur lors du chargement des conseils : ", err);
        //setAdvice("Buvez de l’eau et prenez soin de vous !");
      }
    };

    fetchAdvice();
  }, []);

  return (
    <IonCard className="advice-card">
      <IonCardContent className="advice-content">
        <IonIcon icon={bulbOutline} className="advice-icon" />
            <div className="advice-texts">
              <div className="advice-content-img">
                <img src="images/advice.png" alt="advice-img" />
              </div>
              <div className="advice-content-text">
                {advice}
              </div>
            </div>
      </IonCardContent>
    </IonCard>
  );
};

export default AdviceContainer;
