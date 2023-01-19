export interface Comment {
  id: number,
  postId: number,
  nextId: number[] | null,
  prevId: number | null,
  rating: number,
  userName: string,
  email: string,
  homepage: string | null,
  text: string,
  voted: string[],
  createdAt: Date,
  updatedAt: Date
}
