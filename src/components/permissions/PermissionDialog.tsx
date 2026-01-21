import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Bell, ArrowRight, X } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

interface PermissionDialogProps {
  open: boolean;
  onComplete: () => void;
}

type Step = "location" | "notifications" | "done";

const PermissionDialog = ({ open, onComplete }: PermissionDialogProps) => {
  const [step, setStep] = useState<Step>("location");
  const { permissions, requestLocation, requestNotifications } = usePermissions();

  const handleLocationRequest = async () => {
    await requestLocation();
    setStep("notifications");
  };

  const handleNotificationRequest = async () => {
    await requestNotifications();
    onComplete();
  };

  const skipLocation = () => {
    setStep("notifications");
  };

  const skipNotifications = () => {
    onComplete();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        {step === "location" && permissions.location === "prompt" && (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <DialogTitle className="text-xl">Udostępnij lokalizację</DialogTitle>
              <DialogDescription className="text-base mt-2">
                Dzięki lokalizacji pokażemy Ci lekarzy i specjalistów najbliżej Ciebie. 
                Oszczędzisz czas na dojazdach i szybciej znajdziesz pomoc.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-6">
              <Button onClick={handleLocationRequest} size="lg" className="w-full">
                Udostępnij lokalizację
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="ghost" onClick={skipLocation} className="text-muted-foreground">
                Pomiń na razie
              </Button>
            </div>
          </>
        )}

        {step === "location" && permissions.location !== "prompt" && (
          // Skip to notifications if location already handled
          <>{setStep("notifications")}</>
        )}

        {step === "notifications" && permissions.notifications === "prompt" && (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-primary" />
              </div>
              <DialogTitle className="text-xl">Włącz powiadomienia</DialogTitle>
              <DialogDescription className="text-base mt-2">
                Będziemy przypominać o nadchodzących wizytach, lekach do wzięcia 
                i nowych artykułach od Twoich lekarzy. Nie przegapisz niczego ważnego!
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-6">
              <Button onClick={handleNotificationRequest} size="lg" className="w-full">
                Włącz powiadomienia
                <Bell className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="ghost" onClick={skipNotifications} className="text-muted-foreground">
                Pomiń na razie
              </Button>
            </div>
          </>
        )}

        {step === "notifications" && permissions.notifications !== "prompt" && (
          // Auto-complete if notifications already handled
          <>{onComplete()}</>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PermissionDialog;
