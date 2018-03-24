import React, { Component } from 'react'

class Image extends Component {
  render () {
    return (
      <div className='roster-elem'>
        <img className='roster-img' src={this.props.url} alt='Character' />
      </div>
    )
  }
}

export default Image