import React from 'react';

/* 新碟榜展示内容组件 */
class NewAlbumItem extends React.Component {
  render() {
    return (
      <div className="thumbnail">
        <a href={'/music/' +this.props.data._id} target="_blank">
          <img src={this.props.data.poster} alt={this.props.data.title} />
        </a>
        <div className="caption">
          <h5><a href={'/music/' +this.props.data._id}>{this.props.data.title}</a></h5>
          <p>{this.props.data.singer}</p>
        </div>
      </div>
    );
  }
}
/* 新碟榜展示内容组件--End */

module.exports = NewAlbumItem;