import React from 'react';

/* 新碟榜展示内容组件 */
class NewAlbumItem extends React.Component {
  render() {
    let img;
    if(this.props.data.poster.indexOf('http')>-1){
      img = <img src={this.props.data.poster}
                 alt={this.props.data.title}/>
    }else{
      img = <img src={'/upload/music/'+this.props.data.poster}
                 alt={this.props.data.title} />
    }
    return (
      <div className="thumbnail">
        <a href={'/music/' +this.props.data._id} target="_blank">
          {img}
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