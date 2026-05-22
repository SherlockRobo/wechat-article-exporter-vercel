<template>
  <div class="flex flex-col h-full bg-slate-50 text-slate-900">
    <Teleport defer to="#title">
      <h1 class="text-[28px] leading-[34px] font-bold text-slate-950">说明与打赏</h1>
    </Teleport>

    <div class="px-6 py-6 flex-1 overflow-auto">
      <section class="max-w-6xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-semibold text-blue-600">Wechat Article Exporter · Open 1.0</p>
        <h2 class="mt-2 max-w-3xl text-3xl font-bold leading-tight text-slate-950">
          把公众号文章导出为可长期保存的文件。
        </h2>
        <p class="mt-4 max-w-4xl text-base leading-7 text-slate-700">
          这是一个可自部署的微信公众号文章导出工具，适合把自己有权访问的文章列表、正文和元数据导出为
          Markdown、HTML、JSON、Excel、TXT、DOCX 或 PDF，便于归档、检索和二次整理。
        </p>
      </section>

      <section class="mt-5 grid max-w-6xl grid-cols-1 gap-4 xl:grid-cols-3">
        <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div class="i-lucide:database mb-3 text-2xl text-blue-600" />
          <h3 class="text-lg font-semibold text-slate-950">数据在浏览器本地</h3>
          <p class="mt-2 text-sm leading-6 text-slate-700">
            文章列表、正文缓存和导出配置保存在当前浏览器的 IndexedDB / LocalStorage。Vercel 只负责页面和代理，不保存你的文章库。
          </p>
        </div>
        <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div class="i-lucide:folder-down mb-3 text-2xl text-emerald-600" />
          <h3 class="text-lg font-semibold text-slate-950">适合知识库归档</h3>
          <p class="mt-2 text-sm leading-6 text-slate-700">
            推荐导出目录为 <code class="rounded bg-slate-100 px-1 py-0.5">公众号/{account}/{title}</code>，
            同一个公众号的文章会自然聚在一起。
          </p>
        </div>
        <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div class="i-lucide:shield-check mb-3 text-2xl text-amber-600" />
          <h3 class="text-lg font-semibold text-slate-950">只做合规导出</h3>
          <p class="mt-2 text-sm leading-6 text-slate-700">
            不提供付费文章破解，也不使用账号池。工具只能抓取当前登录账号正常可访问的公开内容或已获授权内容。
          </p>
        </div>
      </section>

      <section class="mt-5 grid max-w-6xl grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 class="flex items-center gap-2 text-lg font-semibold text-slate-950">
            <span class="i-lucide:list-checks text-xl text-blue-600" />
            推荐流程
          </h3>
          <ol class="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <li>1. 在“公众号管理”添加目标公众号，并同步文章列表。</li>
            <li>2. 在“文章下载”选择文章，先点击“抓取”下载正文内容。</li>
            <li>3. 在“设置”确认导出目录规则，例如 <code class="rounded bg-slate-100 px-1 py-0.5">公众号/{account}/{title}</code>。</li>
            <li>4. 导出 Markdown 或其他格式，再放入 Obsidian、Logseq、Notion 或自己的文件库。</li>
          </ol>
        </div>

        <div class="rounded-lg border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <h3 class="flex items-center gap-2 text-lg font-semibold text-slate-950">
            <span class="i-lucide:heart-handshake text-xl text-blue-600" />
            支持项目
          </h3>
          <p class="mt-3 text-sm leading-6 text-slate-700">
            如果这个版本帮到你，可以给 GitHub 项目点 Star、提交 Issue，或者在自己的 fork 里替换收款码后开放给团队使用。
          </p>
          <div class="mt-4 rounded-lg border border-dashed border-blue-300 bg-white p-4 text-center text-sm text-slate-600">
            <div class="i-lucide:qr-code mx-auto mb-2 text-3xl text-blue-600" />
            打赏二维码位
            <p class="mt-2 text-xs leading-5">
              将自己的收款码放到 <code class="rounded bg-slate-100 px-1 py-0.5">assets/wechat-support.png</code> 后，可按需改成图片展示。
            </p>
          </div>
        </div>
      </section>

      <section class="mt-5 max-w-6xl rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm">
        <h3 class="text-lg font-semibold text-slate-950">边界说明</h3>
        <p class="mt-3">
          这个项目面向个人备份和合规归档场景。通过工具获取的文章版权归原作者或权利方所有，请勿用于未授权转载、售卖、批量分发或规避平台付费限制。
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { websiteName } from '~/config';

useHead({
  title: `说明与打赏 | ${websiteName}`,
});
</script>
