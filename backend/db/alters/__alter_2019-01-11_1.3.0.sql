
--
-- ALTER: 1.3.0
-- DATE: 2019-01-11
-- FEATURES:
-- * Add new extension - Sync with calendar
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.2.2';
  newVersion text = '1.3.0';
  calendar_extension_id uuid = uuid_generate_v4();
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

    -- Hard coded virgin extensions: 'Agile' and 'Task Voting'
  INSERT INTO extensions.extension(id, namespace, name, description, thumbnail_url)
  VALUES (calendar_extension_id, 'calendar-sync', 'Calendar Synchronisation', 'Export all your cards directly to your calendar.', 'https://tocpjptk01.execute-api.eu-central-1.amazonaws.com/dev/resize?key=360x360_b/93d5f587511a449ff967b353578675291d77b146d488c3789a427f28cdb688be');

  ALTER TABLE core.user_in_organization drop constraint user_in_organization_user_id_organization_id_pk;
  ALTER TABLE core.user_in_organization add column id UUID PRIMARY KEY NOT NULL default uuid_generate_v4();
  ALTER TABLE core.user_in_organization add constraint user_in_organization_user_id_organization_id UNIQUE (user_id, organization_id);
  ALTER TABLE core.user_in_organization add column created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;
  ALTER TABLE core.user_in_organization add column modified_at timestamp with time zone;

  -- 1. rename the enum type you want to change
  alter type extensions.custom_field_target rename to _custom_field_target;
  -- 2. create new type
  create type extensions.custom_field_target as enum ('organization', 'project', 'task', 'task-list', 'user-in-organization');
  -- 3. rename column(s) which uses our enum type
  alter table extensions.custom_field rename column target_type to _target_type;
  alter table extensions.custom_field_value rename column target_type to _target_type;
  -- 4. add new column of new type
  alter table extensions.custom_field add target_type extensions.custom_field_target DEFAULT 'organization'::extensions.custom_field_target not null;
  alter table extensions.custom_field_value add target_type extensions.custom_field_target DEFAULT 'organization'::extensions.custom_field_target not null;
  -- 5. copy values to the new column
  update extensions.custom_field set target_type = _target_type::text::extensions.custom_field_target;
  update extensions.custom_field_value set target_type = _target_type::text::extensions.custom_field_target;
  -- 6. remove old column and type
  alter table extensions.custom_field drop column _target_type;
  alter table extensions.custom_field_value drop column _target_type;
  drop type extensions._custom_field_target;


  INSERT INTO extensions.custom_field(extension_id, name, target_type)
  VALUES
         (calendar_extension_id, 'syncToken', 'user-in-organization')
  ;

  ALTER TABLE extensions.custom_field_value ADD PRIMARY KEY (id); 
  ALTER TABLE extensions.custom_field_value ADD CONSTRAINT custom_field_value_unique UNIQUE (target_type, target_id, field_id); 

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
