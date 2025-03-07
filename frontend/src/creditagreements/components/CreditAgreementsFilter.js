import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import history from '../../app/History';
import CustomPropTypes from '../../app/utilities/props';
import getOptions from '../../app/utilities/getOptions';
import handleFilterChange from '../../app/utilities/handleFilterChange';

const CreditAgreementsFilter = (props) => {
  const { user, items, handleClear, filtered, setFiltered } = props;

  const handleChange = (event) => {
    setFiltered(handleFilterChange(event, filtered));
  };
  const getSupplierOptions = (inputObj) => {
    const uniqueArr = [
      ...new Set(inputObj.map((eachItem) => eachItem.organization.name))
    ];
    return uniqueArr.sort().map((each) => <option key={each}>{each}</option>);
  };

  return (
    <div className="action-bar p-2 justify-content-end action-bar-background">
      <span className="right-content d-block d-md-flex d-lg-flex d-xl-flex">
        <label htmlFor="supplier-filter" className="my-0">
          Filter by supplier/status
        </label>
        <select
          className="form-control"
          id="col-supplier"
          name="supplier-filter"
          onChange={handleChange}
          value={
            filtered.length > 0 &&
            filtered.findIndex((arr) => arr.id === 'col-supplier') >= 0
              ? filtered[filtered.findIndex((arr) => arr.id === 'col-supplier')]
                  .value
              : ''
          }
        >
          <option value=""> </option>
          {getSupplierOptions(items)}
        </select>
        <select
          className="form-control"
          id="col-status"
          onChange={handleChange}
          value={
            filtered.length > 0 &&
            filtered.findIndex((arr) => arr.id === 'col-status') >= 0
              ? filtered[filtered.findIndex((arr) => arr.id === 'col-status')]
                  .value
              : ''
          }
        >
          <option value=""> </option>
          {getOptions(items, 'status')}
        </select>
        <button className="button" onClick={handleClear} type="button">
          Clear Filters
        </button>
        {user.isGovernment && (
          <button
            className="button primary"
            type="button"
            onClick={() => {
              history.push('/credit-agreements/new');
            }}
          >
            <FontAwesomeIcon icon="plus" /> New Transaction
          </button>
        )}
      </span>
    </div>
  );
};

CreditAgreementsFilter.propTypes = {
  handleClear: PropTypes.func.isRequired,
  filtered: PropTypes.arrayOf(PropTypes.object).isRequired,
  setFiltered: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape).isRequired,
  user: CustomPropTypes.user.isRequired
};

export default CreditAgreementsFilter;
