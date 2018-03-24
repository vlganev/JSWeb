import React, { Component } from 'react'
import RosterStore from '../stores/RosterStore'
import left from '../resources/left.png'
import right from '../resources/right.png'

class Slider extends Component {
  constructor (props) {
    super(props)

    this.state = {
      episodeId: 0,
      url: ''
    }
  }

  componentDidMount () {
    this.loadEpisodePreview(this.state.episodeId)
  }

  prev (event) {
    let id = event.target.id
    let episodeId = (Number(id) - 1 < 0) ? 0 : Number(id) - 1
    this.loadEpisodePreview(episodeId)
  }

  next (event) {
    let id = event.target.id
    let episodeId = (Number(id) + 1 > 2) ? 2 : Number(id) + 1
    this.loadEpisodePreview(episodeId)
  }

  loadEpisodePreview (episodeId) {
    RosterStore
      .getEpisodePreviewById(episodeId)
      .then(data => {
        return data.json()
      })
      .then(parseData => {
        this.setState({
          episodeId: parseData.id,
          url: parseData.url
        })
      })
  }

  render () {
    return (
      <div>
        <div className='warper'>
          <img
            id={this.state.episodeId}
            alt='Left Arrow'
            src={left}
            className='slider-elem slider-button case-left'
            onClick={this.prev.bind(this)}
          />
          <img
            className='sliderImg slider-elem'
            alt='Episode Preview'
            src={this.state.url}
          />
          <img
            id={this.state.episodeId}
            alt='Right Arrow'
            src={right}
            className='slider-elem slider-button case-right'
            onClick={this.next.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default Slider