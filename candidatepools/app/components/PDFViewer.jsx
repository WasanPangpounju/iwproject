"use client"

import React from 'react';
import { Document, Page } from 'react-pdf';
import { GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js';

const PdfViewer = ({ FileUrl }) => {
    return (
        <Document
            file={FileUrl}
            onLoadError={(error) => console.error('Error loading PDF:', error)}
        >
            <Page pageNumber={1} />
        </Document>
    );
};

export default PdfViewer;
