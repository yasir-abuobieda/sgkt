'use client';

import { useRef, useEffect } from 'react';

export function AboutVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isResetting = false;

    const resetToBeginning = () => {
      if (isResetting) return;
      isResetting = true;
      video.pause();
      // Setting currentTime back to 0 so the first frame is displayed
      video.currentTime = 0;
      setTimeout(() => {
        isResetting = false;
      }, 500);
    };

    const handleEnded = () => {
      setTimeout(() => {
        resetToBeginning();
      }, 50);
    };

    const handleTimeUpdate = () => {
      // If playback reaches the very end (before the black screen at 0:56)
      if (video.duration && !video.seeking) {
        if (video.currentTime >= video.duration - 0.3) {
          resetToBeginning();
        }
      }
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

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
      >
        <source src="/about.mp4" type="video/mp4" />
        <source src="/api/about-video" type="video/mp4" />
        متصفحك لا يدعم تشغيل هذا الفيديو.
      </video>
    </div>
  );
}
