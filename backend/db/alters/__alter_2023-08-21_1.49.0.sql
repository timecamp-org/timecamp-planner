--
-- ALTER: 1.49.0
-- DATE: 21.08.2023
-- FEATURES:
-- change task time estimate hours to minutes


\set ON_ERROR_STOP on


DO $outer$
DECLARE
previousVersion text = '1.48.0';
newVersion text = '1.49.0';
BEGIN
--
-- CHECK DB VERSION
--
PERFORM core.check_schema_version(previousVersion, newVersion);


--
-- START ALTER (insert statements below)
--


ALTER TABLE "project-management".task_time_estimate
RENAME
COLUMN hours TO minutes;


UPDATE "project-management".task_time_estimate
SET 
minutes = minutes * 60;

--
-- END ALTER
--


--
-- INSER NEW VERSION
--
INSERT INTO core.schema_version (version_code) VALUES(newVersion);


END $outer$;

