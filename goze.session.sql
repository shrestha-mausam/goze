CREATE TABLE goze.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true, -- is_active is used to determine if the user is active and can access the system   
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE
);

CREATE TABLE goze.plaid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES goze.users(id) ON DELETE CASCADE,
  item_id VARCHAR(100) NOT NULL,
  access_token VARCHAR(100) NOT NULL,
  cursor VARCHAR(256),
  institution_id VARCHAR(50),
  institution_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id)
);

CREATE TABLE goze.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES goze.users(id) ON DELETE CASCADE,
  plaid_item_id UUID NOT NULL REFERENCES goze.plaid_items(id) ON DELETE CASCADE,
  account_id VARCHAR(255) NOT NULL,
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
  UNIQUE(user_id, account_id),
  UNIQUE(account_id)
);

-- Transactions
CREATE TABLE goze.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES goze.users(id) ON DELETE CASCADE,
  account_id VARCHAR(255) NOT NULL REFERENCES goze.accounts(account_id) ON DELETE CASCADE,
  plaid_transaction_id VARCHAR(100),
  amount DECIMAL(19, 4) NOT NULL,
  date DATE NOT NULL,
  name VARCHAR(255) NOT NULL,
  merchant_name VARCHAR(255),
  pending BOOLEAN DEFAULT false,
  plaid_category VARCHAR(255),
  location JSONB,
  payment_meta JSONB,
  notes TEXT,
  excluded_from_budget BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, plaid_transaction_id)
);