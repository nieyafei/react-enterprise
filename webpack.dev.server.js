var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

// 相当于通过本地node服务代理请求到了http://cnodejs.org/api
//http://60.205.142.21:8088/home?name=zhangsan3
/*var proxy = [{
 path: '/api/!*',
 target: 'https://cnodejs.org',
 host: 'cnodejs.org'
 }];*/
var proxy = [{
    path: '/api',
    target: 'http://localhost:8080',
    host: 'localhost',
    changeOrigin:true
}];
//启动服务
var server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    proxy: proxy,
    stats: {
        colors: true,
        historyApiFallback: true,
        hot:true
    },
});

//将其他路由，全部返回index.html
server.app.get('*', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});
server.app.post('*', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

server.listen(80);
