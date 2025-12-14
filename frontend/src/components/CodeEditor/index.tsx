import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as monaco from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';

export interface IProps {
  defaultValue: string;
  onChange?: (v: string) => void;
  extraOptions?: any;
  editorHeight?: string;
  defaultLanguage?: string;
  autoHeight?: boolean;
}

export interface CodeEditorRef {
  pushContent: (content: string) => void;
}

const CodeEditor = forwardRef((props: IProps, ref) => {
  const { defaultValue, onChange, extraOptions, editorHeight, defaultLanguage, autoHeight } = props;
  loader.config({ monaco });

  const editorRef = useRef<any>(null);
  const [height, setHeight] = React.useState(autoHeight ? '0px' : (editorHeight || '370px'));

  function handleEditorChange(value) {
    onChange && onChange(value);
  }

  // 保存 editor 实例
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    if (autoHeight) {
      editor.onDidContentSizeChange(() => {
        setHeight(`${editor.getContentHeight()}px`);
      });
      // Initialize height
      setHeight(`${editor.getContentHeight()}px`);
    }
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

  useImperativeHandle(ref, () => {
    return {
      pushContent: (content: string) => {
        const editor = editorRef.current;
        if (!editor) {
          console.warn("Editor instance is not available.");
          return;
        }
        console.log("Pushing content to editor:", content);
        editor.executeEdits('', [{
          range: editor.getModel().getFullModelRange(),
          text: content,
        }]);
      },
    };
  });

  return (
    <div className="editor-container">
      <Editor
        height={autoHeight ? height : (editorHeight || '370px')}
        defaultLanguage={defaultLanguage || 'yaml'}
        defaultValue={defaultValue}
        options={{
          minimap: {
            enabled: false,
          },
          scrollBeyondLastLine: !autoHeight,
          ...extraOptions,
        }}
        onMount={handleEditorDidMount}
        onChange={(val) => {
          handleEditorChange(val);
        }}
      />
    </div>
  );
});

export default CodeEditor;
