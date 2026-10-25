// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./FirstSection.module.scss";

import { openInNewTab } from "../../common/OpenLink/OpenLink";
import Header from "../../common/Header/Header";

import { Box, Button, Typography } from "@minimorphism/mds-ui";

interface FirstSectionProps {
	onNext: () => void;
	onLogoClick?: () => void;
}

const FirstSection = ({ onNext, onLogoClick }: FirstSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<Header variant="black" onLogoClick={onLogoClick} />

			<div className={styles.content}>
				<Box variant="white" className={styles.whiteBox}>
					<Typography
						variant="h1"
						weight="light"
						className={styles.title}
					>
						minimorphism design system
					</Typography>
				</Box>
				<div className={styles.actions}>
					<Button
						variant="black"
						type="button"
						className={styles.readManifestoBtn}
						onClick={() =>
							openInNewTab(
								"https://github.com/minimorphism/mds-ui/blob/main/Manifest/Manifest.md"
							)
						}
					>
						{t("mds-ui.first.first-btn")}
					</Button>

					<Button
						variant="black"
						type="button"
						className={styles.goToBtn}
						onClick={() =>
							openInNewTab(
								"https://www.npmjs.com/package/@minimorphism/mds-ui"
							)
						}
					>
						{t("mds-ui.first.second-btn")}
					</Button>
				</div>
			</div>
		</section>
	);
};

export default FirstSection;
