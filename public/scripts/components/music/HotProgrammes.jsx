import React from 'react';
import ReactDOM from 'react-dom';
import HotProgrammeItem from './HotProgrammeItem';
import Title from './Title';

/* 新碟榜整体区域组件 */
class HotProgrammes extends React.Component {
  constructor() {
    super();
    this.state = {
      titleTop: ['最热','流行','摇滚','民谣','原声'],     // 标题
      selected: '最热',                                // 当前选择的标题值
      loading: true,                                  // 判断数据是否加载完成
      data: [],                                       // 该区域全部数据
      currentData: {},                                // 当前显示数据
      dataPro: [],
      index: 0
    }
  }
  render() {
    let programmeList = [];
    if (!this.state.loading) {        //加载完成
      let currentData = this.state.currentData;
      if (currentData) {
        for(let item of currentData) {      // 每首音乐
          programmeList.push(
            <HotProgrammeItem dataCars={item} key={item._id} />       // 曲单的_id
          );
        }
      }
    }
    return(
      <div>
        <div className="class-top">
          <span>近期热门歌单</span>
          <Title titleTop={this.state.titleTop} selected={this.state.selected} onDataChange={e => this.getData(e)} />
          <a href="" className="more">更多</a>
        </div>
        <div className="screen">
          <div className="panel-body screen-body">
            {programmeList}
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    let value = this.state.selected;
    this.getData(value);
  }
  getData(value) {
    // 判断data数组中是否已有该标题对应的数据,如果有则将该值赋给currentData并返回
    let dataPro = this.state.dataPro;
    for(let i = 0; i < dataPro.length; i++) {
      if (dataPro[i].name.includes(value)) {
        this.setState({
          loading: false,
          selected: value,
          currentData: this.state.data[i]
        });
        return;
      }
    }
    // 如果data中没有该数据则通过Ajax请求并保持
    let url = this.props.source + encodeURIComponent('近期热门歌单' + value);
    $.get(url, (results) => {
      this.setState({
        loading: false,
        selected: value,
        currentData: results.data
      });
      this.state.data.push(results.data);               // 将新返回的数据添加到数组中
      this.state.dataPro.push(results.dataPro);
    });
  }
}
/* 近期热门歌单分类组件--End */

ReactDOM.render(<HotProgrammes source="/musicindex?hotProName=" />,
    document.getElementById('hotProgrammes'));

module.exports = HotProgrammes;