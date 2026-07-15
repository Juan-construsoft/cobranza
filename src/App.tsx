import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CaseList from './modules/cases/CaseList';
import CaseDetail from './modules/cases/CaseDetail';
import CaseForm from './modules/cases/CaseForm';
import DemandGenerator from './modules/demands/DemandGenerator';
import ActivityHistory from './modules/tracking/ActivityHistory';
import Dashboard from './modules/reports/Dashboard';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/cases" exact component={CaseList} />
                <Route path="/cases/new" component={CaseForm} />
                <Route path="/cases/:id" component={CaseDetail} />
                <Route path="/demands/:caseId?" component={DemandGenerator} />
                <Route path="/tracking/:id" component={ActivityHistory} />
            </Switch>
        </Router>
    );
};

export default App;