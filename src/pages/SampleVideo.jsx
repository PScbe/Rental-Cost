import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, ChevronRight } from 'lucide-react';

const VIDEOS = [
    { id: 1, title: "Living Space", src: "/videos/Living space.mp4" },
    { id: 3, title: "Art Wall", src: "/videos/Art wall .mp4" },
    { id: 4, title: "Blue Background", src: "/videos/Blue.mp4" },
    { id: 5, title: "Green Background", src: "/videos/Green BG.mp4" },
    { id: 6, title: "Living Space Ft 02", src: "/videos/Living space Ft 02.mp4" },
    { id: 7, title: "Mom Daughter Reel", src: "/videos/MOM daughter - Insta reel.mp4" },
    { id: 8, title: "Pink Background", src: "/videos/Pink BG.mp4" },
    { id: 9, title: "RGB Background", src: "/videos/RGB BGmp4.mp4" },
    { id: 10, title: "Red Background", src: "/videos/Red BG .mp4" },
];

const SampleVideo = () => {
    const [currentVideo, setCurrentVideo] = useState(VIDEOS[0]);
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

    const changeVideo = (video) => {
        setCurrentVideo(video);
        setIsPlaying(true); // Auto-play new video
        setProgress(0);
    };

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">
                    Experience Quality
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Explore our collection of sample works.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Video Player Section */}
                <div className="lg:col-span-2">
                    <div
                        ref={containerRef}
                        className="relative w-full aspect-video bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => isPlaying && setShowControls(false)}
                    >
                        <video
                            ref={videoRef}
                            src={currentVideo.src}
                            className="w-full h-full object-contain"
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={() => setIsPlaying(false)}
                            onClick={togglePlay}
                            autoPlay={isPlaying}
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

                                    <span className="text-sm font-medium text-white/80">{currentVideo.title}</span>
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

                {/* Playlist Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 h-full max-h-[600px] flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Play size={20} className="text-primary" /> Playlist
                        </h3>
                        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 pr-2">
                            {VIDEOS.map((video) => (
                                <button
                                    key={video.id}
                                    onClick={() => changeVideo(video)}
                                    className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 group ${currentVideo.id === video.id
                                        ? 'bg-zinc-800 border border-primary/50 shadow-lg'
                                        : 'bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${currentVideo.id === video.id ? 'bg-primary text-black' : 'bg-zinc-800 text-gray-400 group-hover:bg-zinc-700 group-hover:text-white'
                                        }`}>
                                        {currentVideo.id === video.id ? <Volume2 size={18} /> : <Play size={18} />}
                                    </div>
                                    <div className="flex-grow">
                                        <div className={`font-bold text-sm ${currentVideo.id === video.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                            {video.title}
                                        </div>
                                    </div>
                                    {currentVideo.id === video.id && <ChevronRight size={16} className="text-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SampleVideo;
