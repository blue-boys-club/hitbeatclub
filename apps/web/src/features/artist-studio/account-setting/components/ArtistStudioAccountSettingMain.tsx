"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArtistStudioAccountSettingProfileForm } from "./ArtistStudioAccountSettingProfileForm";
import { ArtistStudioAccountSettingSettlement } from "./ArtistStudioAccountSettingSettlement";
import { ArtistStudioAccountSettingMembership } from "./ArtistStudioAccountSettingMembership";
import { getArtistMeQueryOption } from "@/apis/artist/query/artist.query-options";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const ArtistStudioAccountSettingMain = () => {
	const { data: artistMe } = useQuery({ ...getArtistMeQueryOption(), retry: 1 });
	const router = useRouter();
	const searchParams = useSearchParams();
	const activeTab = searchParams?.get("tab");

	useEffect(() => {
		if (!artistMe) return;
		if (!activeTab) {
			router.push(`/artist-studio/${artistMe.id}/setting?tab=profile`);
		}
	}, [activeTab, artistMe, router]);

	return (
		<div className="w-full flex px-10 pb-10">
			{activeTab === "profile" && <ArtistStudioAccountSettingProfileForm />}
			{activeTab === "settlement" && <ArtistStudioAccountSettingSettlement />}
			{activeTab === "membership" && <ArtistStudioAccountSettingMembership />}
		</div>
	);
};

ArtistStudioAccountSettingMain.displayName = "ArtistStudioAccountSettingMain";
