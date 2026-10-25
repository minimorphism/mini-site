// Copyright (c) 2026 minimorphism
// License GPLv3

import FirstSection from "../../components/mds_ui/FirstSection/FirstSection";
import DescSection from "../../components/mds_ui/DescSection/DescSection";
import ObjectsSection from "../../components/mds_ui/ObjectsSection/ObjectsSection";
import MaterialsSection from "../../components/mds_ui/MaterialsSection/MaterialsSection";
import LightSection from "../../components/mds_ui/LightSection/LightSection";
import DownloadSection from "../../components/mds_ui/DownloadSection/DownloadSection";
import FullPageScroller from "../../components/common/FullPageScroller/FullPageScroller";

interface MDS_UIProps {
	currentSection: number;

	onNext: () => void;
	onPrev: () => void;

	onGoToSection: (index: number) => void;
	onLogoClick: () => void;
}

const MDS_UI = ({
	currentSection,
	onNext,
	onPrev,
	onGoToSection,
	onLogoClick,
}: MDS_UIProps) => (
	<FullPageScroller
		currentSection={currentSection}
		onGoToSection={onGoToSection}
		sections={[
			<FirstSection
				key="mds-first"
				onNext={onNext}
				onLogoClick={onLogoClick}
			/>,
			<DescSection
				key="mds-description"
				onNext={onNext}
				onBack={onPrev}
			/>,
			<ObjectsSection
				key="mds-objects"
				onNext={onNext}
				onBack={onPrev}
			/>,
			<MaterialsSection
				key="mds-materials"
				onNext={onNext}
				onBack={onPrev}
			/>,
			<LightSection key="mds-light" onNext={onNext} onBack={onPrev} />,
			<DownloadSection key="mds-download" onBack={onPrev} />,
		]}
	/>
);

export default MDS_UI;
