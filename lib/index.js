'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fireLazy = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var root = document.documentElement;
function getCurrentTime() {
    return Date.now ? Date.now() : new Date().getTime();
}
//延迟
function throttle(func, wait, options) {
    var context;
    var args;
    var result;
    var timeout = null;
    var previous = 0;
    if (!options) {
        options = {};
    }
    var later = function later() {
        previous = options.leading === false ? 0 : getCurrentTime();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
            context = args = null;
        }
    };
    return function () {
        var now = getCurrentTime();
        if (!previous && options.leading === false) {
            previous = now;
        }
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};
//获取元素坐标@obj [DOM Element]
function getOffset(obj, param) {
    if (!obj) return;
    param = param || { x: 0, y: 0 };
    if (obj != window) {
        var el = obj.getBoundingClientRect();
        var l = el.left;
        var t = el.top;
        var r = el.right;
        var b = el.bottom;
    } else {
        l = 0;
        t = 0;
        r = l + root.clientWidth;
        b = t + root.clientHeight;
    }
    return {
        'left': l,
        'top': t,
        'right': r,
        'bottom': b
    };
}
//元素位置比较@d1 @d2 [Object]
function compare(d1, d2) {
    var left = d2.right > d1.left && d2.left < d1.right;
    var top = d2.bottom >= d1.top && d2.top <= d1.bottom;
    //console.log(d1,d2,left && top);
    return left && top;
}
function loadLazyElement(element) {
    if (!element) {
        return;
    }
    var selfdom = _reactDom2.default.findDOMNode(element);
    var parent = window;
    //获取属性有parent的父祖元素
    if (element.props.partial) {
        var parentEle = selfdom.parentNode;
        while (parentEle && parentEle !== root) {
            if (parentEle.getAttribute('data-parent') != null) {
                parent = parentEle;
                break;
            }
            parentEle = parentEle.parentNode;
        }
        if (parentEle && parentEle !== root) {
            parent = parentEle;
        }
    }
    var contain = getOffset(parent);
    var current = getOffset(selfdom);
    //console.log(current);
    if (compare(contain, current)) {
        element.setState({
            show: true
        });
        return true;
    }
}
//存储懒加载元素
var LazyReactElements = [];
var first = true; //只添加一次scroll事件
function fireLazy() {
    LazyReactElements = LazyReactElements.filter(function (item) {
        return !!item;
    });
    if (LazyReactElements.length == 0) {
        removeEvent();
        first = true;
        return;
    }
    for (var i = 0, len = LazyReactElements.length; i < len; i++) {
        if (loadLazyElement(LazyReactElements[i])) {
            LazyReactElements[i] = null;
        }
    }
}
//ios的scroll是在滚动停止后触发,不用处理
var handleScroll = fireLazy;
var isIos = window.navigator.userAgent.match(/(iPhone|iPad|iPod)/) != null;
if (!isIos) {
    handleScroll = throttle(fireLazy, 300);
}
function addEvent() {
    window.addEventListener('scroll', handleScroll, false);
}
function removeEvent() {
    window.removeEventListener('scroll', handleScroll, false);
}
function storeElement(element) {
    LazyReactElements.push(element);
    if (first) {
        addEvent();
        first = null;
    }
}
function removeSomeElement(element) {
    if (LazyReactElements.length == 0) {
        return;
    }
    for (var i = 0, len = LazyReactElements.length; i < len; i++) {
        if (LazyReactElements[i] === element) {
            LazyReactElements[i] = null;
        }
    }
}

var Lazyload = function (_React$Component) {
    _inherits(Lazyload, _React$Component);

    function Lazyload(props) {
        _classCallCheck(this, Lazyload);

        var _this = _possibleConstructorReturn(this, (Lazyload.__proto__ || Object.getPrototypeOf(Lazyload)).call(this, props));

        _this.state = {
            show: false //是否已显示
        };
        return _this;
    }

    _createClass(Lazyload, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (!loadLazyElement(this)) {
                storeElement(this);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            removeSomeElement(this);
        }
    }, {
        key: 'render',
        value: function render() {
            var show = this.state.show;
            var _props = this.props,
                placeholder = _props.placeholder,
                children = _props.children;

            return show ? children : placeholder ? placeholder : _react2.default.createElement('div', null);
        }
    }]);

    return Lazyload;
}(_react2.default.Component);

Lazyload.propTypes = {
    children: _react.PropTypes.node,
    placeholder: _react.PropTypes.node,
    partial: _react.PropTypes.bool
};
exports.fireLazy = fireLazy;
exports.default = Lazyload;