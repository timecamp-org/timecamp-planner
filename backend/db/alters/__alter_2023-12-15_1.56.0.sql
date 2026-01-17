  --
  -- ALTER: 1.56.0
  -- DATE: 15.12.2023
  -- FEATURES: 
  -- add pg_trgm extension
  

\set ON_ERROR_STOP on

DO $outer$
DECLARE 
  previousVersion text = '1.55.0';
  newVersion text = '1.56.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --


  CREATE INDEX task_search_project_id_idx on "project-management".task(project_id); 

  CREATE INDEX message_search_organization_id_idx on messages.message(organization_id); 
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;