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
                    {/* 热门电影标签节点 */}
                    <div className="screen-body">
                      <div className="panel-default">
                        <div id="classBody" className="panel-body screen-body">
                          <div className="col-md-3 col-sm-3 col-xs-4">
                            <div className="thumbnail">
                              <a href="/movie/id">
                                <img src="poster" alt="title" />
                                <img src="/upload/movie/" alt="title" />
                              </a>
                              <div className="caption">
                                <h5>title
                                  <strong>rating</strong>
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <a className="more" href="javascript:;" role="button">
                          加载更多
                        </a>
                      </div>
                    </div>
                    {/* 热门推荐标签节点 */}
                    <div id="galleryFrames" className="panel panel-default">
                      <div className="panel-heading screen-header">
                        <h4>热门推荐</h4>
                        <div className="slide-tip">
                          <span className="side-index">1</span>
                          <span>&nbsp;/&nbsp;</span>
                          <span className="side-max"></span>
                          <button className="slide-prev"></button>
                          <button className="slide-next"></button>
                        </div>
                      </div>
                      <div className="pannel-body">
                        <ul className="slide-content clearfix">
                          <li className="slide-item">
                            <a href="/movie/580765cc3c4315746e182e05">
                              <img src="/libs/images/movie/galleryFrames/1.jpg" alt="新海诚正式踏入日本动画界大师级导演的行列" />
                            </a>
                            <div className="slide-detail">
                              <div className="slide-hd">
                                <a href="/movie/580765cc3c4315746e182e05" target="_blank">
                                  <h5>新海诚正式踏入日本动画界大师级导演的行列</h5>
                                </a>
                              </div>
                              <div className="slide-hd">
                                <p>你我相逢在黑夜的空中，你有你的我有我的方向，你记得也好，最好你忘掉，在这交会时互放的光亮。</p>
                              </div>
                            </div>
                          </li>
                          <li className="slide-item">
                            <a href="/movie/5809d0e421747bb2f2504ba1">
                              <img src="/libs/images/movie/galleryFrames/2.jpg" alt="哪些无意之举引发了一场大混乱" />
                            </a>
                            <div className="slide-detail">
                              <div className="slide-hd">
                                <a href="/movie/5809d0e421747bb2f2504ba1" target="_blank">
                                  <h5>哪些无意之举引发了一场大混乱</h5>
                                </a>
                              </div>
                              <div className="slide-hd">
                                <p>英国神奇动物学家纽特的一个无意之举引发北美魔法世界秩序大混乱，一起聊聊我们亲身经历过的那些悲囧人僧</p>
                              </div>
                            </div>
                          </li>
                          <li className="slide-item">
                            <a href="/movie/580766853c4315746e182e08">
                              <img src="/libs/images/movie/galleryFrames/3.jpg" alt="关于电影本身的电影" />
                            </a>
                            <div className="slide-detail">
                              <div className="slide-hd">
                                <a href="/movie/580766853c4315746e182e08" target="_blank">
                                  <h5>下次送礼，送TA一把瑞士军刀</h5>
                                </a>
                              </div>
                              <div className="slide-hd">
                                <p>《瑞士军刀男》这部脑洞大开的无节操影片，看似低俗的无厘头小幽默，实则蕴涵着对现实世界偏见与歧视的大大嘲讽。</p>
                              </div>
                            </div>
                          </li>
                          <li className="slide-item">
                            <a href="/movie/5807660d3c4315746e182e06">
                              <img src="/libs/images/movie/galleryFrames/4.jpg" alt="【云瓣会客厅】王千源：用实力证明不凡" />
                            </a>
                            <div className="slide-detail">
                              <div className="slide-hd">
                                <a href="/movie/5807660d3c4315746e182e06" target="_blank">
                                  <h5>《釜山行》到底有没有那么好？</h5>
                                </a>
                              </div>
                              <div className="slide-hd">
                                <p>《釜山行》有着好莱坞般的剧本严丝合缝分秒不差，有框架整齐只需往里填坑的故事，那么它除了套路还有什么……</p>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                {/* 电影院搜索标签节点 */}
                <div className="cinemas-search">

                </div>
                {/* 电影院下方广告节点标签 */}
                <div className="right-advertisement">
                  <a><img src="" /></a>
                </div>
                {/* 电影活动部分节点标签 */}
                <div className="right-advertisementList">
                  <h4>电影画廊&nbsp;.&nbsp;.&nbsp;.&nbsp;.&nbsp;.&nbsp;</h4>
                  <ul>
                    <li>
                      <a href="/gallery">️ 瓣~,向经典致敬</a>
                      <a href="/movie/580766853c4315746e182e08">️ 下次送礼,送TA一把瑞士军刀(╰_╯)#</a>
                      <a href="/movie/580765cc3c4315746e182e05">️ 《你的名字》曝光终极预告海报</a>
                    </li>
                  </ul>
                </div>
                {/* 本周口碑榜节点标签 */}
                <div className="billboard">
                  <div className="billboard-hd">
                    <h4>本周口碑榜</h4>
                  </div>
                  <div className="billboard-hd">
                    <table className="table table-hover">
                      <tbody>
                        <tr>
                          <td></td>
                          <td><a href="/movie/id">title</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* 本周口碑榜下方广告部分节点标签 */}
                <div className="right-advertisement">
                  <a href="javascript:;"><img src="" /></a>
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