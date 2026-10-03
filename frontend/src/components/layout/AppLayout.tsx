import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <TopNav />

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px',
            backgroundColor: 'var(--color-bg-primary)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
