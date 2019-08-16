import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Pokedex from '../components/pokedex/Pokedex'

export default props => 
    <Switch>
        <Route exact path='/' component={Pokedex} />
        <Redirect from='*' to='/' />
    </Switch>