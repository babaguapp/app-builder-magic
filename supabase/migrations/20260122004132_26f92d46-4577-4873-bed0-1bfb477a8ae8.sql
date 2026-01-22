-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  author_bio TEXT,
  category TEXT NOT NULL,
  read_time INTEGER NOT NULL DEFAULT 5,
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Articles are publicly viewable" 
ON public.articles 
FOR SELECT 
USING (is_published = true);

-- Create trigger for updated_at
CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert test articles in Polish
INSERT INTO public.articles (title, excerpt, content, author, author_bio, category, read_time, likes, comments) VALUES
(
  'Jak radzić sobie ze stresem w codziennym życiu',
  'Poznaj sprawdzone techniki zarządzania stresem, które możesz wdrożyć już dziś.',
  '<p>Stres jest nieodłączną częścią współczesnego życia. Jednak chroniczny stres może prowadzić do poważnych problemów zdrowotnych. Oto sprawdzone metody radzenia sobie z napięciem.</p>

<h2>Techniki oddechowe</h2>
<p>Najprostszą i najszybszą metodą redukcji stresu jest świadome oddychanie. Technika 4-7-8 polega na wdechu przez 4 sekundy, zatrzymaniu oddechu na 7 sekund i wydechu przez 8 sekund.</p>

<h2>Aktywność fizyczna</h2>
<p>Regularne ćwiczenia pomagają obniżyć poziom kortyzolu i uwalniają endorfiny. Nawet 20-minutowy spacer może znacząco poprawić samopoczucie.</p>

<h2>Higiena snu</h2>
<p>Sen jest kluczowy dla regeneracji organizmu. Staraj się kłaść spać o stałych porach i unikaj ekranów na godzinę przed snem.</p>

<h2>Wsparcie społeczne</h2>
<p>Rozmowa z bliskimi osobami może pomóc w przepracowaniu trudnych emocji. Nie izoluj się - poproś o pomoc, gdy jej potrzebujesz.</p>',
  'Dr Anna Kowalska',
  'Psycholog kliniczny z 15-letnim doświadczeniem w terapii poznawczo-behawioralnej.',
  'Zdrowie psychiczne',
  7,
  234,
  45
),
(
  'Znaczenie regularnych badań profilaktycznych',
  'Dlaczego warto regularnie wykonywać badania kontrolne i jakie są najważniejsze z nich.',
  '<p>Profilaktyka zdrowotna to klucz do długiego i zdrowego życia. Wiele chorób można wykryć we wczesnym stadium, gdy leczenie jest najbardziej skuteczne.</p>

<h2>Podstawowe badania krwi</h2>
<p>Morfologia, lipidogram i poziom glukozy to badania, które każdy dorosły powinien wykonywać co najmniej raz w roku.</p>

<h2>Badania kardiologiczne</h2>
<p>Po 40. roku życia warto regularnie kontrolować ciśnienie krwi i wykonywać EKG. Choroby serca są jedną z głównych przyczyn zgonów.</p>

<h2>Badania przesiewowe</h2>
<p>Mammografia, cytologia, kolonoskopia - te badania mogą uratować życie, wykrywając nowotwory na wczesnym etapie.</p>

<h2>Nie odkładaj na później</h2>
<p>Regularne wizyty u lekarza pierwszego kontaktu pozwalają na bieżąco monitorować stan zdrowia i szybko reagować na niepokojące objawy.</p>',
  'Dr Michał Nowak',
  'Lekarz internista, specjalista medycyny rodzinnej z 20-letnim stażem.',
  'Zdrowie',
  5,
  189,
  32
),
(
  'Zdrowe nawyki żywieniowe dla całej rodziny',
  'Jak wprowadzić zbilansowaną dietę i zachęcić dzieci do zdrowego jedzenia.',
  '<p>Zdrowe odżywianie to fundament dobrego samopoczucia. Wprowadzenie dobrych nawyków żywieniowych w całej rodzinie przynosi korzyści wszystkim jej członkom.</p>

<h2>Planowanie posiłków</h2>
<p>Przygotowywanie menu na cały tydzień pomaga uniknąć niezdrowych wyborów. Zaplanuj różnorodne posiłki zawierające warzywa, białko i zdrowe tłuszcze.</p>

<h2>Wspólne gotowanie</h2>
<p>Zaangażowanie dzieci w przygotowywanie posiłków sprawia, że chętniej próbują nowych potraw. To też świetna okazja do spędzenia czasu razem.</p>

<h2>Unikaj przetworzonych produktów</h2>
<p>Staraj się ograniczać produkty wysoko przetworzone, bogate w cukier i sól. Wybieraj świeże składniki i gotuj w domu.</p>

<h2>Nawodnienie</h2>
<p>Picie odpowiedniej ilości wody jest kluczowe dla zdrowia. Zachęcaj dzieci do picia wody zamiast słodzonych napojów.</p>',
  'Mgr Katarzyna Wiśniewska',
  'Dietetyk kliniczny, specjalistka ds. żywienia dzieci i młodzieży.',
  'Żywienie',
  6,
  312,
  56
),
(
  'Depresja - jak rozpoznać objawy u siebie i bliskich',
  'Wczesne rozpoznanie depresji może znacząco przyspieszyć powrót do zdrowia.',
  '<p>Depresja to poważna choroba, która dotyka miliony ludzi na całym świecie. Wczesne rozpoznanie objawów jest kluczowe dla skutecznego leczenia.</p>

<h2>Najczęstsze objawy</h2>
<p>Do głównych objawów depresji należą: utrzymujący się smutek, utrata zainteresowań, problemy ze snem, zmęczenie, trudności z koncentracją i myśli o śmierci.</p>

<h2>Depresja u mężczyzn</h2>
<p>Mężczyźni często maskują depresję drażliwością, agresją lub nadużywaniem alkoholu. Rzadziej mówią o smutku czy beznadziejności.</p>

<h2>Kiedy szukać pomocy</h2>
<p>Jeśli objawy utrzymują się dłużej niż dwa tygodnie i utrudniają codzienne funkcjonowanie, koniecznie skonsultuj się ze specjalistą.</p>

<h2>Leczenie jest skuteczne</h2>
<p>Depresja jest chorobą, którą można skutecznie leczyć. Psychoterapia, leki i wsparcie bliskich pomagają większości pacjentów wrócić do zdrowia.</p>',
  'Dr Piotr Zieliński',
  'Psychiatra, specjalista w zakresie zaburzeń nastroju i lęku.',
  'Zdrowie psychiczne',
  8,
  567,
  89
),
(
  'Aktywność fizyczna a zdrowie psychiczne',
  'Jak regularne ćwiczenia wpływają na nastrój i samopoczucie.',
  '<p>Związek między aktywnością fizyczną a zdrowiem psychicznym jest naukowa potwierdzony. Ćwiczenia to naturalne lekarstwo na wiele problemów emocjonalnych.</p>

<h2>Endorfiny - naturalne antydepresanty</h2>
<p>Podczas ćwiczeń organizm uwalnia endorfiny, które poprawiają nastrój i redukują ból. To dlatego po treningu czujemy się lepiej.</p>

<h2>Redukcja kortyzolu</h2>
<p>Regularna aktywność fizyczna obniża poziom kortyzolu - hormonu stresu. Pomaga to w radzeniu sobie z napięciem i lękiem.</p>

<h2>Jaki rodzaj aktywności wybrać?</h2>
<p>Najlepsza jest ta aktywność, którą lubisz. Spacery, pływanie, joga, taniec - wybierz coś, co sprawia Ci przyjemność i będziesz to robić regularnie.</p>

<h2>Zacznij powoli</h2>
<p>Nie musisz od razu biegać maratonów. Zacznij od 15-20 minut dziennie i stopniowo zwiększaj intensywność.</p>',
  'Dr Magdalena Adamska',
  'Fizjoterapeutka i psycholog sportu, propagatorka zdrowego stylu życia.',
  'Zdrowie',
  5,
  445,
  67
),
(
  'Jak wspierać dziecko w trudnych emocjach',
  'Praktyczne wskazówki dla rodziców w rozmowach o uczuciach.',
  '<p>Dzieci często nie potrafią nazwać tego, co czują. Rolą rodzica jest pomóc im zrozumieć i wyrazić emocje w zdrowy sposób.</p>

<h2>Nazywaj emocje</h2>
<p>Zamiast mówić "nie płacz", powiedz "widzę, że jesteś smutny/zły". Pomoże to dziecku zidentyfikować swoje uczucia.</p>

<h2>Słuchaj bez oceniania</h2>
<p>Daj dziecku przestrzeń do wyrażenia emocji bez przerywania i krytykowania. Twoja akceptacja jest dla niego najważniejsza.</p>

<h2>Modeluj zdrowe wyrażanie emocji</h2>
<p>Dzieci uczą się obserwując dorosłych. Pokaż, jak Ty radzisz sobie z frustracją czy smutkiem.</p>

<h2>Kiedy szukać pomocy specjalisty</h2>
<p>Jeśli trudne emocje dziecka są intensywne i długotrwałe, warto skonsultować się z psychologiem dziecięcym.</p>',
  'Mgr Joanna Krawczyk',
  'Psycholog dziecięcy z 12-letnim doświadczeniem w pracy z dziećmi i rodzinami.',
  'Rodzina',
  6,
  398,
  71
);