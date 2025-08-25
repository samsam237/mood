// src/pages/home/HomeSlides.tsx
import React, { useRef, useState } from 'react';
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonIcon
} from '@ionic/react';
import {
  chevronBackOutline,
  chevronForwardOutline,
  documentTextOutline,
  logInOutline
} from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IonicSlides } from '@ionic/react';
import 'swiper/css';

import { useHistory } from 'react-router-dom';
import { slides } from './slidesContent';

const HomeSlides: React.FC = () => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = slides.length;
  const history = useHistory();

  return (
    <div className="home-slides">
      {/* Toolbar haut avec navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px'
      }}>
        {/* <div style={{ fontWeight: 700 }}>Parcours pédagogique</div> */}

        {/* Navigation / Action */}
        <div style={{ display: 'flex', gap: 8 }}>
          {activeIndex < total - 1 ? (
            <>
              <IonButton
                onClick={() => swiperRef.current?.slidePrev()}
                fill="outline"
                disabled={activeIndex === 0}
              >
                <IonIcon icon={chevronBackOutline} slot="start" />
                Précédent
              </IonButton>
              <IonButton
                onClick={() => swiperRef.current?.slideNext()}
                color="primary"
                disabled={activeIndex === total - 1}
              >
                Suivant
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </>
          ) : (
            <IonButton
                color="success"
                fill="clear"
                onClick={() => history.push('/login')}
                >
                <IonIcon icon={logInOutline} slot="start" />
                Commencer
            </IonButton>
          )}
        </div>
      </div>

      <Swiper
        modules={[IonicSlides]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) =>
          setActiveIndex(swiper.realIndex ?? swiper.activeIndex ?? 0)
        }
        initialSlide={0}
        speed={400}
        spaceBetween={12}
        slidesPerView={1}
        pagination={{ clickable: true }}
      >
        {slides.map((s, idx) => (
          <SwiperSlide key={s.id}>
            <IonCard className="mx-3" style={{ borderRadius: 16 }}>
              <IonCardHeader>
                <IonCardTitle style={{ fontWeight: 800 }}>
                  {`${idx + 1}. ${s.title}`}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {s.bodyHtml.map((html, i) => (
                  <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
                ))}

                {/* {s.pdf && (
                  <div style={{ marginTop: 12, textAlign: 'right' }}>
                    <IonButton
                      href={s.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      fill="clear"
                    >
                      <IonIcon icon={documentTextOutline} slot="start" />
                      Voir le PDF source
                    </IonButton>
                  </div>
                )} */}
              </IonCardContent>
            </IonCard>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Indicateur progression */}
      <div style={{
        textAlign: 'center',
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4
      }}>
        Slide {activeIndex + 1} / {total}
      </div>
    </div>
  );
};

export default HomeSlides;
