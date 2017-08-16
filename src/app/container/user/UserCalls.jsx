import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {loadUserCallList} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {RefreshControl,ListView,ActivityIndicator} from 'antd-mobile';
import {Header,Footer} from '../../common/ComponentList';
import Util from '../../common/Util';
/*
 * 关注我的专家
 * */
var tabName="callList";
class Main extends Component {
    constructor(props){
        super(props)
        /* 获取数据类型 */
        this.state = {
        }
        this.onEndReached = () => {
            let {UserCenter} = this.props;
            if (UserCenter["isLoading"][tabName]) {
                return;
            }
            var page = UserCenter[tabName].page+1;
            this.dataInit(page);
        }

        this.dataInit =(page)=> {
            let {dispatch,UserCenter} = this.props;
            dispatch(loadUserCallList(tabName,page,UserCenter[tabName].totalPages));
        }

    }

    componentWillMount(){
        if(Util.isLogin(this.props)){
            this.dataInit(0);
            //dispatch(loadUserCallList());//初始加载
        }
    }

    render() {
        const row = (rowData, sectionID, rowID) => {
            var strType = "未支付";
            if(rowData.current_status==1){
                strType = "支付成功，正在审核";
            }else if(rowData.current_status==2){
                strType = "审核通过"
            }
            return (
                <div key={rowID} className="row home_list_row border_bot">
                    <div className="calls_head row_question">
                        <i className="iconfont icon-dianhua"></i>
                        电话咨询专家
                    </div>
                    <div className="row_question">
                        {rowData.expertIndexStream?
                            <div className="row_quet_user" data-flex="cross:center">
                                <Link to={"/expert/info/"+rowData.expertIndexStream.uid}>
                                    <img src={Util.images(rowData.expertIndexStream.coverPic,0)}/>
                                </Link>
                                <span>{rowData.expertIndexStream.name}</span>
                                <span>{rowData.expertIndexStream.title}</span>
                                <span>{rowData.expertIndexStream.org}</span>
                            </div>:""
                        }
                        <div className="row_quet_info">
                            <p className="p_spo"><span className="color2">发布时间：</span>{Tool.formatDateTime(rowData.create_time)}</p>
                            <span className="color2">咨询信息：</span>{rowData.question}
                        </div>
                        <div className="row_quet_bot">
                            <span>{strType}</span>
                        </div>
                    </div>
                </div>
            )
        };
        let {UserCenter} = this.props;
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = UserCenter[tabName].date;
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        return (
            <div className="pay_cons">
                <Header title="我的电话咨询" leftInfo="back" rightTo="/question" rightIcon="icon-tiwen"/>
                <div className="page pay_lists bg_color">
                    <div className="scroll_list scroll_list_pad">
                        <ListView
                         dataSource={dataSource.cloneWithRows(data)}
                         renderFooter={() => <div className="footerRender" style={{ textAlign: 'center'}}>
                         {UserCenter["isLoading"][tabName] ? loadInfo : ('暂无更多消息')}
                         </div>}
                         renderRow={row}
                         style={{
                         height: document.documentElement.clientHeight,overflow: 'hidden',
                         margin: '0',padding:"1.17rem 0 1.42rem 0"
                         }}
                         initialListSize={(data.length>10?data.length:(data.length-2))}
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
    UserCenter:state.UserCenter
}))(Main);

