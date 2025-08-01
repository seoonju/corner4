// const express = require('express');

// const router = express.Router();

// // GET /user 라우터
// router.get('/', (req, res) => {
//   res.send('Hello, User');
// });

// module.exports = router;


const express = require('express');
const rateLimit = require('express-rate-limit'); // Import rate limiting middleware

const { isLoggedIn } = require('../middlewares');
const { follow } = require('../controllers/user');
const { User } = require('../models');

const router = express.Router();

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// POST /user/:id/follow
router.post('/:id/follow', isLoggedIn, limiter, follow);

// 닉네임 목록 뜨게
// router.get('/mypage', isLoggedIn, async (req, res, next) => {
//   try {
//     const users = await User.findAll({ attributes: ['nick'] }); // 닉네임만 조회
//     console.log(users); // 콘솔에 출력해서 데이터 확인
//     res.render('mypage', { users, user: req.user }); // 템플릿에 전달
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

// const express = require('express');
// const { User } = require('../models');  // User 모델을 가져옵니다.
// const router = express.Router();

// 모든 사용자 목록 조회 (로그인한 경우에만 접근 가능)

router.get('/list', isLoggedIn, limiter, async (req, res, next) => {
  try {
    const users = await User.findAll();  // User 테이블에서 모든 사용자 조회
    res.render('layout', {  // layout.html 템플릿에 users 배열 전달
      title: '회원 목록',  // 페이지 타이틀
      users: users,      // 조회한 사용자 목록
      user: req.user      // 로그인한 사용자 정보
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;



module.exports = router;
