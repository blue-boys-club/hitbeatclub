"use client";

import { useSearchParams } from "next/navigation";
import { ArtistStudioAccountSettingProfileForm } from "./ArtistStudioAccountSettingProfileForm";
import { ArtistStudioAccountSettingSettlement } from "./ArtistStudioAccountSettingSettlement";
import { ArtistStudioAccountSettingMembership } from "./ArtistStudioAccountSettingMembership";

export const ArtistStudioAccountSettingMain = () => {
	const searchParams = useSearchParams();
	const activeTab = searchParams.get("tab");

	return (
		<div className="w-full flex px-10">
			{activeTab === "profile" && <ArtistStudioAccountSettingProfileForm />}
			{activeTab === "settlement" && <ArtistStudioAccountSettingSettlement />}
			{activeTab === "membership" && <ArtistStudioAccountSettingMembership />}
		</div>
	);
};

ArtistStudioAccountSettingMain.displayName = "ArtistStudioAccountSettingMain";
