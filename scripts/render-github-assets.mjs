import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const root = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(root, '../assets/readme');
mkdirSync(outputDir, { recursive: true });

const mascotPath = resolve(outputDir, 'mascot-dog-backpack.png');
if (!existsSync(mascotPath)) {
  throw new Error(`Missing mascot asset: ${mascotPath}`);
}

const mascotUrl = `data:image/png;base64,${readFileSync(mascotPath).toString('base64')}`;

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const baseStyles = `
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    width: var(--w);
    height: var(--h);
    background: #f7f8f8;
    color: #0b0d0f;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  }
  body { display: grid; place-items: center; }
  .canvas {
    position: relative;
    width: var(--w);
    height: var(--h);
    overflow: hidden;
    background:
      radial-gradient(circle at 78% 34%, rgba(246,196,0,.22), transparent 25%),
      linear-gradient(180deg, #ffffff 0%, #f7f8f8 100%);
  }
  .canvas:before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,0,0,.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,.035) 1px, transparent 1px);
    background-size: 34px 34px;
    opacity: .8;
  }
  .content { position: relative; z-index: 2; height: 100%; }
  .pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    padding: 0 15px;
    border-radius: 999px;
    background: #f6c400;
    color: #111;
    font-size: 18px;
    line-height: 1;
    font-weight: 950;
  }
  .muted { color: #687076; }
  .green { color: #0f7f4f; }
  .card {
    background: rgba(255,255,255,.94);
    border: 1px solid rgba(0,0,0,.08);
    box-shadow: 0 18px 38px rgba(0,0,0,.08);
  }
  .terminal {
    background: #111316;
    color: #f6f7f8;
    border-radius: 16px;
    box-shadow: 0 24px 48px rgba(0,0,0,.18);
    overflow: hidden;
  }
  .terminal-head {
    height: 38px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 16px;
    background: #202327;
  }
  .dot { width: 11px; height: 11px; border-radius: 50%; background: #f75f58; }
  .dot:nth-child(2) { background: #f6c400; }
  .dot:nth-child(3) { background: #21c55d; }
  pre {
    margin: 0;
    padding: 14px 24px 10px;
    font: 700 18px/1.34 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    white-space: pre-wrap;
  }
`;

const page = ({ width, height, body }) => `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<style>
:root { --w: ${width}px; --h: ${height}px; }
${baseStyles}
</style>
</head>
<body>${body}</body>
</html>`;

const hero = page({
  width: 1280,
  height: 640,
  body: `
  <main class="canvas">
    <section class="content hero">
      <style>
        .hero { padding: 64px 70px; }
        .hero h1 {
          width: 700px;
          margin: 34px 0 0;
          font-size: 72px;
          line-height: 1.04;
          letter-spacing: 0;
          font-weight: 950;
        }
        .hero p {
          width: 650px;
          margin: 24px 0 0;
          font-size: 28px;
          line-height: 1.38;
          font-weight: 800;
          color: #555b61;
        }
        .hero .badges {
          display: flex;
          gap: 12px;
          margin-top: 34px;
        }
        .hero .badge {
          padding: 12px 15px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid rgba(0,0,0,.08);
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
          font-size: 18px;
          font-weight: 900;
        }
        .hero .mascot-ring {
          position: absolute;
          right: 94px;
          top: 88px;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid rgba(246,196,0,.42);
          box-shadow: 0 0 54px rgba(246,196,0,.32), 0 28px 58px rgba(0,0,0,.12);
        }
        .hero img {
          position: absolute;
          right: 64px;
          top: 56px;
          width: 440px;
          height: 440px;
          object-fit: contain;
        }
        .hero .callout {
          position: absolute;
          right: 112px;
          bottom: 78px;
          padding: 16px 22px;
          border-radius: 999px;
          background: #f6c400;
          box-shadow: 0 18px 36px rgba(246,196,0,.22);
          font-size: 25px;
          font-weight: 950;
          transform: rotate(-4deg);
        }
      </style>
      <span class="pill">Sherlocksheperd 1.0</span>
      <h1>公众号内容，<br><span class="green">批量背回</span>本地库</h1>
      <p>同步文章列表、抓取正文和留言，自动保存 Markdown，让好内容变成可搜索、可喂给 AI 的资料库。</p>
      <div class="badges">
        <span class="badge">开源自部署</span>
        <span class="badge">本地优先</span>
        <span class="badge">Markdown / HTML / Excel</span>
      </div>
      <div class="mascot-ring"></div>
      <img src="${mascotUrl}" alt="">
      <div class="callout">一次收一堆</div>
    </section>
  </main>`,
});

const steps = [
  ['01', '安装 Node.js', '需要 Node.js 22 或更高版本'],
  ['02', '克隆仓库', 'git clone SherlockRobo/wechat-article-exporter-vercel'],
  ['03', '安装依赖', 'yarn install'],
  ['04', '启动服务', 'yarn dev，然后打开 localhost:3000'],
];

const install = page({
  width: 1280,
  height: 720,
  body: `
  <main class="canvas">
    <section class="content install">
      <style>
        .install { padding: 48px 64px; }
        .install h2 {
          margin: 18px 0 8px;
          font-size: 48px;
          line-height: 1.08;
          letter-spacing: 0;
          font-weight: 950;
        }
        .install .lead {
          margin: 0;
          width: 640px;
          color: #5f666d;
          font-size: 22px;
          line-height: 1.35;
          font-weight: 800;
        }
        .step-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-top: 28px;
        }
        .step {
          min-height: 172px;
          padding: 18px 18px;
          border-radius: 18px;
        }
        .num {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #111316;
          color: #fff;
          font-size: 18px;
          font-weight: 950;
        }
        .step b {
          display: block;
          margin-top: 14px;
          font-size: 23px;
          line-height: 1.08;
          font-weight: 950;
        }
        .step span {
          display: block;
          margin-top: 8px;
          color: #5f666d;
          font-size: 16px;
          line-height: 1.32;
          font-weight: 750;
        }
        .terminal {
          position: absolute;
          left: 64px;
          right: 64px;
          bottom: 44px;
          height: 132px;
        }
        .mascot-small {
          position: absolute;
          right: 88px;
          top: 38px;
          width: 180px;
          height: 180px;
          object-fit: contain;
        }
      </style>
      <span class="pill">Install in 4 steps</span>
      <h2>四步启动，<br>先在本地跑起来</h2>
      <p class="lead">适合先发给 beta 用户：照着图装 Node、拉仓库、装依赖、启动服务。</p>
      <img class="mascot-small" src="${mascotUrl}" alt="">
      <div class="step-grid">
        ${steps
          .map(
            ([num, title, copy]) => `<div class="step card"><div class="num">${num}</div><b>${escapeHtml(title)}</b><span>${escapeHtml(copy)}</span></div>`,
          )
          .join('')}
      </div>
      <div class="terminal">
        <div class="terminal-head"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div>
        <pre>git clone https://github.com/SherlockRobo/wechat-article-exporter-vercel.git
cd wechat-article-exporter-vercel
yarn install && yarn dev</pre>
      </div>
    </section>
  </main>`,
});

const workflowItems = [
  ['扫码登录', '用自己的公众号后台权限登录'],
  ['同步列表', '把目标公众号文章列表拉到本地浏览器'],
  ['批量抓取', '正文、留言、阅读量、元数据一起整理'],
  ['保存本地', '自动写入 Markdown，也可导出多格式'],
];

const workflow = page({
  width: 1280,
  height: 720,
  body: `
  <main class="canvas">
    <section class="content workflow">
      <style>
        .workflow { padding: 58px 64px; }
        .workflow h2 {
          margin: 24px 0 0;
          font-size: 56px;
          line-height: 1.08;
          letter-spacing: 0;
          font-weight: 950;
        }
        .lane {
          position: absolute;
          left: 80px;
          right: 80px;
          top: 274px;
          height: 220px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .flow-card {
          position: relative;
          min-height: 214px;
          padding: 24px 22px;
          border-radius: 18px;
        }
        .flow-card:after {
          content: "→";
          position: absolute;
          right: -22px;
          top: 76px;
          color: #f6c400;
          font-size: 46px;
          font-weight: 950;
          z-index: 2;
        }
        .flow-card:last-child:after { content: ""; }
        .flow-icon {
          width: 62px;
          height: 62px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: #111316;
          color: #fff;
          font-size: 23px;
          font-weight: 950;
        }
        .flow-card:nth-child(2) .flow-icon,
        .flow-card:nth-child(4) .flow-icon { background: #0f7f4f; }
        .flow-card b {
          display: block;
          margin-top: 18px;
          font-size: 28px;
          line-height: 1.08;
          font-weight: 950;
        }
        .flow-card span {
          display: block;
          margin-top: 10px;
          color: #5f666d;
          font-size: 18px;
          line-height: 1.36;
          font-weight: 750;
        }
        .bottom {
          position: absolute;
          left: 64px;
          right: 64px;
          bottom: 56px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        .mini {
          min-height: 78px;
          padding: 18px 20px;
          border-radius: 16px;
          font-size: 20px;
          line-height: 1.2;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .mini i {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #f6c400;
          color: #111;
          font-style: normal;
          font-size: 15px;
        }
        .mascot {
          position: absolute;
          right: 94px;
          top: 46px;
          width: 172px;
          height: 172px;
          object-fit: contain;
        }
      </style>
      <span class="pill">Usage flow</span>
      <h2>从公众号到本地库，<br>一条线走完</h2>
      <img class="mascot" src="${mascotUrl}" alt="">
      <div class="lane">
        ${workflowItems
          .map(
            ([title, copy], index) => `<div class="flow-card card"><div class="flow-icon">${String(index + 1).padStart(2, '0')}</div><b>${escapeHtml(title)}</b><span>${escapeHtml(copy)}</span></div>`,
          )
          .join('')}
      </div>
      <div class="bottom">
        <div class="mini card"><i>MD</i>Markdown / Obsidian</div>
        <div class="mini card"><i>HTML</i>HTML / PDF / DOCX</div>
        <div class="mini card"><i>XLS</i>Excel / JSON / TXT</div>
      </div>
    </section>
  </main>`,
});

const brochure = page({
  width: 1200,
  height: 900,
  body: `
  <main class="canvas">
    <section class="content brochure">
      <style>
        .brochure { padding: 66px 70px; }
        .brochure h2 {
          margin: 28px 0 0;
          width: 650px;
          font-size: 66px;
          line-height: 1.06;
          letter-spacing: 0;
          font-weight: 950;
        }
        .brochure .copy {
          margin-top: 24px;
          width: 612px;
          color: #555b61;
          font-size: 26px;
          line-height: 1.42;
          font-weight: 800;
        }
        .brochure .feature-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          width: 650px;
          margin-top: 40px;
        }
        .feature {
          min-height: 88px;
          padding: 18px 20px;
          border-radius: 16px;
          font-size: 21px;
          line-height: 1.18;
          font-weight: 950;
        }
        .feature span {
          display: block;
          margin-top: 6px;
          color: #687076;
          font-size: 15px;
          line-height: 1.3;
          font-weight: 750;
        }
        .dog-wrap {
          position: absolute;
          right: 82px;
          top: 174px;
          width: 342px;
          height: 342px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid rgba(246,196,0,.42);
          box-shadow: 0 0 56px rgba(246,196,0,.30), 0 30px 60px rgba(0,0,0,.12);
        }
        .dog-wrap img {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 390px;
          height: 390px;
          transform: translate(-50%, -50%);
          object-fit: contain;
        }
        .tag {
          position: absolute;
          right: 112px;
          top: 124px;
          transform: rotate(-5deg);
          padding: 16px 22px;
          border-radius: 999px;
          background: #f6c400;
          font-size: 24px;
          font-weight: 950;
          box-shadow: 0 18px 34px rgba(246,196,0,.2);
        }
        .footer {
          position: absolute;
          left: 70px;
          right: 70px;
          bottom: 56px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 28px;
          border-top: 2px solid rgba(0,0,0,.09);
          color: #5f666d;
          font-size: 22px;
          font-weight: 850;
        }
      </style>
      <span class="pill">Product brochure</span>
      <h2>Sherlocksheperd<br><span class="green">公众号资料牧羊犬</span></h2>
      <p class="copy">把值得反复看的公众号内容，从平台收藏夹赶回自己的本地知识库。</p>
      <div class="feature-list">
        <div class="feature card">批量同步文章<span>公众号列表和文章列表</span></div>
        <div class="feature card">自动保存 Markdown<span>适配 Obsidian / Logseq</span></div>
        <div class="feature card">保留元数据<span>正文、留言、阅读量、链接</span></div>
        <div class="feature card">多格式导出<span>HTML / Excel / JSON / PDF</span></div>
      </div>
      <div class="tag">一次收一堆</div>
      <div class="dog-wrap"><img src="${mascotUrl}" alt=""></div>
      <div class="footer"><b>Open source / Self-hosted / Local-first</b><span>v1.0 beta</span></div>
    </section>
  </main>`,
});

const render = async () => {
  const chromeCandidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ];
  const executablePath = chromeCandidates.find((candidate) => existsSync(candidate));
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath,
    args: ['--no-sandbox'],
  });
  const items = [
    ['sherlockshepherd-hero.png', hero, 1280, 640],
    ['sherlockshepherd-install.png', install, 1280, 720],
    ['sherlockshepherd-workflow.png', workflow, 1280, 720],
    ['sherlockshepherd-brochure.png', brochure, 1200, 900],
  ];

  try {
    for (const [file, html, width, height] of items) {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(0);
      await page.setViewport({ width, height, deviceScaleFactor: 2 });
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts?.ready);
      await new Promise((resolve) => setTimeout(resolve, 250));
      await page.screenshot({ path: resolve(outputDir, file), type: 'png' });
      await page.close();
    }
  } finally {
    await browser.close();
  }
};

await render();
