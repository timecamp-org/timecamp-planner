// 'gravatar' package did mess with resulting url.
// TODO: remove this function and all usages after DB cleanup

const fixGravatarAvatarUrl = (avatarUrl: string): string =>
  avatarUrl.startsWith('//')
    ? `https:${avatarUrl}`
    : avatarUrl

export default fixGravatarAvatarUrl
