// Test fixtures - sample data for testing

const sampleAgent = {
  agent_name: 'Test Agent',
  agency_id: 'AGN001',
};

const sampleUser = {
  firstname: 'John',
  dob: new Date('1990-01-01'),
  address: '123 Test St',
  phone: '1234567890',
  state: 'CA',
  zip: '12345',
  email: 'john@test.com',
  gender: 'Male',
  city: 'Test City',
  userType: 'Active Client',
};

const sampleAccount = {
  account_name: 'Test Account',
  account_type: 'Commercial',
};

const sampleLOB = {
  category_name: 'Personal Auto',
};

const sampleCarrier = {
  company_name: 'Test Insurance Co',
};

const samplePolicy = (userId, agentId, accountId, lobId, carrierId) => ({
  policy_number: 'POL123456',
  policy_start_date: new Date('2024-01-01'),
  policy_end_date: new Date('2025-01-01'),
  policy_mode: 12,
  policy_type: 'Single',
  premium_amount: 1500.00,
  premium_amount_written: 1500.00,
  producer: 'Test Producer',
  csr: 'Test CSR',
  user_id: userId,
  agent_id: agentId,
  account_id: accountId,
  lob_id: lobId,
  carrier_id: carrierId,
  hasActiveClientPolicy: true,
});

const sampleScheduledMessage = {
  message: 'Test message',
  day: new Date('2026-12-31'),
  time: '14:30',
  scheduled_at: new Date('2026-12-31T14:30:00'),
  status: 'pending',
};

const sampleCSVData = [
  {
    agent: 'Alex Watson',
    userType: 'Active Client',
    policy_mode: '12',
    producer: 'Test Producer',
    policy_number: 'TEST001',
    premium_amount: '1180.83',
    policy_type: 'Single',
    company_name: 'Test Insurance Co',
    category_name: 'Commercial Auto',
    policy_start_date: '2024-01-01',
    policy_end_date: '2025-01-01',
    csr: 'Test CSR',
    account_name: 'Test Account',
    email: 'test@example.com',
    gender: 'Male',
    firstname: 'Test User',
    city: 'Test City',
    account_type: 'Commercial',
    phone: '1234567890',
    address: '123 Test St',
    state: 'CA',
    zip: '12345',
    dob: '1990-01-01',
  },
];

module.exports = {
  sampleAgent,
  sampleUser,
  sampleAccount,
  sampleLOB,
  sampleCarrier,
  samplePolicy,
  sampleScheduledMessage,
  sampleCSVData,
};
