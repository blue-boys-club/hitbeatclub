interface DownloadProps {
  color?: string;
}

export const Download = ({ color }: DownloadProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M7.5 10.6177L2.27834 5.39608L4.13154 3.56468L6.18096 5.6359V0H8.81904V5.6359L10.8685 3.56468L12.7217 5.39608L7.5 10.6177ZM0 15V9.80015H2.63808V12.3619H12.3619V9.80015H15V15H0Z"
        fill={color || '#000'}
      />
    </svg>
  );
};
