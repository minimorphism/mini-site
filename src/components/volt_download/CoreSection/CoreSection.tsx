// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./CoreSection.module.scss";
import { Box, Button, Typography } from "@minimorphism/mds-ui";

import { openInNewTab } from "../../common/OpenLink/OpenLink";
import Footer from "../../common/Footer/Footer";

interface CoreSectionProps {
	onPrev: () => void;
}

const CoreSection = ({ onPrev }: CoreSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<Box variant="black" className={styles.card}>
				<img
					src="/images/volt_core.webp"
					alt="VOLT Core"
					className={styles.image}
				/>
				<div className={styles.content}>
					<Typography
						color="white"
						align="center"
						weight="light"
						className={styles.title}
					>
						Core
					</Typography>

					<Typography
						color="white"
						align="center"
						weight="light"
						className={styles.description}
					>
						{t("volt-download.core.desc")}
					</Typography>

					<Button
						variant="anodized"
						className={styles.btnGoTo}
						onClick={() =>
							openInNewTab(
								"https://github.com/minimorphism/volt-core"
							)
						}
					>
						{t("volt-download.core.btn")}
					</Button>
				</div>
			</Box>

			<Footer variant="black" />
		</section>
	);
};

export default CoreSection;
