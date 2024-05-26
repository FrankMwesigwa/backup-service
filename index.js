import { exec } from 'child_process';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

const remoteHost = process.env.REMOTE_HOST;
const remoteUser = process.env.REMOTE_USER;
const remoteDirectory = process.env.REMOTE_DIRECTORY;
const sourcefile = process.env.SOURCE_FILE;

const copyToRemote = () => {
    const command = `scp -r ${sourcefile} ${remoteUser}@${remoteHost}:${remoteDirectory}`;

    exec(command, { env: { ...process.env } }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log('File transfer successful:');
        console.error(`stderr: ${stderr}`);
    });
};

copyToRemote();

// Schedule the cron job to run the copyToRemote function every day at 2 am
// cron.schedule('0 2 * * *', () => {
//     console.log('Running copyToRemote function...');
//     copyToRemote();
// });