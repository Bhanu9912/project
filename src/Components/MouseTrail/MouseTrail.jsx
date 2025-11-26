import React, { useEffect, useRef } from "react";

const MouseTrail = () => {
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);

  const pos = {
    targetX: 0,
    targetY: 0,
    firstX: 0,
    firstY: 0,
    secondX: 0,
    secondY: 0,
    thirdX: 0,
    thirdY: 0,
  };

  useEffect(() => {
    const handleMove = (e) => {
      pos.targetX = e.clientX;
      pos.targetY = e.clientY;
    };

    const handleClick = (e) => {
      const elem = document.elementFromPoint(e.clientX, e.clientY);
      if (elem) elem.click();
    };

    const update = () => {
      // More delay by using different easing speeds
      pos.firstX += (pos.targetX - pos.firstX) * 0.1;
      pos.firstY += (pos.targetY - pos.firstY) * 0.1;

      pos.secondX += (pos.firstX - pos.secondX) * 0.12;
      pos.secondY += (pos.firstY - pos.secondY) * 0.12;

      pos.thirdX += (pos.secondX - pos.thirdX) * 0.08;
      pos.thirdY += (pos.secondY - pos.thirdY) * 0.08;

      if (firstRef.current)
        firstRef.current.style.transform = `translate(${pos.firstX}px, ${pos.firstY}px)`;

      if (secondRef.current)
        secondRef.current.style.transform = `translate(${pos.secondX}px, ${pos.secondY}px)`;

      if (thirdRef.current)
        thirdRef.current.style.transform = `translate(${pos.thirdX}px, ${pos.thirdY}px)`;

      requestAnimationFrame(update);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mousedown", handleClick);
    requestAnimationFrame(update);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <>
      <div
        ref={firstRef}
        className="fixed top-0 left-0 w-[50px] h-[50px] rounded-full pointer-events-none 
        shadow-[0_0_30px_2px_#111] transition-transform duration-75 z-[9999]"
      ></div>

      <div
        ref={secondRef}
        className="fixed top-0 left-0 w-[30px] h-[30px] rounded-full pointer-events-none
        shadow-[0_0_30px_2px_#111] transition-transform duration-75 z-[9999]"
      ></div>

      <div
        ref={thirdRef}
        className="fixed top-0 left-0 w-[20px] h-[20px] rounded-full pointer-events-none
        shadow-[0_0_30px_2px_#111] transition-transform duration-75 z-[9999]"
      ></div>
    </>
  );
};

export default MouseTrail;
