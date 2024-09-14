import type {
  CreateRecipeMutation,
  CreateRecipeInput,
  CreateRecipeMutationVariables,
  FindCategories,
  FindCategoriesVariables,
} from 'types/graphql'

import { Link, navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import RecipeForm from 'src/components/Admin/Recipe/RecipeForm'

export const QUERY: TypedDocumentNode<
  FindCategories,
  FindCategoriesVariables
> = gql`
  query FindCategories {
    categories {
      id
      name
    }
  }
`

const CREATE_RECIPE_MUTATION: TypedDocumentNode<
  CreateRecipeMutation,
  CreateRecipeMutationVariables
> = gql`
  mutation CreateRecipeMutation($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No categories yet. You need at least one category to create a new recipe.{' '}
      <Link to={routes.adminNewCategory()} className="rw-link">
        Create a category?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindCategories>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  categories,
}: CellSuccessProps<FindCategories, FindCategoriesVariables>) => {
  const [createRecipe, { loading, error }] = useMutation(
    CREATE_RECIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Recipe created')
        navigate(routes.adminRecipes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateRecipeInput) => {
    createRecipe({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Recipe</h2>
      </header>
      <div className="rw-segment-main">
        <RecipeForm
          categories={categories}
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
