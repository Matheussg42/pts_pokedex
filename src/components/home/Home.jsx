import React from 'react'
import Main from '../template/Main'

export default props =>
    <Main icon="home" title="Início" subtitle="Página inicial da Pokedex">
        <div className="display-4">
            Bem Vindo!
        </div>
        <hr />
        <p className="mb-0">
            Sistema para estudo. Criando uma Pokedex!
        </p>
    </Main>