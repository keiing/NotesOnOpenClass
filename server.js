let express = require('express');//创建express服务器

//中间层

let axios = require('axios');

let serve = express();//创建一个应用

serve.use(express.static(__dirname));//静态托管

serve.get('/index/list', async (req, res) => {
    r = await axios.get('https://www.fullstackjavascript.cn/api/img')
    let result = r.data
    res.json(result);
    // console.log(result);
})
serve.listen(3000);//端口