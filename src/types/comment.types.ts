// Represents the comments table
export interface Comment {
  id: string
  designId: string
  userId: string
  parentId?: string
  content: string
  upvotes: number
  isFlagged: boolean
  flaggedReason?: string
  isDeleted: boolean
  deletedAt?: string
  deletedBy?: string
  createdAt: string
  updatedAt: string
}

// Represents the comment_votes table
export interface CommentVote {
  id: string
  commentId: string
  userId: string
  createdAt: string
}

export interface CreateCommentDto {
  designId: string
  content: string
  parentId?: string
}

export interface UpdateCommentDto {
  content: string
}
