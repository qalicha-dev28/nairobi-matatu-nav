-- Insert SACCOs
INSERT INTO saccos (id, name, license_number, fleet_size, reliability_score, contact_phone) VALUES
('11111111-1111-1111-1111-111111111111', 'KBS', 'KBS-001-2020', 150, 4.2, '0722123456'),
('22222222-2222-2222-2222-222222222222', 'City Hoppa', 'CH-002-2019', 120, 3.8, '0722987654'),
('33333333-3333-3333-3333-333333333333', 'Metro Trans', 'MT-003-2021', 80, 4.0, '0722567890'),
('44444444-4444-4444-4444-444444444444', 'Ngong Sacco', 'NS-004-2018', 45, 3.5, '0722345678'),
('55555555-5555-5555-5555-555555555555', 'Umoja Sacco', 'US-005-2020', 60, 4.1, '0722789012'),
('66666666-6666-6666-6666-666666666666', 'Buruburu Sacco', 'BS-006-2019', 55, 3.9, '0722901234');

-- Insert Routes
INSERT INTO routes (id, route_number, origin_zone, destination_zone, direction, popularity_score, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Route 14', 'CBD', 'Westlands', 'bidirectional', 95, 'active'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Route 4', 'CBD', 'Ngong Road', 'bidirectional', 88, 'active'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Route 9', 'CBD', 'Eastlands', 'bidirectional', 92, 'active');

-- Insert Stages for Route 14 (CBD ↔ Westlands)
INSERT INTO stages (id, name, zone, location, status, common_names) VALUES
('a1111111-1111-1111-1111-111111111111', 'Kencom', 'CBD', ST_SetSRID(ST_MakePoint(36.8219, -1.2856), 4326)::geography, 'active', ARRAY['Kencom House']),
('a2222222-2222-2222-2222-222222222222', 'Railways Stage', 'CBD', ST_SetSRID(ST_MakePoint(36.8167, -1.2833), 4326)::geography, 'active', ARRAY['Railway Station']),
('a3333333-3333-3333-3333-333333333333', 'Westlands Stage', 'Westlands', ST_SetSRID(ST_MakePoint(36.8082, -1.2684), 4326)::geography, 'active', ARRAY['Westi']),
('a4444444-4444-4444-4444-444444444444', 'Sarit Centre', 'Westlands', ST_SetSRID(ST_MakePoint(36.8030, -1.2610), 4326)::geography, 'active', ARRAY['Sarit']);

-- Insert Stages for Route 4 (CBD ↔ Ngong Road)
INSERT INTO stages (id, name, zone, location, status, common_names) VALUES
('b1111111-1111-1111-1111-111111111111', 'Railways Stage', 'CBD', ST_SetSRID(ST_MakePoint(36.8167, -1.2833), 4326)::geography, 'active', ARRAY['Railway Station']),
('b2222222-2222-2222-2222-222222222222', 'Ambassador Stage', 'CBD', ST_SetSRID(ST_MakePoint(36.8220, -1.2860), 4326)::geography, 'active', ARRAY['Ambassador Hotel']),
('b3333333-3333-3333-3333-333333333333', 'Adams Arcade', 'Ngong Road', ST_SetSRID(ST_MakePoint(36.7850, -1.2970), 4326)::geography, 'active', ARRAY['Adams']),
('b4444444-4444-4444-4444-444444444444', 'Prestige Mall Stage', 'Ngong Road', ST_SetSRID(ST_MakePoint(36.7833, -1.3000), 4326)::geography, 'active', ARRAY['Prestige']),
('b5555555-5555-5555-5555-555555555555', 'The Junction', 'Ngong Road', ST_SetSRID(ST_MakePoint(36.7750, -1.3050), 4326)::geography, 'active', ARRAY['Junction Mall']);

-- Insert Stages for Route 9 (CBD ↔ Eastlands)
INSERT INTO stages (id, name, zone, location, status, common_names) VALUES
('c1111111-1111-1111-1111-111111111111', 'Muthurwa', 'CBD', ST_SetSRID(ST_MakePoint(36.8450, -1.2830), 4326)::geography, 'active', ARRAY['Muthurwa Market']),
('c2222222-2222-2222-2222-222222222222', 'OTC Stage', 'CBD', ST_SetSRID(ST_MakePoint(36.8420, -1.2840), 4326)::geography, 'active', ARRAY['OTC']),
('c3333333-3333-3333-3333-333333333333', 'Buruburu Stage', 'Eastlands', ST_SetSRID(ST_MakePoint(36.8800, -1.2800), 4326)::geography, 'active', ARRAY['Buru']),
('c4444444-4444-4444-4444-444444444444', 'Umoja Stage', 'Eastlands', ST_SetSRID(ST_MakePoint(36.9000, -1.2700), 4326)::geography, 'active', ARRAY['Umoja 1']);

-- Insert Route Stages junctions
INSERT INTO route_stages (route_id, stage_id, sequence_order, is_origin, is_destination) VALUES
-- Route 14: CBD ↔ Westlands
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1111111-1111-1111-1111-111111111111', 1, true, false),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a2222222-2222-2222-2222-222222222222', 2, true, false),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a3333333-3333-3333-3333-333333333333', 3, false, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a4444444-4444-4444-4444-444444444444', 4, false, true),

-- Route 4: CBD ↔ Ngong Road
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b1111111-1111-1111-1111-111111111111', 1, true, false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b2222222-2222-2222-2222-222222222222', 2, true, false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b3333333-3333-3333-3333-333333333333', 3, false, false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b4444444-4444-4444-4444-444444444444', 4, false, true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b5555555-5555-5555-5555-555555555555', 5, false, true),

-- Route 9: CBD ↔ Eastlands
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'c1111111-1111-1111-1111-111111111111', 1, true, false),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'c2222222-2222-2222-2222-222222222222', 2, true, false),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'c3333333-3333-3333-3333-333333333333', 3, false, true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'c4444444-4444-4444-4444-444444444444', 4, false, true);

-- Insert Matatus
INSERT INTO matatus (id, matatu_number, route_id, sacco_id, capacity, vehicle_type, status) VALUES
-- Route 14 matatus
('m1111111-1111-1111-1111-111111111111', 'KBS 123X', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 33, 'matatu', 'active'),
('m2222222-2222-2222-2222-222222222222', 'City Hoppa 45', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 33, 'matatu', 'active'),
('m3333333-3333-3333-3333-333333333333', 'Metro Trans 78', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 14, 'matatu', 'active'),

-- Route 4 matatus
('m4444444-4444-4444-4444-444444444444', 'KBS 456Y', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 14, 'matatu', 'active'),
('m5555555-5555-5555-5555-555555555555', 'City Hoppa 12', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 33, 'matatu', 'active'),
('m6666666-6666-6666-6666-666666666666', 'Ngong Sacco 9', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 14, 'matatu', 'active'),

-- Route 9 matatus
('m7777777-7777-7777-7777-777777777777', 'Umoja Sacco 1', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', 33, 'matatu', 'active'),
('m8888888-8888-8888-8888-888888888888', 'Buruburu Sacco 22', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '66666666-6666-6666-6666-666666666666', 33, 'matatu', 'active'),
('m9999999-9999-9999-9999-999999999999', 'KBS 789Z', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 14, 'matatu', 'active');

-- Insert Fares
INSERT INTO fares (id, route_id, origin_stage_id, destination_stage_id, base_fare, peak_fare, currency) VALUES
-- Route 14 fares
('f1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 50, 70, 'KES'),
('f2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a2222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', 60, 80, 'KES'),

-- Route 4 fares
('f3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b1111111-1111-1111-1111-111111111111', 'b3333333-3333-3333-3333-333333333333', 40, 60, 'KES'),
('f4444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b1111111-1111-1111-1111-111111111111', 'b4444444-4444-4444-4444-444444444444', 50, 80, 'KES'),
('f5555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b2222222-2222-2222-2222-222222222222', 'b5555555-5555-5555-5555-555555555555', 60, 90, 'KES'),

-- Route 9 fares
('f6666666-6666-6666-6666-666666666666', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'c1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 50, 70, 'KES'),
('f7777777-7777-7777-7777-777777777777', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'c2222222-2222-2222-2222-222222222222', 'c4444444-4444-4444-4444-444444444444', 60, 80, 'KES');
