import { EventEmitter } from 'events'

class RosterStore extends EventEmitter {
  getEpisodePreviewById (id) {
    return fetch('http://localhost:9999/episodePreview/' + id)
  }

  getRoster () {
    return fetch('http://localhost:9999/roster')
  }

  getCharacterById (id) {
    return fetch('http://localhost:9999/character/' + id)
  }
}

let rosterStore = new RosterStore()

export default rosterStore