import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Lazyload,{ fireLazy } from '../src/index.jsx';

class LazyItem extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let {data} = this.props;
        let placeNode = (<div />);
        return (
            <div className="c-item">
                <Lazyload placeholder={placeNode}>
                    <img src={data} />
                </Lazyload>
            </div>
        )
    }
}

class Test extends Component{
    constructor(props){
        super(props);
        this.state = {
            list : [
                'http://ocr75055w.bkt.clouddn.com/37D58PIC432_1024.jpg',
                'http://ocr75055w.bkt.clouddn.com/18593452_165938662126_2.jpg',
                'http://ocr75055w.bkt.clouddn.com/2625614_105237356000_2.jpg',
                'http://ocr75055w.bkt.clouddn.com/37D58PIC439_1024.jpg',
                'http://ocr75055w.bkt.clouddn.com/38c58PICtuS.jpg',
                'http://ocr75055w.bkt.clouddn.com/89U58PICPYm_1024.jpg',
                'http://ocr75055w.bkt.clouddn.com/9745430_101836881000_2.jpg'
            ]
        }
    }
    render(){
        let {list} = this.state;
        let listNode = list.map(function(item,n){
            return <LazyItem key={n} data={item} />
        })
        return(
            <div>
                {listNode}
            </div>
        )
    }
}

ReactDOM.render(
    <Test />,
    document.getElementById('J_wrap')
);