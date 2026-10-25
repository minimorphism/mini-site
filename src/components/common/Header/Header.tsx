// Copyright (c) 2026 minimorphism
// License GPLv3

import { useEffect, useRef, useState } from "react";

import styles from "./Header.module.scss";
import { Icons } from "../Icons/Icons";

export type HeaderVariant = "black" | "white";

interface HeaderProps {
	variant?: HeaderVariant;
	rightImage?: string;
	onLogoClick?: () => void;
}

const UNDERLINE_LIFETIME = 6000;

const Header = ({
	variant = "white",
	rightImage,
	onLogoClick,
}: HeaderProps) => {
	const [isCompanyActive, setIsCompanyActive] = useState(false);

	const underlineTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);

	const defaultRightImage =
		variant === "white"
			? "/images/be_free_black.webp"
			: "/images/be_free_white.webp";

	const imageSrc = rightImage ?? defaultRightImage;
	const handleCompanyEnter = () => {
		if (underlineTimeoutRef.current) {
			clearTimeout(underlineTimeoutRef.current);
		}

		setIsCompanyActive(true);
	};

	const handleCompanyLeave = () => {
		if (underlineTimeoutRef.current) {
			clearTimeout(underlineTimeoutRef.current);
		}

		underlineTimeoutRef.current = setTimeout(() => {
			setIsCompanyActive(false);
		}, UNDERLINE_LIFETIME);
	};

	useEffect(() => {
		return () => {
			if (underlineTimeoutRef.current) {
				clearTimeout(underlineTimeoutRef.current);
			}
		};
	}, []);

	return (
		<header className={`${styles.header} ${styles[variant]}`}>
			<button
				type="button"
				className={styles.logoButton}
				onClick={onLogoClick}
				aria-label="home"
			>
				<Icons.MiniLogo className={styles.logo} />
			</button>

			<div
				className={`${styles.companyName} ${
					isCompanyActive ? styles.companyNameActive : ""
				}`}
				aria-label="minimorphism"
				onMouseEnter={handleCompanyEnter}
				onMouseLeave={handleCompanyLeave}
			>
				<span className={styles.companyText}>minimorphism</span>
			</div>

			<div className={styles.rightMark}>
				<img
					src={imageSrc}
					alt=""
					className={styles.rightImage}
					aria-hidden="true"
					draggable={false}
				/>
			</div>
		</header>
	);
};

export default Header;
