import React from 'react';

const StepTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    }}
  >
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        border: '1px solid rgb(25, 28, 31)',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: 'rgb(25, 28, 31)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
    {children}
  </div>
);

export default StepTitle;
