  --
  -- ALTER: 1.47.0
  -- DATE: 05.06.2023
  -- FEATURES: 
  -- added project file relation
  

\set ON_ERROR_STOP on

DO $outer$
DECLARE 
  previousVersion text = '1.46.0';
  newVersion text = '1.47.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --
CREATE TABLE "project-management".project_file (
  project_id uuid NOT NULL, 
  file_id uuid NOT NULL,
  CONSTRAINT "project_file_project_id_fk" FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON DELETE CASCADE,
  CONSTRAINT "project_file_file_id_fk" FOREIGN KEY  (file_id) REFERENCES "messages".file(id) ON DELETE CASCADE,
  UNIQUE (project_id, file_id)
  );

 

ALTER TABLE "project-management".project_file OWNER to heyspace;

DROP TRIGGER IF EXISTS watched_project_file_table_trigger 
ON "project-management".project_file;
CREATE TRIGGER watched_project_file_table_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON "project-management".project_file
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('file_id');


  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;