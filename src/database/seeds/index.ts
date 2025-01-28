import dbConnection from '../config/config';
import seedUsers from './users';

dbConnection().then(async () => {
    await seedUsers();
    process.exit()
})
