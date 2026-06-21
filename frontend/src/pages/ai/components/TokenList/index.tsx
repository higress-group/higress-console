import { EyeInvisibleTwoTone, EyeTwoTone } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TokenListProps {
  tokens: string[];
}

const DISPLAY_LIMIT = 3;

function maskToken(token: string): string {
  if (token.length > 9) {
    return token.slice(0, 3) + '******' + token.slice(-3);
  }
  if (token.length > 2) {
    return token.slice(0, 1) + '******' + token.slice(-1);
  }
  return token.slice(0, 1) + '******';
}

const TokenList: React.FC<TokenListProps> = ({ tokens }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hiddenTokens, setHiddenTokens] = useState<Record<number, boolean>>({});
  const hasExpandedRef = useRef(false);

  // Sync hiddenTokens when tokens prop changes
  useEffect(() => {
    if (tokens && Array.isArray(tokens) && tokens.length > 0) {
      setHiddenTokens((prev) => {
        const newState: Record<number, boolean> = {};
        tokens.forEach((_, index) => {
          newState[index] = index in prev ? prev[index] : true;
        });
        return newState;
      });
    }
  }, [tokens]);

  // Reset all tokens to hidden when expanding or collapsing
  useEffect(() => {
    if (isExpanded) {
      hasExpandedRef.current = true;
      setHiddenTokens(tokens.reduce((acc, _, index) => ({ ...acc, [index]: true }), {}));
    } else if (hasExpandedRef.current) {
      // Only reset when collapsing (after first expand)
      setHiddenTokens(tokens.reduce((acc, _, index) => ({ ...acc, [index]: true }), {}));
    }
  }, [isExpanded, tokens]);

  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return <span>-</span>;
  }

  const displayTokens = isExpanded ? tokens : tokens.slice(0, DISPLAY_LIMIT);
  const hiddenCount = tokens.length - DISPLAY_LIMIT;

  const toggleTokenVisibility = (index: number) => {
    setHiddenTokens((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {displayTokens.map((token, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ margin: 0 }}>{hiddenTokens[index] ? maskToken(token) : token}</span>
          <span
            onClick={() => toggleTokenVisibility(index)}
            style={{ cursor: 'pointer', lineHeight: 1 }}
          >
            {hiddenTokens[index] ? <EyeInvisibleTwoTone /> : <EyeTwoTone />}
          </span>
        </div>
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

export default TokenList;