import React, { useMemo, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonButton, IonIcon, IonContent
} from '@ionic/react';
import { chevronBackOutline, addOutline, removeOutline, openOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Worker pdf.js (Vite-friendly)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

type RouteParams = { file: string };

const PdfViewerContainer: React.FC = () => {
  const history = useHistory();
  const { file } = useParams<RouteParams>();
  const src = useMemo(() => `/assets/pdfs/${decodeURIComponent(file)}`, [file]);

  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.1);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={chevronBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Visualisation PDF</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setScale(s => Math.max(0.6, s - 0.1))}>
              <IonIcon icon={removeOutline} slot="icon-only" />
            </IonButton>
            <IonButton onClick={() => setScale(s => Math.min(2, s + 0.1))}>
              <IonIcon icon={addOutline} slot="icon-only" />
            </IonButton>
            <IonButton href={src} target="_blank" rel="noopener noreferrer">
              <IonIcon icon={openOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <Document
              file={src}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages || 0);
                setPage(1);
              }}
              onLoadError={(e) => console.error(e)}
              loading={<div style={{ textAlign: 'center' }}>Chargement…</div>}
              noData={<div>Fichier introuvable.</div>}
            >
              <Page
                pageNumber={page}
                scale={scale}
                renderTextLayer
                renderAnnotationLayer
              />
            </Document>

            {/* Barre de pagination */}
            {numPages > 1 && (
              <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                <IonButton
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  fill="outline"
                  disabled={page <= 1}
                >
                  Page précédente
                </IonButton>
                <span style={{ fontSize: 13, color: '#6b7280' }}>
                  {page} / {numPages}
                </span>
                <IonButton
                  onClick={() => setPage(p => Math.min(numPages, p + 1))}
                  color="primary"
                  disabled={page >= numPages}
                >
                  Page suivante
                </IonButton>
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PdfViewerContainer;
