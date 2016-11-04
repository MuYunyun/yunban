import React from 'react';

/* 近期热门歌单每个分类中的歌单组件 */
class ProgrammeItem extends React.Component {
  render() {
    let dataMusics = this.props.dataCars.musics,
        arrList = [];
    for(let i = 0,len = dataMusics.length; i < len; i++) {
      arrList.push(
        <a key={i} href={'/music/' + dataMusics[i]._id} target="_blank" title={dataMusics[i].title}>
          <p key={i}>{i + 1 + '.' + dataMusics[i].title}</p>
        </a>
      );
    }
    if(arrList.length > 2) {
      arrList.push(
        <span key={this.props.dataCars._id}>...</span>
      );
    }
    return (
      <div className="thumbnail">
        <div className="inner">
          <h5><a href="" target="_blank">{this.props.dataCars.name}</a></h5>
          <div className="content">
            <img src={dataMusics[0] ? dataMusics[0].poster : ''}
                 alt={dataMusics[0] ? dataMusics[0].title : ''}
                 style={dataMusics[0] ? {display: 'inline'} : {display: 'none'}} />
            {arrList}
          </div>
        </div>
      </div>
    );
  }
}
/* 近期热门歌单每个分类中的歌单组件--End */

module.exports = ProgrammeItem;