
--
-- ALTER: 1.43.0
-- DATE: 2022-11-02
-- FEATURES:
-- new view container type
\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.42.0';
  newVersion text = '1.43.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --


-- 1. rename the enum type you want to change
alter type settings.view_container_type rename to _view_container_type;
-- 2. create new type
create type settings.view_container_type as enum (
     'organization',
     'project',
     'task',
     'overwatchSpaceTile',
     'conversation',
     'myTasks',
     'schedule'
  );
-- 3. rename column(s) which uses our enum type
alter table settings.view_settings rename column container_type to _container_type;
-- 4. add new column of new type
alter table settings.view_settings add column container_type settings.view_container_type;
-- 5. copy values to the new column
update settings.view_settings set container_type = _container_type::text::settings.view_container_type;
-- 6. remove old column and type
alter table settings.view_settings drop column _container_type;
drop type settings._view_container_type;

-- add not null constraint back to the column
alter table settings.view_settings alter column container_type set not null;

insert into dictionaries.view_type (id, value, label) values (uuid_generate_v4(), 'schedule', 'Schedule');

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
