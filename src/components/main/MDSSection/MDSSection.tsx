// Copyright (c) 2026 minimorphism
// License GPLv3

import styles from "./MDSSection.module.scss";
import { Box, Button, Typography } from "@minimorphism/mds-ui";

interface MDSSectionProps {
	onNext: () => void;
	onPrev: () => void;
	onMDS: () => void;
}

const MDSSection = ({ onNext, onPrev, onMDS }: MDSSectionProps) => {
	return (
		<section className={styles.section}>
			<Box variant="black" className={styles.backgroundBox}>
				<Box variant="anodized" className={styles.contentBox}>
					<Box variant="black" className={styles.imageBox}>
						<img
							src="/images/mds_ui_screen1.webp"
							alt="Screen1"
							draggable={false}
						/>

						<img
							src="/images/mds_ui_screen2.webp"
							alt="Screen2"
							draggable={false}
						/>

						<img
							src="/images/mds_ui_screen3.webp"
							alt="Screen3"
							draggable={false}
						/>
					</Box>

					<Button
						variant="black"
						onClick={onMDS}
						className={styles.linkBtn}
					>
						<u>minimorphism design system</u>
					</Button>
				</Box>
			</Box>
		</section>
	);
};

export default MDSSection;
