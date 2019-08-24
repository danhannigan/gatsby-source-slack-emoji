# Gatsby Plugin: Source Slack Emoji

A Gatsby Plugin that sources Slack Emoji, downloads them, and generates nodes for the images. In case you uh... want to show off all your emoji.

### Installing

`npm install --save gatsby-source-slack-emoji`


## How to use

The plugin expects your Slack Token. 

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-slack-emoji`,
      options: {
        key: process.env.SLACK_TOKEN,
      },
    },
  ],
}
```