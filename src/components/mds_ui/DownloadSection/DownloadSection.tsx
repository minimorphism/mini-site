// Copyright (c) 2026 minimorohism
// License GPLv3

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./DownloadSection.module.scss";
import { Box, Button, Typography } from "@minimorphism/mds-ui";

import { openInNewTab } from "../../common/OpenLink/OpenLink";
import Footer from "../../common/Footer/Footer";

interface DownloadSectionProps {
	onBack: () => void;
}

const DownloadSection = ({ onBack }: DownloadSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<Box variant="black" className={styles.backgroundBox}>
				<Typography
					weight="light"
					align="center"
					color="white"
					className={styles.title}
				>
					{t("mds-ui.download.title")}
				</Typography>

				<Button
					variant="anodized"
					className={styles.goToBtn}
					onClick={() =>
						openInNewTab("https://github.com/minimorphism/mds-ui")
					}
				>
					{t("mds-ui.download.btn")}
				</Button>
			</Box>

			<Footer variant="white" />
		</section>
	);
};

export default DownloadSection;
