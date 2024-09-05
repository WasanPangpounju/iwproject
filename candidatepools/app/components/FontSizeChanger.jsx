// components/FontSizeChanger.js
"use client"; // This makes the component a client component

const FontSizeChanger = ({ increaseFontSize, decreaseFontSize, resetFontSize }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <button onClick={increaseFontSize}>Increase Font Size</button><br/>
      <button onClick={decreaseFontSize}>Decrease Font Size</button><br/>
      <button onClick={resetFontSize}>Reset Font Size</button>
    </div>
  );
};

export default FontSizeChanger;
