// src/pages/home/HomeSlides.tsx
import React, { useEffect, useRef } from 'react';
import { IonSlides, IonSlide, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { SwiperOptions } from 'swiper/types';
import { slides } from './slidesContent';

const slideOpts: SwiperOptions = {
  initialSlide: 0,
  speed: 400,
  loop: false,
  slidesPerView: 1,
  spaceBetween: 12,
  pagination: { clickable: true }
};

const HomeSlides: React.FC = () => {
  const swiperRef = useRef<HTMLIonSlidesElement>(null);

  useEffect(() => {
    // S’assure de démarrer sur la première slide même si rendu conditionnel
    const t = setTimeout(() => swiperRef.current?.slideTo(0, 0), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <IonSlides options={slideOpts} ref={swiperRef} style={{ padding: '8px 0' }}>
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
    </IonSlides>
  );
};

export default HomeSlides;
