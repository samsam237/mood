import React from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import './Home.css'
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();

  const goToNextPage = () => {
    history.push('/welcome');
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Swiper
          className="swiper"
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          scrollbar={{ draggable: true }}

          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
        >

          <SwiperSlide>
            <div className="slide-content">
              <img src="images/data.png"></img>
              <h2>MOOD</h2>
              <p>Conseils de santé au quotidien.</p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="slide-content">
              <img src="images/data 1.png"></img>
              <h2>MOOD</h2>
              <p>Bouger pour se sentir mieux.</p>
            </div>
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
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Home;
