import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { clientsClaim, setCacheNameDetails, skipWaiting } from 'workbox-core';

// Workbox 会在这里插入预缓存列表
precacheAndRoute(self.__WB_MANIFEST);
skipWaiting(); // 跳过install 过程
clientsClaim(); // 激活所有的窗口
