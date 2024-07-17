// Diary 모델을 가져옵니다.
const Diary = require('../models/Diary');

// 일기 생성 함수
exports.createDiary = async (req, res) => {
    // 요청 본문에서 title과 imageUrl을 가져옵니다.
    const { title, imageUrl } = req.body;
    try {
        // 새로운 일기를 생성합니다.
        const diary = await Diary.create({ title, imageUrl, userId: req.userId });
        // 생성된 일기의 정보를 응답으로 보냅니다.
        res.status(201).json(diary);
    } catch (err) {
        // 에러가 발생하면 콘솔에 출력하고 500 상태 코드로 응답합니다.
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// 월별 일기 조회 함수
exports.getDiariesByMonth = async (req, res) => {
    // 요청 쿼리에서 month를 가져옵니다.
    const { month } = req.query;
    try {
        // 주어진 월에 해당하는 일기를 찾습니다.
        const diaries = await Diary.findAll({
            where: {
                userId: req.userId,
                createdAt: {
                    [Op.gte]: new Date(`${month}-01`),
                    [Op.lt]: new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)
                }
            }
        });
        // 찾은 일기들을 응답으로 보냅니다.
        res.json(diaries);
    } catch (err) {
        // 에러가 발생하면 콘솔에 출력하고 500 상태 코드로 응답합니다.
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
