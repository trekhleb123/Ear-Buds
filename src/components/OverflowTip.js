import React, { useRef, useState, useEffect } from "react";
import Tooltip from "@material-ui/core/Tooltip";

const OverflowTip = ({ children }) => {
  const [isOverflowed, setIsOverflow] = useState(false);
  const textElementRef = useRef();
  useEffect(() => {
    setIsOverflow(
      textElementRef.current.scrollWidth > textElementRef.current.clientWidth
    );
  }, []);
  return (
    <Tooltip title={children} disableHoverListener={!isOverflowed}>
      <div
        ref={textElementRef}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          // display: "-webkit-box",
          // "-webkit-line-clamp": "2",
          // "-webkit-box-orient": "vertical",
        }}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default OverflowTip;
