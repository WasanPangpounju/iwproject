"use client"

import React from 'react';
import { Document, Page } from 'react-pdf';
import { GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';

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
