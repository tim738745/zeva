/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';

import Loading from '../app/components/Loading';
import CreditTransactionTabs from '../app/components/CreditTransactionTabs';
import ROUTES_CREDIT_REQUESTS from '../app/routes/CreditRequests';
import CustomPropTypes from '../app/utilities/props';
import CreditRequestsPage from './components/CreditRequestsPage';

const qs = require('qs');

const CreditRequestListContainer = (props) => {
  const { location, user } = props;
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  const handleClear = () => {
    setFiltered([]);
  };

  const refreshList = (showLoading) => {
    setLoading(showLoading);

    const queryFilter = [];
    Object.entries(query).forEach(([key, value]) => {
      queryFilter.push({ id: key, value });
    });
    setFiltered([...filtered, ...queryFilter]);
    if (location.state) {
      setFiltered([...filtered, ...location.state]);
    }

    axios.get(ROUTES_CREDIT_REQUESTS.LIST).then((response) => {
      setSubmissions(response.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    refreshList(true);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return [
    <CreditTransactionTabs active="credit-requests" key="tabs" user={user} />,
    <CreditRequestsPage
      filtered={filtered}
      handleClear={handleClear}
      key="page"
      setFiltered={setFiltered}
      submissions={submissions}
      user={user}
    />
  ];
};

CreditRequestListContainer.propTypes = {
  user: CustomPropTypes.user.isRequired
};

export default withRouter(CreditRequestListContainer);
