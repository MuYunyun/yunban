import React, { Component } from 'react'
import imageURL from '../../images/movie/footer/1.gif'

class Footer extends Component {
  render() {
    return (
      <div className="m-footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-offset-1 col-md-10 col-xs-offset-1 col-xs-10">
              <div className="footer-img">
                <a href="javascript:;">
                  <img src={imageURL} alt="footerImg" />
                </a>
              </div>
            </div>
            <div className="col-md-1"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default Footer