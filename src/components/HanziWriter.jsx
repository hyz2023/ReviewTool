import React, { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';

const HanziWriterComponent = ({ character, onWriterCreated }) => {
  const targetRef = useRef(null);
  const writerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!targetRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    const initWriter = async () => {
      try {
        if (writerRef.current) {
          writerRef.current.hideCharacter();
          writerRef.current.hideOutline();
        }
        
        // 清空容器内容
        while (targetRef.current.firstChild) {
          targetRef.current.removeChild(targetRef.current.firstChild);
        }
        
        writerRef.current = HanziWriter.create(targetRef.current, character, {
          width: 100,
          height: 100,
          padding: 5,
          showOutline: true,
          strokeAnimationSpeed: 2,
          delayBetweenStrokes: 300,
          onLoadCharDataSuccess: () => {
            setIsLoading(false);
            if (onWriterCreated) {
              onWriterCreated(writerRef.current);
            }
          },
          onLoadCharDataError: (err) => {
            setError(`无法加载字符数据: ${character}`);
            setIsLoading(false);
          }
        });
      } catch (e) {
        setError(`初始化失败: ${e.message}`);
        setIsLoading(false);
      }
    };
    
    initWriter();
    
    return () => {
      if (writerRef.current) {
        writerRef.current.hideCharacter();
        writerRef.current.hideOutline();
      }
    };
  }, [character]);

  const handlePlay = () => {
    if (!writerRef.current) return;
    setIsPlaying(true);
    writerRef.current.animateCharacter();
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (writerRef.current) {
      writerRef.current.pauseAnimation();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (writerRef.current) {
      writerRef.current.hideCharacter();
      writerRef.current.showOutline();
    }
  };

  if (error) {
    return (
      <div className="hanzi-writer">
        <h2>{character}</h2>
        <div className="unsupported-hanzi">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="hanzi-writer">
      <div ref={targetRef}></div>
      <div className="controls">
        {!isPlaying ? (
          <button onClick={handlePlay}>播放</button>
        ) : (
          <button onClick={handlePause}>暂停</button>
        )}
        <button onClick={handleReset}>重置</button>
      </div>
    </div>
  );
};

export default HanziWriterComponent;