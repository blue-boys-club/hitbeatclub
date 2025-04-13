import type { Meta, StoryObj } from '@storybook/react';
import { FilterButton } from './FilterButton';

const meta: Meta<typeof FilterButton> = {
  title: 'UI/FilterButton',
  component: FilterButton,
  tags: ['autodocs'],
  argTypes: {
    rounded: {
      description: '버튼의 모서리 스타일',
      control: 'select',
      options: ['none', 'full'],
    },
    onFilterChange: {
      description: '필터 상태 변경 시 호출되는 콜백 함수',
      action: 'filter changed',
    },
    className: {
      description: '추가적인 스타일링을 위한 클래스',
      control: 'text',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '필터 기능을 위한 토글 버튼 컴포넌트입니다. 클릭 시 배경색과 텍스트 색상이 반전됩니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterButton>;

// 기본 필터 버튼
export const Default: Story = {
  args: {
    children: '필터',
  },
};

// 둥근 모서리 버튼
export const Rounded: Story = {
  args: {
    children: '필터',
    rounded: 'full',
  },
};

// 다양한 텍스트 길이
export const TextVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <FilterButton>짧은</FilterButton>
        <FilterButton>일반 길이 텍스트</FilterButton>
        <FilterButton>매우 긴 필터 버튼 텍스트입니다</FilterButton>
      </div>
      <div className="flex gap-4">
        <FilterButton rounded="full">짧은</FilterButton>
        <FilterButton rounded="full">일반 길이 텍스트</FilterButton>
        <FilterButton rounded="full">매우 긴 필터 버튼 텍스트입니다</FilterButton>
      </div>
    </div>
  ),
};

// 필터 그룹 예시
export const FilterGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <FilterButton>전체</FilterButton>
      <FilterButton>힙합</FilterButton>
      <FilterButton>R&B</FilterButton>
      <FilterButton>록</FilterButton>
      <FilterButton>재즈</FilterButton>
    </div>
  ),
};

// 둥근 모서리 필터 그룹
export const RoundedFilterGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <FilterButton rounded="full">전체</FilterButton>
      <FilterButton rounded="full">힙합</FilterButton>
      <FilterButton rounded="full">R&B</FilterButton>
      <FilterButton rounded="full">록</FilterButton>
      <FilterButton rounded="full">재즈</FilterButton>
    </div>
  ),
};

// 상태 변경 로깅 예시
export const WithLogging: Story = {
  args: {
    children: '로깅 테스트',
    onFilterChange: () => console.log('필터 상태 변경'),
  },
};

// 커스텀 스타일 예시
export const CustomStyles: Story = {
  render: () => (
    <div className="flex gap-4">
      <FilterButton className="shadow-lg">그림자</FilterButton>
      <FilterButton className="min-w-[150px]">고정 너비</FilterButton>
      <FilterButton className="text-lg">큰 텍스트</FilterButton>
    </div>
  ),
};
