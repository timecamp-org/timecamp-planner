  --
  -- ALTER: 1.48.0
  -- DATE: 13.06.2023
  -- FEATURES: 
  -- add task priorities
  

\set ON_ERROR_STOP on

DO $outer$
DECLARE 
  previousVersion text = '1.47.0';
  newVersion text = '1.48.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --


PERFORM dictionaries.create_dict('task_priority_type', 'text');

INSERT INTO dictionaries.task_priority_type (value, label) VALUES 
('urgent', 'Urgent'),
('high', 'High'),
('normal', 'Normal'),
('low', 'Low');

ALTER TABLE "project-management".task ADD COLUMN task_priority_type character varying(7) NULL;



  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;