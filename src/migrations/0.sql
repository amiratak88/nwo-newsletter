CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  industry TEXT CHECK(industry IN ('consumer health', 'beauty', 'tech')) NOT NULL,
  subcategory TEXT CHECK(subcategory IN ('new product releases', 'mergers and acquisitions')) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_on_email_industry_subcategory ON subscriptions(email, industry, subcategory);
