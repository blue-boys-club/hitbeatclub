import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./toast";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "./toaster";

const meta: Meta<typeof Toast> = {
	title: "UI/Toast",
	component: Toast,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="w-[50vw] h-[200px]">
				<Story />
				<Toaster />
			</div>
		),
	],
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "destructive"],
			description: "토스트의 스타일 변형을 지정합니다.",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Toast>;

// Demo component that shows actual usage with useToast hook

// Story that demonstrates the actual usage
export const ToastWithTrigger: Story = {
	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks -- Storybook Demonstration purpose
		const { toast } = useToast();

		return (
			<div className="flex items-center justify-center w-full">
				<button
					className="w-[200px] border-2 border-hbc-black rounded-md p-2 cursor-pointer"
					onClick={() => {
						toast({
							description: "이것은 토스트 메세지이며 아무렇게 작성할 수 있습니다",
						});
					}}
				>
					일정 추가하기
				</button>
			</div>
		);
	},
};

export const ToastWithTriggerAndReactNode: Story = {
	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks -- Storybook Demonstration purpose
		const { toast } = useToast();

		return (
			<div className="flex items-center justify-center w-full">
				<button
					className="w-[200px] border-2 border-hbc-black rounded-md p-2 cursor-pointer"
					onClick={() => {
						toast({
							description: (
								<p>
									<span className="text-hbc-red">이것은 토스트 메세지이며</span>
									<span className="text-hbc-blue">아무렇게 작성할 수 있습니다</span>
								</p>
							),
						});
					}}
				>
					일정 추가하기
				</button>
			</div>
		);
	},
};
