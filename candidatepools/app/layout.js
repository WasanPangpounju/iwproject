"use client"; // Ensure this is a client component

import React, { useEffect } from "react";
import { ThemeProvider } from "./ThemeContext"; // Adjust the import path
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import "@fontsource/ibm-plex-sans-thai";
import { AuthProvider } from "./Provider";
import { useState } from "react"; // Import useState

import { ToastContainer } from "react-toastify";

//component
import ClientRedirector from "@/app/components/Redirector/ClientRedirector";
import Loader from "./components/Loader";

import { fetchInitialData } from "@/utils/fetchData";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [bgColorWhite, setBgColorWhite] = useState("text-white");
  const [bgColorMain, setBgColorMain] = useState("bg-white");


  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <html lang="en">
      <ThemeProvider>
        <body className={`${(bgColorMain, bgColorWhite)}`}>
          <AuthProvider>
            <ClientRedirector />
            <Loader />
            <Header />
            <ToastContainer />
            <div>{children}</div>
          </AuthProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
