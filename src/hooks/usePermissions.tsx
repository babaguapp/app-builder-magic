import { useState, useEffect } from "react";

export type PermissionType = "location" | "notifications";
export type PermissionStatus = "granted" | "denied" | "prompt" | "unsupported";

interface PermissionState {
  location: PermissionStatus;
  notifications: PermissionStatus;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<PermissionState>({
    location: "prompt",
    notifications: "prompt",
  });

  const [hasCheckedPermissions, setHasCheckedPermissions] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // Check location permission
    if ("geolocation" in navigator) {
      try {
        const result = await navigator.permissions.query({ name: "geolocation" });
        setPermissions(prev => ({ ...prev, location: result.state as PermissionStatus }));
        
        result.addEventListener("change", () => {
          setPermissions(prev => ({ ...prev, location: result.state as PermissionStatus }));
        });
      } catch {
        setPermissions(prev => ({ ...prev, location: "unsupported" }));
      }
    } else {
      setPermissions(prev => ({ ...prev, location: "unsupported" }));
    }

    // Check notification permission
    if ("Notification" in window) {
      const status = Notification.permission;
      setPermissions(prev => ({ 
        ...prev, 
        notifications: status === "default" ? "prompt" : status as PermissionStatus 
      }));
    } else {
      setPermissions(prev => ({ ...prev, notifications: "unsupported" }));
    }

    setHasCheckedPermissions(true);
  };

  const requestLocation = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissions(prev => ({ ...prev, location: "granted" }));
          resolve(true);
        },
        () => {
          setPermissions(prev => ({ ...prev, location: "denied" }));
          resolve(false);
        }
      );
    });
  };

  const requestNotifications = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      return false;
    }

    const result = await Notification.requestPermission();
    const granted = result === "granted";
    setPermissions(prev => ({ 
      ...prev, 
      notifications: granted ? "granted" : "denied" 
    }));
    return granted;
  };

  const needsPermissionPrompts = 
    permissions.location === "prompt" || 
    permissions.notifications === "prompt";

  return {
    permissions,
    hasCheckedPermissions,
    needsPermissionPrompts,
    requestLocation,
    requestNotifications,
  };
};
