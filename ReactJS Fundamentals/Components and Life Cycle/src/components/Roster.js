import React, { Component } from 'react'
import Image from './Image'
import Details from './Details'
import RosterStore from '../stores/RosterStore'

class Roster extends Component {
  constructor (props) {
    super(props)

    this.state = {
      roster: [],
      characterId: 0
    }
  }

  componentDidMount () {
    RosterStore
      .getRoster()
      .then(data => {
        return data.json()
      })
      .then(parseData => {
        this.setState({
          roster: parseData
        })
      })
  }

  loadCharacterDetails (characterId) {
    this.setState({
      characterId
    })
  }

  render () {
    return (
      <div className='roster'>
        {this.state.roster.map(a => (
          <a href='about: blank' key={a.id} onClick={e => {
            e.preventDefault()
            this.loadCharacterDetails(a.id)
          }}>
            <Image key={a.id} url={a.url} />
          </a>
        ))}
        <Details characterId={this.state.characterId} />
      </div>
    )
  }
}

export default Roster