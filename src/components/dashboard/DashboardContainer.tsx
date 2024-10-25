import React from 'react';
import './DashboardContainer.css'; 
import { IonButton } from '@ionic/react';
import AdviceContainer from '../advice/AdviceContainer'


const DashboardContainer: React.FC = () => {
  return (
    <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card">
            <div className="circle bg-blue"></div>
            <div className="card-content">
              <p className='card-content-title'>Hydratation</p>
              <p>
                <span>1.5 L </span> / 2L
              </p>
            </div>            
          </div>

          <IonButton
            color="primary"
            onClick={() => {}}
          >
            Ajouter
          </IonButton>
        </div>
        <div className="dashboard-card">
          <div className="card">
            <div className="circle bg-green"></div>
            <div className="card-content">
              <p className='card-content-title'>Mouvements</p>
              <p>
                <span>120 minutes </span> / 1h
              </p>
            </div>
          </div>

          <IonButton
            color="success"
            className='green-button'
            onClick={() => {}}
          >
            Ajouter
          </IonButton>

        </div>
        <AdviceContainer />
    </div>
  );
};

export default DashboardContainer;
