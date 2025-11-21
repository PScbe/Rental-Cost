import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

const SampleVideo = () => {
    const [videoSrc, setVideoSrc] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            setIsPlaying(true); // Auto-play on upload
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(progress);
        }
    };

    const handleSeek = (e) => {
        const seekTime = (e.target.value / 100) * videoRef.current.duration;
        videoRef.current.currentTime = seekTime;
        setProgress(e.target.value);
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (videoSrc) {
                URL.revokeObjectURL(videoSrc);
            }
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [videoSrc]);

    return (
        <div className="min-h-screen bg-black text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">
                    Experience Quality
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Upload a sample video to see how it looks in our modern, high-fidelity player.
                </p>
            </div>

            {!videoSrc ? (
                <div className="w-full max-w-3xl aspect-video bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-10 transition-all hover:border-primary/50 hover:bg-zinc-900/80 group cursor-pointer relative overflow-hidden">
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                        <Upload size={32} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Upload Sample Video</h3>
                    <p className="text-gray-500 text-center max-w-sm">
                        Drag and drop or click to browse. Supports MP4, WebM, and MOV.
                    </p>
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => isPlaying && setShowControls(false)}
                >
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        className="w-full h-full object-contain"
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                        onClick={togglePlay}
                    />

                    {/* Controls Overlay */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 flex flex-col justify-end p-6 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {/* Progress Bar */}
                        <div className="w-full mb-4 group/progress">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={handleSeek}
                                className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-150"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={togglePlay}
                                    className="text-white hover:text-primary transition-colors transform hover:scale-110"
                                >
                                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                                </button>

                                <div className="flex items-center gap-2 group/volume">
                                    <button onClick={toggleMute} className="text-white hover:text-gray-300">
                                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                    </button>
                                    <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={isMuted ? 0 : volume}
                                            onChange={(e) => {
                                                setVolume(e.target.value);
                                                videoRef.current.volume = e.target.value;
                                                setIsMuted(e.target.value === '0');
                                            }}
                                            className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer ml-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 transition-transform hover:scale-110">
                                    {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Center Play Button (Initial or Paused) */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl ring-1 ring-white/20">
                                <Play size={40} fill="white" className="ml-2" />
                            </div>
                        </div>
                    )}

                    {/* Close/Remove Button */}
                    <button
                        onClick={() => {
                            setVideoSrc(null);
                            setIsPlaying(false);
                        }}
                        className={`absolute top-6 right-6 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md p-2 rounded-full transition-all ${showControls ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SampleVideo;
