// Copyright (c) 2026 minimorphism
// License GPLv3

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./FrontendSection.module.scss";

import { openInNewTab } from "../../common/OpenLink/OpenLink";
import { Box, Button, Typography } from "@minimorphism/mds-ui";

interface FrontendSectionProps {
	onNext: () => void;
	onPrev: () => void;
}

const FrontendSection = ({ onNext, onPrev }: FrontendSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<Box variant="black" className={styles.mainBox}>
				<Typography
					weight="light"
					color="white"
					align="center"
					className={styles.title}
				>
					{t("volt-download.frontend.title")}
				</Typography>

				<Box variant="anodized" className={styles.childBox}>
					<img
						src="/images/frontend.webp"
						alt="Description project"
						className={styles.image}
					/>

					<div className={styles.content}>
						<Typography
							weight="light"
							align="center"
							className={styles.boxTitle}
						>
							Frontend
						</Typography>

						<Typography
							weight="light"
							align="center"
							className={styles.boxDesc}
						>
							{t("volt-download.frontend.desc")}
						</Typography>

						<Button
							variant="black"
							className={styles.btnGoTo}
							onClick={() =>
								openInNewTab(
									"https://github.com/minimorphism/volt-ui"
								)
							}
						>
							{t("volt-download.frontend.btn")}
						</Button>
					</div>
				</Box>
			</Box>
		</section>
	);
};

export default FrontendSection;
