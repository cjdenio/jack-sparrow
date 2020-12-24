const { App } = require("@slack/bolt");
require("dotenv").config();

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_TOKEN,
});

app.message(async ({ event, client }) => {
  const user = await client.users.info({
    user: event.user,
  });

  const permalink = await client.chat.getPermalink({
    channel: event.channel,
    message_ts: event.ts,
  });

  if (event.channel == process.env.SHIP_CHANNEL) {
    client.chat.postMessage({
      channel: process.env.PIRATES_CHANNEL,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: ":shipitparrot: *SHIP IN THE HARBOR*:",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: permalink.permalink,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "image",
              image_url: user.user.profile.image_48,
              alt_text: "hello",
            },
            {
              type: "mrkdwn",
              text: `Posted by <@${event.user}>`,
            },
          ],
        },
      ],
    });
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("app started!");
})();
