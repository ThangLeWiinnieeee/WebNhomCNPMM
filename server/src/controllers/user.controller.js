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
                phone: user.phone
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

export default { getProfile };