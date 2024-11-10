import React from 'react';
import './DashboardContainer.css'; 
import { IonButton } from '@ionic/react';
import AdviceContainer from '../advice/AdviceContainer'


const DashboardContainer: React.FC = () => {
  return (
    <div className="dashboard-grid">
      <AdviceContainer />
      <div className="dashboard-card">
        <div className="card">          
          <div className="card-content">

            <div className='card-content-title'>
              <div className='card-content-title-content'>Hydratation</div>
              <div className="circle "><img src="images/water-icon.png" alt="water" /></div>
            </div>
            <div className="card-content-main">
              <div className="user-data">
                <span className="user-value">1.5</span>litres
              </div>
              <div className="user-objectif">
                objectif : <span className="user-objectif-value">3</span>Litres
              </div>
            </div>
          </div>            
        </div>

        <div className="button green-button" onClick={() => {}}>
          J'ai bu <img src="images/ok-icon.png" alt="" />
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card">
          
          <div className="card-content">
            <div className='card-content-title'>
              <div className='card-content-title-content'>Mouvements</div>
              <div className="circle"><img src="images/move-icon.png" alt="water" /></div>
            </div>
            <div className="card-content-main">
              <div className="user-data">
                <span className="user-value">06</span> Mouvements
              </div>
              <div className="user-objectif">
                objectif : <span className="user-objectif-value">12</span>
              </div>
            </div>
          </div>
        </div>
        <div className="button green-button" onClick={() => {}}>
          J'ai bougé <img src="images/ok-icon.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
