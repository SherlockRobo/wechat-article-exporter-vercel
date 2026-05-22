<template>
  <div class="support-page flex h-full flex-col">
    <Teleport defer to="#title">
      <h1 class="text-[28px] leading-[34px] font-bold">说明与打赏</h1>
    </Teleport>

    <div class="flex-1 overflow-auto px-5 py-6 lg:px-8">
      <section class="ticket-hero">
        <div>
          <p class="ticket-kicker">Wechat Article Exporter · Open 1.0</p>
          <h2>把公众号文章收进自己的长期知识库。</h2>
          <p class="ticket-copy">
          这是一个可自部署的微信公众号文章导出工具，适合把自己有权访问的文章列表、正文和元数据导出为
          Markdown、HTML、JSON、Excel、TXT、DOCX 或 PDF，便于归档、检索和二次整理。
          </p>
        </div>
        <div class="ticket-stamp" aria-hidden="true">
          <span>VAULT</span>
          <strong>1.0</strong>
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
          <h3>适合知识库归档</h3>
          <p>
            推荐导出目录为 <code>公众号/{account}/{title}</code>，
            同一个公众号的文章会自然聚在一起。
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
            <li>1. 在“公众号管理”添加目标公众号，并同步文章列表。</li>
            <li>2. 在“文章下载”选择文章，先点击“抓取”下载正文内容。</li>
            <li>3. 在“设置”确认导出目录规则，例如 <code>公众号/{account}/{title}</code>。</li>
            <li>4. 导出 Markdown 或其他格式，再放入 Obsidian、Logseq、Notion 或自己的文件库。</li>
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
import { websiteName } from '~/config';

useHead({
  title: `说明与打赏 | ${websiteName}`,
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

.feature-grid {
  display: grid;
  max-width: 1180px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
  .workflow-grid {
    grid-template-columns: 1fr;
  }

  .ticket-stamp {
    min-height: 96px;
    border-top: 1px dashed rgba(0, 107, 69, 0.32);
    border-left: 0;
  }

  .feature-grid {
    grid-template-columns: 1fr;
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
}
</style>
