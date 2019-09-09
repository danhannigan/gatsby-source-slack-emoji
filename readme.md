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

### Querying Data

```javascript
// In your page
allFile(filter: {fields: {SlackEmoji: {eq: "true"}}}) {
    edges {
      node {
        fields {
          SlackEmoji
        }
        name
        publicURL
      }
    }
  }
```

### Using in a page
```javascript
const Emojis = data.allFile.edges
// ...
{Emojis.map(emoji => (
  <div key={emoji.node.id}>
    <img src={emoji.node.publicURL} alt={emoji.node.name} />
    <div>:{emoji.node.name}:</div>
  </div>
))}
```