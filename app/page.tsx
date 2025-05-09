"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { ReactCompareSlider } from "react-compare-slider";
import { useRef, useState } from "react";

export default function Home() {
  const video1 = "";
  const video2 = "";

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  const [isDescriptionLoaded, setIsDescriptionLoaded] = useState(false);
  const [areVideosReady, setAreVideosReady] = useState(false);
  const [isVideoDescriptionLoaded, setIsVideoDescriptionLoaded] =
    useState(false);
  const [seekTime, setSeekTime] = useState(""); // Add this line

  const stream1Ref = useRef<HTMLVideoElement>(null);
  const stream2Ref = useRef<HTMLVideoElement>(null);
  const compareSliderRef = useRef<HTMLElement>(null);

  const handleLogoLoad = () => {
    setIsLogoLoaded(true);
    setTimeout(() => {
      setIsDescriptionLoaded(true);
      // Set videos ready 2 seconds after description
      setTimeout(() => {
        setAreVideosReady(true);
        setTimeout(() => setIsVideoDescriptionLoaded(true), 1000);
      }, 1000);
    }, 1000);
  };

  const handleVideoLoad = () => {
    if (stream1Ref.current && stream2Ref.current) {
      setAreVideosReady(true);
      setTimeout(() => setIsVideoDescriptionLoaded(true), 1000);
    }
  };

  const togglePlayback = async () => {
    if (!stream1Ref.current || !stream2Ref.current) return;

    if (isPlaying) {
      stream1Ref.current.pause();
      stream2Ref.current.pause();
    } else {
      await Promise.all([stream1Ref.current.play(), stream2Ref.current.play()]);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleAudioPlayer1 = () => {
    if (!stream1Ref.current || !stream2Ref.current) return;
    stream1Ref.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = async () => {
    if (!compareSliderRef.current) return;
    if (!document.fullscreenElement) {
      await compareSliderRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const handleSeek = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const timeInSeconds = parseFloat(seekTime);
      if (!isNaN(timeInSeconds) && stream1Ref.current && stream2Ref.current) {
        stream1Ref.current.currentTime = timeInSeconds;
        stream2Ref.current.currentTime = timeInSeconds;
        setSeekTime("");
      }
    }
  };

  return (
    <div className={styles.page}>
      <header
        className={`${styles.main} ${styles.loadAnimation} ${isLogoLoaded ? styles.visible : ""}`}
      >
        <div className={styles.titleContainer}>
          <Image
            className={styles.logo}
            src="/bear.svg"
            alt="Bear"
            width={130}
            height={80}
            priority
            onLoad={handleLogoLoad}
          />
          <h1>Scuffle Demo</h1>
        </div>
        <p
          className={`${styles.description} ${styles.loadAnimation} ${isDescriptionLoaded ? styles.visible : ""}`}
        >
          Compare the differences between two video streams. Drag the slider to
          reveal the differences in quality and performance.
        </p>
      </header>
      <main className={styles.sectionsWrapper}>
        <section
          ref={compareSliderRef}
          className={`${styles.loadAnimation} ${areVideosReady ? styles.visible : ""}`}
          style={{ width: "100%" }}
        >
          <div className={styles.controls}>
            <button onClick={togglePlayback} className={styles.controlButton}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={toggleAudioPlayer1}
              className={styles.controlButton}
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>
            <button onClick={toggleFullscreen} className={styles.controlButton}>
              Toggle Fullscreen
            </button>
            <input
              type="number"
              value={seekTime}
              onChange={(e) => setSeekTime(e.target.value)}
              onKeyDown={handleSeek}
              placeholder="Seek"
              step="0.1"
              min="0"
              className={styles.controlButton}
              style={{ width: "120px", padding: "0 8px" }}
            />
          </div>
          <ReactCompareSlider
            style={{
              width: "100%",
              height: "100%",
              aspectRatio: "16/9",
            }}
            onlyHandleDraggable={true}
            itemOne={
              <div style={{ width: "100%", height: "100%" }}>
                <video
                  ref={stream1Ref}
                  src={video1}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  muted={isMuted}
                  playsInline
                />
              </div>
            }
            itemTwo={
              <div style={{ width: "100%", height: "100%" }}>
                <video
                  ref={stream2Ref}
                  src={video2}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  muted
                  playsInline
                />
              </div>
            }
          />
          <div className={styles.comparisonLabels}>
            <span>AV1</span>
            <hr className={styles.dividerLine} />
            <span>H.264</span>
          </div>
        </section>
        <section
          className={`${styles.loadAnimation} ${isVideoDescriptionLoaded ? styles.visible : ""}`}
        >
          <p style={{ marginBottom: "2rem" }}>
            <strong>H.264</strong> (also known as AVC), the most common form of
            video encoding, started from <strong>2003</strong> and has has
            become the most popular video encoding format. It's most loved for
            its <strong>universal hardware support</strong> and{" "}
            <strong>efficient real-time encoding capabilities</strong> while
            still delivering high quality. <br />
            <br /> This 1080p 60fps requires approximately{" "}
            <strong>6-8 Mbps bandwidth</strong> to users while maintaining
            professional streaming quality.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            <strong>AV1</strong> is the next-generation form of video encoding
            developed in the last 5 years, but only recently has hardware become
            reasonable to do this encoding on the fly. This{" "}
            <strong>open-source solution</strong> is already integrated into
            YouTube and Netflix, offering up to{" "}
            <strong>50% better compression efficiency</strong> compared to H.264
            <br />
            <br />
            This 1080p 60fps with only <strong>3-4 Mbps bandwidth</strong> to
            reach users with visibly improved quality and reduced artifacts even
            at 2K bitrate.
          </p>
          <p style={{ fontSize: "0.9rem", color: "#666", fontStyle: "italic" }}>
            Note: When pausing the video, you might notice some graininess. This
            is due to video compression using inter-frame prediction, where some
            frames depend on other frames for their full quality.
          </p>
        </section>
      </main>
    </div>
  );
}
