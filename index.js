import cron from 'node-cron';
import dotenv from 'dotenv';
import Client from 'ssh2-sftp-client';

dotenv.config();

const remoteHost = process.env.REMOTE_HOST;
const remoteUser = process.env.REMOTE_USER;
const remoteDirectory = process.env.REMOTE_DIRECTORY;
const sourcefile = process.env.SOURCE_FILE;

const sftp = new Client();

const copyToRemote = async () => {
    try {
        await sftp.connect({
            host: remoteHost,
            port: 22,
            username: remoteUser,
        });

        sftp.on('upload', (info) => {
            const transferred = info.bytesTransferred;
            const total = info.size;
            const percentage = ((transferred / total) * 100).toFixed(2);
            console.log(`Transfer progress: ${percentage}%`);
        });

        await sftp.fastPut(sourcefile, `${remoteDirectory}/${sourcefile.split('/').pop()}`);
        console.log('File transfer successful');
    } catch (err) {
        console.error('Error during file transfer:', err.message);
    } finally {
        sftp.end();
    }
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