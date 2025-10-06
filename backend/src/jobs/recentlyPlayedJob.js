const cron = require('node-cron');
const spotifyController = require('../controllers/spotifyController');

cron.schedule('*/2 * * * *', () => {
  spotifyController.fetchRecentsForAllUsers();
});
