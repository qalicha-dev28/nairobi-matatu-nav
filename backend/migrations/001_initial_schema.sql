-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- SACCOs table
CREATE TABLE IF NOT EXISTS saccos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    license_number VARCHAR(50) UNIQUE,
    fleet_size INT DEFAULT 0,
    reliability_score DECIMAL(2,1) DEFAULT 0.0 CHECK (reliability_score >= 0 AND reliability_score <= 5),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_number VARCHAR(20) NOT NULL,
    origin_zone VARCHAR(100) NOT NULL,
    destination_zone VARCHAR(100) NOT NULL,
    direction VARCHAR(20) DEFAULT 'bidirectional' CHECK (direction IN ('inbound', 'outbound', 'bidirectional')),
    popularity_score INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deprecated')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route_number, origin_zone, destination_zone)
);

-- Stages table with PostGIS
CREATE TABLE IF NOT EXISTS stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'relocated')),
    common_names VARCHAR(100)[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Route stages junction table
CREATE TABLE IF NOT EXISTS route_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
    sequence_order INT NOT NULL,
    is_origin BOOLEAN DEFAULT FALSE,
    is_destination BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route_id, stage_id)
);

-- Matatus table
CREATE TABLE IF NOT EXISTS matatus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matatu_number VARCHAR(50) NOT NULL,
    route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
    sacco_id UUID REFERENCES saccos(id) ON DELETE SET NULL,
    capacity INT DEFAULT 14,
    vehicle_type VARCHAR(20) DEFAULT 'matatu' CHECK (vehicle_type IN ('matatu', 'bus', 'shuttle')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'retired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fares table
CREATE TABLE IF NOT EXISTS fares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    origin_stage_id UUID NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
    destination_stage_id UUID NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
    base_fare DECIMAL(10,2) NOT NULL,
    peak_fare DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'KES',
    effective_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_routes_origin ON routes(origin_zone);
CREATE INDEX IF NOT EXISTS idx_routes_destination ON routes(destination_zone);
CREATE INDEX IF NOT EXISTS idx_routes_origin_destination ON routes(origin_zone, destination_zone);
CREATE INDEX IF NOT EXISTS idx_stages_zone ON stages(zone);
CREATE INDEX IF NOT EXISTS idx_stages_location ON stages USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_matatus_route ON matatus(route_id);
CREATE INDEX IF NOT EXISTS idx_matatus_sacco ON matatus(sacco_id);
CREATE INDEX IF NOT EXISTS idx_fares_route ON fares(route_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_saccos_updated_at BEFORE UPDATE ON saccos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stages_updated_at BEFORE UPDATE ON stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matatus_updated_at BEFORE UPDATE ON matatus FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fares_updated_at BEFORE UPDATE ON fares FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
