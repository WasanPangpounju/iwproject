"use client";

import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// ตั้งค่ารูปแบบการโหลด PDF
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.11.338/build/pdf.worker.min.js`;

function PDFViewer({ fileUrl }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState(null);

    // ฟังก์ชันเพื่อรับจำนวนหน้า
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // ฟังก์ชันเพื่อจัดการข้อผิดพลาด
    function onDocumentLoadError(err) {
        console.error('Error while loading document:', err);
        setError('Failed to load PDF document.');
    }


    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError} // เพิ่มการจัดการข้อผิดพลาด
            >
                <Page pageNumber={pageNumber} />
            </Document>
            <p>
                Page {pageNumber} of {numPages}
            </p>
            <button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}
            >
                Previous
            </button>
            <button
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber(pageNumber + 1)}
            >
                Next
            </button>
        </div>
    );
}

export default PDFViewer;
