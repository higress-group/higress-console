import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ConsumerListProps {
  consumers: string[];
}

const DISPLAY_LIMIT = 3;

const ConsumerList: React.FC<ConsumerListProps> = ({ consumers }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasExpandedRef = useRef(false);

  // Sync state when consumers prop changes
  useEffect(() => {
    if (hasExpandedRef.current) {
      setIsExpanded(false);
      hasExpandedRef.current = false;
    }
  }, [consumers]);

  if (!consumers || !Array.isArray(consumers) || consumers.length === 0) {
    return <span>-</span>;
  }

  const displayConsumers = isExpanded ? consumers : consumers.slice(0, DISPLAY_LIMIT);
  const hiddenCount = consumers.length - DISPLAY_LIMIT;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    hasExpandedRef.current = true;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {displayConsumers.map((consumer, index) => (
        <span key={index}>{consumer}</span>
      ))}
      {!isExpanded && hiddenCount > 0 && (
        <a onClick={toggleExpand} style={{ cursor: 'pointer' }}>
          {t('misc.showMore', { count: hiddenCount })}
        </a>
      )}
      {isExpanded && hiddenCount > 0 && (
        <a onClick={toggleExpand} style={{ cursor: 'pointer' }}>
          {t('misc.collapse')}
        </a>
      )}
    </div>
  );
};

export default ConsumerList;