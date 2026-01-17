
--
-- ALTER: 1.15.0
-- DATE: 2019-05-31
-- FEATURES:
-- * Add calendar panel type
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.14.0';
  newVersion text = '1.15.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  -- 1. rename the enum type you want to change
  alter type "project-management".project_panel_type rename to _project_panel_type;
  -- 2. create new type
  create type "project-management".project_panel_type as enum ('chat', 'kanban', 'calendar');
  -- 3. rename column(s) which uses our enum type
  alter table "project-management".project_settings rename column last_opened_panel to _last_opened_panel;
  -- 4. add new column of new type
  alter table "project-management".project_settings add last_opened_panel "project-management".project_panel_type DEFAULT 'chat'::"project-management".project_panel_type NOT NULL;
  -- 5. copy values to the new column
  update "project-management".project_settings set last_opened_panel = _last_opened_panel::text::"project-management".project_panel_type;
  -- 6. remove old column and type
  alter table "project-management".project_settings drop column _last_opened_panel;
  drop type "project-management"._project_panel_type;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
