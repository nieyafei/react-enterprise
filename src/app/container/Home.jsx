import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory,withRouter } from 'react-router';
import { connect } from 'react-redux';
import {loadHome,setSystemAnimating,FollowOn} from '../action/Action';
import { Tool, merged } from '../Tool';
import {Header,Footer,FollowCommon} from '../common/ComponentList';
import {RefreshControl,ListView,ActivityIndicator,SearchBar} from 'antd-mobile';
import Util from '../common/Util';
import {SearchList,SearchHistory}  from './Search';

/*
 * 所有页面的外壳
 * */

let pageIndex = -1;
let totalPages = 1;
const PAGE_NUMBER = 10;//初始化，每页数量
var type="all";//默认综合列表
var prevType;
var loadFlag=true;
var scrollTop = 0,scrollTopInit=0;
var objFortest,is_scroll = false;
class Main extends Component {
    /* 首次渲染结束之后调用 */
    componentDidMount(){
        //Util.FilterIsStart();//判断是否访问过
        objFortest = this.refs.fortest
        this.setScrollTop();
    }
    constructor(props){
        super(props);
        type = this.props.location.query.type || 'all';//获取不同的类型
        /* 获取数据类型 */
        this.state = {
            homeActive:"active",
            homePage:1,//页面模式1：home 2:搜索
            isLoading: false,
            refreshing: false,
            menuActive:"",
            refreshHeight:(80/2 * (dataDpr))
        }
        this.onRefresh = () => {
            /* 下来刷新重新加载 */
            this.setState({ isLoading: false });
            this.refPage();
            pageIndex = -1;
            this.setState({ refreshing: true });
            this.dataInit();
        }

        this.refPage=()=>{
            loadFlag = true;
            pageIndex = -1;
            totalPages = 1;
        }

        this.clearRefresh = () => {
            /* 下来刷新重新加载 */
            this.onRefresh();
        }

        this.onEndReached = () =>{//滑动加载
            if (this.state.isLoading || !loadFlag) {
                return;
            }
            this.dataInit();
        }

        /*
         * 首页接收数据
         * */
        let {dispatch} = this.props;
        this.dataInit=()=>{
            if(loadFlag){
                this.setState({ isLoading: true });
                //this.setState({ refreshing: true });
                loadFlag = false;
                /* 初次加载第一次获取数据 */
                //dispatch(setSystemAnimating("正在加载",true));
                var uid = this.props.User?this.props.User.uid:null;
                var pageNum = ++pageIndex;//页数
                if(totalPages <= pageNum){
                    this.setState({ isLoading: false });
                    this.setState({ refreshing: false });
                    return;
                }
                var url="/api/index"+(type=="all"?"":("/"+type));
                Tool.fetchPost(url,JSON.stringify({
                        page:pageNum,
                        size:PAGE_NUMBER,
                        domains:Tool.localItem("domainArray"),
                        tags:Tool.localItem("tagList")
                    }),{},'json','basic',
                    (res) => {
                        if(!res.serror){
                            var datn = res.content;
                            totalPages = res.totalPages;
                            if(datn && datn.length>0){
                                dispatch(loadHome(type,datn,pageNum));
                            }
                        }else{
                            console.log("数据加载失败");
                        }
                        setTimeout(() => {
                            this.setState({
                                isLoading: false,
                                refreshing: false,
                            });
                            loadFlag = true;
                        }, 1000);
                    }, (err) => {
                        loadFlag = false;
                        console.log(err);
                    });
            }
            //dispatch(loadHome(type,++Home[type].page));
        }

        /* 设置滚动条位置 */
        this.setScrollTop=()=>{
            const {Home:{isLoadingMore}} = this.props;
            let dataScroll= Tool.getSession('dataScroll')||[];
            let indexTy=dataScroll.findIndex(function(value, index, arr) {
                return value.tabName == type;
            });
            let scroll=indexTy==-1?0:dataScroll[indexTy].scroll;
            if(this.state.isLoading){
                //正在加载延时调用自己
                window.setTimeout(this.setScrollTop,150)
            }else {
                setTimeout(function(){
                    objFortest.refs.listview.scrollTo(0, scroll);
                },150)
            }
        }
        this.setScrollTop=this.setScrollTop.bind(this);
        //使用Promise主要是为了组件没卸载的时候能准确的先设置滚动条位置再返回之前版块的滚动条位置
        this.saveScroll=()=>{
            return new Promise((resolve, reject) => {
                let dataScroll= Tool.getSession('dataScroll')||[];
                let obj={};
                obj.tabName=prevType;
                obj.scroll=scrollTop;
                let indexIf=dataScroll.findIndex(function(value, index, arr) {
                    return value.tabName == prevType;
                });
                if(indexIf !== -1){
                    dataScroll[indexIf]=obj
                }else {
                    dataScroll.push(obj)
                }
                /* 开始插入数据 */
                Tool.setSession("dataScroll",dataScroll);
                document.body.style.overflow="none";
                resolve()
            });
        }
        /*
         * 点击关注 点赞 1 关注  2取消关注  3点赞
         * */
        this.follow=(ty,uid,clickType)=>{
            console.log(clickType);
            if(!(clickType == 1 || clickType == 2 || clickType == 3)){
                return ;
            }
            if(Util.isLogin(this.props)){
                //type 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                var token = Util.getToken(this.props);
                let {dispatch} = this.props;
                dispatch(FollowOn(type,ty,uid,token,clickType,0));
            }
        }
    }

    componentWillMount(){
        Util.bodyOver(true);
        type = this.props.location.query.type || 'all';//获取不同的类型
        console.log(type);
        ////初始加载*/
        const {Home} = this.props;
        if(Home[type].page > -1){
            return;
        }
        this.refPage();
        /* 初步加载 */
        scrollTop = 0;prevType = type;
        this.saveScroll();
        this.dataInit();
    }

    render() {
        const separator = (sectionID, rowID) => (//分隔条
            <div className={`${sectionID}-${rowID}`}
                 key={`${sectionID}-${rowID}`}
                 style={{
                     backgroundColor: '#efeff4',
                     height:'0.4rem',
                 }}
            />
        );
        /* 数据展示,通过对应的数据集拿出一条数据来渲染row */
        let {Home}=this.props;
        let dateList = Home[type].date;
        /* 如果数据为空，直接不再进行加载 */
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const row = (rowData, sectionID, rowID) => {
            if(rowData.typeStr=="问题"){//问题
                return (
                    <div key={rowID} className="row home_list_row">
                        <div className="row_question">
                            <Link to={"/question/info/" + rowData.id}>
                                <div className="over_hidden1"><div className="row_title">{rowData.title}</div></div>
                                <div className="row_quet_info over_hidden5" dangerouslySetInnerHTML={Util.createMarkup(rowData.content)}>
                                </div>
                            </Link>
                            <FollowCommon prevProps={this.props} rowData={rowData} tabName={type} type="1" sourceFrom="0" htmlType="home_question" actionType="set_home_follow"/>
                        </div>
                    </div>
                );
            }else if(rowData.typeStr=="技术"){//技术
                return (
                    <div key={rowID} className="row home_list_row">
                        <div className="row_question row_technology">
                            <div className="teac_head">
                                <i className="iconfont icon-shezhi-copy"></i>
                                新技术·来自{rowData.domain}领域
                            </div>
                            <Link to={"/tech/info/"+rowData.id}>
                                <div className="over_hidden1"><div className="row_title row_title_top">{rowData.title}</div></div>
                            <div className="row_tech_flex" data-flex>
                                <div className="le" data-flex data-flex-box="0">
                                    合作价格：
                                </div>
                                <div className="ri" data-flex data-flex-box="1">
                                    {Util.FormateFance(rowData.finance)}
                                </div>
                            </div>
                            <div className="row_tech_flex" data-flex>
                                <div className="le" data-flex data-flex-box="0">
                                    合作方式：
                                </div>
                                <div className="ri" data-flex data-flex-box="1">
                                    {rowData.cooperation}
                                </div>
                            </div>
                            </Link>
                            <FollowCommon prevProps={this.props} rowData={rowData} tabName={type} type="6" sourceFrom="0" actionType="set_home_follow"/>
                        </div>
                    </div>
                );
            }else if(rowData.typeStr=="案例"){//案例
                return (
                    <div key={rowID} className="row home_list_row">
                        <div className="row_question">
                            <div className="teac_head" >
                                <i className="iconfont icon-anli"></i>
                                案例·来自{rowData.domain}领域
                            </div>
                        </div>
                        <Link to={"/case/info/"+rowData.id}>
                            {rowData.coverPic?
                                <div className="row_case_user div_img">
                                    <img src={Util.images(rowData.coverPic)} />
                                </div>:""
                            }

                            <div className="row_question">
                                <div className="over_hidden1"><div className="row_title row_title_top">{rowData.title}</div></div>
                                <div className="row_quet_info over_hidden5">
                                    {rowData.content}
                                </div>
                            </div>
                        </Link>
                        <div className="row_question">
                            <FollowCommon prevProps={this.props} rowData={rowData} tabName={type} type="3" sourceFrom="0" actionType="set_home_follow"/>
                        </div>
                    </div>
                );
            }else if(rowData.typeStr=="观点"){//专家观点
                return (
                    <div key={rowID} className="row home_list_row">
                        <div className="row_question row_expert">
                            <div className="teac_head">
                                <i className="iconfont icon-yonghu-copy"></i>
                                专家观点
                            </div>
                            {rowData.expertIndexStream?
                                <Link to={"/expert/info/"+rowData.expertIndexStream.uid} className="row_expot_user" data-flex>
                                    <div data-flex="cross:center" data-flex-box="0">
                                        <img src={Util.images(rowData.expertIndexStream.coverPic)} />
                                    </div>
                                    <div data-flex="cross:center" data-flex-box="1">
                                        <div>
                                            <span>{rowData.expertIndexStream.name}&nbsp;&nbsp;{rowData.expertIndexStream.title}</span>
                                            <span>{rowData.expertIndexStream.dept}</span>
                                            <span>{rowData.expertIndexStream.org}</span>
                                        </div>
                                    </div>
                                </Link>:""
                            }

                            <Link to={"/opinion/info/"+rowData.id}>
                                <div className="over_hidden1"><div className="row_title">{rowData.title}</div></div>
                                <div className="row_quet_info over_hidden5">
                                    {rowData.content}
                                </div>
                            </Link>
                            <FollowCommon prevProps={this.props} rowData={rowData} tabName={type} type="5" sourceFrom="0" actionType="set_home_follow"/>
                        </div>
                    </div>
                );
            }else{return null;}

        };
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        return (
            <div className="home_cons page_hei_cons">
                {/* Header */}
                <div className="header_height2">
                    <div className={this.state.homeActive + " hide"}>
                        <HeaderMenu  type={type} homeMenuActive={this.state.homeActive}/>
                    </div>
                </div>
                {/* 首页page cons */}
                <div className="home_fixed">
                <div className={this.state.homeActive + " page bg_color scroll_list"}>
                    <ListView
                        dataSource={ds.cloneWithRows(dateList)}
                        renderFooter={() => <div className={this.state.refreshing + " footerRender"} style={{textAlign: 'center' }}>
                            {this.state.isLoading ? loadInfo : '加载完成，暂无更多数据'}
                        </div>}
                        renderRow={row}
                        renderSeparator={separator}
                        ref="fortest"
                        style={{
                            height: document.documentElement.clientHeight,
                            overflow: 'hidden',
                            margin: '0',padding:"2.21rem 0 1.42rem 0"
                        }}
                        initialListSize={dateList.length}
                        pageSize={10}
                        scrollRenderAheadDistance={500}
                        scrollEventThrottle={20}
                        scrollerOptions={{ scrollbars: true }}
                        onScroll={(view) => {
                            scrollTop = view.scroller.getValues().top;
                        }}
                        refreshControl={<RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                            distanceToRefresh={this.state.refreshHeight}
                            loading={<div className="loading_pull_up"><ActivityIndicator text="加载中..." size="small"/></div>}
                        />}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={100}
                    />
                </div>
                </div>
                {/* 搜索结果页面 */}
                <SearchList/>
                {/* footer */}
                <Footer homeActive="active"/>
            </div>
        )
    }

    /**
     * 在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用
     */
    componentWillReceiveProps(nextProps) {
        var {location} = nextProps;
        var {pathname, search} = location;
        var path = pathname + search;
        prevType = type;
        type=location.query.type || 'all';
        let self=this;
        scrollTopInit = scrollTop;
        if (this.props.location.query.type !== nextProps.location.query.type) {
            //点击tab保存当前所对应的滚动条的位置
            this.saveScroll().then(function () {
                //回到顶部
                loadFlag = false;
                 self.refs.fortest.refs.listview.scrollTo(0, 0);
                 //window.setTimeout(self.setScrollTop,100);
                 self.clearRefresh();
            });
        }
    }
    //组件卸载，存储滚动条位置
    componentWillUnmount(){
        this.saveScroll();
    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

/*
 * 首页菜单导航
 * 综合  问答  案例  技术  观点
 * 点一次是否刷新一次
 * */
class HeaderMenu extends Component{
    constructor(props){
        super(props);
    }
    render(){
        var setCur = {};
        setCur[this.props.type] = 'active';
        return(
            <div className={this.props.homeMenuActive + " home_menus"}>
                <ul className="menu" data-flex="box:mean">
                    <li className={setCur.all}>
                        <Link to="/">综合</Link>
                    </li>
                    <li className={setCur.question}>
                        <Link to="/?type=question">问答</Link>
                    </li>
                    <li className={setCur.case}>
                        <Link to="/?type=case">案例</Link>
                    </li>
                    <li className={setCur.tech}>
                        <Link to="/?type=tech">技术</Link>
                    </li>
                    <li className={setCur.opinion}>
                        <Link to="/?type=opinion">观点</Link>
                    </li>
                </ul>
            </div>
        )
    }
    shouldComponentUpdate(np) {
        return this.props.type !== np.type; //type和之前的不一致，组件才需要更新，否则不更新，提升性能
    }
}

export default connect(state=>({
    Home:state.Home,
    User: state.User
}))(Main);

