//获取数据 /原生xhr对象来获取数据
//axios 也是基于xhr 来封装的
//fetch servoceWorker 太原生了
//fetch 是基于promise的
// let async = require('async')
let ul = document.getElementById('container');
(async () => {
    let request = new Request('/index/list',
        {
            method: 'get',
        })
    let r = await fetch(request);
    let data = await r.json();
    // console.log("data", data);
    ul.innerHTML = data.map(item => {
        return `<li><img src="${item}" alt=""/></li>`
    }).join('');
})()