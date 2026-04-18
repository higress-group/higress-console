import { distributeWeightsEqually } from '@/interfaces/route';
import { MinusCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Alert, Button, InputNumber, Space, Table, Tooltip, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

export interface WeightedService {
  id: string;
  name: string;
  weight: number;
}

export interface ServiceWeightTableProps {
  value?: WeightedService[];
  onChange?: (services: WeightedService[]) => void;
  disabled?: boolean;
  /** If true, start in auto mode (auto-distribute on changes) */
  /** If false, start in manual mode (preserve weights, new services = 0) */
  autoMode?: boolean;
}

/** Helper to compare arrays efficiently */
const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

function ServiceWeightTable({
  value = [],
  onChange,
  disabled = false,
  autoMode: initialAutoMode = false,
}: ServiceWeightTableProps) {
  const { t } = useTranslation();
  // Track if we're in auto mode (auto-distribute on service count changes)
  const [isAutoMode, setIsAutoMode] = useState(initialAutoMode);
  // Track previous service names to detect additions/removals
  const prevServiceNamesRef = useRef<string[]>([]);
  // Prevent recursive updates
  const isUpdatingRef = useRef(false);
  // Track timeout for cleanup
  const timeoutRef = useRef<number | null>(null);

  const { sum, isValid } = useMemo(() => {
    const total = value.reduce((acc, s) => {
      // Clamp weight to valid range
      const weight = Math.max(0, Math.min(100, s.weight || 0));
      return acc + weight;
    }, 0);
    return { sum: total, isValid: total === 100 };
  }, [value]);

  // Track if this is the first render
  const isFirstRenderRef = useRef(true);

  // Handle service list changes (additions/removals)
  useEffect(() => {
    if (!onChange || isUpdatingRef.current) {
      return;
    }

    const currentNames = value.map(s => s.name);
    const prevNames = prevServiceNamesRef.current;

    // Skip if no change
    if (arraysEqual(currentNames, prevNames)) {
      isFirstRenderRef.current = false;
      return;
    }

    // Detect what changed
    const addedNames = currentNames.filter(name => !prevNames.includes(name));
    const removedNames = prevNames.filter(name => !currentNames.includes(name));

    // Handle first render with services (initial load)
    if (isFirstRenderRef.current && currentNames.length > 0) {
      isFirstRenderRef.current = false;
      prevServiceNamesRef.current = [...currentNames];

      if (isAutoMode) {
        // Auto mode on first render: distribute equally
        isUpdatingRef.current = true;
        const weights = distributeWeightsEqually(value.length);
        const newServices = value.map((s, index) => ({
          ...s,
          weight: weights[index] || 0,
        }));
        onChange(newServices);
        // Reset flag after state update
        timeoutRef.current = window.setTimeout(() => { isUpdatingRef.current = false; }, 0);
      }
      return;
    }

    isFirstRenderRef.current = false;

    if (addedNames.length > 0 || removedNames.length > 0) {
      if (isAutoMode) {
        // Auto mode: redistribute equally
        isUpdatingRef.current = true;
        const weights = distributeWeightsEqually(value.length);
        const newServices = value.map((s, index) => ({
          ...s,
          weight: weights[index] || 0,
        }));
        onChange(newServices);
        timeoutRef.current = window.setTimeout(() => { isUpdatingRef.current = false; }, 0);
      } else {
        // Manual mode: new services get 0, removed services are already filtered out
        // Just ensure new services have weight 0
        const hasNewServices = addedNames.length > 0 && addedNames.some(name => {
          const svc = value.find(s => s.name === name);
          return svc && (svc.weight === undefined || svc.weight === null);
        });
        if (hasNewServices) {
          isUpdatingRef.current = true;
          const newServices = value.map(s => ({
            ...s,
            weight: s.weight ?? 0,
          }));
          onChange(newServices);
          timeoutRef.current = window.setTimeout(() => { isUpdatingRef.current = false; }, 0);
        }
      }
    }

    prevServiceNamesRef.current = [...currentNames];

    // Cleanup timeout on unmount or before the next effect run.
    // Crucially, also reset isUpdatingRef — otherwise a previous timeout that was
    // cleared here would never run, leaving the flag stuck at true forever.
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isUpdatingRef.current = false;
    };
  }, [value, isAutoMode, onChange]);

  const handleWeightChange = useCallback((id: string, newWeight: number) => {
    // Switch to manual mode when user manually edits weight
    setIsAutoMode(false);
    if (onChange) {
      const newServices = value.map(s => {
        return s.id === id ? { ...s, weight: Math.max(0, Math.min(100, newWeight)) } : s
      });
      onChange(newServices);
    }
  }, [onChange, value]);

  const handleDelete = useCallback((id: string) => {
    if (onChange) {
      const newServices = value.filter(s => s.id !== id);
      onChange(newServices);
      // Note:
      // In auto mode, useEffect will redistribute weights after deletion
      // In manual mode, remaining services keep their weights
    }
  }, [onChange, value]);

  const handleEqualDistribution = useCallback(() => {
    setIsAutoMode(true);
    if (onChange && value.length > 0) {
      const weights = distributeWeightsEqually(value.length);
      const newServices = value.map((s, index) => ({
        ...s,
        weight: weights[index] || 0,
      }));
      onChange(newServices);
    }
  }, [onChange, value]);

  const columns = useMemo(() => [
    {
      title: t('route.weightTable.serviceName'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: t('route.weightTable.weight'),
      dataIndex: 'weight',
      key: 'weight',
      width: 150,
      render: (_: unknown, record: WeightedService) => (
        <Space>
          <InputNumber
            min={0}
            max={100}
            value={record.weight}
            onChange={(val) => handleWeightChange(record.id, val || 0)}
            disabled={disabled || value.length === 1}
            style={{ width: 80 }}
          />
          <Text type="secondary">%</Text>
          {record.weight === 0 && (
            <Tooltip title={t('route.weightTable.zeroWeightWarning')}>
              <WarningOutlined style={{ color: '#faad14' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: t('route.weightTable.action'),
      key: 'action',
      width: 80,
      render: (_: unknown, record: WeightedService) => (
        value.length > 1 ? (
          <Tooltip title={t('route.weightTable.delete')}>
            <Button
              type="text"
              danger
              icon={<MinusCircleOutlined />}
              onClick={() => handleDelete(record.id)}
              disabled={disabled}
              aria-label={String(t('route.weightTable.delete'))}
            />
          </Tooltip>
        ) : null
      ),
    },
  ], [t, disabled, value.length, handleWeightChange, handleDelete]);

  return (
    <div>
      {
        !isValid && (
          <Alert
            message={t('route.weightTable.invalidSum', { sum })}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )
      }

      <Table
        dataSource={value}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="id"
        style={{ marginBottom: 16 }}
      />

      <Space>
        <Button
          onClick={handleEqualDistribution}
          disabled={disabled || value.length <= 1}
        >
          {t('route.weightTable.equalDistribution')}
        </Button>
        <Text type={isValid ? 'secondary' : 'danger'}>
          {t('route.weightTable.sumLabel', { sum })}
        </Text>
      </Space>
    </div>
  );
}

export default ServiceWeightTable;
