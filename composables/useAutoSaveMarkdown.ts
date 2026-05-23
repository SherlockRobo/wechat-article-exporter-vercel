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

export const AUTO_SAVE_MARKDOWN_DIRNAME = 'clipping/公众号/${account}/${title}';
export const AUTO_SAVE_MARKDOWN_PREVIEW = 'clipping/公众号/人民日报/这是一篇示例文章标题.md';

export default () => {
  const toast = toastFactory();
  const preferences: Ref<Preferences> = usePreferences() as unknown as Ref<Preferences>;

  const enabled = computed(() => preferences.value.exportConfig.autoSaveMarkdownAfterFetch);
  const directoryName = computed(() => preferences.value.exportConfig.autoSaveDirectoryName);
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
    toast.success('保存位置已设置', `抓取后会自动保存到 ${handle.name}/${AUTO_SAVE_MARKDOWN_PREVIEW}`);
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
      dirnameTemplate: AUTO_SAVE_MARKDOWN_DIRNAME,
    });
    await exporter.startExport('markdown');
  }

  return {
    enabled,
    directoryName,
    supported,
    selectDirectory,
    clearDirectory,
    exportMarkdown,
  };
};
