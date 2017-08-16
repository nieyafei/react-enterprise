import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {loadExpert,FollowOn,loadIndustry,loadScience} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {Header,Footer,FollowCommon,ScienceCommon,ShowHideCommon} from '../../common/ComponentList';
import Util from '../../common/Util';
import {Tabs, WhiteSpace,ListView,ActivityIndicator} from 'antd-mobile';

/*
* 专家详情页面
* */
const TabPane = Tabs.TabPane;
var uid;
class Main extends Component {
    constructor(props){
        super(props);
        this.state={
            activeTab:"active",
            activeTab2:"",
        }
        this.changeTab=(typ)=>{
            if(typ==1){
                this.setState({
                    activeTab:"",
                    activeTab2:"active",
                })
            }else{
                this.setState({
                    activeTab:"active",
                    activeTab2:"",
                })
            }
        }
        let {dispatch} = this.props;
        this.follow=(ty,uid,clickType,sourceFrom,actionType)=>{
            if(!(clickType == 1 || clickType == 2)){
                return ;
            }
            if(Util.isLogin(this.props)){
                //type 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                var token = Util.getToken(this.props);
                dispatch(FollowOn("info",ty,uid,token,clickType,sourceFrom,actionType));
            }
        }
        this.toContactExpert=(contactName,contactTitle)=>{
            Util.contactSession("",contactName,contactTitle,"info",uid,"","");
        }
    }
    componentWillMount(){
        uid = this.props.params.uid;
        let {dispatch} = this.props;
        dispatch(loadExpert(uid));
    }
    render() {
        let {Expert} = this.props;
        var expert = Expert["info"];
        return (
            <div className="expert_cons page_hei_cons">
                <Header title="专家详情" leftInfo="back"/>
                <div className="page page_normal bg_color">
                    <div className="bg_colors_fff">
                    <div className="expert_message">
                        <div className="floor_clex" data-flex>
                            <div data-flex data-flex-box="0">
                                <img src={Util.images(expert.portrait, 0)}/>
                            </div>
                            <div data-flex data-flex-box="1">
                                <div className="cle">
                                    <span>{expert.name}&nbsp;&nbsp;
                                        <Link to={"/expert/tags/"+expert.uid} className="ex_tags">
                                            <i className="iconfont icon-iconset"></i>
                                            大数据画像
                                        </Link>
                                        </span><br/>
                                    <div>{expert.title}</div>
                                    {expert.org}

                                    {/*研究领域：{expert.domain}*/}
                                </div>
                            </div>
                            <div data-flex data-flex-box="0">
                                <div className="cri">
                                    <Link onClick={this.toContactExpert.bind(this,expert.name+(expert.title?expert.title:""),"")} className="color1">
                                        <i className="iconfont icon-phone color1"></i>
                                        联系专家
                                    </Link>
                                    <Link onClick={this.follow.bind(this,4,expert.uid,(expert.followAndLike&&expert.followAndLike.userFollow?2:1),0,"set_expert_follow")} className="color1">
                                        <i className={expert.followAndLike&&expert.followAndLike.userFollow?"iconfont icon-guanzhu color1":"iconfont icon-guanzhu1 color1"}></i>
                                        {expert.followAndLike&&expert.followAndLike.userFollow?"取消关注":"关注专家"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="floor_clex_bot" data-flex>
                            <div data-flex="main:center" data-flex-box="1">
                                <span><em>{expert.case_num}</em><br/>案例</span>
                            </div>
                            <div data-flex="main:center" data-flex-box="1">
                                <span><em>{expert.tech_num}</em><br/>技术</span>
                            </div>
                            <div data-flex="main:center" data-flex-box="1">
                                <span><em>{expert.opinion_num}</em><br/>观点</span>
                            </div>
                        </div>
                    </div>
                    {expert.resume?
                        <ShowHideCommon className="expert_sdind" info={expert.resume}/>:""
                    }
                    {/*切换导航*/}
                    <div className="tab_floor" data-flex>
                        <div className={this.state.activeTab} onClick={this.changeTab.bind(this,0)} data-flex="main:center cross:center" data-flex-box="1">
                            产业
                        </div>
                        <div className={this.state.activeTab2} onClick={this.changeTab.bind(this,1)} data-flex="main:center cross:center" data-flex-box="1">
                            学术
                        </div>
                    </div>
                    </div>
                    {/* 产业 */}
                    <Industry className={this.state.activeTab}/>
                    {/* 学术 */}
                    <Science className={this.state.activeTab2}/>
                </div>
                <Footer />
            </div>
        )
    }
}

/*
 * 产业
 *
 * */
var type="all",typeSci="all",loadFlag=true,loadFlagPap=true;
class IndustryList extends Component{
    constructor(props){
        super(props);
        let {dispatch} = this.props;
        this.state={
            isLoading:true,activeKey:"1"
        }
        const separator = (sectionID, rowID) => (//分隔条
            <div className={`${sectionID}-${rowID}`}
                 key={`${sectionID}-${rowID}`}
                 style={{
                     backgroundColor: '#efeff4',
                     height:'0.4rem',
                 }}
            />
        );
        this.onEndReached = () =>{//滑动加载
            if (this.state.isLoading || !loadFlag) {
                return;
            }
            this.dataInit();
        }

        this.dataInit=()=>{
            if(loadFlag){
                this.setState({ isLoading: true });
                loadFlag = false;
                let {IndustryCom} = this.props;
                var pageIndex = IndustryCom[type].page-1;
                /* 初次加载第一次获取数据 */
                var pageNum = ++pageIndex;//页数
                if(IndustryCom[type].totalPages <= pageNum){
                    this.setState({ isLoading: false });
                    return;
                }
                var url="";
                if(type=="all"){
                    url="/api/expert/industry/"+uid;
                }else{
                    var newTy="";
                    if(type=="question"){
                        newTy="q"
                    }else if(type=="case"){
                        newTy="c"
                    }else if(type=="opinion"){
                        newTy="o"
                    }else if(type=="tech"){
                        newTy="t"
                    }
                    url="/api/expert/"+newTy+"/"+uid+"/"+pageNum+"/10";
                }
                Tool.fetchGet(url,"",{},'json','basic',
                    (res) => {
                        if(!res.serror){
                            var datn = [];
                            var totalPages = 1;
                            if(type=="all"){
                                if(!Util.IsNull(res.result.questionReply)){
                                    datn = datn.concat(res.result.questionReply);
                                }
                                if(!Util.IsNull(res.result.caseFeed)){
                                    datn = datn.concat(res.result.caseFeed);
                                }
                                if(!Util.IsNull(res.result.opinionFeed)){
                                    datn = datn.concat(res.result.opinionFeed);
                                }
                                if(!Util.IsNull(res.result.techFeed)){
                                    datn = datn.concat(res.result.techFeed);
                                }
                            }else{
                                datn = res.content;
                                totalPages = res.totalPages
                            }
                            dispatch(loadIndustry(type,datn,pageNum,totalPages));
                        }else{
                            console.log("数据加载失败");
                        }
                        setTimeout(() => {
                            this.setState({
                                isLoading: false,
                            });
                            loadFlag = true;
                        }, 1000);
                    }, (err) => {
                        loadFlag = false;
                        console.log(err);
                    });
            }
        }
        this.onChangeTabsEn=(cType)=>{
            this.start(cType);
        }
        const row = (rowData, sectionID, rowID) => {
            var botMore = "";
            if(type=="all"){
                var cliType = 1;
                if(rowData.typeStr=="技术"){
                    cliType = 3;
                }else if(rowData.typeStr=="案例"){
                    cliType = 2;
                }else if(rowData.typeStr=="观点"){
                    cliType = 4;
                }
                botMore = (
                    <div className="more_list" onClick={this.onChangeTabsEn.bind(this,cliType)}>
                        查看更多
                        <i className="iconfont icon-jiantou1"></i>
                    </div>
                )
            }
            if(rowData.typeStr=="技术"){//技术
                return (
                    <div key={rowID} className="row home_list_row">
                        <div className="row_question row_technology">
                            <div className="teac_head">
                                <i className="iconfont icon-shezhi-copy"></i>
                                新技术·来自{rowData.domain}领域
                            </div>
                            <Link to={"/tech/info/"+rowData.id}>
                                <div className="row_title">{rowData.title}</div>
                                <div className="row_tech_flex" data-flex>
                                    <div className="le" data-flex data-flex-box="0">
                                        合作价格：
                                    </div>
                                    <div className="ri" data-flex data-flex-box="1">
                                        {rowData.finance}万
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
                            <FollowCommon prevProps={this.props} rowData={rowData} tabName={type} type="6" sourceFrom="0" actionType="set_industry_follow"/>
                        </div>
                        {botMore}
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
                                <div className="row_title row_title_top">{rowData.title}</div>
                                <div className="row_quet_info over_hidden5">
                                    {rowData.content}
                                </div>
                            </div>
                        </Link>
                        <div className="row_question">
                            <FollowCommon prevProps={this.props} rowData={rowData} tabName={type} type="3" sourceFrom="0" actionType="set_industry_follow"/>
                        </div>
                        {botMore}
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
                            {/*{  rowData.expertIndexStream?
                                <Link to={"/expert/info/"+rowData.expertIndexStream.uid} className="row_expot_user" data-flex>
                                    <div data-flex="cross:center" data-flex-box="0">
                                        <img src={Util.images(rowData.expertIndexStream.coverPic)} />
                                    </div>
                                    <div data-flex="cross:center" data-flex-box="1">
                                        <div>
                                            <span>{rowData.expertIndexStream.name}</span>
                                            <span>{rowData.expertIndexStream.dept}</span>
                                            <span>{rowData.expertIndexStream.org}</span>
                                        </div>
                                    </div>
                                </Link>:""
                            }
*/}
                            <Link to={"/opinion/info/"+rowData.id}>
                                <div className="row_title">{rowData.title}</div>
                                <div className="row_quet_info over_hidden5">
                                    {rowData.content}
                                </div>
                            </Link>
                            <FollowCommon prevProps={this.props} rowData={rowData} tabName={type} type="5" sourceFrom="0" actionType="set_industry_follow"/>
                        </div>
                        {botMore}
                    </div>
                );
            }else{return null;}

        };

        this.onChangeBack=(key)=>{
            this.start(key);
        }
        this.start=(key)=>{
            if(key==2){
                type="case"
            }else if(key==3){
                type="tech"
            }else if(key==4){
                type="opinion"
            }else{type="all"}
            this.setState({ isLoading: true,activeKey:key+"" });
            loadFlag = true;
            this.dataInit();
        }

        var listView =(type)=>{
            let {IndustryCom}=this.props;
            let dateList = IndustryCom[type].date;
            /* 如果数据为空，直接不再进行加载 */
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
            return (
                <ListView
                    dataSource={ds.cloneWithRows(dateList)}
                    renderFooter={() => <div className="fals footerRender" style={{textAlign: 'center' }}>
                        {this.state.isLoading ? loadInfo : '加载完成，暂无更多数据'}
                    </div>}
                    renderRow={row}
                    renderSeparator={separator}
                    ref="fortest"
                    initialListSize={dateList.length}
                    pageSize={10}
                    scrollRenderAheadDistance={500}
                    scrollEventThrottle={20}
                    scrollerOptions={{ scrollbars: true }}
                    onScroll={(view) => {
                    }}
                    useBodyScroll
                />
            )
        }

        this.makeTabPane=(key)=> {

            if(key==1){

                return (
                    <TabPane tab={`综合`} key={key}>
                        <div className="bg_color">
                            <div className="scroll_list">
                                {listView("all")}
                            </div>
                        </div>
                    </TabPane>
                    )

            }else if(key==2){
                return (
                    <TabPane tab={`案例`} key={key}>
                        <div className="bg_color">
                            <div className="scroll_list">
                                {listView("case")}
                            </div>
                        </div>
                    </TabPane>
                )
            }else if(key==3){
                return (
                    <TabPane tab={`技术`} key={key}>
                        <div className="bg_color">
                            <div className="scroll_list">
                                {listView("tech")}
                            </div>
                        </div>
                    </TabPane>
                )
            }else{
                return (
                    <TabPane tab={`观点`} key={key}>
                        <div className="bg_color">
                            <div className="scroll_list">
                                {listView("opinion")}
                            </div>
                        </div>
                    </TabPane>
                )
            }
        };
    }

    componentWillMount(){
        if(!Util.IsNull(uid)){
            this.dataInit();
        }
    }

    render(){
        return(
            <div className={this.props.className + " industry_cons"}>
                <Tabs ref="tabs_ins" defaultActiveKey={this.state.activeKey} activeKey={this.state.activeKey} swipeable={false} onTabClick={this.onClick} onChange={this.onChangeBack}>
                    {this.makeTabPane(1)}
                    {this.makeTabPane(2)}
                    {this.makeTabPane(3)}
                    {this.makeTabPane(4)}
                </Tabs>
                <WhiteSpace />
            </div>
        )
    }
}
var Industry = connect((state) => ({
    IndustryCom:state.IndustryCom
}))(IndustryList);
export {Industry};

/*
 * 学术
 *
 * */
class ScienceList extends Component{
    constructor(props){
        super(props);
        let {dispatch} = this.props;
        this.state={
            isLoading:true,activeKey:"1"
        }
        const separator = () => (//分隔条
            <div style={{
                     backgroundColor: '#efeff4',
                     height:'0.4rem',
                 }}
            />
        );
        this.onEndReached = () =>{//滑动加载
            if (this.state.isLoading || !loadFlagPap) {
                return;
            }
            this.dataInit();
        }

        this.dataInit=()=>{
            if(loadFlagPap){
                this.setState({ isLoading: true });
                loadFlagPap = false;
                let {ScienceCom} = this.props;
                var pageIndex = ScienceCom[typeSci].page-1;
                /* 初次加载第一次获取数据 */
                var pageNum = ++pageIndex;//页数
                if(ScienceCom[typeSci].totalPages <= pageNum){
                    this.setState({ isLoading: false });
                    return;
                }
                var url="";
                if(typeSci=="all"){
                    url="/api/expert/academic/"+uid;
                }else{
                    url="/api/expert/"+typeSci+"/"+uid+"/"+pageNum+"/10";
                }
                Tool.fetchGet(url,"",{},'json','basic',
                    (res) => {
                        if(!res.serror){
                            var datn = [];
                            var totalPages = 1;
                            if(typeSci=="all"){
                                if(!Util.IsNull(res.result.paper)){
                                    datn = datn.concat(res.result.paper);
                                }
                                if(!Util.IsNull(res.result.patent)){
                                    datn = datn.concat(res.result.patent);
                                }
                                if(!Util.IsNull(res.result.project)){
                                    datn = datn.concat(res.result.project);
                                }
                            }else{
                                datn = res.content;
                                totalPages = res.totalPages
                            }
                            dispatch(loadScience(typeSci,datn,pageNum,totalPages));
                        }else{
                            console.log("数据加载失败");
                        }
                        setTimeout(() => {
                            this.setState({
                                isLoading: false,
                            });
                            loadFlagPap = true;
                        }, 1000);
                    }, (err) => {
                        loadFlagPap = false;
                        console.log(err);
                    });
            }
        }
        this.onChangeTabsEn=(cType)=>{
            this.setState({ activeKey:cType+"" });
        }
        const row = (rowData, sectionID, rowID) => {
            var botMore = "";
            if(typeSci=="all"){
                var cliType = 1;
                if(rowData.typeStr=="项目"){
                    cliType = 2;
                }else if(rowData.typeStr=="论文"){
                    cliType = 4;
                }else if(rowData.typeStr=="专利"){
                    cliType = 3;
                }
                botMore = (
                    <div>
                        <div className="more_list no_bor" onClick={this.onChangeTabsEn.bind(this,cliType)}>
                            查看更多
                            <i className="iconfont icon-jiantou1"></i>
                        </div>
                        {separator()}
                    </div>
                )
            }
            if(rowData.typeStr=="项目"){//问题
                return (
                    <div key={rowID}>
                        <ScienceCommon typeStr="1" rowData = {rowData}/>
                        {botMore}
                    </div>
                );
            }else if(rowData.typeStr=="专利"){//技术
                return (
                    <div key={rowID} >
                        <ScienceCommon typeStr="2" rowData = {rowData}/>
                        {botMore}
                    </div>
                );
            }else if(rowData.typeStr=="论文"){//案例
                return (
                    <div key={rowID}>
                        <ScienceCommon typeStr="3" rowData = {rowData}/>
                        {botMore}
                    </div>
                );
            }else{return null;}

        };

        this.onChangeBack=(key)=>{
            if(key==2){
                typeSci="project"
            }else if(key==3){
                typeSci="patent"
            }else if(key==4){
                typeSci="paper"
            }else{typeSci="all"}
            this.setState({ isLoading: true,activeKey:key+"" });
            loadFlagPap = true;
            this.dataInit();
        }

        var listView =(typeSci)=>{
            let {ScienceCom}=this.props;
            let dateList = ScienceCom[typeSci].date;
            /* 如果数据为空，直接不再进行加载 */
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
            return (
                <ListView
                    dataSource={ds.cloneWithRows(dateList)}
                    renderFooter={() => <div className="false footerRender" style={{textAlign: 'center' }}>
                        {this.state.isLoading ? loadInfo : '加载完成，暂无更多数据'}
                    </div>}
                    renderRow={row}
                    initialListSize={dateList.length}
                    pageSize={10}
                    scrollRenderAheadDistance={500}
                    scrollEventThrottle={20}
                    scrollerOptions={{ scrollbars: true }}
                    onScroll={(view) => {
                    }}
                    useBodyScroll
                />
            )
        }
        this.makeTabPane=(key)=> {
            if(key==1){
                return (
                    <TabPane tab={`全部`} key={key}>
                        <div className="bg_color">
                            <div className="scroll_list">
                                {listView("all")}
                            </div>
                        </div>
                    </TabPane>
                )

            }else if(key==2){
                return (
                    <TabPane tab={`科研项目`} key={key}>
                        <div className="bg_color">
                            <div className="scroll_list">
                                {listView("project")}
                            </div>
                        </div>
                    </TabPane>
                )
            }else if(key==3){
                return (
                    <TabPane tab={`专利`} key={key}>
                        <div className="bg_color">
                            <div className="scroll_list">
                                {listView("patent")}
                            </div>
                        </div>
                    </TabPane>
                )
            }else if(key==4){
                return (
                    <TabPane tab={`论文`} key={key}>
                        <div className="bg_color">
                            <div className="scroll_list">
                                {listView("paper")}
                            </div>
                        </div>
                    </TabPane>
                )
            }
        };
    }
    componentWillMount(){
        if(!Util.IsNull(uid)){
            this.dataInit();
        }
    }
    render(){
        return(
            <div className={this.props.className + " industry_cons science_cons"} >
                <Tabs defaultActiveKey="1" activeKey={this.state.activeKey} onChange={this.onChangeBack} swipeable={false}>
                    {this.makeTabPane(1)}
                    {this.makeTabPane(2)}
                    {this.makeTabPane(3)}
                    {this.makeTabPane(4)}
                </Tabs>
                <WhiteSpace />
            </div>
        )
    }
}
var Science = connect((state) => ({
    ScienceCom:state.ScienceCom
}))(ScienceList);
export {Science};

export default connect((state) => ({
    Expert:state.Expert,
    User: state.User
}))(Main);

