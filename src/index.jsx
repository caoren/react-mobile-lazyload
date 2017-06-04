import React from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';

const root = document.documentElement;
function getCurrentTime(){
    return Date.now ? Date.now() : new Date().getTime();
}
//延迟
function throttle(func, wait, options) {
    var context;
    var args;
    var result;
    var timeout = null;
    var previous = 0;
    if(!options){
        options = {};
    }
    var later = function() {
        previous = options.leading === false ? 0 : getCurrentTime();
        timeout = null;
        result = func.apply(context, args);
        if(!timeout){
            context = args = null;
        }
    };
    return function() {
        var now = getCurrentTime();
        if(!previous && options.leading === false){
            previous = now;
        }
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if(remaining <= 0 || remaining > wait){
            if(timeout){
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if(!timeout){
                context = args = null;
            }
        }
        else if(!timeout && options.trailing !== false){
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};
//获取元素坐标@obj [DOM Element]
function getOffset(obj,param){
    if(!obj) return;
    param = param || {x : 0, y : 0}
    if(obj != window){
        var el = obj.getBoundingClientRect();
        var l = el.left;
        var t = el.top;
        var r = el.right;
        var b = el.bottom;
    }
    else{
        l = 0;
        t = 0;
        r = l + root.clientWidth;
        b = t + root.clientHeight;
    }
    return{
        'left' : l,
        'top' : t,
        'right' : r,
        'bottom' : b
    };
}
//元素位置比较@d1 @d2 [Object]
function compare(d1,d2){
    let left = d2.right > d1.left && d2.left < d1.right;
    let top = d2.bottom >= d1.top && d2.top <= d1.bottom;
    //console.log(d1,d2,left && top);
    return left && top;
}
function loadLazyElement(element){
    if(!element){
        return;
    }
    var selfdom = ReactDOM.findDOMNode(element);
    var parent = window;
    //获取属性有parent的父祖元素
    if(element.props.partial){
        let parentEle = selfdom.parentNode;
        while(parentEle && parentEle !== root){
            if(parentEle.getAttribute('data-parent') != null){
                parent = parentEle;
                break;
            }
            parentEle = parentEle.parentNode;
        }
        if(parentEle && parentEle !== root){
            parent = parentEle;
        }
    }
    var contain = getOffset(parent);
    var current = getOffset(selfdom);
    //console.log(current);
    if(compare(contain,current)){
        element.setState({
            show  :true
        });
        return true;
    }
}
//存储懒加载元素
var LazyReactElements = [];
var first = true; //只添加一次scroll事件
function fireLazy(){
    LazyReactElements = LazyReactElements.filter(function(item){
        return !!item;
    });
    if(LazyReactElements.length == 0){
        removeEvent();
        first = true;
        return;
    }
    for(var i=0,len=LazyReactElements.length;i<len;i++){
        if(loadLazyElement(LazyReactElements[i])){
            LazyReactElements[i] = null;
        }
    }
}
//ios的scroll是在滚动停止后触发,不用处理
var handleScroll = fireLazy;
var isIos = window.navigator.userAgent.match(/(iPhone|iPad|iPod)/) != null;
if(!isIos){
    handleScroll = throttle(fireLazy,300);
}
function addEvent(){
    window.addEventListener('scroll',handleScroll,false);
}
function removeEvent(){
    window.removeEventListener('scroll',handleScroll,false);
}
function storeElement(element){
    LazyReactElements.push(element);
    if(first){
        addEvent();
        first = null;
    }
}
function removeSomeElement(element){
    if(LazyReactElements.length == 0){
        return;
    }
    for(var i=0,len=LazyReactElements.length;i<len;i++){
        if(LazyReactElements[i] === element){
            LazyReactElements[i] = null;
        }
    }
}
class Lazyload extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show : false   //是否已显示
        }
    }
    componentDidMount(){
        if(!loadLazyElement(this)){
            storeElement(this);
        }
    }
    componentWillUnmount(){
        removeSomeElement(this);
    }
    render(){
        let {show} = this.state;
        let {placeholder,children} = this.props;
        return show ? children : (placeholder ? placeholder : <div />);
    }
}
Lazyload.propTypes = {
    children : PropTypes.node,
    placeholder : PropTypes.node,
    partial : PropTypes.bool
};
export {fireLazy};
export default Lazyload;

