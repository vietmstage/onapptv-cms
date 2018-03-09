export const typeDefs = `
type CreateOnevideotypeInput {
  title: String,
  tags: [String],
  contentId: String,
  duration_in_seconds: Float,
  shortDescription: String,
  longDescription: String,
}

type ThumbnailObject {
  height: Float
  width: Float
  url: String
  name: String
  _id: ID
}
`;
