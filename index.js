"use strict";

const { writeFile } = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const puppeteer = require("puppeteer");
const { resolve } = require("path");

async function promptUser() {
  try {
    const response = await inquirer.prompt([
      {
        type: "input",
        name: "github",
        message: "What is your github username?"
      },
      {
        type: "list",
        name: "favecolor",
        message: "Choose Your Favorite Color",
        choices: ["Purple", "Green", "Navy", "Red"]
      }
    ]);
    console.log(response);
    const gitHubUsername = response.github;
    const backgroundColor = response.favecolor;

    const userGitHub = await axios.get(
      `https://api.github.com/users/${gitHubUsername}`
    );
    console.log(userGitHub);
    const userStars = await axios.get(
      `https://api.github.com/users/${gitHubUsername}/starred`
    );

    writeFile(
      "devInfo.html",
      await writeHTML(userGitHub, backgroundColor, userStars),
      function(err) {
        if (err) throw err;
        console.log("Saved!");
        printPDF();
      }
    );
  } catch (error) {
    console.log("error!");
    console.error(error);
    promptUser();
  }
}

async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.emulateMedia("screen");
  await page.setBypassCSP(true);
  const absPath = resolve("devInfo.html");
  await page.goto("file://" + absPath);
  const pdf = await page.pdf({
    format: "Letter",
    path: "devInfo.pdf",
    printBackground: true
  });

  await browser.close();
  return pdf;
}

// writePDF("devInfo.pdf", printPDF())

function writeHTML({ data }, color, userStars) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Dev Profile Layout</title>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"
      />
      <style>
        .card {
          background-color: ${color};
          color: white;
          font-family: Georgia, "Times New Roman", Times, serif;
          border: 1px solid;
          box-shadow: 15px 20px #181915;
          opacity: 80%;
        }
  
        .user-info{
            margin-top:5px;
            height:375px;
            align-items: center;
            justify-content: start;
            
        }

        h3{
            font-sixe: 18px;
        }
        h6 {
          color: white;
          font-family: Georgia, "Times New Roman", Times, serif;
          font-size: 18px;
        }
  
        h5 {
          letter-spacing: 1px;
          font-size: 20px;
        }
        .info-cards {
          width: 300px;
          height: 75px;
        }
        body {
          background-color: #e7e6ea;
        -webkit-print-color-adjust: exact;
        }

        img {
          border-radius: 30%;
        }

      </style>
    </head>
    <body>
      <div class="main">
        <div class="container">
          <div class="card user-info align-items-top p-5">
            <div class="user-photo text-center">
              <img
                src="${data.avatar_url}"
                alt="User photo"
                width="200px"
              />
            </div>
           
            <h3 class="card-title text-center">Hi!</h3>
            <h3 class="card-title text-center">My Name is ${data.name}!</h3>
           
  
            <h6 class="card-subtitle mb-2 location text-center ">
            ${data.location}
              <a href="${data.html_url}">Visit my GitHub</a>
              @${data.login}
            </h6>
          </div>
  
          <div class="row ">
            <div class="col-lg-6 col-sm-12 d-flex justify-content-center p-5">
              <div class="card">
                <div
                  class="card-body public-repos d-flex align-items-center justify-content-center info-cards"
                >
                  <h5 class="card-title text-center">
                    Public Repositories<br />
                    ${data.public_repos}
                  </h5>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-sm-12 d-flex justify-content-center p-5">
              <div class="card"> 
                <div
                  class="card-body followers info-cards d-flex align-items-center justify-content-center"
                >
                  <h5 class="card-title text-center">
                    Followers
                    <br />
                    ${data.followers}
                  </h5>
                </div>
              </div>
            </div>
          </div>
  
          <div class="row">
            <div class="col-lg-6 col-sm-12 d-flex justify-content-center p-5">
              <div class="card">
                <div
                  class="card-body github-stars info-cards d-flex align-items-center justify-content-center"
                >
                  <h5 class="card-title text-center">
                    GitHub Stars
                    <br />
                    ${userStars.data.length}
                  </h5>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-sm-12 d-flex justify-content-center p-5">
              <div class="card">
                <div
                  class="card-body following info-cards d-flex align-items-center justify-content-center"
                >
                  <h5 class="card-title text-center">Following<br />${data.following}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <script
        src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
        integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
        integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
        crossorigin="anonymous"
      ></script>
    </body>
  </html>`;
}

promptUser();
