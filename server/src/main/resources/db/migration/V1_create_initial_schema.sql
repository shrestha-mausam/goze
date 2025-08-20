-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS goze;

-- Users table
CREATE TABLE goze.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE
);

-- User settings
CREATE TABLE goze.user_settings (
  user_id UUID PRIMARY KEY REFERENCES goze.users(id) ON DELETE CASCADE,
  theme VARCHAR(50) DEFAULT 'light',
  currency VARCHAR(10) DEFAULT 'USD',
  notification_preferences JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Plaid items (connections to financial institutions)
CREATE TABLE goze.plaid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES goze.users(id) ON DELETE CASCADE,
  item_id VARCHAR(100) NOT NULL,
  access_token VARCHAR(100) NOT NULL,
  institution_id VARCHAR(50),
  institution_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id)
);

-- Financial accounts
CREATE TABLE goze.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES goze.users(id) ON DELETE CASCADE,
  plaid_item_id UUID NOT NULL REFERENCES goze.plaid_items(id) ON DELETE CASCADE,
  account_id VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  mask VARCHAR(10),
  official_name VARCHAR(200),
  type VARCHAR(50) NOT NULL,
  subtype VARCHAR(50),
  current_balance DECIMAL(19, 4),
  available_balance DECIMAL(19, 4),
  currency_code VARCHAR(3) DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, account_id)
);

-- Transaction categories
CREATE TABLE goze.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES goze.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20),
  icon VARCHAR(50),
  parent_id UUID REFERENCES goze.categories(id),
  is_income BOOLEAN DEFAULT false,
  is_system BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

-- Transactions
CREATE TABLE goze.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES goze.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES goze.accounts(id) ON DELETE CASCADE,
  plaid_transaction_id VARCHAR(100),
  amount DECIMAL(19, 4) NOT NULL,
  date DATE NOT NULL,
  name VARCHAR(255) NOT NULL,
  merchant_name VARCHAR(255),
  pending BOOLEAN DEFAULT false,
  category_id UUID REFERENCES goze.categories(id),
  plaid_category VARCHAR(100)[],
  plaid_category_id VARCHAR(50),
  location JSONB,
  payment_meta JSONB,
  notes TEXT,
  excluded_from_budget BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, plaid_transaction_id)
);

-- ML categorization model
CREATE TABLE goze.ml_categorization_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES goze.users(id) ON DELETE CASCADE,
  model_data BYTEA NOT NULL, -- Serialized ML model
  accuracy DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT true
);

-- ML training data
CREATE TABLE goze.ml_training_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES goze.users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES goze.transactions(id) ON DELETE CASCADE,
  features JSONB NOT NULL,
  category_id UUID NOT NULL REFERENCES goze.categories(id),
  is_manually_categorized BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log for financial data
CREATE TABLE goze.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES goze.users(id),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_transactions_user_date ON goze.transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON goze.transactions(user_id, category_id);
CREATE INDEX idx_transactions_account ON goze.transactions(account_id);
CREATE INDEX idx_accounts_user ON goze.accounts(user_id);
CREATE INDEX idx_categories_user ON goze.categories(user_id);
