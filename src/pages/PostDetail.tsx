import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Clock, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2,
  Calendar
} from "lucide-react";

// Mock data - extended with full content
const allPosts = [
  {
    id: 1,
    title: "The Future of Remote Work: Insights from Industry Leaders",
    excerpt: "Discover how top executives are reshaping workplace culture and what it means for your career.",
    content: `
      <p>The landscape of work has fundamentally shifted in recent years. What was once considered a perk—working from home—has become a standard expectation for many professionals. But what does this mean for the future of our careers and organizations?</p>
      
      <h2>The New Normal</h2>
      <p>After interviewing over 50 Fortune 500 executives, a clear pattern emerges: hybrid work is here to stay. Companies that resist this shift are finding it increasingly difficult to attract top talent.</p>
      
      <p>"We've seen a 40% increase in qualified applicants since implementing our flexible work policy," shares one tech CEO. "The talent pool has become truly global."</p>
      
      <h2>Key Strategies for Success</h2>
      <p>Whether you're an employee navigating this new world or a leader trying to optimize your team's performance, here are the essential strategies:</p>
      
      <ul>
        <li><strong>Establish clear communication protocols</strong> - Define when to use email vs. chat vs. video calls</li>
        <li><strong>Create intentional connection moments</strong> - Schedule regular virtual coffee chats and team bonding sessions</li>
        <li><strong>Invest in your home office</strong> - A proper setup pays dividends in productivity and health</li>
        <li><strong>Set boundaries</strong> - The always-on culture is a real risk; protect your personal time</li>
      </ul>
      
      <h2>Looking Ahead</h2>
      <p>The companies that will thrive in this new era are those that view remote work not as a compromise, but as an opportunity. An opportunity to access global talent, reduce overhead costs, and create a more inclusive workplace.</p>
      
      <p>The future of work isn't about where you work—it's about how you work. And that's an exciting proposition for everyone.</p>
    `,
    author: "Marcus Reid",
    authorBio: "Former Fortune 500 executive and startup advisor with 20+ years of leadership experience.",
    category: "Business",
    readTime: 8,
    likes: 234,
    comments: 45,
    date: "Dec 15, 2024",
  },
  {
    id: 2,
    title: "5 Evidence-Based Strategies for Better Sleep",
    excerpt: "Sleep expert Dr. Chen shares proven techniques to improve your sleep quality tonight.",
    content: `
      <p>Quality sleep is the foundation of good health, yet millions struggle to get enough rest. As a physician specializing in integrative medicine, I've helped countless patients transform their sleep through evidence-based approaches.</p>
      
      <h2>Why Sleep Matters</h2>
      <p>Sleep isn't just about feeling rested—it's when your body repairs itself, consolidates memories, and regulates crucial hormones. Chronic sleep deprivation has been linked to obesity, heart disease, and cognitive decline.</p>
      
      <h2>Strategy 1: The 10-3-2-1 Rule</h2>
      <p>This simple framework can revolutionize your sleep:</p>
      <ul>
        <li><strong>10 hours before bed:</strong> No more caffeine</li>
        <li><strong>3 hours before bed:</strong> No more food or alcohol</li>
        <li><strong>2 hours before bed:</strong> No more work</li>
        <li><strong>1 hour before bed:</strong> No more screens</li>
      </ul>
      
      <h2>Strategy 2: Temperature Optimization</h2>
      <p>Your body temperature naturally drops when you sleep. Help this process by keeping your bedroom cool (65-68°F or 18-20°C) and taking a warm shower before bed—the subsequent cooling helps trigger sleepiness.</p>
      
      <h2>Strategy 3: Light Exposure</h2>
      <p>Get bright light exposure within 30 minutes of waking to set your circadian rhythm. In the evening, dim lights and use warm-toned lighting to signal to your body that sleep is approaching.</p>
      
      <h2>Strategy 4: Consistent Schedule</h2>
      <p>Your body thrives on routine. Try to go to bed and wake up at the same time every day—even on weekends. This consistency reinforces your natural sleep-wake cycle.</p>
      
      <h2>Strategy 5: Create a Sleep Sanctuary</h2>
      <p>Your bedroom should be reserved for sleep and intimacy only. Remove TVs, work materials, and exercise equipment. Invest in a quality mattress and pillows—you spend a third of your life in bed.</p>
      
      <p>Implementing even one of these strategies can improve your sleep. Start tonight, and experience the difference quality rest makes.</p>
    `,
    author: "Dr. Sarah Chen",
    authorBio: "Board-certified physician with 15+ years in integrative medicine, specializing in preventive care.",
    category: "Health",
    readTime: 5,
    likes: 567,
    comments: 89,
    date: "Dec 14, 2024",
  },
  {
    id: 3,
    title: "AI in Healthcare: What Patients Need to Know",
    excerpt: "How artificial intelligence is transforming diagnosis and treatment options.",
    content: `
      <p>Artificial intelligence is no longer science fiction—it's actively reshaping how we approach healthcare. From early disease detection to personalized treatment plans, AI is opening doors that seemed impossible just a decade ago.</p>
      
      <h2>Current Applications</h2>
      <p>AI is already making a difference in several key areas:</p>
      
      <ul>
        <li><strong>Medical imaging:</strong> AI can detect certain cancers in mammograms and CT scans with accuracy matching or exceeding human radiologists</li>
        <li><strong>Drug discovery:</strong> Machine learning is accelerating the identification of promising drug candidates</li>
        <li><strong>Personalized medicine:</strong> AI analyzes genetic data to recommend tailored treatments</li>
        <li><strong>Administrative efficiency:</strong> Automation of scheduling, billing, and documentation frees up time for patient care</li>
      </ul>
      
      <h2>What This Means for You</h2>
      <p>As a patient, you may encounter AI in several ways:</p>
      
      <p><strong>Faster diagnoses:</strong> AI-assisted analysis can speed up results for certain tests, getting you answers and treatment sooner.</p>
      
      <p><strong>Second opinions:</strong> AI can serve as a valuable check on human diagnosis, potentially catching conditions that might otherwise be missed.</p>
      
      <p><strong>Continuous monitoring:</strong> Wearable devices combined with AI can track your health metrics and alert you to potential issues before they become serious.</p>
      
      <h2>The Human Element Remains Essential</h2>
      <p>While AI is a powerful tool, it's important to understand what it isn't: a replacement for human doctors. The best healthcare combines AI's analytical power with human empathy, intuition, and judgment.</p>
      
      <p>Your doctor remains your partner in health—AI simply gives them better tools to help you.</p>
    `,
    author: "Emily Torres",
    authorBio: "AI researcher and tech entrepreneur with expertise in healthcare technology applications.",
    category: "Technology",
    readTime: 6,
    likes: 189,
    comments: 32,
    date: "Dec 13, 2024",
  },
  {
    id: 4,
    title: "Building Wealth in Your 30s: A Comprehensive Guide",
    excerpt: "Financial strategies that can set you up for long-term success and early retirement.",
    content: `
      <p>Your 30s are a pivotal decade for building wealth. You're likely earning more than you did in your 20s, and you still have decades of compound growth ahead of you. Here's how to make the most of this crucial time.</p>
      
      <h2>The Power of Starting Now</h2>
      <p>Every year you delay investing costs you significantly. Someone who invests $500/month starting at 30 will have roughly $1.1 million at 65 (assuming 7% returns). Wait until 40, and that number drops to about $500,000—less than half.</p>
      
      <h2>Priority 1: Maximize Retirement Contributions</h2>
      <p>If your employer offers a 401(k) match, this is free money. Contribute at least enough to get the full match. Beyond that, consider maxing out your annual contributions if possible.</p>
      
      <h2>Priority 2: Build Your Emergency Fund</h2>
      <p>Before aggressive investing, ensure you have 3-6 months of expenses saved in a high-yield savings account. This protects you from having to sell investments at a loss during emergencies.</p>
      
      <h2>Priority 3: Pay Off High-Interest Debt</h2>
      <p>Any debt with interest rates above 7% should generally be paid off before investing. The guaranteed "return" of eliminating this debt usually beats market returns.</p>
      
      <h2>Investment Strategy: Keep It Simple</h2>
      <p>For most people, a simple portfolio of low-cost index funds is the best approach:</p>
      <ul>
        <li>Total stock market index fund (domestic)</li>
        <li>International stock index fund</li>
        <li>Bond index fund (allocation depends on risk tolerance)</li>
      </ul>
      
      <h2>The Lifestyle Inflation Trap</h2>
      <p>As your income grows, resist the urge to inflate your lifestyle proportionally. The wealth-building magic happens when you invest your raises rather than spend them.</p>
      
      <p>Your 30s are the foundation for your financial future. The habits you build now will echo for decades.</p>
    `,
    author: "Lisa Wang",
    authorBio: "Certified Financial Planner™ helping clients build wealth for over 10 years.",
    category: "Finance",
    readTime: 12,
    likes: 445,
    comments: 67,
    date: "Dec 12, 2024",
  },
  {
    id: 5,
    title: "Navigating Career Transitions Successfully",
    excerpt: "How to pivot your career without starting from scratch - lessons from 500+ professionals.",
    content: `
      <p>Changing careers can feel daunting—like abandoning years of experience to start over. But here's the truth: you're never really starting from scratch. Your skills, relationships, and experiences all transfer in ways you might not expect.</p>
      
      <h2>The Myth of Starting Over</h2>
      <p>In my work with over 500 career changers, I've seen accountants become UX designers, teachers become product managers, and lawyers become entrepreneurs. In every case, their previous experience became an asset, not a liability.</p>
      
      <h2>Step 1: Identify Your Transferable Skills</h2>
      <p>Make a list of everything you do well, regardless of your job title. Communication, project management, problem-solving, client relationships—these skills translate across industries.</p>
      
      <h2>Step 2: Find the Bridge</h2>
      <p>Look for roles that combine what you know with what you want to learn. A marketing professional moving into data science might start as a marketing analyst, using their industry knowledge while building technical skills.</p>
      
      <h2>Step 3: Build Evidence</h2>
      <p>You need to prove you can do the new job before someone will hire you for it. This might mean:</p>
      <ul>
        <li>Taking on relevant projects in your current role</li>
        <li>Freelancing or consulting in your target field</li>
        <li>Building a portfolio of personal projects</li>
        <li>Earning relevant certifications</li>
      </ul>
      
      <h2>Step 4: Network Strategically</h2>
      <p>80% of jobs are filled through networking. Focus on building genuine relationships in your target industry. Attend events, join online communities, and don't be afraid to reach out to people for informational interviews.</p>
      
      <h2>The Courage to Change</h2>
      <p>Career transitions require courage. There will be moments of doubt. But the professionals who've made successful transitions consistently report higher job satisfaction and renewed energy for their work.</p>
      
      <p>Your experience is an asset. Your transferable skills are valuable. The right opportunity is out there—you just need to bridge the gap.</p>
    `,
    author: "Alex Rivera",
    authorBio: "Executive coach who has helped 500+ professionals successfully transition careers.",
    category: "Career",
    readTime: 7,
    likes: 312,
    comments: 54,
    date: "Dec 11, 2024",
  },
  {
    id: 6,
    title: "The Science of Stress Management",
    excerpt: "Understanding your stress response and practical tools to manage it effectively.",
    content: `
      <p>Stress is not inherently bad—it's a natural response that helped our ancestors survive. But in today's world of constant connectivity and endless demands, our stress response often works against us. Understanding the science can help you regain control.</p>
      
      <h2>The Stress Response Explained</h2>
      <p>When you perceive a threat, your amygdala triggers the release of cortisol and adrenaline. Your heart rate increases, muscles tense, and non-essential functions (like digestion) slow down. This "fight or flight" response is perfect for escaping a predator—less helpful when responding to a difficult email.</p>
      
      <h2>Chronic Stress: The Silent Damage</h2>
      <p>While acute stress can be beneficial, chronic stress wreaks havoc on your body and mind:</p>
      <ul>
        <li>Impaired immune function</li>
        <li>Increased inflammation</li>
        <li>Memory and concentration problems</li>
        <li>Anxiety and depression risk</li>
        <li>Cardiovascular strain</li>
      </ul>
      
      <h2>Evidence-Based Management Strategies</h2>
      
      <p><strong>1. Physiological Sigh:</strong> The fastest way to calm your nervous system is the "physiological sigh"—a double inhale through the nose followed by a long exhale through the mouth. This activates your parasympathetic nervous system within seconds.</p>
      
      <p><strong>2. Regular Exercise:</strong> Physical activity metabolizes stress hormones and releases endorphins. Even a 20-minute walk can significantly reduce stress levels.</p>
      
      <p><strong>3. Sleep Prioritization:</strong> Sleep deprivation amplifies the stress response. Prioritizing 7-9 hours of quality sleep is one of the most powerful stress management tools.</p>
      
      <p><strong>4. Cognitive Reframing:</strong> How we interpret situations affects our stress response. Practice asking: "What's another way to look at this?"</p>
      
      <p><strong>5. Social Connection:</strong> Human connection triggers the release of oxytocin, which counters stress hormones. Don't isolate when stressed—reach out.</p>
      
      <h2>Building Resilience</h2>
      <p>The goal isn't to eliminate stress—that's impossible. The goal is to build resilience: the ability to recover quickly and maintain function under pressure. With practice, you can train your nervous system to respond more adaptively to life's challenges.</p>
    `,
    author: "Dr. James Okonkwo",
    authorBio: "Licensed clinical psychologist specializing in cognitive behavioral therapy and stress management.",
    category: "Health",
    readTime: 9,
    likes: 398,
    comments: 71,
    date: "Dec 10, 2024",
  },
];

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const post = allPosts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Nie znaleziono artykułu</h1>
            <p className="text-muted-foreground mb-4">Przepraszamy, ten artykuł nie istnieje.</p>
            <Link to="/posts">
              <Button>Wróć do artykułów</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout>
      <article className="py-6 md:py-12 gradient-hero min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Wróć</span>
          </button>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                {post.readTime} min czytania
              </div>
            </div>

            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              {post.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent text-primary font-semibold">
                    {getInitials(post.author)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{post.author}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Bookmark className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-[16/9] bg-gradient-to-br from-accent to-primary/20 rounded-2xl mb-8" />

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none mb-8
              prose-headings:font-display prose-headings:text-foreground prose-headings:font-semibold
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
              prose-ul:text-muted-foreground prose-ul:my-4
              prose-li:my-1
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Card */}
          <div className="gradient-card rounded-2xl shadow-card p-6 mb-8">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent text-primary text-xl font-semibold">
                  {getInitials(post.author)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Autor artykułu</p>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {post.author}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {post.authorBio}
                </p>
                <Link to="/experts">
                  <Button variant="outline" size="sm">
                    Zobacz profil
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Engagement Bar */}
          <div className="flex items-center justify-between py-4 border-t border-b border-border">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Heart className="w-5 h-5" />
                <span className="font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{post.comments}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Udostępnij
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Zapisz
              </Button>
            </div>
          </div>

          {/* Related Posts CTA */}
          <div className="text-center py-8">
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Chcesz przeczytać więcej?
            </h3>
            <p className="text-muted-foreground mb-4">
              Odkryj więcej artykułów od naszych ekspertów
            </p>
            <Link to="/posts">
              <Button>Przeglądaj wszystkie artykuły</Button>
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default PostDetail;
