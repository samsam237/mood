import React from 'react';
import './AdviceContainer.css'; 
// import myImage from '../../assets/images/favicon.png'; // Importez l'image


const AdviceContainer: React.FC = () => {
  return (
    <div className="advice-container">
      <div className="advice-title">Conseil du jour</div>
      <div className='advice-content'>
        <div className="advice-content-img">
            <img src="images/advice.png" alt="advice-img" />
        </div>

        <div className="advice-content-text">
            Penser à changer régulièrement de position.
        </div>
      </div>
    </div>
  );
};

export default AdviceContainer;
