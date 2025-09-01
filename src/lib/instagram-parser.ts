import JSZip from 'jszip'
import { InstagramUser, FollowersData, FollowingData, ComparisonResult, CloseFriendsData, PendingFollowRequestsData, RecentFollowRequestsData, RecentlyUnfollowedData } from '../types/instagram'

export function parseFollowersData(followersData: FollowersData): InstagramUser[] {
  const allFollowers: InstagramUser[] = []
  
  // followers_1.json est un array direct
  followersData.forEach((entry) => {
    if (entry.string_list_data && entry.string_list_data.length > 0) {
      allFollowers.push(...entry.string_list_data)
    }
  })
  
  return allFollowers
}

export function parseFollowingData(followingData: FollowingData): InstagramUser[] {
  const allFollowing: InstagramUser[] = []
  
  if (followingData.relationships_following && Array.isArray(followingData.relationships_following)) {
    followingData.relationships_following.forEach((entry) => {
      if (entry.string_list_data) {
        allFollowing.push(...entry.string_list_data)
      }
    })
  }
  
  return allFollowing
}

export function parseCloseFriendsData(closeFriendsData: CloseFriendsData): InstagramUser[] {
  const allCloseFriends: InstagramUser[] = []
  
  if (closeFriendsData.relationships_close_friends && Array.isArray(closeFriendsData.relationships_close_friends)) {
    closeFriendsData.relationships_close_friends.forEach((entry) => {
      if (entry.string_list_data) {
        allCloseFriends.push(...entry.string_list_data)
      }
    })
  }
  
  return allCloseFriends
}

export function parsePendingFollowRequestsData(pendingData: PendingFollowRequestsData): InstagramUser[] {
  const allPending: InstagramUser[] = []
  
  if (pendingData.relationships_follow_requests_sent && Array.isArray(pendingData.relationships_follow_requests_sent)) {
    pendingData.relationships_follow_requests_sent.forEach((entry) => {
      if (entry.string_list_data) {
        allPending.push(...entry.string_list_data)
      }
    })
  }
  
  return allPending
}

export function parseRecentFollowRequestsData(recentData: RecentFollowRequestsData): InstagramUser[] {
  const allRecent: InstagramUser[] = []
  
  if (recentData.relationships_permanent_follow_requests && Array.isArray(recentData.relationships_permanent_follow_requests)) {
    recentData.relationships_permanent_follow_requests.forEach((entry) => {
      if (entry.string_list_data) {
        allRecent.push(...entry.string_list_data)
      }
    })
  }
  
  return allRecent
}

export function parseRecentlyUnfollowedData(unfollowedData: RecentlyUnfollowedData): InstagramUser[] {
  const allUnfollowed: InstagramUser[] = []
  
  if (unfollowedData.relationships_unfollowed_users && Array.isArray(unfollowedData.relationships_unfollowed_users)) {
    unfollowedData.relationships_unfollowed_users.forEach((entry) => {
      if (entry.string_list_data) {
        allUnfollowed.push(...entry.string_list_data)
      }
    })
  }
  
  return allUnfollowed
}

export function compareFollowData(followers: InstagramUser[], following: InstagramUser[]): ComparisonResult {
  const followersMap = new Map(followers.map(user => [user.value, user]))
  const followingMap = new Map(following.map(user => [user.value, user]))
  
  const mutualFollows: InstagramUser[] = []
  const youFollowButNotBack: InstagramUser[] = []
  const theyFollowButNotBack: InstagramUser[] = []
  
  following.forEach(user => {
    if (followersMap.has(user.value)) {
      mutualFollows.push(user)
    } else {
      youFollowButNotBack.push(user)
    }
  })
  
  followers.forEach(user => {
    if (!followingMap.has(user.value)) {
      theyFollowButNotBack.push(user)
    }
  })
  
  return {
    mutualFollows: mutualFollows.sort((a, b) => b.timestamp - a.timestamp),
    youFollowButNotBack: youFollowButNotBack.sort((a, b) => b.timestamp - a.timestamp),
    theyFollowButNotBack: theyFollowButNotBack.sort((a, b) => b.timestamp - a.timestamp),
    totalFollowers: followers.length,
    totalFollowing: following.length
  }
}

export async function processInstagramZip(file: File): Promise<ComparisonResult> {
  try {
    const zip = await JSZip.loadAsync(file)
    
    let followersData: FollowersData | null = null
    let followingData: FollowingData | null = null
    let closeFriendsData: CloseFriendsData | null = null
    let pendingFollowRequestsData: PendingFollowRequestsData | null = null
    let recentFollowRequestsData: RecentFollowRequestsData | null = null
    let recentlyUnfollowedData: RecentlyUnfollowedData | null = null
    
    const connectionsFolder = zip.folder('connections/followers_and_following')
    if (!connectionsFolder) {
      throw new Error('Invalid Instagram data: connections/followers_and_following folder not found')
    }
    
    // Parse required files
    const followersFile = connectionsFolder.file('followers_1.json')
    if (followersFile) {
      const content = await followersFile.async('string')
      followersData = JSON.parse(content)
    }
    
    const followingFile = connectionsFolder.file('following.json')
    if (followingFile) {
      const content = await followingFile.async('string')
      followingData = JSON.parse(content)
    }
    
    if (!followersData || !followingData) {
      throw new Error('Required Instagram data files not found (followers_1.json or following.json)')
    }
    
    // Parse optional additional files
    const closeFriendsFile = connectionsFolder.file('close_friends.json')
    if (closeFriendsFile) {
      try {
        const content = await closeFriendsFile.async('string')
        closeFriendsData = JSON.parse(content)
      } catch {
        console.log('Could not parse close_friends.json, skipping...')
      }
    }
    
    const pendingFile = connectionsFolder.file('pending_follow_requests.json')
    if (pendingFile) {
      try {
        const content = await pendingFile.async('string')
        pendingFollowRequestsData = JSON.parse(content)
      } catch {
        console.log('Could not parse pending_follow_requests.json, skipping...')
      }
    }
    
    const recentFile = connectionsFolder.file('recent_follow_requests.json')
    if (recentFile) {
      try {
        const content = await recentFile.async('string')
        recentFollowRequestsData = JSON.parse(content)
      } catch {
        console.log('Could not parse recent_follow_requests.json, skipping...')
      }
    }
    
    const unfollowedFile = connectionsFolder.file('recently_unfollowed_profiles.json')
    if (unfollowedFile) {
      try {
        const content = await unfollowedFile.async('string')
        recentlyUnfollowedData = JSON.parse(content)
      } catch {
        console.log('Could not parse recently_unfollowed_profiles.json, skipping...')
      }
    }
    
    const followers = parseFollowersData(followersData)
    const following = parseFollowingData(followingData)
    const result = compareFollowData(followers, following)
    
    // Add optional data if available
    if (closeFriendsData) {
      result.closeFriends = parseCloseFriendsData(closeFriendsData).sort((a, b) => b.timestamp - a.timestamp)
    }
    
    if (pendingFollowRequestsData) {
      result.pendingFollowRequests = parsePendingFollowRequestsData(pendingFollowRequestsData).sort((a, b) => b.timestamp - a.timestamp)
    }
    
    if (recentFollowRequestsData) {
      result.recentFollowRequests = parseRecentFollowRequestsData(recentFollowRequestsData).sort((a, b) => b.timestamp - a.timestamp)
    }
    
    if (recentlyUnfollowedData) {
      result.recentlyUnfollowed = parseRecentlyUnfollowedData(recentlyUnfollowedData).sort((a, b) => b.timestamp - a.timestamp)
    }
    
    return result
  } catch (error) {
    console.error('Error processing Instagram ZIP:', error)
    throw new Error(`Failed to process Instagram data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}