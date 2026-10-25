// Copyright (c) 2026 minimorphism
// License GPLv3

import styles from "./SystemSection.module.scss";
import { useTranslation } from "react-i18next";

import { openInNewTab } from "../../common/OpenLink/OpenLink";
import { Box, Button, Typography } from "@minimorphism/mds-ui";

interface SystemSectionProps {
	onNext: () => void;
	onPrev: () => void;
}

const SystemSection = ({ onNext, onPrev }: SystemSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className={styles.section}>
			<Box variant="white" className={styles.card}>
				<div className={styles.content}>
					<Typography align="center" className={styles.title}>
						System
					</Typography>

					<Typography
						color="black"
						align="center"
						className={styles.description}
					>
						{t("volt-download.system.desc")}
					</Typography>

					<Button
						variant="black"
						size="md"
						className={styles.btnGoTo}
						onClick={() =>
							openInNewTab(
								"https://github.com/minimorphism/volt-wallet"
							)
						}
					>
						{t("volt-download.system.btn")}
					</Button>
				</div>

				<Box variant="black" className={styles.imageBox}>
					<img
						src="/images/system_phone.webp"
						alt="System Phone"
						className={styles.image}
					/>
				</Box>
			</Box>
		</section>
	);
};

export default SystemSection;
