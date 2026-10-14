'use client';

import { useRef } from 'react';

export function AboutVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  return (
    <div className="relative h-[380px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-200/60 ring-1 ring-slate-900/5">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls
        autoPlay
        muted
        playsInline
        preload="metadata"
        onEnded={handleEnded}
      >
        <source src="/about.mp4" type="video/mp4" />
        <source src="/api/about-video" type="video/mp4" />
        متصفحك لا يدعم تشغيل هذا الفيديو.
      </video>
    </div>
  );
}
