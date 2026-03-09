import { NextResponse } from "next/server";
import { fetchWeeklyEntries, fetchWeeklyEntryByWeek, saveWeeklyEntry } from "@/lib/weekly-entries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weekOf = searchParams.get("weekOf");

  if (weekOf) {
    const result = await fetchWeeklyEntryByWeek(weekOf);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    if (!result.data) {
      return NextResponse.json({ data: null }, { status: 404 });
    }

    return NextResponse.json({ data: result.data });
  }

  const result = await fetchWeeklyEntries();

  if (result.error) {
    return NextResponse.json({ error: result.error, data: result.data }, { status: 500 });
  }

  return NextResponse.json({ data: result.data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await saveWeeklyEntry(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
