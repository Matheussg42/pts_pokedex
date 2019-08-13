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
        this.setState({ search: initialState.search })
    }

    async getPokemon(event) {
        await this.setState({ search: event.target.value, pokemon: initialState.pokemon });
        if(this.state.search.length > 0){
            await axios.get(`${baseUrl}/${this.state.search}`).then(async resp => {
                await this.setState({pokemon: resp.data });
                await this.showPokemon();
            })
            .catch(error => {
                console.log(`${this.state.search} não encontrado!`)
            });
        }
    }

    async showPokemon(){

        
    }

    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ user: initialState.user, list })
            })
    }

    updateField(event){
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

    renderForm() {
        return (
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
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(user){
        this.setState({ user })
    }

    remove(user){
        axios.delete(`${baseUrl}/${user.id}`).then(resp =>{
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
        })
    }


    render(){
        return(
            <Main {...headerProps}>
                {this.renderForm()}
            </Main>
        )
    }
}