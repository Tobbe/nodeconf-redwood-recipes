import type { FindRecipeById, FindRecipeByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Recipe from 'src/components/Admin/Recipe/Recipe'

export const QUERY: TypedDocumentNode<
  FindRecipeById,
  FindRecipeByIdVariables
> = gql`
    query FindRecipeById($id: String!) {
      recipe: recipe(id: $id) {
        id
        name
        cuisine
        createdAt
        content
        imageUrl
        blurb
        categoryId
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Recipe not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindRecipeByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  recipe,
}: CellSuccessProps<FindRecipeById, FindRecipeByIdVariables>) => {
  return <Recipe recipe={recipe} />
}
