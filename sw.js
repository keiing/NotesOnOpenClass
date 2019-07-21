//需要缓存文件 静态文件 接口
const CACHE_NAME = 'CACHE-VERSION' + 1;
const CACHE_LIST = [
    '/index.html',
    '/index.css',
    '/index.js',
    '/index/list',
    '/'
]
//需要劫持我们的所有请求 //this等于self
async function fetchAndUpdate(request) {
    let res = await fetch(request);//响应流
    //需要拿这个响应结果 更新缓存
    let resClone = res.clone();//拷贝
    caches.open(CACHE_NAME).then(cache => cache.put(request, res));
    return resClone
}

self.addEventListener('fetch', (e) => {
    //e 就是当前请求的事件
    // console.log(e.request.url);
    //拦截用户的请求
    //先去取 如果取不到后 在拿缓存返回给你

    //请求策略 我们希望先获取数据 数据获取到了 更新缓存
    if (e.request.url.includes('/index/list')) {
        //需要更新缓存
        e.respondWith(
            fetchAndUpdate(e.request).catch(err => {
                //把匹配到的缓存的内容还给你
                return caches.match(e.request)
            })
        );
        return;
    }
})

//默认注册了一serviceWorker 需要跳过等待，否则就不会被激活

//只有第二次访问才生效，第一次不会立马控制页面

//worvice Worker 的声明周期

//pwa 可以做webapp 桌面应用

//在安卓上 隔5分钟访问同一个网站 可以自动弹出 安装框


//两个生命周期 install activate

async function preCache() {
    let cache = await caches.open(CACHE_NAME);
    return cache.addAll(CACHE_LIST);//添加缓存
}
self.addEventListener('install', e => {
    // console.log('install');
    //安装后 直接替换老的serveceWorker 就可以了
    e.waitUntil(
        preCache().then(self.skipWaiting) //跳过等待立马让当前的serviceWorker 变成激活状态
    )
});

//需要把没用的缓存删除调
//清除没用的缓存
async function clearCache() {
    //需要拿到所有的缓存
    let keys = await caches.keys();//所有的缓存
    return Promise.all(keys.filter(key => { //这是个数组要用promise.all
        if (key !== CACHE_NAME) { //不是当前需要的都删除
            return caches.delete(key);//把所有的缓存中那一个缓存删掉
        }
    }))
}
self.addEventListener('activate', e => {
    // console.log('activate')
    e.waitUntil(
        Promise.all([
            clearCache(),
            self.clients.claim() //立马让当前页面获取当前serviceWorker 获得控制权
        ])
    )
})

//serviceWorker 会监听文件的变化，文件变化后重新注册Service Workers

//推送信息 Notifaction