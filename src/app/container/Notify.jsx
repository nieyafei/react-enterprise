import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {Header,Footer,NotifyList} from '../common/ComponentList';
import {RefreshControl,ListView,ActivityIndicator,Tabs} from 'antd-mobile';
import {Tool} from '../Tool';
import Util from '../common/Util';
const TabPane = Tabs.TabPane;
/*
 * 消息页面
 * */
class Main extends Component {
    constructor(props){
        super(props);
        this.state={
            isLoading:true,activeKey:Tool.getSession("keyNotify")?Tool.getSession("keyNotify"):"1"
        }
        this.onChangeBack=(key)=>{
            Tool.setSession("keyNotify",key);
        }
        this.makeTabPane=(key)=> {
            if (key == 1) {
                return (
                    <TabPane tab={`个人消息`} key={key}>
                        <div className="tab_cons_li no_top">
                            <NotifyList type="1" tabName="personal"/>
                        </div>
                    </TabPane>
                )

            } else if (key == 2) {
                return (
                    <TabPane tab={`系统消息`} key={key}>
                        <div className="tab_cons_li">
                            <NotifyList type="2" tabName="list"/>
                        </div>
                    </TabPane>
                )
            }
        }
    }

    componentWillMount(){
        if(Util.isLogin(this.props)){
            Util.bodyOver(true);
        }
    }

    render() {

        return (
            <div className="notify_cons">
                <Header title="消息" rightTo="/question" rightInfo="" rightIcon="icon-tiwen"/>
                <div className="page page_normal info_tabs_list bg_color">
                    <Tabs defaultActiveKey={this.state.activeKey} onChange={this.onChangeBack} pageSize={2} className="tabs_notify" animated={false}>
                        {this.makeTabPane(1)}
                        {this.makeTabPane(2)}
                    </Tabs>
                </div>
                <Footer notifyActive="active"/>
            </div>
        )
    }
}

export default connect((state) => ({
    Notify:state.Notify,
    User: state.User
}))(Main);