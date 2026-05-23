<script setup lang="ts">
interface NavItem {
  name: string;
  icon: string;
  href: string;
  insider?: boolean;
  tags?: string[];
}

const items = ref<NavItem[]>([
  { name: '开始使用', icon: 'i-lucide:route', href: '/dashboard/support' },
  { name: '公众号管理', icon: 'i-lucide:users', href: '/dashboard/account' },
  { name: '文章下载', icon: 'i-lucide:file-down', href: '/dashboard/article' },
  { name: '单篇文章下载', icon: 'i-lucide:file-text', href: '/dashboard/single' },
  { name: '合集下载', icon: 'i-lucide:library-big', href: '/dashboard/album' },
  { name: '公共代理', icon: 'i-lucide:globe', href: '/dashboard/proxy' },
  { name: 'API', icon: 'i-lucide:cable', href: '/dashboard/api' },
  { name: '设置', icon: 'i-lucide:settings', href: '/dashboard/settings' },
]);
</script>

<template>
  <nav class="flex-1 mt-6">
    <ul class="flex flex-col gap-2">
      <li v-for="item in items" :key="item.name">
        <NuxtLink :to="item.href" class="flex h-8 items-center gap-2 rounded-md px-2 text-sm nav-link">
          <UIcon :name="item.icon" class="size-5 opacity-80" />
          <p>{{ item.name }}</p>
          <UBadge v-if="item.tags" v-for="tag in item.tags" color="fuchsia" variant="subtle">{{ tag }}</UBadge>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav-link.router-link-active {
  color: var(--cathay-green-dark);
  background: rgba(0, 107, 69, 0.1);
  box-shadow: inset 3px 0 0 var(--cathay-green);
  font-weight: 700;
}
.nav-link:not(.router-link-active) {
  color: var(--cathay-muted);
  transition:
    background 0.16s ease,
    color 0.16s ease,
    transform 0.16s ease;
}
.nav-link:not(.router-link-active):hover {
  color: var(--cathay-green-dark);
  background: rgba(160, 132, 59, 0.11);
  transform: translateX(2px);
}
</style>
