// jwt 모듈을 가져옵니다.
const jwt = require('jsonwebtoken');

// 인증 미들웨어
module.exports = (req, res, next) => {
    // 요청 헤더에서 Authorization 토큰을 가져옵니다.
    const token = req.headers['authorization'];
    // 토큰이 없으면 401 상태 코드로 응답합니다.
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // JWT 토큰을 검증합니다.
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        // 토큰이 유효하지 않으면 401 상태 코드로 응답합니다.
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // 유저 ID를 요청 객체에 저장하고 다음 미들웨어로 넘어갑니다.
        req.userId = decoded.id;
        next();
    });
};
