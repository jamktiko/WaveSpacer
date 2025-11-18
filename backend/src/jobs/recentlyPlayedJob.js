const cron = require('node-cron');
const spotifyController = require('../controllers/spotifyController');

function startCronJobs() {
  if (process.env.NODE_ENV === 'development') {
    cron.schedule('*/1 * * * *', async () => {
      console.log('Ajetaan cron: fetchRecentsForAllUsers()');
      const result = await spotifyController.fetchRecentsForAllUsers();
      console.log('Cron valmis:', result);
    });
  } else {
    cron.schedule('0 * * * *', async () => {
      console.log('Ajetaan cron: fetchRecentsForAllUsers()');
      const result = await spotifyController.fetchRecentsForAllUsers();
      console.log('Cron valmis:', result);
    });
  }
}

module.exports = { startCronJobs };
