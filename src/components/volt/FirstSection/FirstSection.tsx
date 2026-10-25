// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";

import styles from "./FirstSection.module.scss";
import Header from "../../common/Header/Header";

interface FirstSectionProps {
	onNext: () => void;
	onLogoClick?: () => void;
}

const FirstSection = ({ onNext, onLogoClick }: FirstSectionProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	return (
		<section className={styles.section}>
			<Header variant="white" onLogoClick={onLogoClick} />

			<div className={styles.content}>
				<video
					ref={videoRef}
					className={styles.video}
					autoPlay
					muted
					playsInline
					preload="auto"
				>
					<source src="/videos/first.webm" type="video/webm" />
					Your browser does not support videos :(
				</video>
			</div>
		</section>
	);
};

export default FirstSection;
