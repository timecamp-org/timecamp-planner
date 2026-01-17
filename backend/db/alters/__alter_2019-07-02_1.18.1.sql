
--
-- ALTER: 1.18.0
-- DATE: 2019-06-13
-- FEATURES:
-- Add chat with me extension related stuff
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.18.0';
  newVersion text = '1.18.1';
  chat_with_me_extension_id uuid;
  chat_with_me_relation_id uuid = uuid_generate_v4();
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

    DELETE from extensions.custom_field_value where field_id = (
      SELECT id from extensions.custom_field where name = 'inviteToken' and target_type = 'user-in-organization'
    );

    DELETE from extensions.custom_field where name = 'inviteToken' and target_type = 'user-in-organization';



    SELECT id into chat_with_me_extension_id from extensions.extension where namespace = 'chat-with-me';

    INSERT INTO extensions.custom_relation(id, extension_id, name)
    VALUES 
          (chat_with_me_relation_id, chat_with_me_extension_id, 'token')
    ;

    INSERT INTO extensions.custom_relation_field(relation_id, name, reference_table, is_pk)
    VALUES 
          (chat_with_me_relation_id, 'user_in_organization_id', 'core.user_in_organization', true),
          (chat_with_me_relation_id, 'token', null, false)
    ;

  CREATE TABLE "extension-data"."chat-with-me_token" (
    user_in_organization_id UUID NOT NULL
      CONSTRAINT "chat-with-me_token_user_in_organization_fk" REFERENCES core.user_in_organization(id) PRIMARY KEY,
    token UUID NOT NULL,
    CONSTRAINT "chat-with-me_token_uniq" UNIQUE (token)
  );

  ALTER TABLE "extension-data"."chat-with-me_token" OWNER TO heyspace;
    

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
