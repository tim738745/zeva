import React from 'react';
import PropTypes from 'prop-types';
import formatNumeric from '../../app/utilities/formatNumeric';

const SummaryCreditActivityTable = (props) => {
  const {
    creditActivityDetails,
    consumerSalesDetails,
    complianceRatios,
    pendingBalanceExist
  } = props;
  const { year } = consumerSalesDetails;

  const {
    creditBalanceStart,
    transactions,
    pendingBalance,
    totalCreditReduction,
    ldvSales,
    supplierClass,
    provisionalBalanceAfterCreditReduction
  } = creditActivityDetails;

  const tableSection = (input, title, numberClassname = 'text-right') => {
    if (
      input.A > 0 ||
      input.B > 0 ||
      input.A < 0 ||
      input.B < 0 ||
      title.indexOf('Balance at end') >= 0 ||
      title.indexOf('Balance after Credit Reduction') >= 0
    ) {
      return (
        <tr>
          <th className="large-column text-blue">{title}</th>
          <td className={`${numberClassname} a-class`}>
            {title.indexOf('Balance after Credit Reduction') >= 0 &&
            input.A < 0 ? (
              <span>({formatNumeric(input.A * -1)})</span>
            ) : (
              <span
                className={
                  input.A < 0 ||
                  (input.A !== 0 && title === 'Credit Reduction:')
                    ? 'text-red'
                    : ''
                }
              >
                {title === 'Credit Reduction:' && input.A > 0 && '-'}
                {formatNumeric(input.A) || 0.0}
              </span>
            )}
          </td>
          <td className={numberClassname}>
            {title.indexOf('Balance after Credit Reduction') >= 0 &&
            input.B < 0 ? (
              <span>({formatNumeric(input.B * -1)})</span>
            ) : (
              <span
                className={
                  input.B < 0 ||
                  (input.B !== 0 && title === 'Credit Reduction:')
                    ? 'text-red'
                    : ''
                }
              >
                {title === 'Credit Reduction:' && input.B > 0 && '-'}
                {formatNumeric(input.B) || 0.0}
              </span>
            )}
          </td>
        </tr>
      );
    }

    return false;
  };

  return (
    <table id="summary-credit-activity">
      <tbody>
        <tr>
          <th>
            <h3>Compliance Obligation</h3>
          </th>
        </tr>
        <tr>
          <td className="font-weight-bold text-blue">
            {year} Model Year LDV Sales\Leases:
          </td>
          <td />
          <td className="text-right font-weight-bold">
            {formatNumeric(ldvSales, 0)}
          </td>
        </tr>
        <tr>
          <td className="text-blue">{year} Compliance Ratio:</td>
          <td />
          <td className="text-right">
            {complianceRatios.length > 0 && complianceRatios[0].complianceRatio}
            %
          </td>
        </tr>
        {supplierClass === 'Large' && (
          <tr>
            <td className="text-blue">Large Volume Supplier Class A Ratio:</td>
            <td />
            <td className="text-right">
              {complianceRatios.length > 0 && complianceRatios[0].zevClassA}%
            </td>
          </tr>
        )}
        <tr>
          <td className="font-weight-bold text-blue">
            Compliance Ratio Credit Reduction:
          </td>
          <td />
          <td className="text-right font-weight-bold">
            {complianceRatios.length > 0 &&
              formatNumeric(
                ldvSales * (complianceRatios[0].complianceRatio / 100),
                2
              )}
          </td>
        </tr>
        {supplierClass === 'Large' && (
          <tr>
            <td className="text-blue">
              &bull; &nbsp; &nbsp; ZEV Class A Debit:
            </td>
            <td />
            <td className="text-right">
              {complianceRatios.length > 0 &&
                supplierClass === 'Large' &&
                formatNumeric(
                  ldvSales * (complianceRatios[0].zevClassA / 100),
                  2
                )}
            </td>
          </tr>
        )}
        <tr>
          <td className="text-blue">
            &bull; &nbsp; &nbsp; Unspecified ZEV Class Debit:
          </td>
          <td />
          <td className="text-right">
            {complianceRatios.length > 0 &&
              supplierClass === 'Large' &&
              formatNumeric(
                ldvSales * (complianceRatios[0].complianceRatio / 100) -
                  ldvSales * (complianceRatios[0].zevClassA / 100),
                2
              )}
            {complianceRatios.length > 0 &&
              supplierClass !== 'Large' &&
              formatNumeric(
                ldvSales * (complianceRatios[0].complianceRatio / 100),
                2
              )}
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <th>
            <h3>Credit Activity</h3>
          </th>
          <th className="text-center a-class">
            <h4>A</h4>
          </th>
          <th className="text-center">
            <h4>B</h4>
          </th>
        </tr>
      </tbody>
      <tbody>
        {tableSection(
          creditBalanceStart,
          `Balance at end of September 30, ${year}:`
        )}
        {Object.keys(transactions.administrativeAllocation).length > 0 &&
          tableSection(
            transactions.automaticAdministrativePenalty,
            'Automatic Administrative Penalty:'
          )}
        {Object.keys(transactions.creditsIssuedSales).length > 0 &&
          tableSection(transactions.creditsIssuedSales, 'Consumer ZEV Sales:')}
        {Object.keys(pendingBalance).length > 0 &&
          tableSection(pendingBalance, 'Pending for Consumer Sales:')}
        {Object.keys(transactions.initiativeAgreement).length > 0 &&
          tableSection(
            transactions.initiativeAgreement,
            'Initiative Agreements:'
          )}
        {Object.keys(transactions.purchaseAgreement).length > 0 &&
          tableSection(transactions.purchaseAgreement, 'Purchase Agreements:')}
        {Object.keys(transactions.administrativeAllocation).length > 0 &&
          tableSection(
            transactions.administrativeAllocation,
            'Administrative Credit Allocation:'
          )}
        {Object.keys(transactions.transfersIn).length > 0 &&
          tableSection(transactions.transfersIn, 'Transferred In:')}
        {Object.keys(transactions.administrativeReduction).length > 0 &&
          tableSection(
            transactions.administrativeReduction,
            'Administrative Credit Reduction:'
          )}
        {Object.keys(transactions.transfersOut).length > 0 &&
          tableSection(transactions.transfersOut, 'Transferred Away:')}
        {Object.keys(totalCreditReduction).length > 0 &&
          tableSection(totalCreditReduction, 'Credit Reduction:')}
        {Object.keys(provisionalBalanceAfterCreditReduction).length > 0 &&
          tableSection(
            provisionalBalanceAfterCreditReduction,
            pendingBalanceExist
              ? 'Provisional Balance after Credit Reduction:'
              : 'Balance after Credit Reduction:'
          )}
      </tbody>
    </table>
  );
};

SummaryCreditActivityTable.defaultProps = {
  pendingBalanceExist: false
};

SummaryCreditActivityTable.propTypes = {
  complianceRatios: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  consumerSalesDetails: PropTypes.shape().isRequired,
  creditActivityDetails: PropTypes.shape().isRequired,
  pendingBalanceExist: PropTypes.bool
};

export default SummaryCreditActivityTable;
