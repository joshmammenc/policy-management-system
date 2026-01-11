const { parentPort, workerData } = require('worker_threads');
const mongoose = require('mongoose');

// Import models
const Agent = require('../models/Agent');
const User = require('../models/User');
const Account = require('../models/Account');
const LOB = require('../models/LOB');
const Carrier = require('../models/Carrier');
const Policy = require('../models/Policy');

/**
 * Worker thread for processing CSV data
 */
async function processData() {
  try {
    const { data, mongoUri } = workerData;

    // Connect to MongoDB
    await mongoose.connect(mongoUri);

    parentPort.postMessage({ type: 'progress', message: 'Connected to MongoDB', progress: 5 });

    // Process data
    const result = await transformAndInsertData(data);

    parentPort.postMessage({ 
      type: 'complete', 
      message: 'Data processing completed successfully',
      result 
    });

    // Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    parentPort.postMessage({ 
      type: 'error', 
      message: error.message,
      stack: error.stack 
    });
    process.exit(1);
  }
}

/**
 * Transform CSV data and insert into database
 */
async function transformAndInsertData(data) {
  try {
    // Extract unique entities
    const agentsMap = new Map();
    const accountsMap = new Map();
    const lobsMap = new Map();
    const carriersMap = new Map();
    const usersData = [];

    parentPort.postMessage({ type: 'progress', message: 'Extracting unique entities...', progress: 10 });

    data.forEach((row) => {
      // Agents
      if (row.agent) {
        agentsMap.set(row.agent, {
          agent_name: row.agent,
          agency_id: row.agency_id || '',
        });
      }

      // Accounts
      if (row.account_name) {
        accountsMap.set(row.account_name, {
          account_name: row.account_name,
          account_type: row.account_type || '',
        });
      }

      // LOBs (Line of Business)
      if (row.category_name) {
        lobsMap.set(row.category_name, {
          category_name: row.category_name,
        });
      }

      // Carriers
      if (row.company_name) {
        carriersMap.set(row.company_name, {
          company_name: row.company_name,
        });
      }

      // Users
      if (row.firstname) {
        usersData.push({
          firstname: row.firstname || '',
          dob: row.dob ? new Date(row.dob) : new Date(),
          address: row.address || '',
          phone: row.phone || '',
          state: row.state || '',
          zip: row.zip || '',
          email: row.email || '',
          gender: row.gender || '',
          city: row.city || '',
          userType: row.userType || '',
        });
      }
    });

    // Insert Agents
    parentPort.postMessage({ type: 'progress', message: 'Inserting agents...', progress: 20 });
    const agentOperations = Array.from(agentsMap.values()).map((agent) => ({
      updateOne: {
        filter: { agent_name: agent.agent_name },
        update: { $setOnInsert: agent },
        upsert: true,
      },
    }));
    await Agent.bulkWrite(agentOperations);

    // Insert Accounts
    parentPort.postMessage({ type: 'progress', message: 'Inserting accounts...', progress: 30 });
    const accountOperations = Array.from(accountsMap.values()).map((account) => ({
      updateOne: {
        filter: { account_name: account.account_name },
        update: { $setOnInsert: account },
        upsert: true,
      },
    }));
    await Account.bulkWrite(accountOperations);

    // Insert LOBs
    parentPort.postMessage({ type: 'progress', message: 'Inserting LOBs...', progress: 40 });
    const lobOperations = Array.from(lobsMap.values()).map((lob) => ({
      updateOne: {
        filter: { category_name: lob.category_name },
        update: { $setOnInsert: lob },
        upsert: true,
      },
    }));
    await LOB.bulkWrite(lobOperations);

    // Insert Carriers
    parentPort.postMessage({ type: 'progress', message: 'Inserting carriers...', progress: 50 });
    const carrierOperations = Array.from(carriersMap.values()).map((carrier) => ({
      updateOne: {
        filter: { company_name: carrier.company_name },
        update: { $setOnInsert: carrier },
        upsert: true,
      },
    }));
    await Carrier.bulkWrite(carrierOperations);

    // Insert Users
    parentPort.postMessage({ type: 'progress', message: 'Inserting users...', progress: 60 });
    const insertedUsers = await User.insertMany(usersData, { ordered: false }).catch(err => {
      // Handle duplicate errors gracefully
      return err.insertedDocs || [];
    });

    // Fetch all entities for mapping
    parentPort.postMessage({ type: 'progress', message: 'Fetching entities for mapping...', progress: 70 });
    const agents = await Agent.find();
    const accounts = await Account.find();
    const lobs = await LOB.find();
    const carriers = await Carrier.find();
    const users = await User.find();

    // Create lookup maps
    const agentLookup = new Map(agents.map(a => [a.agent_name, a._id]));
    const accountLookup = new Map(accounts.map(a => [a.account_name, a._id]));
    const lobLookup = new Map(lobs.map(l => [l.category_name, l._id]));
    const carrierLookup = new Map(carriers.map(c => [c.company_name, c._id]));
    
    // Create user lookup by unique combination
    const userLookup = new Map(users.map(u => [
      `${u.firstname}_${u.email}_${u.phone}`, 
      u._id
    ]));

    // Insert Policies
    parentPort.postMessage({ type: 'progress', message: 'Inserting policies...', progress: 80 });
    const policiesData = [];

    for (const row of data) {
      const userKey = `${row.firstname}_${row.email}_${row.phone}`;
      const userId = userLookup.get(userKey);
      
      if (userId && row.policy_number) {
        policiesData.push({
          policy_number: row.policy_number,
          policy_start_date: row.policy_start_date ? new Date(row.policy_start_date) : new Date(),
          policy_end_date: row.policy_end_date ? new Date(row.policy_end_date) : new Date(),
          policy_mode: parseInt(row.policy_mode) || 0,
          policy_type: row.policy_type || '',
          premium_amount: parseFloat(row.premium_amount) || 0,
          premium_amount_written: parseFloat(row.premium_amount_written) || 0,
          producer: row.producer || '',
          csr: row.csr || '',
          user_id: userId,
          lob_id: lobLookup.get(row.category_name),
          carrier_id: carrierLookup.get(row.company_name),
          agent_id: agentLookup.get(row.agent),
          account_id: accountLookup.get(row.account_name),
          hasActiveClientPolicy: row.hasActiveClientPolicy === 'true' || row.hasActiveClientPolicy === true,
        });
      }
    }

    const insertedPolicies = await Policy.insertMany(policiesData, { ordered: false }).catch(err => {
      return err.insertedDocs || [];
    });

    parentPort.postMessage({ type: 'progress', message: 'Data processing complete!', progress: 100 });

    return {
      agents: agents.length,
      accounts: accounts.length,
      lobs: lobs.length,
      carriers: carriers.length,
      users: users.length,
      policies: Array.isArray(insertedPolicies) ? insertedPolicies.length : 0,
    };
  } catch (error) {
    throw error;
  }
}

// Start processing
processData();
