set -e

find packages app "$@" -iname 'package.json' -not -path '*/node_modules/*' \
  -execdir pwd \; -execdir yarn \;
