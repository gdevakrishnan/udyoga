import React from 'react';

const Spinner = ({ size = 'md', color = '#ffffff' }) => {
  // Size mapping
  const sizeMap = {
    xs: 20,
    sm: 30,
    md: 50,
    lg: 70,
    xl: 100,
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;

  const spinnerStyle = {
    width: `${spinnerSize}px`,
    padding: `${spinnerSize * 0.16}px`,
    aspectRatio: '1',
    borderRadius: '50%',
    background: color,
    WebkitMask: `conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box`,
    mask: `conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box`,
    WebkitMaskComposite: 'source-out',
    maskComposite: 'subtract',
    animation: 'spin 1s infinite linear',
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(1turn);
            }
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
    </>
  );
};

export default Spinner;