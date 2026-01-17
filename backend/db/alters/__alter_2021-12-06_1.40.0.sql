
--
-- ALTER: 1.40.0
-- DATE: 2021-12-06
-- FEATURES:
-- add user_in_organization_settings table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.39.0';
  newVersion text = '1.40.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  PERFORM dictionaries.create_dict('user_in_organization_settings_type', 'text');

  insert into dictionaries.user_in_organization_settings_type (value, label) VALUES 
  ('chats_retention', 'Chats retention');

    -- table name in format <namespace>_<some-relation-name>
  CREATE TABLE "settings"."user_in_organization_settings" (
    id UUID NOT NULL
      DEFAULT uuid_generate_v4()
      CONSTRAINT "user_in_organization_settings_pk" PRIMARY KEY,
    user_in_organization_id UUID NOT NULL
      CONSTRAINT "user_in_organization_settings_user_fk" REFERENCES "core".user_in_organization(id),
     "value" jsonb NOT NULL,
     type_id UUID NOT NULL,
     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "user_in_organization_settings_user_uniq" UNIQUE (user_in_organization_id),
    CONSTRAINT user_in_organization_settings_type_fk FOREIGN KEY (type_id) REFERENCES dictionaries.user_in_organization_settings_type(id)
  );

  ALTER TABLE "settings"."user_in_organization_settings" OWNER TO heyspace;

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
