import { useEffect, useState, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from "@capacitor/push-notifications";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type PushPermissionStatus = "granted" | "denied" | "prompt" | "unsupported";

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [permissionStatus, setPermissionStatus] = useState<PushPermissionStatus>("prompt");
  const [token, setToken] = useState<string | null>(null);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // Check if running on native platform
    const native = Capacitor.isNativePlatform();
    setIsNative(native);

    if (!native) {
      setPermissionStatus("unsupported");
      return;
    }

    // Check current permission status
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
      setPermissionStatus("unsupported");
      return;
    }

    try {
      const result = await PushNotifications.checkPermissions();
      
      if (result.receive === "granted") {
        setPermissionStatus("granted");
      } else if (result.receive === "denied") {
        setPermissionStatus("denied");
      } else {
        setPermissionStatus("prompt");
      }
    } catch (error) {
      console.error("Error checking push permissions:", error);
      setPermissionStatus("unsupported");
    }
  };

  const registerPushNotifications = useCallback(async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      console.log("Push notifications are only supported on native platforms");
      return false;
    }

    try {
      // Request permission
      const permResult = await PushNotifications.requestPermissions();
      
      if (permResult.receive !== "granted") {
        setPermissionStatus("denied");
        return false;
      }

      setPermissionStatus("granted");

      // Register for push notifications
      await PushNotifications.register();

      return true;
    } catch (error) {
      console.error("Error registering push notifications:", error);
      return false;
    }
  }, []);

  // Set up listeners
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // On registration success
    const registrationListener = PushNotifications.addListener(
      "registration",
      async (token: Token) => {
        console.log("Push registration success, token:", token.value);
        setToken(token.value);

        // Save token to database
        if (user) {
          await saveTokenToDatabase(token.value);
        }
      }
    );

    // On registration error
    const errorListener = PushNotifications.addListener(
      "registrationError",
      (error) => {
        console.error("Push registration error:", error);
        toast.error("Nie udało się zarejestrować powiadomień push");
      }
    );

    // On notification received while app is in foreground
    const notificationListener = PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotificationSchema) => {
        console.log("Push notification received:", notification);
        
        // Show toast for foreground notifications
        toast(notification.title || "Powiadomienie", {
          description: notification.body,
        });
      }
    );

    // On notification action performed (user tapped notification)
    const actionListener = PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (action: ActionPerformed) => {
        console.log("Push notification action performed:", action);
        
        // Handle navigation based on notification data
        const data = action.notification.data;
        if (data?.route) {
          window.location.href = data.route;
        }
      }
    );

    return () => {
      registrationListener.then(l => l.remove());
      errorListener.then(l => l.remove());
      notificationListener.then(l => l.remove());
      actionListener.then(l => l.remove());
    };
  }, [user]);

  // Save token when user changes
  useEffect(() => {
    if (token && user) {
      saveTokenToDatabase(token);
    }
  }, [token, user]);

  const saveTokenToDatabase = async (deviceToken: string) => {
    if (!user) return;

    const platform = Capacitor.getPlatform() as "ios" | "android";

    try {
      // Upsert the token (insert or update if exists)
      const { error } = await supabase
        .from("device_tokens")
        .upsert(
          {
            user_id: user.id,
            token: deviceToken,
            platform,
          },
          {
            onConflict: "user_id,token",
          }
        );

      if (error) {
        console.error("Error saving device token:", error);
      } else {
        console.log("Device token saved successfully");
      }
    } catch (error) {
      console.error("Error saving device token:", error);
    }
  };

  const removeToken = async () => {
    if (!user || !token) return;

    try {
      await supabase
        .from("device_tokens")
        .delete()
        .eq("user_id", user.id)
        .eq("token", token);
      
      setToken(null);
    } catch (error) {
      console.error("Error removing device token:", error);
    }
  };

  return {
    isNative,
    permissionStatus,
    token,
    registerPushNotifications,
    removeToken,
    checkPermissions,
  };
};
