import { ArtistStudioAccountSettingHeader } from "@/features/artist-studio/account-setting/components/ArtistStudioAccountSettingHeader";
import { ArtistStudioAccountSettingMain } from "@/features/artist-studio/account-setting/components/ArtistStudioAccountSettingMain";
import { ArtistStudioAccountSettingTabs } from "@/features/artist-studio/account-setting/components/ArtistStudioAccountSettingTabs";

/**
 * 아티스트 스튜디오 계정 설정 페이지 레이아웃 컴포넌트
 */
const ArtistStudioAccountSettingLayout = ({ children }: { children: React.ReactNode }) => {
	return <div className="flex px-4 pt-12 gap-8">{children}</div>;
};

/**
 * 아티스트 스튜디오 계정 설정 페이지
 */
const ArtistStudioAccountSettingPage = () => {
	return (
		<>
			<ArtistStudioAccountSettingHeader />
			<ArtistStudioAccountSettingLayout>
				<ArtistStudioAccountSettingTabs />
				<ArtistStudioAccountSettingMain />
			</ArtistStudioAccountSettingLayout>
		</>
	);
};

export default ArtistStudioAccountSettingPage;
