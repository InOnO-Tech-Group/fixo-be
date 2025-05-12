import dbConnection from '../config/config';
import seedIncomTracker from './systemIncomes';
import seedUsers from './users';

dbConnection().then(async () => {
    await seedUsers();
    await seedIncomTracker()
    process.exit()
})
