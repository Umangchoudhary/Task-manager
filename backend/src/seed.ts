import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Project from './models/Project';
import Task from './models/Task';
import connectDB from './config/db';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'Admin',
      },
      {
        name: 'Demo Member',
        email: 'member@example.com',
        password: 'password123',
        role: 'Member',
      },
    ]);

    const adminUser = createdUsers[0]._id;
    const memberUser = createdUsers[1]._id;

    const createdProjects = await Project.insertMany([
      {
        title: 'Alpha Release',
        description: 'First version of our SaaS application.',
        createdBy: adminUser,
        teamMembers: [memberUser],
      },
      {
        title: 'Marketing Campaign',
        description: 'Q3 marketing efforts and ad creatives.',
        createdBy: adminUser,
        teamMembers: [adminUser, memberUser],
      },
    ]);

    await Task.insertMany([
      {
        title: 'Design Dashboard UI',
        description: 'Create wireframes and glassmorphism elements.',
        projectId: createdProjects[0]._id,
        assignedTo: adminUser,
        status: 'Completed',
        priority: 'High',
        createdBy: adminUser,
      },
      {
        title: 'Setup MongoDB Atlas',
        description: 'Configure cloud database and environment variables.',
        projectId: createdProjects[0]._id,
        assignedTo: memberUser,
        status: 'In Progress',
        priority: 'High',
        createdBy: adminUser,
      },
      {
        title: 'Write Demo Script',
        description: 'Draft the video script for the product launch.',
        projectId: createdProjects[1]._id,
        assignedTo: memberUser,
        status: 'Pending',
        priority: 'Medium',
        createdBy: adminUser,
      },
    ]);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
