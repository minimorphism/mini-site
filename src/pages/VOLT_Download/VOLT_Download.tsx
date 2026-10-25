// Copyright (c) 2026 minimorphism
// License GPLv3

import FirstSection from "../../components/volt_download/FirstSection/FirstSection";
import FrontendSection from "../../components/volt_download/FrontendSection/FrontendSection";
import SystemSection from "../../components/volt_download/SystemSection/SystemSection";
import CoreSection from "../../components/volt_download/CoreSection/CoreSection";
import FullPageScroller from "../../components/common/FullPageScroller/FullPageScroller";

interface VOLT_DownloadProps {
	currentSection: number;

	onNext: () => void;
	onPrev: () => void;

	onGoToSection: (index: number) => void;

	onLogoClick: () => void;
}

const VOLT_Download = ({
	currentSection,
	onNext,
	onPrev,
	onGoToSection,
	onLogoClick,
}: VOLT_DownloadProps) => (
	<FullPageScroller
		currentSection={currentSection}
		onGoToSection={onGoToSection}
		sections={[
			<FirstSection
				key="volt-download-first"
				onNext={onNext}
				onLogoClick={onLogoClick}
			/>,
			<FrontendSection
				key="volt-download-frontend"
				onNext={onNext}
				onPrev={onPrev}
			/>,
			<SystemSection
				key="volt-download-system"
				onNext={onNext}
				onPrev={onPrev}
			/>,
			<CoreSection key="volt-download-core" onPrev={onPrev} />,
		]}
	/>
);

export default VOLT_Download;
