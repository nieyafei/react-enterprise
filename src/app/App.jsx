import React, { Component, PropTypes } from 'react';
import ReactDOM, { render } from 'react-dom';
import Router from 'react-router';
import { Provider } from 'react-redux';
import route from './router/RouteMap';//路由
import store from './store/Store';//store 是应用状态 state 的管理者
import FastClick from 'fastclick';//click 点击穿透bug
import "flex.css";
import 'flex.css/dist/data-flex.css';
import '../style/app.less';
import '../iconfont/iconfont.css';
import '../js/jquery';
import '../js/jqcloud-1.0.4';
import '../js/md5';
/*
* 入口基页
* */
store.subscribe(function () {
    // console.log(store.getState());
});

window.addEventListener('load', () => {
    FastClick.attach(document.body);
});

render(
    <Provider store={store}>
        {route}
    </Provider>,
    document.getElementById('app')
)

