import React from "react";

import { NoticeCreateHeaderProps } from "../notice.types";

export const NoticeCreateHeader = ({ title, setTitle }: NoticeCreateHeaderProps) => {
	return (
		<header className="px-8 pb-3 border-6 border-b-black border-t-0 border-x-0">
			<input
				className="text-[#000] w-full font-suisse text-[31px] font-bold leading-[46px] tracking-[0.31px] outline-none"
				placeholder="제목을 입력해주세요"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
		</header>
	);
};
