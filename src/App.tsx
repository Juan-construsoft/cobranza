import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './modules/auth/Login';
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
                <AuthProvider>
                    <Router>
                        <Layout>
                            <Switch>
                                <Route path="/login" component={Login} />
                                <ProtectedRoute path="/" exact component={Dashboard} />
                                <ProtectedRoute path="/cases" exact component={CaseList} />
                                <ProtectedRoute path="/cases/new" component={CaseForm} />
                                <ProtectedRoute path="/cases/:id" component={CaseDetail} />
                                <ProtectedRoute path="/demands/:caseId?" component={DemandGenerator} />
                                <ProtectedRoute path="/tracking/:id" component={ActivityHistory} />
                            </Switch>
                        </Layout>
                    </Router>
                </AuthProvider>
            </NotificationProvider>
        </ThemeProvider>
    );
};

export default App;
