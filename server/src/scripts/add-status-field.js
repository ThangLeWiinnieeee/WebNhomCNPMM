/**
 * Migration Script: Add status field to all existing users
 * Run this script once to add status field to all users in database
 * 
 * Usage: node src/scripts/add-status-field.js
 */

import mongoose from 'mongoose';
import userModel from '../models/user.model.js';
import databaseConfig from '../config/database.config.js';
import 'dotenv/config';

const addStatusField = async () => {
  try {
    console.log('🔄 Đang kết nối database...');
    await databaseConfig.connectDatabase();
    
    console.log('🔄 Bắt đầu thêm trường status cho tất cả users...');
    
    // Update tất cả users chưa có status field
    const result = await userModel.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'active' } }
    );
    
    console.log(`✅ Đã cập nhật ${result.modifiedCount} users`);
    console.log(`📊 Tổng số users đã kiểm tra: ${result.matchedCount}`);
    
    // Kiểm tra kết quả
    const totalUsers = await userModel.countDocuments();
    const activeUsers = await userModel.countDocuments({ status: 'active' });
    const suspendedUsers = await userModel.countDocuments({ status: 'suspended' });
    const inactiveUsers = await userModel.countDocuments({ status: 'inactive' });
    
    console.log('\n📈 Thống kê sau khi cập nhật:');
    console.log(`   - Tổng số users: ${totalUsers}`);
    console.log(`   - Đang hoạt động: ${activeUsers}`);
    console.log(`   - Tạm dừng: ${suspendedUsers}`);
    console.log(`   - Ngừng hoạt động: ${inactiveUsers}`);
    
    console.log('\n✅ Migration hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi migration:', error);
    process.exit(1);
  }
};

// Run migration
addStatusField();
