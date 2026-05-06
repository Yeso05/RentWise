const db = require('./db');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');


    // 0. Seed users (landlord and tenants) with hashed passwords
    console.log('Adding users...');
    const users = [
      { name: 'Aarthi', email: 'aarthi@gmail.com', password: 'password123', role: 'Landlord' },
      { name: 'Rahul Sharma', email: 'rahul@gmail.com', password: 'password123', role: 'Tenant' },
      { name: 'Priya Desai', email: 'priya@gmail.com', password: 'password123', role: 'Tenant' },
      { name: 'Amit Patel', email: 'amit@gmail.com', password: 'password123', role: 'Tenant' },
      { name: 'Neha Singh', email: 'neha@gmail.com', password: 'password123', role: 'Tenant' },
    ];
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING`,
        [user.name, user.email, hashedPassword, user.role]
      );
      console.log(`  ✓ Created user: ${user.name} (${user.role})`);
    }

    // Get landlord email (aarthi@gmail.com)
    const landlordEmail = 'aarthi@gmail.com';

    // 1. Create properties for the landlord
    console.log('Adding properties...');
    const propertyIds = [];
    const properties = [
      { title: 'Sunset Apartment', location: '123 Main St, Downtown', rent: 50000 },
      { title: 'Ocean View Villa', location: '456 Beach Rd, Seaside', rent: 120000 },
      { title: 'Tech Hub Studio', location: '789 Silicon Valley, Tech Park', rent: 25000 }
    ];

    for (const prop of properties) {
      const result = await db.query(
        `INSERT INTO properties (landlord_email, title, location, rent, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [landlordEmail, prop.title, prop.location, prop.rent, 'occupied']
      );
      propertyIds.push(result.rows[0].id);
      console.log(`  ✓ Created property: ${prop.title}`);
    }

    // 2. Create tenants and assign to properties
    console.log('Adding tenants...');
    const tenantIds = [];
    const tenants = [
      { full_name: 'Rahul Sharma', email: 'rahul@gmail.com', property_id: propertyIds[0] },
      { full_name: 'Priya Desai', email: 'priya@gmail.com', property_id: propertyIds[0] },
      { full_name: 'Amit Patel', email: 'amit@gmail.com', property_id: propertyIds[1] },
      { full_name: 'Neha Singh', email: 'neha@gmail.com', property_id: propertyIds[2] }
    ];

    for (const tenant of tenants) {
      // Find user for this tenant
      const user = users.find(u => u.email === tenant.email);
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const result = await db.query(
        `INSERT INTO tenants (full_name, email, password, property_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [tenant.full_name, tenant.email, hashedPassword, tenant.property_id]
      );
      tenantIds.push(result.rows[0].id);
      console.log(`  ✓ Created tenant: ${tenant.full_name}`);
    }

    // 3. Create payments
    console.log('Adding payments...');
    const payments = [
      { tenant_id: tenantIds[0], property_id: propertyIds[0], amount: 50000, status: 'Paid', due_date: '2025-01-15', paid_date: '2025-01-15' },
      { tenant_id: tenantIds[1], property_id: propertyIds[0], amount: 50000, status: 'Paid', due_date: '2025-01-18', paid_date: '2025-01-18' },
      { tenant_id: tenantIds[2], property_id: propertyIds[1], amount: 120000, status: 'Paid', due_date: '2025-01-10', paid_date: '2025-01-10' },
      { tenant_id: tenantIds[3], property_id: propertyIds[2], amount: 25000, status: 'Pending', due_date: '2025-02-05', paid_date: null },
      { tenant_id: tenantIds[0], property_id: propertyIds[0], amount: 50000, status: 'Overdue', due_date: '2025-02-15', paid_date: null }
    ];

    for (const payment of payments) {
      await db.query(
        `INSERT INTO payments (tenant_id, property_id, amount, status, due_date, paid_date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [payment.tenant_id, payment.property_id, payment.amount, payment.status, payment.due_date, payment.paid_date]
      );
      console.log(`  ✓ Created payment: Tenant #${payment.tenant_id} - ₹${payment.amount} (${payment.status})`);
    }

    // 4. Create maintenance requests
    console.log('Adding maintenance requests...');
    const maintenance = [
      { tenant_id: tenantIds[0], property_id: propertyIds[0], title: 'Leaky Faucet', description: 'Bathroom faucet dripping constantly', priority: 'Low', status: 'Pending' },
      { tenant_id: tenantIds[2], property_id: propertyIds[1], title: 'Air Conditioner Not Working', description: 'AC unit making unusual noise and not cooling', priority: 'Urgent', status: 'In Progress' },
      { tenant_id: tenantIds[1], property_id: propertyIds[0], title: 'Broken Door Lock', description: 'Main entrance lock stuck', priority: 'Urgent', status: 'Pending' },
      { tenant_id: tenantIds[3], property_id: propertyIds[2], title: 'Electrical Issue', description: 'Lights flickering in bedroom', priority: 'Medium', status: 'Completed' }
    ];

    for (const req of maintenance) {
      await db.query(
        `INSERT INTO maintenance_requests (tenant_id, property_id, title, description, priority, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [req.tenant_id, req.property_id, req.title, req.description, req.priority, req.status]
      );
      console.log(`  ✓ Created maintenance: ${req.title} (${req.priority})`);
    }

    // 5. Create leases
    console.log('Adding leases...');
    const leases = [
      { tenant_id: tenantIds[0], property_id: propertyIds[0], filename: 'lease_rahul.pdf', file_url: '/docs/lease_rahul.pdf', expiry_date: '2025-12-31', status: 'Active' },
      { tenant_id: tenantIds[2], property_id: propertyIds[1], filename: 'lease_amit.pdf', file_url: '/docs/lease_amit.pdf', expiry_date: '2025-06-14', status: 'Active' },
      { tenant_id: tenantIds[3], property_id: propertyIds[2], filename: 'lease_neha.pdf', file_url: '/docs/lease_neha.pdf', expiry_date: '2026-08-31', status: 'Active' }
    ];

    for (const lease of leases) {
      await db.query(
        `INSERT INTO lease_documents (tenant_id, property_id, filename, file_url, expiry_date, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [lease.tenant_id, lease.property_id, lease.filename, lease.file_url, lease.expiry_date, lease.status]
      );
      console.log(`  ✓ Created lease: ${lease.filename}`);
    }

    // 6. Create notifications
    console.log('Adding notifications...');
    const notifications = [
      { user_id: 1, title: 'Payment Received', message: 'Payment of ₹50,000 received from Rahul Sharma', type: 'payments', is_read: false },
      { user_id: 1, title: 'Maintenance Update', message: 'Air conditioner repair is in progress', type: 'maintenance', is_read: false },
      { user_id: 1, title: 'Payment Due', message: 'Payment from Neha Singh is now 5 days overdue', type: 'alerts', is_read: true }
    ];

    for (const notif of notifications) {
      await db.query(
        `INSERT INTO notifications (user_id, title, message, type, is_read)
         VALUES ($1, $2, $3, $4, $5)`,
        [notif.user_id, notif.title, notif.message, notif.type, notif.is_read]
      );
      console.log(`  ✓ Created notification: ${notif.title}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Properties: ${propertyIds.length}`);
    console.log(`   - Tenants: ${tenantIds.length}`);
    console.log(`   - Payments: ${payments.length}`);
    console.log(`   - Maintenance: ${maintenance.length}`);
    console.log(`   - Leases: ${leases.length}`);
    console.log(`   - Notifications: ${notifications.length}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    process.exit(1);
  }
}

seedDatabase();
