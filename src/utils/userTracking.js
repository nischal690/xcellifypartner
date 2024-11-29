const USER_ACTIONS_KEY = "userActions";

export function trackUserAction(action, path) {
  const actions = JSON.parse(localStorage.getItem(USER_ACTIONS_KEY)) || [];

  const newAction = { action, path, timestamp: new Date().toISOString() };
  actions.unshift(newAction);

  localStorage.setItem(USER_ACTIONS_KEY, JSON.stringify(actions.slice(0, 20)));

  // debug
  console.log("User Actions:", actions);
}

export function getRecentActions() {
  return JSON.parse(localStorage.getItem(USER_ACTIONS_KEY)) || [];
}

export function getLastAccessedPage(currentPath) {
  const actions = getRecentActions();
  const lastPage = actions.find((action) => action.path !== currentPath);
  return lastPage ? lastPage.path : null;
}
