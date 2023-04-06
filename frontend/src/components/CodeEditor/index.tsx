import React from 'react';
import * as monaco from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';
// import { setDiagnosticsOptions } from 'monaco-yaml';

export interface IProps {
  defaultValue: string;
  onChange: (v: string) => void;
}

const CodeEditor: React.FC = (props: IProps) => {
  const { defaultValue, onChange } = props;
  loader.config({ monaco });

  function handleEditorChange(value) {
    onChange && onChange(value);
  }

  const handleEditorWillMount = (editor) => {};

  return (
    <div className="editor-container">
      <Editor
        height="370px"
        defaultLanguage="yaml"
        defaultValue={defaultValue}
        options={{
          minimap: {
            enabled: false,
          },
        }}
        beforeMount={handleEditorWillMount}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditor;
