import { useEffect, useState } from 'react';
import { Redirect, Route  } from 'react-router-dom';

import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Home from './pages/home/Home';
import MainPage from './pages/main/MainPage';
import Welcome from './pages/welcome/Welcome';
import Login from './pages/login/Login';
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
import './theme/variables.css';
import './App.css'

setupIonicReact();


interface User {
  uid?: string;
  email?: string | null;
  displayName?: string;
  photoURL?: string;
}

/* const auth = getAuth();

const [user, setUser] = useState<User | null>(null);

const parseUser = (user_: any): User | null => {
  if (!user_) {
    return null;
  }

  return {
    uid: user_.uid,
    email: user_.email,
    displayName: user_.displayName,
    photoURL: user_.photoURL,
  };
};

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user_ ) => {
    if (user_) {
      setUser(parseUser(user_));
    } else {
      setUser(null);
    }
    //setUser(user_);
  });

  return () => unsubscribe();
}, []);
 */
const App: React.FC = () => ( 
  
  <IonApp>
    <IonReactRouter >
      <IonTabs className='ion-tabs'>
        <IonRouterOutlet className='ion-router-outlet'>
          <Route path="/home" component={Home} exact />
          <Redirect from="/" to="/home" exact />
          <Route path="/main" component={MainPage} exact />
          <Route path="/welcome" component={Welcome} exact />
          <Route path="/login" component={Login} exact />
        </IonRouterOutlet>        
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
