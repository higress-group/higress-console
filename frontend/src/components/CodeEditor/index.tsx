import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';

export interface IProps {
  defaultValue: string;
  onChange?: (v: string) => void;
  extraOptions?: any;
  editorHeight?: string;
  defaultLanguage?: string;
}

const CodeEditor: React.FC<IProps> = (props) => {
  const { defaultValue, onChange, extraOptions, editorHeight, defaultLanguage } = props;
  loader.config({ monaco });

  const editorRef = useRef<any>(null);

  function handleEditorChange(value) {
    onChange && onChange(value);
  }

  // 保存 editor 实例
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // defaultValue 变化时，手动 setValue
  useEffect(() => {
    if (editorRef.current && typeof defaultValue === 'string') {
      // 只有内容不同时才 setValue，避免光标跳动
      if (editorRef.current.getValue() !== defaultValue) {
        editorRef.current.setValue(defaultValue);
      }
    }
  }, [defaultValue]);

  return (
    <div className="editor-container">
      <Editor
        height={editorHeight || '370px'}
        defaultLanguage={defaultLanguage || 'yaml'}
        defaultValue={defaultValue}
        options={{
          minimap: {
            enabled: false,
          },
          ...extraOptions,
        }}
        onMount={handleEditorDidMount}
        onChange={(val) => {
          handleEditorChange(val);
        }}
      />
    </div>
  );
};

export default CodeEditor;
