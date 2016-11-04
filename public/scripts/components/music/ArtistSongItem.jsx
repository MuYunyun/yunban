import React from 'react';

/* 新碟榜展示内容组件 */
class ArtistSongItem extends React.Component {
  render() {
    return(
      <li>
        <a href={'/music/' +this.props.data._id} target="_blank">
          <img src={this.props.data.poster} alt={this.props.data.title} />
          <h5>{this.props.data.title}</h5>
          <p>{this.props.data.singer+' / '+this.props.data.pv+'次播放'}</p>
          <span className="order">{this.props.value}</span>
        </a>
      </li>
    );
  }
}
/* 新碟榜展示内容组件--End */

module.exports = ArtistSongItem;