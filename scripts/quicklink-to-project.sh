# This command is intended to be ran by `yarn integrate <project>`

# use ENABLE_DEBUGGER to enable the debugger for the downstream project

path_to_name() {
  local base="$(basename "$1")"
  echo "$base" | tr a-z A-Z
}

if [ -z "$1" ] && [ -z "$PROJECT_PATH" ]; then
  echo "Must supply a project name or set the PROJECT_PATH env"
fi

PROJECT=${PROJECT_PATH:-../$1}
PROJECT_NAME="$(path_to_name $PROJECT)"

CURRENT_NAME=$(path_to_name $(pwd))

if [ ! -d "$PROJECT" ]; then
  echo "$(realpath $PROJECT) doesn't exist, ensure project name is correct or PROJECT_PATH is pointing to a valid directory"
  exit 1
fi

if [ ! -f "$PROJECT/scripts/quicklink.sh" ]; then
  echo "Quicklink script not found at $PROJECT/scripts/quicklink.sh, this project might not be compatible"
  exit 1
fi

yarn concurrently --kill-others --names "$CURRENT_NAME,$PROJECT_NAME" "yarn watch" "cd $PROJECT && ./scripts/quicklink.sh @artsy/reaction"