import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: '버튼의 스타일 변형',
      control: 'select',
      options: ['fill', 'outline'],
    },
    size: {
      description: '버튼의 크기',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    rounded: {
      description: '버튼 모서리 둥근 정도',
      control: 'select',
      options: ['md', 'full'],
    },
    fontWeight: {
      description: '버튼 폰트 두께',
      control: 'select',
      options: ['extraBold', 'bold', 'semibold'],
    },
    children: {
      description: '버튼 내부 콘텐츠',
      control: 'text',
    },
    onClick: {
      description: '클릭 이벤트 핸들러',
      action: 'clicked',
    },
    disabled: {
      description: '버튼 비활성화 여부',
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '기본 버튼 컴포넌트입니다. variant와 size를 통해 다양한 스타일을 적용할 수 있습니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// 기본 버튼
export const Default: Story = {
  args: {
    children: '버튼',
  },
};

// Fill 버튼 (검정 배경)
export const Fill: Story = {
  args: {
    variant: 'fill',
    children: 'Fill 버튼',
  },
};

// Outline 버튼 (테두리)
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline 버튼',
  },
};

// 크기 변형 예시
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// 모서리 둥근 정도 변형 예시
export const Rounded: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button rounded="md">Default</Button>
      <Button rounded="full">Full</Button>
    </div>
  ),
};

// 폰트 두께 변형 예시
export const FontWeight: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button fontWeight="extraBold">Extra Bold</Button>
      <Button fontWeight="bold">Bold</Button>
      <Button fontWeight="semibold">Semibold</Button>
    </div>
  ),
};

// 모든 변형 조합 예시
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button variant="fill" size="sm" rounded="md" fontWeight="bold">
          Fill Small
        </Button>
        <Button variant="fill" size="md" rounded="md" fontWeight="bold">
          Fill Medium
        </Button>
        <Button variant="fill" size="lg" rounded="md" fontWeight="bold">
          Fill Large
        </Button>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" size="sm" rounded="md" fontWeight="bold">
          Outline Small
        </Button>
        <Button variant="outline" size="md" rounded="md" fontWeight="bold">
          Outline Medium
        </Button>
        <Button variant="outline" size="lg" rounded="md" fontWeight="bold">
          Outline Large
        </Button>
      </div>
      <div className="flex gap-4">
        <Button variant="fill" size="md" rounded="full" fontWeight="extraBold">
          Fill Rounded Full
        </Button>
        <Button variant="outline" size="md" rounded="full" fontWeight="semibold">
          Outline Rounded Full
        </Button>
      </div>
    </div>
  ),
};

// 긴 텍스트 케이스
export const LongText: Story = {
  args: {
    children: '매우 긴 버튼 텍스트 예시입니다',
    variant: 'fill',
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    children: '비활성화 버튼',
    disabled: true,
  },
};

// 커스텀 스타일 예시
export const CustomStyles: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button className="shadow-lg">그림자 효과</Button>
      <Button className="bg-blue-500 hover:bg-blue-600">파란색 버튼</Button>
      <Button className="animate-pulse">애니메이션 효과</Button>
      <Button className="w-[200px]">고정 너비</Button>
    </div>
  ),
};
