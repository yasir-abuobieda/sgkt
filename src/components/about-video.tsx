'use client';

import { useRef, useEffect, useState } from 'react';

export function AboutVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [showCover, setShowCover] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let captured = false;

    const handleTimeUpdate = () => {
      // 1. Capture a clean snapshot of the students during the opening seconds (0.8s - 3.0s)
      if (!captured && video.currentTime >= 0.8 && video.currentTime <= 3.0) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx && canvas.width > 0 && canvas.height > 0) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setSnapshot(dataUrl);
            captured = true;
          }
        } catch {
          // ignore if canvas context unavailable
        }
      }

      // 2. Before reaching the outro black screen (0.4s before end)
      if (video.duration && !video.seeking) {
        if (video.currentTime >= video.duration - 0.4) {
          endAndReset();
        }
      }
    };

    const endAndReset = () => {
      video.pause();
      // Seek slightly past 0.0s to avoid any initial black frame
      video.currentTime = 0.5;
      setShowCover(true);
    };

    const handleEnded = () => {
      endAndReset();
    };

    const handlePlay = () => {
      setShowCover(false);
    };

    const handleSeeking = () => {
      setShowCover(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('seeking', handleSeeking);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('seeking', handleSeeking);
    };
  }, []);

  const handleReplay = () => {
    if (videoRef.current) {
      setShowCover(false);
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className="relative h-[380px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-200/60 ring-1 ring-slate-900/5 group">
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

      {/* Cover overlay when video finishes */}
      {showCover && (
        <div
          onClick={handleReplay}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer bg-black/40 transition-all duration-300"
          title="إعادة تشغيل الفيديو"
        >
          {snapshot && (
            <img
              src={snapshot}
              alt="بداية الفيديو"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/25"></div>
          <div className="relative z-10 w-20 h-20 rounded-full bg-brand-maroon/95 text-white flex items-center justify-center shadow-2xl transform hover:scale-110 active:scale-95 transition-transform duration-200 border-2 border-white/80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="translate-x-[2px]"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="relative z-10 text-white font-bold text-sm mt-3 drop-shadow-md bg-black/40 px-3 py-1 rounded-full">
            إعادة التشغيل
          </span>
        </div>
      )}
    </div>
  );
}
