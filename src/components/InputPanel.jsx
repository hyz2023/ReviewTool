import React, { useState } from 'react';

const InputPanel = ({ onSubmit }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 按行分割并过滤空行
    const lines = inputText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    onSubmit(lines);
  };

  return (
    <div className="input-panel">
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="请输入错别字（每行一个汉字或词语）"
          rows={5}
          cols={30}
        />
        <button type="submit">生成复习动画</button>
      </form>
    </div>
  );
};

export default InputPanel;