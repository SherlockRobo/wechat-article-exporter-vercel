<template>
  <div class="activity-page flex h-full flex-col">
    <Teleport defer to="#title">
      <h1 class="text-[28px] leading-[34px] font-bold">抓取记录</h1>
    </Teleport>

    <div class="activity-shell">
      <section class="activity-toolbar">
        <div>
          <p class="kicker">Local History</p>
          <h2>本地处理记录</h2>
          <p>这里记录当前浏览器里的正文抓取、阅读量抓取、留言抓取、自动保存和手动导出。</p>
        </div>
        <div class="toolbar-actions">
          <UButton color="white" icon="i-lucide:refresh-cw" @click="loadActivities">刷新</UButton>
          <UButton color="red" variant="soft" icon="i-lucide:trash-2" :disabled="records.length === 0" @click="clearRecords">
            清空记录
          </UButton>
        </div>
      </section>

      <section class="filter-row">
        <UInput v-model="keyword" icon="i-lucide:search" placeholder="搜索公众号、标题、链接或失败原因" />
        <USelectMenu v-model="typeFilter" :options="typeOptions" value-attribute="value" option-attribute="label" />
        <USelectMenu v-model="statusFilter" :options="statusOptions" value-attribute="value" option-attribute="label" />
      </section>

      <section class="stats-row">
        <div class="stat-card">
          <span>全部记录</span>
          <strong>{{ records.length }}</strong>
        </div>
        <div class="stat-card success">
          <span>成功</span>
          <strong>{{ successCount }}</strong>
        </div>
        <div class="stat-card failed">
          <span>失败 / 删除</span>
          <strong>{{ failedCount }}</strong>
        </div>
        <div class="stat-card">
          <span>自动/手动导出</span>
          <strong>{{ exportCount }}</strong>
        </div>
      </section>

      <section class="record-panel">
        <div v-if="loading" class="empty-state">正在读取本地记录...</div>
        <div v-else-if="filteredRecords.length === 0" class="empty-state">暂无匹配记录</div>
        <div v-else class="record-table-wrap">
          <table class="record-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>公众号</th>
                <th>文章</th>
                <th>动作</th>
                <th>状态</th>
                <th>格式</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in filteredRecords" :key="record.id">
                <td class="time-cell">{{ formatActivityTime(record.createdAt) }}</td>
                <td>{{ accountName(record.fakeid) }}</td>
                <td>
                  <a :href="record.url" target="_blank" rel="noopener noreferrer" class="article-link">
                    {{ record.title || record.url }}
                  </a>
                </td>
                <td>{{ articleActivityLabel(record.type) }}</td>
                <td>
                  <span class="status-pill" :class="record.status">
                    {{ statusLabel(record.status) }}
                  </span>
                </td>
                <td>{{ record.format || '-' }}</td>
                <td class="message-cell">{{ record.message || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTimeStamp } from '#shared/utils/helpers';
import { websiteName } from '~/config';
import {
  articleActivityLabel,
  clearArticleActivities,
  getArticleActivities,
  type ArticleActivity,
  type ArticleActivityStatus,
  type ArticleActivityType,
} from '~/store/v2/activity';
import { getAllInfo } from '~/store/v2/info';

useHead({
  title: `抓取记录 | ${websiteName}`,
});

type ActivityFilterValue = 'all' | ArticleActivityType;
type StatusFilterValue = 'all' | ArticleActivityStatus;

const loading = ref(true);
const records = ref<ArticleActivity[]>([]);
const accountMap = ref(new Map<string, string>());
const keyword = ref('');
const typeFilter = ref<ActivityFilterValue>('all');
const statusFilter = ref<StatusFilterValue>('all');

const typeOptions = [
  { label: '全部动作', value: 'all' },
  { label: '正文抓取', value: 'fetch_content' },
  { label: '阅读量抓取', value: 'fetch_metadata' },
  { label: '留言抓取', value: 'fetch_comment' },
  { label: '导出/保存', value: 'export' },
];

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '成功', value: 'success' },
  { label: '失败', value: 'failed' },
  { label: '已删除', value: 'deleted' },
];

const filteredRecords = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  return records.value.filter(record => {
    if (typeFilter.value !== 'all' && record.type !== typeFilter.value) return false;
    if (statusFilter.value !== 'all' && record.status !== statusFilter.value) return false;
    if (!q) return true;
    const haystack = [
      accountName(record.fakeid),
      record.title,
      record.url,
      record.message,
      record.format,
      articleActivityLabel(record.type),
      statusLabel(record.status),
    ].join(' ').toLowerCase();
    return haystack.includes(q);
  });
});

const successCount = computed(() => records.value.filter(record => record.status === 'success').length);
const failedCount = computed(() => records.value.filter(record => record.status !== 'success').length);
const exportCount = computed(() => records.value.filter(record => record.type === 'export').length);

function formatActivityTime(timestamp: number) {
  return formatTimeStamp(Math.floor(timestamp / 1000));
}

function accountName(fakeid: string) {
  return accountMap.value.get(fakeid) || fakeid || '-';
}

function statusLabel(status: ArticleActivityStatus) {
  switch (status) {
    case 'success':
      return '成功';
    case 'failed':
      return '失败';
    case 'deleted':
      return '已删除';
  }
}

async function loadActivities() {
  loading.value = true;
  const [activities, accounts] = await Promise.all([getArticleActivities(), getAllInfo()]);
  records.value = activities;
  accountMap.value = new Map(accounts.map(account => [account.fakeid, account.nickname || account.fakeid]));
  loading.value = false;
}

async function clearRecords() {
  if (!confirm('确认清空当前浏览器里的抓取记录？文章缓存不会被删除。')) return;
  await clearArticleActivities();
  await loadActivities();
}

onMounted(() => {
  void loadActivities();
});
</script>

<style scoped>
.activity-page {
  background:
    radial-gradient(circle at 10% 0%, rgba(0, 107, 69, 0.08), transparent 30%),
    linear-gradient(180deg, rgba(255, 253, 247, 0.9), rgba(242, 240, 231, 0.86));
  color: var(--cathay-ink);
}

.activity-shell {
  flex: 1;
  overflow: auto;
  padding: 22px 28px 28px;
}

.activity-toolbar,
.filter-row,
.stats-row,
.record-panel {
  max-width: 1280px;
}

.activity-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  border: 1px solid var(--cathay-line);
  border-radius: 8px;
  background: rgba(255, 253, 247, 0.92);
  box-shadow: var(--cathay-shadow);
  padding: 22px 24px;
}

.kicker {
  color: var(--cathay-green);
  font-size: 13px;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.activity-toolbar h2 {
  margin-top: 6px;
  color: var(--cathay-green-dark);
  font-size: 28px;
  font-weight: 900;
}

.activity-toolbar p:last-child {
  margin-top: 8px;
  color: var(--cathay-muted);
  font-size: 14px;
}

.toolbar-actions,
.filter-row,
.stats-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.filter-row {
  margin-top: 16px;
  display: grid;
  grid-template-columns: minmax(280px, 1fr) 180px 160px;
}

.stats-row {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.stat-card {
  border: 1px solid var(--cathay-line);
  border-radius: 8px;
  background: rgba(255, 253, 247, 0.9);
  padding: 16px 18px;
}

.stat-card span {
  color: var(--cathay-muted);
  font-size: 13px;
}

.stat-card strong {
  display: block;
  margin-top: 5px;
  color: var(--cathay-green-dark);
  font-size: 26px;
  font-weight: 900;
}

.stat-card.success strong {
  color: #167a4b;
}

.stat-card.failed strong {
  color: #b54708;
}

.record-panel {
  margin-top: 16px;
  overflow: hidden;
  border: 1px solid var(--cathay-line);
  border-radius: 8px;
  background: rgba(255, 253, 247, 0.92);
  box-shadow: var(--cathay-shadow);
}

.record-table-wrap {
  overflow: auto;
}

.record-table {
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
}

.record-table th,
.record-table td {
  border-bottom: 1px solid rgba(0, 107, 69, 0.12);
  padding: 12px 14px;
  text-align: left;
  vertical-align: top;
  font-size: 13px;
}

.record-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f7f1e3;
  color: var(--cathay-green-dark);
  font-weight: 850;
}

.time-cell {
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.article-link {
  color: var(--cathay-green-dark);
  font-weight: 700;
}

.article-link:hover {
  text-decoration: underline;
}

.status-pill {
  display: inline-flex;
  border-radius: 999px;
  padding: 3px 9px;
  font-size: 12px;
  font-weight: 800;
}

.status-pill.success {
  background: rgba(22, 122, 75, 0.12);
  color: #167a4b;
}

.status-pill.failed {
  background: rgba(181, 71, 8, 0.12);
  color: #b54708;
}

.status-pill.deleted {
  background: rgba(129, 36, 48, 0.12);
  color: #812430;
}

.message-cell {
  max-width: 320px;
  color: var(--cathay-muted);
}

.empty-state {
  padding: 42px;
  color: var(--cathay-muted);
  text-align: center;
}

@media (max-width: 900px) {
  .activity-toolbar {
    flex-direction: column;
  }

  .filter-row,
  .stats-row {
    grid-template-columns: 1fr;
  }
}
</style>
