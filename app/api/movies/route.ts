
import { NextResponse } from "next/server";

const BASE = "https://api.themoviedb.org/3";

export async function GET(request: Request) {
  const token = process.env.TMDB_BEARER_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "TMDB token is missing" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category") || "trending";

  let endpoint = `${BASE}/trending/movie/week`;

  if (query) {
    endpoint = `${BASE}/search/multi?query=${encodeURIComponent(query)}`;
  } else if (category === "popular") {
    endpoint = `${BASE}/movie/popular`;
  } else if (category === "top_rated") {
    endpoint = `${BASE}/movie/top_rated`;
  } else if (category === "series") {
    endpoint = `${BASE}/tv/popular`;
  }

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "TMDB request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to load movies" },
      { status: 500 }
    );
  }
}
