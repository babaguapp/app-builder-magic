import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminUserRoles, useAdminUsers, useAddUserRole, useRemoveUserRole } from "@/hooks/useAdminData";
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
import { Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const AdminRoles = () => {
  const { data: roles = [], isLoading } = useAdminUserRoles();
  const { data: users = [] } = useAdminUsers();
  const { mutate: addRole, isPending: isAdding } = useAddUserRole();
  const { mutate: removeRole } = useRemoveUserRole();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "specialist">("specialist");

  const getUserName = (userId: string) => {
    const user = users.find(u => u.user_id === userId);
    return user?.full_name || userId.slice(0, 8) + "...";
  };

  const handleAddRole = () => {
    if (!selectedUserId || !selectedRole) return;
    addRole(
      { userId: selectedUserId, role: selectedRole },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setSelectedUserId("");
          setSelectedRole("specialist");
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Role użytkowników
            </h1>
            <p className="text-muted-foreground mt-1">
              Zarządzanie uprawnieniami ({roles.length})
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Dodaj rolę
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj nową rolę</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Użytkownik</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz użytkownika" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.user_id} value={user.user_id}>
                          {user.full_name || user.user_id.slice(0, 8) + "..."}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rola</Label>
                  <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as "admin" | "specialist")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="specialist">Specjalista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleAddRole} 
                  className="w-full"
                  disabled={!selectedUserId || isAdding}
                >
                  Przypisz rolę
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Użytkownik</TableHead>
                <TableHead>Rola</TableHead>
                <TableHead>Data przypisania</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  </TableRow>
                ))
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Brak przypisanych ról
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">
                        {getUserName(role.user_id)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.role === "admin" ? "default" : "secondary"}>
                        {role.role === "admin" ? "Administrator" : "Specjalista"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(role.created_at), "d MMM yyyy", { locale: pl })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeRole(role.id)}
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
    </AdminLayout>
  );
};

export default AdminRoles;
