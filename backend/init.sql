-- Create batches table
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    origin TEXT NOT NULL,
    harvest_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp DATE NOT NULL,
    location TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_batch_id ON events(batch_id);
CREATE INDEX IF NOT EXISTS idx_batches_product_name ON batches(product_name);

-- Enable Row Level Security (RLS)
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON batches
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON events
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON batches
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert access for authenticated users" ON events
    FOR INSERT WITH CHECK (true); 