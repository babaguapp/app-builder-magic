import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { useCreateExpert } from "@/hooks/useAdminData";
import { useAdminUsers } from "@/hooks/useAdminData";

const formSchema = z.object({
  name: z.string().min(2, "Imię i nazwisko jest wymagane"),
  specialty: z.string().min(2, "Specjalizacja jest wymagana"),
  category: z.string().min(2, "Kategoria jest wymagana"),
  city: z.string().min(2, "Miasto jest wymagane"),
  gender: z.string().min(1, "Płeć jest wymagana"),
  bio: z.string().optional(),
  user_id: z.string().optional(),
  rate_online: z.coerce.number().min(0).optional(),
  rate_in_person: z.coerce.number().min(0).optional(),
  offers_online: z.boolean().default(false),
  offers_in_person: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

const categories = [
  "Psycholog",
  "Psychiatra",
  "Psychoterapeuta",
  "Coach",
  "Dietetyk",
  "Lekarz",
];

const specialties = [
  "Terapia poznawczo-behawioralna",
  "Psychoterapia",
  "Psychiatria",
  "Psychologia kliniczna",
  "Terapia par",
  "Terapia uzależnień",
  "Psychologia dziecięca",
  "Coaching życiowy",
  "Dietetyka kliniczna",
];

const cities = [
  "Warszawa",
  "Kraków",
  "Wrocław",
  "Poznań",
  "Gdańsk",
  "Łódź",
  "Katowice",
  "Lublin",
  "Online",
];

export const CreateExpertDialog = () => {
  const [open, setOpen] = useState(false);
  const { mutate: createExpert, isPending } = useCreateExpert();
  const { data: users = [] } = useAdminUsers();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      specialty: "",
      category: "",
      city: "",
      gender: "",
      bio: "",
      user_id: "",
      rate_online: 0,
      rate_in_person: 0,
      offers_online: false,
      offers_in_person: false,
    },
  });

  const onSubmit = (data: FormData) => {
    createExpert(
      {
        name: data.name,
        specialty: data.specialty,
        category: data.category,
        city: data.city,
        gender: data.gender,
        bio: data.bio,
        user_id: data.user_id || undefined,
        rate_online: data.offers_online ? data.rate_online : undefined,
        rate_in_person: data.offers_in_person ? data.rate_in_person : undefined,
        offers_online: data.offers_online,
        offers_in_person: data.offers_in_person,
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Dodaj specjalistę
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dodaj nowego specjalistę</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię i nazwisko</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr Jan Kowalski" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Przypisz do użytkownika (opcjonalnie)</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === "none" ? "" : value)} 
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz użytkownika" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Brak</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.user_id} value={user.user_id}>
                            {user.full_name || user.user_id.slice(0, 8) + "..."}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz kategorię" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specjalizacja</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz specjalizację" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specialties.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miasto</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz miasto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Płeć</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz płeć" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="female">Kobieta</SelectItem>
                        <SelectItem value="male">Mężczyzna</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (opcjonalnie)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Krótki opis specjalisty..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border border-border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Opcje konsultacji</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="offers_online"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <FormLabel className="text-sm font-medium">
                          Konsultacje online
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("offers_online") && (
                    <FormField
                      control={form.control}
                      name="rate_online"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cena online (PLN)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="150"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="offers_in_person"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <FormLabel className="text-sm font-medium">
                          Konsultacje stacjonarne
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("offers_in_person") && (
                    <FormField
                      control={form.control}
                      name="rate_in_person"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cena stacjonarnie (PLN)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Anuluj
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Dodawanie..." : "Dodaj specjalistę"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
