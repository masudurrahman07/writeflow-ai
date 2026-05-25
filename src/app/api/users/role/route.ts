
import { NextResponse } from "next/server";
import axios from "axios";

// Proxy to backend for PATCH /api/users/role
export async function PATCH(req: Request) {
	const body = await req.json();
	const backendRes = await axios.patch(`${process.env.BACKEND_URL}/users/role`, body, {
		headers: { Authorization: req.headers.get("authorization") || "" },
	});
	return NextResponse.json(backendRes.data);
}
