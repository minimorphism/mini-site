// Copyright (c) 2026 minimorphism
// License GPLv3

import { useCallback, useState } from "react";
import useSectionInput from "./useSectionInput";

export interface SectionController {
	currentSection: number;
	onNext: () => void;
	onPrev: () => void;
	onGoToSection: (index: number) => void;
}

const useSectionController = (sectionCount: number): SectionController => {
	if (!Number.isInteger(sectionCount) || sectionCount < 1) {
		throw new Error("sectionCount must be positive.");
	}

	const [currentSection, setCurrentSection] = useState(0);

	const onGoToSection = useCallback(
		(index: number) => {
			const boundedIndex = Math.max(0, Math.min(index, sectionCount - 1));

			setCurrentSection(boundedIndex);
		},
		[sectionCount]
	);

	const onNext = useCallback(() => {
		setCurrentSection((current) => Math.min(current + 1, sectionCount - 1));
	}, [sectionCount]);

	const onPrev = useCallback(() => {
		setCurrentSection((current) => Math.max(current - 1, 0));
	}, []);

	useSectionInput({
		sectionCount,
		onNext,
		onPrev,
		onGoToSection,
	});

	return {
		currentSection,
		onNext,
		onPrev,
		onGoToSection,
	};
};

export default useSectionController;
