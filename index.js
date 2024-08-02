// 필수 모듈 및 패키지
const express = require("express");
const session = require('express-session');
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require('path');
const bcrypt = require('bcrypt');
const MySQLStore = require('express-mysql-session')(session);
const db = require("./config/mysql");
const sessionOption = require('./config/sessionOption'); // 세션 옵션 파일
const base64Img = require('base64-img'); // base64를 이미지 파일로 변환하기 위한 패키지

// 초기 설정
const app = express();
// 데이터베이스 연결 확인
db.connect();

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' })); // Increase body size limit if necessary
app.use(cors());
app.use(bodyParser.json());

// 세션 설정
const sessionStore = new MySQLStore(sessionOption);
app.use(session({
    key: 'session_cookie_name',
    secret: '~',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

const saveImage = (imageData, filename) => {
    const uploadsDir = path.join(__dirname, 'uploads');

    // 'uploads' 디렉터리가 존재하지 않으면 생성
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFile(filePath, imageData, 'base64', (err) => {
        if (err) {
            console.error('Error saving image file:', err);
        } else {
            console.log('Image saved successfully:', filePath);
        }
    });
};

// 'uploads' 디렉터리와 파일 경로를 로그로 확인
const uploadsDir = path.join(__dirname, 'uploads');
console.log('Uploads directory path:', uploadsDir);
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}


// 이미지 업로드 설정
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            const uploadDir = 'uploads';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            callback(null, uploadDir);
        },
        filename: function (req, file, callback) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            callback(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
});

// 정적 파일 제공 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 포트 설정
app.set("port", process.env.PORT || 3000); // 포트 설정
app.set("host", process.env.HOST || "0.0.0.0"); // 아이피 설정

// React 앱의 정적 파일 제공
app.use(express.static(path.join(__dirname, 'dist')));

  
// 예시로 백엔드 서버에서 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));

// 로그인 체크
app.get('/api/authcheck', (req, res) => {
    const sendData = { isLogin: req.session.is_logined ? "True" : "False" };
    res.json(sendData);
});

// 로그아웃
app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Session destruction error:", err);
            return res.status(500).send("Error during logout");
        }
        res.redirect('/');
    });
});

// 로그인
app.post("/api/login", (req, res) => { // 데이터 받아서 결과 전송
    const username = req.body.userId;
    const password = req.body.userPassword;
    const sendData = { isLogin: "" };

    if (username && password) {             // id와 pw가 입력되었는지 확인
        db.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.      

                bcrypt.compare(password, results[0].password, (err, result) => {    // 입력된 비밀번호가 해시된 저장값과 같은 값인지 비교

                    if (result === true) {                  // 비밀번호가 일치하면
                        req.session.is_logined = true;      // 세션 정보 갱신
                        req.session.nickname = username;
                        req.session.userId = results[0].id; // userId 저장
                        req.session.save(function () {
                            sendData.isLogin = "True"
                            res.send(sendData);
                        });
                    }
                    else {                                   // 비밀번호가 다른 경우
                        sendData.isLogin = "로그인 정보가 일치하지 않습니다."
                        res.send(sendData);
                    }
                })
            } else {    // db에 해당 아이디가 없는 경우
                sendData.isLogin = "아이디 정보가 일치하지 않습니다."
                res.send(sendData);
            }
        });
    } else {            // 아이디, 비밀번호 중 입력되지 않은 값이 있는 경우
        sendData.isLogin = "아이디와 비밀번호를 입력하세요!"
        res.send(sendData);
    }
});

// 회원가입
app.post("/api/signup", async (req, res) => {
    const { userId: username, userPassword: password, userPassword2: password2 } = req.body;
    const sendData = { isSuccess: "" };

    if (username && password && password2) {
        db.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && password == password2) {         // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우
                const hasedPassword = bcrypt.hashSync(password, 10);    // 입력된 비밀번호를 해시한 값
                db.query('INSERT INTO users (username, password) VALUES(?,?)', [username, hasedPassword], function (error, data) {
                    if (error) throw error;
                    req.session.save(function () {
                        sendData.isSuccess = "True"
                        res.send(sendData);
                    });
                });
            } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우                  
                sendData.isSuccess = "입력된 비밀번호가 서로 다릅니다."
                res.send(sendData);
            }
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우            
                sendData.isSuccess = "이미 존재하는 아이디 입니다!"
                res.send(sendData);
            }
        });
    } else {
        sendData.isSuccess = "아이디와 비밀번호를 입력하세요!"
        res.send(sendData);
    }
});

const ensureAuthenticated = (req, res, next) => {
    if (req.session.is_logined) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

app.get("/api/feed", ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const sql = 'SELECT title, imageUrl, date FROM diary WHERE userId = ? ORDER BY date DESC';
        db.query(sql, [userId], (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).send('Database error');
            }
            res.json(results);
        });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).send('Server error');
    }
});


// 특정 월의 일기 목록에서 이미지만 가져오기
app.get('/api/calender/:year/:month',  ensureAuthenticated, async (req, res) => {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    const startDate2 = new Date(Date.UTC(year, month - 1, 1));
    const endDate2 = new Date(Date.UTC(year, month, 0, 23, 59, 59)); // month의 마지막 날
    console.log(startDate2);
    console.log(endDate2);

    const userId = req.session.userId; // 현재 로그인한 사용자의 ID

    const query = `
        SELECT date, imageUrl 
        FROM diary 
        WHERE userId = ? AND date >= ? AND date <= ? 
        ORDER BY date DESC
    `;

    db.query(query, [userId, startDate2, endDate2], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Server Error');
        }
        res.json(results);
    });
});

app.post('/api/create', ensureAuthenticated, async (req, res) => {
    try {
        const title = req.body.title || "No title";
        const imageData = req.body.imageUrl;
        const userId = req.session.userId; // 로그인한 사용자의 ID를 세션에서 가져오기

        if (!imageData) {
            return res.status(400).json({ error: 'No image data provided.' });
        }

        // Base64 데이터를 파일로 저장
        const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
        const filename = 'drawing-' + Date.now() + '.png';
        const filePath = path.join(__dirname, 'uploads', 'drawing-' + Date.now() + '.png');

        // 파일 저장
        fs.writeFile(filePath, base64Data, 'base64', async (err) => {
            if (err) {
                console.error('Error saving image file:', err);
                return res.status(500).json({ error: 'Error saving image.' });
            }

            const imageUrl = '/uploads/' + path.basename(filePath);
            const localDate = new Date();

            // 데이터베이스에 저장
            try {
                const sql = 'INSERT INTO diary (userId, title, date, imageUrl) VALUES (?, ?, ?, ?)';
                await db.query(sql, [userId, title, localDate, imageUrl]);
                res.status(201).json({ message: 'Diary entry created successfully!', imageUrl });
            } catch (dbError) {
                console.error('Error saving to database:', dbError);
                res.status(500).json({ error: 'Error saving to database.' });
            }
        });
    } catch (error) {
        console.error('Error processing entry:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// 모든 다른 요청을 React 앱으로 라우팅
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

app.listen(app.get("port"), app.get("host"), () =>
    console.log(`Server is running on: ${app.get("host")}:${app.get("port")}`)
);

