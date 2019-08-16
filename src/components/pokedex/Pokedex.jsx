import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'users',
    title: 'Pokédex',
    subtitle: 'Search your Pokémon!'
}

const baseUrl = 'https://pokeapi.co/api/v2'
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
            await axios.get(`${baseUrl}/pokemon/${this.state.search.toString().toLowerCase()}`).then(async resp => {
                await this.setState({pokemon: resp.data });
                await this.showPokemon();
            }).catch(error=>{})
        }
    }

    showPokemon(){
        if(Object.keys(this.state.pokemon).length > 0){
            return (
                <div className="mt-5 p-3">
                    <div className="row">
                        <div className="col-12 col-md-2">
                            <img className="img-thumbnail cover-poke" alt="pokémon" src={this.state.pokemon.sprites.front_default} />
                        </div>
                        <div className="col-12 col-md-3">
                            <p><b>Info</b></p>
                            <p><b>Id:</b> {this.state.pokemon.id}</p>
                            <p><b>Name:</b> {this.state.pokemon.name}</p>
                            <p><b>Type:</b> {this.state.pokemon.types[0].type.name}</p>
                            <p><b>Weight:</b> {this.state.pokemon.weight}</p>
                            <p><b>Height:</b> {this.state.pokemon.height}</p>
                        </div>
                        <div className="col-12 col-md-3">
                            <p><b>Stats</b></p>
                            {this.getStats()}
                        </div>
                        <div className="col-12 col-md-3">
                            <p><b>Abilities</b></p>
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
        return this.state.pokemon.abilities.map(abilities => {
            let abilityId = abilities.ability.url.split("/");
            return (
                <p key={abilityId[6]} className="mb-2"><b onClick={e => this.getAbilityPokemons(abilityId[6])} className="cursor-pointer">{abilities.ability.name}</b></p>
            )
        })
    }

    async getAbilityPokemons(abilityId){
        await axios.get(`${baseUrl}/ability/${abilityId}`).then(async resp => {
            console.log(resp.data)
            await this.setState({ list: initialState.list, ability: resp.data })

            this.showAbility()
        }).catch(error=>{})
    }

    showAbility(){
        return(
            <div className="mt-5 p-3">
                <p><b>{this.state.ability.names[2].name}</b></p>

                <p><b>Effect on opponents: <br /></b>{this.state.ability.effect_entries[0].effect}</p>
                <p><b>Pokemons who use this ability</b></p>
                <div className="row">
                    {this.showAbilityPokemons()}
                </div>
            </div>
        )
    }

    showAbilityPokemons(){
        return this.state.ability.pokemon.map(item => {
            let pokeId = item.pokemon.url.split("/");
            return (
                <div key={pokeId[6]} className="col-6 col-md-3 pokeListItem p-0">
                    <p onClick={e => this.getPokemon(pokeId[6])}>{item.pokemon.name}</p>
                </div>
            )
        })
    }

    async getAll(offsetLimit) {
        await axios.get([offsetLimit]).then(async resp => {
            await this.setState({ 
                list: resp.data, 
                ability: initialState.ability,
                pokemon: Object.entries(this.state.list).length === 0 ? initialState.pokemon : this.state.pokemon
            })
            await this.showAll()
        }).catch(error=>{})
    }

    showAll() {
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
                    <div key={pokeId[6]} className="col-6 col-md-3 pokeListItem p-0">
                        <p onClick={e => this.getPokemon(pokeId[6])}>{pokemon.name}</p>
                    </div>
                )
            })
        }
    }

    renderForm() {
        let urlTodos = `${baseUrl}/pokemon/?offset=00&limit=40`
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
                                    placeholder="Pokémon..." />
                            </div>
                        </div>

                    </div>

                    <hr />
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            
                            <button className="btn btn-primary"
                                onClick={e => this.getAll(urlTodos)}>
                                List All
                            </button>

                            <button className="btn btn-secondary ml-2"
                                onClick={e => this.clear()}>
                                Clear
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
                {this.state.ability !== undefined ? this.showAbility() : ''}
                {this.showAll()}
            </Main>
        )
    }
}