import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import MultiTagGenreInput from "./MultiTagGenreInput";
import { Tag } from "./Tag";
import { Genre } from "./Genre";

const meta: Meta<typeof MultiTagGenreInput> = {
	title: "UI/MultiTagGenreInput",
	component: MultiTagGenreInput,
	tags: ["autodocs"],
	argTypes: {
		maxItems: {
			control: "number",
			description: "최대 태그/장르 개수",
		},
		type: {
			control: "select",
			options: ["tag", "genre"],
			description: "태그/장르 타입",
		},
		placeholder: {
			control: "text",
			description: "입력 필드의 플레이스홀더 텍스트",
		},
		allowDirectInput: {
			control: "boolean",
			description: "직접 입력 허용 여부",
		},
		useSearchTagTrigger: {
			control: "boolean",
			description: "SearchTag를 트리거로 사용할지 여부",
		},
		renderItemsInDropdown: {
			control: "boolean",
			description: "드롭다운에서 아이템 렌더링 여부",
		},
	},
};

export default meta;
type Story = StoryObj<typeof MultiTagGenreInput>;

// 테스트용 태그 데이터
const suggestedTags = [
	{ id: 1, value: "음악", count: 120 },
	{ id: 2, value: "댄스", count: 85 },
	{ id: 3, value: "힙합", count: 65 },
	{ id: 4, value: "재즈", count: 45 },
	{ id: 5, value: "클래식", count: 30 },
	{ id: 6, value: "팝", count: 95 },
	{ id: 7, value: "록", count: 75 },
	{ id: 8, value: "일렉트로닉", count: 55 },
];

// 테스트용 장르 데이터
const suggestedGenres = [
	{ id: 1, value: "Pop", count: 200 },
	{ id: 2, value: "Rock", count: 150 },
	{ id: 3, value: "Hip Hop", count: 180 },
	{ id: 4, value: "Electronic", count: 120 },
	{ id: 5, value: "Jazz", count: 80 },
	{ id: 6, value: "Classical", count: 60 },
	{ id: 7, value: "R&B", count: 140 },
	{ id: 8, value: "Country", count: 90 },
];

// 인터랙티브 템플릿
const InteractiveTemplate = (args: any) => {
	const [items, setItems] = useState<Array<Tag | Genre>>(args.initialItems || []);

	const handleChange = (newItems: Array<Tag | Genre>) => {
		setItems(newItems);
		args.onChange?.(newItems);
	};

	return (
		<div style={{ width: "400px", padding: "20px" }}>
			<MultiTagGenreInput
				{...args}
				initialItems={items}
				onChange={handleChange}
			/>
			<div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
				<h4>선택된 아이템:</h4>
				<ul>
					{items.map((item, index) => (
						<li key={index}>
							ID: {item.id}, Text: {item.text}, isFromDropdown: {item.isFromDropdown ? "true" : "false"}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export const DefaultTag: Story = {
	render: InteractiveTemplate,
	args: {
		maxItems: 5,
		type: "tag",
		placeholder: "태그를 입력하세요",
		allowDirectInput: true,
		suggestedItems: suggestedTags,
		useSearchTagTrigger: false,
		renderItemsInDropdown: true,
	},
};

export const DefaultGenre: Story = {
	render: InteractiveTemplate,
	args: {
		maxItems: 5,
		type: "genre",
		placeholder: "장르를 입력하세요",
		allowDirectInput: true,
		suggestedItems: suggestedGenres,
		useSearchTagTrigger: false,
		renderItemsInDropdown: true,
	},
};

export const WithInitialItems: Story = {
	render: InteractiveTemplate,
	args: {
		maxItems: 5,
		type: "tag",
		placeholder: "태그를 추가하세요",
		allowDirectInput: true,
		suggestedItems: suggestedTags,
		initialItems: [
			{ id: 1, text: "음악", isFromDropdown: true },
			{ id: 3, text: "힙합", isFromDropdown: true },
		],
		useSearchTagTrigger: false,
		renderItemsInDropdown: true,
	},
};

export const LimitedItems: Story = {
	render: InteractiveTemplate,
	args: {
		maxItems: 3,
		type: "tag",
		placeholder: "최대 3개의 태그만 입력 가능합니다",
		allowDirectInput: true,
		suggestedItems: suggestedTags,
		useSearchTagTrigger: false,
		renderItemsInDropdown: true,
	},
};

export const NoDirectInput: Story = {
	render: InteractiveTemplate,
	args: {
		maxItems: 5,
		type: "genre",
		placeholder: "제안된 장르만 선택 가능합니다",
		allowDirectInput: false,
		suggestedItems: suggestedGenres,
		useSearchTagTrigger: false,
		renderItemsInDropdown: true,
	},
};

export const WithSearchTagTrigger: Story = {
	render: InteractiveTemplate,
	args: {
		maxItems: 5,
		type: "tag",
		placeholder: "SearchTag 트리거 사용",
		allowDirectInput: true,
		suggestedItems: suggestedTags,
		useSearchTagTrigger: true,
		renderItemsInDropdown: true,
	},
};

export const WithoutDropdownRendering: Story = {
	render: InteractiveTemplate,
	args: {
		maxItems: 5,
		type: "tag",
		placeholder: "드롭다운에서 아이템을 렌더링하지 않음",
		allowDirectInput: true,
		suggestedItems: suggestedTags,
		useSearchTagTrigger: false,
		renderItemsInDropdown: false,
	},
};

export const GenreWithInitialItems: Story = {
	render: InteractiveTemplate,
	args: {
		maxItems: 4,
		type: "genre",
		placeholder: "장르를 선택하세요",
		allowDirectInput: false,
		suggestedItems: suggestedGenres,
		initialItems: [
			{ id: 1, text: "Pop", isFromDropdown: true },
			{ id: 3, text: "Hip Hop", isFromDropdown: true },
		],
		useSearchTagTrigger: false,
		renderItemsInDropdown: true,
	},
};
