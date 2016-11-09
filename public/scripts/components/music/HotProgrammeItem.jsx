import React from 'react';

/* 近期热门歌单每个分类中的歌单组件 */
class ProgrammeItem extends React.Component {
  render() {
    let dataMusics = this.props.dataCars.musics,
        arrList = [],
        img;
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
    if(dataMusics[0].poster.indexOf('http')>-1){
      img = <img src={dataMusics[0] ? dataMusics[0].poster : ''}
           alt={dataMusics[0] ? dataMusics[0].title : ''}
           style={dataMusics[0] ? {display: 'inline'} : {display: 'none'}} />
    }else{
      img = <img src={dataMusics[0] ? '/upload/music/'+dataMusics[0].poster : ''}
                 alt={dataMusics[0] ? dataMusics[0].title : ''}
                 style={dataMusics[0] ? {display: 'inline'} : {display: 'none'}} />
    }

    return (
      <div className="thumbnail">
        <div className="inner">
          <h5><a href={'/music/results?q=' + this.props.dataCars.name + '&p=0'}>{this.props.dataCars.name}</a></h5>
          <div className="content">
            {img}
            {arrList}
          </div>
        </div>
      </div>
    );
  }
}
/* 近期热门歌单每个分类中的歌单组件--End */

module.exports = ProgrammeItem;