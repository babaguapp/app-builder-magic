import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminExperts, useUpdateExpert, useDeleteExpert } from "@/hooks/useAdminData";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Trash2, Star } from "lucide-react";
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

const AdminExperts = () => {
  const { data: experts = [], isLoading } = useAdminExperts();
  const { mutate: updateExpert } = useUpdateExpert();
  const { mutate: deleteExpert } = useDeleteExpert();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleToggleActive = (id: string, currentValue: boolean | null) => {
    updateExpert({ id, updates: { is_active: !currentValue } });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Eksperci
          </h1>
          <p className="text-muted-foreground mt-1">
            Zarządzanie ekspertami ({experts.length})
          </p>
        </div>

        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ekspert</TableHead>
                <TableHead>Specjalizacja</TableHead>
                <TableHead>Miasto</TableHead>
                <TableHead>Ocena</TableHead>
                <TableHead>Sesje</TableHead>
                <TableHead>Aktywny</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : experts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Brak ekspertów
                  </TableCell>
                </TableRow>
              ) : (
                experts.map((expert) => (
                  <TableRow key={expert.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{expert.name}</p>
                        <p className="text-sm text-muted-foreground">{expert.category}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{expert.specialty}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{expert.city}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{expert.rating?.toFixed(1) || "0.0"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {expert.sessions_count || 0}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={expert.is_active || false}
                        onCheckedChange={() => handleToggleActive(expert.id, expert.is_active)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(expert.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć eksperta?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Ekspert zostanie permanentnie usunięty z systemu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) {
                  deleteExpert(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminExperts;
