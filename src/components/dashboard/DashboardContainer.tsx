import React from 'react';
import './DashboardContainer.css'; 
import { IonButton } from '@ionic/react';
import AdviceContainer from '../advice/AdviceContainer'


const DashboardContainer: React.FC = () => {
  return (
    <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card">
            <div className="circle "><img src="images/water-icon.png" alt="water" /></div>
            <div className="card-content">
              <p className='card-content-title'>Hydratation</p>
              <p>
                <span>1.5 L </span> / 2L
              </p>
            </div>            
          </div>

          <IonButton
            color="success"
            className="green-button"
            onClick={() => {}}
          >
            J'ai bu <img src="images/ok-icon.png" alt="" />
          </IonButton>
        </div>
        <div className="dashboard-card">
          <div className="card">
            <div className="circle"><img src="images/move-icon.png" alt="water" /></div>
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
            J'ai bougé <img src="images/ok-icon.png" alt="" />
          </IonButton>

        </div>
        <AdviceContainer />
    </div>
  );
};

export default DashboardContainer;
