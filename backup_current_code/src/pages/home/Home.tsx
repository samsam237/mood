import React, {useRef, useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';

import type { Swiper as SwiperType } from 'swiper';

import { storageService } from '../../services/storageService';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import './Home.css'
import { useHistory } from 'react-router-dom';
import HomeSlides from './HomeSlides';

const Home: React.FC = () => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = await storageService.get('user');
      if (storedUser) {
        setUser(storedUser);
        history.replace('/main'); 
      }
    };
    fetchUserData();
  }, [history]);
  

  const swiperRef = useRef<SwiperType | null>(null);

  /* useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  }, [swiperRef.current]); */

  useEffect(() => {
    swiperRef.current?.slideTo(0, 0);
  }, []);


  const goToNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const goToNextPage = () => {
    history.push('/welcome');
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <HomeSlides />
      </IonContent>
    </IonPage>
  )
  /* return (
    <IonPage>
      <IonContent fullscreen>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="swiper"
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          scrollbar={{ draggable: true }}
                    
          spaceBetween={50}
          slidesPerView={1}
          //pagination={{ clickable: true }}
          navigation
          
          loop={true} // Active la boucle infinie
          autoplay={{
            delay: 5000,      
            disableOnInteraction: false, 
          }}
        >

          <SwiperSlide>
            <div className="slide-content">
              <img src="images/data.png"></img>
              <h2>MOOD</h2>              
              <p>Toute activité où une proportion importante de notre corps est un mouvement.</p>
            </div>
            <IonButton size="small" color="danger" className='btn-continue' expand="block" onClick={() => goToNextSlide()}>
              Continuer
            </IonButton>
          </SwiperSlide>

          <SwiperSlide>
            <div className="slide-content">
              <img src="images/data.png"></img>
              <h2>Activité physique</h2>              
              <p>Toute activité où une proportion importante de notre corps est un mouvement.</p>
            </div>
            <IonButton size="small" color="danger" className='btn-continue' expand="block" onClick={() => goToNextSlide()}>
              Continuer
            </IonButton>
          </SwiperSlide>
          
          <SwiperSlide>
            <div className="slide-content">
              <img src="images/data.png"></img>
              <h2>Sédentarité</h2>              
              <p>Tous les moments où nous sommes assis allongé (hors temps de sommeil) et où dépensons très d'énergie.</p>
            </div>
            <IonButton size="small" color="danger" className='btn-continue' expand="block" onClick={() => goToNextSlide()}>
              Continuer
            </IonButton>
          </SwiperSlide>

          <SwiperSlide>
            <div className="slide-content">
              <img src="images/data 1.png"></img>
              <h2>MOOD</h2>
              <p>Bouger pour se sentir mieux.</p>
            </div>
            <IonButton size="small" color="danger" className='btn-continue' expand="block" onClick={() => goToNextSlide()}>
              Continuer
            </IonButton>
          </SwiperSlide>

          <SwiperSlide>
            <div className="slide-content">
              <img src="images/data 2.png"></img>
              <h2>MOOD</h2>
              <p>Penser à s’hydrater constamment.</p>
              <IonButton size="small" color="danger" className='btn-continue' expand="block" onClick={goToNextPage}>
                Continuer
              </IonButton>
            </div>
          </SwiperSlide>          

          {/* <IonSlides options={slideOpts} ref={swiperRef} style={{ padding: '8px 0' }}>
            {slides.map(s => (
              <IonSlide key={s.id}>
                <IonCard className="mx-3" style={{ borderRadius: 16 }}>
                  <IonCardHeader>
                    <IonCardTitle style={{ fontWeight: 800 }}>{s.title}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                      {s.body.map((line, i) => <li key={i} style={{ marginBottom: 6 }}>{line}</li>)}
                    </ul>
                  </IonCardContent>
                </IonCard>
              </IonSlide>
            ))}
          </IonSlides> */       
  /*       </Swiper>
      </IonContent>
    </IonPage>
  );  */
};

export default Home;
