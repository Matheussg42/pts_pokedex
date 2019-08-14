import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'users',
    title: 'Pokédex',
    subtitle: 'Pesquise pelo Pokémon desejado'
}

const baseUrl = 'https://pokeapi.co/api/v2/pokemon'
const initialState = {
    search: '',
    pokemon: []
}

export default class Pokedex extends Component {

    state = { ...initialState }

    constructor(props) {
        super(props)
        this.getPokemon = this.getPokemon.bind(this);
    }

    clear() {
        this.setState({ search: initialState.search, pokemon: initialState.pokemon })
    }

    async getPokemon(event) {
        await this.setState({ search: event.target.value, pokemon: initialState.pokemon });
        if(this.state.search.length > 0){
            await axios.get(`${baseUrl}/${this.state.search.toString().toLowerCase()}`).then(async resp => {
                await this.setState({pokemon: resp.data });
                await this.showPokemon();
            })
            .catch(error => {
                console.log(`${this.state.search} não encontrado!`)
            });
        }
    }

    showPokemon(){
        if(Object.keys(this.state.pokemon).length > 0){
            return (
                <div className="mt-5 p-3">
                    <div className="row">
                        <div className="col-12 col-md-2">
                            <img className="img-thumbnail cover-poke" src={this.state.pokemon.sprites.front_default} />
                        </div>
                        <div className="col-12 col-md-3">
                            <p><b>Informações</b></p>
                            <p><b>Id:</b> {this.state.pokemon.id}</p>
                            <p><b>Nome:</b> {this.state.pokemon.name}</p>
                            <p><b>Tipo:</b> {this.state.pokemon.types[0].type.name}</p>
                            <p><b>Weight:</b> {this.state.pokemon.weight}</p>
                            <p><b>Height:</b> {this.state.pokemon.height}</p>
                        </div>
                        <div className="col-12 col-md-3">
                            <p><b>Stats</b></p>
                            {this.getStats()}
                        </div>
                        <div className="col-12 col-md-3">
                            <p><b>Habilidades</b></p>
                            {this.getAbilities()}
                        </div>
                    </div>
                </div>
            )
        }
    }

    getStats() {
        return this.state.pokemon.stats.map(stats => {
            return (
                <p className="mb-2"><b>{stats.stat.name}:</b> {stats.base_stat}</p>
            )
        })
    }

    getAbilities() {
        return this.state.pokemon.abilities.map(abilities => {
            return (
                <p className="mb-2"><b>{abilities.ability.name}</b></p>
            )
        })
    }

    renderForm() {
        return (
            <div className="p-3 mt-3">
                <div className="form">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="form-group">
                                <label>Pokémon</label>
                                <input type="text" className="form-control"
                                    name="name"
                                    value={this.state.search}
                                    onChange={this.getPokemon}
                                    placeholder="Digite o nome..." />
                            </div>
                        </div>

                    </div>

                    <hr />
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <button className="btn btn-secondary ml-2"
                                onClick={e => this.clear(e)}>
                                Limpar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        return(
            <Main {...headerProps}>
                {this.renderForm()}
                {this.showPokemon()}
            </Main>
        )
    }
}