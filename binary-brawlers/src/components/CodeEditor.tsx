import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  return (
    <div className="editor-container" style={{ display: 'flex', height: '94vh' }}>
      <Editor
        height="100%"
        width='50vw'
        language='cpp'  // Hardcoded to C++ language
        value={value}
        onChange={onChange}
        theme='vs-dark'
      />
    </div>
  );
};

export default CodeEditor;
