
--
-- ALTER: 1.26.1
-- DATE: 2020-01-20
-- FEATURES:
-- Add missing external_tag_id relation table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.26.0';
  newVersion text = '1.26.1';
  trello_extension_id uuid;
  trello_tag_relation_id uuid = uuid_generate_v4();
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  SELECT id into trello_extension_id from extensions.extension where namespace = 'trello-data-import';

  INSERT INTO extensions.custom_relation(id, extension_id, name)
  VALUES 
         (trello_tag_relation_id, trello_extension_id, 'external_tag_id')
  ;

  INSERT INTO extensions.custom_relation_field(relation_id, name, reference_table, is_pk)
  VALUES 
         (trello_tag_relation_id, 'tag_id', 'project-management.tag', true),
         (trello_tag_relation_id, 'organization_id', 'core.organization', true),
         (trello_tag_relation_id, 'external_tag_id', null, true)
  ;
  
  CREATE TABLE "extension-data"."trello-data-import_external_tag_id" (
    tag_id UUID NOT NULL
      CONSTRAINT "external_tag_tag_fk" REFERENCES "project-management".tag(id) 
      ON UPDATE CASCADE ON DELETE CASCADE,
    organization_id UUID NOT NULL
      CONSTRAINT "external_tag_organization_fk" REFERENCES "core".organization(id) 
      ON UPDATE CASCADE ON DELETE CASCADE,
    external_tag_id text NOT NULL,
    
    CONSTRAINT "external_tag_external_tag_organization_pk"
      UNIQUE (organization_id, external_tag_id),

    CONSTRAINT "external_tag_tag_organization_pk"
      UNIQUE (organization_id, tag_id),

    CONSTRAINT "external_tag_external_tag_tag_organization_pk"
      UNIQUE (organization_id, tag_id, external_tag_id)
  );
  ALTER TABLE "extension-data"."trello-data-import_external_tag_id" OWNER TO heyspace;

  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
