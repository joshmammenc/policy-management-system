/**
 * Transform CSV row data to appropriate format
 */
const transformRowData = (row) => {
  return {
    // Agent
    agent: row.agent || '',
    agency_id: row.agency_id || '',
    
    // User
    firstname: row.firstname || '',
    dob: row.dob || '',
    address: row.address || '',
    phone: row.phone || '',
    state: row.state || '',
    zip: row.zip || '',
    email: row.email || '',
    gender: row.gender || '',
    city: row.city || '',
    userType: row.userType || '',
    
    // Account
    account_name: row.account_name || '',
    account_type: row.account_type || '',
    
    // LOB
    category_name: row.category_name || '',
    
    // Carrier
    company_name: row.company_name || '',
    
    // Policy
    policy_number: row.policy_number || '',
    policy_start_date: row.policy_start_date || '',
    policy_end_date: row.policy_end_date || '',
    policy_mode: row.policy_mode || '',
    policy_type: row.policy_type || '',
    premium_amount: row.premium_amount || '',
    premium_amount_written: row.premium_amount_written || '',
    producer: row.producer || '',
    csr: row.csr || '',
    hasActiveClientPolicy: row['hasActive ClientPolicy'] || '',
  };
};

/**
 * Validate required fields
 */
const validateRowData = (row) => {
  const errors = [];
  
  if (!row.firstname) {
    errors.push('firstname is required');
  }
  
  if (!row.policy_number) {
    errors.push('policy_number is required');
  }
  
  return errors;
};

/**
 * Batch array into chunks
 */
const batchArray = (array, batchSize) => {
  const batches = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
};

module.exports = {
  transformRowData,
  validateRowData,
  batchArray,
};
