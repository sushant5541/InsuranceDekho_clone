const Admin = require('../models/Admin');

const seedAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
        if (!existingAdmin) {
            const newAdmin = new Admin({
                email: 'admin@gmail.com',
                password: 'Admin@123'
            });
            await newAdmin.save();
            console.log('Default admin created');
        } else {
            console.log('Admin already exists');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

module.exports = seedAdmin;

