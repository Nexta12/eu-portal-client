import { useEffect, useRef, useState } from 'react';

export const useSticky = () => {
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isSticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!stickyRef.current) return;
      setSticky(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [stickyRef, setSticky]);

  return { stickyRef, isSticky };
};
