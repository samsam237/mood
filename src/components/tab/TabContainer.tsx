import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { home, fitness, water, heart, settings, notifications, calendar, trophy, personCircle, thumbsUp, ribbon } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router';
import MainPage from '../../pages/main/MainPage'

import './TabContainer.css';
import {TabContainerProps} from './TabContainerProps'

const TabContainer: React.FC<TabContainerProps> = ({ onTabChange }) => {
  return (
    <IonTabs className='ion-tab-bar-container'>
        <IonRouterOutlet>
            {/* <Route path="/main" component={MainPage} exact /> */}
        </IonRouterOutlet>    

        <div className="ion-tab-bar">
            <IonTabBar>

                <IonTabButton className="custom-tab-button" tab="home" onClick={() => onTabChange('home')}>
                    <div>
                        <IonIcon icon={home} />
                        <IonLabel>Accueil</IonLabel>
                    </div>
                </IonTabButton>

                <IonTabButton className="custom-tab-button" tab="notifications" onClick={() => onTabChange('notifications')}>
                    <IonIcon icon={notifications} />
                </IonTabButton>

                <IonTabButton className="custom-tab-button" tab="calendar" onClick={() => onTabChange('calendar')}>
                    <IonIcon icon={calendar} />
                </IonTabButton>

                <IonTabButton className="custom-tab-button" tab="fitness" onClick={() => onTabChange('fitness')}>
                    <IonIcon icon={fitness} />
                </IonTabButton>

                <IonTabButton className="custom-tab-button" tab="user" onClick={() => onTabChange('user')}>
                    <IonIcon icon={personCircle} />
                </IonTabButton>

                <IonTabButton className="custom-tab-button" tab="about" onClick={() => onTabChange('about')}>
                    <IonIcon icon={ribbon} />
                </IonTabButton>

            </IonTabBar>
        </div>
      
    </IonTabs>
  );
};

export default TabContainer;
