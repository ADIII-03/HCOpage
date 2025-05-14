const projectRoutes = require('./routes/projectRoutes');
const donationRoutes = require('./routes/donationRoutes');

// Routes
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/donation-details', donationRoutes); 