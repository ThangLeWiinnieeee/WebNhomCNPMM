module.exports.getProfile = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Lỗi profile",error);
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
}