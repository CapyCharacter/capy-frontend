'use client';

import { useRef, useEffect } from 'react';

const CardContainer = ({ children } : {
    children: React.ReactNode
  }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let isScrolling = false;
    let startX: number;
    let scrollLeft: number;

    const onMouseDown = (e: MouseEvent) => {
      isScrolling = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = 'grabbing';
    };

    const onMouseUp = () => {
      isScrolling = false;
      container.style.cursor = 'grab';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isScrolling) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const disableTextSelection = (e: Event) => {
      e.preventDefault();
    };

    const addEmptySpace = () => {
      const emptySpace = document.createElement('div');
      emptySpace.style.minWidth = '100px';
      emptySpace.style.height = '1px';
      content.appendChild(emptySpace);
    };

    addEmptySpace();

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('selectstart', disableTextSelection);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('selectstart', disableTextSelection);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="overflow-x-auto whitespace-nowrap py-6 px-6 no-scrollbar cursor-grab select-none"
    >
      <div ref={contentRef} className="inline-flex space-x-6">
        {children}
      </div>
    </div>
  );
};
  
export default CardContainer;
