"use strict";

const { writeFile } = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

function promptUser() {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "github",
        message: "What is your github username?"
      },
      {
        type: "list",
        name: "favecolor",
        message: "Choose Your Favorite Color",
        choices: ["Red", "Green", "Yellow", "Blue"]
      }
    ])
    .then(response => {
      console.log(response);
      const gitHubUsername = response.github;
      axios
        .get(`https://api.github.com/users/${gitHubUsername}`)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    });
}

promptUser();
