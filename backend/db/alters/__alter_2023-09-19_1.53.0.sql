--
-- ALTER: 1.53.0
-- DATE: 19.09.2023
-- FEATURES:
-- add backroung image url to project table


\set ON_ERROR_STOP on


DO $outer$
DECLARE
  previousVersion text = '1.52.0';
  newVersion text = '1.53.0';
BEGIN
--
-- CHECK DB VERSION
--
PERFORM core.check_schema_version(previousVersion, newVersion);


--
-- START ALTER (insert statements below)
--


ALTER TABLE "project-management".project ADD COLUMN background_image_url TEXT; 

--
-- END ALTER
--


--
-- INSER NEW VERSION
--
INSERT INTO core.schema_version (version_code) VALUES(newVersion);


END $outer$;

 