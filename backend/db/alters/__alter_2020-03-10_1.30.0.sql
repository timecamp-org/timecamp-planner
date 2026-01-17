
--
-- ALTER: 1.30.0
-- DATE: 2020-03-10
-- FEATURES:
-- Add view configuration table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.29.0';
  newVersion text = '1.30.0';
  heyspace_premium_monthly_plan_id UUID;
  heyspace_premium_yearly_plan_id UUID;
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE SCHEMA IF NOT EXISTS settings;
  ALTER SCHEMA settings OWNER TO heyspace;

  CREATE SCHEMA IF NOT EXISTS dictionaries;
  ALTER SCHEMA dictionaries OWNER TO heyspace;

  CREATE OR REPLACE FUNCTION dictionaries.create_dict(dict_name text, value_type text)
    RETURNS VOID AS
  $func$
  BEGIN

  EXECUTE format('
    CREATE TABLE IF NOT EXISTS dictionaries.%1$s (
        id UUID NOT NULL DEFAULT uuid_generate_v4() CONSTRAINT %1$s_id_pk PRIMARY KEY,
        value %2$s NOT NULL,
        label text,
        
        CONSTRAINT %1$s_uniq UNIQUE (value)
    );
    ALTER TABLE dictionaries.%1$s OWNER TO heyspace;
    ', dict_name, value_type);

  END
  $func$ LANGUAGE plpgsql;

  PERFORM dictionaries.create_dict('view_type', 'text');

  insert into dictionaries.view_type (value, label) VALUES 
  ('overwatch', 'OverWatch'),
  ('timeline', 'Timeline');
  

  create type settings.view_container_type as enum (
     'organization',
     'project',
     'task'
  );

   -- View settings
  CREATE TABLE settings.view_settings (
      id UUID NOT NULL DEFAULT uuid_generate_v4() CONSTRAINT view_settings_id_pk PRIMARY KEY,
      view_type_id UUID NOT NULL,
      user_id UUID NOT NULL,
      container_id UUID NOT NULL,
      container_type settings.view_container_type NOT NULL,
      settings jsonb NOT NULL,
      
      CONSTRAINT view_settings_uniq UNIQUE (user_id, view_type_id, container_id),
      CONSTRAINT view_settings_user_id_fk FOREIGN KEY (user_id) REFERENCES core.user(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT view_settings_view_type_fk FOREIGN KEY (view_type_id) REFERENCES dictionaries.view_type(id)
  );
  ALTER TABLE settings.view_settings OWNER TO heyspace;

     -- Linked view settings
  CREATE TABLE settings.linked_view_settings (
      base_view_settings_id UUID NOT NULL,
      linked_view_settings_id UUID NOT NULL,
      
      CONSTRAINT linked_view_settings_uniq UNIQUE (base_view_settings_id, linked_view_settings_id),
      CONSTRAINT linked_view_settings_base_view_id_fk FOREIGN KEY (base_view_settings_id) REFERENCES settings.view_settings(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT linked_view_settings_linked_view_id_fk FOREIGN KEY (linked_view_settings_id) REFERENCES settings.view_settings(id) ON UPDATE CASCADE ON DELETE CASCADE
  );
  ALTER TABLE settings.linked_view_settings OWNER TO heyspace;

  select id from payments.subscription_plan where plan_code = 'heyspace-premium-monthly' into heyspace_premium_monthly_plan_id;
  select id from payments.subscription_plan where plan_code = 'heyspace-premium-yearly' into heyspace_premium_yearly_plan_id;

  INSERT INTO payments.plan_feature
    (plan_id, code, value)
    VALUES 
    (heyspace_premium_monthly_plan_id, 'overwatch', '{"isAllowed": true}'),
    (heyspace_premium_yearly_plan_id, 'overwatch', '{"isAllowed": true}');

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
