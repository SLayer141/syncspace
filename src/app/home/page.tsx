"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const username = session?.user?.name || "User";

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (videoOn || micOn) {
      navigator.mediaDevices.getUserMedia({ video: videoOn, audio: micOn })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
      }
    }
    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [videoOn, micOn]);

  const handleToggleVideo = () => setVideoOn((v) => !v);
  const handleToggleMic = () => setMicOn((m) => !m);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <span className="font-semibold text-lg"> Welcome {username.charAt(0).toUpperCase() + username.slice(1)}</span>
        <Link href="/profile" className="hover:bg-gray-100 rounded-full p-2 transition" title="Profile/Settings">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <span role="img" aria-label="user" className="text-2xl">👤</span>
          )}
        </Link>
      </div>
      <div className="p-8 flex flex-col items-center">
        <h1>Welcome to page</h1>
        {/* Webcam preview window */}
        <div className="mt-8 flex flex-col items-center">
          <div className="w-80 h-60 bg-black rounded-lg overflow-hidden flex items-center justify-center">
            {videoOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ background: "#000" }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl">Video Off</div>
            )}
          </div>
          <div className="flex gap-6 mt-4">
            <button
              onClick={handleToggleMic}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${micOn ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}
            >
              {micOn ? "Mic On" : "Mic Off"}
            </button>
            <button
              onClick={handleToggleVideo}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${videoOn ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}
            >
              {videoOn ? "Video On" : "Video Off"}
            </button>
          </div>
        </div>
        {/* Join/Create Meet controls */}
        <div className="flex flex-col items-center gap-4 mt-6 w-full max-w-xs">
          <div className="flex gap-2 w-full">
            <input
              type="text"
              placeholder="Enter meet link..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Join
            </button>
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition w-full"
          >
            Create Meet
          </button>
        </div>
      </div>
    </div>
  );
}