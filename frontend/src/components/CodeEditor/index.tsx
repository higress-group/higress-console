/**
 * 代码编辑器组件
 * 基于 Monaco Editor 的代码编辑器，支持多种编程语言
 * 提供语法高亮、代码补全、内容变更监听等功能
 * 支持通过 ref 外部调用方法，如插入内容等
 */

// 导入 React Hook 和组件相关功能
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// 导入 Monaco Editor 核心库
import * as monaco from 'monaco-editor';

// 导入 Monaco Editor React 组件
import Editor, { loader } from '@monaco-editor/react';

/**
 * 代码编辑器组件属性接口
 */
export interface IProps {
  defaultValue: string;           // 编辑器默认内容
  onChange?: (v: string) => void; // 内容变更回调函数
  extraOptions?: any;             // 额外的编辑器配置选项
  editorHeight?: string;          // 编辑器高度
  defaultLanguage?: string;       // 默认编程语言
}

/**
 * 代码编辑器 ref 接口
 * 定义了通过 ref 暴露给父组件的方法
 */
export interface CodeEditorRef {
  pushContent: (content: string) => void; // 向编辑器插入内容的方法
}

/**
 * 代码编辑器组件
 * 使用 forwardRef 转发 ref，支持父组件调用内部方法
 */
const CodeEditor = forwardRef((props: IProps, ref) => {
  // 解构组件属性
  const { defaultValue, onChange, extraOptions, editorHeight, defaultLanguage } = props;
  
  // 配置 Monaco Editor 加载器
  loader.config({ monaco });

  // 编辑器实例引用
  const editorRef = useRef<any>(null);

  /**
   * 处理编辑器内容变更事件
   * 当编辑器内容发生变化时触发
   * 
   * @param value - 编辑器当前内容
   */
  function handleEditorChange(value) {
    onChange && onChange(value); // 如果提供了 onChange 回调，则调用它
  }

  /**
   * 编辑器挂载完成回调
   * 保存编辑器实例供后续使用
   * 
   * @param editor - 编辑器实例
   */
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor; // 保存编辑器实例到 ref 中
  };

  /**
   * 监听 defaultValue 变化
   * 当外部传入的默认值发生变化时，更新编辑器内容
   * 避免光标跳动：只有内容不同时才更新
   */
  useEffect(() => {
    if (editorRef.current && typeof defaultValue === 'string') {
      // 只有内容不同时才 setValue，避免光标跳动
      if (editorRef.current.getValue() !== defaultValue) {
        editorRef.current.setValue(defaultValue);
      }
    }
  }, [defaultValue]);

  /**
   * 使用 useImperativeHandle 暴露方法给父组件
   * 允许父组件通过 ref 调用编辑器的方法
   */
  useImperativeHandle(ref, () => {
    return {
      /**
       * 向编辑器插入内容的方法
       * 替换编辑器中的全部内容
       * 
       * @param content - 要插入的内容
       */
      pushContent: (content: string) => {
        const editor = editorRef.current;
        if (!editor) {
          console.warn("Editor instance is not available.");
          return;
        }
        console.log("Pushing content to editor:", content);
        
        // 执行编辑操作，替换全部内容
        editor.executeEdits('', [{
          range: editor.getModel().getFullModelRange(), // 获取整个文档范围
          text: content, // 新内容
        }]);
      },
    };
  });

  return (
    <div className="editor-container">
      <Editor
        height={editorHeight || '370px'} // 编辑器高度，默认 370px
        defaultLanguage={defaultLanguage || 'yaml'} // 默认语言，支持 YAML、JSON、JavaScript 等
        defaultValue={defaultValue} // 默认内容
        options={{
          minimap: {
            enabled: false, // 禁用迷你地图，节省空间
          },
          ...extraOptions, // 合并额外的配置选项
        }}
        onMount={handleEditorDidMount} // 编辑器挂载完成回调
        onChange={(val) => {
          handleEditorChange(val); // 内容变更回调
        }}
      />
    </div>
  );
});

export default CodeEditor;
