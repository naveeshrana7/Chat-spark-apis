
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- PK auto-indexed, no manual index needed
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(50) NOT NULL,                    -- low cardinality (male/female/other) → NOT indexed
    coin_balance INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_name ON users(name);

CREATE TABLE creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- PK auto-indexed
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) DEFAULT 'Standard',            
    status VARCHAR(50) DEFAULT 'offline',           
    total_earnings DECIMAL(10, 2) DEFAULT 0.00,
    payout_account_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_creators_user_id ON creators(user_id);

CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- PK auto-indexed
    call_id VARCHAR(255) NOT NULL UNIQUE,           -- UNIQUE auto-creates an index (duplicate prevention)
    caller_id VARCHAR(255) NOT NULL,                -- who made the call (stored as plain string ID)
    creator_id VARCHAR(255) NOT NULL,               -- which creator received the call
    duration_seconds INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed',         -- low cardinality → NOT indexed
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_calls_creator_id ON calls(creator_id);
CREATE INDEX idx_calls_started_at ON calls(started_at);
CREATE INDEX idx_calls_caller_id ON calls(caller_id);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- PK auto-indexed
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,                      -- low cardinality (purchase/earning/payout) → NOT indexed alone
    amount INT NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_reference ON transactions(reference_type, reference_id);
