import React from 'react';
import * as monaco from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';

export interface IProps {
  defaultValue: string;
  onChange: (v: string) => void;
  extraOptions?: any;
  editorHeight?: string;
  defaultLanguage?: string;
}

const CodeEditor: React.FC = (props: IProps) => {
  const { defaultValue, onChange, extraOptions, editorHeight, defaultLanguage } = props;
  loader.config({ monaco });

  function handleEditorChange(value) {
    onChange && onChange(value);
  }

  const handleEditorWillMount = (editor) => {};

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
        beforeMount={handleEditorWillMount}
        onChange={(val) => {
          handleEditorChange(val);
        }}
      />
    </div>
  );
};

export default CodeEditor;
