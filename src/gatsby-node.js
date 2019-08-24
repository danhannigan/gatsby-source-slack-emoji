const { createRemoteFileNode } = require(`gatsby-source-filesystem`);
const { WebClient } = require('@slack/web-api');



async function fetchSlackEmoji(token) {
  const client = new WebClient(token);

  const response = await client.emoji.list();

  if (!response.ok) return null;

  return response.emoji;
}

exports.sourceNodes = async ({ actions, createNodeId, store, cache }, options = {}) => {
  const token = options.token || null;
  if (!token) throw new Error("No Slack Token set.");

  const { createNode, createNodeField } = actions;

  const emojiResponse = await fetchSlackEmoji(token);
  const emojiList = await Object.entries(emojiResponse);

  const filteredList = emojiList.filter(emoji => !emoji[1].includes('alias'));

  for (const [name, url] of filteredList) {
    let fileNode;
    try {
      fileNode = await createRemoteFileNode({
        url: url,
        cache,
        store,
        createNode,
        createNodeId,
        name: name,
      });
    } catch (error) {
      console.warn('error creating node', error);
    }
  }
}