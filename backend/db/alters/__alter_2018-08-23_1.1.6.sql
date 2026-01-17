  --
  -- ALTER: 1.1.6
  -- DATE: 23.08.2018
  -- FEATURES: 
  -- added inviterId to user table
  --
  

\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.1.5';
DECLARE newVersion text = '1.1.6';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE TABLE core.user_invitation (
    inviter_id uuid NOT NULL
      CONSTRAINT user_invitation_inviter_id_fk
      REFERENCES core."user"(id) 
      ON UPDATE CASCADE ON DELETE SET NULL,

    invited_user_id uuid NOT NULL
      CONSTRAINT user_invitation_invited_user_id_fk 
      REFERENCES core."user"(id) 
      ON UPDATE CASCADE ON DELETE SET NULL,

    organization_id uuid NOT NULL
      CONSTRAINT user_invitation_organization_id_fk 
      REFERENCES core.organization(id) 
      ON UPDATE CASCADE ON DELETE SET NULL,
    
    CONSTRAINT user_invitation_uniq UNIQUE (inviter_id, invited_user_id, organization_id)
  );

  ALTER TABLE core.user_invitation OWNER TO heyspace;
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;
