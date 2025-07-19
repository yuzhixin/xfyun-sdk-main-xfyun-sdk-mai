// 配置选项
export interface XfyunASROptions {
  appId: string;
  apiKey: string;
  apiSecret: string;
  resId: string;
  language?: 'zh_cn' | 'en_us'; // 语言
  domain?: 'slm'; // 领域
  accent?: 'mandarin' | 'cantonese'; // 方言
  vadEos?: number; // 静默检测，单位 ms，默认 3000ms
  autoStart?: boolean; // 自动开始，默认 false
}

// 状态
export type RecognizerState = 'idle' | 'connecting' | 'connected' | 'recording' | 'stopped' | 'error';

// 错误码
export interface XfyunError {
  code: number;
  message: string;
  data?: any;
}

// 事件处理器
export interface ASREventHandlers {
  onStart?: () => void;
  onStop?: () => void;
  onRecognitionResult?: (text: string, isEnd: boolean) => void;
  onProcess?: (volume: number) => void;
  onError?: (error: XfyunError) => void;
  onStateChange?: (state: RecognizerState) => void;
}

// WebSocket 消息模型
export interface XfyunWebsocketRequest {
  header: {
    app_id: string;
    res_id: string;
    status: number;
  };
  parameter?: {
    iat: {
      domain: string,
      language: string,
      accent: string,
      eos: number,
      vinfo: number,
      dwa: string,
      result: {
        encoding: string,
        compress: string,
        format: string
      }
    }
  },
  payload: {
    audio: {
      encoding: string,
      sample_rate: number,
      channels: number,
      bit_depth: number,
      status: number,
      audio: string
    }
  }
}

export interface XfyunWebsocketResponse {
  header: {
    code: number,
    message: string,
    sid: string,
    status: number
  },
  payload?: {
    result: {
      compress: string,
      encoding: string,
      format: string,
      status: number,
      text: string
    }
  }
} 