--
-- ALTER: 1.54.0
-- DATE: 28.11.2023
-- FEATURES:
-- add backroung image url to project template


\set ON_ERROR_STOP on


DO $outer$
DECLARE
  previousVersion text = '1.53.0';
  newVersion text = '1.54.0';
BEGIN
--
-- CHECK DB VERSION
--
PERFORM core.check_schema_version(previousVersion, newVersion);


--
-- START ALTER (insert statements below)
--


ALTER TABLE templates.project_template ADD COLUMN background_image_url TEXT; 

--
-- END ALTER
--


--
-- INSER NEW VERSION
--
INSERT INTO core.schema_version (version_code) VALUES(newVersion);


END $outer$;

 