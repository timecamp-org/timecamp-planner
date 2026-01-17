
--
-- ALTER: 1.17.0
-- DATE: 2019-06-11
-- FEATURES:
-- * add invitations count
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.16.0';
  newVersion text = '1.17.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

-- 1. rename the enum type you want to change
alter type core.mail_type rename to _mail_type;
-- 2. create new type
create type core.mail_type as enum ('notReturningUsers', 'firstOnboarding', 'secondOnboarding');
-- 3. rename column(s) which uses our enum type
alter table core.user_mail_sent rename column mail_type to _mail_type;
-- 4. add new column of new type
alter table core.user_mail_sent add column mail_type core.mail_type;
-- 5. copy values to the new column
update core.user_mail_sent set mail_type = _mail_type::text::core.mail_type;
-- 6. remove old column and type
alter table core.user_mail_sent drop column _mail_type;
drop type core._mail_type;

-- add not null constraint back to the column
alter table core.user_mail_sent alter column mail_type set not null;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
