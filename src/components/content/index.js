import React, { Component } from 'react'
import './movie_index.scss'
import imgurl from '../../images/movie/middleImg/1.gif'

class Content extends Component {
  render() {
    return (
      <div className="wrapper">
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6 col-md-offset-1 screen">
                {/* 顶部轮播图标签节点 */}
                <div id="scrollMovies">
                  <div className="panel panel-default">
                    <div className="panel-heading screen-header">
                      <h4 id="headerNow">
                        <a href="/movie/results?q=#{cat.name}&p=0" target="_blank">xxxname</a>
                        <span>即将上映</span>
                        <i>»</i>
                      </h4>
                      <div className="slide-tip">
                        <span className="side-index">1</span>
                        <span>&nbsp;/&nbsp;</span>
                        <span className="side-max"></span>
                        <button className="slide-prev"></button>
                        <button className="slide-next"></button>
                      </div>
                    </div>
                    <div id="screenBody" className="panel-body screen-body" style={{ 'width': '10000px' }}>
                      <div className="thumbnail scroll-item" style={{ 'width': '127px' }}>
                        <a href="/movie/id">
                          <img src="item.poster" alt="title" />
                          {/* <img src="/upload/movie" alt="title" /> */}
                        </a>
                        <div className="caption">
                          <h5>title</h5>
                          <p><a className="btn btn-primary" href="/movie/id" role="button">观看预告片</a></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 顶部轮播图下方广告标签节点 */}
                <div className="left-advertisement">
                  <a href="javascript:;">
                    <img src={imgurl} alt="middelImg" />
                  </a>
                </div>
                {/* 选电影/选电视剧标签节点 */}
                <div id="#fliterMovies" className="fliter-movies">
                  <div className="screen">
                    <div className="class-top">
                      <span className="active">选电影</span>
                      <i>&nbsp;/&nbsp;</i>
                      <span>选电视剧</span>
                      <hr/>
                      <ul>
                        <li><button className="btn btn-primary">热门</button></li>
                        <li><button className="btn btn-primary">最新</button></li>
                        <li><button className="btn btn-primary">经典</button></li>
                        <li><button className="btn btn-primary">云瓣高分</button></li>
                        <li><button className="btn btn-primary">冷门佳片</button></li>
                        <li><button className="btn btn-primary">华语</button></li>
                        <li><button className="btn btn-primary">欧美</button></li>
                        <li><button className="btn btn-primary">韩国</button></li>
                      </ul>
                      <hr/>
                    </div>
                    <div className="sort">
                      <label className="radio-inline">
                        <input type="radio" name="sort" value="pv" checked />
                        按热度排序&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="radio" name="sort" value="year" />
                        按时间排序&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="radio" name="sort" value="rating" />
                        按评价排序&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </label>
                    </div>
                  </div>
                </div>



              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Content