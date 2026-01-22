import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CancelBookingDialogProps {
  consultationId: string;
  expertName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CancelBookingDialog = ({
  consultationId,
  expertName,
  open,
  onOpenChange,
  onSuccess,
}: CancelBookingDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("user_consultations")
        .update({ status: "cancelled" })
        .eq("id", consultationId);

      if (error) throw error;

      toast.success("Wizyta została odwołana", {
        description: `Konsultacja z ${expertName} została anulowana`,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error cancelling consultation:", error);
      toast.error("Nie udało się odwołać wizyty", {
        description: "Spróbuj ponownie później",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle>Odwołanie wizyty</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Czy na pewno chcesz odwołać wizytę z <strong>{expertName}</strong>?
            <br />
            <span className="text-muted-foreground mt-2 block">
              Ta operacja jest nieodwracalna. Jeśli chcesz zmienić termin, skorzystaj z opcji "Zmień termin".
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Odwoływanie...
              </>
            ) : (
              "Odwołaj wizytę"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelBookingDialog;
