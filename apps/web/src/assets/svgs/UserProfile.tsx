/**
 * 컴포넌트 형식으로 svg 파일을 작성해주세요.
 */

import React from 'react';

interface UserProfileProps {
  className?: string;
}

export const UserProfile = ({ className }: UserProfileProps) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {' '}
    </svg>
  );
};
