import { NextResponse } from "next/server";
import Replicate from "replicate";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

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

    if(body.status === "succeeded"){
        // Update the supabase models table
        await supabaseAdmin.from("models").update({
            training_status: body.status,
            training_time: body.metrics?.total_time ?? null,
            version: body.output?.version.split(":")[1] ?? null,
        }).eq("user_id", userId).eq("model_name", modelName)
    }else{
        // Update the supabase models table
        await supabaseAdmin.from("models").update({
            training_status: body.status,
        }).eq("user_id", userId).eq("model_name", modelName)

        // getting old credits 
        const {data: oldCredits, error} = await supabaseAdmin.from('credits').select('model_training_count').eq("user_id", userId).single();
        if(error) throw new Error("Error getting user credits!")

        // updating the credits
        await supabaseAdmin.from('credits').update({model_training_count: oldCredits?.model_training_count + 1}).eq("user_id", userId).single();
    } 

    // delete the training data from supabase storage
    await supabaseAdmin.storage.from("training_data").remove([`${fileName}`])

    return new NextResponse("Ok", {status: 200});
    } catch (error) {
        console.log("Webhook processing error: ", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}
