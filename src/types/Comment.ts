export interface Comment {
  id: number,
  postId: number,
  nextIds: number[] | null,
  prevId: number | null,
  rating: number,
  userName: string,
  email: string,
  homepage: string | null,
  text: string,
  votes: string[],
  createdAt: Date,
  updatedAt: Date
}
