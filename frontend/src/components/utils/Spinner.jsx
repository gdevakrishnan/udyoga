import React from "react";

const Spinner = ({ size = "md", color = "#ffffff" }) => {
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
    aspectRatio: "1",
    borderRadius: "50%",
    background: `
      radial-gradient(farthest-side, ${color} 94%, #0000) top/8px 8px no-repeat,
      conic-gradient(#0000 30%, ${color})
    `,
    WebkitMask: "radial-gradient(farthest-side,#0000 calc(100% - 8px),#000 0)",
    mask: "radial-gradient(farthest-side,#0000 calc(100% - 8px),#000 0)",
    animation: "spin 1s infinite linear",
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(1turn); }
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
    </>
  );
};

export default Spinner;
