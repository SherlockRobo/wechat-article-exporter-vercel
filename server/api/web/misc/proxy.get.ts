import { USER_AGENT } from '~/config';

const ALLOWED_HOSTS = [
  'mp.weixin.qq.com',
  'res.wx.qq.com',
  'mmbiz.qpic.cn',
  'mmbiz.qlogo.cn',
  'wx.qlogo.cn',
  'thirdwx.qlogo.cn',
];

const ALLOWED_SUFFIXES = ['.qq.com', '.qpic.cn', '.qlogo.cn', '.gtimg.cn', '.myqcloud.com'];

function isAllowedHost(hostname: string) {
  return ALLOWED_HOSTS.includes(hostname) || ALLOWED_SUFFIXES.some(suffix => hostname.endsWith(suffix));
}

function parseForwardHeaders(value: unknown): Record<string, string> {
  if (typeof value !== 'string' || !value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    const headers: Record<string, string> = {};
    if (typeof parsed.cookie === 'string') {
      headers.cookie = parsed.cookie;
    }
    return headers;
  } catch {
    return {};
  }
}

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const rawUrl = typeof query.url === 'string' ? decodeURIComponent(query.url.trim()) : '';

  if (!rawUrl) {
    return new Response('url不能为空', { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl.replace(/^http:\/\//, 'https://'));
  } catch {
    return new Response('url不合法', { status: 400 });
  }

  if (!['https:', 'http:'].includes(targetUrl.protocol) || !isAllowedHost(targetUrl.hostname)) {
    return new Response('目标域名不允许代理', { status: 403 });
  }

  const forwardHeaders = parseForwardHeaders(query.headers);
  const headers: Record<string, string> = {
    Accept: '*/*',
    Referer: 'https://mp.weixin.qq.com/',
    Origin: 'https://mp.weixin.qq.com',
    'User-Agent': USER_AGENT,
  };

  if (forwardHeaders.cookie && targetUrl.hostname.endsWith('weixin.qq.com')) {
    headers.cookie = forwardHeaders.cookie;
  }

  const response = await fetch(targetUrl, {
    headers,
    redirect: 'follow',
  });

  const responseHeaders = new Headers();
  const contentType = response.headers.get('content-type');
  if (contentType) {
    responseHeaders.set('content-type', contentType);
  }
  responseHeaders.set('cache-control', 'no-store');

  return new Response(await response.arrayBuffer(), {
    status: response.status,
    headers: responseHeaders,
  });
});
