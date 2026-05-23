import { db } from './db';

export type ArticleActivityType = 'fetch_content' | 'fetch_metadata' | 'fetch_comment' | 'export';
export type ArticleActivityStatus = 'success' | 'failed' | 'deleted';
export type ArticleExportFormat = 'excel' | 'json' | 'html' | 'text' | 'markdown' | 'word' | 'pdf';

export interface ArticleActivity {
  id?: number;
  fakeid: string;
  url: string;
  title: string;
  type: ArticleActivityType;
  status: ArticleActivityStatus;
  createdAt: number;
  format?: ArticleExportFormat;
  message?: string;
}

export function articleActivityLabel(type: ArticleActivityType) {
  switch (type) {
    case 'fetch_content':
      return '正文';
    case 'fetch_metadata':
      return '阅读量';
    case 'fetch_comment':
      return '留言';
    case 'export':
      return '导出';
  }
}

export async function addArticleActivity(activity: Omit<ArticleActivity, 'id' | 'createdAt'> & { createdAt?: number }) {
  await db.article_activity.add({
    ...activity,
    createdAt: activity.createdAt ?? Date.now(),
  });
}

export async function addArticleActivities(activities: Array<Omit<ArticleActivity, 'id' | 'createdAt'> & { createdAt?: number }>) {
  if (activities.length === 0) return;
  await db.article_activity.bulkAdd(
    activities.map(activity => ({
      ...activity,
      createdAt: activity.createdAt ?? Date.now(),
    }))
  );
}

export async function getLatestArticleActivityMap(urls: string[]) {
  const latest = new Map<string, ArticleActivity>();
  if (urls.length === 0) return latest;

  const records = await db.article_activity.where('url').anyOf(urls).toArray();
  for (const record of records) {
    const key = `${record.url}:${record.type}:${record.status}`;
    const current = latest.get(key);
    if (!current || record.createdAt > current.createdAt) {
      latest.set(key, record);
    }
  }

  return latest;
}

export async function getArticleActivities(limit = 500): Promise<ArticleActivity[]> {
  return db.article_activity.orderBy('createdAt').reverse().limit(limit).toArray();
}

export async function clearArticleActivities(): Promise<void> {
  await db.article_activity.clear();
}
