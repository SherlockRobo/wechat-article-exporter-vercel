// 代理状态
export interface ProxyStatus {
  failures: number;
  lastUsed: number;
  cooldown: boolean;
  totalUse: number;
  totalSuccess: number;
  totalFailures: number;
}

// 下载选项
export interface DownloadOptions {
  concurrency?: number;

  // 导出时复用已授权的目录句柄，避免再次弹出目录选择器
  exportDirectoryHandle?: FileSystemDirectoryHandle | null;

  // 覆盖本次导出的目录模板
  dirnameTemplate?: string;

  // 资源下载超时时间
  timeout?: number;

  // 每个资源下载重试次数
  maxRetries?: number;
  cooldownPeriod?: number;
  maxFailures?: number;
}

// 下载结果
export interface DownloadResult {
  url: string;
  content: Blob;
  resources: Set<string>;
  sourceUrl?: string;
}

export type ResourceSelectors = {
  [key: string]: string;
};

export type Callback = (...args: any[]) => void;

export interface DownloaderStatus {
  pending: string[];
  completed: string[];
  failed: string[];
  deleted: string[];
  proxy: Map<string, ProxyStatus>;
}

export interface ExporterStatus {
  pending: string[];
  completed: string[];
  failed: string[];
  proxy: Map<string, ProxyStatus>;
}

export interface ArticleMetadata {
  // 阅读
  readNum: number;

  // 点赞
  oldLikeNum: number;

  // 分享
  shareNum: number;

  // 喜欢
  likeNum: number;

  // 留言
  commentNum: number;
}
