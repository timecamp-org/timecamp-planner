
--
-- ALTER: 1.14.0
-- DATE: 2019-05-27
-- FEATURES:
-- * add hangouts extension
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.13.0';
  newVersion text = '1.14.0';
  hangouts_link_extension_id uuid = uuid_generate_v4();
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  INSERT INTO extensions.extension(id, namespace, name, description, thumbnail_url, type)
    VALUES (hangouts_link_extension_id, 'hangouts-link', 'Google Hangouts Link', 'Dedicated Hangouts videoconference link per chat.', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/4fad9a392c0ef60b33fc24c92694a184452724e9670e004bbfbd1e284f0aaa6d', 'integration');

  INSERT INTO extensions.custom_field(extension_id, name, target_type)
    VALUES (hangouts_link_extension_id, 'enabledStatus', 'organization');

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
