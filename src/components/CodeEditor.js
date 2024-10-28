import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';

// Import necessary Ace editor modules
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/python';

const CodeEditor = ({ initialCode, onCodeChange }) => {
  console.log('CodeEditor rendering with initialCode:', initialCode);

  const [code, setCode] = useState(initialCode);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    setCode(initialCode);
    setIsEdited(false);
  }, [initialCode]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setIsEdited(newCode !== initialCode);
    onCodeChange(newCode, newCode !== initialCode);
  };

  return (
    <AceEditor
      mode="python"
      theme="monokai"
      onChange={handleCodeChange}
      value={code}
      name="code-editor"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
      style={{ width: '100%', height: '600px' }}
      fontSize={16}
    />
  );
};

export default CodeEditor;
