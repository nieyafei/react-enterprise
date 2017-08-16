import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {loadAttention,FollowOn} from '../action/Action';
import {Header,Footer} from '../common/ComponentList';
import {RefreshControl,ListView,ActivityIndicator,Popup} from 'antd-mobile';
import {Tool} from '../Tool';
import Util from '../common/Util';

/*
* 关注页面
* */
let index = 0;
let pageIndex = -1;
let pageIndexSearch = -1;
let totalPages = 1;
let totalPagesSearch = 0;
let nUM_SECTIONS = 1;//首次加载几页
let nUM_ROWS_PER_SECTION =10;//每页多少
const PAGE_NUMBER = 10;//初始化，每页数量
var type="all";//默认列表
var data;//接收数据
var loadFlag=true;
let dataSource,prevType;
var scrollTop,scrollTopInit;

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps; if (isIPhone) {
    // Note: the popup content will not scroll.
    maskProps = { onTouchStart: e => e.preventDefault(), };
}
var attForset;
class Main extends Component {
    /* 首次渲染结束之后调用 */
    componentDidMount(){
        Util.isLogin(this.props);
        attForset = this.refs.fortest;
        if(Util.isLogin(this.props,1)) {
            this.setScrollTop();
        }
    }
    constructor(props){
        super(props);
        dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        /* 获取数据类型 */
        this.state = {
            pageType:1,//判断是否登录过,决定在哪儿
            homeActive:"active",
            serActive:"",
            isLoading: false,
            refreshing: false,
            bottomLayer:""
        }
        this.onRefresh = () => {
            /* 下来刷新重新加载 */
            this.setState({ isLoading: false });
            this.refPage();
            this.setState({ refreshing: true });
            this.dataInit();
        }

        this.clearRefresh = () => {
            /* 下来刷新重新加载 */
            //self.refs.fortest.refs.listview.scrollTo(0,0);
        }

        this.onEndReached = (event) =>{//滑动加载
            if (this.state.isLoading || !loadFlag) {
                return;
            }
            this.dataInit();
        }

        this.refPage=()=>{
            loadFlag = true;
            pageIndex = -1;
            totalPages = 1;
        }

        let {Attention,dispatch} = this.props;
        /*
         * 首页接收数据
         * */
        this.dataInit=()=>{
            if(loadFlag){
                this.setState({ isLoading: true });
                loadFlag = false;
                /* 初次加载第一次获取数据 */
                var pageNum = ++pageIndex;//页数
                if(totalPages <= pageNum){
                    this.setState({ isLoading: false });
                    this.setState({ refreshing: false });
                    loadFlag = false;
                    return;
                }
                var url="/api/"+type+"/follow/"+pageNum;
                Tool.fetchGet(url,"",{},'json','basic',
                    (res) => {
                        if(res.result){
                            var datn = res.result.list;
                            totalPages = res.result.countPage;
                            if(datn && datn.length>0){
                                dispatch(loadAttention(type,datn,pageNum));
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
                        loadFlag = true;
                        console.log(err);
                    });
            }
        }

        /* 设置滚动条位置 */
        this.setScrollTop=()=>{
            let attentionScroll= Tool.getSession('attentionScroll')||[];
            let indexTy=attentionScroll.findIndex(function(value, index, arr) {
                return value.tabName == type;
            });
            let scroll=indexTy==-1?0:attentionScroll[indexTy].scroll;
            if(this.state.isLoading){
                //正在加载延时调用自己
                window.setTimeout(this.setScrollTop,150)
            }else {
                //document.body.scrollTop=document.documentElement.scrollTop=scroll
                setTimeout(function(){
                attForset.refs.listview.scrollTo(0, scroll);
                },10)
            }
        }
        //使用Promise主要是为了组件没卸载的时候能准确的先设置滚动条位置再返回之前版块的滚动条位置
        this.saveScroll=()=>{
            return new Promise((resolve, reject) => {
                let attentionScroll= Tool.getSession('attentionScroll')||[];
                let obj={};
                obj.tabName=prevType;
                obj.scroll=scrollTop;
                let indexIf=attentionScroll.findIndex(function(value, index, arr) {
                    return value.tabName == prevType;
                });
                if(indexIf !== -1){
                    attentionScroll[indexIf]=obj
                }else {
                    attentionScroll.push(obj)
                }
                /* 开始插入数据 */
                Tool.setSession("attentionScroll",attentionScroll);
                resolve()
            });
        }

        this.setScrollTop=this.setScrollTop.bind(this);

        this.clickBottomLayer=(ty,uid)=>{
            Popup.show(
                <div className="bottom_lays">
                    <div className="lay_tops">
                        <div className="ls" onClick={this.follow.bind(this,ty,uid,2)}>取消关注</div>
                    </div>
                <div className="lay_bot" onClick={this.onCloseBottom}>取消</div>
            </div>,{ animationType: 'slide-up', maskProps, maskClosable: false });
            this.setState({
                bottomLayer:"active"
            })
        }
        this.onCloseBottom=()=>{
            Popup.hide();
        }
        /*
         * 点击取消关注
         * */
        this.follow=(ty,uid,clickType)=>{
            if(Util.isLogin(this.props)){
                //ty 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                if(!(clickType==1 || clickType==2 || clickType==3)){
                    return ;
                }
                var token = Util.getToken(this.props);
                let {dispatch} = this.props;
                dispatch(FollowOn(type,ty,uid,token,clickType,1,"set_attention_follow"));
                Popup.hide();
            }
        }

        this.toContactExpert=(contactName,contactTitle,uid)=>{
            Util.contactSession("",contactName,contactTitle,"info",uid,"","");
        }

    }

    componentWillMount(){
        if(!Util.isLogin(this.props,1)){
            loadFlag = false;
        }
        Util.bodyOver(true);
        type = this.props.location.query.type || 'expert';//获取不同的类型
        let {Attention} = this.props;
        if(Attention[type].page > -1){
            return;
        }
        this.refPage();
        /* 重新加载 */
        scrollTop = 0;prevType = type;
        this.saveScroll();
        this.dataInit();
    }

    render() {
        const separator = (sectionID, rowID) => (//分隔条
            <div className={`${sectionID}-${rowID}`}
                 key={`${sectionID}-${rowID}`}
                 style={{
                     backgroundColor: '#c6c6c6',
                     height:'1px',
                 }}
            />
        );
        /* 如果已存在数据则不需要初始加载 */
        let {Attention} = this.props;
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        data = Attention[type].date;
        /* 数据展示,通过对应的数据集拿出一条数据来渲染row */
        index = 0;
        var xsInfo =(dataInfo,ts)=>{
            if(dataInfo.actionType==1){
                return (
                    <font>回复了这个{ts}</font>
                )
            }else if(dataInfo.actionType==2){
                return (
                    <font>关注了这个{ts}</font>
                )
            }else if(dataInfo.actionType==3){
                return (
                    <font>点赞了这个{ts}</font>
                )
            }else if(dataInfo.actionType==4){
                return (
                    <font>赞赏了这个回复</font>
                )
            }
        }

        const row = (rowData, sectionID, rowID) => {
            if(JSON.stringify(rowData) == "{}"){
                return null;
            }else {
                if (type == "expert") {//专家
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
                                    <div className="cl3" data-flex="main:left cross:center" data-flex-box="0">
                                    <span className="btn_dian" onClick={this.clickBottomLayer.bind(this,4, rowData.id)}>
                                        <i className="iconfont icon-other"></i>
                                    </span>
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
                    );
                } else if (type == "question") {//问答
                    return (
                        <div key={rowID} className="row home_list_row">
                            <div className="row_question">
                                <div data-flex>
                                    <div data-flex="main:left cross:center" data-flex-box="1">
                                        <div className="over_hidden1">
                                        <Link to={"/question/info/" + rowData.id}
                                              className="row_title">{rowData.question_title}</Link>
                                        </div>
                                    </div>
                                    <div data-flex="main:left cross:center" data-flex-box="0">
                                    <span className="btn_dian"
                                          onClick={this.clickBottomLayer.bind(this, 1, rowData.id)}>
                                        <i className="iconfont icon-other"></i>
                                    </span>
                                    </div>
                                </div>
                                {rowData.userStream.message&&rowData.userStream.message.length>0?
                                    <Link to={(rowData.userStream.userMode==0?"/expert/info/":"/enterprise/info/")+rowData.userStream.uid}>
                                        <div className="row_quet_user" data-flex="cross:center">
                                            <Link to={rowData.userStream.userMode==0?"/expert/info/"+rowData.userStream.uid:""} data-flex-box="1">
                                                <div data-flex="cross:center">
                                                    <img src={Util.images(rowData.userStream.userImage,0)}/>
                                                    <span className="over_hidden1">{rowData.userStream.userName}&nbsp;&nbsp;{rowData.userStream.userOrg}</span>
                                                    {/*<span>{rowData.userStream.userOrg}</span>*/}
                                                </div>
                                            </Link>
                                            <span data-flex-box="0">&nbsp;&nbsp;-&nbsp;&nbsp;{xsInfo(rowData.userStream,"问题")}</span>
                                        </div></Link>:""
                                }

                                {rowData.userStream.actionType==1?
                                    <Link to={"/reply/info/question/"+rowData.userStream.rid} className="row_quet_info over_hidden5" dangerouslySetInnerHTML={Util.createMarkup(rowData.userStream.content)}></Link>
                                    :<Link to={"/question/info/" + rowData.id} className="row_quet_info over_hidden5" dangerouslySetInnerHTML={Util.createMarkup(rowData.content)}></Link>
                                }
                                <div className="row_quet_bot">
                                    <span>已推送专家{Util.getCount(rowData.expert_push_count)}</span><em>|</em>
                                    <span>回答{Util.getCount(rowData.answer_count)}</span><em>|</em>
                                    <span>{rowData.followCount}&nbsp;关注</span>
                                    <span className={(rowData.is_like == 1 ? "active" : "") + " like"}
                                          onClick={this.follow.bind(this, 1, rowData.id, (rowData.is_like == 1 ? 0 : 3))}>
                                    {rowData.likeCount > 0 ? rowData.likeCount : ""}
                                        <i className="iconfont icon-dianzan"></i>
                                </span>
                                </div>
                            </div>
                        </div>
                    );
                } else if (type == "case") {//案例
                    return (
                        <div key={rowID} className="row home_list_row attention_list_row">
                            <div className="row_question">
                                <div data-flex>
                                    <div data-flex="main:left cross:center" data-flex-box="1">
                                        <div className="over_hidden1">
                                        <Link to={"/case/info/" + rowData.id} className="row_title">
                                            {rowData.title}
                                            <span className="type_str">来自{rowData.typeStr}</span>
                                        </Link>
                                        </div>
                                    </div>
                                    <div data-flex="main:left cross:center" data-flex-box="0">
                                    <span className="btn_dian"
                                          onClick={this.clickBottomLayer.bind(this, 3, rowData.id)}>
                                        <i className="iconfont icon-other"></i>
                                    </span>
                                    </div>
                                </div>
                                {rowData.userStream.message&&rowData.userStream.message.length>0?
                                    <Link to={(rowData.userStream.userMode==0?"/expert/info/":"/enterprise/info/")+rowData.userStream.uid}>
                                        <div className="row_quet_user" data-flex="cross:center">
                                            <Link to={rowData.userStream.userMode==0?"/expert/info/"+rowData.userStream.uid:""} data-flex-box="1">
                                                <div data-flex="cross:center">
                                                    <img src={Util.images(rowData.userStream.userImage,0)}/>
                                                    <span className="over_hidden1">{rowData.userStream.userName}&nbsp;&nbsp;{rowData.userStream.userOrg}</span>
                                                    {/*<span>{rowData.userStream.userOrg}</span>*/}
                                                </div>
                                            </Link>
                                            <span data-flex-box="0">&nbsp;&nbsp;-&nbsp;&nbsp;{xsInfo(rowData.userStream,"案例")}</span>
                                        </div></Link>:""
                                }

                                {rowData.userStream.actionType==1?
                                    <Link to={"/reply/info/"+type+"/"+rowData.userStream.rid} className="row_quet_info over_hidden5" dangerouslySetInnerHTML={Util.createMarkup(rowData.userStream.content)}></Link>
                                    :<Link to={"/case/info/"+ rowData.id} className="row_quet_info over_hidden5">
                                        {rowData.coverPic?
                                            <div className="row_case_user div_img">
                                                <img src={Util.images(rowData.coverPic)}/>
                                            </div>:""
                                        }
                                        <div dangerouslySetInnerHTML={Util.createMarkup(rowData.content)}></div>
                                    </Link>
                                }
                                <div className="row_quet_bot">
                                    <span>{rowData.followCount}&nbsp;关注</span>
                                    <span className={(rowData.is_like == 1 ? "active" : "") + " like"}
                                          onClick={this.follow.bind(this, 3, rowData.id, (rowData.is_like == 1 ? 0 : 3))}>
                                    {rowData.likeCount > 0 ? rowData.likeCount : ""}
                                        <i className="iconfont icon-dianzan"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                } else if (type == "tech") {//技术
                    return (
                        <div key={rowID} className="row home_list_row attention_list_row">
                            <div className="row_question row_technology">
                                <div data-flex>
                                    <div data-flex="main:left cross:center" data-flex-box="1">
                                        <div className="teac_head">
                                            <i className="iconfont icon-shezhi-copy"></i>
                                            新技术·来自{rowData.typeStr}
                                        </div>
                                    </div>
                                    <div data-flex="main:left cross:center" data-flex-box="0">
                                        <span className="btn_dian"
                                              onClick={this.clickBottomLayer.bind(this,6, rowData.id)}>
                                            <i className="iconfont icon-other"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="over_hidden1"><Link to={"/tech/info/"+rowData.id} className="row_title row_title_top">{rowData.technology_title}</Link></div>
                                {rowData.userStream.message&&rowData.userStream.message.length>0?
                                    <Link to={(rowData.userStream.userMode==0?"/expert/info/":"/enterprise/info/")+rowData.userStream.uid}>
                                        <div className="row_quet_user" data-flex="cross:center">
                                            <Link to={rowData.userStream.userMode==0?"/expert/info/"+rowData.userStream.uid:""} data-flex-box="1">
                                                <div data-flex="cross:center">
                                                    <img src={Util.images(rowData.userStream.userImage,0)}/>
                                                    <span className="over_hidden1">{rowData.userStream.userName}&nbsp;&nbsp;{rowData.userStream.userOrg}</span>
                                                    {/*<span>{rowData.userStream.userOrg}</span>*/}
                                                </div>
                                            </Link>
                                            <span data-flex-box="0">&nbsp;&nbsp;-&nbsp;&nbsp;{xsInfo(rowData.userStream,"技术")}</span>
                                        </div></Link>:""
                                }

                                {rowData.userStream.actionType==1?
                                    <Link to={"/reply/info/"+type+"/"+rowData.userStream.rid} className="row_quet_info over_hidden5">{rowData.userStream.content}</Link>
                                    :<Link to={"/tech/info/"+ rowData.id} className="row_quet_info">
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
                                                {Util.FormateCoop(rowData.cooperation)}
                                            </div>
                                        </div>
                                    </Link>
                                }

                                <div className="row_quet_bot">
                                    <span>{Util.getCount(rowData.followCount)}&nbsp;关注</span>
                                    <span className={(rowData.is_like == 1 ? "active" : "") + " like"}
                                          onClick={this.follow.bind(this,6,rowData.id,(rowData.is_like == 1 ? 0 : 3))}>
                                    {rowData.likeCount>0?rowData.likeCount:""}
                                        <i className="iconfont icon-dianzan"></i>
                                </span>
                                </div>
                            </div>
                        </div>
                    );
                } else if (type == "opinion") {//观点
                    return (
                        <div key={rowID} className="row home_list_row attention_list_row">
                            <div className="row_question row_opinion">
                                <div data-flex>
                                    <div className="opin_le" data-flex="main:left cross:center" data-flex-box="0">
                                        <div className="teac_head">
                                            <Link to={"/expert/info/"+rowData.uid}>
                                                <img src={Util.images(rowData.image,0)}/>
                                                <br/>
                                                <span className="tit">{rowData.full_name}{/*--{rowData.title}*/}</span><br/>
                                                <span>{rowData.org}</span>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="opin_ri" data-flex="main:left cross:top" data-flex-box="1">
                                        <div className="full_wid">
                                            <Link to={"/opinion/info/"+rowData.id}>
                                                <div className="over_hidden1"><div className="row_title">{rowData.opinion_title}</div></div>
                                            </Link>
                                            {rowData.userStream.message&&rowData.userStream.message.length>0?
                                                <Link to={(rowData.userStream.userMode==0?"/expert/info/":"/enterprise/info/")+rowData.userStream.uid}>
                                                <div className="row_quet_user" data-flex="cross:center">
                                                    <Link to={rowData.userStream.userMode==0?"/expert/info/"+rowData.userStream.uid:""} data-flex-box="1">
                                                        <div data-flex="cross:center">
                                                        <img src={Util.images(rowData.userStream.userImage,0)}/>
                                                        <span className="over_hidden1">{rowData.userStream.userName}&nbsp;&nbsp;{rowData.userStream.userOrg}</span>
                                                        {/*<span>{rowData.userStream.userOrg}</span>*/}
                                                        </div>
                                                    </Link>
                                                    <span data-flex-box="0">&nbsp;&nbsp;-&nbsp;&nbsp;{xsInfo(rowData.userStream,"观点")}</span>
                                                </div></Link>:""
                                            }
                                            {rowData.userStream.actionType==1?
                                                <Link to={"/reply/info/"+type+"/"+rowData.userStream.rid} className="row_quet_info over_hidden5" dangerouslySetInnerHTML={Util.createMarkup(rowData.userStream.content)}></Link>
                                                :<Link to={"/opinion/info/"+rowData.id}>
                                                    <div className="row_quet_info over_hidden3" dangerouslySetInnerHTML={Util.createMarkup(rowData.opinion_content)}>
                                                    </div>
                                                </Link>
                                            }
                                            <div className="row_quet_bot">
                                                <span>{Util.getCount(rowData.followCount)}&nbsp;关注</span><em>|</em>
                                                <span className={(rowData.is_like == 1 ? "active" : "") + " likes"}
                                                      onClick={this.follow.bind(this,5,rowData.id,(rowData.is_like == 1 ? 0 : 3))}>
                                                {rowData.likeCount>0?rowData.likeCount:""}
                                                    <i className="iconfont icon-dianzan"></i>
                                                </span>
                                                <span className="btn_dian like likef"
                                                      onClick={this.clickBottomLayer.bind(this,5, rowData.id)}>
                                                    <i className="iconfont icon-other"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }else{
                    return null;
                }
            }
        };
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        return (
            <div className="page attention_cons bg_color">
                <div className="header_height3">
                    <Header title="关注"/>
                    <HeaderMenu  type={type}/>
                </div>
                <div className="scroll_list active">
                    <ListView
                        dataSource={dataSource.cloneWithRows(data)}
                        renderFooter={() => <div className={this.state.refreshing + " footerRender"} style={{textAlign: 'center'}}>
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
                        initialListSize={dataSource.length-8}
                        pageSize={10}
                        scrollRenderAheadDistance={500}
                        scrollEventThrottle={20}
                        scrollerOptions={{ scrollbars: true }}
                        onScroll={(view) => {
                            scrollTop = view.scroller.getValues().top;
                            //this.saveScroll();
                        }}
                        refreshControl={<RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                            distanceToRefresh={80/2 * (dataDpr)}
                            loading={<div className="loading_pull_up"><ActivityIndicator text="加载中..." size="small"/></div>}
                        />}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={100}
                    />
                </div>
                <Footer attentionActive="active"/>
            </div>
        )
    }

    /**
     * 在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用
     */
    componentWillReceiveProps(np) {
        var {location} = np;
        prevType = type;
        type=location.query.type || 'expert';
        let self=this;
        scrollTopInit = scrollTop;
        if (this.props.location.query.type !== np.location.query.type) {
            this.saveScroll().then(function () {
                //回到顶部
                loadFlag = false;
                self.refs.fortest.refs.listview.scrollTo(0, 0);
                //window.setTimeout(self.setScrollTop,100);
                self.onRefresh();
                //self.onRefresh();
            });
            //this.clearRefresh();
            //this.unmount(); //地址栏已经发生改变，做一些卸载前的处理
        }
        //this.initState(np);
    }
    shouldComponentUpdate(nextProps){
        return true
    }
    //组件卸载，存储滚动条位置
    componentWillUnmount(){
        this.saveScroll();
    }

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
            <div className="home_menus active">
                <ul className="menu" data-flex="box:mean">
                    <li className={setCur.expert}>
                        <Link to="/attention/?type=expert">专家</Link>
                    </li>
                    <li className={setCur.question}>
                        <Link to="/attention/?type=question">问答</Link>
                    </li>
                    <li className={setCur.case}>
                        <Link to="/attention/?type=case">案例</Link>
                    </li>
                    <li className={setCur.tech}>
                        <Link to="/attention/?type=tech">技术</Link>
                    </li>
                    <li className={setCur.opinion}>
                        <Link to="/attention/?type=opinion">观点</Link>
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
    Attention:state.Attention,
    User: state.User
}))(Main); //连接redux