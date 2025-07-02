import React, { useEffect, useState } from 'react';
import './AdviceContainer.css'; 
// import myImage from '../../assets/images/favicon.png'; // Importez l'image


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
    <div className="advice-container">
      <div className="advice-title">Conseil du jour</div>
      <div className="advice-content">
        <div className="advice-content-img">
          <img src="images/advice.png" alt="advice-img" />
        </div>
        <div className="advice-content-text">
          {advice}
        </div>
      </div>
    </div>
  );
};

export default AdviceContainer;
