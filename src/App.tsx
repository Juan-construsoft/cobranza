import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import CaseList from './modules/cases/CaseList';
import CaseDetail from './modules/cases/CaseDetail';
import CaseForm from './modules/cases/CaseForm';
import DemandGenerator from './modules/demands/DemandGenerator';
import ActivityHistory from './modules/tracking/ActivityHistory';
import Dashboard from './modules/reports/Dashboard';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NotificationProvider>
                <Router>
                    <Layout>
                        <Switch>
                            <Route path="/" exact component={Dashboard} />
                            <Route path="/cases" exact component={CaseList} />
                            <Route path="/cases/new" component={CaseForm} />
                            <Route path="/cases/:id" component={CaseDetail} />
                            <Route path="/demands/:caseId?" component={DemandGenerator} />
                            <Route path="/tracking/:id" component={ActivityHistory} />
                        </Switch>
                    </Layout>
                </Router>
            </NotificationProvider>
        </ThemeProvider>
    );
};

export default App;
