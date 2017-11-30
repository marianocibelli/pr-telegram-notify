"use strict"
const express = require('express');
const Webtask = require('webtask-tools');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

// Validator
let validate = (val, validator) => {
  return validator(val)
}

// Validations
const REQUIRED = (val) => {
  return (!val || val === null)
}

// Express Config
app.use(bodyParser.json());

// Route
app.post('/:chat_id', (req, res) => {
    if (req.get("X-GitHub-Event") && req.get("X-GitHub-Event") === "ping") {
      // If GitHub sends a ping (Health Check), reply 200.
      res.sendStatus(200);
      return;
    } else {
      let TELEGRAM_TOKEN = req.webtaskContext.data.TELEGRAM_TOKEN;
      let CHAT_ID = req.params.chat_id;
      let pr = req.body;

      // Validations
      if (validate(pr, REQUIRED)
          && validate(pr.action, REQUIRED)
          && validate(pr.title, REQUIRED)
          && validate(pr.pull_request, REQUIRED)
          && validate(pr.pull_request.user, REQUIRED)
          && validate(pr.pull_request.user.login, REQUIRED)
          && validate(pr.pull_request.url, REQUIRED)) {
            res.sendStatus(500);
            return;
      }

      let message = `Your repository has received a pull request update! The action realized was: ${pr.action}, title: ${pr.pull_request.title} made by ${pr.pull_request.user.login}. You can check more on: ${pr.pull_request.url}`;
      let headers = {
        'Content-Type': 'application/json'
      };
      let options = {
        url: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        method: 'POST',
        headers,
        form: {
          "text": message,
          "chat_id": CHAT_ID
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          // On success we do nothing
          res.sendStatus(200);
        } else {
          // TODO: We should save the request and retry later in case of an error so we dont miss any notification!
          res.sendStatus(response.statusCode);
        }
      });

    }
});

module.exports = Webtask.fromExpress(app);
