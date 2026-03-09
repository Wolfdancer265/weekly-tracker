import { NextResponse } from "next/server";
import { fetchWeeklyEntryByWeek, saveWeeklyEntry } from "@/lib/weekly-entries";

export async function GET(_: Request, { params }: { params: { weekOf: string } }) {
  const result = await fetchWeeklyEntryByWeek(params.weekOf);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  if (!result.data) {
    return NextResponse.json({ data: null }, { status: 404 });
  }

  return NextResponse.json({ data: result.data });
}

export async function PUT(request: Request, { params }: { params: { weekOf: string } }) {
  try {
    const body = await request.json();
    const result = await saveWeeklyEntry({ ...body, weekOf: params.weekOf });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
