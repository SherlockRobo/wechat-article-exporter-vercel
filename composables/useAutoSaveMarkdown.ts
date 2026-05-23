import toastFactory from '~/composables/toast';
import type { Preferences } from '~/types/preferences';
import { Exporter } from '~/utils/download/Exporter';
import {
  clearAutoSaveDirectoryHandle,
  getAutoSaveDirectoryHandle,
  isFileSystemAccessSupported,
  saveAutoSaveDirectoryHandle,
  verifyDirectoryPermission,
} from '~/utils/file-system-access';

export const DEFAULT_AUTO_SAVE_MARKDOWN_DIRNAME = 'clipping/公众号/${account}/${title}';

export const AUTO_SAVE_PATH_PRESETS = [
  { label: 'Clipping / 公众号 / 文章', value: 'clipping/公众号/${account}/${title}' },
  { label: '公众号 / 文章', value: '公众号/${account}/${title}' },
  { label: '公众号 / 年 / 月 / 文章', value: '${account}/${YYYY}/${MM}/${title}' },
  { label: '日期 / 公众号 / 文章', value: '${YYYY}/${MM}/${DD}/${account}/${title}' },
  { label: '自定义模板', value: 'custom' },
];

const sampleData: Record<string, string> = {
  account: '人民日报',
  title: '这是一篇示例文章标题',
  aid: '100000001',
  author: '张三',
  YYYY: '2026',
  MM: '05',
  DD: '23',
  HH: '09',
  mm: '30',
};

export function renderAutoSavePathPreview(template = DEFAULT_AUTO_SAVE_MARKDOWN_DIRNAME): string {
  let result = template || DEFAULT_AUTO_SAVE_MARKDOWN_DIRNAME;
  for (const [key, value] of Object.entries(sampleData)) {
    result = result.replace(new RegExp(`\\$\\{${key}}`, 'g'), value);
  }
  return `${result}.md`;
}

export default () => {
  const toast = toastFactory();
  const preferences: Ref<Preferences> = usePreferences() as unknown as Ref<Preferences>;
  if (!preferences.value.exportConfig.autoSaveMarkdownDirname) {
    preferences.value.exportConfig.autoSaveMarkdownDirname = DEFAULT_AUTO_SAVE_MARKDOWN_DIRNAME;
  }
  if (typeof preferences.value.exportConfig.showManualExportActions !== 'boolean') {
    preferences.value.exportConfig.showManualExportActions = true;
  }

  const enabled = computed(() => preferences.value.exportConfig.autoSaveMarkdownAfterFetch);
  const directoryName = computed(() => preferences.value.exportConfig.autoSaveDirectoryName);
  const dirnameTemplate = computed(() => preferences.value.exportConfig.autoSaveMarkdownDirname || DEFAULT_AUTO_SAVE_MARKDOWN_DIRNAME);
  const pathPreview = computed(() => renderAutoSavePathPreview(dirnameTemplate.value));
  const supported = computed(() => process.client && isFileSystemAccessSupported());

  async function selectDirectory() {
    if (!supported.value) {
      toast.warning('浏览器不支持', '请使用 Chrome / Edge 等支持本地目录授权的浏览器');
      return;
    }

    const handle = await (window as any).showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'downloads',
    }) as FileSystemDirectoryHandle;

    await saveAutoSaveDirectoryHandle(handle);
    preferences.value.exportConfig.autoSaveDirectoryName = handle.name;
    preferences.value.exportConfig.autoSaveMarkdownAfterFetch = true;
    toast.success('保存位置已设置', `抓取后会自动保存到 ${handle.name}/${pathPreview.value}`);
  }

  async function clearDirectory() {
    await clearAutoSaveDirectoryHandle();
    preferences.value.exportConfig.autoSaveDirectoryName = '';
    preferences.value.exportConfig.autoSaveMarkdownAfterFetch = false;
    toast.info('已清除自动保存目录');
  }

  async function exportMarkdown(urls: string[]) {
    if (!urls.length) return;

    const handle = await getAutoSaveDirectoryHandle();
    if (!handle) {
      throw new Error('还没有选择本地或 Vault 保存目录');
    }

    const hasPermission = await verifyDirectoryPermission(handle);
    if (!hasPermission) {
      throw new Error('浏览器没有该目录的写入权限，请在设置里重新选择保存目录');
    }

    const exporter = new Exporter(urls, {
      exportDirectoryHandle: handle,
      dirnameTemplate: dirnameTemplate.value,
    });
    await exporter.startExport('markdown');
  }

  return {
    enabled,
    directoryName,
    dirnameTemplate,
    pathPreview,
    supported,
    selectDirectory,
    clearDirectory,
    exportMarkdown,
  };
};
