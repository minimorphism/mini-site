// Copyright (c) 2026 minimorphism
// License GPLv3

import FirstSection from "../../components/main/FirstSection/FirstSection";
import MDSSection from "../../components/main/MDSSection/MDSSection";
import FRISPSection from "../../components/main/FRISPSection/FRISPSection";
import FullPageScroller from "../../components/common/FullPageScroller/FullPageScroller";

interface MainProps {
	currentSection: number;

	onNext: () => void;
	onPrev: () => void;

	onGoToSection: (index: number) => void;

	onGoToMDS: () => void;
	onGoToVOLT: () => void;
	onGoToVOLT_Download: () => void;
	onLogoClick: () => void;
}

const Main = ({
	currentSection,
	onNext,
	onPrev,
	onGoToSection,
	onGoToVOLT,
	onGoToMDS,
	onGoToVOLT_Download,
	onLogoClick,
}: MainProps) => (
	<FullPageScroller
		currentSection={currentSection}
		onGoToSection={onGoToSection}
		sections={[
			<FirstSection
				key="main-first"
				onNext={onNext}
				onVolt={onGoToVOLT}
				onLogoClick={onLogoClick}
				onVOLT_Download={onGoToVOLT_Download}
			/>,
			<MDSSection
				key="main-mds"
				onNext={onNext}
				onPrev={onPrev}
				onMDS={onGoToMDS}
			/>,
			<FRISPSection key="main-frisp" onPrev={onPrev} />,
		]}
	/>
);

export default Main;
