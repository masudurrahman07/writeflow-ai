
import { NextResponse } from "next/server";
import axios from "axios";

// Proxy to backend for GET /api/users
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const search = searchParams.get("search") || "";
	const page = searchParams.get("page") || "1";
	const limit = searchParams.get("limit") || "10";

	// Forward request to backend
	const backendRes = await axios.get(`${process.env.BACKEND_URL}/users`, {
		params: { search, page, limit },
		headers: { Authorization: req.headers.get("authorization") || "" },
	});
	return NextResponse.json(backendRes.data);
}
