// Copyright (c) 2026 minimorphism
// License GPLv3

import FirstSection from "../../components/volt/FirstSection/FirstSection";
import DescSection from "../../components/volt/DescSection/DescSection";
import VideoSection from "../../components/volt/VideoSection/VideoSection";
import VOLT_IDSection from "../../components/volt/VOLT_IDSection/VOLT_IDSection";
import FullPageScroller from "../../components/common/FullPageScroller/FullPageScroller";

interface VOLTProps {
	currentSection: number;

	onNext: () => void;
	onPrev: () => void;

	onGoToSection: (index: number) => void;
	onGoToVOLT_Download: () => void;
	onLogoClick: () => void;
}

const VOLT = ({
	currentSection,
	onNext,
	onPrev,
	onGoToSection,
	onGoToVOLT_Download,
	onLogoClick,
}: VOLTProps) => (
	<FullPageScroller
		currentSection={currentSection}
		onGoToSection={onGoToSection}
		sections={[
			<FirstSection
				key="volt-first"
				onNext={onNext}
				onLogoClick={onLogoClick}
			/>,
			<DescSection
				key="volt-description"
				onNext={onNext}
				onPrev={onPrev}
				onVOLT_Download={onGoToVOLT_Download}
			/>,
			<VideoSection key="volt-video" onNext={onNext} onPrev={onPrev} />,
			<VOLT_IDSection
				key="volt-id"
				onPrev={onPrev}
				onVOLT_Download={onGoToVOLT_Download}
			/>,
		]}
	/>
);

export default VOLT;
