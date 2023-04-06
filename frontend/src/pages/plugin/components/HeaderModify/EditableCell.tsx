import { Form } from 'antd';

interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={`index-${index}`}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input !`,
            },
          ]}
        >
          {children}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
