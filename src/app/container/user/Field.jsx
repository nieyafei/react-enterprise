import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {loadDomain,updateDomain} from '../../action/Action';
import Util from '../../common/Util';
import {Header,ListLiFeild} from '../../common/ComponentList';
import {Tool} from '../../Tool';
import {Toast} from 'antd-mobile';
/**
 * 领域页面
 * @param {String} type    startfield:引导领域页面    userfield:用户领域页面
 */
var dateActive="1,";
var type,from;
class Main extends Component {
    componentDidMount(){

    }
    constructor(props){
        super(props);
        this.state={
            btnInfo:"",
            dateActive:""
        }
        let {dispatch} = this.props;
        this.submitForm =()=>{
            if(type=="startfield"){
                /* 引导页下一步 */
                if(!Util.IsNull(dateActive)){
                    Tool.localItem("fieldType",dateActive);
                    browserHistory.push("/user/cloud/start");//去标签云
                }else{
                    Toast.info("请至少选择一个领域",3);
                }
            }else if(type=="userfield"){
                /* 用户保存领域 */
                if(!Util.IsNull(dateActive)){
                    dispatch(updateDomain(dateActive,0,from));
                }else{
                    Toast.info("请至少选择一个领域",3);
                }
            }
        }
        var domainArray = [];
        this.change=(type)=>{
            if(dateActive.indexOf(type+",")>-1){
                var array = dateActive.split(",");
                var newdate="";domainArray = [];
                for(var i=0;i<array.length-1;i++){
                    if(!(array[i] == type)){
                        newdate+=array[i]+",";
                        domainArray.push(array[i])
                    }
                }
                dateActive = newdate;
            }else{
                dateActive +=type+",";
                domainArray.push(type);
            }
            Tool.localItem("domainArray",JSON.stringify(domainArray));
            dispatch(updateDomain(dateActive,1));
        }
    }
    componentWillMount(){
        type = this.props.params.type;//获取类型
        from = this.props.location.query.from;
        if(type=="startfield"){
            this.setState({
                btnInfo:"下一步"
            })
            Tool.removeLocalItem("tagList");
        }else if(type=="userfield"){
            let {dispatch} = this.props;
            dispatch(loadDomain());
            this.setState({
                btnInfo:"保存"
            })
        }else{
            browserHistory.push('/');//返回首页
        }
    }
    render() {
        //判断显示内容
        var headerNew = from==1?<Header title="选择订阅内容"/>:<Header leftInfo="back" title="选择订阅内容"/>;
        if(this.props.params.type=="startfield"){
            headerNew = <Header title="选择订阅内容"/>;
        }

        let {UserCenter} = this.props;
        dateActive=UserCenter["domainList"][0]?UserCenter["domainList"][0].content:"";
        return (
            <div className="page user_field">
                {headerNew}
                <h1 className="tits">为使我们能提供更高质量的服务，请选择您感兴趣的内容：</h1>
                <ListLiFeild dateActive={dateActive} change={this.change}/>
                <div className="clear"></div>
                <button onClick={this.submitForm} className="field_btn">{this.state.btnInfo}</button>
            </div>
        )
    }
}

export default connect((state) => ({
    User: state.User,
    UserCenter:state.UserCenter
}))(Main);