// Copyright (c) 2026 minimorphism
// License GPLv3

import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./VideoSection.module.scss";
import { useTranslation } from "react-i18next";

import { Box, Typography } from "@minimorphism/mds-ui";

interface VideoSectionProps {
	onNext: () => void;
	onPrev: () => void;
}

const VIDEOS = ["/videos/1.webm", "/videos/2.webm", "/videos/3.webm"];

const VideoSection = ({
	onNext: _onNext,
	onPrev: _onPrev,
}: VideoSectionProps) => {
	const sectionRef = useRef<HTMLElement | null>(null);

	const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

	const animationFrameRef = useRef<number | null>(null);

	const [activeIndex, setActiveIndex] = useState(0);
	const [progress, setProgress] = useState(0);
	const [isVisible, setIsVisible] = useState(false);

	const { t } = useTranslation();

	const VIDEO_TITLES = [
		t("volt.videos.first-text"),
		t("volt.videos.second-text"),
		t("volt.videos.third-text"),
	];

	const pauseAllVideos = useCallback(() => {
		videoRefs.current.forEach((video) => {
			if (!video) {
				return;
			}

			video.pause();
		});
	}, []);

	const playActiveVideo = useCallback(async () => {
		const video = videoRefs.current[activeIndex];

		if (!video || !isVisible) {
			return;
		}

		try {
			video.muted = true;
			video.playsInline = true;

			await video.play();
		} catch {}
	}, [activeIndex, isVisible]);

	const handleVideoEnded = useCallback(() => {
		setActiveIndex((currentIndex) => {
			return (currentIndex + 1) % VIDEOS.length;
		});
	}, []);

	useEffect(() => {
		const section = sectionRef.current;

		if (!section) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{
				threshold: 0.35,
			}
		);

		observer.observe(section);

		return () => {
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		pauseAllVideos();

		setProgress(0);

		const nextVideo = videoRefs.current[activeIndex];

		if (!nextVideo) {
			return;
		}

		nextVideo.currentTime = 0;

		if (isVisible) {
			void playActiveVideo();
		}
	}, [activeIndex, isVisible, pauseAllVideos, playActiveVideo]);

	useEffect(() => {
		if (!isVisible) {
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current);

				animationFrameRef.current = null;
			}

			return;
		}

		const updateProgress = () => {
			const video = videoRefs.current[activeIndex];

			if (video) {
				const { currentTime, duration } = video;

				if (Number.isFinite(duration) && duration > 0) {
					const nextProgress = (currentTime / duration) * 100;

					setProgress(Math.min(Math.max(nextProgress, 0), 100));
				}
			}

			animationFrameRef.current = requestAnimationFrame(updateProgress);
		};

		animationFrameRef.current = requestAnimationFrame(updateProgress);

		return () => {
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current);

				animationFrameRef.current = null;
			}
		};
	}, [activeIndex, isVisible]);

	useEffect(() => {
		if (!isVisible) {
			pauseAllVideos();
		}
	}, [isVisible, pauseAllVideos]);

	const handleCanPlay = useCallback(
		(index: number) => {
			if (index !== activeIndex || !isVisible) {
				return;
			}

			void playActiveVideo();
		},
		[activeIndex, isVisible, playActiveVideo]
	);

	return (
		<section ref={sectionRef} className={styles.section}>
			<div className={styles.content}>
				<Box variant="black" className={styles.backgroundBox}>
					<div className={styles.containerTitle}>
						{VIDEO_TITLES.map((title, index) => (
							<Typography
								key={title}
								variant="h2"
								color="white"
								weight="medium"
								className={`${styles.title} ${
									index === activeIndex
										? styles.titleActive
										: ""
								}`}
								aria-hidden={index !== activeIndex}
							>
								{title}
							</Typography>
						))}
					</div>

					<div className={styles.videoWrapper}>
						<div className={styles.videoViewport}>
							{VIDEOS.map((src, index) => (
								<video
									key={src}
									ref={(node) => {
										videoRefs.current[index] = node;
									}}
									className={`${styles.video} ${
										index === activeIndex
											? styles.videoActive
											: ""
									}`}
									src={src}
									muted
									playsInline
									preload="auto"
									onEnded={
										index === activeIndex
											? handleVideoEnded
											: undefined
									}
									onCanPlay={() => handleCanPlay(index)}
									aria-hidden={index !== activeIndex}
								/>
							))}

							<div className={styles.videoOverlay} />

							<div
								className={styles.slideIndicators}
								aria-hidden="true"
							>
								{VIDEOS.map((src, index) => {
									const isActive = index === activeIndex;

									return (
										<span
											key={src}
											className={
												isActive
													? styles.indicatorActive
													: styles.indicator
											}
										>
											<span
												className={styles.indicatorFill}
												style={
													{
														"--progress": isActive
															? progress / 100
															: 0,
													} as React.CSSProperties
												}
											/>
										</span>
									);
								})}
							</div>
						</div>
					</div>
				</Box>
			</div>
		</section>
	);
};

export default VideoSection;
