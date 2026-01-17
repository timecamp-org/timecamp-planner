
--
-- ALTER: 1.41.1
-- DATE: 2022-03-24
-- FEATURES:
-- Update extension kanban limits
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.41.0';
  newVersion text = '1.41.1';
  kanban_limits_id uuid = uuid_generate_v4();
  kanban_limits_list_relation_id uuid = uuid_generate_v4();
  heyspace_free_plan_id UUID;
  heyspace_premium_monthly_plan_id UUID;
  heyspace_premium_yearly_plan_id UUID;
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  UPDATE extensions.extension set 
    name = 'Work In Progress limit', 
    description = 'WIP limit allows setting a limit of cards in the list on the board.',
    is_in_marketplace = true,
    thumbnail_url = 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/10dcbf00a9546558e8d4333e6b8faed8b39de4dfee2945c41a9d1a8fad727b06'
  WHERE namespace = 'kanban-limits'
  ;





  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
