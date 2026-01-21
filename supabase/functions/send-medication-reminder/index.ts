import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MedicationReminder {
  userId: string;
  medicationName: string;
  dosage?: string;
  scheduledTime: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const fcmServerKey = Deno.env.get("FCM_SERVER_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId, medicationName, dosage, scheduledTime }: MedicationReminder = await req.json();

    console.log(`Sending medication reminder for user ${userId}: ${medicationName} at ${scheduledTime}`);

    // Get user's device tokens
    const { data: tokens, error: tokensError } = await supabase
      .from("device_tokens")
      .select("token, platform")
      .eq("user_id", userId);

    if (tokensError) {
      console.error("Error fetching device tokens:", tokensError);
      throw tokensError;
    }

    if (!tokens || tokens.length === 0) {
      console.log("No device tokens found for user");
      return new Response(
        JSON.stringify({ success: false, message: "No device tokens found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${tokens.length} device token(s)`);

    // Build notification payload
    const notificationTitle = "Przypomnienie o leku";
    const notificationBody = dosage 
      ? `Czas na: ${medicationName} (${dosage})`
      : `Czas na: ${medicationName}`;

    const results = [];

    for (const deviceToken of tokens) {
      try {
        if (fcmServerKey) {
          // Send via Firebase Cloud Messaging
          const fcmPayload = {
            to: deviceToken.token,
            notification: {
              title: notificationTitle,
              body: notificationBody,
              sound: "default",
              badge: 1,
            },
            data: {
              route: "/medications",
              medicationName,
              scheduledTime,
            },
            priority: "high",
          };

          const fcmResponse = await fetch("https://fcm.googleapis.com/fcm/send", {
            method: "POST",
            headers: {
              "Authorization": `key=${fcmServerKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(fcmPayload),
          });

          const fcmResult = await fcmResponse.json();
          console.log(`FCM response for ${deviceToken.platform}:`, fcmResult);

          // Check if token is invalid and remove it
          if (fcmResult.failure === 1 && fcmResult.results?.[0]?.error === "NotRegistered") {
            console.log("Removing invalid token:", deviceToken.token);
            await supabase
              .from("device_tokens")
              .delete()
              .eq("token", deviceToken.token);
          }

          results.push({
            platform: deviceToken.platform,
            success: fcmResult.success === 1,
            result: fcmResult,
          });
        } else {
          console.log("FCM_SERVER_KEY not configured, skipping notification");
          results.push({
            platform: deviceToken.platform,
            success: false,
            error: "FCM_SERVER_KEY not configured",
          });
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Error sending to ${deviceToken.platform}:`, error);
        results.push({
          platform: deviceToken.platform,
          success: false,
          error: errorMessage,
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-medication-reminder:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
