import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { home, fitness, calendar, personCircle, ribbon, flagSharp, barbellOutline, calculatorOutline } from 'ionicons/icons';

import './TabContainer.css';
import {TabContainerProps} from './TabContainerProps'

const TabContainer: React.FC<TabContainerProps> = ({ onTabChange }) => {
  return (
    <IonTabBar slot='bottom' className='ion-tab-bar-content'>
        <IonTabButton className="custom-tab-button" tab="home" onClick={() => onTabChange('home')}>
            <div>
                <IonIcon icon={home} />
                <IonLabel>Accueil</IonLabel>
            </div>
        </IonTabButton>
        <IonTabButton className="custom-tab-button" tab="calendar" onClick={() => onTabChange('calendar')}>
            <IonIcon icon={calendar} />
        </IonTabButton>
        <IonTabButton className="custom-tab-button" tab="fitness" onClick={() => onTabChange('fitness')}>
            <IonIcon icon={barbellOutline} />
        </IonTabButton>
        <IonTabButton className="custom-tab-button" tab="user" onClick={() => onTabChange('user')}>
            <IonIcon icon={personCircle} />
        </IonTabButton>
        {/* <IonTabButton className="custom-tab-button" tab="about" onClick={() => onTabChange('about')}>
            <IonIcon icon={ribbon} />
        </IonTabButton> */}
    </IonTabBar>
  );
};

export default TabContainer;
