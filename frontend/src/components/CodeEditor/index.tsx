import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as monaco from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';

export interface IProps {
  defaultValue: string;
  onChange?: (v: string) => void;
  extraOptions?: any;
  /**
   * Height of the editor.
   * NOTE: If `autoHeight` is true, this prop is ignored as the height will be determined by content.
   */
  editorHeight?: string;
  defaultLanguage?: string;
  /**
   * If true, the editor will automatically resize to fit its content.
   * This takes precedence over `editorHeight`.
   */
  autoHeight?: boolean;
}

export interface CodeEditorRef {
  pushContent: (content: string) => void;
}

const CodeEditor = forwardRef((props: IProps, ref) => {
  const { defaultValue, onChange, extraOptions, editorHeight, defaultLanguage, autoHeight } = props;
  loader.config({ monaco });

  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleEditorChange(value) {
    onChange && onChange(value);
  }

  const disposableRef = useRef<monaco.IDisposable | null>(null);

  // 保存 editor 实例
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    if (autoHeight && containerRef.current) {
      // 使用 ResizeObserver 监听编辑器内容变化，动态调整容器高度
      const updateHeight = () => {
        const contentHeight = editor.getContentHeight();
        if (containerRef.current) {
          containerRef.current.style.height = `${contentHeight}px`;
        }
      };

      // 初始化高度
      updateHeight();

      // 监听内容大小变化
      disposableRef.current = editor.onDidContentSizeChange(updateHeight);
    }
  };

  useEffect(() => {
    return () => {
      if (disposableRef.current) {
        disposableRef.current.dispose();
      }
    };
  }, []);

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

  const editorOptions = {
    minimap: {
      enabled: false,
    },
    scrollBeyondLastLine: false,
    ...(autoHeight ? {
      // 自动高度模式下的特殊配置
      scrollbar: {
        // 允许滚动事件冒泡到页面，这样当编辑器内容超出视口时可以滚动页面
        alwaysConsumeMouseWheel: false,
        vertical: 'hidden' as const,
        horizontal: 'auto' as const,
      },
      overviewRulerLanes: 0,
    } : {}),
    ...extraOptions,
  };

  return (
    <div
      ref={containerRef}
      className="editor-container"
      style={autoHeight ? {
        minHeight: '100px',
        overflow: 'visible',
      } : undefined}
    >
      <Editor
        height={autoHeight ? '100%' : (editorHeight || '370px')}
        defaultLanguage={defaultLanguage || 'yaml'}
        defaultValue={defaultValue}
        options={editorOptions}
        onMount={handleEditorDidMount}
        onChange={(val) => {
          handleEditorChange(val);
        }}
      />
    </div>
  );
});

export default CodeEditor;
