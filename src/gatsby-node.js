const { createRemoteFileNode } = require(`gatsby-source-filesystem`);
const { WebClient } = require("@slack/web-api");

async function fetchSlackEmoji(token) {
  const client = new WebClient(token);
  const response = await client.emoji.list();
  if (!response.ok) return null;

  const filteredEmojis = Object.entries(response.emoji).filter(
    emoji => !emoji[1].includes("alias")
  );
  return filteredEmojis;
}

exports.sourceNodes = async (
  { actions, createNodeId, node, getNode, store, cache },
  options = {}
) => {
  const token = options.token || null;
  if (!token) throw new Error("No Slack Token set.");

  const emojiResponse = await fetchSlackEmoji(token);

  const { createNode, createNodeField, touchNode } = actions;

  for (const [name, url] of emojiResponse) {
    let fileNodeID;
    const remoteDataCacheKey = `SlackEmojiUrl-${url}`;
    const cacheRemoteData = await cache.get(remoteDataCacheKey);

    if (cacheRemoteData) {
      fileNodeID = cacheRemoteData.fileNodeID;
      await touchNode({ nodeId: fileNodeID });
    }

    if (!fileNodeID) {
      const fileNode = await createRemoteFileNode({
        url: url,
        cache,
        store,
        createNode,
        createNodeId,
        name: name
      });
      await createNodeField({
        node: fileNode,
        name: "SlackEmoji",
        value: "true"
      });

      if (fileNode) {
        fileNodeID = fileNode.id;
        await cache.set(remoteDataCacheKey, { fileNodeID });
      }
    }
  }
};
