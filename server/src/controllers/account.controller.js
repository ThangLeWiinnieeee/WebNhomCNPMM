const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const account = require('../models/account.model');

module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await account.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email hoặc Mật khẩu không đúng' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Email hoặc Mật khẩu không đúng' });
        }
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Trả về đúng định dạng mà Login.js mong muốn
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
}