"use client"; // Ensure this is a client component

import React from "react";
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

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [bgColorWhite, setBgColorWhite] = useState("text-white");
  const [bgColorMain, setBgColorMain] = useState("bg-white");

  return (
    <html lang="en">
      <ThemeProvider>
        <body className={`${(bgColorMain, bgColorWhite)}`}>
          <AuthProvider>
            <ClientRedirector />
            <ToastContainer />
            <Header />
            <div>{children}</div>
          </AuthProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
