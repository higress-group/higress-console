import React, { useEffect } from 'react';
import { useNavigate, useSelector, useDispatch } from 'ice';
import styles from './index.module.css';

const MCPLLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mcpState = useSelector((state) => state.mcp);
  const [activeKey, setActiveKey] = useState('list');

  useEffect(() => {
    const path = window.location.pathname;
    const key = path.split('/').pop() || 'list';
    setActiveKey(key);
    
    // Load configurations if not already loaded
    if (key === 'list' && mcpState.configurations.length === 0) {
      dispatch.mcp.getMCPConfigs({ page: 1, pageSize: 10 });
    }
  }, [window.location.pathname]);

  const handleMenuClick = (key: string) => {
    setActiveKey(key);
    navigate(`/mcp/${key}`);
  };

  return (
    <div className={styles['mcp-layout']}>
      <div className={styles['mcp-sidebar']}>
        <div className={styles['mcp-menu']}>
          <div 
            className={`${styles['mcp-menu-item']} ${activeKey === 'list' ? 'active' : ''}`}
            onClick={() => handleMenuClick('list')}
          >
            MCP Configurations
          </div>
          <div 
            className={`${styles['mcp-menu-item']} ${activeKey === 'add' ? 'active' : ''}`}
            onClick={() => handleMenuClick('add')}
          >
            Create Configuration
          </div>
          <div className={styles['mcp-menu-subtitle']}>Monitoring</div>
          <div 
            className={`${styles['mcp-menu-item']} ${activeKey === 'status' ? 'active' : ''}`}
            onClick={() => handleMenuClick('status')}
          >
            Server Status
          </div>
          <div 
            className={`${styles['mcp-menu-item']} ${activeKey === 'logs' ? 'active' : ''}`}
            onClick={() => handleMenuClick('logs')}
          >
            Logs & Metrics
          </div>
        </div>
      </div>
      <div className={styles['mcp-content']}>
        {children}
      </div>
    </div>
  );
};

export default MCPLLayout;