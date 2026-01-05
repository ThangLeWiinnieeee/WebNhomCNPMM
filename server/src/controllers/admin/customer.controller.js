import userModel from '../../models/user.model.js';
import orderModel from '../../models/order.model.js';
import userPointsModel from '../../models/user-points.model.js';

/**
 * Admin Customer Controller
 * Quản lý thông tin khách hàng (users với role = 'user')
 */

/**
 * Lấy danh sách tất cả khách hàng
 * @route GET /admin/customers
 * @query {Number} page - Trang hiện tại (default: 1)
 * @query {Number} limit - Số lượng khách hàng mỗi trang (default: 10)
 * @query {String} search - Tìm kiếm theo tên, email, hoặc số điện thoại
 * @query {String} sortBy - Sắp xếp theo trường (default: createdAt)
 * @query {String} sortOrder - Thứ tự sắp xếp: asc/desc (default: desc)
 * @returns {Object} Danh sách khách hàng và thông tin phân trang
 */
const getAllCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    // Tạo query tìm kiếm
    const query = { role: 'user' }; // Chỉ lấy khách hàng, không lấy admin
    
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Đếm tổng số khách hàng
    const totalCustomers = await userModel.countDocuments(query);

    // Lấy danh sách khách hàng
    const customers = await userModel
      .find(query)
      .select('-password') // Không trả về password
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    // Lấy thông tin thêm cho mỗi khách hàng (số đơn hàng, tổng chi tiêu, điểm)
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        // Đếm số đơn hàng
        const orderCount = await orderModel.countDocuments({
          userId: customer._id,
          paymentStatus: 'completed'
        });

        // Tính tổng chi tiêu
        const orders = await orderModel.find({
          userId: customer._id,
          paymentStatus: 'completed'
        });
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        // Lấy điểm tích lũy
        const pointsData = await userPointsModel.findOne({ userId: customer._id });
        const points = pointsData ? pointsData.points : 0;

        // Tính đơn hàng gần nhất
        const lastOrder = await orderModel
          .findOne({ userId: customer._id })
          .sort({ createdAt: -1 })
          .select('createdAt');

        return {
          ...customer,
          orderCount,
          totalSpent,
          points,
          lastOrderDate: lastOrder ? lastOrder.createdAt : null,
        };
      })
    );

    // Tính tổng số trang
    const totalPages = Math.ceil(totalCustomers / limit);

    res.json({
      success: true,
      customers: customersWithStats,
      pagination: {
        currentPage: page,
        totalPages,
        totalCustomers,
        limit,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách khách hàng',
      error: error.message,
    });
  }
};

/**
 * Lấy chi tiết một khách hàng
 * @route GET /admin/customers/:id
 * @param {String} id - ID khách hàng
 * @returns {Object} Thông tin chi tiết khách hàng
 */
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await userModel
      .findOne({ _id: id, role: 'user' })
      .select('-password')
      .lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng',
      });
    }

    // Lấy danh sách đơn hàng
    const orders = await orderModel
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .populate('items.serviceId', 'name price images')
      .lean();

    // Tính tổng chi tiêu
    const completedOrders = orders.filter(order => order.paymentStatus === 'completed');
    const totalSpent = completedOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // Lấy điểm tích lũy
    const pointsData = await userPointsModel.findOne({ userId: id });
    const points = pointsData ? pointsData.points : 0;

    res.json({
      success: true,
      customer: {
        ...customer,
        orderCount: completedOrders.length,
        totalSpent,
        points,
        orders,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết khách hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin khách hàng',
      error: error.message,
    });
  }
};

/**
 * Cập nhật thông tin khách hàng
 * @route PUT /admin/customers/:id
 * @param {String} id - ID khách hàng
 * @body {String} fullname - Tên đầy đủ
 * @body {String} email - Email
 * @body {String} phone - Số điện thoại
 * @body {String} address - Địa chỉ
 * @body {String} status - Trạng thái tài khoản (active, suspended, inactive)
 * @returns {Object} Thông tin khách hàng đã cập nhật
 */
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, phone, address, status } = req.body;

    // Kiểm tra khách hàng tồn tại
    const customer = await userModel.findOne({ _id: id, role: 'user' });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng',
      });
    }

    // Kiểm tra email trùng lặp (nếu thay đổi email)
    if (email && email !== customer.email) {
      const existingEmail = await userModel.findOne({ email, _id: { $ne: id } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email đã tồn tại',
        });
      }
    }

    // Kiểm tra số điện thoại trùng lặp (nếu thay đổi)
    if (phone && phone !== customer.phone) {
      const existingPhone = await userModel.findOne({ phone, _id: { $ne: id } });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại đã tồn tại',
        });
      }
    }

    // Kiểm tra giá trị status hợp lệ
    if (status && !['active', 'suspended', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ. Chỉ chấp nhận: active, suspended, inactive',
      });
    }

    // Cập nhật thông tin
    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (status) updateData.status = status;

    const updatedCustomer = await userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password');

    res.json({
      success: true,
      message: 'Cập nhật thông tin khách hàng thành công',
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật khách hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật khách hàng',
      error: error.message,
    });
  }
};

/**
 * Xóa khách hàng (soft delete hoặc hard delete)
 * @route DELETE /admin/customers/:id
 * @param {String} id - ID khách hàng
 * @returns {Object} Thông báo xóa thành công
 */
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra khách hàng tồn tại
    const customer = await userModel.findOne({ _id: id, role: 'user' });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng',
      });
    }

    // Kiểm tra xem khách hàng có đơn hàng không
    const orderCount = await orderModel.countDocuments({ userId: id });
    
    if (orderCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa khách hàng đã có đơn hàng. Vui lòng xem xét vô hiệu hóa tài khoản thay vì xóa.',
      });
    }

    // Xóa khách hàng
    await userModel.findByIdAndDelete(id);

    // Xóa dữ liệu liên quan (điểm, wishlist, v.v.)
    await userPointsModel.deleteOne({ userId: id });

    res.json({
      success: true,
      message: 'Xóa khách hàng thành công',
    });
  } catch (error) {
    console.error('Lỗi khi xóa khách hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa khách hàng',
      error: error.message,
    });
  }
};

/**
 * Lấy thống kê khách hàng
 * @route GET /admin/customers/stats
 * @returns {Object} Thống kê về khách hàng
 */
const getCustomerStats = async (req, res) => {
  try {
    // Tổng số khách hàng
    const totalCustomers = await userModel.countDocuments({ role: 'user' });

    // Khách hàng mới trong tháng này
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newCustomersThisMonth = await userModel.countDocuments({
      role: 'user',
      createdAt: { $gte: startOfMonth },
    });

    // Top khách hàng (theo tổng chi tiêu)
    const topCustomers = await orderModel.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
        },
      },
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          fullname: '$user.fullname',
          email: '$user.email',
          avatar: '$user.avatar',
          totalSpent: 1,
          orderCount: 1,
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalCustomers,
        newCustomersThisMonth,
        topCustomers,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê khách hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê',
      error: error.message,
    });
  }
};

/**
 * Thay đổi trạng thái tài khoản khách hàng
 * @route PATCH /admin/customers/:id/status
 * @param {String} id - ID khách hàng
 * @body {String} status - Trạng thái mới (active, suspended, inactive)
 * @returns {Object} Thông tin khách hàng đã cập nhật
 */
const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Kiểm tra status hợp lệ
    if (!status || !['active', 'suspended', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ. Chỉ chấp nhận: active (đang hoạt động), suspended (tạm dừng), inactive (ngừng hoạt động)',
      });
    }

    // Kiểm tra khách hàng tồn tại
    const customer = await userModel.findOne({ _id: id, role: 'user' });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng',
      });
    }

    // Cập nhật trạng thái
    customer.status = status;
    await customer.save();

    const statusText = {
      active: 'đang hoạt động',
      suspended: 'tạm dừng',
      inactive: 'ngừng hoạt động'
    };

    res.json({
      success: true,
      message: `Đã chuyển trạng thái tài khoản sang ${statusText[status]}`,
      customer: {
        _id: customer._id,
        fullname: customer.fullname,
        email: customer.email,
        status: customer.status,
      },
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái khách hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật trạng thái',
      error: error.message,
    });
  }
};

export default {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
  updateCustomerStatus,
};
