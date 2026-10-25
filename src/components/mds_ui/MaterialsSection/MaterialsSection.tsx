// Copyright (c) 2026 minimorphism
// License GPLv3

import { useTranslation } from "react-i18next";

import styles from "./MaterialsSection.module.scss";
import { Box, Typography } from "@minimorphism/mds-ui";

interface MaterialsSectionProps {
	onNext: () => void;
	onBack: () => void;
}

const MaterialsSection = ({ onNext, onBack }: MaterialsSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
				<Box variant="black" className={styles.backgroundBox}>
					<Typography
						align="center"
						color="white"
						weight="light"
						className={styles.title}
					>
						{t("mds-ui.materials.title")}
					</Typography>

					<div className={styles.grid}>
						<Typography
							color="white"
							weight="light"
							className={styles.description}
						>
							{t("mds-ui.materials.first-desc")}
						</Typography>

						<Box variant="white" className={styles.exampleBox}>
							<Box
								variant="black"
								className={styles.childExampleBox}
							/>
						</Box>

						<Typography
							color="white"
							weight="light"
							className={styles.description}
						>
							{t("mds-ui.materials.second-desc")}
						</Typography>

						<Box variant="white" className={styles.exampleBox} />

						<Typography
							color="white"
							weight="light"
							className={styles.description}
						>
							{t("mds-ui.materials.third-desc")}
						</Typography>

						<Box variant="anodized" className={styles.exampleBox} />
					</div>
				</Box>
		</section>
	);
};

export default MaterialsSection;
