import type { Meta, StoryObj } from "@storybook/react";
import * as Popup from ".";

const StorybookButton = ({
	children,
	...props
}: {
	children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
	<button
		className="p-2 border-2 rounded-md cursor-pointer border-hbc-black"
		{...props}
	>
		{children}
	</button>
);

/**
 * 팝업 컴포넌트는 기본 창 또는 다른 팝업 창 위에 오버레이되는 윈도우를 제공합니다.
 * 아래의 콘텐츠를 비활성화하고 모달 형태의 상호작용을 가능하게 합니다.
 */
const meta: Meta<typeof Popup.Popup> = {
	title: "UI/Popup.Popup",
	component: Popup.Popup,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="flex items-center justify-center p-8">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Popup.Popup>;

export const Basic: Story = {
	render: () => (
		<Popup.Popup>
			<Popup.PopupTrigger asChild>
				<StorybookButton>기본 팝업</StorybookButton>
			</Popup.PopupTrigger>
			<Popup.PopupContent>
				<Popup.PopupHeader>
					<Popup.PopupTitle>기본 팝업</Popup.PopupTitle>
					<Popup.PopupDescription>
						이것은 기본적인 팝업 예시입니다. 닫기 버튼을 클릭하거나 오버레이를 클릭하여 닫을 수 있습니다.
					</Popup.PopupDescription>
				</Popup.PopupHeader>
			</Popup.PopupContent>
		</Popup.Popup>
	),
};

export const WithFooter: Story = {
	render: () => (
		<Popup.Popup>
			<Popup.PopupTrigger asChild>
				<StorybookButton>Open Popup.Popup with Footer</StorybookButton>
			</Popup.PopupTrigger>
			<Popup.PopupContent>
				<Popup.PopupHeader>
					<Popup.PopupTitle>계정 삭제</Popup.PopupTitle>
					<Popup.PopupDescription>
						{"정말로 계정을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다."}
					</Popup.PopupDescription>
				</Popup.PopupHeader>
				<Popup.PopupFooter>
					<Popup.PopupButton type="button">취소</Popup.PopupButton>
					<Popup.PopupButton type="submit">삭제</Popup.PopupButton>
				</Popup.PopupFooter>
			</Popup.PopupContent>
		</Popup.Popup>
	),
};

export const LongContent: Story = {
	render: () => (
		<Popup.Popup>
			<Popup.PopupTrigger asChild>
				<StorybookButton>Open Long Popup.Popup</StorybookButton>
			</Popup.PopupTrigger>
			<Popup.PopupContent>
				<Popup.PopupHeader>
					<Popup.PopupTitle>긴 내용의 팝업</Popup.PopupTitle>
					<Popup.PopupDescription>스크롤이 가능한 긴 내용을 포함하는 팝업입니다.</Popup.PopupDescription>

					<div className="py-4">
						{Array.from({ length: 15 }, (_, i) => (
							<p
								key={i}
								className="mb-4"
							>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua.
							</p>
						))}
					</div>
				</Popup.PopupHeader>
				<Popup.PopupFooter>
					<Popup.PopupButton type="submit">확인</Popup.PopupButton>
				</Popup.PopupFooter>
			</Popup.PopupContent>
		</Popup.Popup>
	),
};

export const withCustomCloseButton: Story = {
	render: () => (
		<Popup.Popup>
			<Popup.PopupTrigger asChild>
				<StorybookButton>Open Popup.Popup with Custom Close Button</StorybookButton>
			</Popup.PopupTrigger>
			<Popup.PopupContent>
				<Popup.PopupHeader>
					<Popup.PopupTitle>계정 삭제</Popup.PopupTitle>
					<Popup.PopupDescription>
						{"정말로 계정을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다."}
					</Popup.PopupDescription>
				</Popup.PopupHeader>
				<Popup.PopupFooter>
					<Popup.PopupClose asChild>
						<StorybookButton>닫기</StorybookButton>
					</Popup.PopupClose>
				</Popup.PopupFooter>
			</Popup.PopupContent>
		</Popup.Popup>
	),
};
