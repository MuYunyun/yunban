import React from 'react';

/* 本周单曲榜展示内容组件 */
class ArtistSongItem extends React.Component {
  render() {
    let img;
    if(this.props.data.poster.indexOf('http')>-1){
      img = <img src={this.props.data.poster}
                 alt={this.props.data.title}/>
    }else{
      img = <img src={'/upload/music/'+this.props.data.poster}
                 alt={this.props.data.title} />
    }
    return(
      <li>
        <a href={'/music/' +this.props.data._id} target="_blank">
          {img}
          <h5>{this.props.data.title}</h5>
          <p>{this.props.data.singer+' / '+this.props.data.pv+'次播放'}</p>
          <span className="order">{this.props.value}</span>
        </a>
      </li>
    );
  }
}
/* 本周单曲榜展示内容组件--End */

module.exports = ArtistSongItem;