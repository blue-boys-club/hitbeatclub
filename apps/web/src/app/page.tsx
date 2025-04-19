"use client";

import { Toggle } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
	return (
		<div className="p-4 space-y-4">
			<ul className="flex flex-col underline text-hbc-blue">
				<li>
					<Link href="/main">Main layout test</Link>
				</li>
				<li>
					<Link href="/artist-info">Artist info layout test</Link>
				</li>
				<li>
					<Link href="/auth">Auth layout test</Link>
				</li>
			</ul>
		</div>
	);
}
