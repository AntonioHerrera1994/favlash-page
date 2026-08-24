import type { ReactNode } from 'react';

type Props = {
  onClose: () => void;
  children: ReactNode;
  width?: string;
};

export default function Modal({ onClose, children, width = '420px' }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(6,6,7,0.72)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#18171a',
          border: '1px solid #2a282d',
          borderRadius: '14px',
          padding: '1.75rem',
          width: `min(${width}, 92vw)`,
          maxHeight: '85vh',
          overflowY: 'auto',
          color: '#f2ede7',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        {children}
      </div>
    </div>
  );
}