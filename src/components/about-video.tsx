'use client';

import { useRef, useEffect } from 'react';

export function AboutVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hasEnded = false;

    const stopAtFirstSecond = () => {
      video.pause();
      video.currentTime = 1;
    };

    const handleEnded = () => {
      stopAtFirstSecond();
      setTimeout(stopAtFirstSecond, 50);
    };

    const handleTimeUpdate = () => {
      if (video.duration && !video.seeking) {
        // When video reaches the end, jump to second 1 and pause
        if (video.currentTime >= video.duration - 0.3) {
          if (!hasEnded) {
            hasEnded = true;
            stopAtFirstSecond();
          }
        } else if (video.currentTime < video.duration - 2) {
          hasEnded = false;
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
