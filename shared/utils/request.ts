/**
 * 封装 $fetch 无重试请求
 */
export const request = $fetch.create({
  retry: 0,
  method: 'GET',
  async onRequest({ request, options }) {
    if (!import.meta.client || typeof request !== 'string' || !request.startsWith('/api/')) {
      return;
    }

    const login = window.localStorage.getItem('login');
    if (!login) {
      return;
    }

    try {
      const { mpSession } = JSON.parse(login);
      if (!mpSession) {
        return;
      }

      const headers = new Headers(options.headers);
      headers.set('X-Mp-Session', mpSession);
      options.headers = headers;
    } catch {}
  },
  async onResponse({ request, response, options, error }) {
    // 需要注意的是，这里有可能是客户端和服务器端调用
  },
  async onResponseError({ request, response, options, error }) {},
});
