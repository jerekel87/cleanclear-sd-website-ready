import { useRef, useState, useCallback, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  label: string;
  location: string;
}

export default function BeforeAfterSlider(props: BeforeAfterSliderProps) {
  const { before, after, label, location } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updatePosition(e.touches[0].clientX);
    };
    const handleEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, updatePosition]);

  return (
    <div className="group">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-col-resize select-none touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <img
          src={after}
          alt={`${label} - After`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        <img
          src={before}
          alt={`${label} - Before`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          draggable={false}
        />

        <div
          className="absolute top-0 bottom-0 w-1 z-10 -translate-x-1/2"
          style={{ left: `${position}%` }}
        >
          <div className="w-full h-full bg-white shadow-sm" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100"
            style={{ width: '44px', height: '44px', backgroundColor: 'white' }}
          >
            <GripVertical className="w-5 h-5 text-navy-900" />
          </div>
        </div>

        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 sm:py-0.5 bg-navy-900/80 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide rounded">
            Before
          </span>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 sm:py-0.5 bg-green-600/80 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide rounded">
            After
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="mt-3 sm:mt-4 px-1">
        <h3 className="text-[15px] sm:text-base font-bold text-navy-900">{label}</h3>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </div>
  );
}
