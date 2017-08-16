import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {LoadUserExpertList,setSystemAnimating} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {RefreshControl,ListView,ActivityIndicator} from 'antd-mobile';
import {Header,Footer,PageNullComm} from '../../common/ComponentList';
import Util from '../../common/Util';
/*
 * 关注我的专家
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
            isNull:false
        }

        this.onEndReached = () =>{//滑动加载
            if (this.state.isLoading || !loadFlag) {
                return;
            }
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
                    var url=Util.getApi("userExpertList")+pageNum;
                    Tool.fetchGet(url,"",{},'json','basic',
                        (res) => {
                            if(res.result){
                                var dataList = res.result.list;
                                totalPages = res.result.countPage;
                                dispatch(LoadUserExpertList(type,dataList,pageNum));
                            }else{
                                if(pageNum==0){
                                    this.setState({
                                        isNull:true
                                    })
                                }
                            }
                            this.setState({
                                isLoading: false,
                            })
                            loadFlag = true;
                        }, (err) => {
                            loadFlag = true;
                            console.log(err);
                        });
                },150);
            }
        }

        this.toContactExpert=(contactName,contactTitle,uid)=>{
            Util.contactSession("",contactName,contactTitle,"info",uid,"","");
        }

    }

    componentWillMount(){
        if(Util.isLogin(this.props)){
            pageIndex=-1;loadFlag=true;
            this.dataInit();//初始加载
        }
    }

    render() {
        const row = (rowData, sectionID, rowID) => {

            return (
                <div key={rowID} className="row home_list_row border_bot">
                    <div className="row_question user_expert">
                        <div data-flex className="expert_infs">
                            <div className="cl1" data-flex="main:left cross:center" data-flex-box="0">
                                <Link to={"/expert/info/"+rowData.id}>
                                    <img src={Util.images(rowData.image,1)}/>
                                </Link>
                            </div>
                            <div className="cl2" data-flex="main:left cross:center" data-flex-box="1">
                                <div>{rowData.full_name}<em>{rowData.title}</em></div>
                                <Link onClick={this.toContactExpert.bind(this,rowData.full_name+(rowData.title?rowData.title:""),"",rowData.id)} to={"/contact/expert/info/"+rowData.id}>
                                    <i className="iconfont icon-phone color1"></i>
                                </Link>
                            </div>
                        </div>
                        {rowData.newMessageTitle?
                            <div className="row_quet_info over_hidden5">
                                <span className="color1">{rowData.newMessageTitle}：</span>
                                {rowData.newMessage}
                            </div>:<div className="row_quet_info over_hidden5">此专家暂无更新信息！</div>
                        }
                        <div className="row_quet_bot">
                            <span>关注{rowData.followCount}</span>
                        </div>
                    </div>
                </div>
            )
        };
        let {UserCenter} = this.props;
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = UserCenter["expertList"].date;
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        return (
            <div className="pay_cons bg_color">
                <Header title="关注我的专家列表" leftInfo="back"/>
                <div className="page pay_lists bg_color">
                    {!this.state.isNull?
                    <div className="scroll_list">
                        <ListView
                            dataSource={dataSource.cloneWithRows(data)}
                            renderFooter={() => <div className={this.state.refreshing + " footerRender"} style={{ textAlign: 'center'}}>
                                {this.state.isLoading ? loadInfo : '加载完成，暂无更多数据'}
                            </div>}
                            renderRow={row}
                            style={{
                                height: document.documentElement.clientHeight,
                                overflow: 'hidden',
                                margin: '0',padding:"1.17rem 0 0 0"
                            }}
                            initialListSize={dataSource.length-8}
                            pageSize={10}
                            scrollRenderAheadDistance={500}
                            scrollEventThrottle={20}
                            scrollerOptions={{ scrollbars: true }}
                            onScroll={()=>{}}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={1000}
                        />
                    </div>:
                        <PageNullComm tips="暂无专家关注您"/>
                    }
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
    UserCenter:state.UserCenter
}))(Main);

