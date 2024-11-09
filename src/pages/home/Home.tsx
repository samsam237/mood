import React, {useRef, useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import storage from '../../services/storageService';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import './Home.css'
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = await storage.get('user');
      if (storedUser) {
        setUser(storedUser);
        history.replace('/main'); 
      }
    };
    fetchUserData();
  }, [history]);
  

  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  }, [swiperRef.current]);

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
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="swiper"
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          scrollbar={{ draggable: true }}
                    
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}
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
              <h2>ACTIPOD</h2>
              <p>Conseils de santé au quotidien.</p>
            </div>
            <IonButton size="small" color="danger" className='btn-continue' expand="block" onClick={() => goToNextSlide()}>
              Continuer
            </IonButton>
          </SwiperSlide>

          <SwiperSlide>
            <div className="slide-content">
              <img src="images/data 1.png"></img>
              <h2>ACTIPOD</h2>
              <p>Bouger pour se sentir mieux.</p>
            </div>
            <IonButton size="small" color="danger" className='btn-continue' expand="block" onClick={() => goToNextSlide()}>
              Continuer
            </IonButton>
          </SwiperSlide>

          <SwiperSlide>
            <div className="slide-content">
              <img src="images/data 2.png"></img>
              <h2>ACTIPOD</h2>
              <p>Penser à s’hydrater constamment.</p>
              <IonButton size="small" color="danger" className='btn-continue' expand="block" onClick={goToNextPage}>
                Continuer
              </IonButton>
            </div>
          </SwiperSlide>

          
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Home;
