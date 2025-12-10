import {NextResponse} from "next/server";
import crypto from "crypto";
import {query} from "@/app/db/db";

export async function POST(req: Request) {
    //const {email} = await req.json();
    //if (!email) {
        //return NextResponse.json({error: "Email is required."},
        //{status: 400});
    //}

    //const checkUser = await query("SELECT id FROM users WHERE email = $1", [email]);
    //if (checkUser.rowCount === 0) {
        //return NextResponse.json({ok: true});
    //}

    //const userId = checkUser.rows[0].id;
    //const token = crypto.randomBytes(32).toString("hex");
    //const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    
    //await query (
    //    `INSERT INTO password_reset_tokens (token, user_id, expires_at, used) VALUES ($1, $2, $3, false)`, [token, userId, expiresAt]
    //);
    return NextResponse.json({ok: true});
}

