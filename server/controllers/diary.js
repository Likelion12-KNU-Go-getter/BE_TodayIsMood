const Diary = require('../models/Diary');

exports.createDiary = async (req, res) => {
    const { title, image } = req.body;

    try {
        const diary = await Diary.create({
            userId: req.user.id,
            title,
            image,
        });
        res.send(diary);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getDiaries = async (req, res) => {
    try {
        const diaries = await Diary.findAll({ where: { userId: req.user.id } });
        res.send(diaries);
    } catch (err) {
        res.status(400).send(err);
    }
};
