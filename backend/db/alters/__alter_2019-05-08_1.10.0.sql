
--
-- ALTER: 1.9.0
-- DATE: 2019-05-07
-- FEATURES:
-- *  add user_status table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.9.0';
  newVersion text = '1.10.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE TYPE "project-management".project_panel_type AS ENUM (
    'chat',
    'kanban'
  );

  ALTER TYPE "project-management".project_panel_type OWNER TO heyspace;

  CREATE TABLE "project-management".project_settings (
    user_id uuid NOT NULL,
    project_id uuid NOT NULL,
    last_opened_panel "project-management".project_panel_type DEFAULT 'chat'::"project-management".project_panel_type NOT NULL,
    is_right_panel_opened boolean DEFAULT true NOT NULL,

    CONSTRAINT project_settings_user_id_project_id_pk PRIMARY KEY (user_id, project_id),
    CONSTRAINT project_settings_project_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT project_settings_user_fk FOREIGN KEY (user_id) REFERENCES core.user(id) ON UPDATE CASCADE ON DELETE CASCADE
  );

  ALTER TABLE "project-management".project_settings OWNER TO heyspace;


  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
