import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  // Replace this with your new auth check
  const isAuthenticated = true; // Implement your new auth check here
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });

  const calendar = google.calendar({ version: "v3", auth });

  // Get today's date and tomorrow's date
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: today.toISOString(),
      timeMax: tomorrow.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    return NextResponse.json(response.data.items || []);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}
