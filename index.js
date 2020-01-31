"use strict";

const { writeFile } = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
// const pdf = require("html-pdf");
// const html = fs.readFileSync("devInfo.html", "utf8");

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
        choices: ["Purple", "Green", "Navy", "Black"]
      }
    ]);
    console.log(response);
    const gitHubUsername = response.github;
    const backgroundColor = response.favecolor;

    const userGitHub = await axios.get(
      `https://api.github.com/users/${gitHubUsername}`
    );
    console.log(userGitHub);

    writeFile("devInfo.html", writeHTML(userGitHub, backgroundColor), function(
      err
    ) {
      if (err) throw err;
      console.log("Saved!");
    });
  } catch (error) {
    console.error(error);
  }
}

function writeHTML({ data }, color) {
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
          font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
          font-size: 26px;
        }
  
        h6 {
          color: white;
          font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
          font-size: 19xp;
        }
  
        body {
          background-color: papayawhip;
        }
      </style>
    </head>
    <body>
      <div class="main">
        <div class="container">
          <div class="card user-info p-5">
            <div class="user-photo text-center ">
              <img src="${data.avatar_url}" alt="User photo" width="150px" />
            </div>
            <br><br>
            <h3 class="card-title text-center">Hi!</h3>
            <h3 class="card-title text-center">My Name is ${data.name}!</h3>
            <br />
            <br />
            <h6 class="card-subtitle mb-2 location text-center ">
             ${data.location}
              <a href="${data.html_url}">Here's my Github</a>
              @${data.login}
            </h6>
          </div>
  
          <div class="row ">
            <div class="col-lg-6 col-sm-12 d-flex justify-content-around p-5">
              <div class="card">
                <div class="card-body public-repos ">
                  <h5 class="card-title text-center">Public Repositories</h5>
                  <h6 class="card-subtitle mb-2 text-center">${data.public_repos}</h6>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-sm-12 d-flex justify-content-around p-5">
              <div class="card">
                <div class="card-body public-repos">
                  <h5 class="card-title text-center">Followers</h5>
                  <h6 class="card-subtitle mb-2 text-center ">${data.followers}</h6>
                </div>
              </div>
            </div>
          </div>
  
          <div class="row">
            <div class="col-lg-6 col-sm-12 d-flex justify-content-around p-5">
              <div class="card">
                <div class="card-body public-repos">
                  <h5 class="card-title text-center">GitHub Stars</h5>
                  <h6 class="card-subtitle mb-2 text-center ">${data.public_gists}</h6>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-sm-12 d-flex justify-content-around p-5">
              <div class="card">
                <div class="card-body public-repos">
                  <h5 class="card-title text-center">Following</h5>
                  <h6 class="card-subtitle mb-2 text-center ">${data.following}</h6>
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
