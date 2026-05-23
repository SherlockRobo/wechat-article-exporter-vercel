<template>
  <div class="support-page flex h-full flex-col">
    <Teleport defer to="#title">
      <h1 class="text-[28px] leading-[34px] font-bold">开始使用</h1>
    </Teleport>

    <div class="flex-1 overflow-auto px-5 py-6 lg:px-8">
      <section class="ticket-hero">
        <div>
          <p class="ticket-kicker">Wechat Article Exporter · Open 1.0</p>
          <h2>把公众号文章下载成 Markdown，放进自己的长期知识库。</h2>
          <p class="ticket-copy">
          这是一个可自部署的微信公众号文章导出工具，适合把自己有权访问的文章列表、正文和元数据导出为
          Markdown、HTML、JSON、Excel、TXT、DOCX 或 PDF。先在下面选保存策略，再去同步和抓取。
          </p>
        </div>
        <div class="ticket-stamp" aria-hidden="true">
          <span>VAULT</span>
          <strong>1.0</strong>
        </div>
      </section>

      <section class="strategy-panel">
        <div class="strategy-head">
          <div>
            <p class="ticket-kicker">Step 1 · 保存与导出</p>
            <h3>先把文件怎么落地选好。</h3>
          </div>
          <NuxtLink to="/dashboard/article" class="strategy-link">
            去抓文章
            <span class="i-lucide:arrow-right" />
          </NuxtLink>
        </div>

        <div class="strategy-layout">
          <div class="strategy-checklist">
            <label class="strategy-check is-locked">
              <UCheckbox :model-value="true" disabled name="localCache" />
              <span>
                <strong>保留浏览器本地缓存</strong>
                <em>文章列表和正文先存在当前浏览器，用来预览、去重和继续处理。</em>
              </span>
            </label>

            <label class="strategy-check">
              <UCheckbox
                v-model="preferences.exportConfig.autoSaveMarkdownAfterFetch"
                name="autoSaveMarkdownAfterFetchEntry"
              />
              <span>
                <strong>抓取成功后自动生成 Markdown</strong>
                <em>勾选后，正文抓取完成会自动写入你选择的目录。</em>
              </span>
            </label>

            <label class="strategy-check">
              <UCheckbox
                v-model="directorySelected"
                name="directorySelectedEntry"
              />
              <span>
                <strong>保存到本地 / Obsidian Vault</strong>
                <em>{{ autoSaveDirectoryName ? `当前目录：${autoSaveDirectoryName}` : '点击后选择一个本地文件夹或 Vault 根目录。' }}</em>
              </span>
            </label>

            <label class="strategy-check">
              <UCheckbox
                v-model="preferences.exportConfig.showManualExportActions"
                name="showManualExportActionsEntry"
              />
              <span>
                <strong>保留手动导出按钮</strong>
                <em>需要 Excel、HTML、PDF、JSON 等格式时保留；只想自动归档 Markdown 可以取消。</em>
              </span>
            </label>
          </div>

          <div class="strategy-path">
            <div class="path-actions">
              <UButton
                color="green"
                icon="i-lucide:folder-open"
                :disabled="!autoSaveSupported"
                @click="selectDirectory"
              >
                选择目录
              </UButton>
              <UButton
                v-if="autoSaveDirectoryName"
                color="white"
                icon="i-lucide:x"
                @click="clearDirectory"
              >
                清除
              </UButton>
            </div>

            <label class="path-field">
              <span>Markdown 存放路径</span>
              <USelectMenu
                v-model="selectedPathPreset"
                :options="AUTO_SAVE_PATH_PRESETS"
                value-attribute="value"
                option-attribute="label"
              />
            </label>

            <label class="path-field">
              <span>自定义模板</span>
              <UInput
                v-model="preferences.exportConfig.autoSaveMarkdownDirname"
                class="font-mono"
                placeholder="clipping/公众号/${account}/${title}"
              />
            </label>

            <div class="path-preview">
              <span>文件预览</span>
              <code>{{ autoSaveLocationPreview }}</code>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-grid">
        <div class="travel-card">
          <div class="i-lucide:database card-icon" />
          <h3>数据在浏览器本地</h3>
          <p>
            文章列表、正文缓存和导出配置保存在当前浏览器的 IndexedDB / LocalStorage。Vercel 只负责页面和代理，不保存你的文章库。
          </p>
        </div>
        <div class="travel-card">
          <div class="i-lucide:folder-down card-icon" />
          <h3>抓取后自动进 Vault</h3>
          <p>
            在上方选择 Vault 或普通文件夹，勾选自动保存。抓取正文成功后，Markdown 会按你的路径模板写入。
          </p>
        </div>
        <div class="travel-card">
          <div class="i-lucide:history card-icon" />
          <h3>保留本地处理记录</h3>
          <p>
            文章页会显示最近抓取时间、是否已导出、最近导出时间和导出格式，方便判断哪些文章已经归档。
          </p>
        </div>
        <div class="travel-card">
          <div class="i-lucide:shield-check card-icon" />
          <h3>只做合规导出</h3>
          <p>
            不提供付费文章破解，也不使用账号池。工具只能抓取当前登录账号正常可访问的公开内容或已获授权内容。
          </p>
        </div>
      </section>

      <section class="workflow-grid">
        <div class="route-panel">
          <h3>
            <span class="i-lucide:list-checks" />
            推荐流程
          </h3>
          <ol>
            <li>1. 在本页“保存与导出”选择本地文件夹或 Obsidian Vault 根目录，并勾选自动保存 Markdown。</li>
            <li>2. 在“公众号管理”添加目标公众号，并同步文章列表。</li>
            <li>3. 在“文章下载”选择文章，点击“抓取”下载正文内容。</li>
            <li>4. 抓取成功后，文件自动出现在 <code>clipping/公众号/{account}/{title}.md</code>。</li>
            <li>5. 不用 Obsidian 的用户也可以选择普通文件夹，用 VS Code、Typora、Notion 或飞书打开。</li>
          </ol>
        </div>

        <div class="support-panel">
          <h3>
            <span class="i-lucide:heart-handshake" />
            关注与支持
          </h3>
          <p>
            如果这个版本帮到你，可以关注公众号获取更新，或者用微信打赏支持维护。
          </p>
          <div class="qr-grid">
            <div class="qr-ticket">
              <img :src="officialAccountQr" alt="公众号二维码" />
              <strong>关注公众号</strong>
              <span>扫码获取项目更新和使用说明。</span>
            </div>
            <div class="qr-ticket">
              <img :src="donateQr" alt="微信打赏二维码" class="donate-qr" />
              <strong>微信打赏</strong>
              <span>感谢你的支持，哪怕只是一个 Star。</span>
            </div>
          </div>
        </div>
      </section>

      <section class="boundary-note">
        <h3>边界说明</h3>
        <p>
          这个项目面向个人备份和合规归档场景。通过工具获取的文章版权归原作者或权利方所有，请勿用于未授权转载、售卖、批量分发或规避平台付费限制。
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import donateQr from '~/assets/qrcode-donate.jpg';
import officialAccountQr from '~/assets/qrcode-official-account.jpg';
import useAutoSaveMarkdown, { AUTO_SAVE_PATH_PRESETS } from '~/composables/useAutoSaveMarkdown';
import { websiteName } from '~/config';
import type { Preferences } from '~/types/preferences';

const preferences: Ref<Preferences> = usePreferences() as unknown as Ref<Preferences>;
const {
  directoryName: autoSaveDirectoryName,
  pathPreview: autoSavePathPreview,
  supported: autoSaveSupported,
  selectDirectory,
  clearDirectory,
} = useAutoSaveMarkdown();

const autoSaveLocationPreview = computed(() => {
  const root = autoSaveDirectoryName.value || '你选择的目录';
  return `${root}/${autoSavePathPreview.value}`;
});

const directorySelected = computed({
  get() {
    return Boolean(autoSaveDirectoryName.value);
  },
  set(value: boolean) {
    if (value) {
      void selectDirectory();
    } else {
      void clearDirectory();
    }
  },
});

const selectedPathPreset = computed({
  get() {
    const current = preferences.value.exportConfig.autoSaveMarkdownDirname;
    return AUTO_SAVE_PATH_PRESETS.some(item => item.value === current) ? current : 'custom';
  },
  set(value: string) {
    if (value !== 'custom') {
      preferences.value.exportConfig.autoSaveMarkdownDirname = value;
    }
  },
});

useHead({
  title: `开始使用 | ${websiteName}`,
});
</script>

<style scoped>
.support-page {
  background:
    radial-gradient(circle at 12% 10%, rgba(0, 107, 69, 0.08), transparent 28%),
    linear-gradient(180deg, rgba(255, 253, 247, 0.88), rgba(242, 240, 231, 0.84));
  color: var(--cathay-ink);
}

.ticket-hero,
.travel-card,
.route-panel,
.support-panel,
.boundary-note {
  max-width: 1180px;
}

.ticket-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 24px;
  overflow: hidden;
  border: 1px solid var(--cathay-line);
  border-radius: 8px;
  background:
    linear-gradient(90deg, transparent 0, transparent calc(100% - 18px), rgba(0, 107, 69, 0.12) calc(100% - 18px)),
    var(--cathay-card);
  box-shadow: var(--cathay-shadow);
  padding: 30px 32px;
}

.ticket-hero::before,
.ticket-hero::after {
  position: absolute;
  top: 50%;
  width: 28px;
  height: 28px;
  border: 1px solid var(--cathay-line);
  border-radius: 999px;
  background: var(--cathay-paper);
  content: "";
}

.ticket-hero::before {
  left: -14px;
}

.ticket-hero::after {
  right: -14px;
}

.ticket-kicker {
  color: var(--cathay-green);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.ticket-hero h2 {
  max-width: 760px;
  margin-top: 10px;
  color: var(--cathay-green-dark);
  font-size: 34px;
  font-weight: 900;
  line-height: 1.18;
}

.ticket-copy {
  max-width: 840px;
  margin-top: 16px;
  color: var(--cathay-muted);
  font-size: 16px;
  line-height: 1.8;
}

.ticket-stamp {
  align-self: stretch;
  display: grid;
  place-items: center;
  border-left: 1px dashed rgba(0, 107, 69, 0.32);
  color: var(--cathay-green);
  text-align: center;
}

.ticket-stamp span,
.ticket-stamp strong {
  display: block;
}

.ticket-stamp span {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.22em;
}

.ticket-stamp strong {
  margin-top: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 42px;
  line-height: 1;
}

.strategy-panel {
  max-width: 1180px;
  margin-top: 18px;
  border: 1px solid rgba(0, 107, 69, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(0, 107, 69, 0.09), transparent 45%),
    rgba(255, 253, 247, 0.94);
  box-shadow: var(--cathay-shadow);
  padding: 24px;
}

.strategy-head,
.strategy-layout,
.path-actions {
  display: flex;
  gap: 16px;
}

.strategy-head {
  align-items: flex-start;
  justify-content: space-between;
}

.strategy-head h3 {
  margin-top: 6px;
  color: var(--cathay-green-dark);
  font-size: 26px;
  font-weight: 900;
  line-height: 1.2;
}

.strategy-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(0, 107, 69, 0.24);
  border-radius: 6px;
  background: rgba(0, 107, 69, 0.08);
  color: var(--cathay-green-dark);
  padding: 9px 12px;
  font-size: 14px;
  font-weight: 800;
}

.strategy-layout {
  align-items: stretch;
  margin-top: 18px;
}

.strategy-checklist,
.strategy-path {
  border: 1px solid var(--cathay-line);
  border-radius: 8px;
  background: rgba(255, 253, 247, 0.86);
}

.strategy-checklist {
  flex: 1.04;
  padding: 10px;
}

.strategy-check {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  border-radius: 7px;
  padding: 12px;
}

.strategy-check + .strategy-check {
  border-top: 1px solid rgba(0, 107, 69, 0.12);
}

.strategy-check.is-locked {
  background: rgba(0, 107, 69, 0.05);
}

.strategy-check strong,
.path-field span,
.path-preview span {
  display: block;
  color: var(--cathay-ink);
  font-size: 14px;
  font-weight: 850;
}

.strategy-check em {
  display: block;
  margin-top: 4px;
  color: var(--cathay-muted);
  font-size: 13px;
  font-style: normal;
  line-height: 1.55;
}

.strategy-path {
  flex: 0.96;
  display: grid;
  align-content: start;
  gap: 14px;
  padding: 18px;
}

.path-actions {
  flex-wrap: wrap;
}

.path-field {
  display: grid;
  gap: 7px;
}

.path-preview {
  display: grid;
  gap: 7px;
  border-top: 1px dashed rgba(0, 107, 69, 0.24);
  padding-top: 14px;
}

.path-preview code {
  overflow-wrap: anywhere;
}

.feature-grid {
  display: grid;
  max-width: 1180px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.travel-card,
.route-panel,
.support-panel,
.boundary-note {
  border: 1px solid var(--cathay-line);
  border-radius: 8px;
  background: rgba(255, 253, 247, 0.86);
  box-shadow: 0 12px 30px rgba(52, 43, 30, 0.06);
}

.travel-card {
  position: relative;
  min-height: 170px;
  padding: 22px 24px 24px;
}

.travel-card::after,
.route-panel::after,
.support-panel::after,
.boundary-note::after {
  display: block;
  height: 5px;
  margin-top: 20px;
  border-top: 2px solid var(--cathay-green);
  border-bottom: 2px solid var(--cathay-green);
  content: "";
}

.card-icon {
  margin-bottom: 14px;
  color: var(--cathay-green);
  font-size: 28px;
}

.travel-card h3,
.route-panel h3,
.support-panel h3,
.boundary-note h3 {
  color: var(--cathay-ink);
  font-size: 18px;
  font-weight: 850;
}

.travel-card p,
.support-panel p,
.boundary-note p,
.route-panel li {
  color: var(--cathay-muted);
  font-size: 14px;
  line-height: 1.75;
}

.travel-card p,
.support-panel p,
.boundary-note p {
  margin-top: 10px;
}

code {
  border: 1px solid rgba(0, 107, 69, 0.15);
  border-radius: 5px;
  background: rgba(0, 107, 69, 0.07);
  color: var(--cathay-green-dark);
  padding: 1px 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.92em;
}

.workflow-grid {
  display: grid;
  max-width: 1180px;
  grid-template-columns: 1.12fr 0.88fr;
  gap: 18px;
  margin-top: 18px;
}

.route-panel,
.support-panel,
.boundary-note {
  padding: 24px;
}

.route-panel h3,
.support-panel h3 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.route-panel h3 span,
.support-panel h3 span {
  color: var(--cathay-green);
  font-size: 22px;
}

.route-panel ol {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.support-panel {
  border-color: rgba(0, 107, 69, 0.28);
  background:
    linear-gradient(135deg, rgba(0, 107, 69, 0.08), transparent 42%),
    rgba(255, 253, 247, 0.92);
}

.qr-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.qr-ticket {
  border: 1px dashed rgba(0, 107, 69, 0.35);
  border-radius: 8px;
  background: #fffdf7;
  padding: 12px;
  text-align: center;
}

.qr-ticket img {
  display: block;
  width: 100%;
  max-width: 190px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  border-radius: 6px;
  object-fit: contain;
}

.qr-ticket img.donate-qr {
  aspect-ratio: 0.72;
}

.qr-ticket strong {
  display: block;
  margin-top: 12px;
  color: var(--cathay-green-dark);
  font-size: 14px;
}

.qr-ticket span {
  display: block;
  margin-top: 4px;
  color: var(--cathay-weak);
  font-size: 12px;
  line-height: 1.55;
}

.boundary-note {
  margin-top: 18px;
}

@media (max-width: 1024px) {
  .ticket-hero,
  .workflow-grid,
  .strategy-layout {
    grid-template-columns: 1fr;
  }

  .strategy-layout,
  .strategy-head {
    flex-direction: column;
  }

  .ticket-stamp {
    min-height: 96px;
    border-top: 1px dashed rgba(0, 107, 69, 0.32);
    border-left: 0;
  }

  .feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .ticket-hero {
    padding: 24px 20px;
  }

  .ticket-hero h2 {
    font-size: 27px;
  }

  .qr-grid {
    grid-template-columns: 1fr;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
