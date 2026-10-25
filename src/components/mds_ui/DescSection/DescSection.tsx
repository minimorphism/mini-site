// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./DescSection.module.scss";

import { Box, Typography } from "@minimorphism/mds-ui";

interface DescSectionProps {
	onNext: () => void;
	onBack: () => void;
}

const DescSection = ({ onNext, onBack }: DescSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<div className={styles.content}>
				<Box variant="black" className={styles.backgroundBox}>
					<Typography color="white" className={styles.title}>
						{t("mds-ui.desc.title")}
					</Typography>

					<div className={styles.content}>
						<Typography
							color="white"
							className={styles.description}
						>
							{t("mds-ui.desc.desc")}
						</Typography>

						<Box variant="anodized" className={styles.exampleBox} />
					</div>
				</Box>
			</div>
		</section>
	);
};

export default DescSection;
