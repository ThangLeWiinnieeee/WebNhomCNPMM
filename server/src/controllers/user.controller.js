import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';

const getProfile = async (req, res) => {
    try {
        const user = req.user;
        return res.json({ 
            code: 'success',
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                avatar: user.avatar,
                avatarID: user.avatarID,
                phone: user.phone,
                address: user.address,
                type: user.type
            }
        });
    } catch (error) {
        console.error("Lỗi profile", error);
        return res.json({ 
            code: 'error',
            message: 'Lỗi máy chủ'
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullname, phone, address, avatar, avatarID } = req.body;

        console.log('Update profile request:', { userId, fullname, phone, address, avatar, avatarID });

        const updateData = {};
        if (fullname) updateData.fullname = fullname;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (avatar) updateData.avatar = avatar;
        if (avatarID) updateData.avatarID = avatarID;

        console.log('Update data:', updateData);

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        console.log('Updated user:', updatedUser);

        if (!updatedUser) {
            return res.json({
                code: 'error',
                message: 'Không tìm thấy người dùng'
            });
        }

        return res.json({
            code: 'success',
            message: 'Cập nhật thông tin thành công',
            user: {
                _id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                avatarID: updatedUser.avatarID,
                phone: updatedUser.phone,
                address: updatedUser.address,
                type: updatedUser.type
            }
        });
    } catch (error) {
        console.error("Lỗi cập nhật profile", error);
        return res.json({
            code: 'error',
            message: 'Lỗi khi cập nhật thông tin'
        });
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.json({
                code: 'error',
                message: 'Vui lòng nhập đầy đủ thông tin'
            });
        }

        // Kiểm tra độ dài mật khẩu mới
        if (newPassword.length < 6) {
            return res.json({
                code: 'error',
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
            });
        }

        // Tìm user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({
                code: 'error',
                message: 'Không tìm thấy người dùng'
            });
        }

        // Kiểm tra user có đăng nhập bằng Google không
        if (user.type === 'loginGoogle') {
            return res.json({
                code: 'error',
                message: 'Tài khoản đăng nhập bằng Google không thể đổi mật khẩu'
            });
        }

        // Kiểm tra mật khẩu hiện tại
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.json({
                code: 'error',
                message: 'Mật khẩu hiện tại không đúng'
            });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu
        user.password = hashedPassword;
        await user.save();

        return res.json({
            code: 'success',
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        console.error("Lỗi đổi mật khẩu", error);
        return res.json({
            code: 'error',
            message: 'Lỗi khi đổi mật khẩu'
        });
    }
}

export default { getProfile, updateProfile, changePassword };