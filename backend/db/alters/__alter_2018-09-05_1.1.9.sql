  --
  -- ALTER: 1.1.9
  -- DATE: 2018-09-05
  -- FEATURES: 
  -- added organization to activity target types
  --
  

\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.1.8';
DECLARE newVersion text = '1.1.9';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE extensions.custom_field ADD COLUMN generate_activities boolean not null default false;

  UPDATE extensions.custom_field SET generate_activities = true where name = 'estimatedEffort';

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;
