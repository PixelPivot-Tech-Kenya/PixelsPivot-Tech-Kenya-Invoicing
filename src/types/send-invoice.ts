import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const message = [
      `From: "Your Name" <devsben345@gmail.com>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      html,
    ].join("\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}