
import {
  IonPage,
  setupIonicReact,
  IonContent
} from '@ionic/react';

import TabContainer from '../../components/tab/TabContainer';
import HeaderContainer from '../../components/header/HeaderContainer';
import DashboardContainer from '../../components/dashboard/DashboardContainer';
import HealthCalculatorComponent from '../../components/healthCalculator/HealthCalculatorComponent'; 

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import '../../theme/variables.css';
import './MainPage.css'
import React from 'react';

setupIonicReact();

const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>('home'); 

  const handleTabChange = (tab: string) => {
    setActiveTab(tab); 
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardContainer />;
      case 'user':
        return <HealthCalculatorComponent />;
      default:
        return <DashboardContainer />;
    }
  };

  return (
    <IonPage>
      <HeaderContainer />
      <IonContent >
        <div className='main-content'>
          <div className="content">
            {renderContent()}      
          </div>
        </div>
      </IonContent>
      <TabContainer onTabChange={handleTabChange} />
    </IonPage>
  );
};

export default MainPage;
