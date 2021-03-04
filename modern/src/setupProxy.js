const proxy = require('http-proxy-middleware');

module.exports = function (app) {
   // console.log(process.env);
    process.env.REACT_APP_URL_NAME= 'localhost:8082';
    
    app.use(proxy('/api/socket', { target: 'ws://' +process.env.REACT_APP_URL_NAME , ws: true, changeOrigin: true }));
    app.use(proxy('/api', { target: 'http://' + process.env.REACT_APP_URL_NAME ,changeOrigin: true}));
};
