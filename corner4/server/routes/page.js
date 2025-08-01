const express = require('express');
const { renderProfile, renderJoin, renderMain } = require('../controllers/page');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// 회원가입한 목록 가져올거야
const User = require('../models/user');

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    next();
  });


  // 사용자 목록 표시할 라우더 연결
//   router.get('/layout', isLoggedIn, async (req, res, next) => {
//     try {
//       const users = await User.findAll({ attributes: ['nick'] }); // 사용자 목록 조회
//       console.log('회원 목록:', users); 
//       res.render('layout', { users, user: req.user }); // 템플릿에 전달
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   });
// router.get('/layout', isLoggedIn, async (req, res, next) => {
//     try {
//       const users = await User.findAll({ attributes: ['nick'] });
//       const userNicknames = users.map(user => user.nick);  // 실제 닉네임만 추출
//       console.log('회원 목록:', userNicknames); 
//       res.render('layout', { users: userNicknames, user: req.user }); // 템플릿에 전달
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   });

const usersRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

router.get('/users', usersRateLimiter, (req, res) => {
    User.findAll()
      .then(users => {
        console.log(users);  // 여기서 출력되는 데이터를 확인
        res.render('users', { users });  // 'users' 템플릿에 전달
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("서버 오류");
      });
  });
  
  

router.get('/profile', isLoggedIn, renderProfile);

router.get('/join', isNotLoggedIn, renderJoin);

router.get('/', renderMain);

module.exports = router;
