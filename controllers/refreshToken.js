import Users from '../models/user-model.js';
import jwt from 'jsonwebtoken';

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const id = user[0].id;
            const username = user[0].username;
            const email = user[0].email;
            const accessToken = jwt.sign({id, username, email}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30m'
            });
            return res.status(200).json({ id, username, email, accessToken });
        });
    } catch (err) {
        return console.log(err);
    }
}
