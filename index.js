import { exec } from 'child_process';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

const remoteHost = process.env.REMOTE_HOST;
const remoteUser = process.env.REMOTE_USER;
const remoteDirectory = process.env.REMOTE_DIRECTORY;
const sourcefile = process.env.SOURCE_FILE;

const copyToRemote = () => {
    const command = `scp -r -v ${sourcefile} ${remoteUser}@${remoteHost}:${remoteDirectory}`;

    const childProcess = exec(command, { env: { ...process.env } });

    childProcess.stdout.on('data', (data) => {
        // Example output: 100% 105MB  20.0MB/s   00:05
        const match = data.match(/(\d+)%/);
        if (match) {
            const percentage = parseInt(match[1], 10);
            console.log(`File transfer progress: ${percentage}%`);
        }
        console.log(`stdout: ${data}`);
    });

    childProcess.stderr.on('data', (data) => {
        // console.error(`stderr: ${data}`);
    });

    childProcess.on('close', (code) => {
        if (code === 0) {
            console.log('File transfer successful');
        } else {
            console.error(`scp process exited with code ${code}`);
        }
    });
};


// cron.schedule('0 * * * *', () => {
//     console.log('Starting file transfer...');
//     copyToRemote().then(() => {
//         console.log('File transfer job completed.');
//     });
// });

copyToRemote();

// Schedule the cron job to run the copyToRemote function every day at 2 am
// cron.schedule('0 2 * * *', () => {
//     console.log('Running copyToRemote function...');
//     copyToRemote();
// });