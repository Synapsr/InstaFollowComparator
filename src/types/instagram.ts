export interface InstagramUser {
  href: string
  value: string
  timestamp: number
}

export interface InstagramDataEntry {
  title: string
  media_list_data: unknown[]
  string_list_data: InstagramUser[]
}

export type FollowersData = InstagramDataEntry[]

export interface FollowingData {
  relationships_following: InstagramDataEntry[]
}

export interface CloseFriendsData {
  relationships_close_friends: InstagramDataEntry[]
}

export interface PendingFollowRequestsData {
  relationships_follow_requests_sent: InstagramDataEntry[]
}

export interface RecentFollowRequestsData {
  relationships_permanent_follow_requests: InstagramDataEntry[]
}

export interface RecentlyUnfollowedData {
  relationships_unfollowed_users: InstagramDataEntry[]
}

export interface ComparisonResult {
  mutualFollows: InstagramUser[]
  youFollowButNotBack: InstagramUser[]
  theyFollowButNotBack: InstagramUser[]
  totalFollowers: number
  totalFollowing: number
  // Additional data
  closeFriends?: InstagramUser[]
  pendingFollowRequests?: InstagramUser[]
  recentFollowRequests?: InstagramUser[]
  recentlyUnfollowed?: InstagramUser[]
}

export interface UploadStatus {
  isUploading: boolean
  progress: number
  message: string
  error?: string
}