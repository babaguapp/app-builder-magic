import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import pewnaLogo from "@/assets/pewna-logo.svg";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "signup");
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const validateForm = () => {
    setError(null);
    
    if (!formData.email || !formData.password) {
      setError("Wypełnij wszystkie wymagane pola");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Wprowadź poprawny adres email");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Hasło musi mieć minimum 8 znaków");
      return false;
    }

    if (isSignUp && !formData.name.trim()) {
      setError("Wprowadź swoje imię i nazwisko");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          if (error.message.includes("already registered")) {
            setError("Ten email jest już zarejestrowany. Zaloguj się.");
          } else {
            setError(error.message);
          }
        } else {
          toast({
            title: "Konto utworzone!",
            description: "Witamy w aplikacji.",
          });
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setError("Nieprawidłowy email lub hasło");
          } else {
            setError(error.message);
          }
        } else {
          toast({
            title: "Witaj!",
            description: "Zostałeś pomyślnie zalogowany.",
          });
        }
      }
    } catch (err) {
      setError("Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero py-12 px-4 safe-area-top safe-area-bottom">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="flex justify-center mb-6">
            <img 
              src={pewnaLogo} 
              alt="Pewna Logo" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isSignUp ? "Utwórz konto" : "Witaj ponownie"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSignUp
              ? "Dołącz do Pewna i zadbaj o swoje zdrowie"
              : "Zaloguj się, aby kontynuować"}
          </p>
        </div>

        {/* Form */}
        <div className="gradient-card rounded-2xl shadow-card p-8 animate-fade-up animation-delay-100">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Imię i nazwisko</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jan Kowalski"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Adres email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ty@przykład.pl"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground">
                  Minimum 8 znaków
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                "Proszę czekać..."
              ) : (
                <>
                  {isSignUp ? "Utwórz konto" : "Zaloguj się"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Masz już konto?" : "Nie masz konta?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-primary font-medium hover:underline"
              >
                {isSignUp ? "Zaloguj się" : "Zarejestruj się"}
              </button>
            </p>
          </div>
        </div>

        {/* Terms */}
        {isSignUp && (
          <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-up animation-delay-200">
            Tworząc konto, akceptujesz{" "}
            <a href="#" className="text-primary hover:underline">
              Regulamin
            </a>{" "}
            oraz{" "}
            <a href="#" className="text-primary hover:underline">
              Politykę Prywatności
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
