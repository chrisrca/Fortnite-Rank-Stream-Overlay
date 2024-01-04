const http = require('http');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

const base = 'http://160.251.9.161:8080';
const fontPath = path.join(__dirname, 'font.ttf');
const icons = [
    'bronze_01.png', 'bronze_02.png', 'bronze_03.png',
    'silver_01.png', 'silver_02.png', 'silver_03.png',
    'gold_01.png', 'gold_02.png', 'gold_03.png',
    'platinum_01.png', 'platinum_02.png', 'platinum_03.png',
    'diamond_01.png', 'diamond_02.png', 'diamond_03.png',
    'Elite.png', 'Champion.png', 'Unreal.png'
];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Replace these with actual values or ways to get these values in Node.js
let account_id = '';
const ranking_type = 'ranked-br';
const port = 3000;
let percentage = 100;

async function update() {
    try {
        const response = await axios.get(`${base}/api/fortnite/rank/${account_id}`);
        const data = response.data;
        const entry = data
            .sort((a, b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated))
            .find(element => element.rankingType === ranking_type);

        if (!entry) {
            console.log('No data found for the given criteria.');
            return;
        }

        let index;
        if (entry.currentDivision >= 16) {
            index = Math.floor(15 / 3) + (entry.currentDivision - 16);
        } else {
            index = Math.floor(entry.currentDivision / 3);
        }

        const rankIcon = `src/icons/${icons[entry.currentDivision]}`;
        let rankBar = (`src/bars/${icons[entry.currentDivision]}`).replace(/(_01|_02|_03|.png)/g, ``)
        let progress;

        if (entry.currentPlayerRanking !== null) {
            progress = `${entry.currentPlayerRanking}${['st', 'nd', 'rd'][((entry.currentPlayerRanking + 90) % 100 - 10) % 10 - 1] || 'th'}`;
        } else {
            const value = Math.round(entry.promotionProgress * 100);
            progress = value;
        }
        return {rankIcon, rankBar, progress}
      } catch (error) {
        console.error("Error occurred:", error);
        return { rankIcon: null, rankName: null, progress: null };
    }
}

const server = http.createServer(async (req, res) => { // Make this callback async
  let percentage = 100
  let icon = ""
  if (req.url === '/') {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Refresh', '25'); 
      res.statusCode = 200;

      const rank = await update(); 
      // console.log(rank.rankIcon);
      // console.log(rank.progress);
      // console.log(rank.rankBar);

      percentage = rank.progress
      icon = rank.rankIcon

    let htmlContent = ``
    let convertedpercentage = percentage * 3.33;
    if (percentage == 0 && icon === "src/icons/bronze_01.png") { // Unranked
      htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
          @font-face { 
              font-family: "Burbank Big Condensed Bold"; 
              src: url('/font.ttf'); 
          }
          .container {
              background-size: cover;
              position: relative;
              text-align: center;
              color: rgb(255, 255, 255);
          }
          .text {
              position: absolute;
              font-size: 19px;
              left: 399px;
              top: 9px;
              font-family: "Burbank Big Condensed Bold", sans-serif;
              transform: scaleX(0.80);
              letter-spacing: 1px;
          }
          .image-container {
            position: relative;
            left: 50px
        }
        .precent {
            position: relative;
            left: 50px
        }
          .image-rank {
              position: absolute;
              top: -1px;
              left: 20px;
              z-index: 3;
              width: 44px;  
              height: 44px;
          }
          .image-percent {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
              width: 352px;
              height: 43px;
              clip-path: polygon(0 0, 342px 0, 342px 100%, 0 100%); /* Crop the width */
          }
  
          .image-transparent {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 0;
          }
  
          .image-current {
              position: absolute;
              top: 0;
              left: 0px;
              z-index: 3;
          }
      </style>
  </head>
      <body>
      <div>
      <div class="rank">
          <img class="image-rank" src="src/icons/Unranked.png">
      </div>
      
      <div class="image-container">
          <img class="image-current" src="src/bars/Unranked_current.png">
          <img class="image-percent" src="src/bars/Unranked_percentage.png">
          <img class="image-transparent" src="src/transparent.png">
      </div>
      <div class="percent">
          <div class="container"><div class="text"></div>
      </div>
  </div>
  </body>
  </html>
      `;
    } else if (percentage < 2.4) { // Prevent Bar from rendering incorrectly under 2.4%
      htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
          @font-face { 
              font-family: "Burbank Big Condensed Bold"; 
              src: url('/font.ttf'); 
          }
          .container {
              background-size: cover;
              position: relative;
              text-align: center;
              color: rgb(255, 255, 255);
          }
          .text {
              position: absolute;
              font-size: 19px;
              left: 399px;
              top: 9px;
              font-family: "Burbank Big Condensed Bold", sans-serif;
              transform: scaleX(0.80);
              letter-spacing: 1px;
          }
          .image-container {
            position: relative;
            left: 50px
        }
        .precent {
            position: relative;
            left: 50px
        }
          .image-rank {
              position: absolute;
              top: -1px;
              left: 20px;
              z-index: 3;
              width: 44px;  
              height: 44px;
          }
          .image-percent {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
              width: 352px;
              height: 43px;
              clip-path: polygon(0 0, ${9 + convertedpercentage}px 0, ${9 + convertedpercentage}px 100%, 0 100%); /* Crop the width */
          }
  
          .image-transparent {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 0;
          }
  
          .image-current {
              position: absolute;
              top: 0;
              left: ${0 - (342 - convertedpercentage - 9)}px;
              z-index: 3;
          }
      </style>
  </head>
      <body>
      <div>
      <div class="rank">
          <img class="image-rank" src="${icon}">
      </div>
      
      <div class="image-container">
          <img class="image-transparent" src="src/transparent.png">
      </div>
      <div class="percent">
          <div class="container"><div class="text">${percentage + '%'}</div>
      </div>
  </div>
  </body>
  </html>
      `;
    } else if (icon === "src/icons/Unreal.png") { // Unreal
      htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
          @font-face { 
              font-family: "Burbank Big Condensed Bold"; 
              src: url('/font.ttf'); 
          }
          .container {
              background-size: cover;
              position: relative;
              text-align: center;
              color: rgb(255, 255, 255);
          }
          .text {
              position: absolute;
              font-size: 19px;
              left: 399px;
              top: 9px;
              font-family: "Burbank Big Condensed Bold", sans-serif;
              transform: scaleX(0.80);
              letter-spacing: 1px;
          }
          .image-container {
            position: relative;
            left: 50px
        }
        .precent {
            position: relative;
            left: 50px
        }
          .image-rank {
              position: absolute;
              top: -1px;
              left: 20px;
              z-index: 3;
              width: 44px;  
              height: 44px;
          }
          .image-percent {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
              width: 352px;
              height: 43px;
              clip-path: polygon(0 0, ${9 + convertedpercentage}px 0, ${9 + convertedpercentage}px 100%, 0 100%); /* Crop the width */
          }
  
          .image-transparent {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 0;
          }
  
          .image-current {
              position: absolute;
              top: 0;
              left: ${0 - (342 - convertedpercentage - 9)}px;
              z-index: 3;
          }
      </style>
  </head>
      <body>
      <div>
      <div class="rank">
          <img class="image-rank" src="${icon}">
      </div>
      
      <div class="image-container">
          <img class="image-current" src="${rank.rankBar}_current.png">
          <img class="image-percent" src="${rank.rankBar}_percentage.png">
          <img class="image-transparent" src="src/transparent.png">
      </div>
      <div class="percent">
          <div class="container"><div class="text">${percentage}</div>
      </div>
  </div>
  </body>
  </html>
      `;
    } else { // Render Rank and Bar
      htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
          @font-face { 
              font-family: "Burbank Big Condensed Bold"; 
              src: url('/font.ttf'); 
          }
          .container {
              background-size: cover;
              position: relative;
              text-align: center;
              color: rgb(255, 255, 255);
          }
          .text {
              position: absolute;
              font-size: 19px;
              left: 399px;
              top: 9px;
              font-family: "Burbank Big Condensed Bold", sans-serif;
              transform: scaleX(0.80);
              letter-spacing: 1px;
          }
          .image-container {
            position: relative;
            left: 50px
        }
        .precent {
            position: relative;
            left: 50px
        }
          .image-rank {
              position: absolute;
              top: -1px;
              left: 20px;
              z-index: 3;
              width: 44px;  
              height: 44px;
          }
          .image-percent {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
              width: 352px;
              height: 43px;
              clip-path: polygon(0 0, ${9 + convertedpercentage}px 0, ${9 + convertedpercentage}px 100%, 0 100%); /* Crop the width */
          }
  
          .image-transparent {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 0;
          }
  
          .image-current {
              position: absolute;
              top: 0;
              left: ${0 - (342 - convertedpercentage - 9)}px;
              z-index: 3;
          }
      </style>
  </head>
      <body>
      <div>
      <div class="rank">
          <img class="image-rank" src="${icon}">
      </div>
      
      <div class="image-container">
          <img class="image-current" src="${rank.rankBar}_current.png">
          <img class="image-percent" src="${rank.rankBar}_percentage.png">
          <img class="image-transparent" src="src/transparent.png">
      </div>
      <div class="percent">
          <div class="container"><div class="text">${percentage + '%'}</div>
      </div>
  </div>
  </body>
  </html>
      `;
    }

    res.end(htmlContent);
  } else if (req.url === '/font.ttf') {
    res.setHeader('Content-Type', 'font/ttf');
    fs.readFile(fontPath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error reading font file: ${err}`);
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else if (req.url.startsWith('/src/')) {
    // Serve static images
    const imagePath = path.join(__dirname, req.url);
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error reading file: ${err}`);
      } else {
        const contentType = path.extname(imagePath) === '.png' ? 'image/png' : 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else {
    // Handle other requests or 404
    res.statusCode = 404;
    res.end('Not Found');
  }
});

rl.question('Please enter your display name: ', function (userName) {
  if (userName) {
      const formattedName = userName.replace(/\s/g, '%20');
      const url = `http://160.251.9.161:8080/api/fortnite/rank/fetch_user_by_display_name?display_name=${formattedName}`;
      axios.get(url)
          .then(response => {
            account_id = response.data.account_id; // Corrected to access data property
            console.log("Account ID:", account_id);
            server.listen(port, () => {
              console.log(`Server running on http://localhost:${port}/`);
            });
          })
          .catch(error => {
              console.error('There has been a problem with your HTTP request:', error);
          });
  } else {
      console.log("No name was entered.");
  }
  rl.close();
});