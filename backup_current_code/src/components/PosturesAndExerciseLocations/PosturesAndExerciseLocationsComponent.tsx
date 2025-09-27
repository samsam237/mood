import React from 'react';
import { IonList, IonItem, IonLabel, IonThumbnail } from '@ionic/react';

const PosturesAndExerciseLocationsComponent: React.FC = () => {
  const exercises = [
    { name: 'Stretching', location: 'Office Desk', imgSrc: 'images/Stretching.png' },
    { name: 'Squats', location: 'Home', imgSrc: 'images/Squats.png' },
    { name: 'Walk', location: 'Park', imgSrc: 'images/Walk.png' }
  ];

  return (
    <IonList>
      {exercises.map((exercise, index) => (
        <IonItem key={index}>
          <IonThumbnail slot="start">
            <img src={exercise.imgSrc} alt={exercise.name} />
          </IonThumbnail>
          <IonLabel>
            <h2>{exercise.name}</h2>
            <p>{exercise.location}</p>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default PosturesAndExerciseLocationsComponent;
