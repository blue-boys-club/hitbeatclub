import type { Meta, StoryObj } from '@storybook/react';
import { GenreButton } from './GenreButton';

const meta: Meta<typeof GenreButton> = {
  title: 'UI/GenreButton',
  component: GenreButton,
  tags: ['autodocs'],
  argTypes: {
    genreName: {
      description: '장르 이름',
      control: 'text',
    },
    showDeleteButton: {
      description: '삭제 버튼 표시 여부',
      control: 'boolean',
    },
    onDelete: {
      description: '삭제 버튼 클릭 시 실행될 함수',
      action: 'deleted',
    },
    className: {
      description: '추가 스타일링을 위한 className',
      control: 'text',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '장르를 표시하는 버튼 컴포넌트입니다. 삭제 버튼 표시 여부에 따라 hover 효과가 다르게 적용됩니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GenreButton>;

// 기본 상태 (삭제 버튼 있음)
export const Default: Story = {
  args: {
    genreName: 'Boom bap',
    showDeleteButton: false,
  },
};

// 삭제 버튼 없는 상태 (hover 효과 있음)
export const WithoutDeleteButton: Story = {
  args: {
    genreName: 'Boom bap',
    showDeleteButton: false,
  },
};

// 긴 텍스트 케이스
export const LongGenreName: Story = {
  args: {
    genreName: 'Alternative Progressive Rock Metal',
    showDeleteButton: true,
  },
};

// 한글 장르명 케이스
export const KoreanGenreName: Story = {
  args: {
    genreName: '힙합',
    showDeleteButton: true,
  },
};

// 커스텀 스타일 적용
export const WithCustomStyle: Story = {
  args: {
    genreName: 'Jazz',
    showDeleteButton: true,
    className: 'shadow-lg',
  },
};

// 여러 장르 버튼을 함께 표시
export const MultipleGenreButtons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <GenreButton genreName="Hip Hop" showDeleteButton={true} />
      <GenreButton genreName="R&B" showDeleteButton={true} />
      <GenreButton genreName="Jazz" showDeleteButton={false} />
      <GenreButton genreName="Rock" showDeleteButton={true} />
    </div>
  ),
};

// 인터랙션 테스트를 위한 스토리
export const WithInteraction: Story = {
  args: {
    genreName: 'Click to Delete',
    showDeleteButton: true,
    onDelete: () => alert('장르가 삭제되었습니다.'),
  },
};
