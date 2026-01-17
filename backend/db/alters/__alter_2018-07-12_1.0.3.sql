
  --
  -- ALTER: 1.0.3
  -- DATE: 2018-07-13
  -- FEATURES: 
  -- * converted bunch of tables for event/user shipment log into 2 tables with
  --   discriminator key "engine_code", so that adding new analytics engine WILL NOT require
  --   adding more tables.
  --
  

\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.0.2';
DECLARE newVersion text = '1.0.3';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE TABLE analytics.engine (
    code VARCHAR(20)
      CONSTRAINT  engine_code_pk
      PRIMARY KEY ,
    name VARCHAR(200) NOT NULL
  );
  
  ALTER TABLE analytics.engine OWNER TO heyspace;

  CREATE TABLE analytics.user_shipment_log
  (
    user_id uuid NOT NULL
      CONSTRAINT fk_user_shipment_log_user_id
      REFERENCES core."user"(id)
      ON DELETE CASCADE ,
    engine_code VARCHAR(20) NOT NULL
      CONSTRAINT fk_shipment_log_engine_code
        REFERENCES analytics."engine"("code")
        ON DELETE SET NULL,
    shipment_successful BOOLEAN NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    fail_count INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT user_shipment_log_engine_code_user_id_pk PRIMARY KEY (engine_code, user_id)
  );
  
  ALTER TABLE analytics.user_shipment_log OWNER TO heyspace;

  CREATE TABLE analytics.event_shipment_log
  (
    event_id uuid NOT NULL
      CONSTRAINT fk_event_shipment_log_event_id
      REFERENCES analytics.usage_tracker_events(id)
      ON DELETE CASCADE ,
    engine_code VARCHAR(20) NOT NULL
      CONSTRAINT fk_shipment_log_engine_code
      REFERENCES analytics."engine"("code")
      ON DELETE SET NULL,
    shipment_successful BOOLEAN NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    fail_count INTEGER DEFAULT 0,

    CONSTRAINT event_shipment_log_engine_code_event_id_pk PRIMARY KEY (engine_code, event_id)
  );

  ALTER TABLE analytics.event_shipment_log OWNER TO heyspace;
  
  ALTER TABLE analytics.usage_tracker_events ADD COLUMN ip INET;
  ALTER TABLE analytics.usage_tracker_events ADD COLUMN device_id VARCHAR(500);


  -- Add predefined analytics engines
  
  INSERT INTO analytics.engine(code, name) VALUES 
    ('mixpanel', 'Mixpanel'),
    ('intercom', 'Intercom'),
    ('amplitude', 'Amplitude')
  ;
  
  -- Export from old tables to new
  INSERT INTO analytics.user_shipment_log
    (user_id, engine_code, shipment_successful, sent_at, fail_count)  
  SELECT
    s.id,
    'intercom' engine_name,
    s.shipment_successful,
    s.shipment_timestamp,
    s.shipments_count
  FROM analytics.intercom_users_shipment AS s;

  INSERT INTO analytics.user_shipment_log
    (user_id, engine_code, shipment_successful, sent_at, fail_count)
  SELECT
    s.id,
    'mixpanel' engine_name,
    s.shipment_successful,
    s.shipment_timestamp,
    s.shipments_count
  FROM analytics.mixpanel_users_shipment AS s;

  INSERT INTO analytics.event_shipment_log
  (event_id, engine_code, shipment_successful, sent_at, fail_count)
    SELECT
      s.id,
      'intercom' engine_name,
      s.shipment_successful,
      s.shipment_timestamp,
      s.shipments_count
    FROM analytics.intercom_events_shipment AS s;

  INSERT INTO analytics.event_shipment_log
  (event_id, engine_code, shipment_successful, sent_at, fail_count)
    SELECT
      s.id,
      'mixpanel' engine_name,
      s.shipment_successful,
      s.shipment_timestamp,
      s.shipments_count
    FROM analytics.mixpanel_events_shipment AS s;
  
  -- Remove old tables
  DROP TABLE analytics.mixpanel_events_shipment;
  DROP TABLE analytics.mixpanel_users_shipment;
  DROP TABLE analytics.intercom_users_shipment;
  DROP TABLE analytics.intercom_events_shipment;
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;
