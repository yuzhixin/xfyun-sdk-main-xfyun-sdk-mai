import React, { useState, useEffect, useRef } from 'react';
import { XfyunASR } from '../recognizer';
import { XfyunASROptions, RecognizerState } from '../types';
import { Button } from 'antd';
import {
  AudioOutlined,
} from '@ant-design/icons';

// 组件的属性类型
export interface SpeechRecognizerProps {
  appId: string;
  apiKey: string;
  apiSecret: string;
  resId: string;
  language?: 'zh_cn' | 'en_us';
  domain?: 'slm';
  accent?: 'mandarin' | 'cantonese';
  autoStart?: boolean;
  onStart?: () => void;
  onStop?: () => void;
  onResult?: (text: string, isEnd: boolean) => void;
  onError?: (error: any) => void;
  className?: string;
  buttonClassName?: string;
  buttonStartText?: string;
  buttonStopText?: string;
  showVolume?: boolean;
  showStatus?: boolean;
}


// 语音识别组件
const SpeechRecognizer: React.FC<SpeechRecognizerProps> = ({
  appId,
  apiKey,
  apiSecret,
  language = 'zh_cn',
  resId = '',
  domain = 'slm',
  accent = 'mandarin',
  autoStart = false,
  onStart,
  onStop,
  onResult,
  onError,
}) => {
  const [recognitionText, setRecognitionText] = useState<string>('');
  const [state, setState] = useState<RecognizerState>('idle');
  const [volume, setVolume] = useState<number>(0);

  const recognizerRef = useRef<XfyunASR | null>(null);

  // 初始化语音识别实例
  useEffect(() => {
    // 检查必填参数
    if (!appId || !apiKey || !apiSecret) {
      console.error('缺少必要参数: appId, apiKey, apiSecret');
      return;
    }

    const options: XfyunASROptions = {
      appId,
      apiKey,
      apiSecret,
      language: language as 'zh_cn' | 'en_us',
      domain: domain as 'slm',
      accent: accent as 'mandarin' | 'cantonese',
      autoStart,
      resId,
    };

    // 创建讯飞语音识别实例
    recognizerRef.current = new XfyunASR(options, {
      onStart: () => {
        onStart && onStart();
      },
      onStop: () => {
        onStop && onStop();
      },
      onRecognitionResult: (text, isEnd) => {
        setRecognitionText(prev => prev + text);
        onResult && onResult(text, isEnd);
      },
      onProcess: (volumeValue) => {
        setVolume(volumeValue);
      },
      onError: (error) => {
        onError && onError(error);
      },
      onStateChange: (newState) => {
        setState(newState);
      }
    });

    // 组件卸载时清理资源
    return () => {
      if (recognizerRef.current && state === 'recording') {
        recognizerRef.current.stop();
      }
    };
  }, [appId, apiKey, apiSecret]); // 只在关键参数变化时重新创建实例

  // 开始录音
  const startRecognition = () => {
    if (recognizerRef.current) {
      setRecognitionText('');
      recognizerRef.current.start();
    }
  };

  // 停止录音
  const stopRecognition = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }
  };

  // 处理按钮点击事件
  const handleButtonClick = () => {
    if (state === 'recording') {
      stopRecognition();
    } else {
      startRecognition();
    }
  };


  return (
    <Button
      disabled={state === 'connecting' || state === 'error'}
      type="primary"
      shape="circle"
      size="large"
      icon={
        state === 'recording' ? (
          <img
            src="/images/video.gif"
            width={24}
            height={24}
            alt="recording"
            style={{ verticalAlign: 'middle' }}
          />
        ) : (
          <AudioOutlined />
        )
      }
      onChange={() => { }}
      onClick={handleButtonClick}
    />
  );
};

export default SpeechRecognizer; 