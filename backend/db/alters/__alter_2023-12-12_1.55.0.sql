--
-- ALTER: 1.55.0
-- DATE: 12.12.2023
-- FEATURES:
-- add order column to project_template


\set ON_ERROR_STOP on


DO $outer$
DECLARE
  previousVersion text = '1.54.0';
  newVersion text = '1.55.0';
BEGIN
--
-- CHECK DB VERSION
--
PERFORM core.check_schema_version(previousVersion, newVersion);


--
-- START ALTER (insert statements below)
--


ALTER TABLE templates.project_template ADD COLUMN "order" double precision   CHECK ("order" > 0);  

--
-- END ALTER
--


--
-- INSER NEW VERSION
--
INSERT INTO core.schema_version (version_code) VALUES(newVersion);


END $outer$;

 