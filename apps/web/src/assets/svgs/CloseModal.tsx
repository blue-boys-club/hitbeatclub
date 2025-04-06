export const CloseModal = () => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '50%',
        padding: 4,
        display: 'inline-flex',
      }}
    >
      <div
        style={{
          backgroundColor: 'black',
          borderRadius: '50%',
          padding: 4,
          display: 'inline-flex',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="29"
          height="30"
          viewBox="0 0 29 30"
          fill="none"
        >
          <path d="M7.67676 7.92871L21.8189 22.0708" stroke="white" strokeWidth="3" />
          <path d="M7.67676 22.0713L21.8189 7.92915" stroke="white" strokeWidth="3" />
        </svg>
      </div>
    </div>
  );
};
