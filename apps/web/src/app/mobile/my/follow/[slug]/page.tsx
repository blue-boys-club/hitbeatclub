"use client";

import { MobileMyFollowArtistPage } from "@/page/MobileMyFollowArtistPage";
import { redirect, useParams } from "next/navigation";

const MobileMyFollowArtistRoute = () => {
	const { slug } = useParams();
	if (!slug || typeof slug !== "string") {
		redirect("/404");
	}
	return <MobileMyFollowArtistPage slug={slug} />;
};

export default MobileMyFollowArtistRoute;
