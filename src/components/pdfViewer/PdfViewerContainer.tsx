import React, { useMemo, useState } from 'react';
import {
  IonButtons, IonButton, IonIcon
} from '@ionic/react';
import { addOutline, removeOutline, openOutline } from 'ionicons/icons';

import { Document, Page, pdfjs } from 'react-pdf';

// Worker pdf.js (Vite-friendly)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

interface PdfViewerProps {
  file: string;
  onClose?: () => void;
}

const PdfViewerContainer: React.FC<PdfViewerProps> = ({ file, onClose }) => {
  const src = useMemo(() => `/assets/pdfs/${file}`, [file]);

  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.1);

  return (
    <div>
      <style>{`
        .react-pdf__Page__textContent {
          color: transparent;
        }
        .react-pdf__Page__textContent span {
          color: transparent;
        }
        .react-pdf__Page__annotations {
          display: none;
        }
      `}</style>
      
      {/* Barre d'outils */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <IonButton onClick={() => setScale(s => Math.max(0.6, s - 0.1))} size="small">
            <IonIcon icon={removeOutline} slot="icon-only" />
          </IonButton>
          <IonButton onClick={() => setScale(s => Math.min(2, s + 0.1))} size="small">
            <IonIcon icon={addOutline} slot="icon-only" />
          </IonButton>
          <IonButton href={src} target="_blank" rel="noopener noreferrer" size="small">
            <IonIcon icon={openOutline} slot="icon-only" />
          </IonButton>
        </div>
        <span style={{ fontSize: '14px', color: '#666' }}>
          {page} / {numPages}
        </span>
      </div>

      <div style={{ padding: '10px' }}>
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
                  size="small"
                >
                  Précédent
                </IonButton>
                <IonButton
                  onClick={() => setPage(p => Math.min(numPages, p + 1))}
                  color="primary"
                  disabled={page >= numPages}
                  size="small"
                >
                  Suivant
                </IonButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewerContainer;
