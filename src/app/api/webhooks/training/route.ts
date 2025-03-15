import { NextResponse } from "next/server";
import Replicate from "replicate";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from 'resend';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request){
    console.log("Webhook is working ", req);
    try {
    const body = await req.json();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? "";
    const modelName = url.searchParams.get("modelName") ?? "";
    const fileName = url.searchParams.get("fileName") ?? "";

    // To validate the webhook
    const id = req.headers.get('webhook-id') ?? "";
    const timestamp = req.headers.get('webhook-timestamp') ?? "";
    const webhookSignature = req.headers.get('webhook-signature') ?? "";

    const signedContent = `${id}.${timestamp}.${JSON.stringify(body)}`;
    const secret = await replicate.webhooks.default.secret.get();
    const secretBytes = Buffer.from(secret.key.split('_')[1], "base64");
const signature = crypto
  .createHmac('sha256', secretBytes)
  .update(signedContent)
  .digest('base64');
console.log(signature);
const expectedSignatures = webhookSignature.split(' ').map(sig => sig.split(',')[1]);
const isValid = expectedSignatures.some(expectedSignature => expectedSignature === signature);

if(!isValid){
    return new NextResponse("Invalid signature", {status: 401});
}

// get user data
const {data: user, error: userError} = await supabaseAdmin.auth.admin.getUserById(userId);
if(userError || !user){
    return new NextResponse("User not found!", {status: 401});
}

const userEmail = user.user.email ?? "";
const userName = user.user.user_metadata.full_name ?? "";

    
    console.log("Webhook is working fine!", body);
    return NextResponse.json({success: true}, {status: 201});
    } catch (error) {
        console.log("Webhook processing error: ", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}