const API_BASE_PATH = '/compliance';

const COMPLIANCE = {
  LDVSALES: `${API_BASE_PATH}/ldv-sales`,
  CALCULATOR: `${API_BASE_PATH}/calculator`,
  REPORTS: `${API_BASE_PATH}/reports`,
  RATIOS: `${API_BASE_PATH}/ratios`,
  NEW: `${API_BASE_PATH}/reports/new/supplier-information`,
  REPORT_DETAILS: `${API_BASE_PATH}/reports/:id`,
  REPORT_SUPPLIER_INFORMATION: `${API_BASE_PATH}/reports/:id/supplier-information`,
  REPORT_CONSUMER_SALES: `${API_BASE_PATH}/reports/:id/consumer-sales`,
  REPORT_CREDIT_ACTIVITY: `${API_BASE_PATH}/reports/:id/credit-activity`,
  REPORT_SUMMARY: `${API_BASE_PATH}/reports/:id/summary`,
  REPORT_ASSESSMENT: `${API_BASE_PATH}/reports/:id/assessment`,
  VEHICLES: `${API_BASE_PATH}/vehicle`,
  REPORT_DETAILS_BY_YEAR: `${API_BASE_PATH}/compliance-activity-details/:year`,
};

export default COMPLIANCE;
