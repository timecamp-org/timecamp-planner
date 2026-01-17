
--
-- ALTER: 1.7.0
-- DATE: 2019-04-01
-- FEATURES:
-- * add additional roles to workspace
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.6.0';
  newVersion text = '1.7.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  -- Organization role

  -- 1. rename the enum type you want to change
  alter type core.organization_role rename to _organization_role;
  -- 2. create new type
  create type core.organization_role as enum ('owner', 'admin', 'member', 'guest');
  -- 3. rename column(s) which uses our enum type
  alter table core.user_in_organization rename column role to _role;
  -- 4. add new column of new type
  alter table core.user_in_organization add role core.organization_role DEFAULT 'member'::core.organization_role not null;
  -- 5. copy values to the new column
  update core.user_in_organization set role = _role::text::core.organization_role;
  -- 6. remove old column and type
  alter table core.user_in_organization drop column _role;
  drop type core._organization_role;

  CREATE OR REPLACE VIEW stats.organization_count_non_timecamp
  AS SELECT count(*) AS organization_count_non_timecamp
    FROM ( SELECT "substring"(u.email::text, '@(.*)$'::text) AS organization_owner_email_domain
            FROM core.organization o
              JOIN core.user_in_organization uio ON uio.organization_id = o.id
              JOIN core."user" u ON u.id = uio.user_id
            WHERE uio.role = 'owner'::core.organization_role) x
    WHERE x.organization_owner_email_domain <> 'timecamp.com'::text AND x.organization_owner_email_domain <> 'hey.space'::text;

  ALTER VIEW stats.organization_count_non_timecamp OWNER TO heyspace;

  CREATE OR REPLACE VIEW stats.user_to_organization_ratio_non_timecamp
  AS SELECT (( SELECT user_count_non_timecamp.user_count_non_timecamp
           FROM stats.user_count_non_timecamp)) * 1000000 / (( SELECT organization_count_non_timecamp.organization_count_non_timecamp
           FROM stats.organization_count_non_timecamp)) AS user_to_organization_ratio_non_timecamp;

  ALTER VIEW stats.user_to_organization_ratio_non_timecamp OWNER TO heyspace;
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
