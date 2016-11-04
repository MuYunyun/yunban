import React from 'react';
import ReactDOM from 'react-dom';
import NewAlbumItem from './NewAlbumItem';
import Title from './Title';

/* 新碟榜整体区域组件 */
class NewAlbums extends React.Component {
  constructor() {
    super();
    this.state = {
      titleTop: ['最热','华语','欧美','日韩','单曲'],     // 标题
      selected: '最热',                                // 当前选择的标题值
      loading: true,                                  // 判断数据是否加载完成
      data: [],                                       // 该区域全部数据
      currentData: {}                                 // 当前显示数据
    }
  }
  render() {
    let newAlbumList = [];
    if (!this.state.loading) {        //加载完成
      let currentData = this.state.currentData;
      if (currentData && currentData.musics) {
        var titleMore = "/music/results?q=" + currentData._id + "&p=0";
        for(let item of currentData.musics) {
          newAlbumList.push(
            <NewAlbumItem data={item} key={item._id} />
          );
        }
      }
    }
    return(
      <div>
        <div className="class-top">
          <span>新碟榜</span>
          <Title titleTop={this.state.titleTop} selected={this.state.selected} onDataChange={e => this.getData(e)} />
          <a href={titleMore} className="more">更多</a>
        </div>
        <div className="screen">
          <div className="panel-body screen-body">
            {newAlbumList}
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
    for(let item of this.state.data) {
      if (item.name.includes(value)) {
        this.setState({
          loading: false,
          selected: value,
          currentData: item
        });
        return;
      }
    }
    // 如果data中没有该数据则通过Ajax请求并保持
    let url = this.props.source + encodeURIComponent('新碟榜' + value);
    $.get(url, (results) => {
      this.setState({
        loading: false,
        selected: value,
        currentData: results.data
      });
      this.state.data.push(results.data);               // 将新返回的数据添加到数组中
    });
  }
}
/* 新碟榜整体区域组件--End */

ReactDOM.render(<NewAlbums source="/musicindex?albumName=" />,
    document.getElementById('newAlbums'));

module.exports = NewAlbums;