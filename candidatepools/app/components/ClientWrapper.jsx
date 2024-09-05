"use client";

import React, { useState } from 'react';

export default function ClientWrapper({ children }) {
  const [fontSize, setFontSize] = useState('normal-font');

  return (
    <div className={fontSize}>
      {React.cloneElement(children, { setFontSize })}
    </div>
  );
}
