const router = express.Router();
const verifyToken = require('../../verifytoken');
const userController = require('../controllers/userController');

router.get('/getUser', verifyToken, userController.getUserInfo);
