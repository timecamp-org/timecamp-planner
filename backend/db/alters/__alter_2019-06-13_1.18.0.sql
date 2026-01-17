
--
-- ALTER: 1.18.0
-- DATE: 2019-06-13
-- FEATURES:
-- Add chat with me extension related stuff
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.17.0';
  newVersion text = '1.18.0';
  new_extension_id uuid = uuid_generate_v4();
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --
  ALTER TABLE extensions.extension add column is_in_marketplace boolean not null default true;

  INSERT INTO extensions.extension(id, namespace, name, description, thumbnail_url, type, is_in_marketplace)
    VALUES (new_extension_id, 'chat-with-me', 'Chat With Me', '', '', 'internal', false);

  INSERT INTO extensions.custom_field(extension_id, name, target_type)
    VALUES (new_extension_id, 'inviteToken', 'user-in-organization');

  INSERT INTO extensions.custom_field(extension_id, name, target_type)
    VALUES (new_extension_id, 'inviterId', 'user-in-organization');

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
