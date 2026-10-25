// Copyright (c) 2026 minimorphism
// License GPLv3

import styles from "./DescSection.module.scss";
import { useTranslation } from "react-i18next";

import { Box, Button, Typography } from "@minimorphism/mds-ui";

interface DescSectionProps {
	onNext: () => void;
	onPrev: () => void;
	onVOLT_Download: () => void;
}

const DescSection = ({ onNext, onVOLT_Download }: DescSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<div className={styles.content}>
				<Typography
					variant="h6"
					color="black"
					align="center"
					weight="light"
					className={styles.title}
				>
					{t("volt.desc.title")}
				</Typography>

				<Box variant="white" className={styles.card}>
					<div className={styles.partDesc}>
						<Typography
							variant="body1"
							color="black"
							className={styles.description}
						>
							{t("volt.desc.body")}
						</Typography>

						<Button
							variant="black"
							size="md"
							onClick={onVOLT_Download}
							className={styles.downloadBtn}
						>
							{t("volt.desc.btn")}
						</Button>
					</div>

					<Box variant="black" className={styles.imageBox}>
						<img
							src="/images/desc_volt.webp"
							alt="Description VOLT"
							className={styles.image}
						/>
					</Box>
				</Box>
			</div>
		</section>
	);
};

export default DescSection;
