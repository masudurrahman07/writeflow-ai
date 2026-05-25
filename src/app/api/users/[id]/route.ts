
import { NextResponse } from "next/server";
import axios from "axios";

// Proxy to backend for PATCH /api/users/:id (ban/unban)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
	const backendRes = await axios.patch(`${process.env.BACKEND_URL}/users/${params.id}`, {}, {
		headers: { Authorization: req.headers.get("authorization") || "" },
	});
	return NextResponse.json(backendRes.data);
}
