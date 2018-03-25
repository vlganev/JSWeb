import React, { Component } from 'react'
import PokemonField from './formFields/PokemonField'
import Input from './formFields/Input'


class Index extends Component {
    constructor() {
        super()
        this.state = {
            pokemonName: '',
            pokemonImg: '',
            pokemonInfo: '',
            data: { pokemonColection: [] }
        }


    }

    createPokemon(e) {
        e.preventDefault()
        let payload = {
            pokemonName: this.pokemonName,
            pokemonImg: this.pokemonImg,
            pokemonInfo: this.pokemonInfo
        }
        this.createPokemonToSever(payload)
    }

    componentDidMount() {
        fetch('http://localhost:5000/pokedex/pokedex')
        .then(data => {
            return data.json()
        })
        .then(data => {
            this.state.data.pokemonColection = data.pokemonColection
//            this.setState({ data: data.pokemonColection })
        })
    }

    createPokemonToSever(payload) {
        fetch('http://localhost:5000/pokedex/create', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
            .then(res => {
              return res.json()
            })
            .then(d => {
            })
    }

    render() {
        let validName = this.state.pokemonName !== ''
        let validImg = this.state.pokemonImg.startsWith('http')
        let validContent = this.state.pokemonInfo.length > 3 && this.state.pokemonInfo.length < 50
        return(
                <div>
                <form onSubmit={this.createPokemon.bind(this)}>
                <fieldset className='App'>
                    <Input
                    type='text'
                    data='pokeMon'
                    name='Pokemon Name'
                    func={e => {
                        this.setState({ pokemonName: e.target.value })
                    }}
                    valid={validName}
                    />
        
                    <Input
                    type='text'
                    data='pokeImage'
                    name='Pokemon Image'
                    func={e => {
                        this.setState({ pokemonImg: e.target.value })
                    }}
                    valid={validImg}
                    />
        
                    <Input
                    type='text'
                    data='pokeBio'
                    name='Pokemon Info'
                    func={e => {
                        this.setState({ pokemonInfo: e.target.value })
                    }}
                    valid={validContent}
                    />

                    <input
                        style={({ "display": validName && validImg && validContent === true ? '' : 'none' })}
                        type='submit'
                        value='Create Pokemon'
                    />
                </fieldset>

                </form>
                <div style={({display: 'inline-block'})}>
                {
                        this.state.data.pokemonColection.map((x, index) => {
                        return <PokemonField key={index} data={x} />
                    })
                }
            </div>
            </div>
        )
    }
}

export default Index