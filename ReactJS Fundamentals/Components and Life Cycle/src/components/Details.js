import React, { Component } from 'react'
import Image from './Image'
import RosterStore from '../stores/RosterStore'

class Details extends Component {
  constructor (props) {
    super(props)

    this.state = {
      id: null,
      name: '',
      url: '',
      bio: ''
    }
  }

  componentDidMount () {
    this.loadCharacterDetails(this.props.characterId)
  }

  componentWillUpdate (nextProps) {
    if (Number(nextProps.characterId) !== Number(this.props.characterId)) {
      this.loadCharacterDetails(nextProps.characterId)
    }
  }

  loadCharacterDetails (characterId) {
    RosterStore
      .getCharacterById(characterId)
      .then(data => {
        return data.json()
      })
      .then(parseData => {
        this.setState({
          id: parseData.id,
          name: parseData.name,
          url: parseData.url,
          bio: parseData.bio
        })
      })
  }

  render () {
    return (
      <div>
        <Image url={this.state.url} />
        <p>{this.state.bio}</p>
      </div>
    )
  }
}

export default Details