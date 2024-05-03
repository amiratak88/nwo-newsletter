CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  industry TEXT CHECK(industry IN ('consumer health', 'beauty', 'tech')) NOT NULL,
  source TEXT CHECK(source IN ('social media', 'news')) NOT NULL,
  subcategory TEXT CHECK(subcategory IN ('new product releases', 'mergers and acquisitions')) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_on_email_industry_source_subcategory ON subscriptions(email, industry, source, subcategory);
