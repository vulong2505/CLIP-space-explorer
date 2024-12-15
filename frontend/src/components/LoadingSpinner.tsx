import { useState, useEffect } from 'react';

export function LoadingBox() {
  const [frame, setFrame] = useState(0);
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(prev => (prev + 1) % frames.length);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono flex items-center gap-2">
      <span>Loading</span>
      <span>{frames[frame]}</span>
    </div>
  );
}

export function LoadingPCA() {
  const [frame, setFrame] = useState(0);
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(prev => (prev + 1) % frames.length);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono flex items-center gap-2">
      <span>Loading nearest neighbors</span>
      <span>{frames[frame]}</span>
    </div>
  );
}