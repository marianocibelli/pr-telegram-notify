# Pull Request notifications on telegram with webtask

## Installation and usage

First of all you need to setup a bot on telegram talking to Bot Father, he will give you the token

Then create a webtask with the js file on the project and using the token as a secret on the wt using the command --secret TELEGRAM\_TOKEN=[your\_token]

Get the chat_id you want the bot to write on (If its a group you need to invite him first, if its personal chat you need to go and start him on telegram before)

Finally you just need to go to your repository on github and setup a webhook on the URL webtask give you earlier adding your id as a param at the end (exampleurl.com/pr-notifications/{chat\_id})

And thats all. Hope you find it useful!