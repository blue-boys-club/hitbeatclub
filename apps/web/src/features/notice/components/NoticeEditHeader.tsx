"use client";
import { useEffect, useRef } from "react";
import { NoticeEditHeaderProps } from "../notice.types";

export const NoticeEditHeader = ({ title, setTitle }: NoticeEditHeaderProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);
	return (
		<header>
			<input
				ref={inputRef}
				className="px-8 pb-3 border-b-6 outline-none w-full border-black flex justify-start items-center text-black font-bold text-[31px] leading-[46px] tracking-[0.31px] uppercase font-suisse"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
		</header>
	);
};
