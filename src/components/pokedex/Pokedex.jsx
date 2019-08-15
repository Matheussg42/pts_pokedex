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
    pokemon: [],
    list: []
}

export default class Pokedex extends Component {

    state = { ...initialState }

    constructor(props) {
        super(props)
        this.getPokemon = this.getPokemon.bind(this);
    }

    clear() {
        this.setState({ search: initialState.search, pokemon: initialState.pokemon, list: initialState.list })
    }

    async getPokemon(event) {
        let searchValues = event.target ? event.target.value : event;
        await this.setState({ search: searchValues, pokemon: initialState.pokemon });
        if(this.state.search.length > 0){
            await axios.get(`${baseUrl}/${this.state.search.toString().toLowerCase()}`).then(async resp => {
                await this.setState({pokemon: resp.data });
                await this.showPokemon();
            })
        }
    }

    showPokemon(){
        if(Object.keys(this.state.pokemon).length > 0){
            return (
                <div className="mt-5 p-3">
                    <div className="row">
                        <div className="col-12 col-md-2">
                            <img className="img-thumbnail cover-poke" alt="Imagem pokémon" src={this.state.pokemon.sprites.front_default} />
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
        let i = 1;
        return this.state.pokemon.stats.map(stats => {
            return (
                <p key={i++} className="mb-2"><b>{stats.stat.name}:</b> {stats.base_stat}</p>
            )
        })
    }

    getAbilities() {
        let i = 1;
        return this.state.pokemon.abilities.map(abilities => {
            return (
                <p key={i++} className="mb-2"><b>{abilities.ability.name}</b></p>
            )
        })
    }

    async getAll(offsetLimit) {
        await axios.get([offsetLimit]).then(async resp => {
            await this.setState({ list: initialState.list })
            await this.setState({ list: resp.data })
            await this.showAll()
        })
    }

    showAll() {
        console.log(this.state.list.results)
        return(
            <div className="mt-5 p-3">
                <div className="row">
                    {this.renderPokeList()}
                    {this.state.list.results !== undefined ? (
                        <div className="arrowPokeList">
                            <span onClick={e => this.getAll(this.state.list.previous)}>{'<<'}</span>
                            <span onClick={e => this.getAll(this.state.list.next)}>{'>>'}</span>
                        </div>
                    ) : ''}
                </div>
            </div>
        )
    }

    renderPokeList(){
        if(this.state.list.results){

            return this.state.list.results.map(pokemon => {
                let pokeId = pokemon.url.split("/");
                return (
                    <div key={pokemon.url} className="col-6 col-md-3 pokeListItem p-0">
                        <p onClick={e => this.getPokemon(pokeId[6])}>{pokemon.name}</p>
                    </div>
                )
            })
        }
    }

    renderForm() {
        let urlTodos = `${baseUrl}/?offset=00&limit=40`
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
                            
                            <button className="btn btn-primary"
                                onClick={e => this.getAll(urlTodos)}>
                                Listar Todos
                            </button>

                            <button className="btn btn-secondary ml-2"
                                onClick={e => this.clear()}>
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
                {this.showAll()}
            </Main>
        )
    }
}