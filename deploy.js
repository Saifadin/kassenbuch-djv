const FtpDeploy = require('ftp-deploy');
const path = require('path');

const ftpDeploy = new FtpDeploy();

const config = {
  username: 'osamah@aldoaiss.com',
  host: 'aldoaiss.de',
  // port: 21,
  localRoot: path.join(__dirname, '/build/'),
  remoteRoot: '/kassenbuch/',
  exclude: ['.git', '.idea', '.DS_STORE'],
};

ftpDeploy.deploy(config, (err) => {
  if (err) console.log(err);
  else console.log('finished');
});

ftpDeploy.on('uploading', (data) => {
  console.log(data.totalFileCount);       // total file count being transferred
  console.log(data.transferredFileCount); // number of files transferred
  console.log(data.percentComplete);      // percent as a number 1 - 100
  console.log(data.filename);             // partial path with filename being uploaded
});
