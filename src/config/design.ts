export const designTokens = {
  brand: {
    name: "Deep Blue",
    description: "Professional, trustworthy — fits news/analysis",
  },
  sentiment: {
    positive: { color: "var(--sentiment-positive)", bg: "var(--sentiment-positive-bg)" },
    negative: { color: "var(--sentiment-negative)", bg: "var(--sentiment-negative-bg)" },
    neutral: { color: "var(--sentiment-neutral)", bg: "var(--sentiment-neutral-bg)" },
  },
  rating: {
    star: "var(--rating-star)",
    starEmpty: "var(--rating-star-empty)",
  },
  spacing: {
    page: "px-4 sm:px-6 lg:px-8",
    section: "py-6 sm:py-8 lg:py-10",
    card: "p-4 sm:p-6",
  },
  typography: {
    h1: "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight",
    h2: "text-xl sm:text-2xl font-semibold tracking-tight",
    h3: "text-lg sm:text-xl font-semibold",
    body: "text-sm sm:text-base leading-relaxed",
    small: "text-xs sm:text-sm text-muted-foreground",
  },
  articleCard: {
    wrapper: "rounded-xl border bg-card p-4 sm:p-5 hover:shadow-md transition-shadow",
    title: "text-base sm:text-lg font-semibold leading-snug line-clamp-2",
    summary: "text-sm text-muted-foreground line-clamp-3 mt-2",
    meta: "flex items-center gap-2 text-xs text-muted-foreground mt-3",
  },
  badge: {
    source: "bg-brand-100 text-brand-700 dark:bg-brand-800 dark:text-brand-200",
    category: "bg-muted text-muted-foreground",
    sentimentPositive: "bg-sentiment-positive-bg text-sentiment-positive",
    sentimentNegative: "bg-sentiment-negative-bg text-sentiment-negative",
    sentimentNeutral: "bg-sentiment-neutral-bg text-sentiment-neutral",
  },
} as const

export const ratings = {
  min: 1,
  max: 5,
  labels: {
    1: "Not useful",
    2: "Below average",
    3: "Decent",
    4: "Good",
    5: "Excellent",
  },
} as const

export const scheduleOptions = [
  { value: "*/30 * * * *", label: "Every 30 minutes" },
  { value: "0 * * * *", label: "Every hour" },
  { value: "0 */6 * * *", label: "Every 6 hours" },
  { value: "0 0 * * *", label: "Daily at midnight" },
  { value: "0 0 * * 0", label: "Weekly (Sunday)" },
  { value: "custom", label: "Custom cron" },
] as const
