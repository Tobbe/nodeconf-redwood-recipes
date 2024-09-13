import type { FindRecipes, FindRecipesVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Recipes from 'src/components/Admin/Recipe/Recipes'

export const QUERY: TypedDocumentNode<FindRecipes, FindRecipesVariables> = gql`
  query FindRecipes {
    recipes {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No recipes yet.{' '}
      <Link to={routes.adminNewRecipe()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindRecipes>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  recipes,
}: CellSuccessProps<FindRecipes, FindRecipesVariables>) => {
  return <Recipes recipes={recipes} />
}
