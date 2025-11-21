import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

const SampleVideo = () => {
    // Use the file we copied to public folder
    const videoSrc = "/sample-video.mp4";

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

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
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">
                    Experience Quality
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Watch our sample video to see the quality we deliver.
                </p>
            </div>

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
            </div>
        </div>
    );
};

export default SampleVideo;
