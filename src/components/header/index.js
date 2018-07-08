import React, { Component } from 'react';
import './header.scss'

class Header extends Component {
  render() {
    return (
      <div>
        <div className="nav-top">
          <div className="container-fluid">
            <div className="navbar-header clearfix">
              <a href="/movieIndex" className="navbar-brand">电影</a>
              <a href="/musicIndex" className="navbar-brand">音乐</a>
            </div>
            {/* <p className="navbar-text navbar-right">
              <span>欢迎您，xx</span>
              <span>&nbsp;|&nbsp;</span>
              <a className="navbar-link" href="/logout">登出</a>
            </p> */}
            <p className="navbar-text navbar-right">
              <a className="navbar-link" href="#" data-toggle="modal" data-target="#signupModal">注册</a>
              <span>&nbsp;|&nbsp;</span>
              <a className="navbar-link" href="#" data-toggle="modal" data-target="#signinModal">登录</a>
            </p>
          </div>
        </div>
        <div className="nav">
          <div className="nav-wrap clearfix">
            <div className="nav-logo">
              <a href="/movieIndex"><img src="/libs/images/movie/movieLogo.png" alt="movieLogo" style={{ 'width': '115px', 'height': '27px' }} /></a>
            </div>
            <div className="nav-search">
              <form method="GET" action="/movie/results">
                <div className="input-group">
                  <input className="form-control" type="text" name="q" placeholder="电影搜索" />
                  <span className="input-group-btn">
                    <button className="btn btn-default" type="submit">
                      <span className="glyphicon glyphicon-search"></span>
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
          <div className="nav-wrap">
            <ul className="clearfix">
              <li>电影后台录入页</li>
              <li>电影列表页</li>
              <li>电影分类录入页</li>
              <li>电影分类列表页</li>
              <li>电影院录入页</li>
              <li>电影院后台录入页</li>
              <li>用户列表页</li>
            </ul>
          </div>
        </div>
        <div id="signupModal" className="modal fade" role="dialog" aria-labelledby="注册">
          <div className="modal-dialog sign-form">
            <div className="modal-content">
              <form id="signupForm" method="POST" action="/user/signin">
                <div className="modal-header">
                  登录云瓣电影
                </div>
                <div className="modal-body clearfix">
                  <div className="form-group clearfix">
                    <label htmlFor="signinName">用户名</label>
                    <input id="signupName" className="form-control" name="name" type="text" placeholder="账号" />
                    <span className="glyphicon glyphicon-remove-sign form-clear" aria-hidden="true"></span>
                    <label id="signupName-error" className="error" htmlFor="signupName" style={{ "display": "none" }}></label>
                  </div>
                  <div className="form-group clearfix">
                    <label htmlFor="signupPassword">密码</label>
                    <input id="signupPassword" className="form-control" name="password" type="password" placeholder="密码" autoComplete />
                    <span className="glyphicon glyphicon-remove-sign form-clear" aria-hidden="true"></span>
                    <label id="signinPassword-error" className="error" htmlFor="signinPassword" style={{ "display": "none" }}></label>
                  </div>
                  <div className="form-group clearfix">
                    <label htmlFor="signupConfirmPassword">确认密码</label>
                    <input id="signupConfirmPassword" className="form-control" name="confirm-password" type="password" placeholder="密码" autoComplete />
                    <span className="glyphicon glyphicon-remove-sign form-clear" aria-hidden="true"></span>
                    <label id="signupConfirmPassword-error" className="error" htmlFor="signupConfirmPassword" style={{ "display": "none" }}></label>
                  </div>
                  <div className="form-group clearfix">
                    <label htmlFor="signupCaptcha">验证码</label>
                    <input id="signupCaptcha" className="form-control form-captcha" name="captcha" type="text" placeholder="输入验证码" />
                    <span className="glyphicon glyphicon-remove-sign form-clear form-captcha-clear" aria-hidden="true"></span>
                    <label id="signupCaptcha-error" className="error" htmlFor="signupCaptcha" style={{ "display": "none" }}></label>
                    <div className="captcha-show"></div>
                    <p className="glyphicon glyphicon-repeat captcha-repeat">换一张？</p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-default" type="button" data-dismiss="modal">关闭</button>
                    <button className="btn btn-success" type="submit">注册</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div id="signinModal" className="modal fade" role="dialog" aria-labelledby="登录云瓣电影">
          <div className="modal-dialog sign-form">
            <div className="modal-content">
              <form id="signinForm" method="POST" action="/user/signin">
                <div className="modal-header">
                  登录云瓣电影
                </div>
                <div className="modal-body clearfix">
                  <div className="form-group clearfix">
                    <label htmlFor="signinName">用户名</label>
                    <input id="signinName" className="form-control" name="name" type="text" placeholder="账号" />
                    <span className="glyphicon glyphicon-remove-sign form-clear" aria-hidden="true"></span>
                    <label id="signinName-error" className="error" htmlFor="signinName" style={{ "display": "none" }}></label>
                  </div>
                  <div className="form-group clearfix">
                    <label htmlFor="signinPassword">密码</label>
                    <input id="signinPassword" className="form-control" name="password" type="password" placeholder="密码" autoComplete />
                    <span className="glyphicon glyphicon-remove-sign form-clear" aria-hidden="true"></span>
                    <label id="signinPassword-error" className="error" htmlFor="signinPassword" style={{ "display": "none" }}></label>
                  </div>
                  <div className="form-group clearfix">
                    <label htmlFor="signinCaptcha">验证码</label>
                    <input id="signinCaptcha" className="form-control form-captcha" name="captcha" type="text" placeholder="输入验证码" />
                    <span className="glyphicon glyphicon-remove-sign form-clear form-captcha-clear" aria-hidden="true"></span>
                    <label id="signinCaptcha-error" className="error" htmlFor="signinCaptcha" style={{ "display": "none" }}></label>
                    <div className="captcha-show"></div>
                    <p className="glyphicon glyphicon-repeat captcha-repeat">换一张？</p>
                  </div>
                  <div className="modal-footer">
                    <a className="position" href="/signup">去注册</a>
                    <button className="btn btn-default" type="button" data-dismiss="modal">关闭</button>
                    <button className="btn btn-success" type="submit">注册</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default Header