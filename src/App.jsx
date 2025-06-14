import React, { useState, useEffect } from 'react';
import HanziWriterComponent from './components/HanziWriter';
import InputPanel from './components/InputPanel';
import HanziWriter from 'hanzi-writer';

function App() {
  const [characters, setCharacters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unsupportedChars, setUnsupportedChars] = useState([]);
  const [isHanziWriterReady, setIsHanziWriterReady] = useState(false);
  const [writers, setWriters] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 检查 HanziWriter 数据是否可用
    const checkDataAvailability = async () => {
      try {
        // 测试获取一个常用汉字的数据
        await HanziWriter.loadCharacterData('我');
        setIsHanziWriterReady(true);
        console.log('HanziWriter data is available');
      } catch (error) {
        console.error('HanziWriter data not available:', error);
        setIsHanziWriterReady(false);
      }
    };

    checkDataAvailability();
  }, []);

  const handleInputSubmit = async (lines) => {
    if (!isHanziWriterReady) {
      console.error('HanziWriter data not loaded yet');
      return;
    }

    // 处理每行文本，提取汉字
    const lineChars = lines.map(line => ({
      text: line,
      chars: line.split('').filter(char => /[\u4e00-\u9fa5]/.test(char))
    }));
    
    // 检测并收集未收录汉字
    const unsupported = [];
    for (const line of lineChars) {
      for (const char of line.chars) {
        try {
          await HanziWriter.loadCharacterData(char);
        } catch (e) {
          if (!unsupported.includes(char)) {
            unsupported.push(char);
          }
        }
      }
    }
    console.log('Unsupported characters:', unsupported.length > 0 ? unsupported : '无');
    setUnsupportedChars(unsupported);
    
    // 创建支持的行数据，过滤掉未收录汉字
    const supportedLines = lineChars.map(line => ({
      ...line,
      chars: line.chars.filter(char => !unsupported.includes(char))
    })).filter(line => line.chars.length > 0);
    
    console.log('Supported lines:', supportedLines);
    setCharacters(supportedLines);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    let nextIndex = (currentIndex + 1) % characters.length;
    setCurrentIndex(nextIndex);
  };

  const handlePrev = () => {
    let prevIndex = (currentIndex - 1 + characters.length) % characters.length;
    setCurrentIndex(prevIndex);
  };

  return (
    <div className="app-container">
      <h1>中文错别字复习</h1>
      <InputPanel onSubmit={handleInputSubmit} />
      
      {unsupportedChars.length > 0 ? (
        <div className="warning">
          <p>以下汉字暂不支持动画演示：{unsupportedChars.join(' ')}</p>
        </div>
      ) : null}
      
      <div className="controls">
      </div>

      <div className="lines-container">
        {characters.map((line, lineIndex) => (
          <div className="line-section" key={lineIndex} style={{ padding: '5px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>行 {lineIndex + 1}:</h3>
              <div className="line-controls">
                <button className="control-btn" onClick={() => {
                  const writersInLine = writers[lineIndex] || [];
                  writersInLine.forEach(writer => {
                    if (writer && typeof writer.animateCharacter === 'function') {
                      writer.animateCharacter();
                    }
                  });
                }}>播放</button>
                <button className="control-btn" onClick={() => {
                  const writersInLine = writers[lineIndex] || [];
                  writersInLine.forEach(writer => {
                    if (writer && typeof writer.pauseAnimation === 'function') {
                      writer.pauseAnimation();
                    }
                  });
                }}>暂停</button>
              </div>
            </div>
            <div className="characters-container" style={{ marginTop: '5px' }}>
              {line.chars.map((char, charIndex) => (
                <HanziWriterComponent
                  key={`${lineIndex}-${charIndex}`}
                  character={char}
                  onWriterCreated={(writer) => {
                    setWriters(prevWriters => {
                      const newWriters = [...prevWriters];
                      newWriters[lineIndex] = newWriters[lineIndex] || [];
                      newWriters[lineIndex][charIndex] = writer;
                      return newWriters;
                    });
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {characters.length === 0 && unsupportedChars.length === 0 && (
        <p>请输入要复习的汉字（每行一个汉字或词语）</p>
      )}
    </div>
  );
}

export default App;