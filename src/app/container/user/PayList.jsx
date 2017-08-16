import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {loadPayList} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {RefreshControl,ListView,ActivityIndicator} from 'antd-mobile';
import {Header,Footer} from '../../common/ComponentList';
import Util from '../../common/Util';
/*
* 付费历史页面
* */
var type="list";
var loadFlag=true;
var totalPages = 1,pageIndex=-1;
class Main extends Component {
    constructor(props){
        super(props)
        /* 获取数据类型 */
        this.state = {
            homeActive:"active",
            serActive:"",
            isLoading: true,
            refreshing: false,
        }

        this.onEndReached = () =>{//滑动加载
            this.dataInit();
        }

        /*
         * 接收数据
         * */
        let {dispatch} = this.props;
        this.dataInit=()=>{
            if(loadFlag){
                this.setState({ isLoading: true });
                loadFlag = false;
                setTimeout(() => {
                    /* 初次加载第一次获取数据 */
                    var pageNum = ++pageIndex;//页数
                    if(totalPages <= pageNum){
                        this.setState({ isLoading: false });
                        return;
                    }
                    var url="/api/user/payList/"+pageNum;
                    Tool.fetchGet(url,"",{},'json','basic',
                        (res) => {
                            if(res.result){
                                var dataList = res.result.list;
                                totalPages = res.result.countPage;
                                dispatch(loadPayList(type,dataList,pageNum));
                            }else{
                                console.log("数据加载失败");
                            }
                            this.setState({
                                isLoading: false,
                            })
                            loadFlag = true;
                        }, (err) => {
                            loadFlag = true;
                            console.log(err);
                        });
                },1000);
            }
        }
    }

    componentWillMount(){
        if(Util.isLogin(this.props)){
            let {PayList} = this.props;
            if(PayList[type].page){
                return;
            }
            this.dataInit();//初始加载
        }
    }

    render() {
        const row = (rowData, sectionID, rowID) => {
            var infos = "";
            if(rowData.type==0){
                infos="推送问题";
            }else if(rowData.type==1){
                infos="电话联系专家";
            }else{
                infos="推送需求联系专家";
            }
            return (
                <div key={rowID} className="list_info">
                    <h1>支付金额<span>{Tool.formatDateTime(rowData.last_time)}</span></h1>
                    <h2>￥{rowData.price/100}</h2>
                    <div className="lis">
                        <span>支付流水号：</span>{rowData.pid}
                    </div>
                    <div className="lis">
                        <span>支付方式：</span>微信支付
                    </div>
                    <div className="lis">
                        <span>商品详情：</span>
                        {infos}
                    </div>
                    <div className="lis">
                        <span>支付结果：</span>{rowData.status==1?"支付成功":"支付失败"}
                    </div>
                </div>
            )
        };
        let {PayList} = this.props;
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = PayList[type].date;
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        return (
            <div className="pay_cons bg_color">
                <Header title="付费历史" leftInfo="back"/>
                <div className="page pay_lists bg_color">
                    <div className="scroll_list scroll_list_pad">
                        <ListView
                            dataSource={dataSource.cloneWithRows(data)}
                            renderFooter={() => <div className={this.state.refreshing + " footerRender"} style={{ textAlign: 'center'}}>
                                {this.state.isLoading ? loadInfo : '加载完成，暂无更多数据'}
                            </div>}
                            renderRow={row}
                            style={{
                                height: document.documentElement.clientHeight,
                                overflow: 'hidden',
                                margin: '0',padding:"1.17rem 0 1.42rem 0"
                            }}
                            initialListSize={dataSource.length-8}
                            pageSize={10}
                            scrollRenderAheadDistance={500}
                            scrollEventThrottle={20}
                            scrollerOptions={{ scrollbars: true }}
                            onScroll={()=>{}}
                            useZscroller
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={20}
                        />
                    </div>

                </div>
                <Footer className="normal_footer"/>
            </div>
        )
    }
    componentDidMount(){

    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User,
    PayList:state.PayList
}))(Main);

